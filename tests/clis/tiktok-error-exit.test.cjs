const {test} = require('node:test')
const assert = require('node:assert/strict')
const {spawnSync} = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/tiktok-ads.js')
function run(args, status, body) {
  const script = `global.fetch = async () => new Response(${JSON.stringify(typeof body === 'string' ? body : JSON.stringify(body))},{status:${status}}); process.argv = ['node',${JSON.stringify(cli)},...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath,['-e',script],{encoding:'utf8',timeout:10000,env:{...process.env,TIKTOK_ACCESS_TOKEN:'fixture-token',TIKTOK_ADVERTISER_ID:'1'}})
}
for(const args of [['campaigns','list'],['campaigns','create','--name','Fixture','--objective','TRAFFIC']]) {
  test(`${args.slice(0,2).join(' ')} returns failure for an HTTP200 API error without discarding its details`,()=>{
    const body={code:40104,message:'Access token is null',request_id:'fixture-request-id',data:{}}
    const result=run(args,200,body)
    assert.equal(result.status,1)
    assert.deepEqual(JSON.parse(result.stdout),body)
    assert.equal(result.stderr,'')
  })
}
test('a rejected HTTP response with JSON exits nonzero and retains its payload',()=>{
  const body={message:'upstream unavailable'}
  const result=run(['campaigns','list'],503,body)
  assert.equal(result.status,1)
  assert.deepEqual(JSON.parse(result.stdout),body)
})
test('a rejected HTTP response with text exits nonzero and retains status and body',()=>{
  const result=run(['campaigns','list'],502,'upstream unavailable')
  assert.equal(result.status,1)
  assert.deepEqual(JSON.parse(result.stdout),{status:502,body:'upstream unavailable'})
})
test('zero API code remains successful',()=>{
  const body={code:0,message:'OK',data:{list:[]}}
  const result=run(['campaigns','list'],200,body)
  assert.equal(result.status,0,result.stderr)
  assert.deepEqual(JSON.parse(result.stdout),body)
})
test('successful response without optional code remains successful',()=>{
  const body={data:{list:[]}}
  const result=run(['campaigns','list'],200,body)
  assert.equal(result.status,0,result.stderr)
  assert.deepEqual(JSON.parse(result.stdout),body)
})
test('preview remains successful and hides the access token',()=>{
  const result=run(['campaigns','list','--dry-run'],200,{code:40104})
  assert.equal(result.status,0,result.stderr)
  const preview=JSON.parse(result.stdout)
  assert.equal(preview._dry_run,true)
  assert.equal(preview.headers['Access-Token'],'***')
})
