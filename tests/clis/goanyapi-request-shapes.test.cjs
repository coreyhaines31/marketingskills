const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

const cli = path.resolve(__dirname, '../../tools/clis/goanyapi.js')

function run(args, dry = false, expectedStatus = 0, apiKey = 'fixture-key') {
  const source = `global.fetch = async (url, options) => ({ ok: true, status: 200, text: async () => JSON.stringify({ code: 'ok', data: { url: url.toString(), headers: options.headers } }) }); process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}, ...(${dry} ? ['--dry-run'] : [])]; require(${JSON.stringify(cli)});`
  const env = { ...process.env }
  if (apiKey === null) delete env.GOANYAPI_API_KEY
  else env.GOANYAPI_API_KEY = apiKey
  const result = spawnSync(process.execPath, ['-e', source], {
    encoding: 'utf8',
    env,
  })
  assert.equal(result.status, expectedStatus, result.stderr)
  return JSON.parse(result.stdout)
}

test('--help prints the command surface with no API key set', () => {
  for (const flag of ['--help', '-h', 'help']) {
    const help = run([flag], false, 0, null)
    assert.match(help.usage.serp, /serp google --query/)
    assert.match(help.usage.ads, /ads transparency/)
    assert.match(help.usage.options, /--dry-run/)
  }
})

test('--dry-run prints the request with no API key set', () => {
  const result = run(['domain', 'rating', '--domain', 'example.com'], true, 0, null)
  assert.equal(new URL(result.url).pathname, '/api/v1/dr')
  assert.equal(result.headers.Authorization, '***')
})

test('a real request without a key fails before the network', () => {
  assert.match(run(['account', 'credits'], false, 1, null).error, /GOANYAPI_API_KEY/)
})

test('SERP edition selects both the endpoint and its keyword parameter', () => {
  const stable = new URL(run(['serp', 'google', '--query', 'ai image']).data.url)
  assert.equal(stable.pathname, '/api/v1/serp-stable')
  assert.equal(stable.searchParams.get('query'), 'ai image')

  const standard = new URL(run(['serp', 'google', '--query', 'ai image', '--edition', 'standard']).data.url)
  assert.equal(standard.pathname, '/api/v1/serp-standard')
  assert.equal(standard.searchParams.get('q'), 'ai image')
  assert.equal(standard.searchParams.get('query'), null)

  const multi = new URL(run(['serp', 'google', '--query', 'ai image', '--edition', 'multi']).data.url)
  assert.equal(multi.pathname, '/api/v1/serp')
  assert.equal(multi.searchParams.get('q'), 'ai image')
})

test('the q alias fills the query parameter on the stable edition', () => {
  const url = new URL(run(['serp', 'google', '--q', 'crm software']).data.url)
  assert.equal(url.searchParams.get('query'), 'crm software')
})

test('locale flags pass through and unset flags stay out of the query', () => {
  const url = new URL(run(['serp', 'google', '--query', 'shoes', '--gl', 'de', '--hl', 'de', '--start', '10']).data.url)
  assert.equal(url.searchParams.get('gl'), 'de')
  assert.equal(url.searchParams.get('hl'), 'de')
  assert.equal(url.searchParams.get('start'), '10')
  assert.equal(url.searchParams.get('device'), null)
  assert.equal(url.searchParams.get('browser'), null)
})

test('keyword volume sends the exact term and hits the search-volume endpoint', () => {
  const url = new URL(run(['keywords', 'volume', '--keyword', 'ai image']).data.url)
  assert.equal(url.pathname, '/api/v1/keyword-search-volume')
  assert.equal(url.searchParams.get('keyword'), 'ai image')
})

test('keyword difficulty keeps the country selector', () => {
  const url = new URL(run(['keywords', 'difficulty', '--keyword', 'ai', '--country', 'us']).data.url)
  assert.equal(url.pathname, '/api/v1/keyword-difficulty')
  assert.equal(url.searchParams.get('country'), 'us')
})

test('domain rating hits /dr with only the domain', () => {
  const url = new URL(run(['domain', 'rating', '--domain', 'example.com']).data.url)
  assert.equal(url.pathname, '/api/v1/dr')
  assert.deepEqual([...url.searchParams.keys()], ['domain'])
})

test('DR history only sends includeDr when explicitly set', () => {
  assert.equal(new URL(run(['domain', 'rating-history', '--domain', 'example.com']).data.url).searchParams.get('includeDr'), null)
  assert.equal(new URL(run(['domain', 'rating-history', '--domain', 'example.com', '--include-dr', 'false']).data.url).searchParams.get('includeDr'), 'false')
})

test('autocomplete routes to the requested engine', () => {
  const url = new URL(run(['keywords', 'autocomplete', '--engine', 'youtube', '--q', 'seo tips', '--hl', 'en']).data.url)
  assert.equal(url.pathname, '/api/v1/youtube-autocomplete')
  assert.equal(url.searchParams.get('q'), 'seo tips')
  assert.match(run(['keywords', 'autocomplete', '--engine', 'altavista', '--q', 'x'], false, 1).error, /--engine/)
})

test('missing or valueless required flags fail before any request', () => {
  assert.match(run(['keywords', 'volume'], false, 1).error, /keyword/)
  assert.match(run(['domain', 'rating', '--domain'], false, 1).error, /--domain requires a value/)
  assert.match(run(['serp', 'google', '--query', 'shoes', '--start', '1.5'], false, 1).error, /--start/)
})

test('credits balance needs no parameters and dry run masks the key', () => {
  const result = run(['account', 'credits'], true)
  assert.equal(new URL(result.url).pathname, '/api/v1/credits/balance')
  assert.equal(result.headers.Authorization, '***')
})
