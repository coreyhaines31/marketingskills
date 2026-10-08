const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/segment.js')
function run(args, oracle='') {
  const fixture=`global.fetch=async(url,options)=>{const assert=require('node:assert/strict');${oracle}
    return new Response(JSON.stringify({url,method:options.method,authorization:options.headers.Authorization,body:options.body?JSON.parse(options.body):undefined}),{status:200});
  };process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath,['-e',fixture],{encoding:'utf8',timeout:10000,env:{...process.env,SEGMENT_WRITE_KEY:'fixture-write',SEGMENT_ACCESS_TOKEN:'fixture-profile'}})
}
function output(result){assert.equal(result.status,0,result.stderr);return JSON.parse(result.stdout)}
for(const [command,path,extra,payload] of [
  [['track','event'],'track',['--event','Pricing Viewed','--properties','{"plan":"pro"}'],{event:'Pricing Viewed',properties:{plan:'pro'}}],
  [['page','view'],'page',['--name','Pricing','--properties','{"path":"/pricing"}'],{name:'Pricing',properties:{path:'/pricing'}}],
  [['identify','user'],'identify',['--traits','{"plan":"trial"}'],{traits:{plan:'trial'}}],
])test(`${path} supports an anonymous identity without inventing a user ID`,()=>{
  const result=output(run([...command,'--anonymous-id','anon-owned',...extra]))
  assert.equal(result.url,`https://api.segment.io/v1/${path}`);assert.equal(result.method,'POST')
  assert.equal(result.authorization,`Basic ${Buffer.from('fixture-write:').toString('base64')}`);assert.deepEqual(result.body,{anonymousId:'anon-owned',...payload})
})
test('identify preserves both known and anonymous IDs for the same caller identity',()=>{
  const result=output(run(['identify','user','--user-id','user-owned','--anonymous-id','anon-owned','--traits','{"plan":"paid"}']))
  assert.deepEqual(result.body,{userId:'user-owned',anonymousId:'anon-owned',traits:{plan:'paid'}})
})
test('known track keeps the original request body',()=>{
  const result=output(run(['track','event','--user-id','user-owned','--event','Signed Up']))
  assert.deepEqual(result.body,{userId:'user-owned',event:'Signed Up'})
})
test('anonymous page preview masks credentials without a request',()=>{
  const result=output(run(['page','view','--anonymous-id','anon-owned','--dry-run'],"throw new Error('unexpected request')"))
  assert.deepEqual(result.body,{anonymousId:'anon-owned'});assert.equal(result.headers.Authorization,'***')
})
test('a missing identity fails locally before collecting an event',()=>{
  for(const args of [['track','event','--event','Viewed'],['identify','user'],['page','view']]){
    const result=run(args,"throw new Error('unexpected request')")
    assert.equal(result.status,1);assert.match(JSON.parse(result.stderr).error,/--user-id or --anonymous-id/)
  }
})
test('profile lookups still require a known user and use the encoded profile path',()=>{
  const result=output(run(['profiles','traits','--space-id','space','--user-id','user-owned']))
  assert.equal(result.url,'https://profiles.segment.com/v1/spaces/space/collections/users/profiles/user_id:user-owned/traits');assert.equal(result.method,'GET')
})
