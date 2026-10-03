const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/brevo.js')
function run(args, network = false) {
  const code = `global.fetch = async (url, options) => {
    if (!${network}) throw new Error('Unexpected request');
    const body = JSON.parse(options.body);
    if (!body.listIds?.length && !body.newList?.listName) throw new Error('400 missing import destination');
    return new Response(JSON.stringify({url, method: options.method, body, processId: 78}), {status: 202});
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const r = spawnSync(process.execPath, ['-e', code], {encoding: 'utf8', timeout: 5000, env: {...process.env, BREVO_API_KEY: 'test-only-key'}})
  assert.equal(r.status, 0, r.stderr)
  return JSON.parse(r.stdout)
}
test('import without a destination stops before making a guaranteed invalid request', () => {
  assert.match(run(['contacts', 'import', '--emails', 'person@example.com']).error, /list-ids/)
})
test('invalid destination IDs and empty email entries stop before a request', () => {
  for (const ids of ['abc', '1,', '0', '-1', '1.5']) {
    assert.match(run(['contacts', 'import', '--emails', 'person@example.com', '--list-ids', ids]).error, /list-ids/)
  }
  for (const emails of ['', 'one@example.com,', ' , ']) {
    assert.match(run(['contacts', 'import', '--emails', emails, '--list-ids', '1']).error, /emails/)
  }
})
test('valid existing-list import preserves the JSON body and receives a process ID', () => {
  const result = run(['contacts', 'import', '--emails', 'one@example.com, two@example.com', '--list-ids', '1, 3'], true)
  assert.equal(result.processId, 78)
  assert.equal(result.method, 'POST')
  assert.equal(result.url, 'https://api.brevo.com/v3/contacts/import')
  assert.deepEqual(result.body, {jsonBody: [{email: 'one@example.com'}, {email: 'two@example.com'}], listIds: [1, 3]})
})
test('new-list imports provide the documented alternative destination', () => {
  const result = run(['contacts', 'import', '--emails', 'person@example.com', '--new-list-name', 'Launch cohort', '--folder-id', '2'], true)
  assert.deepEqual(result.body.newList, {listName: 'Launch cohort', folderId: 2})
  assert.equal(Object.hasOwn(result.body, 'listIds'), false)
})
test('ambiguous destination choice and an invalid new-list folder stop before a request', () => {
  assert.match(run(['contacts', 'import', '--emails', 'person@example.com', '--list-ids', '1', '--new-list-name', 'New']).error, /either/)
  assert.match(run(['contacts', 'import', '--emails', 'person@example.com', '--new-list-name', 'New', '--folder-id', 'bad']).error, /folder-id/)
})
test('a complete import preview shows its destination and masks credentials without fetch', () => {
  const result = run(['contacts', 'import', '--emails', 'person@example.com', '--list-ids', '1', '--dry-run'])
  assert.deepEqual(result.body.listIds, [1])
  assert.equal(result.headers['api-key'], '***')
})
