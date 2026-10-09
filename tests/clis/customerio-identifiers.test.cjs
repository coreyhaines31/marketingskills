const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

function run(args, dryRun = false) {
  const cli = path.resolve(__dirname, '../../tools/clis/customer-io.js')
  const source = `global.fetch = async (url, options) => {
    if (${dryRun}) throw new Error('Unexpected network request');
    const request = { url: String(url), method: options.method, body: options.body ? JSON.parse(options.body) : null };
    return { status: 200, text: async () => JSON.stringify(request) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const result = spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', timeout: 5000, env: {
    ...process.env, CUSTOMERIO_SITE_ID: 'fixture-site', CUSTOMERIO_API_KEY: 'fixture-track-key', CUSTOMERIO_APP_KEY: 'fixture-app-key'
  } })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}

const identifier = 'team/a+b@example.com?workspace=1#profile%20'
const unicodeIdentifier = 'café/東京 +user\n#details'
for (const [action, method, suffix, flags] of [
  ['identify', 'PUT', '', ['--email', 'a@example.com']],
  ['get', 'GET', '/attributes', []],
  ['delete', 'DELETE', '', []],
  ['track-event', 'POST', '/events', ['--name', 'signed_up']],
]) {
  for (const selectedId of [identifier, unicodeIdentifier]) {
  test(`customer ${action} encodes ${JSON.stringify(selectedId)} as one path segment`, () => {
    const result = run(['customers', action, selectedId, ...flags])
    const url = new URL(result.url)
    const base = action === 'get' ? '/v1' : '/api/v1'
    assert.equal(url.pathname, `${base}/customers/${encodeURIComponent(selectedId)}${suffix}`)
    assert.equal(url.search, '')
    assert.equal(url.hash, '')
    assert.equal(result.method, method)
  })
  }
}
test('the --id form preserves literal percent sequences without pre-decoding', () => {
  const result = run(['customers', 'delete', '--id', 'customer%2Fid'])
  assert.equal(new URL(result.url).pathname, '/api/v1/customers/customer%252Fid')
})
test('ordinary customer identifiers remain compatible', () => {
  assert.equal(run(['customers', 'get', 'customer_123']).url, 'https://api.customer.io/v1/customers/customer_123/attributes')
})
test('dry run uses the encoded identifier and masks Track auth', () => {
  const result = run(['customers', 'identify', identifier, '--dry-run'], true)
  assert.equal(new URL(result.url).pathname, `/api/v1/customers/${encodeURIComponent(identifier)}`)
  assert.equal(result.headers.Authorization, '***')
})
