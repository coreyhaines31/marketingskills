const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/postmark.js')
const args = ['email', 'send-batch', '--from', 'sender@example.com', '--to', 'one@example.com,two@example.com', '--subject', 'Fixture', '--text', 'Hello']
function run(payload, command = args, offline = false) {
  const source = `let calls = 0; global.fetch = async (url, options) => {
    if (${offline}) throw new Error('Unexpected network request');
    calls++; if (calls > 1) throw new Error('Unexpected retry of accepted messages');
    return new Response(${JSON.stringify(JSON.stringify(payload))}, { status: 200 });
  }; process.on('exit', () => { if (!${offline} && calls !== 1) process.exitCode = 99 });
  process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(command)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', timeout: 10000, env: { ...process.env, POSTMARK_API_KEY: 'fixture-secret' } })
}
function output(result) {
  assert.equal(result.stderr, '')
  assert.equal(result.signal, null)
  return JSON.parse(result.stdout)
}
const accepted = { To: 'one@example.com', ErrorCode: 0, Message: 'OK', MessageID: 'accepted-message-id', SubmittedAt: '2026-10-04T12:00:00Z' }
const rejected = { To: 'two@example.com', ErrorCode: 406, Message: 'Inactive recipient' }
for (const payload of [[accepted, rejected], [rejected, accepted], [rejected, rejected]]) {
  test(`HTTP200 batch with errors ${payload.map(row => row.ErrorCode).join(',')} fails without losing or retrying accepted messages`, () => {
    const result = run(payload)
    assert.deepEqual(output(result), payload)
    assert.equal(result.status, 1)
  })
}
test('an entirely accepted batch retains success and both ordered message IDs', () => {
  const payload = [accepted, { ...accepted, To: 'two@example.com', MessageID: 'second-message-id' }]
  const result = run(payload)
  assert.deepEqual(output(result), payload)
  assert.equal(result.status, 0)
})
test('successful single-message sending is unchanged', () => {
  const result = run(accepted, ['email', 'send', '--from', 'sender@example.com', '--to', 'one@example.com', '--subject', 'Fixture', '--text', 'Hello'])
  assert.deepEqual(output(result), accepted)
  assert.equal(result.status, 0)
})
test('batch preview stays offline and retains the masked token and message order', () => {
  const result = run(null, [...args, '--dry-run'], true)
  const preview = output(result)
  assert.equal(result.status, 0)
  assert.equal(preview._dry_run, true)
  assert.equal(preview.headers['X-Postmark-Server-Token'], '***')
  assert.deepEqual(preview.body.map(row => row.To), ['one@example.com', 'two@example.com'])
  assert.equal(JSON.stringify(preview).includes('fixture-secret'), false)
})
