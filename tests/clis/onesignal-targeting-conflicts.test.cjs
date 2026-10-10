const {test}=require('node:test')
const assert=require('node:assert/strict')
const {spawnSync}=require('node:child_process')
const path=require('node:path')
const cli=path.resolve(__dirname,'../../tools/clis/onesignal.js')
function run(flags,preview=false){
 const args=['notifications','send','--message','Hello','--heading','Welcome',...flags];if(preview)args.push('--dry-run')
 const source=`global.fetch=async(url,opts)=>{process.stderr.write('FETCH_CALLED');return {status:200,text:async()=>JSON.stringify({body:JSON.parse(opts.body)})}};process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)})`
 return spawnSync(process.execPath,['-e',source],{encoding:'utf8',env:{...process.env,ONESIGNAL_APP_ID:'fixture-app',ONESIGNAL_REST_API_KEY:'fixture-key'},timeout:5000})
}
const audiences=[['--segment','Active Users'],['--emails','reader@example.invalid'],['--player-ids','subscription-fixture'],['--aliases','person-fixture']]
test('conflicting audience selectors fail before delivery or preview',()=>{
 for(let i=0;i<audiences.length;i++)for(let j=i+1;j<audiences.length;j++)for(const preview of [false,true]){
  const result=run([...audiences[i],...audiences[j]],preview);assert.equal(result.status,1,result.stdout);assert.equal(result.stderr.includes('FETCH_CALLED'),false);assert.match(JSON.parse(result.stderr).error,/only one audience option/);assert.equal(result.stdout,'')
 }
})
test('individual targeting options and default retain their audience payload',()=>{
 const expected=[{included_segments:['Active Users']},{email_to:['reader@example.invalid']},{include_player_ids:['subscription-fixture']},{include_aliases:{external_id:['person-fixture']}},{included_segments:['Subscribed Users']}]
 for(let i=0;i<5;i++)for(const preview of [false,true]){const result=run(audiences[i]||[],preview);assert.equal(result.status,0,result.stderr);const body=JSON.parse(result.stdout).body;for(const [key,value]of Object.entries(expected[i]))assert.deepEqual(body[key],value);assert.equal(body.target_channel,i===1?'email':'push')}
})
