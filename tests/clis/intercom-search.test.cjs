const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/intercom.js')
function run(args, oracle = '') {
  const code = `global.fetch = async (url, options) => { const assert = require('node:assert/strict'); const parsed = new URL(url); const body = JSON.parse(options.body); ${oracle}; return new Response(JSON.stringify({accepted:true})); }; process.argv = ['node',${JSON.stringify(cli)},...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const r = spawnSync(process.execPath,['-e',code],{encoding:'utf8',timeout:10000,env:{...process.env,INTERCOM_API_KEY:'fixture-token'}})
  assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout)
}
for (const group of ['contacts','conversations']) {
  test(`${group} search sends next-page cursor in body with unchanged filter`, () => {
    assert.equal(run([group,'search','--field','email','--value','jane@example.com','--per-page','50','--starting-after','cursor+/='], `assert.equal(parsed.pathname,'/${group}/search'); assert.equal(options.method,'POST'); assert.deepEqual(body,{query:{field:'email',operator:'=',value:'jane@example.com'},pagination:{per_page:50,starting_after:'cursor+/='}});`).accepted,true)
  })
  test(`${group} first page retains normal pagination`, () => {
    assert.equal(run([group,'search','--field','id','--value','0012'], `assert.deepEqual(body.query,{field:'id',operator:'=',value:'0012'}); assert.equal(body.pagination,undefined);`).accepted,true)
  })
  for (const [field,operator,value] of [['created_at','>',1700000000],[group === 'contacts' ? 'unsubscribed_from_emails' : 'open','=',false],['id','IN',['0012','0034']]]) {
    test(`${group} search preserves typed JSON ${field}`, () => {
      assert.equal(run([group,'search','--field',field,'--operator',operator,'--value-json',JSON.stringify(value)], `assert.deepEqual(body.query,${JSON.stringify({field,operator,value})});`).accepted,true)
    })
  }
  test(`${group} invalid JSON never sends`, () => {
    assert.match(run([group,'search','--field','open','--value-json','{broken'], "throw new Error('unexpected fetch')").error,/Invalid JSON/)
  })
  test(`${group} next-page preview contains cursor and stays offline`, () => {
    const p = run([group,'search','--field','id','--value','0012','--starting-after','cursor','--dry-run'], "throw new Error('unexpected fetch')")
    assert.equal(p.body.pagination.starting_after,'cursor');assert.equal(p.headers.Authorization,'***')
  })
}
