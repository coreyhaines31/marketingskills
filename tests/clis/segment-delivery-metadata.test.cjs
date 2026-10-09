const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/segment.js')
function run(command, extra = [], allowFetch = true) {
  const args = [...command, '--user-id', 'customer-1', ...extra]
  const code = `global.fetch=async(url,options)=>{if(!${allowFetch})throw new Error('unexpected fetch');return {status:200,text:async()=>JSON.stringify({url,body:JSON.parse(options.body)})}};process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', env: { ...process.env, SEGMENT_WRITE_KEY: 'fixture-only' } })
}
for (const [command, endpoint] of [[['track', 'event', '--event', 'Order Completed'], '/track'], [['identify', 'user', '--traits', '{"tier":"Gold"}'], '/identify'], [['page', 'view', '--name', 'Pricing'], '/page']]) {
  test(`${command.slice(0, 2).join(' ')} retains occurrence time and retry identity`, () => {
    const timestamp = '2024-04-12T10:15:30.123+02:00'
    const r = run(command, ['--timestamp', timestamp, '--message-id', 'source-event:123'])
    assert.equal(r.status, 0, r.stderr)
    const out = JSON.parse(r.stdout)
    assert.equal(out.url, `https://api.segment.io/v1${endpoint}`)
    assert.equal(out.body.timestamp, timestamp)
    assert.equal(out.body.messageId, 'source-event:123')
    assert.equal(out.body.userId, 'customer-1')
  })
}
test('without metadata flags the provider defaults remain untouched', () => {
  const out = JSON.parse(run(['track', 'event', '--event', 'Signup']).stdout)
  assert.equal(Object.hasOwn(out.body, 'timestamp'), false)
  assert.equal(Object.hasOwn(out.body, 'messageId'), false)
})
test('preview keeps metadata and masks credentials', () => {
  const r = run(['page', 'view'], ['--timestamp', '2024-04-12T10:15:30Z', '--message-id', 'x'.repeat(100), '--dry-run'], false)
  assert.equal(r.status, 0, r.stderr)
  const out = JSON.parse(r.stdout)
  assert.equal(out.body.messageId.length, 100)
  assert.equal(out.headers.Authorization, '***')
})
for (const extra of [['--timestamp'], ['--timestamp', 'yesterday'], ['--timestamp', '2024-04-12'], ['--timestamp', '2024-04-12T10:15:30'], ['--timestamp', '2024-13-12T10:15:30Z'], ['--timestamp', '2024-02-30T10:15:30Z'], ['--timestamp', '2024-02-31T10:15:30Z'], ['--timestamp', '2023-02-29T10:15:30Z'], ['--timestamp', '2024-04-31T10:15:30Z'], ['--timestamp', '2024-04-12T24:00:00Z'], ['--message-id'], ['--message-id', ''], ['--message-id', 'x'.repeat(101)]]) {
  test(`invalid delivery metadata ${extra[0]} ${String(extra[1]).slice(0, 20)} fails before request`, () => {
    const r = run(['track', 'event', '--event', 'Signup'], extra, false)
    assert.equal(r.status, 1)
    assert.match(JSON.parse(r.stderr).error, /timestamp|message-id/)
  })
}

test('valid leap days and timezone offsets preserve literal occurrence time', () => {
  for (const timestamp of ['2024-02-29T10:15:30Z', '2000-02-29T10:15:30.123-05:30', '2024-12-31T23:59:59+02:00']) {
    const r = run(['track', 'event', '--event', 'Signup'], ['--timestamp', timestamp])
    assert.equal(r.status, 0, r.stderr)
    assert.equal(JSON.parse(r.stdout).body.timestamp, timestamp)
  }
})
