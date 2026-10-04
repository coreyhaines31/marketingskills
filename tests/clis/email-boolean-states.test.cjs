const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
function run(vendor, args, fetch = true) {
  const cli = path.resolve(__dirname, `../../tools/clis/${vendor}.js`)
  const source = `global.fetch = async (url, options) => {
    if (!${fetch}) throw new Error('Unexpected network request');
    return { ok: true, status: 200, text: async () => JSON.stringify({ url, method: options.method, body: options.body ? JSON.parse(options.body) : null }) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', timeout: 5000, env: {
    ...process.env, REWARDFUL_API_KEY: 'fake-key', RESEND_API_KEY: 'fake-key', POSTMARK_API_KEY: 'fake-key', BEEHIIV_API_KEY: 'fake-key', KLAVIYO_API_KEY: 'fake-key',
  } })
}
function output(result) { assert.equal(result.status, 0, result.stderr); return JSON.parse(result.stdout) }

const cases = [
  { vendor: 'resend', args: ['contacts', 'audience123', 'create', '--email', 'member@example.com'], flag: 'unsubscribed', field: 'unsubscribed' },
  { vendor: 'resend', args: ['contacts', 'audience123', 'update', 'contact123'], flag: 'unsubscribed', field: 'unsubscribed' },
  { vendor: 'beehiiv', args: ['subscriptions', 'create', '--publication', 'pub_123', '--email', 'member@example.com'], flag: 'reactivate-existing', field: 'reactivate_existing' },
  { vendor: 'beehiiv', args: ['subscriptions', 'create', '--publication', 'pub_123', '--email', 'member@example.com'], flag: 'send-welcome-email', field: 'send_welcome_email' },
  { vendor: 'postmark', args: ['email', 'send', '--from', 'sender@example.com', '--to', 'recipient@example.com', '--subject', 'Hello', '--text', 'World'], flag: 'track-opens', field: 'TrackOpens' },
]
for (const c of cases) {
  test(`${c.vendor} ${c.field}: false stays false, true and bare flag enable it`, () => {
    for (const [value, expected] of [['false', false], ['true', true], [undefined, true]]) {
      const argv = [...c.args, `--${c.flag}`]; if (value !== undefined) argv.push(value)
      assert.equal(output(run(c.vendor, argv)).body[c.field], expected)
    }
  })
  test(`${c.vendor} ${c.field}: invalid state cannot reach fetch`, () => {
    const result = run(c.vendor, [...c.args, `--${c.flag}`, 'maybe'], false)
    assert.equal(result.status, 1)
    assert.match(result.stderr, /must be true or false/)
  })
  test(`${c.vendor} ${c.field}: omitted state remains unset, dry run redacts auth`, () => {
    assert.equal(Object.hasOwn(output(run(c.vendor, c.args)).body, c.field), false)
    const preview = output(run(c.vendor, [...c.args, `--${c.flag}`, 'false', '--dry-run'], false))
    assert.equal(preview.body[c.field], false)
    assert.equal(JSON.stringify(preview).includes('fake-key'), false)
  })
}
