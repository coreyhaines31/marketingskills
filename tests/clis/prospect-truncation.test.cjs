const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/github-prospects.js')
function run(command, pages, limit) {
  const script = `let calls=0; const pages=${JSON.stringify(pages)}; global.fetch=async (url)=>{
    const p=pages[calls++]; if(!p) throw new Error('unexpected page');
    const users=p.logins.map(login=>({login})); const data=${JSON.stringify(command)}==='forks'?users.map(owner=>({owner})):users;
    const headers = p.next ? {link:'<https://api.github.com/repos/example/project/stargazers?page=2>; rel="next"'} : {};
    return new Response(JSON.stringify(data), {status:200, headers});
  }; process.argv=['node',${JSON.stringify(cli)},${JSON.stringify(command)},'example/project','--limit',${JSON.stringify(String(limit))}]; require(${JSON.stringify(cli)});`
  const result=spawnSync(process.execPath,['-e',script],{encoding:'utf8',timeout:10000,env:{...process.env,GITHUB_TOKEN:''}})
  assert.equal(result.status,0,result.stderr)
  return JSON.parse(result.stdout)
}
for(const command of ['stargazers','forks','watchers']) {
  test(`${command}: exact final-page limit is complete`,()=>{
    const result=run(command,[{logins:['one','two'],next:false}],2)
    assert.equal(result.count,2);assert.equal(result.truncated,false)
  })
  test(`${command}: removing users inside a page is truncated`,()=>{
    const result=run(command,[{logins:['one','two','three'],next:false}],2)
    assert.equal(result.count,2);assert.equal(result.truncated,true)
  })
  test(`${command}: a next-page link proves truncation at an exact limit`,()=>{
    const result=run(command,[{logins:['one','two'],next:true}],2)
    assert.equal(result.count,2);assert.equal(result.truncated,true)
  })
}
test('exact limit across multiple pages is complete after the last page',()=>{
  const result=run('stargazers',[{logins:['one'],next:true},{logins:['two'],next:false}],2)
  assert.equal(result.count,2);assert.equal(result.truncated,false)
})
