const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/brevo.js')
function run(args, oracle='') {
  const code=`global.fetch=async(url,options)=>{const assert=require('node:assert/strict');${oracle};return new Response(JSON.stringify({id:21}),{status:200})};process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath,['-e',code],{encoding:'utf8',timeout:10000,env:{...process.env,BREVO_API_KEY:'fixture-token'}})
}
function output(r){assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout)}
for(const operation of ['create','update']) {
  const args=['contacts',operation,'--email','owned+test@example.com']
  const resource=operation==='create'?'/contacts':'/contacts/owned%2Btest%40example.com'
  const legacy=operation==='create'?{email:'owned+test@example.com'}:{}
  for(const [flag,field] of [['email-blacklisted','emailBlacklisted'],['sms-blacklisted','smsBlacklisted']]) {
    for(const value of [true,false]) test(`${operation} preserves ${field} literal ${value}`,()=>{
      output(run([...args,'--'+flag,String(value)],`assert.equal(url,${JSON.stringify('https://api.brevo.com/v3'+resource)});assert.equal(options.method,${JSON.stringify(operation==='create'?'POST':'PUT')});assert.equal(options.headers['api-key'],'fixture-token');assert.deepEqual(JSON.parse(options.body),${JSON.stringify({...legacy,[field]:value})})`))
    })
    for(const bad of [[],['yes'],['FALSE']]) test(`${operation} rejects ${flag} ${bad.join(' ')||'without a value'} before transport`,()=>{
      const result=run([...args,'--'+flag,...bad],"throw new Error('unexpected fetch')")
      assert.notEqual(result.status,0);assert.match(result.stderr,/must be true or false/);assert.doesNotMatch(result.stderr,/unexpected fetch/)
    })
  }
  test(`${operation} combines independent channels and preserves existing attributes and lists`,()=>{
    output(run([...args,'--first-name','Owned','--list-ids','2,3','--email-blacklisted','true','--sms-blacklisted','false'],`assert.deepEqual(JSON.parse(options.body),${JSON.stringify({...legacy,attributes:{FIRSTNAME:'Owned'},listIds:[2,3],emailBlacklisted:true,smsBlacklisted:false})})`))
  })
  test(`${operation} omits unsupplied suppression fields`,()=>{
    output(run(args,`assert.deepEqual(JSON.parse(options.body),${JSON.stringify(legacy)})`))
  })
  test(`${operation} previews explicit false offline with masked credentials`,()=>{
    const preview=output(run([...args,'--email-blacklisted','false','--sms-blacklisted','true','--dry-run'],"throw new Error('unexpected fetch')"))
    assert.deepEqual(preview.body,{...legacy,emailBlacklisted:false,smsBlacklisted:true});assert.equal(preview.headers['api-key'],'***')
  })
}
test('contact read preserves returned suppression flags',()=>{
  const result=output(run(['contacts','get','--email','owned@example.com'],"assert.equal(url,'https://api.brevo.com/v3/contacts/owned%40example.com');return new Response(JSON.stringify({id:21,emailBlacklisted:true,smsBlacklisted:false}),{status:200})"))
  assert.deepEqual(result,{id:21,emailBlacklisted:true,smsBlacklisted:false})
})
