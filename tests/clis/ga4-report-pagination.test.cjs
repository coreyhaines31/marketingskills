const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/ga4.js')
const orders = [{dimension:{dimensionName:'date'}},{dimension:{dimensionName:'country'}}]
function run(args, oracle='') {
  const fixture = `global.fetch=async(url,options)=>{
    const assert=require('node:assert/strict');const body=JSON.parse(options.body);${oracle}
    assert.equal(url,'https://analyticsdata.googleapis.com/v1beta/properties/123:runReport');
    assert.equal(options.method,'POST');assert.equal(options.headers.Authorization,'Bearer fixture-token');
    const index=body.offset==='1'?1:0;
    return new Response(JSON.stringify({rowCount:2,dimensionHeaders:[{name:'date'},{name:'country'}],rows:[{dimensionValues:[{value:'20260901'},{value:index?'US':'GB'}],metricValues:[{value:'10'}]}],request:body}),{status:200});
  };process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath,['-e',fixture],{encoding:'utf8',timeout:10000,env:{...process.env,GA4_ACCESS_TOKEN:'fixture-token'}})
}
function output(result){assert.equal(result.status,0,result.stderr);return JSON.parse(result.stdout)}
const report=['reports','run','--property','123','--dimensions','date,country','--metrics','activeUsers','--start-date','2026-09-01','--end-date','2026-09-30']
test('report pages use unchanged dimensions/date/order and an explicit next offset',()=>{
  const first=output(run([...report,'--limit','1','--order-bys',JSON.stringify(orders)]))
  assert.equal(first.request.limit,'1');assert.deepEqual(first.request.orderBys,orders)
  const next=output(run([...report,'--limit','1','--offset','1','--order-bys',JSON.stringify(orders)]))
  assert.equal(next.request.offset,'1');assert.equal(next.rows[0].dimensionValues[1].value,'US');assert.equal(next.rowCount,2)
  const {offset,...request}=next.request;assert.deepEqual(request,first.request)
})
test('int64 offsets remain exact strings beyond Number safe precision',()=>{
  const result=output(run([...report,'--offset','9007199254740993']))
  assert.equal(result.request.offset,'9007199254740993')
})
test('metric and dimension ordering preserve caller sequence and direction',()=>{
  const mixed=[{metric:{metricName:'activeUsers'},desc:true},...orders]
  assert.deepEqual(output(run([...report,'--order-bys',JSON.stringify(mixed)])).request.orderBys,mixed)
})
test('report page preview includes zero offset, limit and ordering without a request',()=>{
  const result=output(run([...report,'--limit','250000','--offset','0','--order-bys',JSON.stringify(orders),'--dry-run'],"throw new Error('unexpected request')"))
  assert.equal(result.body.limit,'250000');assert.equal(result.body.offset,'0');assert.deepEqual(result.body.orderBys,orders);assert.equal(result.headers.Authorization,'***')
})
for(const field of ['offset','limit'])test(`invalid ${field} values fail before HTTP`,()=>{
  const bad=field==='limit'?['0','-1','1.5','x','9223372036854775808']:['-1','1.5','x','9223372036854775808']
  for(const value of bad){const result=run([...report,`--${field}`,value],"throw new Error('unexpected request')");assert.equal(result.status,1);assert.match(JSON.parse(result.stderr).error,new RegExp(`--${field}`))}
})
test('invalid order JSON and container shapes fail before HTTP',()=>{
  for(const value of ['[bad','{}','null','[]','[null]','[1]']){const result=run([...report,'--order-bys',value],"throw new Error('unexpected request')");assert.equal(result.status,1);assert.match(JSON.parse(result.stderr).error,/--order-bys/)}
})
test('default report still omits all newly optional fields',()=>{
  const body=output(run(report)).request
  for(const key of ['limit','offset','orderBys'])assert.equal(Object.hasOwn(body,key),false)
  assert.deepEqual(body.dateRanges,[{startDate:'2026-09-01',endDate:'2026-09-30'}])
})
test('realtime previews remain outside runReport pagination',()=>{
  const result=output(run(['realtime','run','--property','123','--metrics','activeUsers','--offset','bad','--order-bys','[bad','--dry-run']))
  assert.equal(result.url,'https://analyticsdata.googleapis.com/v1beta/properties/123:runRealtimeReport');assert.deepEqual(result.body,{metrics:[{name:'activeUsers'}]})
})
