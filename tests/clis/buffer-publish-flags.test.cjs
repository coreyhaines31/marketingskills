const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/buffer.js')
function run(flags, dry = false, forbidFetch = dry) {
  const argv = ['updates', 'create', '--profile-ids', 'one,two', '--text', 'Keep this queued', ...flags, ...(dry ? ['--dry-run'] : [])]
  const source = `global.fetch = async (url, options) => { ${forbidFetch ? "throw new Error('unexpected fetch')" : "return { status: 200, text: async () => JSON.stringify({ url, body: options.body }) }"} }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(argv)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', timeout: 5000, env: { ...process.env, BUFFER_API_KEY: 'fixture-token-never-sent' } })
}
function body(result) { assert.equal(result.status, 0, result.stderr); return new URLSearchParams(JSON.parse(result.stdout).body) }
for (const flag of ['now', 'top', 'shorten']) {
  test(`Buffer ${flag} preserves false and explicit true in the actual form request`, () => {
    assert.equal(body(run([`--${flag}`, 'false'])).get(flag), 'false')
    assert.equal(body(run([`--${flag}`, 'true'])).get(flag), 'true')
    assert.equal(body(run([`--${flag}`])).get(flag), 'true')
    assert.equal(body(run([])).has(flag), false)
  })
  test(`Buffer ${flag} rejects invalid state before fetch`, () => {
    for (const dry of [false, true]) {
      const result = run([`--${flag}`, 'maybe'], dry, true)
      assert.equal(result.status, 1)
      assert.match(result.stderr, /must be true or false/)
      assert.doesNotMatch(result.stderr, /unexpected fetch/)
    }
  })
}
test('false publishing state and repeated profiles survive a redacted offline preview', () => {
  const result = run(['--now', 'false', '--top', 'false', '--shorten', 'false'], true)
  const params = body(result)
  assert.deepEqual(params.getAll('profile_ids[]'), ['one', 'two'])
  assert.equal(params.get('text'), 'Keep this queued')
  for (const flag of ['now', 'top', 'shorten']) assert.equal(params.get(flag), 'false')
  assert.equal(result.stdout.includes('fixture-token-never-sent'), false)
})
