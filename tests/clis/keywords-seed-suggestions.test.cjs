const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { test } = require('node:test')
const cli = path.resolve(__dirname, '../../tools/clis/keywords-everywhere.js')
function run(argv, env = {}, response = "throw new Error('unexpected network request')") {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'marketing-contract-'))
  const mock = path.join(tmp, 'fetch.cjs')
  fs.writeFileSync(mock, `const assert = require('node:assert/strict'); global.fetch = async (url, opts) => { ${response} };`)
  const childEnv = { ...process.env, ...env }
  for (const [key, val] of Object.entries(env)) if (val === undefined) delete childEnv[key]
  try {
    return spawnSync(process.execPath, ['--require', mock, cli, ...argv], { env: childEnv, encoding: 'utf8', timeout: 10000 })
  } finally { fs.rmSync(tmp, { recursive: true, force: true }) }
}
function value(result) {
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}

const env = { KEYWORDS_EVERYWHERE_API_KEY: 'fixture-key' }
for (const sub of ['related', 'pasf']) {
  test(`${sub} sends one seed keyword instead of a keyword-data array`, () => {
    const result = run(['keywords', sub, '--keyword', 'climate + change, impacts', '--num', '5'], env, `
      assert.equal(new URL(url).pathname, '/v1/get_${sub === 'related' ? 'related' : 'pasf'}_keywords');
      assert.equal(opts.method, 'POST'); assert.equal(opts.headers.Authorization, 'Bearer fixture-key');
      assert.deepEqual(JSON.parse(opts.body), {keyword:'climate + change, impacts', num:5});
      return new Response('{"data":[]}');`)
    assert.deepEqual(value(result), {data:[]})
  })
  test(`${sub} preserves --kw as a scalar compatibility alias`, () => {
    const result = value(run(['keywords', sub, '--kw', 'one, literal phrase', '--dry-run'], env))
    assert.deepEqual(result.body, { keyword: 'one, literal phrase' })
    assert.equal(result.headers.Authorization, '***')
  })
  test(`${sub} rejects missing seed`, () => {
    const result = run(['keywords', sub], env)
    assert.equal(result.status, 1)
    assert.match(result.stderr, /--keyword/)
  })
}
test('keyword data continues accepting a comma-separated array', () => {
  const result = value(run(['keywords', 'data', '--kw', 'first,second', '--dry-run'], env))
  assert.deepEqual(result.body.kw, ['first','second'])
})
for (const num of ['0', '-1', 'abc', '1.5', '10001']) {
  test(`invalid suggestion count ${num} fails before any request`, () => {
    const result = run(['keywords', 'related', '--keyword', 'climate change', '--num', num], env)
    assert.equal(result.status, 1)
    assert.match(result.stderr, /--num/)
  })
}
