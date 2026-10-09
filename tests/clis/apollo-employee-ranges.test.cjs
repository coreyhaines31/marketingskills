const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/apollo.js')

function run(args, expected) {
  const code = `global.fetch = async (url, options) => {
    const assert = require('node:assert/strict');
    const body = JSON.parse(options.body);
    assert.deepEqual(body.organization_num_employees_ranges, ${JSON.stringify(expected)});
    return new Response(JSON.stringify({ accepted: true, body }), { status: 200 });
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', timeout: 10000, env: { ...process.env, APOLLO_API_KEY: 'fixture-token' } })
}

for (const command of ['people', 'organizations']) {
  test(`${command} search preserves the documented min,max headcount range`, () => {
    const result = run([command, 'search', '--employee-ranges', '1,100'], ['1,100'])
    assert.equal(result.status, 0, result.stderr)
    assert.equal(JSON.parse(result.stdout).accepted, true)
  })
  test(`${command} search supports multiple complete ranges as a JSON array`, () => {
    const result = run([command, 'search', '--employee-ranges', '["1,10","250,500"]'], ['1,10', '250,500'])
    assert.equal(result.status, 0, result.stderr)
  })
  test(`${command} search without a range retains the ordinary request`, () => {
    const result = run([command, 'search'], undefined)
    assert.equal(result.status, 0, result.stderr)
  })
}

test('headcount range preview keeps the same complete range values', () => {
  const result = spawnSync(process.execPath, [cli, 'organizations', 'search', '--employee-ranges', '1,100', '--dry-run'], { encoding: 'utf8', timeout: 10000, env: { ...process.env, APOLLO_API_KEY: 'fixture-token' } })
  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(JSON.parse(result.stdout).body.organization_num_employees_ranges, ['1,100'])
})

for (const ranges of ['["1,100"', '[1,100]', '[]']) {
  test(`invalid range input fails before a search request: ${ranges}`, () => {
    const result = run(['organizations', 'search', '--employee-ranges', ranges], ['never requested'])
    assert.equal(result.status, 1)
    assert.match(result.stderr, /--employee-ranges must be/)
    assert.doesNotMatch(result.stderr, /Expected values/)
  })
}
