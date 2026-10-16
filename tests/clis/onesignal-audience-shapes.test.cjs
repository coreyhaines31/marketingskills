const {test}=require('node:test')
const assert=require('node:assert/strict')
const {spawnSync}=require('node:child_process')
const path=require('node:path')
const cli=path.resolve(__dirname,'../../tools/clis/onesignal.js')
function run(kind,value,preview=false){
 const args=kind==='filters'?['segments','create','--name','Fixture']:['notifications','send','--message','Fixture'];if(value!==undefined)args.push(`--${kind}`,value);if(preview)args.push('--dry-run')
 const source=`global.fetch=async(url,opts)=>{process.stderr.write('FETCH_CALLED');return {status:200,text:async()=>JSON.stringify({body:JSON.parse(opts.body),headers:opts.headers})}};process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)})`
 return spawnSync(process.execPath,['-e',source],{encoding:'utf8',env:{...process.env,ONESIGNAL_REST_API_KEY:'fixture-key',ONESIGNAL_APP_ID:'fixture-app'},timeout:5000})
}
test('preserves JSON-scalar-looking external IDs in delivery and preview',()=>{
 for(const value of ['12345','null','[]','true','42','"text"'])for(const preview of [false,true]){
  const r=run('aliases',value,preview);assert.equal(r.status,0,r.stderr);assert.deepEqual(JSON.parse(r.stdout).body.include_aliases,{external_id:[value]});assert.equal(r.stderr.includes('FETCH_CALLED'),!preview)
 }
})
test('rejects invalid segment filter arrays and counts before requests',()=>{
 for(const value of ['null','{}','true','42','"text"','[]','[null]','[[]]','[42]',JSON.stringify(Array(201).fill({field:'session_count',relation:'>',value:'0'}))])for(const preview of [false,true]){
  const r=run('filters',value,preview);assert.equal(r.status,1,r.stdout);assert.equal(r.stderr.includes('FETCH_CALLED'),false);assert.match(JSON.parse(r.stderr).error,/array of 1–200 filter or operator objects/)
 }
})
test('preserves alias dictionaries and comma-separated shorthand',()=>{
 for(const preview of [false,true])for(const value of ['{"external_id":["user1"],"custom_alias":["user2"]}','user1,user2']){
  const r=run('aliases',value,preview);assert.equal(r.status,0,r.stderr);assert.deepEqual(JSON.parse(r.stdout).body.include_aliases,value[0]==='{'?JSON.parse(value):{external_id:['user1','user2']})
 }
})
test('preserves default filters, operators and 200-entry boundary',()=>{
 const filter={field:'session_count',relation:'>',value:'0'}
 for(const preview of [false,true])for(const value of [undefined,JSON.stringify([filter,{operator:'OR'},{field:'tag',key:'level',relation:'=',value:'10'}]),JSON.stringify(Array(200).fill(filter))]){
  const r=run('filters',value,preview);assert.equal(r.status,0,r.stderr);assert.deepEqual(JSON.parse(r.stdout).body.filters,value===undefined?[filter]:JSON.parse(value))
 }
})
test('preserves malformed segment-filter parse diagnostic',()=>{
 const r=run('filters','{broken');assert.equal(r.stderr.includes('FETCH_CALLED'),false);assert.equal(JSON.parse(r.stdout).error,'Invalid JSON in --filters')
})
