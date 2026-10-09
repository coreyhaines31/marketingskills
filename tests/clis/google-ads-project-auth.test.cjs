const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/google-ads.js')
function run(args, env = {}, oracle = '') {
  const code = `global.fetch = async (url, options) => {
    const assert = require('node:assert/strict');
    assert.equal(url, 'https://googleads.googleapis.com/v24/customers/5556667777/googleAds:searchStream');
    assert.equal(options.method, 'POST');
    assert.equal(options.headers.Authorization, 'Bearer test-token');
    ${oracle}
    return new Response(JSON.stringify([{results:[{customer:{id:'5556667777'}}]}]), {status:200});
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const childEnv = {...process.env, GOOGLE_ADS_TOKEN:'test-token', GOOGLE_ADS_CUSTOMER_ID:'5556667777', GOOGLE_ADS_DEVELOPER_TOKEN:undefined, GOOGLE_ADS_LOGIN_CUSTOMER_ID:undefined, ...env}
  for (const [key, value] of Object.entries(childEnv)) if (value === undefined) delete childEnv[key]
  return spawnSync(process.execPath, ['-e', code], {encoding:'utf8', env:childEnv, timeout:10000})
}
function result(r) { assert.equal(r.status, 0, r.stderr); return JSON.parse(r.stdout) }
test('Cloud-project OAuth access does not require a sunset developer token', () => {
  const p = result(run(['account', 'info'], {}, "assert.equal(Object.hasOwn(options.headers, 'developer-token'), false); assert.equal(JSON.parse(options.body).query, 'SELECT customer.id, customer.descriptive_name FROM customer');"))
  assert.equal(p[0].results[0].customer.id, '5556667777')
})
test('manager OAuth access still forwards normalized login customer without developer token', () => {
  assert.ok(Array.isArray(result(run(['campaigns','list'], {GOOGLE_ADS_LOGIN_CUSTOMER_ID:'123-456-7890'}, "assert.equal(options.headers['login-customer-id'], '1234567890'); assert.equal(Object.hasOwn(options.headers, 'developer-token'), false);"))))
})
test('preview without developer token has no phantom developer header and no fetch', () => {
  const p = result(run(['account','info','--dry-run'], {}, "throw new Error('unexpected fetch')"))
  assert.equal(p._dry_run, true); assert.equal(p.headers.Authorization,'***')
  assert.equal(Object.hasOwn(p.headers,'developer-token'),false)
})
test('legacy developer token remains optional and forwarded when supplied', () => {
  assert.ok(Array.isArray(result(run(['account','info'], {GOOGLE_ADS_DEVELOPER_TOKEN:'legacy-token'}, "assert.equal(options.headers['developer-token'], 'legacy-token');"))))
})
test('legacy developer token preview stays masked', () => {
  const p = result(run(['account','info','--dry-run'], {GOOGLE_ADS_DEVELOPER_TOKEN:'legacy-token'}, "throw new Error('unexpected fetch')"))
  assert.equal(p.headers['developer-token'],'***'); assert.doesNotMatch(JSON.stringify(p),/legacy-token|test-token/)
})
for (const name of ['GOOGLE_ADS_TOKEN','GOOGLE_ADS_CUSTOMER_ID']) test(`${name} remains required`, () => {
  const r = run(['account','info'], {[name]:undefined}, "throw new Error('unexpected fetch')")
  assert.equal(r.status,1); assert.equal(r.stdout,''); assert.match(JSON.parse(r.stderr).error,new RegExp(name))
})
test('help still runs without credentials', () => {
  const r = run([], {GOOGLE_ADS_TOKEN:undefined,GOOGLE_ADS_CUSTOMER_ID:undefined}, "throw new Error('unexpected fetch')")
  assert.equal(result(r).error,'Unknown command')
})
