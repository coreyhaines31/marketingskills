const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/hotjar.js')
function run(args, oracle = "throw new Error('unexpected fetch')") {
  const code = `let calls=0; global.fetch=async (url,options)=>{ const assert=require('node:assert/strict');if(${JSON.stringify(args.includes('--dry-run'))})throw new Error('unexpected preview fetch');const u=new URL(url);calls++;if(calls===1){assert.equal(u.href,'https://api.hotjar.io/v1/oauth/token');assert.equal(options.method,'POST');assert.equal(options.headers['Content-Type'],'application/x-www-form-urlencoded');const form=new URLSearchParams(options.body);assert.equal(form.get('grant_type'),'client_credentials');assert.equal(form.get('client_id'),'fixture+/id');assert.equal(form.get('client_secret'),'fixture+/secret');return new Response(JSON.stringify({access_token:'fixture-token'}));}assert.equal(calls,2);assert.equal(options.headers.Authorization,'Bearer fixture-token');${oracle};return new Response(JSON.stringify({accepted:true}));};process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  const r=spawnSync(process.execPath,['-e',code],{encoding:'utf8',timeout:10000,env:{...process.env,HOTJAR_CLIENT_ID:'fixture+/id',HOTJAR_CLIENT_SECRET:'fixture+/secret'}})
  assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout)
}
test('survey list authenticates on v1 and forwards the cursor and page size',()=>assert.equal(run(['surveys','list','--site-id','42','--limit','25','--cursor','cursor+/='],"assert.equal(u.pathname,'/v1/sites/42/surveys');assert.equal(u.searchParams.get('limit'),'25');assert.equal(u.searchParams.get('cursor'),'cursor+/=');").accepted,true))
test('survey first page retains default page size without a cursor',()=>assert.equal(run(['surveys','list','--site-id','42'],"assert.equal(u.pathname,'/v1/sites/42/surveys');assert.equal(u.searchParams.get('limit'),'100');assert.equal(u.searchParams.has('cursor'),false);").accepted,true))
test('survey responses authenticate on v1 and preserve cursor',()=>assert.equal(run(['surveys','responses','--site-id','42','--survey-id','s1','--cursor','cursor+/='],"assert.equal(u.pathname,'/v1/sites/42/surveys/s1/responses');assert.equal(u.searchParams.get('cursor'),'cursor+/=');").accepted,true))
test('survey preview stays offline and masks authorization',()=>{const p=run(['surveys','list','--site-id','42','--cursor','next','--dry-run']);const u=new URL(p.url);assert.equal(u.pathname,'/v1/sites/42/surveys');assert.equal(u.searchParams.get('cursor'),'next');assert.equal(p.headers.Authorization,'***')})
test('missing survey ID never authenticates',()=>assert.match(run(['surveys','responses','--site-id','42']).error,/survey-id/))
