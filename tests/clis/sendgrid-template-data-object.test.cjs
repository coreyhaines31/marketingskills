const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/sendgrid.js')
function run(value, preview = false) {
  const args = ['send', '--from', 'sender@example.invalid', '--to', 'reader@example.invalid', '--template-id', 'd-fixture', '--template-data', value]
  if (preview) args.push('--dry-run')
  const source = `global.fetch = async (url, opts) => { process.stderr.write('FETCH_CALLED'); return { status: 200, text: async () => JSON.stringify({ body: JSON.parse(opts.body) }) }; }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', source], {encoding: 'utf8', env: { ...process.env, SENDGRID_API_KEY: 'fixture' }, timeout: 5000})
}
test('invalid template data containers are rejected before delivery or preview', () => {
  for (const value of ['null', '[]', 'true', '42', '"text"']) {
    for (const preview of [false, true]) {
      const result = run(value, preview)
      assert.equal(result.status, 1, `${value}: ${result.stdout}`)
      assert.equal(result.stderr.includes('FETCH_CALLED'), false)
      assert.match(JSON.parse(result.stderr).error, /template-data must be a JSON object/)
      assert.equal(result.stdout, '')
    }
  }
})
test('nested template data and empty objects are preserved', () => {
  for (const data of [{}, {customer: {name: 'Zoë'}, items: [1, 2], active: false}]) {
    const result = run(JSON.stringify(data))
    assert.equal(result.status, 0, result.stderr)
    assert.deepEqual(JSON.parse(result.stdout).body.personalizations[0].dynamic_template_data, data)
  }
})
