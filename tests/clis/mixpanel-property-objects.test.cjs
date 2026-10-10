const {test}=require('node:test')
const assert=require('node:assert/strict')
const {spawnSync}=require('node:child_process')
const path=require('node:path')
const cli=path.resolve(__dirname,'../../tools/clis/mixpanel.js')
function run(command,properties,preview=false){
 const args=[...command,'--distinct-id','fixture','--properties',properties];if(preview)args.push('--dry-run')
 const source=`global.fetch=async(url,opts)=>{process.stderr.write('FETCH_CALLED');return {ok:true,status:200,text:async()=>JSON.stringify({body:JSON.parse(opts.body)})}};process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)})`
 return spawnSync(process.execPath,['-e',source],{encoding:'utf8',env:{...process.env,MIXPANEL_TOKEN:'fixture-token'},timeout:5000})
}
const commands=[['track','event','--event','Purchased'],['profiles','set']]
test('rejects invalid property containers before delivery and preview',()=>{
 for(const command of commands)for(const value of ['null','[]','true','42','"text"'])for(const preview of [false,true]){
  const result=run(command,value,preview);assert.equal(result.status,1,`${command}: ${value}: ${result.stdout}`);assert.equal(result.stderr.includes('FETCH_CALLED'),false);assert.match(JSON.parse(result.stderr).error,/must be a JSON object/);assert.equal(result.stdout,'')
 }
})
test('preserves dictionaries, tracking identity, and preview masking',()=>{
 for(const command of commands)for(const properties of [{},{nested:{name:'Zoë'},items:[1,2],active:false}])for(const preview of [false,true]){
  const result=run(command,JSON.stringify(properties),preview);assert.equal(result.status,0,result.stderr);const body=JSON.parse(result.stdout).body[0];if(command[0]==='track')assert.deepEqual(body.properties,{...properties,token:preview?'***':'fixture-token',distinct_id:'fixture'});else {assert.deepEqual(body.$set,properties);assert.equal(body.$token,preview?'***':'fixture-token')}
 }
})
test('retains malformed JSON diagnostic and avoids delivery',()=>{
 for(const command of commands){const result=run(command,'{broken');assert.equal(result.stderr.includes('FETCH_CALLED'),false);assert.equal(JSON.parse(result.stdout).error,'Invalid JSON in --properties')}
})
