const {test}=require('node:test')
const assert=require('node:assert/strict')
const {spawnSync}=require('node:child_process')
const path=require('node:path')
const cli=path.resolve(__dirname,'../../tools/clis/linkedin-ads.js')
function run(args, oracle='', env={}) {
  const script=`global.fetch=async(url,options)=>{ const assert=require('node:assert/strict'); const parsed=new URL(url); const body=options.body?JSON.parse(options.body):null; ${oracle}; return new Response(JSON.stringify({accepted:true,url,body}),{status:200}) }; process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath,['-e',script],{encoding:'utf8',timeout:10000,env:{...process.env,LINKEDIN_ACCESS_TOKEN:'fixture-token',LINKEDIN_API_VERSION:'202609',...env}})
}
function output(result){assert.equal(result.status,0,result.stderr);return JSON.parse(result.stdout)}
const targeting={include:{and:[{or:{'urn:li:adTargetingFacet:locations':['urn:li:geo:102221843']}},{or:{'urn:li:adTargetingFacet:skills':['urn:li:skill:17']}}]}}
const create=['campaigns','create','--account-id','7','--campaign-group-id','8','--name','Fixture','--type','TEXT_AD','--locale-country','US','--locale-language','en','--targeting',JSON.stringify(targeting),'--political-intent','NOT_DECLARED']
test('account listing uses the current versioned REST endpoint',()=>{
  output(run(['accounts','list'],"assert.equal(parsed.pathname,'/rest/adAccounts');assert.equal(parsed.searchParams.get('q'),'search');assert.equal(options.headers['LinkedIn-Version'],'202609');assert.equal(options.headers['X-RestLi-Protocol-Version'],'2.0.0');"))
})
test('campaign listing uses the account-scoped REST resource',()=>{
  output(run(['campaigns','list','--account-id','7'],"assert.equal(parsed.pathname,'/rest/adAccounts/7/adCampaigns');assert.equal(parsed.searchParams.get('q'),'search');"))
})
test('partial status updates declare their Rest.li operation and account scope',()=>{
  output(run(['campaigns','update','--account-id','7','--id','9','--status','PAUSED'],"assert.equal(parsed.pathname,'/rest/adAccounts/7/adCampaigns/9');assert.equal(options.headers['X-RestLi-Method'],'PARTIAL_UPDATE');assert.deepEqual(body,{patch:{$set:{status:'PAUSED'}}});"))
})
test('campaign creation supplies required fields and exact decimal strings',()=>{
  const result=output(run([...create,'--unit-cost','5.125','--daily-budget','100.50'],"assert.equal(parsed.pathname,'/rest/adAccounts/7/adCampaigns');assert.equal(options.method,'POST');assert.equal(body.unitCost.amount,'5.125');assert.equal(body.dailyBudget.amount,'100.50');assert.deepEqual(body.locale,{country:'US',language:'en'});assert.equal(body.offsiteDeliveryEnabled,false);assert.equal(body.politicalIntent,'NOT_DECLARED');assert.equal(body.status,'PAUSED');"))
  assert.deepEqual(result.body.targetingCriteria,targeting)
})
test('creative listing uses encoded campaign criteria on the account resource',()=>{
  output(run(['creatives','list','--account-id','7','--campaign-id','9'],"assert.equal(parsed.pathname,'/rest/adAccounts/7/creatives');assert.equal(parsed.searchParams.get('q'),'criteria');assert.equal(parsed.searchParams.get('campaigns'),'List(urn:li:sponsoredCampaign:9)');assert.ok(url.includes('urn%3Ali%3AsponsoredCampaign%3A9'));"))
})
test('analytics has structured Rest.li dates, list-valued campaigns, and time granularity',()=>{
  output(run(['campaigns','analytics','--id','9','--start-year','2026','--start-month','9','--start-day','1','--end-year','2026','--end-month','9','--end-day','30'],"assert.equal(parsed.pathname,'/rest/adAnalytics');assert.equal(parsed.searchParams.get('dateRange'),'(start:(year:2026,month:9,day:1),end:(year:2026,month:9,day:30))');assert.equal(parsed.searchParams.get('campaigns'),'List(urn:li:sponsoredCampaign:9)');assert.equal(parsed.searchParams.get('timeGranularity'),'ALL');assert.equal(parsed.searchParams.get('fields'),'impressions,clicks,costInLocalCurrency,externalWebsiteConversions');"))
})
test('audience count is the documented GET finder with encoded nested targeting',()=>{
  output(run(['audiences','count','--targeting',JSON.stringify(targeting)],"assert.equal(options.method,'GET');assert.equal(parsed.pathname,'/rest/audienceCounts');assert.equal(parsed.searchParams.get('q'),'targetingCriteriaV2');assert.equal(parsed.searchParams.get('targetingCriteria'),'(include:(and:List((or:(urn:li:adTargetingFacet:locations:List(urn:li:geo:102221843))),(or:(urn:li:adTargetingFacet:skills:List(urn:li:skill:17))))))');assert.ok(url.includes('urn%3Ali%3AadTargetingFacet%3Alocations'));assert.equal(body,null);"))
})
test('preview includes version and operation headers while hiding the token',()=>{
  const result=output(run(['campaigns','update','--account-id','7','--id','9','--status','PAUSED','--dry-run']))
  assert.equal(result.headers['LinkedIn-Version'],'202609');assert.equal(result.headers['X-RestLi-Method'],'PARTIAL_UPDATE');assert.equal(result.headers.Authorization,'***')
})
test('another supported API version can be configured without editing the CLI',()=>{
  output(run(['accounts','list'],"assert.equal(options.headers['LinkedIn-Version'],'202608');",{LINKEDIN_API_VERSION:'202608'}))
})
test('creation does not silently invent the required targeting or political declaration',()=>{
  const result=output(run(['campaigns','create','--account-id','7','--campaign-group-id','8','--name','Fixture'],"throw new Error('unexpected request')"))
  assert.match(result.error,/--targeting/)
  assert.match(result.error,/--political-intent/)
})
test('updating or listing creatives requires the account needed by scoped endpoints',()=>{
  for(const args of [['campaigns','update','--id','9','--status','PAUSED'],['creatives','list','--campaign-id','9']]) {
    assert.match(output(run(args,"throw new Error('unexpected request')")).error,/--account-id/)
  }
})
test('campaign creation can use the explicit account currency',()=>{
  output(run([...create,'--currency','EUR'],"assert.equal(body.dailyBudget.currencyCode,'EUR');assert.equal(body.unitCost.currencyCode,'EUR');"))
})
test('a created campaign ID is preserved from the empty HTTP201 response',()=>{
  const script=`global.fetch=async()=>new Response('',{status:201,headers:{'x-restli-id':'fixture-created-id'}});process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(create)}];require(${JSON.stringify(cli)});`
  const result=spawnSync(process.execPath,['-e',script],{encoding:'utf8',timeout:10000,env:{...process.env,LINKEDIN_ACCESS_TOKEN:'fixture-token'}})
  assert.deepEqual(output(result),{status:201,id:'fixture-created-id'})
})
test('Dynamic Ads require both budgets and retain their beneficiary organization',()=>{
  const dynamic=[...create,'--type','DYNAMIC','--format','SPOTLIGHT','--associated-entity','urn:li:organization:123']
  assert.match(output(run(dynamic,"throw new Error('unexpected request')")).error,/--total-budget/)
  output(run([...dynamic,'--total-budget','1000.25','--currency','EUR'],"assert.deepEqual(body.totalBudget,{amount:'1000.25',currencyCode:'EUR'});assert.equal(body.associatedEntity,'urn:li:organization:123');assert.equal(body.format,'SPOTLIGHT');assert.equal(body.dailyBudget.currencyCode,'EUR');"))
})
test('Dynamic Ads format must match a documented dynamic creative type',()=>{
  for(const format of [undefined,'TEXT_AD','UNSUPPORTED']) {
    const dynamic=[...create,'--type','DYNAMIC','--associated-entity','urn:li:organization:123','--total-budget','1000']
    if(format) dynamic.push('--format',format)
    assert.match(output(run(dynamic,"throw new Error('unexpected request')")).error,/--format/)
  }
})
