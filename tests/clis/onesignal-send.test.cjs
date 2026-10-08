const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/onesignal.js')
function run(args, network = true) {
  const code = `global.fetch = async (url, options) => {
    if (!${network}) throw new Error('Unexpected network request');
    return { status: 200, text: async () => JSON.stringify({ url, headers: options.headers, body: JSON.parse(options.body) }) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, 'notifications', 'send', ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', env: { ...process.env, ONESIGNAL_REST_API_KEY: 'dummy-secret', ONESIGNAL_APP_ID: 'dummy-app' } })
}
function sent(args) {
  const r = run(args); assert.equal(r.status, 0, r.stderr)
  const p = JSON.parse(r.stdout); assert.ok(!p.error, r.stdout); return p
}
test('email addresses receive required email content rather than push contents', () => {
  const p = sent(['--emails', 'first@example.test,second@example.test', '--heading', 'Welcome', '--message', '<p>Hello</p>'])
  assert.equal(p.url, 'https://api.onesignal.com/notifications?c=email')
  assert.equal(p.headers.Authorization, 'Key dummy-secret')
  assert.deepEqual(p.body.email_to, ['first@example.test', 'second@example.test'])
  assert.equal(p.body.email_subject, 'Welcome'); assert.equal(p.body.email_body, '<p>Hello</p>')
  assert.equal(p.body.target_channel, 'email'); assert.ok(!p.body.contents)
})
test('explicit email content works without an unrelated push message', () => {
  const p = sent(['--channel', 'email', '--aliases', 'customer', '--email-subject', 'Receipt', '--email-body', '<p>Paid</p>'])
  assert.equal(p.body.email_subject, 'Receipt'); assert.equal(p.body.email_body, '<p>Paid</p>')
  assert.deepEqual(p.body.include_aliases, { external_id: ['customer'] })
})
test('segment targeting honors explicit email channel', () => {
  const p = sent(['--channel', 'email', '--segment', 'Customers', '--heading', 'News', '--message', '<p>Update</p>'])
  assert.equal(p.body.target_channel, 'email'); assert.deepEqual(p.body.included_segments, ['Customers'])
  assert.ok(!p.body.contents)
})
test('default push preserves headings, link, data, schedule and TTL', () => {
  const p = sent(['--message', 'Hello', '--heading', 'Hi', '--url', 'https://example.test', '--data', '{"plan":"pro"}', '--send-after', '2026-11-01T00:00:00Z', '--ttl', '60'])
  assert.equal(p.url, 'https://api.onesignal.com/notifications?c=push')
  assert.deepEqual(p.body.contents, { en: 'Hello' }); assert.deepEqual(p.body.headings, { en: 'Hi' })
  assert.deepEqual(p.body.included_segments, ['Subscribed Users']); assert.equal(p.body.url, 'https://example.test')
  assert.deepEqual(p.body.data, { plan: 'pro' }); assert.equal(p.body.ttl, 60)
  assert.equal(p.body.send_after, '2026-11-01T00:00:00Z')
})
test('SMS aliases retain SMS contents and explicit channel', () => {
  const p = sent(['--channel', 'sms', '--aliases', '{"external_id":["customer"]}', '--message', 'Order ready'])
  assert.equal(p.body.target_channel, 'sms'); assert.equal(p.url, 'https://api.onesignal.com/notifications?c=sms')
  assert.deepEqual(p.body.contents, { en: 'Order ready' })
})
test('legacy player IDs retain their target list', () => {
  const p = sent(['--player-ids', 'subscription-1,subscription-2', '--message', 'Hello'])
  assert.deepEqual(p.body.include_player_ids, ['subscription-1', 'subscription-2'])
})
for (const [name, args, pattern] of [
  ['missing email subject', ['--emails', 'first@example.test', '--message', 'Hello'], /subject/],
  ['missing email body', ['--channel', 'email', '--aliases', 'customer', '--email-subject', 'Hi'], /body/],
  ['incompatible email and push channel', ['--emails', 'first@example.test', '--channel', 'push', '--message', 'Hello'], /email/],
  ['unknown channel', ['--channel', 'fax', '--message', 'Hello'], /channel/],
  ['missing push contents', ['--channel', 'push'], /message/]
]) test(name + ' fails before a request', () => {
  const r = run(args, false); assert.equal(r.status, 0, r.stderr)
  assert.match(JSON.parse(r.stdout).error, pattern)
})
test('email preview masks credentials and shares the actual payload', () => {
  const args = ['--channel', 'email', '--aliases', 'customer', '--email-subject', 'Hi', '--email-body', '<p>Hi</p>']
  const p = sent(args); const r = run([...args, '--dry-run'], false)
  assert.equal(r.status, 0, r.stderr); const d = JSON.parse(r.stdout)
  assert.deepEqual(d.body, p.body); assert.equal(d.url, p.url)
  assert.equal(d.headers.Authorization, '***'); assert.ok(!r.stdout.includes('dummy-secret'))
})
