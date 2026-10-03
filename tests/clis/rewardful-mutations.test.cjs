const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/rewardful.js')
function run(args, { status = 200, network = true } = {}) {
  const code = `global.fetch = async (url, options) => {
    if (!${network}) throw new Error('Unexpected network request');
    return { status: ${status}, ok: ${status >= 200 && status < 300}, text: async () => JSON.stringify({ url, ...options }) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', env: { ...process.env, REWARDFUL_API_KEY: 'dummy-secret' } })
}
function output(r) { assert.equal(r.status, 0, r.stderr); return JSON.parse(r.stdout) }
test('affiliate update uses the documented form wire format', () => {
  const p = output(run(['affiliates', 'update', 'affiliate', '--first-name', 'Zoë & Co', '--last-name', 'A+B', '--paypal-email', 'pay+test@example.test']))
  assert.equal(p.method, 'PUT'); assert.equal(p.headers['Content-Type'], 'application/x-www-form-urlencoded')
  assert.equal(p.headers.Authorization, 'Basic ' + Buffer.from('dummy-secret:').toString('base64'))
  assert.deepEqual(Object.fromEntries(new URLSearchParams(p.body)), { first_name: 'Zoë & Co', last_name: 'A+B', paypal_email: 'pay+test@example.test' })
})
test('create link uses affiliate_links with required affiliate_id in the form', () => {
  const p = output(run(['links', 'create', '--affiliate-id', 'affiliate', '--token', 'campaign-1']))
  assert.equal(p.url, 'https://api.getrewardful.com/v1/affiliate_links'); assert.equal(p.method, 'POST')
  assert.deepEqual(Object.fromEntries(new URLSearchParams(p.body)), { affiliate_id: 'affiliate', token: 'campaign-1' })
})
test('provider-generated link token remains optional', () => {
  const p = output(run(['links', 'create', '--affiliate-id', 'affiliate']))
  assert.equal(new URLSearchParams(p.body).get('affiliate_id'), 'affiliate')
  assert.equal(new URLSearchParams(p.body).has('token'), false)
})
test('unsupported destination URL is rejected rather than sent or silently ignored', () => {
  const p = output(run(['links', 'create', '--affiliate-id', 'affiliate', '--url', 'https://example.test'], { network: false }))
  assert.match(p.error, /url.*not supported/)
})
test('mutation preview is the same encoded wire body with masked authentication', () => {
  const args = ['affiliates', 'update', '--id', 'affiliate', '--first-name', 'A&B']
  const p = output(run(args)); const d = output(run([...args, '--dry-run'], { network: false }))
  assert.equal(d.body, p.body); assert.equal(d.headers['Content-Type'], p.headers['Content-Type'])
  assert.equal(d.headers.Authorization, '***'); assert.ok(!JSON.stringify(d).includes('dummy-secret'))
})
test('existing reads keep their query and no request body', () => {
  const p = output(run(['affiliates', 'search', '--email', 'a+b@example.test']))
  assert.equal(new URL(p.url).searchParams.get('email'), 'a+b@example.test'); assert.equal(p.method, 'GET')
  assert.equal(p.body, undefined)
})
test('mutation failures exit unsuccessfully on HTTP 422', () => {
  const r = run(['links', 'create', '--affiliate-id', 'affiliate'], { status: 422 })
  assert.equal(r.status, 1); assert.match(r.stderr, /422/)
})
