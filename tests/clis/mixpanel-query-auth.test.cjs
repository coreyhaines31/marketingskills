const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/mixpanel.js')
function run(args, oracle = '', env = {}) {
  const code = `global.fetch = async (url, options) => {
    const assert = require('node:assert/strict');
    const parsed = new URL(url);
    const body = options.body ? JSON.parse(options.body) : null;
    ${oracle}
    return new Response(JSON.stringify({accepted:true, url, body}), {status:200});
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const childEnv = {...process.env, MIXPANEL_TOKEN:'test-token', MIXPANEL_SECRET:'test-secret', ...env}
  for (const [key, value] of Object.entries(childEnv)) if (value === undefined) delete childEnv[key]
  const r = spawnSync(process.execPath, ['-e', code], {encoding:'utf8', env:childEnv, timeout:10000})
  return r
}
function result(r) { assert.equal(r.status,0,r.stderr); return JSON.parse(r.stdout) }
for (const args of [['export','events','--from-date','2026-09-01','--to-date','2026-09-02'], ['retention','get','--from-date','2026-09-01','--to-date','2026-09-02']]) test(`${args[0]} authenticates with project secret and an empty password`, () => {
  const p = result(run(args, "assert.equal(options.headers.Authorization, 'Basic ' + Buffer.from('test-secret:').toString('base64'));", {MIXPANEL_TOKEN:undefined,MIXPANEL_API_KEY:undefined}))
  assert.equal(p.accepted,true)
})
test('deprecated API key does not replace secret in Basic username', () => {
  assert.equal(result(run(['funnels','get','--funnel-id','42'], "assert.equal(options.headers.Authorization, 'Basic ' + Buffer.from('test-secret:').toString('base64'));", {MIXPANEL_API_KEY:'old-key'})).accepted,true)
})
test('ingestion token authentication remains unchanged', () => {
  const p = result(run(['track','event','--distinct-id','user123','--event','Signup'], "assert.equal(body[0].properties.token, 'test-token');", {MIXPANEL_SECRET:undefined,MIXPANEL_API_KEY:undefined}))
  assert.equal(p.body[0].event,'Signup')
})
test('query rejects missing project secret without making a request', () => {
  const p = result(run(['funnels','get','--funnel-id','42'], "throw new Error('unexpected fetch')", {MIXPANEL_SECRET:undefined}))
  assert.match(p.error,/MIXPANEL_SECRET/)
})
test('secret-only query dry-run masks authorization', () => {
  const p = result(run(['funnels','get','--funnel-id','42','--dry-run'], "throw new Error('unexpected fetch')", {MIXPANEL_TOKEN:undefined,MIXPANEL_API_KEY:undefined}))
  assert.equal(p.headers.Authorization,'***'); assert.ok(!JSON.stringify(p).includes('test-secret'))
})
