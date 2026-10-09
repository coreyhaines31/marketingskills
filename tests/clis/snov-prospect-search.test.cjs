const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/snov.js')
function run(args, oracle = '') {
  const script = `global.fetch = async (url, options) => {
    if (url.endsWith('/oauth/access_token')) return new Response(JSON.stringify({ access_token: 'fixture-access-token' }))
    const assert = require('node:assert/strict'); const parsed = new URL(url);
    const body = options.body ? JSON.parse(options.body) : null;
    ${oracle}
    return new Response(JSON.stringify({ accepted: true, url, body }))
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)})`
  return spawnSync(process.execPath, ['-e', script], {encoding: 'utf8', timeout: 10000, env: {...process.env, SNOV_CLIENT_ID: 'fixture-client', SNOV_CLIENT_SECRET: 'fixture-secret'}})
}
for (const email of ['john@example.com', 'jane+campaign@example.com']) test(`prospect find uses the plural resource for ${email}`, () => {
  const result = run(['prospect', 'find', '--email', email], `assert.equal(parsed.pathname, '/v1/get-prospects-by-email'); assert.equal(options.method, 'POST'); assert.equal(options.headers.Authorization, 'Bearer fixture-access-token'); assert.deepEqual(body, {email:${JSON.stringify(email)}});`)
  assert.equal(result.status, 0, result.stderr)
  assert.equal(JSON.parse(result.stdout).accepted, true)
})
test('preview uses the same resource without requesting a token', () => {
  const result = run(['prospect', 'find', '--email', 'john@example.com', '--dry-run'], "throw new Error('unexpected fetch')")
  assert.equal(result.status, 0, result.stderr)
  const preview = JSON.parse(result.stdout)
  assert.equal(preview.url, 'https://api.snov.io/v1/get-prospects-by-email')
  assert.deepEqual(preview.body, {email: 'john@example.com'})
  assert.equal(preview.headers.Authorization, '***')
})
test('missing email does not obtain a token or send a request', () => {
  const result = run(['prospect', 'find'], "throw new Error('unexpected fetch')")
  assert.equal(result.status, 0, result.stderr)
  assert.match(JSON.parse(result.stdout).error, /--email required/)
})
test('unrelated list route still authenticates and uses GET', () => {
  const result = run(['lists', 'list'], "assert.equal(parsed.pathname, '/v1/get-user-lists'); assert.equal(options.method, 'GET'); assert.equal(body, null);")
  assert.equal(result.status, 0, result.stderr)
  assert.equal(JSON.parse(result.stdout).accepted, true)
})
