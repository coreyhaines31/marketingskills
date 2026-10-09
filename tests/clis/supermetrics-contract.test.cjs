const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/supermetrics.js')
function run(args, network = true, status = 200) {
  const source = `global.fetch=async(url,options)=>{
    if(!${network}) throw new Error('Unexpected network request');
    return {ok:${status}<400,status:${status},text:async()=>JSON.stringify({url,method:options.method,headers:options.headers,body:options.body?JSON.parse(options.body):null})};
  }; process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath,['-e',source],{encoding:'utf8',timeout:5000,
    env:{...process.env,SUPERMETRICS_API_KEY:'fixture-key'}})
}
function output(r) { assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout) }
const query=['query','--ds-id','GA4','--ds-accounts','123,456','--date-range','last_month','--fields','sessions, date']
test('query uses supported Bearer authentication and field IDs',()=>{
  const r=output(run(query));assert.equal(r.headers.Authorization,'Bearer fixture-key')
  assert.equal(Object.hasOwn(r.headers,'x-api-key'),false)
  assert.equal(r.url,'https://api.supermetrics.com/query/data/json')
  assert.deepEqual(r.body.fields,[{id:'sessions'},{id:'date'}])
  assert.equal(r.body.ds_accounts,'123,456');assert.equal(r.body.date_range_type,'last_month')
})
test('query custom range retains exact dates and filters',()=>{
  const r=output(run([...query.slice(0,5),'--date-range','custom','--fields','date','--start-date','2026-09-01','--end-date','2026-09-20','--filter','sessions > 10','--max-rows','25']))
  assert.equal(r.body.start_date,'2026-09-01');assert.equal(r.body.end_date,'2026-09-20')
  assert.equal(r.body.filter,'sessions > 10');assert.equal(r.body.max_rows,25)
})
test('last_28_days shorthand resolves to documented relative date strings',()=>{
  const r=output(run(['query','--ds-id','GA4','--ds-accounts','123','--date-range','last_28_days','--fields','sessions']))
  assert.equal(r.body.date_range_type,'custom');assert.equal(r.body.start_date,'-28 days');assert.equal(r.body.end_date,'yesterday')
})
test('query preview masks credentials and sends no request',()=>{
  const r=output(run([...query,'--dry-run'],false));assert.equal(r.headers.Authorization,'Bearer ***')
  assert.equal(JSON.stringify(r).includes('fixture-key'),false)
})
test('sources uses the public discovery route',()=>{assert.equal(output(run(['sources','list'])).url,'https://api.supermetrics.com/datasource/search')})
test('accounts uses query/accounts with an encoded source ID',()=>{
  const r=output(run(['accounts','list','--ds-id','GA4']));assert.equal(r.url,'https://api.supermetrics.com/query/accounts?ds_id=GA4')
})
test('team lookup requires a team ID and uses the management route',()=>{
  const r=output(run(['teams','get','--team-id','123']));assert.equal(r.url,'https://api.supermetrics.com/v1/teams/123')
})
test('users list is scoped to the requested team',()=>{
  const r=output(run(['users','list','--team-id','123']));assert.equal(r.url,'https://api.supermetrics.com/v1/teams/123/users')
})
test('undocumented team list no longer dispatches a fictional endpoint',()=>{
  assert.match(output(run(['teams','list'],false)).error,/teams get/)
})
test('missing team scope fails before a request',()=>{
  assert.match(output(run(['users','list'],false)).error,/team-id/)
})
test('invalid team ID cannot change the resource path',()=>{
  assert.match(output(run(['teams','get','--team-id','1/users'],false)).error,/team-id/)
})
test('empty field IDs are rejected before a query',()=>{
  assert.match(output(run(['query','--ds-id','GA4','--ds-accounts','123','--date-range','last_month','--fields','sessions,,date'],false)).error,/fields/)
})
test('custom dates must be complete before a query',()=>{
  assert.match(output(run(['query','--ds-id','GA4','--ds-accounts','123','--date-range','custom','--fields','date'],false)).error,/start-date.*end-date/)
})
test('provider failure exits unsuccessfully',()=>{
  const r=run(query,true,401);assert.equal(r.status,1);assert.match(r.stderr,/401/)
})
