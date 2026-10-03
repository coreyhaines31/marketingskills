const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/optimizely.js')
function run(args, oracle = "throw new Error('unexpected fetch')", response = "new Response(JSON.stringify({accepted:true}))") {
  const code = `global.fetch = async (url, options) => { const assert = require('node:assert/strict'); const parsed = new URL(url); const body = options.body ? JSON.parse(options.body) : undefined; ${oracle}; return ${response}; }; process.argv = ['node',${JSON.stringify(cli)},...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const r = spawnSync(process.execPath,['-e',code],{encoding:'utf8',timeout:10000,env:{...process.env,OPTIMIZELY_API_KEY:'fixture-token'}})
  assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout)
}

test('archive uses DELETE and accepts an empty 204 response', () => {
  assert.deepEqual(run(['experiments','archive','--id','123'],"assert.equal(parsed.href,'https://api.optimizely.com/v2/experiments/123'); assert.equal(options.method,'DELETE'); assert.equal(options.body,undefined);", "new Response(null,{status:204})"),{status:204,body:''})
})
test('archive preview uses the same DELETE contract without fetching', () => {
  const p=run(['experiments','archive','--id','123','--dry-run']);assert.equal(p.method,'DELETE');assert.equal(p.body,undefined);assert.equal(p.headers.Authorization,'***')
})
test('archive still requires the experiment id before fetching', () => assert.match(run(['experiments','archive']).error,/id/))
test('ordinary experiment edits remain PATCH', () => assert.equal(run(['experiments','update','--id','123','--name','Renamed'],"assert.equal(options.method,'PATCH');assert.deepEqual(body,{name:'Renamed'});").accepted,true))
