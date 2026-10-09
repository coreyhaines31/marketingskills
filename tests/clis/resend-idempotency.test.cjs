const {test}=require('node:test')
const assert=require('node:assert/strict')
const {spawnSync}=require('node:child_process')
const path=require('node:path')
const cli=path.resolve(__dirname,'../../tools/clis/resend.js')
const send=['send','--from','sender@example.org','--to','user@example.org','--subject','Welcome']
const batch=['batch','--emails','[{"from":"sender@example.org","to":["user@example.org"],"subject":"Welcome"}]']
function run(args,network=true){
 const script=`global.fetch=async(url,options)=>{if(!${network})throw new Error('Unexpected network request');return {status:200,text:async()=>JSON.stringify({url,headers:options.headers,body:JSON.parse(options.body),id:'fixture-id'})}};process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)})`
 return spawnSync(process.execPath,['-e',script],{encoding:'utf8',timeout:5000,env:{PATH:process.env.PATH,RESEND_API_KEY:'fixture-secret'}})
}
function output(r){assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout)}
test('single and batch sends forward a caller-owned stable retry identity',()=>{
 for(const command of [send,batch]){
  const a=output(run([...command,'--idempotency-key','welcome/123']))
  const b=output(run([...command,'--idempotency-key','welcome/123']))
  assert.equal(a.headers['Idempotency-Key'],'welcome/123');assert.deepEqual(a,b)
  assert.equal(Object.hasOwn(a.body,'idempotency_key'),false)
 }
})
test('omission keeps existing requests and 256-character keys are accepted',()=>{
 assert.equal(Object.hasOwn(output(run(send)).headers,'Idempotency-Key'),false)
 assert.equal(output(run([...send,'--idempotency-key','a'.repeat(256)])).headers['Idempotency-Key'].length,256)
})
test('invalid keys and unsupported commands fail before a send',()=>{
 for(const args of [[...send,'--idempotency-key'],[...send,'--idempotency-key',''],[...batch,'--idempotency-key','x'.repeat(257)],[...send,'--idempotency-key','bad\r\nheader'],[...send,'--idempotency-key',' '],['emails','list','--idempotency-key','key']]){
  const r=run(args,false);assert.equal(r.status,1);assert.doesNotMatch(r.stderr,/Unexpected network request/)
 }
})
test('dry run exposes retry key without exposing credentials or fetching',()=>{
 const r=output(run([...send,'--idempotency-key','welcome/123','--dry-run'],false))
 assert.equal(r.headers['Idempotency-Key'],'welcome/123');assert.equal(r._dry_run,true)
 assert.equal(JSON.stringify(r).includes('fixture-secret'),false)
})
