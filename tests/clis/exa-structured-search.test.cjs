const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/exa.js')
function run(args, network = true) {
  const code=`global.fetch=async(url,opts)=>{if(!${network})throw Error('Unexpected request');return{status:200,text:async()=>JSON.stringify({url,body:JSON.parse(opts.body),output:{content:{vendors:['Example']},grounding:[{field:'vendors',citations:[{url:'https://example.com'}],confidence:'low'}]},requestId:'test',costDollars:{total:0.02}})}};process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath,['-e',code],{encoding:'utf8',timeout:5000,env:{...process.env,EXA_API_KEY:'fake-key'}})
}
function output(r){assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout)}
const schema={type:'object',properties:{vendors:{type:'array',items:{type:'string'}}},required:['vendors']}
test('structured search forwards the schema and research context and preserves grounding',()=>{
  const data=output(run(['search','--query','newsletter platforms','--type','deep','--output-schema',JSON.stringify(schema),'--objective','Find vendors for a small publisher','--system-prompt','Use primary sources','--additional-queries',JSON.stringify(['newsletter pricing','newsletter deliverability']),'--highlights']));
  assert.deepEqual(data.body.outputSchema,schema);assert.equal(data.body.objective,'Find vendors for a small publisher');assert.equal(data.body.systemPrompt,'Use primary sources');assert.deepEqual(data.body.additionalQueries,['newsletter pricing','newsletter deliverability']);assert.deepEqual(data.body.contents,{highlights:true});assert.equal(data.output.grounding[0].citations[0].url,'https://example.com');assert.equal(data.costDollars.total,0.02);
})
test('text schema and existing search filters work together in a redacted dry run',()=>{
  const data=output(run(['search','--query','newsletters','--output-schema','{"type":"text"}','--include-domains','example.com','--num','3','--dry-run'],false));
  assert.deepEqual(data.body.outputSchema,{type:'text'});assert.deepEqual(data.body.includeDomains,['example.com']);assert.equal(data.body.numResults,3);assert.equal(data.headers['x-api-key'],'***');assert.doesNotMatch(JSON.stringify(data),/fake-key/)
})
test('malformed schema and research parameters fail before a request',()=>{
  const cases=[['--output-schema','not-json'],['--output-schema','[]'],['--output-schema','{"type":"array"}'],['--output-schema'],['--objective'],['--objective','x'.repeat(4097)],['--system-prompt'],['--additional-queries','[]'],['--additional-queries','[1]'],['--additional-queries','["q"]'],['--additional-queries',JSON.stringify(Array(11).fill('q')),'--type','deep']];
  for(const args of cases){const r=run(['search','--query','q',...args],false);assert.equal(r.status,1,r.stdout);assert.match(r.stderr,/output-schema|objective|system-prompt|additional-queries/);assert.doesNotMatch(r.stderr,/Unexpected request/)}
})
test('plain search preserves its existing payload when structured options are omitted',()=>{
  const data=output(run(['search','--query','newsletter platforms','--num','5']));assert.deepEqual(data.body,{query:'newsletter platforms',numResults:5});assert.equal(data.url,'https://api.exa.ai/search')
})
