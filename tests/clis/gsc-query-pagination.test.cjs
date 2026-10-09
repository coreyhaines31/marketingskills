const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/google-search-console.js')
function run(args, oracle='') {
  const fixture = `global.fetch=async(url,options)=>{
    const assert=require('node:assert/strict');const body=options.body?JSON.parse(options.body):undefined;${oracle}
    assert.equal(url,'https://searchconsole.googleapis.com/webmasters/v3/sites/sc-domain%3Aexample.com/searchAnalytics/query');
    assert.equal(options.method,'POST');assert.equal(options.headers.Authorization,'Bearer fixture-token');
    const index=body.startRow||0;
    return new Response(JSON.stringify({rows:index>1?[]:[{keys:[index?'second':'first'],clicks:index?5:10,impressions:100,ctr:0.1,position:2}],responseAggregationType:'auto',request:body}),{status:200});
  };process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath,['-e',fixture],{encoding:'utf8',timeout:10000,env:{...process.env,GSC_ACCESS_TOKEN:'fixture-token'}})
}
function output(result){assert.equal(result.status,0,result.stderr);return JSON.parse(result.stdout)}
const query=sub=>['search',sub,'--site-url','sc-domain:example.com','--start-date','2026-09-01','--end-date','2026-09-30']
for(const [sub,dimension] of [['query','query'],['pages','page'],['countries','country']])test(`${sub} reads a later page with the same date range and dimension`,()=>{
  const first=output(run([...query(sub),'--limit','1']))
  const next=output(run([...query(sub),'--limit','1','--start-row','1']))
  assert.equal(next.request.startRow,1);assert.deepEqual(next.request.dimensions,[dimension]);assert.equal(next.rows[0].keys[0],'second')
  const {startRow,...request}=next.request;assert.deepEqual(request,first.request)
})
test('empty page preserves provider success and aggregation metadata',()=>{
  const result=output(run([...query('query'),'--start-row','2']))
  assert.deepEqual(result.rows,[]);assert.equal(result.responseAggregationType,'auto')
})
test('zero start row and maximum page size are visible in masked preview',()=>{
  const result=output(run([...query('pages'),'--limit','25000','--start-row','0','--dry-run'],"throw new Error('unexpected request')"))
  assert.equal(result.body.rowLimit,25000);assert.equal(result.body.startRow,0);assert.equal(result.headers.Authorization,'***')
})
test('default page retains row limit 100 and omits optional offset',()=>{
  const request=output(run(query('query'))).request
  assert.equal(request.rowLimit,100);assert.equal(Object.hasOwn(request,'startRow'),false)
})
for(const field of ['start-row','limit'])test(`invalid ${field} fails before a request`,()=>{
  const bad=field==='limit'?['0','-1','25001','1.5','1x']:['-1','1.5','1x','9007199254740993']
  for(const value of bad){const result=run([...query('query'),`--${field}`,value],"throw new Error('unexpected request')");assert.equal(result.status,1);assert.match(JSON.parse(result.stderr).error,new RegExp(`--${field}`))}
})
test('URL-prefix properties remain encoded as one path segment',()=>{
  const result=output(run(['search','query','--site-url','https://example.com/','--start-row','10','--dry-run'],"throw new Error('unexpected request')"))
  assert.equal(result.url,'https://searchconsole.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fexample.com%2F/searchAnalytics/query');assert.equal(result.body.startRow,10)
})
test('inspection stays independent of search page flags',()=>{
  const result=output(run(['inspect','url','--site-url','sc-domain:example.com','--url','https://example.com/page','--start-row','bad','--limit','bad','--dry-run'],"throw new Error('unexpected request')"))
  assert.deepEqual(result.body,{inspectionUrl:'https://example.com/page',siteUrl:'sc-domain:example.com'})
})
