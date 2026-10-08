const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/demio.js')
function run(args, network = false) {
  const code = `global.fetch = async (url, options) => {
    if (!${network}) throw new Error('Unexpected request');
    const found = new URL(url).pathname === '/api/v1/report/1575/participants';
    return {status: found ? 200 : 404, text: async () => JSON.stringify({url, method: options.method, headers: options.headers, status: found ? 200 : 404})};
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const r = spawnSync(process.execPath, ['-e', code], {encoding: 'utf8', timeout: 5000, env: {...process.env, DEMIO_API_KEY: 'test-key', DEMIO_API_SECRET: 'test-secret'}})
  assert.equal(r.status, 0, r.stderr)
  return JSON.parse(r.stdout)
}
test('participant lookup reaches the documented event-date report endpoint', () => {
  const result = run(['participants', 'list', '--date-id', '1575'], true)
  assert.equal(result.status, 200)
  assert.equal(result.url, 'https://my.demio.com/api/v1/report/1575/participants')
  assert.equal(result.method, 'GET')
  assert.equal(result.headers['Api-Key'], 'test-key')
  assert.equal(result.headers['Api-Secret'], 'test-secret')
})
test('participant preview uses the same report route and masks both credentials', () => {
  const result = run(['participants', 'list', '--date-id', '1575', '--dry-run'])
  assert.equal(result.url, 'https://my.demio.com/api/v1/report/1575/participants')
  assert.equal(result.headers['Api-Key'], '***')
  assert.equal(result.headers['Api-Secret'], '***')
})
test('a missing event-date identifier stops before making a request', () => {
  assert.match(run(['participants', 'list']).error, /date-id required/)
})
test('event-date details retain their separate event resource route', () => {
  const result = run(['events', 'date', '--event-id', '86', '--date-id', '1575', '--dry-run'])
  assert.equal(result.url, 'https://my.demio.com/api/v1/event/86/date/1575')
})
