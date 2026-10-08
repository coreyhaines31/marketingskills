const {test}=require('node:test')
const assert=require('node:assert/strict')
const {spawnSync}=require('node:child_process')
const path=require('node:path')
const cli=path.resolve(__dirname,'../../tools/clis/mixpanel.js')
const hosts={us:['api.mixpanel.com','mixpanel.com','data.mixpanel.com'],eu:['api-eu.mixpanel.com','eu.mixpanel.com','data-eu.mixpanel.com'],in:['api-in.mixpanel.com','in.mixpanel.com','data-in.mixpanel.com']}
const operations=[
 {args:['track','event','--distinct-id','owned','--event','Owned'],host:0,path:'/track',method:'POST'},
 {args:['profiles','set','--distinct-id','owned','--properties','{"plan":"owned"}'],host:0,path:'/engage',method:'POST'},
 {args:['query','events','--project-id','42'],host:1,path:'/api/2.0/insights',method:'POST'},
 {args:['funnels','get','--funnel-id','owned','--project-id','42'],host:1,path:'/api/2.0/funnels',method:'GET'},
 {args:['retention','get','--from-date','2026-01-01','--to-date','2026-01-02','--project-id','42'],host:1,path:'/api/2.0/retention',method:'GET'},
 {args:['export','events','--from-date','2026-01-01','--to-date','2026-01-02','--project-id','42'],host:2,path:'/api/2.0/export',method:'GET'}
]
function run(args,region,oracle=''){
 const code=`global.fetch=async(url,options)=>{const assert=require('node:assert/strict');const parsed=new URL(url);${oracle};return new Response(JSON.stringify({owned:true}),{status:200})};process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
 const env={...process.env,MIXPANEL_TOKEN:'owned-token',MIXPANEL_API_KEY:'owned-key',MIXPANEL_SECRET:'owned-secret'}
 if(region===undefined)delete env.MIXPANEL_REGION;else env.MIXPANEL_REGION=region
 return spawnSync(process.execPath,['-e',code],{env,encoding:'utf8',timeout:10000})
}
function output(r){assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout)}
for(const region of Object.keys(hosts))for(const op of operations)test(`${region} ${op.args.slice(0,2).join(' ')} selects its documented API family`,()=>{
 const oracle=`assert.equal(parsed.hostname,${JSON.stringify(hosts[region][op.host])});assert.equal(parsed.pathname,${JSON.stringify(op.path)});assert.equal(options.method,${JSON.stringify(op.method)});`
 assert.deepEqual(output(run(op.args,region,oracle)),{owned:true})
 const preview=output(run([...op.args,'--dry-run'],region,"throw new Error('unexpected fetch')"));assert.equal(new URL(preview.url).hostname,hosts[region][op.host]);assert.equal(new URL(preview.url).pathname,op.path)
 if(op.host===0){assert.equal(preview.body[0].properties?.token??preview.body[0].$token,'***')}else assert.equal(preview.headers.Authorization,'***')
})
test('omitted region preserves the US endpoint',()=>{assert.deepEqual(output(run(operations[0].args,undefined,"assert.equal(parsed.hostname,'api.mixpanel.com')")),{owned:true})})
for(const region of ['EU','unknown','https://owned.invalid'])test(`invalid region fails before transport ${region}`,()=>{const r=run(operations[0].args,region,"throw new Error('unexpected fetch')");assert.notEqual(r.status,0);assert.match(r.stderr,/MIXPANEL_REGION/);assert.doesNotMatch(r.stderr,/unexpected fetch/)})
test('no-argument help succeeds despite an invalid region',()=>{assert.equal(output(run([],'unknown',"throw new Error('unexpected fetch')")).error,'Unknown command')})
