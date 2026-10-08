const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/customer-io.js')
function run(args, allowFetch = true, trackAuth = true) {
  const code = `global.fetch=async(url,options)=>{if(!${allowFetch})throw new Error('unexpected fetch');return {status:200,text:async()=>JSON.stringify({url,method:options.method,body:options.body ?? null,authorization:options.headers.Authorization})}};process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  const env = { ...process.env, CUSTOMERIO_APP_KEY: 'app-fixture', CUSTOMERIO_SITE_ID: trackAuth ? 'site-fixture' : '', CUSTOMERIO_API_KEY: trackAuth ? 'track-fixture' : '' }
  return spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', env })
}
for (const action of ['suppress', 'unsuppress']) {
  test(`${action} uses documented no-body Track API operation with encoded identifier`, () => {
    const id = 'person+campaign@example.com/path?segment=one'
    const r = run(['customers', action, id])
    assert.equal(r.status, 0, r.stderr)
    const out = JSON.parse(r.stdout)
    assert.equal(out.url, `https://track.customer.io/api/v1/customers/${encodeURIComponent(id)}/${action}`)
    assert.equal(out.method, 'POST')
    assert.equal(out.body, null)
    assert.equal(out.authorization, `Basic ${Buffer.from('site-fixture:track-fixture').toString('base64')}`)
  })
  test(`${action} preview and --id support preserve authentication redaction`, () => {
    const r = run(['customers', action, '--id', 'customer-123', '--dry-run'], false)
    assert.equal(r.status, 0, r.stderr)
    const out = JSON.parse(r.stdout)
    assert.equal(out.method, 'POST')
    assert.equal(out.headers.Authorization, '***')
    assert.equal(Object.hasOwn(out, 'body'), false)
    assert.equal(out.url, `https://track.customer.io/api/v1/customers/customer-123/${action}`)
  })
}
test('suppression requires Track authentication rather than substituting an App API key', () => {
  const r = run(['customers', 'suppress', 'customer-123'], false, false)
  assert.match(JSON.parse(r.stdout).error, /Track API requires/)
})
test('missing or bare identifiers fail before dispatching suppression', () => {
  for (const extra of [[], ['--id'], ['--id', '']]) {
    const r = run(['customers', 'suppress', ...extra], false)
    assert.equal(r.status, 1)
    assert.match(JSON.parse(r.stderr).error, /Customer ID must be a non-empty string/)
  }
})
test('existing delete keeps its distinct DELETE operation', () => {
  const r = run(['customers', 'delete', 'customer-123'])
  assert.equal(r.status, 0, r.stderr)
  const out = JSON.parse(r.stdout)
  assert.equal(out.method, 'DELETE')
  assert.equal(out.url, 'https://track.customer.io/api/v1/customers/customer-123')
})
