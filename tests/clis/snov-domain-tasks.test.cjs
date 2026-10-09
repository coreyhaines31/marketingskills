const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/snov.js')
function run(args, network = true) {
  const source = `const calls=[]; global.fetch=async(url,opts)=>{
    if (!${network}) throw Error('Unexpected network');
    calls.push({url,method:opts.method,body:opts.body?JSON.parse(opts.body):null,authorization:opts.headers.Authorization||opts.headers.authorization});
    if(url.endsWith('/oauth/access_token')) return {json:async()=>({access_token:'fake-token'})};
    return {status:200,text:async()=>JSON.stringify({calls,status:'in progress',meta:{task_hash:'task_A-1',next:'cursor-2'},links:{result:'https://api.snov.io/result/task_A-1'}})};
  };process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', source], {encoding:'utf8',timeout:5000,env:{...process.env,SNOV_CLIENT_ID:'fake-id',SNOV_CLIENT_SECRET:'fake-secret'}})
}
function output(result) {assert.equal(result.status,0,result.stderr);return JSON.parse(result.stdout)}
test('starts each documented domain task and preserves asynchronous metadata',()=>{
  for(const [kind,route] of [['company',''],['emails','/domain-emails'],['generic','/generic-contacts'],['prospects','/prospects']]) {
    const data=output(run(['domain','start','--kind',kind,'--domain','example.com']));
    assert.equal(data.calls.length,2);assert.equal(data.calls[1].url,`https://api.snov.io/v2/domain-search${route}/start?domain=example.com`);
    assert.equal(data.calls[1].method,'POST');assert.equal(data.calls[1].body,null);assert.equal(data.calls[1].authorization,'Bearer fake-token');
    assert.equal(data.status,'in progress');assert.equal(data.meta.task_hash,'task_A-1');
  }
})
test('retrieves one task result on the fixed provider host without polling',()=>{
  for(const [kind,route] of [['company',''],['emails','/domain-emails'],['generic','/generic-contacts'],['prospects','/prospects']]) {
    const data=output(run(['domain','result','--kind',kind,'--task-hash','task_A-1']));
    assert.equal(data.calls.length,2);assert.equal(data.calls[1].url,`https://api.snov.io/v2/domain-search${route}/result/task_A-1`);assert.equal(data.calls[1].method,'GET');assert.equal(data.meta.next,'cursor-2');
  }
})
test('requests subsequent pages explicitly with their provider parameters',()=>{
  const emails=output(run(['domain','start','--kind','emails','--domain','example.com','--next','cursor+/=']));
  assert.equal(new URL(emails.calls[1].url).searchParams.get('next'),'cursor+/=');
  const prospects=output(run(['domain','start','--kind','prospects','--domain','example.com','--page','2','--positions','VP Sales,Marketing Lead']));
  const q=new URL(prospects.calls[1].url).searchParams;assert.equal(q.get('page'),'2');assert.deepEqual(q.getAll('positions[]'),['VP Sales','Marketing Lead']);
})
test('invalid task identities and incompatible flags stop before OAuth or paid requests',()=>{
  const cases=[['start','--kind','unknown','--domain','example.com'],['start','--kind','emails'],['result','--kind','emails','--task-hash','../escape'],['result','--kind','emails','--task-hash'],['start','--kind','company','--domain','example.com','--next','abc'],['start','--kind','emails','--domain','example.com','--page','2'],['start','--kind','prospects','--domain','example.com','--page','0'],['start','--kind','prospects','--domain','example.com','--positions',Array(11).fill('x').join(',')],['start','--kind','emails','--domain','example.com','--limit','10'],['result','--kind','emails','--task-hash','ok','--domain','example.com']];
  for(const args of cases){const r=run(['domain',...args],false);assert.equal(r.status,1,r.stdout);assert.match(r.stderr,/kind|domain|task-hash|next|page|positions|limit/);assert.doesNotMatch(r.stderr,/Unexpected network/)}
})
test('dry runs preview v2 requests without fetching or exposing credentials',()=>{
  const data=output(run(['domain','start','--kind','emails','--domain','example.com','--dry-run'],false));
  assert.equal(data._dry_run,true);assert.equal(data.headers.Authorization,'***');assert.equal(data.url,'https://api.snov.io/v2/domain-search/domain-emails/start?domain=example.com');assert.doesNotMatch(JSON.stringify(data),/fake-id|fake-secret|fake-token/);
})
test('legacy domain search retains its v1 endpoint and payload',()=>{
  const data=output(run(['domain','search','--domain','example.com','--type','generic','--limit','10']));
  assert.equal(data.calls[1].url,'https://api.snov.io/v1/get-domain-emails-with-info');assert.deepEqual(data.calls[1].body,{domain:'example.com',type:'generic',limit:10,lastId:0});
})
