const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/lemlist.js')
function run(args, network = false) {
  const code = `global.fetch = async (url, options) => {
    if (!${network}) throw new Error('Unexpected request');
    const body = options.body ? JSON.parse(options.body) : null;
    return {status: 200, text: async () => JSON.stringify({url, method: options.method, body, subscribedType: body?.type || 'all'})};
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const r = spawnSync(process.execPath, ['-e', code], {encoding: 'utf8', timeout: 5000, env: {...process.env, LEMLIST_API_KEY: 'test-only-key'}})
  assert.equal(r.status, 0, r.stderr)
  return JSON.parse(r.stdout)
}
test('documented webhook command sends the requested event as the API type', () => {
  const result = run(['hooks', 'create', '--target-url', 'https://example.com/hook', '--event', 'emailsOpened'], true)
  assert.equal(result.url, 'https://api.lemlist.com/api/hooks')
  assert.equal(result.method, 'POST')
  assert.deepEqual(result.body, {targetUrl: 'https://example.com/hook', type: 'emailsOpened'})
  assert.equal(result.subscribedType, 'emailsOpened')
})
test('webhook preview shows the same event filter without making a request', () => {
  const result = run(['hooks', 'create', '--target-url', 'https://example.com/hook', '--event', 'emailsReplied', '--dry-run'])
  assert.deepEqual(result.body, {targetUrl: 'https://example.com/hook', type: 'emailsReplied'})
  assert.equal(result.headers.Authorization, '***')
})
test('incomplete webhook creation still stops before a request', () => {
  assert.match(run(['hooks', 'create', '--target-url', 'https://example.com/hook']).error, /event required/)
  assert.match(run(['hooks', 'create', '--event', 'emailsOpened']).error, /target-url required/)
})
test('existing webhook list and delete methods are unchanged', () => {
  assert.equal(run(['hooks', 'list'], true).method, 'GET')
  const result = run(['hooks', 'delete', '--id', 'hook123'], true)
  assert.equal(result.method, 'DELETE')
  assert.equal(result.url, 'https://api.lemlist.com/api/hooks/hook123')
})
