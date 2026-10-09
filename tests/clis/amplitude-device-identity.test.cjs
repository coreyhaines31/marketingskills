const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/amplitude.js')
function run(extra, allowFetch = true) {
  const args = ['track', 'event', '--event-type', 'Viewed Pricing', ...extra]
  const code = `global.fetch=async(url,options)=>{if(!${allowFetch})throw new Error('unexpected fetch');return {status:200,text:async()=>JSON.stringify({url,body:JSON.parse(options.body)})}};process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', env: { ...process.env, AMPLITUDE_API_KEY: 'fixture-only' } })
}
test('pre-signup event uses documented device identity without inventing a user ID', () => {
  const r = run(['--device-id', 'visitor-device-123', '--properties', '{"experiment":"pricing-b"}'])
  assert.equal(r.status, 0, r.stderr)
  const out = JSON.parse(r.stdout)
  assert.equal(out.url, 'https://api2.amplitude.com/2/httpapi')
  assert.deepEqual(out.body.events, [{ device_id: 'visitor-device-123', event_type: 'Viewed Pricing', event_properties: { experiment: 'pricing-b' } }])
})
test('known users can include device identity while user-only requests remain unchanged', () => {
  const both = JSON.parse(run(['--user-id', 'customer-123', '--device-id', 'visitor-device-123']).stdout)
  assert.equal(both.body.events[0].user_id, 'customer-123')
  assert.equal(both.body.events[0].device_id, 'visitor-device-123')
  const existing = JSON.parse(run(['--user-id', 'customer-123']).stdout)
  assert.deepEqual(existing.body.events[0], { user_id: 'customer-123', event_type: 'Viewed Pricing' })
})
test('device-only preview retains event identity while masking API key', () => {
  const r = run(['--device-id', 'visitor-device-123', '--dry-run'], false)
  assert.equal(r.status, 0, r.stderr)
  const out = JSON.parse(r.stdout)
  assert.equal(out.body.api_key, '***')
  assert.equal(out.body.events[0].device_id, 'visitor-device-123')
})
test('missing identities still fail validation without making a request', () => {
  const r = run([], false)
  assert.match(JSON.parse(r.stdout).error, /user-id.*device-id/)
})
for (const extra of [['--device-id'], ['--device-id', ''], ['--user-id'], ['--user-id', 'customer-123', '--device-id']]) {
  test(`identity flags require actual string values: ${extra.join(' ')}`, () => {
    const r = run(extra, false)
    assert.equal(r.status, 1)
    assert.match(JSON.parse(r.stderr).error, /requires a non-empty string/)
  })
}
