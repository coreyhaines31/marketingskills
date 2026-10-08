const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

// Each subprocess runs the unchanged CLI entry point with a real Response object.
// Fake credentials and a controlled fetch keep rejected mutations/reports offline.
const commands = [
  {"name": "activecampaign", "args": ["contacts", "list"]},
  {"name": "adobe-analytics", "args": ["reportsuites", "list"]},
  {"name": "calendly", "args": ["users", "me"]},
  {"name": "clay", "args": ["tables", "list"]},
  {"name": "clearbit", "args": ["company", "find", "--domain", "example.com"]},
  {"name": "coupler", "args": ["importers", "list"]},
  {"name": "exa", "args": ["search", "--query", "fixture"]},
  {"name": "firecrawl", "args": ["scrape", "--url", "https://example.com"]},
  {"name": "g2", "args": ["products", "list"]},
  {"name": "google-ads", "args": ["campaigns", "list"]},
  {"name": "mention-me", "args": ["referrals", "get", "--id", "fixture-referral"]},
  {"name": "meta-ads", "args": ["accounts", "list"]},
  {"name": "outreach", "args": ["prospects", "list"]},
  {"name": "paddle", "args": ["products", "list"]},
  {"name": "partnerstack", "args": ["partnerships", "list"]},
  {"name": "plausible", "args": ["sites", "list"]},
  {"name": "postmark", "args": ["server", "get"]},
  {"name": "rankparse", "args": ["credits"]},
  {"name": "segment", "args": ["track", "event", "--user-id", "fixture", "--event", "Example"]},
  {"name": "typeform", "args": ["forms", "list"]},
  {"name": "segment", "label": "segment profiles", "args": ["profiles", "traits", "--space-id", "fixture", "--user-id", "fixture"]},
]
const fixtureEnv = {
  "ACTIVECAMPAIGN_API_KEY": "fixture-secret",
  "ACTIVECAMPAIGN_API_URL": "https://fixture.api-us1.com",
  "ADOBE_ACCESS_TOKEN": "fixture-secret",
  "ADOBE_CLIENT_ID": "fixture-secret",
  "ADOBE_COMPANY_ID": "fixture-secret",
  "CALENDLY_API_KEY": "fixture-secret",
  "CLAY_API_KEY": "fixture-secret",
  "CLEARBIT_API_KEY": "fixture-secret",
  "COUPLER_API_KEY": "fixture-secret",
  "EXA_API_KEY": "fixture-secret",
  "FIRECRAWL_API_KEY": "fixture-secret",
  "G2_API_TOKEN": "fixture-secret",
  "GOOGLE_ADS_TOKEN": "fixture-secret",
  "GOOGLE_ADS_DEVELOPER_TOKEN": "fixture-secret",
  "GOOGLE_ADS_CUSTOMER_ID": "5556667777",
  "GOOGLE_ADS_LOGIN_CUSTOMER_ID": "1234567890",
  "MENTIONME_API_KEY": "fixture-secret",
  "META_ACCESS_TOKEN": "fixture-secret",
  "META_AD_ACCOUNT_ID": "fixture-secret",
  "OUTREACH_ACCESS_TOKEN": "fixture-secret",
  "PADDLE_API_KEY": "fixture-secret",
  "PADDLE_SANDBOX": "false",
  "PARTNERSTACK_PUBLIC_KEY": "fixture-secret",
  "PARTNERSTACK_SECRET_KEY": "fixture-secret",
  "PLAUSIBLE_API_KEY": "fixture-secret",
  "PLAUSIBLE_BASE_URL": "https://plausible.io",
  "POSTMARK_API_KEY": "fixture-secret",
  "RANKPARSE_API_KEY": "fixture-secret",
  "SEGMENT_WRITE_KEY": "fixture-secret",
  "SEGMENT_ACCESS_TOKEN": "fixture-secret",
  "TYPEFORM_API_KEY": "fixture-secret",
}
function run(command, status, body, preview = false) {
  const cli = path.resolve(__dirname, `../../tools/clis/${command.name}.js`)
  const args = preview ? [...command.args, '--dry-run'] : command.args
  const setup = preview
    ? "global.fetch = async () => { throw new Error('dry-run reached fetch') }"
    : `global.fetch = async () => new Response(${JSON.stringify(body)}, { status: ${status} })`
  const code = `${setup}; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', timeout: 10000, env: { ...process.env, ...fixtureEnv } })
}
function output(result) {
  assert.equal(result.signal, null, result.stderr)
  assert.equal(result.stderr, '')
  return JSON.parse(result.stdout)
}
for (const command of commands) {
  const label = command.label || command.name
  test(`${label}: HTTP403 sets failure status and preserves JSON diagnostics`, () => {
    const payload = { error: { message: 'permission denied', code: 'fixture_denied' }, request_id: 'fixture-request' }
    const result = run(command, 403, JSON.stringify(payload))
    assert.deepEqual(output(result), payload)
    assert.equal(result.status, 1)
  })
  test(`${label}: HTTP429 sets failure status and preserves non-JSON diagnostics`, () => {
    const result = run(command, 429, 'retry later')
    assert.deepEqual(output(result), { status: 429, body: 'retry later' })
    assert.equal(result.status, 1)
  })
  test(`${label}: empty HTTP503 is a failure without losing its status`, () => {
    const result = run(command, 503, '')
    assert.deepEqual(output(result), { status: 503, body: '' })
    assert.equal(result.status, 1)
  })
  test(`${label}: successful HTTP200 output and exit status are unchanged`, () => {
    const payload = { data: [{ id: 'fixture-id' }], request_id: 'fixture-ok' }
    const result = run(command, 200, JSON.stringify(payload))
    assert.deepEqual(output(result), payload)
    assert.equal(result.status, 0)
  })
  test(`${label}: empty HTTP204 remains successful`, () => {
    const result = run(command, 204, null)
    assert.deepEqual(output(result), { status: 204, body: '' })
    assert.equal(result.status, 0)
  })
  test(`${label}: dry-run stays offline and successful`, () => {
    const result = run(command, undefined, undefined, true)
    assert.equal(output(result)._dry_run, true)
    assert.equal(result.status, 0)
  })
}
