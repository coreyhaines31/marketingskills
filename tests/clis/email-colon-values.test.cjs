const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
function run(vendor, args, fetch = true) {
  const cli = path.resolve(__dirname, `../../tools/clis/${vendor}.js`)
  const source = `global.fetch = async (url, options) => {
    if (!${fetch}) throw new Error('Unexpected network request');
    return { ok: true, status: 200, text: async () => JSON.stringify({ url, method: options.method, body: options.body ? JSON.parse(options.body) : null }) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', timeout: 5000, env: {
    ...process.env, REWARDFUL_API_KEY: 'fake-key', RESEND_API_KEY: 'fake-key', POSTMARK_API_KEY: 'fake-key', BEEHIIV_API_KEY: 'fake-key', KLAVIYO_API_KEY: 'fake-key',
  } })
}
function output(result) { assert.equal(result.status, 0, result.stderr); return JSON.parse(result.stdout) }

const values = { reset_url: 'https://example.com/reset:443/token?next=https://example.com', at: '10:30:00', name: 'Zoë' }
test('Postmark template model keeps URL and timestamp values after the first colon', () => {
  const result = output(run('postmark', ['email', 'send-template', '--from', 'sender@example.com', '--to', 'recipient@example.com', '--template', 'welcome', '--model', Object.entries(values).map(([k,v]) => `${k}:${v}`).join(',')]))
  assert.deepEqual(result.body.TemplateModel, values)
  assert.equal(result.body.TemplateAlias, 'welcome')
})
test('Klaviyo custom event properties keep colon-containing values', () => {
  const result = output(run('klaviyo', ['events', 'create', '--metric', 'Reset Password', '--email', 'member@example.com', '--property', Object.entries(values).map(([k,v]) => `${k}:${v}`).join(',')]))
  assert.deepEqual(result.body.data.attributes.properties, values)
})
test('ordinary key/value pairs and malformed entries retain existing behavior', () => {
  const result = output(run('postmark', ['email', 'send-template', '--from', 'sender@example.com', '--to', 'recipient@example.com', '--template', '123', '--model', 'name:Jane,missing,:emptykey,empty:']))
  assert.deepEqual(result.body.TemplateModel, { name: 'Jane' })
  assert.equal(result.body.TemplateId, 123)
})
test('template model dry run preserves URL payload without fetching or credentials', () => {
  const result = output(run('postmark', ['email', 'send-template', '--from', 'sender@example.com', '--to', 'recipient@example.com', '--template', 'welcome', '--model', 'reset_url:https://example.com/reset', '--dry-run'], false))
  assert.equal(result.body.TemplateModel.reset_url, 'https://example.com/reset')
  assert.equal(result.headers['X-Postmark-Server-Token'], '***')
  assert.equal(JSON.stringify(result).includes('fake-key'), false)
})
