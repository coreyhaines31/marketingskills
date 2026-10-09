const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

const cli = path.resolve(__dirname, '../../tools/clis/semrush.js')
function run(args, fetchSource) {
  const setup = fetchSource || "global.fetch = async () => { throw new Error('unexpected network request') }"
  const source = `${setup}; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const result = spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', env: { ...process.env, SEMRUSH_API_KEY: 'fixture-secret' } })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}
for (const command of ['overview', 'list']) {
  test(`backlinks ${command} previews the documented analytics/v1 endpoint with masked key`, () => {
    const output = run(['backlinks', command, '--target', 'example.com', '--limit', '5', '--dry-run'])
    const url = new URL(output.url)
    assert.equal(url.pathname, '/analytics/v1/')
    assert.equal(url.searchParams.get('type'), command === 'overview' ? 'backlinks_overview' : 'backlinks')
    assert.equal(url.searchParams.get('target'), 'example.com')
    assert.equal(url.searchParams.get('target_type'), 'root_domain')
    assert.equal(url.searchParams.get('key'), '***')
    assert.equal(JSON.stringify(output).includes('fixture-secret'), false)
    if (command === 'list') assert.equal(url.searchParams.get('display_limit'), '5')
  })
  test(`backlinks ${command} sends the analytics request and preserves escaped CSV parsing`, () => {
    const output = run(['backlinks', command, '--target', 'example.com'], `global.fetch = async value => {
      const url = new URL(value)
      if (url.pathname !== '/analytics/v1/') throw new Error('Backlinks reports use the analytics endpoint')
      if (url.searchParams.get('key') !== 'fixture-secret') throw new Error('missing key')
      if (url.searchParams.get('export_escape') !== '1') throw new Error('missing CSV escaping')
      return { ok: true, status: 200, text: async () => ${JSON.stringify('"source_title";"anchor"\r\n"Example; title";"Visit"\r\n')} }
    }`)
    assert.deepEqual(output, [{ source_title: 'Example; title', anchor: 'Visit' }])
  })
  test(`backlinks ${command} does not send an undefined target`, () => {
    assert.deepEqual(run(['backlinks', command]), { error: '--target required' })
  })
}
test('domain and keyword reports retain their standard API endpoint', () => {
  for (const args of [['domain', 'organic', '--domain', 'example.com'], ['keywords', 'overview', '--phrase', 'summer shoes']]) {
    const output = run([...args, '--dry-run'])
    assert.equal(new URL(output.url).pathname, '/')
  }
})
