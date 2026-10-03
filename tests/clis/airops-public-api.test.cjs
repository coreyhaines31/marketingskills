const {test}=require('node:test')
const assert=require('node:assert/strict')
const {spawnSync}=require('node:child_process')
const path=require('node:path')
const cli=path.resolve(__dirname,'../../tools/clis/airops.js')
function run(args,oracle="throw new Error('unexpected fetch')",workspace='legacy-workspace') {
 const code=`global.fetch=async(url,options)=>{const assert=require('node:assert/strict');const u=new URL(url);const body=options.body?JSON.parse(options.body):undefined;assert.equal(options.headers.Authorization,'Bearer fixture-key');${oracle};return new Response(JSON.stringify({accepted:true}));};process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
 const r=spawnSync(process.execPath,['-e',code],{encoding:'utf8',timeout:10000,env:{...process.env,AIROPS_API_KEY:'fixture-key',AIROPS_WORKSPACE_ID:workspace}});assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout)
}
for (const group of ['flows','workflows']) {
 test(`${group} list uses published app catalog`,()=>assert.equal(run([group,'list'],"assert.equal(u.href,'https://api.airops.com/public_api/airops_apps');assert.equal(options.method,'GET');").accepted,true))
 test(`${group} execution uses the app UUID and inputs object`,()=>assert.equal(run([group,'execute','--id','app-uuid','--inputs','{"topic":"SEO"}'],"assert.equal(u.href,'https://api.airops.com/public_api/airops_apps/app-uuid/execute');assert.equal(options.method,'POST');assert.deepEqual(body,{inputs:{topic:'SEO'}});").accepted,true))
}
test('app detail uses the app UUID route',()=>assert.equal(run(['flows','get','--id','app-uuid'],"assert.equal(u.href,'https://api.airops.com/public_api/airops_apps/app-uuid');").accepted,true))
test('run status uses the execution UUID route',()=>assert.equal(run(['flows','run-status','--run-id','run-uuid'],"assert.equal(u.href,'https://api.airops.com/public_api/airops_apps/executions/run-uuid');").accepted,true))
test('run history uses numeric app ID and forwards paging',()=>assert.equal(run(['flows','runs','--id','123','--cursor','cursor+/=','--items','25'],"assert.equal(u.pathname,'/public_api/airops_apps/123/executions');assert.equal(u.searchParams.get('airops_app_id'),'123');assert.equal(u.searchParams.get('cursor'),'cursor+/=');assert.equal(u.searchParams.get('items'),'25');").accepted,true))
test('public execution needs the API key but no workspace environment variable',()=>assert.equal(run(['flows','execute','--id','app-uuid'],"assert.deepEqual(body,{inputs:{}});",'').accepted,true))
for (const inputs of ['{broken','null','[]']) {
 test(`invalid input object ${inputs} never fetches`,()=>assert.match(run(['flows','execute','--id','app-uuid','--inputs',inputs]).error,/inputs/))
}
test('run history rejects UUID where a numeric app ID is required',()=>assert.match(run(['flows','runs','--id','app-uuid']).error,/numeric/))
test('execution preview uses public route and stays offline',()=>{const p=run(['workflows','execute','--id','app-uuid','--dry-run']);assert.equal(p.url,'https://api.airops.com/public_api/airops_apps/app-uuid/execute');assert.equal(p.headers.Authorization,'Bearer ***')})
