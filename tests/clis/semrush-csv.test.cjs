const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

const cli = path.resolve(__dirname, '../../tools/clis/semrush.js')
function run(csv, options = {}) {
  const source = `global.fetch = async () => ({ok: ${options.ok !== false}, status: ${options.status || 200}, text: async () => ${JSON.stringify(csv)}}); process.argv = ['node', ${JSON.stringify(cli)}, 'domain', 'organic', '--domain', 'example.com']; require(${JSON.stringify(cli)});`
  const result = spawnSync(process.execPath, ['-e', source], {encoding: 'utf8', env: {...process.env, SEMRUSH_API_KEY: 'fixture-key'}})
  assert.equal(result.status, options.ok === false ? 1 : 0, result.stderr)
  return JSON.parse(result.stdout)
}
test('export_escape quoted headers and values become clean JSON fields', () => {
  assert.deepEqual(run('"Keyword";"Position"\r\n"summer shoes";"3"\r\n'), [{'Keyword':'summer shoes','Position':'3'}])
})
test('semicolon, doubled quote, and line breaks inside quotes stay in their cell', () => {
  assert.deepEqual(run('"Keyword";"URL"\r\n"say ""hello""; today\nnew line";"https://example.com/a;b"\r\n'), [{'Keyword':'say "hello"; today\nnew line','URL':'https://example.com/a;b'}])
})
test('unquoted reports, empty cells and blank rows retain their semantics', () => {
  assert.deepEqual(run('Keyword;Position;URL\r\n shoes ;0;\r\n\r\n'), [{'Keyword':' shoes ','Position':'0','URL':''}])
})
test('header-only reports remain empty and provider errors remain diagnostics', () => {
  assert.deepEqual(run('"Keyword";"Position"\r\n'), [])
  assert.deepEqual(run('ERROR 50 :: NOTHING FOUND'), {error:'ERROR 50 :: NOTHING FOUND'})
  assert.deepEqual(run('invalid key', {ok:false,status:403}), {error:'invalid key',status:403})
})
