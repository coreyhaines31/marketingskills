const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

// Actual CLI entry points and real Response objects; only transport is replaced.
// No provider requests, real credentials, or delivery side effects are used.
const commands = [
  {"name": "customer-io", "label": "customer-io", "args": ["campaigns", "list"]},
  {"name": "savvycal", "label": "savvycal", "args": ["me"]},
  {"name": "hunter", "label": "hunter", "args": ["account", "info"]},
  {"name": "snov", "label": "snov", "args": ["lists", "list"]},
  {"name": "truelist", "label": "truelist", "args": ["account"]},
  {"name": "hotjar", "label": "hotjar", "args": ["sites", "list"]},
  {"name": "dub", "label": "dub", "args": ["links", "list"]},
  {"name": "ahrefs", "label": "ahrefs", "args": ["domain-rating", "get", "--target", "example.com"]},
  {"name": "demio", "label": "demio", "args": ["events", "list"]},
  {"name": "kit", "label": "kit", "args": ["forms", "list"]},
  {"name": "mailchimp", "label": "mailchimp", "args": ["lists", "list"]},
  {"name": "instantly", "label": "instantly", "args": ["campaigns", "list"]},
  {"name": "pendo", "label": "pendo", "args": ["features", "list"]},
  {"name": "optimizely", "label": "optimizely", "args": ["projects", "list"]},
  {"name": "apollo", "label": "apollo", "args": ["organizations", "search"]},
  {"name": "lemlist", "label": "lemlist", "args": ["campaigns", "list"]},
  {"name": "klaviyo", "label": "klaviyo", "args": ["lists", "list"]},
  {"name": "close", "label": "close", "args": ["leads", "list"]},
  {"name": "keywords-everywhere", "label": "keywords-everywhere", "args": ["account", "credits"]},
  {"name": "livestorm", "label": "livestorm", "args": ["events", "list"]},
  {"name": "trustpilot", "label": "trustpilot", "args": ["business", "search", "--query", "example.com"]},
  {"name": "wistia", "label": "wistia", "args": ["projects", "list"]},
  {"name": "linkedin-ads", "label": "linkedin-ads", "args": ["accounts", "list"]},
  {"name": "tolt", "label": "tolt", "args": ["partners", "list", "--program-id", "fixture"]},
  {"name": "brevo", "label": "brevo", "args": ["account", "get"]},
  {"name": "intercom", "label": "intercom", "args": ["admins", "list"]},
  {"name": "similarweb", "label": "similarweb", "args": ["traffic", "visits", "--domain", "example.com", "--start", "2026-01", "--end", "2026-02"]},
  {"name": "beehiiv", "label": "beehiiv", "args": ["publications", "list"]},
  {"name": "crossbeam", "label": "crossbeam", "args": ["partners", "list"]},
  {"name": "onesignal", "label": "onesignal", "args": ["app", "get"]},
  {"name": "airops", "label": "airops", "args": ["workflows", "list"]},
  {"name": "sendgrid", "label": "sendgrid", "args": ["contacts", "list"]},
  {"name": "buffer", "label": "buffer", "args": ["profiles", "list"]},
  {"name": "buffer", "label": "buffer:create", "args": ["updates", "create", "--profile-ids", "fixture", "--text", "Owned test"]},
  {"name": "buffer", "label": "buffer:reorder", "args": ["updates", "reorder", "--id", "fixture", "--order", "first,second"]},
  {"name": "customer-io", "label": "customer-io:track", "args": ["customers", "identify", "--id", "fixture"]},
  {"name": "trustpilot", "label": "trustpilot:private", "args": ["reviews", "private", "--business-unit", "fixture"]}
]
const fixtureEnv = {
  "CUSTOMERIO_APP_KEY": "fixture-secret-us1",
  "CUSTOMERIO_SITE_ID": "fixture-id",
  "CUSTOMERIO_API_KEY": "fixture-secret-us1",
  "SAVVYCAL_API_KEY": "fixture-secret-us1",
  "HUNTER_API_KEY": "fixture-secret-us1",
  "SNOV_CLIENT_ID": "fixture-id",
  "SNOV_CLIENT_SECRET": "fixture-secret-us1",
  "TRUELIST_API_KEY": "fixture-secret-us1",
  "HOTJAR_CLIENT_ID": "fixture-id",
  "HOTJAR_CLIENT_SECRET": "fixture-secret-us1",
  "DUB_API_KEY": "fixture-secret-us1",
  "AHREFS_API_KEY": "fixture-secret-us1",
  "DEMIO_API_KEY": "fixture-secret-us1",
  "DEMIO_API_SECRET": "fixture-secret-us1",
  "KIT_API_SECRET": "fixture-secret-us1",
  "KIT_API_KEY": "fixture-secret-us1",
  "MAILCHIMP_API_KEY": "fixture-secret-us1",
  "INSTANTLY_API_KEY": "fixture-secret-us1",
  "PENDO_INTEGRATION_KEY": "fixture-secret-us1",
  "OPTIMIZELY_API_KEY": "fixture-secret-us1",
  "APOLLO_API_KEY": "fixture-secret-us1",
  "LEMLIST_API_KEY": "fixture-secret-us1",
  "KLAVIYO_API_KEY": "fixture-secret-us1",
  "CLOSE_API_KEY": "fixture-secret-us1",
  "KEYWORDS_EVERYWHERE_API_KEY": "fixture-secret-us1",
  "LIVESTORM_API_TOKEN": "fixture-secret-us1",
  "TRUSTPILOT_API_KEY": "fixture-key",
  "TRUSTPILOT_API_SECRET": "fixture-secret",
  "TRUSTPILOT_BUSINESS_UNIT_ID": "fixture-id",
  "WISTIA_API_KEY": "fixture-secret-us1",
  "LINKEDIN_ACCESS_TOKEN": "fixture-secret-us1",
  "TOLT_API_KEY": "fixture-secret-us1",
  "BREVO_API_KEY": "fixture-secret-us1",
  "INTERCOM_API_KEY": "fixture-secret-us1",
  "SIMILARWEB_API_KEY": "fixture-secret-us1",
  "BEEHIIV_API_KEY": "fixture-secret-us1",
  "CROSSBEAM_API_KEY": "fixture-secret-us1",
  "ONESIGNAL_REST_API_KEY": "fixture-secret-us1",
  "ONESIGNAL_APP_ID": "fixture-id",
  "AIROPS_API_KEY": "fixture-secret-us1",
  "SENDGRID_API_KEY": "fixture-secret-us1",
  "BUFFER_API_KEY": "fixture-secret-us1"
}
function run(command, status, body, preview = false, oauthStatus = 200) {
  const cli = path.resolve(__dirname, `../../tools/clis/${command.name}.js`)
  const args = [...command.args, ...(preview ? ['--dry-run'] : [])]
  const source = `let calls = 0; global.fetch = async (url) => {
    calls++;
    if (${preview}) throw new Error('dry-run reached transport');
    if (String(url).includes('/oauth/')) return new Response(JSON.stringify({access_token: 'fixture-token'}), {status: ${oauthStatus}});
    return new Response(${JSON.stringify(body)}, {status: ${status}});
  }; process.on('exit', () => process.stderr.write('CALLS:' + calls));
  process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', source], {encoding: 'utf8', timeout: 10000,
    env: {PATH: process.env.PATH, ...fixtureEnv}})
}
function output(result) {
  assert.equal(result.signal, null, result.stderr)
  return JSON.parse(result.stdout)
}
for (const command of commands) {
  for (const [status, body] of [[429, 'retry later'], [503, JSON.stringify({message: 'provider unavailable', request_id: 'owned-fixture'})]]) {
    test(`${command.label}: rejected HTTP ${status} preserves diagnostics and fails`, () => {
      const result = run(command, status, body)
      assert.deepEqual(output(result), status === 429 ? {status, body} : JSON.parse(body))
      assert.equal(result.status, 1)
    })
  }
  test(`${command.label}: successful JSON, malformed text and empty responses retain their contract`, () => {
    for (const [status, body, expected] of [
      [200, JSON.stringify({data: []}), {data: []}],
      [200, 'not-json', {status: 200, body: 'not-json'}],
      [204, null, command.name === 'linkedin-ads' ? {status: 204} : {status: 204, body: ''}],
    ]) {
      const result = run(command, status, body)
      assert.deepEqual(output(result), expected)
      assert.equal(result.status, 0, result.stderr)
    }
  })
  // Preserve established payload.error handling; TrueList has no such sentinel contract.
  if (command.name !== 'truelist') test(`${command.label}: a provider error in a successful HTTP response still fails`, () => {
    const payload = {error: 'provider rejected request'}
    const result = run(command, 200, JSON.stringify(payload))
    assert.deepEqual(output(result), payload)
    assert.equal(result.status, 1)
  })
  test(`${command.label}: dry run never reaches OAuth or resource transport`, () => {
    const result = run(command, 200, '{}', true)
    assert.equal(output(result)._dry_run, true)
    assert.equal(result.status, 0)
    assert.equal(result.stderr, 'CALLS:0')
    assert.doesNotMatch(result.stdout, /fixture-(?:secret|key|token)/)
  })
}
for (const label of ['snov', 'hotjar', 'trustpilot:private']) {
  test(`${label}: an HTTP-rejected OAuth response cannot authorize a resource request`, () => {
    const command = commands.find(command => command.label === label)
    const result = run(command, 200, '{}', false, 401)
    assert.equal(result.status, 1)
    assert.match(JSON.parse(result.stderr.replace(/CALLS:1$/, '')).error, /access token/)
    assert.equal(result.stderr.endsWith('CALLS:1'), true)
    assert.equal(result.stdout, '')
  })
}
