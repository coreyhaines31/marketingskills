const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/google-ads.js')
const rows = [{results:[{campaign:{id:'9007199254740993',name:'Owned'},metrics:{costMicros:'1500001'}}]}, {results:[{campaign:{id:'42'}}]}]
function run(args, oracle = '') {
  const code = `global.fetch = async (url, options) => {
    const assert = require('node:assert/strict'); const body = JSON.parse(options.body);
    assert.equal(url, 'https://googleads.googleapis.com/v24/customers/5556667777/googleAds:searchStream');
    assert.equal(options.method, 'POST'); assert.equal(options.headers.Authorization, 'Bearer owned-token');
    assert.equal(options.headers['developer-token'], 'owned-developer'); assert.equal(options.headers['login-customer-id'], '1234567890');
    ${oracle}
    return new Response(JSON.stringify(${JSON.stringify(rows)}), {status:200});
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', code], {encoding:'utf8', timeout:10000,
    env:{...process.env, GOOGLE_ADS_TOKEN:'owned-token', GOOGLE_ADS_DEVELOPER_TOKEN:'owned-developer', GOOGLE_ADS_CUSTOMER_ID:'5556667777', GOOGLE_ADS_LOGIN_CUSTOMER_ID:'123-456-7890'}})
}
function result(r) {assert.equal(r.status,0,r.stderr); return JSON.parse(r.stdout)}
for(const query of ["SELECT campaign.id, segments.date, metrics.clicks FROM campaign WHERE segments.date BETWEEN '2026-01-01' AND '2026-01-03' LIMIT 20", "SELECT campaign.name\nFROM campaign WHERE campaign.name = 'Owned café' LIMIT 1"])
 test('runs caller query verbatim and retains stream chunks and integer strings '+query.slice(0,30),()=>{
  assert.deepEqual(result(run(['query','run','--query',query], `assert.deepEqual(body, {query:${JSON.stringify(query)}});`)), rows)
 })
test('query preview masks credentials without requesting account data',()=>{
 const query='SELECT customer.id FROM customer LIMIT 1'
 const preview=result(run(['query','run','--query',query,'--dry-run'], "throw new Error('unexpected fetch')"))
 assert.equal(preview._dry_run,true);assert.equal(preview.headers.Authorization,'***');assert.equal(preview.headers['developer-token'],'***');assert.equal(preview.headers['login-customer-id'],'1234567890');assert.deepEqual(preview.body,{query})
})
for(const args of [['query','run'],['query','run','--query'],['query','run','--query','   '],['query','unknown','--query','SELECT customer.id FROM customer']])
 test('invalid custom query fails before transport '+args.join(' '),()=>{
 const r=run(args,"throw new Error('unexpected fetch')");assert.notEqual(r.status,0);assert.match(r.stderr,/query|subcommand/);assert.doesNotMatch(r.stderr,/unexpected fetch/)
 })
test('existing account request remains unchanged',()=>{
 assert.deepEqual(result(run(['account','info'], "assert.deepEqual(body,{query:'SELECT customer.id, customer.descriptive_name FROM customer'});")),rows)
})
test('no-argument help remains successful and describes custom queries',()=>{
 const help=result(run([],"throw new Error('unexpected fetch')"));assert.match(help.usage.query,/query.*run/)
})
