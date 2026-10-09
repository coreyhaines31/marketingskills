const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/outreach.js')
function run(args) {
  const code = `global.fetch = async (url, options) => ({status:200,text:async()=>JSON.stringify({url,method:options.method,cursor:new URL(url).searchParams.get('page[after]')})});process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', env: { ...process.env, OUTREACH_ACCESS_TOKEN: 'fixture-only' } })
}
for (const resource of ['prospects', 'sequences', 'mailings', 'accounts', 'tasks']) {
  test(`${resource} list forwards cursor and size instead of repeating the first page`, () => {
    const result = run([resource, 'list', '--after', 'opaque+cursor=/part', '--per-page', '25', '--sequence-id', '123', '--state', 'pending'])
    assert.equal(result.status, 0, result.stderr)
    const output = JSON.parse(result.stdout)
    assert.equal(output.cursor, 'opaque+cursor=/part')
    const query = new URL(output.url).searchParams
    assert.equal(query.get('page[size]'), '25')
    if (resource === 'mailings') assert.equal(query.get('filter[sequence][id]'), '123')
    if (resource === 'tasks') assert.equal(query.get('filter[state]'), 'pending')
  })
}
test('legacy page selection is translated into the documented offset contract', () => {
  const result = run(['prospects', 'list', '--page', '3', '--per-page', '25'])
  assert.equal(result.status, 0, result.stderr)
  const query = new URL(JSON.parse(result.stdout).url).searchParams
  assert.equal(query.get('page[offset]'), '50')
  assert.equal(query.has('page[number]'), false)
  assert.equal(query.has('page[size]'), false)
  assert.equal(query.get('page[limit]'), '25')
  const defaultQuery = new URL(JSON.parse(run(['prospects', 'list', '--page', '3']).stdout).url).searchParams
  assert.equal(defaultQuery.get('page[offset]'), '100')
  assert.equal(defaultQuery.get('page[limit]'), '50')
})
test('before cursor and dry-run preserve the exact token and credential redaction', () => {
  const result = run(['accounts', 'list', '--before', 'previous+token', '--dry-run'])
  assert.equal(result.status, 0, result.stderr)
  const output = JSON.parse(result.stdout)
  assert.equal(new URL(output.url).searchParams.get('page[before]'), 'previous+token')
  assert.equal(output.headers.Authorization, 'Bearer ***')
  assert.equal(new URL(JSON.parse(run(['accounts', 'list']).stdout).url).search, '')
})
test('contradictory or invalid page selections fail before any request', () => {
  for (const args of [['--after','a','--before','b'],['--after','a','--page','2'],['--page','0'],['--page','1junk'],['--per-page'],['--per-page','1.5'],['--per-page','1001'],['--page','202','--per-page','50']]) {
    const result = run(['accounts','list',...args])
    assert.notEqual(result.status, 0)
    assert.ok(JSON.parse(result.stderr).error)
  }
})
