const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/intercom.js')
function run(args, oracle = "throw new Error('unexpected fetch')", response = "new Response(JSON.stringify({accepted:true}))") {
  const code = `global.fetch = async (url, options) => { const assert = require('node:assert/strict'); const parsed = new URL(url); const body = options.body ? JSON.parse(options.body) : undefined; ${oracle}; return ${response}; }; process.argv = ['node',${JSON.stringify(cli)},...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const r = spawnSync(process.execPath,['-e',code],{encoding:'utf8',timeout:10000,env:{...process.env,INTERCOM_API_KEY:'fixture-token'}})
  assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout)
}

const required = ['--body','hello','--admin-id','123','--to','user1']
for (const type of [undefined,'inapp','in_app']) {
  test(`in-app message request uses in_app for ${type || 'default'}`, () => {
    const args = ['messages','create',...required,...(type ? ['--type',type] : [])]
    assert.equal(run(args, "assert.equal(parsed.pathname,'/messages'); assert.equal(options.method,'POST'); assert.deepEqual(body,{message_type:'in_app',body:'hello',from:{type:'admin',id:'123'},to:{type:'user',id:'user1'}});").accepted,true)
  })
}
for (const template of [undefined,'personal']) {
  test(`email includes required subject and ${template || 'plain'} template`, () => {
    assert.equal(run(['messages','create',...required,'--type','email','--subject','Welcome',...(template ? ['--template',template] : [])], `assert.equal(body.message_type,'email'); assert.equal(body.subject,'Welcome'); assert.equal(body.template,${JSON.stringify(template || 'plain')});`).accepted,true)
  })
}
test('missing email subject never sends', () => assert.match(run(['messages','create',...required,'--type','email']).error,/subject/))
test('unsupported message type never sends', () => assert.match(run(['messages','create',...required,'--type','sms']).error,/type/))
test('unsupported email template never sends', () => assert.match(run(['messages','create',...required,'--type','email','--subject','Welcome','--template','custom']).error,/template/))
test('email preview is complete and stays offline', () => {
  const p=run(['messages','create',...required,'--type','email','--subject','Welcome','--dry-run'])
  assert.equal(p.body.subject,'Welcome');assert.equal(p.body.template,'plain');assert.equal(p.headers.Authorization,'***')
})
