const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/dataforseo.js')
function run(body, status = 200, args = ['serp', 'locations']) {
  const source = `global.fetch = async () => new Response(${JSON.stringify(typeof body === 'string' ? body : JSON.stringify(body))}, { status: ${status} }); process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', timeout: 10000, env: { ...process.env, DATAFORSEO_LOGIN: 'fixture-login', DATAFORSEO_PASSWORD: 'fixture-password' } })
}
function output(result) {
  assert.equal(result.stderr, '')
  assert.equal(result.signal, null)
  return JSON.parse(result.stdout)
}
for (const code of [40006, 40100, 40506, 50000]) {
  test(`top-level ${code} in HTTP200 is unsuccessful and retains diagnostics`, () => {
    const payload = { status_code: code, status_message: 'Provider diagnostic', tasks_error: 1, tasks: null }
    const result = run(payload)
    assert.deepEqual(output(result), payload)
    assert.equal(result.status, 1)
  })
}
test('a failed task is detected when the envelope status remains successful', () => {
  const payload = { status_code: 20000, tasks_count: 2, tasks_error: 1, tasks: [
    { id: 'successful-task', status_code: 20000, result: [{ keyword: 'retained result' }] },
    { id: 'failed-task', status_code: 40506, status_message: 'Unknown fields in post data.', result: null },
  ] }
  const result = run(payload, 200, ['serp', 'google', '--keyword', 'fixture'])
  assert.deepEqual(output(result), payload)
  assert.equal(result.status, 1)
})
test('an unsuccessful HTTP response fails even without internal status fields', () => {
  const payload = { message: 'Unauthorized' }
  const result = run(payload, 401)
  assert.deepEqual(output(result), payload)
  assert.equal(result.status, 1)
})
test('a non-JSON HTTP failure preserves its text and HTTP status', () => {
  const result = run('service unavailable', 500)
  assert.deepEqual(output(result), { status: 500, body: 'service unavailable' })
  assert.equal(result.status, 1)
})
for (const code of [20000, 20100, 40601, 40602]) {
  test(`documented successful or pending task ${code} does not become an error`, () => {
    const payload = { status_code: 20000, tasks: [{ id: 'task', status_code: code, result: null }] }
    const result = run(payload)
    assert.deepEqual(output(result), payload)
    assert.equal(result.status, 0)
  })
}
test('the error-code catalog inside successful task results is not interpreted as a failed task', () => {
  const payload = { status_code: 20000, tasks: [{ status_code: 20000, result: [{ code: 40100, message: 'Unauthorized' }] }] }
  const result = run(payload)
  assert.deepEqual(output(result), payload)
  assert.equal(result.status, 0)
})
test('an envelope without optional task/status fields retains its output', () => {
  const payload = { result: 'fixture' }
  const result = run(payload)
  assert.deepEqual(output(result), payload)
  assert.equal(result.status, 0)
})
test('preview remains offline and hides both credential values', () => {
  const result = run(null, 200, ['serp', 'locations', '--dry-run'])
  const preview = output(result)
  assert.equal(preview._dry_run, true)
  assert.equal(preview.headers.Authorization, '***')
  assert.equal(JSON.stringify(preview).includes('fixture-password'), false)
  assert.equal(result.status, 0)
})
