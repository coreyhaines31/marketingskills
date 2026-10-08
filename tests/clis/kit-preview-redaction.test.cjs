const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/kit.js')
function run(args, env, oracle = "throw new Error('unexpected fetch')") {
  const code = `global.fetch = async (url, options) => { const assert = require('node:assert/strict'); ${oracle}; return new Response(JSON.stringify({accepted:true})); }; process.argv = ['node',${JSON.stringify(cli)},...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const r = spawnSync(process.execPath,['-e',code],{encoding:'utf8',timeout:10000,env:{...process.env,KIT_API_KEY:'',KIT_API_SECRET:'',...env}})
  assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout)
}
for (const credential of ['fixtureASCII','fixture secret+/=&','fixture%2Bsecret']) {
  test(`subscriber preview redacts secret ${credential}`, () => {
    const p = run(['subscribers','list','--page','2','--dry-run'],{KIT_API_SECRET:credential})
    const u = new URL(p.url); assert.equal(u.searchParams.get('api_secret'),'***')
    assert.equal(u.searchParams.get('page'),'2')
    assert.equal(JSON.stringify(p).includes(credential),false)
  })
  test(`form preview redacts public key ${credential}`, () => {
    const p = run(['forms','list','--dry-run'],{KIT_API_KEY:credential})
    assert.equal(new URL(p.url).searchParams.get('api_key'),'***')
    assert.equal(JSON.stringify(p).includes(credential),false)
  })
}
test('query redaction does not overwrite identical non-secret parameter values', () => {
  const p = run(['subscribers','list','--page','2','--dry-run'],{KIT_API_SECRET:'2'})
  const u = new URL(p.url); assert.equal(u.searchParams.get('page'),'2'); assert.equal(u.searchParams.get('api_secret'),'***')
})
test('POST preview preserves payload and masks body authentication', () => {
  const p = run(['forms','subscribe','12','--email','jane@example.com','--dry-run'],{KIT_API_KEY:'fixture secret+/='})
  assert.deepEqual(p.body,{email:'jane@example.com',api_key:'***'})
})
test('actual query request retains original credential bytes', () => {
  assert.equal(run(['subscribers','list'],{KIT_API_SECRET:'fixture secret+/='}, `assert.equal(new URL(url).searchParams.get('api_secret'),'fixture secret+/='); assert.equal(options.method,'GET')`).accepted,true)
})
