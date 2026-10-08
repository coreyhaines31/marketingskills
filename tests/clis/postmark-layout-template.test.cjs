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

test('a layout creation request omits the API-forbidden Subject field', () => {
  const result = output(run('postmark', ['templates', 'create', '--name', 'Layout', '--type', 'Layout', '--html', '<div>{{{ @content }}}</div>']))
  assert.equal(result.method, 'POST')
  assert.equal(result.url, 'https://api.postmarkapp.com/templates')
  assert.equal(result.body.TemplateType, 'Layout')
  assert.equal(Object.hasOwn(result.body, 'Subject'), false)
  assert.equal(result.body.HtmlBody, '<div>{{{ @content }}}</div>')
})
test('a subject for a layout stops before the provider rejects it', () => {
  assert.match(output(run('postmark', ['templates', 'create', '--name', 'Layout', '--type', 'Layout', '--subject', 'Invalid', '--html', '{{{ @content }}}'], false)).error, /subject.*Layout/i)
})
test('standard templates retain their required Subject and explicit type', () => {
  const result = output(run('postmark', ['templates', 'create', '--name', 'Standard', '--type', 'Standard', '--subject', 'Receipt', '--text', 'Hello']))
  assert.equal(result.body.Subject, 'Receipt')
  assert.equal(result.body.TemplateType, 'Standard')
})
test('the default standard template request remains compatible', () => {
  const result = output(run('postmark', ['templates', 'create', '--name', 'Standard', '--subject', 'Receipt', '--text', 'Hello']))
  assert.equal(result.body.Subject, 'Receipt')
  assert.equal(Object.hasOwn(result.body, 'TemplateType'), false)
})
test('layout dry run reflects the provider contract and masks the server token', () => {
  const result = output(run('postmark', ['templates', 'create', '--name', 'Layout', '--type', 'Layout', '--text', '{{{ @content }}}', '--dry-run'], false))
  assert.equal(Object.hasOwn(result.body, 'Subject'), false)
  assert.equal(result.headers['X-Postmark-Server-Token'], '***')
})
