const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/adobe-analytics.js')
const suites=[{rsid:'owned-suite',id:'owned-suite',name:'Owned suite',timezoneZoneinfo:'US/Pacific'}]
function run(args, oracle='') {
  const fixture=`global.fetch=async(url,options)=>{const assert=require('node:assert/strict');${oracle}
    assert.equal(options.headers.Authorization,'Bearer fixture-token');assert.equal(options.headers['x-api-key'],'fixture-client');assert.equal(options.headers['x-proxy-global-company-id'],'owned-company');
    return new Response(JSON.stringify(${JSON.stringify(suites)}),{status:200});
  };process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath,['-e',fixture],{encoding:'utf8',timeout:10000,env:{...process.env,ADOBE_ACCESS_TOKEN:'fixture-token',ADOBE_CLIENT_ID:'fixture-client',ADOBE_COMPANY_ID:'owned-company'}})
}
function output(result){assert.equal(result.status,0,result.stderr);return JSON.parse(result.stdout)}
test('suite listing reaches the documented collection resource and preserves its array',()=>{
  const result=output(run(['reportsuites','list'],"assert.equal(url,'https://analytics.adobe.io/api/owned-company/reportsuites/collections/suites');assert.equal(options.method,'GET');assert.equal(options.body,undefined)"))
  assert.deepEqual(result,suites)
})
test('suite listing preview shows the same collection and masks credentials',()=>{
  const result=output(run(['reportsuites','list','--dry-run'],"throw new Error('unexpected request')"))
  assert.equal(result.url,'https://analytics.adobe.io/api/owned-company/reportsuites/collections/suites');assert.equal(result.headers.Authorization,'***');assert.equal(result.headers['x-api-key'],'***');assert.equal(result.headers['x-proxy-global-company-id'],'owned-company')
})
test('dimension discovery retains the report-suite query',()=>{
  output(run(['dimensions','list','--rsid','owned-suite'],"assert.equal(url,'https://analytics.adobe.io/api/owned-company/dimensions?rsid=owned-suite');assert.equal(options.method,'GET')"))
})
test('report requests keep their existing reporting endpoint and body',()=>{
  output(run(['reports','run','--rsid','owned-suite','--start-date','2026-09-01','--end-date','2026-09-30','--metrics','metrics/visits'],"assert.equal(url,'https://analytics.adobe.io/api/owned-company/reports');assert.equal(options.method,'POST');const body=JSON.parse(options.body);assert.equal(body.rsid,'owned-suite');assert.deepEqual(body.metricContainer,{metrics:[{id:'metrics/visits'}]})"))
})
