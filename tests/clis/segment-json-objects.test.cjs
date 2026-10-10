const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/segment.js')
function run(command, flag, value, preview = false) {
  const args = [...command, '--user-id', 'fixture-user', flag, value]
  if (preview) args.push('--dry-run')
  const source = `global.fetch = async (url, opts) => { process.stderr.write('FETCH_CALLED'); return { status: 200, text: async () => JSON.stringify({ body: JSON.parse(opts.body) }) }; }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', source], {encoding: 'utf8', env: { ...process.env, SEGMENT_WRITE_KEY: 'fixture' }, timeout: 5000})
}
const commands = [ [['track', 'event', '--event', 'Purchased'], '--properties'], [['page', 'view'], '--properties'], [['identify', 'user'], '--traits'] ]
test('event object containers fail before delivery or preview', () => {
  for (const [command, flag] of commands) for (const value of ['null', '[]', 'true', '42', '"text"']) {
    for (const preview of [false, true]) {
      const result = run(command, flag, value, preview)
      assert.equal(result.status, 1, `${command}: ${value}: ${result.stdout}`)
      assert.equal(result.stderr.includes('FETCH_CALLED'), false)
      assert.match(JSON.parse(result.stderr).error, /must be a JSON object/)
      assert.equal(result.stdout, '')
    }
  }
})
test('nested event objects and empty dictionaries survive delivery', () => {
  for (const [command, flag] of commands) for (const data of [{}, {customer: {name: 'Zoë'}, items: [1, 2], active: false}]) {
    const result = run(command, flag, JSON.stringify(data))
    assert.equal(result.status, 0, result.stderr)
    assert.deepEqual(JSON.parse(result.stdout).body[flag.slice(2)], data)
  }
})
