const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { test } = require('node:test')
const cli = path.resolve(__dirname, '../../tools/clis/amplitude.js')
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

const env = { AMPLITUDE_API_KEY: 'fixture-key', AMPLITUDE_SECRET_KEY: 'fixture-secret' }
const argv = ['retention', 'get', '--start', '20260901', '--end', '20260930']
function accepted(start, returning) {
  return `const q = new URL(url).searchParams;
    assert.equal(opts.method, 'GET'); assert.equal(new URL(url).pathname, '/api/2/retention');
    assert.deepEqual(JSON.parse(q.get('se')), {event_type:${JSON.stringify(start)}});
    assert.deepEqual(JSON.parse(q.get('re')), {event_type:${JSON.stringify(returning)}});
    assert.equal(q.has('e'), false); assert.equal(q.get('start'), '20260901'); assert.equal(q.get('end'), '20260930');
    assert.equal(opts.headers.Authorization, 'Basic ' + Buffer.from('fixture-key:fixture-secret').toString('base64'));
    return new Response('{"data":{"series":[]}}');`
}
test('default retention sends required new-user and active-return event objects', () => {
  assert.deepEqual(value(run(argv, env, accepted('_new', '_active'))), { data: { series: [] } })
})
test('start and return events can be configured independently', () => {
  assert.deepEqual(value(run([...argv, '--start-event', 'Signup + trial', '--return-event', 'Purchase / renewal'], env, accepted('Signup + trial', 'Purchase / renewal'))), { data: { series: [] } })
})
test('legacy --event selects the returning action', () => {
  assert.deepEqual(value(run([...argv, '--event', 'Purchase'], env, accepted('_new', 'Purchase'))), { data: { series: [] } })
})
test('explicit returning action takes precedence over --event', () => {
  assert.deepEqual(value(run([...argv, '--event', 'Ignored', '--return-event', 'Purchase'], env, accepted('_new', 'Purchase'))), { data: { series: [] } })
})
test('dry-run previews the same event contract with redacted Basic auth', () => {
  const result = value(run([...argv, '--dry-run'], env))
  assert.equal(result._dry_run, true)
  const q = new URL(result.url).searchParams
  assert.deepEqual(JSON.parse(q.get('se')), {event_type:'_new'})
  assert.deepEqual(JSON.parse(q.get('re')), {event_type:'_active'})
  assert.equal(result.headers.Authorization, '***')
})
for (const flag of ['--start-event', '--return-event', '--event']) {
  test(`${flag} without a value fails before fetch`, () => {
    const result = run([...argv, flag], env)
    assert.equal(result.status, 1)
    assert.match(result.stderr, /event.*requires|requires.*event/)
  })
}
