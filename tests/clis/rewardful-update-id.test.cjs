const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
function run(vendor, args, fetch = true) {
  const cli = path.resolve(__dirname, `../../tools/clis/${vendor}.js`)
  const source = `global.fetch = async (url, options) => {
    if (!${fetch}) throw new Error('Unexpected network request');
    return { status: 200, text: async () => JSON.stringify({ url, method: options.method, body: options.body ? Object.fromEntries(new URLSearchParams(options.body)) : null }) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', timeout: 5000, env: {
    ...process.env, REWARDFUL_API_KEY: 'fake-key', RESEND_API_KEY: 'fake-key', POSTMARK_API_KEY: 'fake-key', BEEHIIV_API_KEY: 'fake-key', KLAVIYO_API_KEY: 'fake-key',
  } })
}
function output(result) { assert.equal(result.status, 0, result.stderr); return JSON.parse(result.stdout) }

test('positional affiliate selects the update route and payout data', () => {
  const result = output(run('rewardful', ['affiliates', 'update', 'affiliate123', '--paypal-email', 'payee@example.com']))
  assert.equal(result.url, 'https://api.getrewardful.com/v1/affiliates/affiliate123')
  assert.equal(result.method, 'PUT')
  assert.deepEqual(result.body, { paypal_email: 'payee@example.com' })
})
test('documented id flag also selects the affiliate', () => {
  const result = output(run('rewardful', ['affiliates', 'update', '--id', 'affiliate123', '--first-name', 'Zoë']))
  assert.equal(result.url.endsWith('/affiliates/affiliate123'), true)
  assert.deepEqual(result.body, { first_name: 'Zoë' })
})
test('conflicting identifiers cannot silently update another affiliate', () => {
  assert.match(output(run('rewardful', ['affiliates', 'update', 'affiliate123', '--id', 'other456', '--first-name', 'Zoë'], false)).error, /must match/)
})
test('missing identifier stops before fetching', () => {
  assert.match(output(run('rewardful', ['affiliates', 'update', '--first-name', 'Zoë'], false)).error, /Affiliate ID/)
})
test('update dry run uses the selected affiliate with masked authorization', () => {
  const result = output(run('rewardful', ['affiliates', 'update', 'affiliate123', '--first-name', 'Zoë', '--dry-run'], false))
  assert.equal(result.url.endsWith('/affiliates/affiliate123'), true)
  assert.equal(result.headers.Authorization, '***')
  assert.equal(JSON.stringify(result).includes('fake-key'), false)
})
