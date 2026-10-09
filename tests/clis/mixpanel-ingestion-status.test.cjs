const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/mixpanel.js')
const commands = [
  ['track', 'event', '--distinct-id', 'fixture-user', '--event', 'Signup'],
  ['profiles', 'set', '--distinct-id', 'fixture-user', '--properties', '{"name":"Fixture"}'],
]
function run(args, payload, status = 200, offline = false) {
  const source = `global.fetch = async () => {
    if (${offline}) throw new Error('Unexpected network request');
    return new Response(${JSON.stringify(JSON.stringify(payload))}, { status: ${status} });
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', timeout: 10000, env: { ...process.env, MIXPANEL_TOKEN: 'fixture-secret' } })
}
function output(result) {
  assert.equal(result.stderr, '')
  assert.equal(result.signal, null)
  return JSON.parse(result.stdout)
}
for (const args of commands) {
  test(`${args[0]} preserves a provider rejection0 and returns failure`, () => {
    const result = run(args, 0)
    assert.equal(output(result), 0)
    assert.equal(result.status, 1)
  })
  test(`${args[0]} preserves an HTTP rejection diagnostic and returns failure`, () => {
    const payload = { error: 'Project is unavailable' }
    const result = run(args, payload, 403)
    assert.deepEqual(output(result), payload)
    assert.equal(result.status, 1)
  })
  test(`${args[0]} retains success for the accepted response1`, () => {
    const result = run(args, 1)
    assert.equal(output(result), 1)
    assert.equal(result.status, 0)
  })
  test(`${args[0]} preview remains offline and hides the project token`, () => {
    const result = run([...args, '--dry-run'], null, 200, true)
    const preview = output(result)
    assert.equal(preview._dry_run, true)
    assert.equal(result.status, 0)
    assert.equal(JSON.stringify(preview).includes('fixture-secret'), false)
  })
}
