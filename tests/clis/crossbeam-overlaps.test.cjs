const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/crossbeam.js')
function run(args, network = false) {
  const code = `global.fetch = async (url, options) => {
    if (!${network}) throw new Error('Unexpected request');
    return new Response(JSON.stringify({url, method: options.method}));
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const r = spawnSync(process.execPath, ['-e', code], {encoding: 'utf8', timeout: 5000, env: {...process.env, CROSSBEAM_API_KEY: 'test-only-token'}})
  assert.equal(r.status, 0, r.stderr)
  return JSON.parse(r.stdout)
}
test('default overlap list uses accounts and the documented own-population/partner filters', () => {
  const result = run(['overlaps', 'list', '--partner-id', '42', '--population-id', '7'], true)
  const url = new URL(result.url)
  assert.equal(url.pathname, '/v1/overlaps/accounts')
  assert.equal(url.searchParams.get('partner-id'), '42')
  assert.deepEqual(url.searchParams.getAll('population-ids[]'), ['7'])
  assert.equal(url.searchParams.has('partner_id'), false)
})
test('lead overlap pages preserve cursor and limit without changing record kind', () => {
  const result = run(['overlaps', 'list', '--type', 'leads', '--cursor', 'a+/=cursor', '--limit', '100'], true)
  const url = new URL(result.url)
  assert.equal(url.pathname, '/v1/overlaps/leads')
  assert.equal(url.searchParams.get('cursor'), 'a+/=cursor')
  assert.equal(url.searchParams.get('limit'), '100')
})
test('record lookup uses the exact-match search route and partner-population namespace', () => {
  const result = run(['overlaps', 'get', '--record-id', 'crm/123+tag', '--partner-id', '42', '--partner-population-id', '9'], true)
  const url = new URL(result.url)
  assert.equal(url.pathname, '/v1/overlaps/accounts/search')
  assert.equal(url.searchParams.get('record_id'), 'crm/123+tag')
  assert.equal(url.searchParams.get('partner-id'), '42')
  assert.equal(url.searchParams.get('partner-population-ids[]'), '9')
  assert.equal(url.searchParams.has('population-ids[]'), false)
})
test('legacy id flag remains a source-record alias on lead lookups', () => {
  const result = run(['overlaps', 'get', '--id', 'crm123', '--type', 'leads'], true)
  const url = new URL(result.url)
  assert.equal(url.pathname, '/v1/overlaps/leads/search')
  assert.equal(url.searchParams.get('record_id'), 'crm123')
})
test('unsupported record kind and missing source record stop before fetch', () => {
  assert.match(run(['overlaps', 'list', '--type', 'contacts']).error, /type/)
  assert.match(run(['overlaps', 'get']).error, /record-id/)
})
test('overlap preview uses the same typed endpoint and masks the access token', () => {
  const result = run(['overlaps', 'list', '--type', 'leads', '--dry-run'])
  assert.equal(new URL(result.url).pathname, '/v1/overlaps/leads')
  assert.equal(result.headers.Authorization, 'Bearer ***')
})
