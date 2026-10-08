const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/instantly.js')
function run(args, oracle = '', env = {}) {
  const code = `global.fetch = async (url, options) => {
    const assert = require('node:assert/strict');
    const parsed = new URL(url);
    const body = options.body ? JSON.parse(options.body) : null;
    ${oracle}
    return new Response(JSON.stringify({accepted:true, url, method: options.method, body, auth: options.headers.Authorization}), {status:200});
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const childEnv = {...process.env, INSTANTLY_API_KEY:'test-key', ...env}
  for (const [key, value] of Object.entries(childEnv)) if (value === undefined) delete childEnv[key]
  return spawnSync(process.execPath, ['-e', code], {encoding:'utf8', env:childEnv, timeout:10000})
}
function result(r) { assert.equal(r.status,0,r.stderr); return JSON.parse(r.stdout) }
const noFetch = "throw new Error('unexpected fetch')"

test('requests go to API v2 with Bearer auth and no key in the URL', () => {
  const p = result(run(['campaigns','list','--limit','5'], "assert.equal(parsed.pathname, '/api/v2/campaigns'); assert.equal(parsed.searchParams.get('limit'),'5'); assert.equal(parsed.searchParams.has('api_key'), false);"))
  assert.equal(p.auth,'Bearer test-key')
})
test('campaign activate and pause use the dedicated v2 endpoints', () => {
  assert.equal(result(run(['campaigns','activate','--id','c1'], "assert.equal(parsed.pathname, '/api/v2/campaigns/c1/activate'); assert.equal(options.method,'POST');")).accepted, true)
  assert.equal(result(run(['campaigns','pause','--id','c1'], "assert.equal(parsed.pathname, '/api/v2/campaigns/c1/pause');")).accepted, true)
})
test('adding a lead targets a campaign in the body', () => {
  const p = result(run(['leads','add','--campaign-id','c1','--email','jane@acme.com','--company','Acme','--skip-if-in-workspace'], "assert.equal(parsed.pathname, '/api/v2/leads');"))
  assert.deepEqual(p.body, {email:'jane@acme.com', campaign:'c1', company_name:'Acme', skip_if_in_workspace:true})
})
test('adding a lead requires exactly one destination', () => {
  assert.match(result(run(['leads','add','--email','a@b.com'], noFetch)).error, /campaign-id or --list-id/)
  assert.match(result(run(['leads','add','--email','a@b.com','--campaign-id','c','--list-id','l'], noFetch)).error, /not both/)
})
test('bulk add sends the file contents and rejects oversize files', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'instantly-'))
  const good = path.join(dir, 'good.json'); fs.writeFileSync(good, JSON.stringify([{email:'a@b.com'},{email:'c@d.com'}]))
  const p = result(run(['leads','bulk-add','--list-id','l1','--file',good], "assert.equal(parsed.pathname, '/api/v2/leads/add');"))
  assert.equal(p.body.list_id,'l1'); assert.equal(p.body.leads.length,2)
  const big = path.join(dir, 'big.json'); fs.writeFileSync(big, JSON.stringify(Array.from({length:1001}, (_, i) => ({email:`u${i}@x.com`}))))
  assert.match(result(run(['leads','bulk-add','--list-id','l1','--file',big], noFetch)).error, /1 to 1000/)
})
test('interest status maps names to Instantly values and rejects unknown names', () => {
  const p = result(run(['leads','interest','--email','a@b.com','--status','wrong-person'], "assert.equal(parsed.pathname, '/api/v2/leads/update-interest-status');"))
  assert.deepEqual(p.body, {lead_email:'a@b.com', interest_value:-2})
  assert.match(result(run(['leads','interest','--email','a@b.com','--status','maybe'], noFetch)).error, /Unknown --status/)
})
test('replies list only received emails', () => {
  assert.equal(result(run(['emails','replies','--campaign-id','c1','--unread'], "assert.equal(parsed.pathname, '/api/v2/emails'); assert.equal(parsed.searchParams.get('email_type'),'received'); assert.equal(parsed.searchParams.get('is_unread'),'true');")).accepted, true)
})
test('blocklist add uses bulk create', () => {
  const p = result(run(['blocklist','add','--entries','acme.com, a@b.com'], "assert.equal(parsed.pathname, '/api/v2/block-lists-entries/bulk-create');"))
  assert.deepEqual(p.body, {bl_values:['acme.com','a@b.com']})
})
test('dry run masks the key and makes no request', () => {
  const p = result(run(['accounts','warmup-analytics','--emails','a@x.com,b@x.com','--dry-run'], noFetch))
  assert.equal(p.headers.Authorization,'Bearer ***'); assert.deepEqual(p.body,{emails:['a@x.com','b@x.com']})
  assert.equal(JSON.stringify(p).includes('test-key'), false)
})
