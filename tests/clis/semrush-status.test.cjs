const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/semrush.js')
function run(text, status = 200, preview = false) {
  const args = ['domain', 'organic', '--domain', 'example.com', ...(preview ? ['--dry-run'] : [])]
  const source = `global.fetch = async () => {
    if (${preview}) throw new Error('Unexpected network request');
    return new Response(${JSON.stringify(text)}, { status: ${status} });
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', timeout: 10000, env: { ...process.env, SEMRUSH_API_KEY: 'fixture-secret' } })
}
function output(result) {
  assert.equal(result.stderr, '')
  assert.equal(result.signal, null)
  return JSON.parse(result.stdout)
}
for (const text of ['ERROR 120 :: WRONG KEY - ID PAIR', 'ERROR 130 :: API DISABLED', 'ERROR 132 :: API UNITS BALANCE IS ZERO', 'ERROR 429 :: Too Many Requests']) {
  test(`${text} retains diagnostics and fails the process at HTTP200`, () => {
    const result = run(text)
    assert.deepEqual(output(result), { error: text })
    assert.equal(result.status, 1)
  })
}
test('HTTP rejection retains status/text and fails the process', () => {
  const result = run('invalid key', 403)
  assert.deepEqual(output(result), { error: 'invalid key', status: 403 })
  assert.equal(result.status, 1)
})
test('the documented no-results response keeps its existing successful process status', () => {
  const text = 'ERROR 50 :: NOTHING FOUND'
  const result = run(text)
  assert.deepEqual(output(result), { error: text })
  assert.equal(result.status, 0)
})
test('a header-only report remains an empty successful result', () => {
  const result = run('Keyword;Position\n')
  assert.deepEqual(output(result), [])
  assert.equal(result.status, 0)
})
test('successful CSV rows remain unchanged', () => {
  const result = run('Keyword;Position\nfixture;1\n')
  assert.deepEqual(output(result), [{ Keyword: 'fixture', Position: '1' }])
  assert.equal(result.status, 0)
})
test('preview remains offline and masks the credential', () => {
  const result = run('', 200, true)
  const preview = output(result)
  assert.equal(result.status, 0)
  assert.equal(preview._dry_run, true)
  assert.equal(new URL(preview.url).searchParams.get('key'), '***')
  assert.equal(JSON.stringify(preview).includes('fixture-secret'), false)
})
