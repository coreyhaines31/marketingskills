const {test} = require('node:test')
const assert = require('node:assert/strict')
const {spawnSync} = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/exa.js')
function run(args, network = true) {
  const script = `global.fetch = async (url, options) => {
    if (!${network}) throw new Error('Unexpected network request');
    return {status:200, text:async()=>JSON.stringify({url,method:options.method,request:JSON.parse(options.body),answer:'Fixture answer',citations:[{url:'https://example.org/source'}]})};
  }; process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath,['-e',script],{encoding:'utf8',timeout:5000,env:{PATH:process.env.PATH,EXA_API_KEY:'fixture-secret'}})
}
function output(r) { assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout) }
test('cited answers use the documented endpoint and preserve sources',()=>{
 const result=output(run(['answer','What','changed?']))
 assert.equal(result.url,'https://api.exa.ai/answer');assert.equal(result.method,'POST')
 assert.deepEqual(result.request,{query:'What changed?'});assert.equal(result.answer,'Fixture answer')
 assert.deepEqual(result.citations,[{url:'https://example.org/source'}])
})
test('answer supports structured output and source text without streaming',()=>{
 const schema={type:'object',properties:{summary:{type:'string'}}}
 const result=output(run(['answer','--query','Research','--model','exa-pro','--system-prompt','Use dated sources','--text','false','--output-schema',JSON.stringify(schema)]))
 assert.deepEqual(result.request,{query:'Research',model:'exa-pro',systemPrompt:'Use dated sources',text:false,outputSchema:schema})
 assert.equal(Object.hasOwn(result.request,'stream'),false)
 assert.equal(output(run(['answer','Research','--text'])).request.text,true)
})
test('invalid query, booleans and schemas fail before a billed request',()=>{
 for(const args of [['answer'],['answer','--query'],['answer','Q','--text','maybe'],['answer','Q','--output-schema','null'],['answer','Q','--output-schema','[]'],['answer','Q','--output-schema','{'],['answer','Q','--model']]) {
  const result=run(args,false);assert.equal(result.status,1);assert.doesNotMatch(result.stderr,/Unexpected network/)
 }
})
test('answer dry run shows the request without disclosing auth',()=>{
 const result=output(run(['answer','Research','--dry-run'],false))
 assert.equal(result.url,'https://api.exa.ai/answer');assert.equal(result.body.query,'Research');assert.equal(result._dry_run,true)
 assert.equal(JSON.stringify(result).includes('fixture-secret'),false)
})
