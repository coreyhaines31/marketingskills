const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/truelist.js')
function run(args, oracle = '', env = {}) {
  const code = `global.fetch = async (url, options) => {
    const assert = require('node:assert/strict');
    const parsed = new URL(url);
    const form = options.body ? Object.fromEntries(new URLSearchParams(options.body)) : null;
    ${oracle}
    return new Response(JSON.stringify({accepted:true, url, method: options.method, form, auth: options.headers.Authorization, type: options.headers['Content-Type']}), {status:200});
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const childEnv = {...process.env, TRUELIST_API_KEY:'test-key', ...env}
  for (const [key, value] of Object.entries(childEnv)) if (value === undefined) delete childEnv[key]
  return spawnSync(process.execPath, ['-e', code], {encoding:'utf8', env:childEnv, timeout:10000})
}
function result(r) { assert.equal(r.status,0,r.stderr); return JSON.parse(r.stdout) }
const noFetch = "throw new Error('unexpected fetch')"
function tmp(name, content) { const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'truelist-')); const f = path.join(dir, name); fs.writeFileSync(f, content); return f }

test('inline verify sends emails space-separated with Bearer auth', () => {
  const p = result(run(['verify','--email','a@x.com, b@y.com','--strategy','enhanced'], "assert.equal(parsed.pathname, '/api/v1/verify_inline'); assert.equal(parsed.searchParams.get('email'),'a@x.com b@y.com'); assert.equal(parsed.searchParams.get('validation_strategy'),'enhanced'); assert.equal(options.method,'POST');"))
  assert.equal(p.auth,'Bearer test-key')
})
test('inline verify rejects an unknown strategy without a request', () => {
  assert.match(result(run(['verify','--email','a@x.com','--strategy','slow'], noFetch)).error, /strategy/)
})
test('batch create posts form data rows from a CSV with a header', () => {
  const f = tmp('leads.csv', 'email,company\na@x.com,Acme\nb@y.com,Beta\na@x.com,Acme\n')
  const p = result(run(['batch','create','--file',f,'--name','Q4 list','--webhook-url','https://example.com/hook'], "assert.equal(parsed.pathname, '/api/v1/batches');"))
  assert.equal(p.type,'application/x-www-form-urlencoded')
  assert.deepEqual(JSON.parse(p.form.data), [['a@x.com'],['b@y.com']])
  assert.equal(p.form.filename,'Q4 list'); assert.equal(p.form.webhook_url,'https://example.com/hook')
})
test('batch create accepts a JSON array and needs at least two addresses', () => {
  const p = result(run(['batch','create','--file',tmp('a.json','["a@x.com","b@y.com"]')], "assert.equal(parsed.pathname, '/api/v1/batches');"))
  assert.deepEqual(JSON.parse(p.form.data), [['a@x.com'],['b@y.com']])
  assert.match(result(run(['batch','create','--file',tmp('one.json','["a@x.com"]')], noFetch)).error, /at least 2/)
  assert.match(result(run(['batch','create','--file',tmp('b.json','["a@x.com","b@y.com"]'),'--strategy','enhanced'], noFetch)).error, /strategy/)
})
test('batch get and results filter by batch and state', () => {
  assert.equal(result(run(['batch','get','--id','u-1'], "assert.equal(parsed.pathname, '/api/v1/batches/u-1'); assert.equal(options.method,'GET');")).accepted, true)
  assert.equal(result(run(['results','--batch-id','u-1','--state','invalid','--per-page','100'], "assert.equal(parsed.pathname, '/api/v1/email_addresses'); assert.equal(parsed.searchParams.get('batch_uuid'),'u-1'); assert.equal(parsed.searchParams.get('email_state'),'invalid'); assert.equal(parsed.searchParams.get('per_page'),'100');")).accepted, true)
  assert.match(result(run(['results'], noFetch)).error, /required/)
})
test('dry run masks the key and makes no request', () => {
  const p = result(run(['account','--dry-run'], noFetch))
  assert.equal(p.url,'https://api.truelist.io/me'); assert.equal(p.headers.Authorization,'Bearer ***')
  assert.equal(JSON.stringify(p).includes('test-key'), false)
})
