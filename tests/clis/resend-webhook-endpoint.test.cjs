const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
function run(vendor, args, fetch = true) {
  const cli = path.resolve(__dirname, `../../tools/clis/${vendor}.js`)
  const source = `global.fetch = async (url, options) => {
    if (!${fetch}) throw new Error('Unexpected network request');
    return { status: 200, text: async () => JSON.stringify({ url, method: options.method, body: options.body ? JSON.parse(options.body) : null }) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', timeout: 5000, env: {
    ...process.env, REWARDFUL_API_KEY: 'fake-key', RESEND_API_KEY: 'fake-key', POSTMARK_API_KEY: 'fake-key', BEEHIIV_API_KEY: 'fake-key', KLAVIYO_API_KEY: 'fake-key',
  } })
}
function output(result, expectedStatus = 0) { assert.equal(result.status, expectedStatus, result.stderr); return JSON.parse(result.stdout) }

test('the documented endpoint flag posts the provider-required field', () => {
  const result = output(run('resend', ['webhooks', 'create', '--endpoint', 'https://example.com/events', '--events', 'email.sent,email.bounced']))
  assert.equal(result.url, 'https://api.resend.com/webhooks')
  assert.equal(result.method, 'POST')
  assert.deepEqual(result.body, { endpoint: 'https://example.com/events', events: ['email.sent', 'email.bounced'] })
})
test('the existing url flag remains a compatible alias with correct API field', () => {
  const result = output(run('resend', ['webhooks', 'create', '--url', 'https://example.com/events']))
  assert.deepEqual(result.body, { endpoint: 'https://example.com/events', events: ['email.sent', 'email.delivered', 'email.bounced'] })
})
test('missing callback stops before any request', () => {
  assert.match(output(run('resend', ['webhooks', 'create'], false), 1).error, /endpoint/)
})
test('webhook dry run sends no request and masks authentication', () => {
  const result = output(run('resend', ['webhooks', 'create', '--endpoint', 'https://example.com/events', '--dry-run'], false))
  assert.equal(result.body.endpoint, 'https://example.com/events')
  assert.equal(result.headers.Authorization, '***')
  assert.equal(JSON.stringify(result).includes('fake-key'), false)
})
test('webhook listing remains a bodyless GET', () => {
  const result = output(run('resend', ['webhooks', 'list']))
  assert.equal(result.method, 'GET')
  assert.equal(result.body, null)
})
