const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

const cli = path.resolve(__dirname, '../../tools/clis/searchapi.js')
// The stub echoes the request so tests can check URL, method and headers. A reply can be forced per test.
function run(args, { reply, status = 200, network = true, key = 'fixture-secret' } = {}) {
  const source = `global.fetch = async (url, options) => {
    if (!${network}) throw new Error('Unexpected network request');
    const echo = { url: String(url), method: options.method, auth: options.headers.Authorization, agent: options.headers['User-Agent'], body: options.body };
    return new Response(JSON.stringify(${JSON.stringify(reply ?? null)} ?? echo), { status: ${status} });
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const env = { PATH: process.env.PATH }
  if (key) env.SEARCHAPI_API_KEY = key
  return spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', timeout: 10000, env })
}
function output(result, status = 0) {
  assert.equal(result.status, status, result.stderr)
  return JSON.parse(result.stdout)
}
function params(url) {
  const parsed = new URL(url)
  return { path: parsed.origin + parsed.pathname, query: Object.fromEntries(parsed.searchParams) }
}

test('search sends a GET to /search with the google engine, the query and a bearer key', () => {
  const result = output(run(['search', 'email', 'marketing', 'software']))
  assert.equal(result.method, 'GET')
  assert.equal(result.auth, 'Bearer fixture-secret')
  assert.equal(result.agent, 'marketingskills/searchapi-cli')
  assert.equal(result.body, undefined)
  const { path: endpoint, query } = params(result.url)
  assert.equal(endpoint, 'https://www.searchapi.io/api/v1/search')
  assert.deepEqual(query, { engine: 'google', q: 'email marketing software' })
})

test('search forwards locale, paging and SERP filters under their documented names', () => {
  const result = output(run(['search', '--query', 'best crm', '--country', 'DE', '--language', 'de', '--location', 'Berlin, Germany', '--num', '10', '--page', '2', '--time', 'last_month', '--device', 'mobile', '--safe', 'active']))
  assert.deepEqual(params(result.url).query, { engine: 'google', q: 'best crm', gl: 'de', hl: 'de', location: 'Berlin, Germany', num: '10', page: '2', time_period: 'last_month', device: 'mobile', safe: 'active' })
  assert.deepEqual(params(output(run(['search', 'q', '--engine', 'bing'])).url).query, { engine: 'bing', q: 'q' })
})

test('news and shopping pin their engines and shopping forwards a price range', () => {
  const news = params(output(run(['news', 'crm pricing', '--time', 'last_week', '--num', '5'])).url).query
  assert.deepEqual(news, { engine: 'google_news', q: 'crm pricing', time_period: 'last_week', num: '5' })
  const shopping = params(output(run(['shopping', 'standing desk', '--country', 'us', '--min-price', '200', '--max-price', '499.99', '--page', '2'])).url).query
  assert.deepEqual(shopping, { engine: 'google_shopping', q: 'standing desk', gl: 'us', price_min: '200', price_max: '499.99', page: '2' })
})

test('account reads the free /me route', () => {
  const result = output(run(['account']))
  assert.equal(result.method, 'GET')
  assert.equal(result.url, 'https://www.searchapi.io/api/v1/me')
})

test('invalid input fails before a billed request', () => {
  for (const args of [
    ['search'],
    ['search', '--query'],
    ['search', 'q', '--num', '0'],
    ['search', 'q', '--num', '11'],
    ['search', 'q', '--num', '2.5'],
    ['search', 'q', '--page', '0'],
    ['search', 'q', '--country', 'USA'],
    ['search', 'q', '--language', 'english'],
    ['search', 'q', '--time', 'yesterday'],
    ['search', 'q', '--device', 'tv'],
    ['search', 'q', '--safe', 'maybe'],
    ['search', 'q', '--engine', 'Google Web'],
    ['news', 'q', '--time', 'last_decade'],
    ['shopping', 'q', '--num', '3'],
    ['shopping', 'q', '--min-price', 'cheap'],
    ['account', '--timeout-ms', 'soon'],
    ['account', '--timeout-ms', '0'],
    ['serp', 'q'],
  ]) {
    const result = run(args, { network: false })
    assert.equal(result.status, 1, args.join(' '))
    assert.doesNotMatch(result.stderr, /Unexpected network/)
  }
})

test('an API error or an empty Google answer exits 1 and keeps the payload', () => {
  const unauthorized = { error: 'Invalid API key.' }
  assert.deepEqual(output(run(['account'], { reply: unauthorized, status: 401 }), 1), unauthorized)
  const empty = { search_metadata: { id: 'search_x', status: 'Success' }, search_parameters: { engine: 'google', q: 'zqxjv' }, error: "Google didn't return any results." }
  assert.deepEqual(output(run(['search', 'zqxjv'], { reply: empty, status: 200 }), 1), empty)
  const bad = { error: 'Unsupported engine: nope' }
  assert.deepEqual(output(run(['search', 'q', '--engine', 'nope'], { reply: bad, status: 400 }), 1), bad)
})

test('a missing key fails, but help and dry runs work without one and hide auth', () => {
  const missing = run(['account'], { key: null, network: false })
  assert.equal(missing.status, 1)
  assert.match(missing.stderr, /SEARCHAPI_API_KEY/)
  const help = output(run([], { key: null, network: false }))
  assert.ok(help.usage.search)
  const dry = output(run(['search', 'best crm', '--country', 'us', '--dry-run'], { network: false }))
  assert.equal(dry._dry_run, true)
  assert.equal(dry.method, 'GET')
  assert.equal(dry.headers.Authorization, '***')
  assert.deepEqual(params(dry.url).query, { engine: 'google', q: 'best crm', gl: 'us' })
  assert.equal(JSON.stringify(dry).includes('fixture-secret'), false)
  assert.equal(output(run(['account', '--dry-run'], { key: null, network: false }))._dry_run, true)
})
