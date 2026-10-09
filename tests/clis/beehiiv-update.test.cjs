const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

function run(args, dryRun = false) {
  const cli = path.resolve(__dirname, '../../tools/clis/beehiiv.js')
  const source = `global.fetch = async (url, options) => {
    if (${dryRun}) throw new Error('Unexpected network request');
    const request = { url: String(url), method: options.method, body: options.body ? JSON.parse(options.body) : null };
    return { status: 200, text: async () => JSON.stringify(request) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const result = spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', timeout: 5000, env: {
    ...process.env, BEEHIIV_API_KEY: 'fixture-secret'
  } })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}

test('subscription tier update uses the documented PATCH request', () => {
  const result = run(['subscriptions', 'update', '--publication', 'pub_123', '--id', 'sub_456', '--tier', 'premium'])
  assert.equal(result.method, 'PATCH')
  assert.equal(result.url, 'https://api.beehiiv.com/v2/publications/pub_123/subscriptions/sub_456')
  assert.deepEqual(result.body, { tier: 'premium' })
})
test('the free tier and publication alias use the same update contract', () => {
  assert.deepEqual(run(['subscriptions', 'update', '--pub', 'pub_123', '--id', 'sub_456', '--tier', 'free']).body, { tier: 'free' })
})
test('subscription creation retains POST', () => {
  assert.equal(run(['subscriptions', 'create', '--publication', 'pub_123', '--email', 'reader@example.com']).method, 'POST')
})
test('update dry run masks auth and previews PATCH without fetching', () => {
  const result = run(['subscriptions', 'update', '--publication', 'pub_123', '--id', 'sub_456', '--tier', 'premium', '--dry-run'], true)
  assert.equal(result.method, 'PATCH')
  assert.equal(result.headers.Authorization, '***')
})
