const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

const cli = path.resolve(__dirname, '../../tools/clis/amplitude.js')
function run(argv) {
  const code = `let calls=0;global.fetch=async(url,options)=>{calls++;return {status:200,text:async()=>JSON.stringify({calls,url,body:JSON.parse(options.body)})}};process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(argv)}];require(${JSON.stringify(cli)});process.on('exit',()=>console.error(JSON.stringify({calls})));`
  const child = spawnSync(process.execPath, ['-e', code], {
    encoding: 'utf8', env: { ...process.env, AMPLITUDE_API_KEY: 'fixture-only' }, timeout: 5000,
  })
  assert.ifError(child.error)
  const errors = child.stderr.trim().split('\n').map(line => JSON.parse(line))
  return { status: child.status, calls: errors.at(-1).calls, error: errors[0].error, stdout: child.stdout }
}
const single = ['track', 'event', '--user-id', 'customer-123', '--event-type', 'Purchase']
const event = { user_id: 'customer-123', event_type: 'Purchase' }
const invalidObjects = ['null', '[]', 'true', '1', '"text"']
for (const preview of [false, true]) {
  for (const value of [...invalidObjects, '']) {
    test(`single-event properties reject ${JSON.stringify(value)} (${preview ? 'preview' : 'request'})`, () => {
      const r = run([...single, '--properties', value, ...(preview ? ['--dry-run'] : [])])
      assert.equal(r.status, 1)
      assert.equal(r.calls, 0)
      assert.match(r.error, /--properties must be a JSON object/)
    })
  }
  for (const value of [...invalidObjects.filter(v => v !== '[]'), '[null]', '[1]', '[[]]', '[true]', '["text"]']) {
    test(`batch rejects ${value} (${preview ? 'preview' : 'request'})`, () => {
      const r = run(['track', 'batch', '--events', value, ...(preview ? ['--dry-run'] : [])])
      assert.equal(r.status, 1)
      assert.equal(r.calls, 0)
      assert.match(r.error, /--events must be a JSON array of event objects/)
    })
  }
  for (const value of [null, [], true, 1, 'text']) {
    test(`batch event properties reject ${JSON.stringify(value)} (${preview ? 'preview' : 'request'})`, () => {
      const r = run(['track', 'batch', '--events', JSON.stringify([{ ...event, event_properties: value }]), ...(preview ? ['--dry-run'] : [])])
      assert.equal(r.status, 1)
      assert.equal(r.calls, 0)
      assert.match(r.error, /event_properties must be a JSON object/)
    })
  }
}
for (const properties of [{}, { items: [1, 'two', null], order: { amount: 0, paid: false }, note: '' }]) {
  test(`single-event properties preserve ${JSON.stringify(properties)}`, () => {
    const r = run([...single, '--properties', JSON.stringify(properties)])
    assert.equal(r.status, 0)
    assert.equal(r.calls, 1)
    assert.deepEqual(JSON.parse(r.stdout).body.events[0], { ...event, event_properties: properties })
  })
}
test('single-event properties remain optional', () => {
  const r = run(single)
  assert.equal(r.status, 0)
  assert.deepEqual(JSON.parse(r.stdout).body.events, [event])
})
test('valid batch preserves nested properties and unrelated event fields', () => {
  const events = [event, { device_id: 'visitor-device-123', event_type: 'Viewed Pricing', time: 123456789, insert_id: 'retry-key', event_properties: { items: ['a', 'b'], paid: false } }]
  const r = run(['track', 'batch', '--events', JSON.stringify(events)])
  assert.equal(r.status, 0)
  assert.equal(r.calls, 1)
  assert.equal(JSON.parse(r.stdout).url, 'https://api2.amplitude.com/batch')
  assert.deepEqual(JSON.parse(r.stdout).body.events, events)
})
test('valid batch preview preserves data and masks the fixture key', () => {
  const r = run(['track', 'batch', '--events', JSON.stringify([event]), '--dry-run'])
  assert.equal(r.status, 0)
  assert.equal(r.calls, 0)
  const output = JSON.parse(r.stdout)
  assert.equal(output.body.api_key, '***')
  assert.deepEqual(output.body.events, [event])
})
