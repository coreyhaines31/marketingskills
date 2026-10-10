const {test}=require('node:test')
const assert=require('node:assert/strict')
const {spawnSync}=require('node:child_process')
const path=require('node:path')
const cli=path.resolve(__dirname,'../../tools/clis/resend.js')
function run(value,preview=false){
 const args=['batch'];if(value!==undefined)args.push('--emails',value);if(preview)args.push('--dry-run')
 const source=`global.fetch=async(url,opts)=>{process.stderr.write('FETCH_CALLED');return {status:200,text:async()=>JSON.stringify({body:JSON.parse(opts.body),headers:opts.headers})}};process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)})`
 return spawnSync(process.execPath,['-e',source],{encoding:'utf8',env:{...process.env,RESEND_API_KEY:'fixture-key'},timeout:5000})
}
const email={from:'sender@example.invalid',to:['reader@example.invalid'],subject:'Welcome',text:'Hello',headers:{'X-Fixture':'value'}}
test('rejects invalid batch containers, entries, and sizes before delivery or preview',()=>{
 for(const value of [undefined,'null','{}','true','42','"text"','[]','[null]','[[]]','[42]',JSON.stringify(Array(101).fill(email))])for(const preview of [false,true]){
  const result=run(value,preview);assert.equal(result.status,1,`${value}: ${result.stdout}`);assert.equal(result.stderr.includes('FETCH_CALLED'),false);assert.match(JSON.parse(result.stderr).error,/array of 1–100 email objects/);assert.equal(result.stdout,'')
 }
})
test('one and one hundred email batches retain nested payload and masking',()=>{
 for(const count of [1,100])for(const preview of [false,true]){const emails=Array(count).fill(email);const result=run(JSON.stringify(emails),preview);assert.equal(result.status,0,result.stderr);const response=JSON.parse(result.stdout);assert.deepEqual(response.body,emails);assert.equal(response.headers.Authorization,preview?'***':'Bearer fixture-key')}
})
test('retains malformed JSON diagnostic without delivery',()=>{
 const result=run('{broken');assert.equal(result.stderr.includes('FETCH_CALLED'),false);assert.match(JSON.parse(result.stdout).error,/Invalid JSON for --emails:/)
})
