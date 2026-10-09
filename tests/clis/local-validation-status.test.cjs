const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cases = [
  ["activecampaign", ["contacts", "get"]],
  ["adobe-analytics", ["dimensions", "list"]],
  ["ahrefs", ["domain-rating", "get"]],
  ["airops", ["flows", "get"]],
  ["amplitude", ["track", "event"]],
  ["apollo", ["people", "enrich"]],
  ["beehiiv", ["publications", "get"]],
  ["brevo", ["contacts", "get"]],
  ["buffer", ["profiles", "get"]],
  ["calendly", ["event-types", "list"]],
  ["clay", ["tables", "get"]],
  ["clearbit", ["person", "find"]],
  ["close", ["leads", "get"]],
  ["coupler", ["importers", "get"]],
  ["crossbeam", ["partners", "get"]],
  ["customer-io", ["customers", "identify"]],
  ["dataforseo", ["serp", "google"]],
  ["demio", ["events", "get"]],
  ["dub", ["links", "create"]],
  ["exa", ["search"]],
  ["firecrawl", ["scrape"]],
  ["g2", ["reviews", "get"]],
  ["ga4", ["reports", "run"]],
  ["google-ads", ["campaigns", "pause"]],
  ["google-search-console", ["search"]],
  ["hotjar", ["surveys"]],
  ["hunter", ["domain", "search"]],
  ["instantly", ["campaigns", "get"]],
  ["intercom", ["contacts", "get"]],
  ["keywords-everywhere", ["keywords", "data"]],
  ["kit", ["subscribers", "get"]],
  ["klaviyo", ["profiles", "get"]],
  ["lemlist", ["campaigns", "get"]],
  ["linkedin-ads", ["campaigns", "list"]],
  ["livestorm", ["events", "get"]],
  ["mailchimp", ["lists", "get"]],
  ["mention-me", ["referrals", "get"]],
  ["meta-ads", ["campaigns", "insights"]],
  ["mixpanel", ["track", "event"]],
  ["onesignal", ["notifications", "send"]],
  ["optimizely", ["projects", "get"]],
  ["outreach", ["prospects", "get"]],
  ["paddle", ["products", "get"]],
  ["partnerstack", ["partnerships", "get"]],
  ["pendo", ["features", "get"]],
  ["plausible", ["stats"]],
  ["postmark", ["email", "send"]],
  ["rankparse", ["domain-overlap"]],
  ["resend", ["send"]],
  ["rewardful", ["affiliates", "get"]],
  ["savvycal", ["links", "get"]],
  ["segment", ["track", "event"]],
  ["sendgrid", ["send"]],
  ["similarweb", ["traffic", "visits"]],
  ["snov", ["domain", "search"]],
  ["supermetrics", ["query"]],
  ["tiktok-ads", ["campaigns", "create"]],
  ["tolt", ["affiliates", "get"]],
  ["trustpilot", ["business", "search"]],
  ["typeform", ["forms", "get"]],
  ["wistia", ["projects", "get"]],
  ["zapier", ["zaps", "get"]],
  ["zoominfo", ["contacts", "enrich"]],
]
const fixtureEnv = {"ACTIVECAMPAIGN_API_KEY": "fixture-value", "ACTIVECAMPAIGN_API_URL": "https://fixture.api-us1.com", "ADOBE_ACCESS_TOKEN": "fixture-value", "ADOBE_CLIENT_ID": "fixture-value", "ADOBE_COMPANY_ID": "fixture-value", "AHREFS_API_KEY": "fixture-value", "AIROPS_API_KEY": "fixture-value", "AIROPS_WORKSPACE_ID": "fixture-value", "AMPLITUDE_API_KEY": "fixture-value", "AMPLITUDE_SECRET_KEY": "fixture-value", "APOLLO_API_KEY": "fixture-value", "BEEHIIV_API_KEY": "fixture-value", "BREVO_API_KEY": "fixture-value", "BUFFER_API_KEY": "fixture-value", "CALENDLY_API_KEY": "fixture-value", "CLAY_API_KEY": "fixture-value", "CLEARBIT_API_KEY": "fixture-value", "CLOSE_API_KEY": "fixture-value", "COUPLER_API_KEY": "fixture-value", "CROSSBEAM_API_KEY": "fixture-value", "CUSTOMERIO_APP_KEY": "fixture-value", "CUSTOMERIO_SITE_ID": "fixture-value", "CUSTOMERIO_API_KEY": "fixture-value", "DATAFORSEO_LOGIN": "fixture-value", "DATAFORSEO_PASSWORD": "fixture-value", "DEMIO_API_KEY": "fixture-value", "DEMIO_API_SECRET": "fixture-value", "DUB_API_KEY": "fixture-value", "EXA_API_KEY": "fixture-value", "FIRECRAWL_API_KEY": "fixture-value", "G2_API_TOKEN": "fixture-value", "GA4_ACCESS_TOKEN": "fixture-value", "GITHUB_TOKEN": "fixture-value", "GOOGLE_ADS_TOKEN": "fixture-value", "GOOGLE_ADS_DEVELOPER_TOKEN": "fixture-value", "GOOGLE_ADS_CUSTOMER_ID": "1234567890", "GOOGLE_ADS_LOGIN_CUSTOMER_ID": "fixture-value", "GSC_ACCESS_TOKEN": "fixture-value", "HOTJAR_CLIENT_ID": "fixture-value", "HOTJAR_CLIENT_SECRET": "fixture-value", "HUNTER_API_KEY": "fixture-value", "INSTANTLY_API_KEY": "fixture-value", "INTERCOM_API_KEY": "fixture-value", "KEYWORDS_EVERYWHERE_API_KEY": "fixture-value", "KIT_API_SECRET": "fixture-value", "KIT_API_KEY": "fixture-value", "KLAVIYO_API_KEY": "fixture-value", "LEMLIST_API_KEY": "fixture-value", "LINKEDIN_ACCESS_TOKEN": "fixture-value", "LIVESTORM_API_TOKEN": "fixture-value", "MAILCHIMP_API_KEY": "fixture-key-us1", "MENTIONME_API_KEY": "fixture-value", "META_ACCESS_TOKEN": "fixture-value", "META_AD_ACCOUNT_ID": "12345", "MIXPANEL_TOKEN": "fixture-value", "MIXPANEL_API_KEY": "fixture-value", "MIXPANEL_SECRET": "fixture-value", "ONESIGNAL_REST_API_KEY": "fixture-value", "ONESIGNAL_APP_ID": "fixture-value", "OPTIMIZELY_API_KEY": "fixture-value", "OUTREACH_ACCESS_TOKEN": "fixture-value", "PADDLE_API_KEY": "fixture-value", "PADDLE_SANDBOX": "false", "PARTNERSTACK_PUBLIC_KEY": "fixture-value", "PARTNERSTACK_SECRET_KEY": "fixture-value", "PENDO_INTEGRATION_KEY": "fixture-value", "PLAUSIBLE_API_KEY": "fixture-value", "PLAUSIBLE_BASE_URL": "https://fixture.plausible.example", "POSTMARK_API_KEY": "fixture-value", "RANKPARSE_API_KEY": "fixture-value", "RESEND_API_KEY": "fixture-value", "REWARDFUL_API_KEY": "fixture-value", "SAVVYCAL_API_KEY": "fixture-value", "SEGMENT_WRITE_KEY": "fixture-value", "SEGMENT_ACCESS_TOKEN": "fixture-value", "SEMRUSH_API_KEY": "fixture-value", "SENDGRID_API_KEY": "fixture-value", "SIMILARWEB_API_KEY": "fixture-value", "SNOV_CLIENT_ID": "fixture-value", "SNOV_CLIENT_SECRET": "fixture-value", "SUPERMETRICS_API_KEY": "fixture-value", "TIKTOK_ACCESS_TOKEN": "fixture-value", "TIKTOK_ADVERTISER_ID": "fixture-value", "TOLT_API_KEY": "fixture-value", "TRUSTPILOT_API_KEY": "fixture-value", "TRUSTPILOT_API_SECRET": "fixture-value", "TRUSTPILOT_BUSINESS_UNIT_ID": "fixture-value", "TYPEFORM_API_KEY": "fixture-value", "WISTIA_API_KEY": "fixture-value", "ZAPIER_API_KEY": "fixture-value", "ZOOMINFO_ACCESS_TOKEN": "fixture-value", "ZOOMINFO_USERNAME": "fixture-value", "ZOOMINFO_PRIVATE_KEY": "fixture-value"}
function run(name, args, credentials = fixtureEnv) {
  const cli = path.resolve(__dirname, '../../tools/clis', name + '.js')
  const code = `global.fetch = async () => new Response(JSON.stringify({accepted:true,access_token:'fixture-access-token'}), {status:200}); process.argv = ['node',${JSON.stringify(cli)},...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', code], {encoding:'utf8',timeout:10000,env:{...process.env,...credentials}})
}
for (const [name, command] of cases) {
  for (const dryRun of [false, true]) test(`${name}: missing required command arguments fail${dryRun ? ' in preview' : ''}`, () => {
    const result = run(name, [...command, ...(dryRun ? ['--dry-run'] : [])])
    const data = JSON.parse(result.stdout || result.stderr)
    assert.ok(data.error, result.stdout || result.stderr)
    assert.equal(result.status, 1, result.stdout || result.stderr)
  })
  test(`${name}: no-argument help remains successful`, () => {
    const result = run(name, [])
    assert.equal(result.status, 0, result.stderr)
    assert.ok(JSON.parse(result.stdout).usage)
  })
}

const successCommands = [
  ['activecampaign', ['contacts', 'create', '--email', 'fixture@example.com']],
  ['segment', ['track', 'event', '--user-id', 'fixture-user', '--event', 'Fixture']],
  ['paddle', ['products', 'create', '--name', 'Fixture', '--tax-category', 'saas']],
  ['g2', ['products', 'list']],
  ['plausible', ['stats', 'aggregate', '--site-id', 'example.com']],
  ['wistia', ['projects', 'list']],
  ['dub', ['links', 'create', '--url', 'https://example.com']],
  ['mixpanel', ['track', 'event', '--event', 'Fixture', '--distinct-id', 'fixture-user']],
]
for (const [name, command] of successCommands) {
  for (const dryRun of [false, true]) test(`${name}: valid ${dryRun ? 'preview' : 'API response'} remains successful`, () => {
    const result = run(name, [...command, ...(dryRun ? ['--dry-run'] : [])])
    const data = JSON.parse(result.stdout)
    assert.equal(result.status, 0, result.stderr || result.stdout)
    assert.equal(data.error, undefined)
    assert.equal(data[dryRun ? '_dry_run' : 'accepted'], true)
  })
}

const noCredentials = Object.fromEntries(Object.keys(fixtureEnv).map(key => [key, '']))
for (const [name] of cases) test(`${name}: help also works without credentials`, () => {
  const result = run(name, [], noCredentials)
  assert.equal(result.status, 0, result.stderr)
  assert.ok(JSON.parse(result.stdout).usage)
})
for (const dryRun of [false, true]) test(`missing configured credentials still fail${dryRun ? ' in preview' : ''}`, () => {
  const result = run('wistia', ['projects', 'list', ...(dryRun ? ['--dry-run'] : [])], noCredentials)
  assert.equal(result.status, 1)
  assert.match(JSON.parse(result.stderr).error, /WISTIA_API_KEY/)
})
