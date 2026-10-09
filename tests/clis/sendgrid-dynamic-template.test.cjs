const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/sendgrid.js')
function run(args, fetch = false, expectedStatus = 0) {
  const source = `global.fetch = async (url, options) => {
    if (!${fetch}) throw new Error('Unexpected network request');
    return { status: 200, text: async () => JSON.stringify({ url, method: options.method, body: options.body ? JSON.parse(options.body) : null }) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const result = spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', env: { ...process.env, SENDGRID_API_KEY: 'fake-key' }, timeout: 5000 })
  assert.equal(result.status, expectedStatus, result.stderr)
  return JSON.parse(result.stdout)
}

const addresses = ['send', '--from', 'sender@example.com', '--to', 'recipient@example.com']
test('a dynamic template can supply the subject without a CLI subject', () => {
  const result = run([...addresses, '--template-id', 'd-template123', '--template-data', '{"name":"Zoë","subject":"Receipt"}'], true)
  assert.equal(result.method, 'POST')
  assert.equal(result.url, 'https://api.sendgrid.com/v3/mail/send')
  assert.equal(result.body.template_id, 'd-template123')
  assert.equal(Object.hasOwn(result.body, 'subject'), false)
  assert.equal(Object.hasOwn(result.body, 'content'), false)
  assert.deepEqual(result.body.personalizations[0].dynamic_template_data, { name: 'Zoë', subject: 'Receipt' })
})
test('plain and legacy-template sends still require a subject', () => {
  assert.match(run([...addresses, '--text', 'Hello'], false, 1).error, /subject/)
  assert.match(run([...addresses, '--template-id', 'legacy-template123'], false, 1).error, /subject/)
})
test('plain email preserves explicit subject and content', () => {
  const result = run([...addresses, '--subject', 'Hello', '--text', 'World'], true)
  assert.equal(result.body.subject, 'Hello')
  assert.deepEqual(result.body.content, [{ type: 'text/plain', value: 'World' }])
})
test('dynamic-template send still requires sender and recipient', () => {
  assert.match(run(['send', '--template-id', 'd-template123', '--to', 'recipient@example.com'], false, 1).error, /from/)
  assert.match(run(['send', '--template-id', 'd-template123', '--from', 'sender@example.com'], false, 1).error, /to/)
})
test('dynamic-template dry run is redacted and never fetches', () => {
  const result = run([...addresses, '--template-id', 'd-template123', '--dry-run'])
  assert.equal(result.body.template_id, 'd-template123')
  assert.equal(result.headers.Authorization, '***')
  assert.equal(JSON.stringify(result).includes('fake-key'), false)
})
