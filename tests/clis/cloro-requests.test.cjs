const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

const cli = path.resolve(__dirname, '../../tools/clis/cloro.js')
// The stub echoes the request so tests can check URL, headers and body. A reply can be forced per test.
function run(args, { reply, status = 200, network = true, key = 'fixture-secret' } = {}) {
  const source = `global.fetch = async (url, options) => {
    if (!${network}) throw new Error('Unexpected network request');
    const echo = { url, method: options.method, auth: options.headers.Authorization, body: options.body ? JSON.parse(options.body) : undefined };
    return new Response(JSON.stringify(${JSON.stringify(reply ?? null)} ?? echo), { status: ${status} });
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const env = { PATH: process.env.PATH }
  if (key) env.CLORO_API_KEY = key
  return spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', timeout: 10000, env })
}
function output(result, status = 0) {
  assert.equal(result.status, status, result.stderr)
  return JSON.parse(result.stdout)
}

test('ask sends the prompt and country to each AI engine with a bearer key', () => {
  for (const [engine, route] of [['chatgpt', 'chatgpt'], ['aimode', 'aimode'], ['bing_aimode', 'bing/aimode'], ['gemini', 'gemini']]) {
    const result = output(run(['ask', engine, '--prompt', 'best crm', '--country', 'de']))
    assert.equal(result.url, `https://api.cloro.dev/v1/monitor/${route}`)
    assert.equal(result.method, 'POST')
    assert.equal(result.auth, 'Bearer fixture-secret')
    assert.deepEqual(result.body, { prompt: 'best crm', country: 'DE' })
  }
})

test('markdown and AI Overview flags add the include object', () => {
  assert.deepEqual(output(run(['ask', 'chatgpt', '--prompt', 'q', '--markdown'])).body, { prompt: 'q', country: 'US', include: { markdown: true } })
  const serp = output(run(['serp', 'google', '--query', 'best crm', '--aio']))
  assert.equal(serp.url, 'https://api.cloro.dev/v1/monitor/google')
  assert.deepEqual(serp.body, { query: 'best crm', country: 'US', include: { aioverview: true } })
  assert.deepEqual(output(run(['serp', 'google', '--query', 'best crm'])).body, { query: 'best crm', country: 'US' })
})

test('countries and credits use GET routes', () => {
  const countries = output(run(['countries', '--model', 'gemini']))
  assert.equal(countries.url, 'https://api.cloro.dev/v1/countries?model=gemini')
  assert.equal(countries.method, 'GET')
  assert.equal(output(run(['countries', '--model', 'bing_aimode'])).url, 'https://api.cloro.dev/v1/countries?model=bing_aimode')
  assert.equal(output(run(['credits'])).url, 'https://api.cloro.dev/v1/credits')
})

test('invalid input fails before a billed request', () => {
  for (const args of [
    ['ask', 'chatgpt'],
    ['ask', 'chatgpt', '--prompt'],
    ['ask', 'unknown', '--prompt', 'q'],
    ['ask', 'chatgpt', '--prompt', 'q', '--country', 'USA'],
    ['serp', 'google'],
    ['serp', 'bing', '--query', 'q'],
    ['countries', '--model', 'other'],
  ]) {
    const result = run(args, { network: false })
    assert.equal(result.status, 1, args.join(' '))
    assert.doesNotMatch(result.stderr, /Unexpected network/)
  }
})

test('an API error envelope or HTTP failure exits 1 and keeps the payload', () => {
  const reply = { success: false, error: { code: 'INVALID_API_KEY_FORMAT', message: 'Invalid API key format' } }
  assert.deepEqual(output(run(['credits'], { reply, status: 401 }), 1), reply)
  const credits = { success: false, error: { code: 'INSUFFICIENT_CREDITS', message: 'No credits' } }
  assert.deepEqual(output(run(['ask', 'gemini', '--prompt', 'q'], { reply: credits, status: 403 }), 1), credits)
})

test('a missing key fails, but help and dry runs work without one and hide auth', () => {
  const missing = run(['credits'], { key: null, network: false })
  assert.equal(missing.status, 1)
  assert.match(missing.stderr, /CLORO_API_KEY/)
  const help = output(run([], { key: null, network: false }))
  assert.ok(help.usage)
  const dry = output(run(['serp', 'google', '--query', 'q', '--aio', '--dry-run'], { network: false }))
  assert.equal(dry._dry_run, true)
  assert.equal(dry.headers.Authorization, '***')
  assert.equal(JSON.stringify(dry).includes('fixture-secret'), false)
  assert.equal(output(run(['credits', '--dry-run'], { key: null, network: false }))._dry_run, true)
})
