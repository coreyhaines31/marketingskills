const {test}=require('node:test')
const assert=require('node:assert/strict')
const {spawnSync}=require('node:child_process')
const path=require('node:path')
const cli=path.resolve(__dirname,'../../tools/clis/similarweb.js')
function run(args,key='fixture-key',oracle="throw new Error('unexpected fetch')") {
 const code=`global.fetch=async(url,options)=>{const assert=require('node:assert/strict');const u=new URL(url);${oracle};return new Response(JSON.stringify({accepted:true}));};process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
 const r=spawnSync(process.execPath,['-e',code],{encoding:'utf8',timeout:10000,env:{...process.env,SIMILARWEB_API_KEY:key}});assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout)
}
const args=['referrals','--domain','example.com','--start','2026-01','--end','2026-02']
test('referrals use v4 and the required country while preserving dates',()=>assert.equal(run([...args,'--country','us'],'fixture-key',"assert.equal(u.pathname,'/v4/website/example.com/traffic-sources/referrals');assert.equal(u.searchParams.get('country'),'us');assert.equal(u.searchParams.get('start_date'),'2026-01');assert.equal(u.searchParams.get('end_date'),'2026-02');").accepted,true))
test('referrals default to worldwide country scope',()=>assert.equal(run(args,'fixture-key',"assert.equal(u.searchParams.get('country'),'world');").accepted,true))
test('referral preview uses v4 and masks only the key parameter',()=>{const p=run([...args,'--dry-run'],'example.com');const u=new URL(p.url);assert.equal(u.pathname,'/v4/website/example.com/traffic-sources/referrals');assert.equal(u.searchParams.get('api_key'),'***')})
test('query authentication retains special characters without creating another parameter',()=>assert.equal(run([...args,'--country','us'],'fixture+/=&injected=yes',"assert.equal(u.searchParams.get('api_key'),'fixture+/=&injected=yes');assert.equal(u.searchParams.has('injected'),false);").accepted,true))
test('encoded credentials are redacted in previews',()=>{const p=run([...args,'--dry-run'],'fixture+/=&');assert.equal(new URL(p.url).searchParams.get('api_key'),'***');assert.equal(p.url.includes('fixture'),false)})
test('existing visits endpoint retains its v1 path and country',()=>assert.equal(run(['traffic','visits','--domain','example.com','--start','2026-01','--end','2026-02','--country','us'],'fixture-key',"assert.equal(u.pathname,'/v1/website/example.com/total-traffic-and-engagement/visits');assert.equal(u.searchParams.get('country'),'us');").accepted,true))
