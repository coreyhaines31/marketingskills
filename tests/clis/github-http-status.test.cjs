const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/github-prospects.js')
function run(args, code) {
  const script = `global.fetch = async (url, options) => { ${code} }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', script], { encoding: 'utf8', timeout: 10000, env: { ...process.env, GITHUB_TOKEN: 'fixture-token' } })
}
for (const [name, args, status] of [
  ['stargazers unauthorized', ['stargazers', 'example/project'], 401],
  ['forks forbidden', ['forks', 'example/project'], 403],
  ['watchers rate limited', ['watchers', 'example/project'], 429],
  ['user missing', ['user', 'missing'], 404],
  ['rate-limit unavailable', ['rate-limit'], 503],
  ['CSV request rejected', ['stargazers', 'example/project', '--format', 'csv'], 403],
]) test(name + ' preserves error payload and exits unsuccessfully', () => {
  const r = run(args, `return new Response(JSON.stringify({message:'fixture rejection'}), {status:${status},headers:{'x-ratelimit-remaining':'0','x-ratelimit-reset':'1801660000'}});`)
  const payload = JSON.parse(r.stdout)
  assert.equal(payload.status, status)
  assert.equal(payload.error, `HTTP ${status}`)
  assert.equal(payload.body, JSON.stringify({message:'fixture rejection'}))
  assert.equal(r.status, 1, r.stderr)
})
test('an enrichment profile 404 remains a skipped record, not a command failure', () => {
  const r = run(['stargazers','example/project','--enrich'], `if (url.includes('/users/')) return new Response('{"message":"Not Found"}',{status:404}); return new Response('[{"login":"deleted-user"}]');`)
  assert.equal(r.status, 0, r.stderr)
  assert.equal(JSON.parse(r.stdout).count, 0)
  assert.deepEqual(JSON.parse(r.stdout).users, [])
})
test('successful ordinary JSON and CSV stay successful', () => {
  for (const args of [['user','example'], ['stargazers','example/project','--format','csv']]) {
    const r = run(args, `return new Response(JSON.stringify(url.includes('/users/') ? {login:'example',name:'Fixture'} : [{login:'example'}]));`)
    assert.equal(r.status, 0, r.stderr)
    if (args[0] === 'user') assert.equal(JSON.parse(r.stdout).login,'example')
    else assert.match(r.stdout, /^login,name,company,email/)
  }
})
test('dry runs make no request and remain successful', () => {
  const r = run(['stargazers','example/project','--dry-run'], `throw new Error('Unexpected request');`)
  assert.equal(r.status, 0, r.stderr)
  assert.equal(JSON.parse(r.stdout)._dry_run, true)
  assert.equal(r.stdout.includes('fixture-token'), false)
})
