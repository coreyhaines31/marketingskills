const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/mailchimp.js')
function run(args, fetch = false, expectedStatus = 0) {
  const source = `global.fetch = async (url, options) => {
    if (!${fetch}) throw new Error('Unexpected network request');
    return { status: 200, text: async () => JSON.stringify({ url, method: options.method, body: options.body ? JSON.parse(options.body) : null }) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const result = spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', env: { ...process.env, MAILCHIMP_API_KEY: 'fake-key-us7' }, timeout: 5000 })
  assert.equal(result.status, expectedStatus, result.stderr)
  return JSON.parse(result.stdout)
}

test('documented member add posts without an unused positional ID', () => {
  const result = run(['members', 'add', '--list-id', 'audience123', '--email', 'member@example.com', '--status', 'pending', '--first-name', 'Zoë', '--tags', 'newsletter,trial'], true)
  assert.equal(result.method, 'POST')
  assert.equal(result.url, 'https://us7.api.mailchimp.com/3.0/lists/audience123/members')
  assert.deepEqual(result.body, { email_address: 'member@example.com', status: 'pending', merge_fields: { FNAME: 'Zoë' }, tags: ['newsletter', 'trial'] })
})
test('member add dry run redacts authorization and never fetches', () => {
  const result = run(['members', 'add', '--list-id', 'audience123', '--email', 'member@example.com', '--dry-run'])
  assert.equal(result.method, 'POST')
  assert.equal(result.headers.Authorization, '***')
  assert.equal(JSON.stringify(result).includes('fake-key'), false)
})
test('member update without subscriber hash stops before fetching an undefined member', () => {
  const result = run(['members', 'update', '--list-id', 'audience123', '--status', 'unsubscribed'], false, 1)
  assert.match(result.error, /Subscriber hash required/)
})
test('existing member update preserves the selected audience and hash', () => {
  const result = run(['members', 'update', 'hash123', '--list-id', 'audience123', '--status', 'unsubscribed'], true)
  assert.equal(result.method, 'PATCH')
  assert.equal(result.url.endsWith('/lists/audience123/members/hash123'), true)
  assert.deepEqual(result.body, { status: 'unsubscribed' })
})
test('member add still requires email and audience', () => {
  assert.match(run(['members', 'add', '--list-id', 'audience123'], false, 1).error, /email/)
  assert.match(run(['members', 'add', '--email', 'member@example.com'], false, 1).error, /list-id/)
})
