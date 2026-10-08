const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/linkedin-ads.js')
function run(args, oracle = '', env = {}) {
  const code = `global.fetch = async (url, options) => {
    const assert = require('node:assert/strict');
    const body = options.body ? JSON.parse(options.body) : null;
    ${oracle}
    return new Response(JSON.stringify({accepted:true, url, method: options.method, body, headers: options.headers}), {status:200});
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const childEnv = {...process.env, LINKEDIN_ACCESS_TOKEN:'test-token', LINKEDIN_API_VERSION: undefined, ...env}
  for (const [key, value] of Object.entries(childEnv)) if (value === undefined) delete childEnv[key]
  return spawnSync(process.execPath, ['-e', code], {encoding:'utf8', env:childEnv, timeout:10000})
}
function result(r) { assert.equal(r.status,0,r.stderr); return JSON.parse(r.stdout) }
const noFetch = "throw new Error('unexpected fetch')"

test('every request uses the versioned REST base and version headers', () => {
  const p = result(run(['accounts','list']))
  assert.equal(p.url, 'https://api.linkedin.com/rest/adAccounts?q=search')
  assert.equal(p.headers['Linkedin-Version'], '202609'); assert.equal(p.headers['X-Restli-Protocol-Version'], '2.0.0')
  assert.equal(result(run(['accounts','list'], '', {LINKEDIN_API_VERSION:'202608'})).headers['Linkedin-Version'], '202608')
})
test('campaigns are scoped to their ad account', () => {
  assert.equal(result(run(['campaigns','list','--account-id','123','--status','ACTIVE'])).url,
    'https://api.linkedin.com/rest/adAccounts/123/adCampaigns?q=search&search=(status:(values:List(ACTIVE)))')
  const c = result(run(['campaigns','create','--account-id','123','--campaign-group-id','9','--name','Test']))
  assert.equal(c.url, 'https://api.linkedin.com/rest/adAccounts/123/adCampaigns'); assert.equal(c.body.status, 'PAUSED'); assert.equal(c.body.dailyBudget.amount, '100.00')
})
test('status updates are partial updates and need the account', () => {
  const p = result(run(['campaigns','update','--account-id','123','--id','456','--status','PAUSED']))
  assert.equal(p.url, 'https://api.linkedin.com/rest/adAccounts/123/adCampaigns/456'); assert.equal(p.headers['X-RestLi-Method'], 'PARTIAL_UPDATE')
  assert.deepEqual(p.body, {patch:{$set:{status:'PAUSED'}}})
  assert.match(result(run(['campaigns','update','--id','456','--status','PAUSED'], noFetch)).error, /account-id/)
})
test('analytics uses Rest.li date ranges and encoded campaign URNs', () => {
  const p = result(run(['campaigns','analytics','--id','456','--start','2026-09-01','--end','2026-09-30']))
  assert.match(p.url, /\/rest\/adAnalytics\?q=analytics&pivot=CAMPAIGN&timeGranularity=ALL&dateRange=\(start:\(year:2026,month:9,day:1\),end:\(year:2026,month:9,day:30\)\)&campaigns=List\(urn%3Ali%3AsponsoredCampaign%3A456\)/)
  assert.match(result(run(['campaigns','analytics','--id','456'], noFetch)).error, /--start/)
})
test('creatives use the criteria finder', () => {
  assert.equal(result(run(['creatives','list','--account-id','123','--campaign-id','456'])).url,
    'https://api.linkedin.com/rest/adAccounts/123/creatives?q=criteria&campaigns=List(urn%3Ali%3AsponsoredCampaign%3A456)')
})
test('dry run masks the token', () => {
  const p = result(run(['accounts','list','--dry-run'], noFetch))
  assert.equal(p.headers.Authorization, 'Bearer ***'); assert.equal(JSON.stringify(p).includes('test-token'), false)
})
