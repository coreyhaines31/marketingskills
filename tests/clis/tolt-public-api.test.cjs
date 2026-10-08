const {test}=require('node:test')
const assert=require('node:assert/strict')
const {spawnSync}=require('node:child_process')
const path=require('node:path')
const cli=path.resolve(__dirname,'../../tools/clis/tolt.js')
function run(args,oracle="throw new Error('unexpected fetch')") {
 const code=`global.fetch=async(url,options)=>{const assert=require('node:assert/strict');const u=new URL(url);const body=options.body?JSON.parse(options.body):undefined;assert.equal(u.host,'api.tolt.com');assert.equal(options.headers.Authorization,'Bearer fixture-key');${oracle};return new Response(JSON.stringify({accepted:true}));};process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
 const r=spawnSync(process.execPath,['-e',code],{encoding:'utf8',timeout:10000,env:{...process.env,TOLT_API_KEY:'fixture-key'}});assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout)
}
for(const group of ['partners','affiliates']) {
 test(`${group} list sends required program scope and cursor`,()=>assert.equal(run([group,'list','--program-id','prg1','--starting-after','part+/=','--limit','25'],"assert.equal(u.pathname,'/v1/partners');assert.equal(u.searchParams.get('program_id'),'prg1');assert.equal(u.searchParams.get('starting_after'),'part+/=');assert.equal(u.searchParams.get('limit'),'25');").accepted,true))
 test(`${group} get encodes positional ID`,()=>assert.equal(run([group,'get','part+/='],"assert.equal(u.pathname,'/v1/partners/part%2B%2F%3D');").accepted,true))
 test(`${group} creation supplies required names and program`,()=>assert.equal(run([group,'create','--first-name','Jane','--last-name','Doe','--email','jane@example.com','--program-id','prg1'],"assert.equal(options.method,'POST');assert.equal(u.pathname,'/v1/partners');assert.deepEqual(body,{first_name:'Jane',last_name:'Doe',email:'jane@example.com',program_id:'prg1'});").accepted,true))
 test(`${group} update uses PUT and nested payout details`,()=>assert.equal(run([group,'update','--id','part1','--payout-method','paypal','--paypal-email','jane@example.com'],"assert.equal(options.method,'PUT');assert.equal(u.pathname,'/v1/partners/part1');assert.deepEqual(body,{payout_method:'paypal',payout_details:{email:'jane@example.com'}});").accepted,true))
}
for(const group of ['customers','referrals']) {
 test(`${group} list uses customer resources and partner filter`,()=>assert.equal(run([group,'list','--program-id','prg1','--affiliate-id','part1'],"assert.equal(u.pathname,'/v1/customers');assert.equal(u.searchParams.get('program_id'),'prg1');assert.equal(u.searchParams.get('partner_id'),'part1');assert.equal(u.searchParams.has('affiliate_id'),false);").accepted,true))
}
test('customer get requires the Tolt record ID',()=>assert.equal(run(['customers','get','--id','cust1'],"assert.equal(u.pathname,'/v1/customers/cust1');").accepted,true))
test('commission list keeps program and partner scope',()=>assert.equal(run(['commissions','list','--program-id','prg1','--affiliate-id','part1'],"assert.equal(u.pathname,'/v1/commissions');assert.equal(u.searchParams.get('program_id'),'prg1');assert.equal(u.searchParams.get('partner_id'),'part1');").accepted,true))
for(const group of ['partners','customers','commissions']) {
 test(`${group} list rejects missing program before sending`,()=>assert.match(run([group,'list']).error,/program-id/))
}
test('unsupported commission-rate edit is explicit and offline',()=>assert.match(run(['affiliates','update','--id','part1','--commission-rate','30']).error,/commission-rate/))
test('legacy customer lookup cannot silently confuse an external ID with a Tolt record',()=>assert.match(run(['referrals','get','--customer-id','stripe_customer1']).error,/Tolt.*--id/))
test('undocumented payout history returns an actionable error',()=>assert.match(run(['payouts','list']).error,/dashboard/))
test('creation rejects an incomplete name payload before sending',()=>assert.match(run(['partners','create','--program-id','prg1','--email','jane@example.com','--name','Jane Doe']).error,/first-name.*last-name/))
test('partner preview remains offline with the actual route and redacted credentials',()=>{const p=run(['partners','list','--program-id','prg1','--dry-run']);assert.equal(p.url,'https://api.tolt.com/v1/partners?program_id=prg1');assert.equal(p.headers.Authorization,'***')})
