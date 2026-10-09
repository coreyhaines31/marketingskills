const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/wistia.js')
const token = 'fixture-token-with:colon'
function run(args, env = { WISTIA_API_KEY: token }) {
  const script = `global.fetch = async (url, options) => {
    if (options.headers.Authorization !== ${JSON.stringify('Bearer ' + token)}) {
      throw new Error('Wistia v1 requires Bearer authorization')
    }
    return new Response(JSON.stringify({ accepted: true, url, method: options.method }), { status: 200 })
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)})`
  return spawnSync(process.execPath, ['-e', script], { encoding: 'utf8', timeout: 10000, env: { ...process.env, WISTIA_API_KEY: '', ...env } })
}
for (const args of [['projects', 'list'], ['medias', 'get', '--id', 'abc123'], ['projects', 'create', '--name', 'Campaign']]) {
  test(`${args.slice(0, 2).join(' ')} uses the documented Bearer token`, () => {
    const result = run(args)
    assert.equal(result.status, 0, result.stderr)
    assert.equal(JSON.parse(result.stdout).accepted, true)
  })
}
test('dry-run masks the Bearer header and does not fetch', () => {
  const result = run(['projects', 'list', '--dry-run'])
  assert.equal(result.status, 0, result.stderr)
  const preview = JSON.parse(result.stdout)
  assert.equal(preview._dry_run, true)
  assert.equal(preview.headers.Authorization, 'Bearer ***')
  assert.equal(result.stdout.includes(token), false)
})
test('no arguments still shows usage without a credential', () => {
  const result = run([], {})
  assert.equal(result.status, 0, result.stderr)
  assert.ok(JSON.parse(result.stdout).usage)
})
test('a request without a credential fails before fetch', () => {
  const result = run(['projects', 'list'], {})
  assert.equal(result.status, 1)
  assert.match(result.stderr, /WISTIA_API_KEY/)
})
