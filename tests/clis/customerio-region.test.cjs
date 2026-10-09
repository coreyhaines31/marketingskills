const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/customer-io.js')
function run(args, region, oracle='') {
  const fixture=`global.fetch=async(url,options)=>{const assert=require('node:assert/strict');${oracle}
    return new Response(JSON.stringify({url,method:options.method,authorization:options.headers.Authorization,body:options.body?JSON.parse(options.body):undefined}),{status:200});
  };process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  const env={...process.env,CUSTOMERIO_SITE_ID:'fixture-site',CUSTOMERIO_API_KEY:'fixture-track',CUSTOMERIO_APP_KEY:'fixture-app'}
  delete env.CUSTOMERIO_REGION
  if(region!==undefined)env.CUSTOMERIO_REGION=region
  return spawnSync(process.execPath,['-e',fixture],{env,encoding:'utf8',timeout:10000})
}
function output(result){assert.equal(result.status,0,result.stderr);return JSON.parse(result.stdout)}
test('EU identify uses regional Track host and preserves basic auth/body',()=>{
  const result=output(run(['customers','identify','--id','owned-id','--email','owned@example.com'],'eu'))
  assert.equal(result.url,'https://track-eu.customer.io/api/v1/customers/owned-id');assert.equal(result.method,'PUT')
  assert.equal(result.authorization,`Basic ${Buffer.from('fixture-site:fixture-track').toString('base64')}`);assert.deepEqual(result.body,{email:'owned@example.com'})
})
test('EU customer reads use App host and bearer auth',()=>{
  const result=output(run(['customers','get','--id','owned-id'],'eu'))
  assert.equal(result.url,'https://api-eu.customer.io/v1/customers/owned-id/attributes');assert.equal(result.method,'GET');assert.equal(result.authorization,'Bearer fixture-app')
})
test('EU event requests retain event payload on regional Track host',()=>{
  const result=output(run(['customers','track-event','--id','owned-id','--name','Trial Started','--data','{"plan":"pro"}'],'eu'))
  assert.equal(result.url,'https://track-eu.customer.io/api/v1/customers/owned-id/events');assert.deepEqual(result.body,{name:'Trial Started',data:{plan:'pro'}})
})
test('EU transactional preview masks auth and makes no request',()=>{
  const result=output(run(['send','email','--message-id','7','--to','owned@example.com','--identifier-id','owned-id','--dry-run'],'eu',"throw new Error('unexpected request')"))
  assert.equal(result.url,'https://api-eu.customer.io/v1/send/email');assert.equal(result.headers.Authorization,'***');assert.deepEqual(result.body,{transactional_message_id:'7',to:'owned@example.com',identifiers:{id:'owned-id'}})
})
test('default region preserves US Track routing',()=>{
  assert.equal(output(run(['customers','identify','--id','owned-id'])).url,'https://track.customer.io/api/v1/customers/owned-id')
})
test('explicit US preserves App routing',()=>{
  assert.equal(output(run(['campaigns','list'],'us')).url,'https://api.customer.io/v1/campaigns')
})
test('unknown regions stop before sending or previewing',()=>{
  for(const region of ['ap','EU','https://other.example'])for(const preview of [[],['--dry-run']]){
    const result=run(['customers','identify','--id','owned-id',...preview],region,"throw new Error('unexpected request')")
    assert.equal(result.status,1);assert.match(JSON.parse(result.stderr).error,/CUSTOMERIO_REGION/)
  }
})
test('no-argument help remains available without credentials or valid region',()=>{
  const result=spawnSync(process.execPath,[cli],{env:{CUSTOMERIO_REGION:'invalid'},encoding:'utf8'})
  assert.equal(result.status,0);assert.ok(JSON.parse(result.stdout).usage)
})
