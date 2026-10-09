const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/zapier.js')
function run(args, { key, status = 200, body = '{"accepted":true}', network = true } = {}) {
  const code = `global.fetch = async (url, options) => {
    if (!${network}) throw new Error('Unexpected network request');
    return { status: ${status}, ok: ${status >= 200 && status < 300}, text: async () => JSON.stringify({ url, ...options, response: ${JSON.stringify(body)} }) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const env = { ...process.env }; delete env.ZAPIER_API_KEY
  if (key !== undefined) env.ZAPIER_API_KEY = key
  return spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', env })
}
const hook = ['hooks', 'send', '--url', 'https://hooks.zapier.com/hooks/catch/test/example/', '--data', '{"event":"created","value":0}']
test('catch hook sends JSON without requiring an unrelated management API key', () => {
  const r = run(hook)
  assert.equal(r.status, 0, r.stderr)
  const p = JSON.parse(r.stdout)
  assert.equal(p.url, hook[3]); assert.equal(p.method, 'POST')
  assert.deepEqual(p.headers, { 'Content-Type': 'application/json' })
  assert.deepEqual(JSON.parse(p.body), { event: 'created', value: 0 })
})
test('configured management key is never sent to a catch hook', () => {
  const r = run(hook, { key: 'management-secret' }); assert.equal(r.status, 0, r.stderr)
  assert.ok(!r.stdout.includes('management-secret'))
})
test('catch-hook dry run works without credentials and never fetches', () => {
  const r = run([...hook, '--dry-run'], { network: false }); assert.equal(r.status, 0, r.stderr)
  const p = JSON.parse(r.stdout); assert.equal(p._dry_run, true)
  assert.deepEqual(p.headers, { 'Content-Type': 'application/json' })
})
test('management commands still require their API key before fetching', () => {
  const r = run(['zaps', 'list'], { network: false }); assert.equal(r.status, 1)
  assert.match(r.stderr, /ZAPIER_API_KEY/)
})
test('management key and masked management preview are preserved', () => {
  const r = run(['zaps', 'list'], { key: 'management-secret' }); assert.equal(r.status, 0, r.stderr)
  assert.equal(JSON.parse(r.stdout).headers['X-API-Key'], 'management-secret')
  const d = run(['zaps', 'list', '--dry-run'], { key: 'management-secret', network: false })
  assert.equal(JSON.parse(d.stdout).headers['X-API-Key'], '***')
})
test('HTTP 404 from a disabled hook exits unsuccessfully', () => {
  const r = run(hook, { key: 'not-needed', status: 404, body: '{"error":"hook disabled"}' })
  assert.equal(r.status, 1); assert.match(r.stderr, /404/)
})
test('invalid webhook inputs remain local and help works without credentials', () => {
  for (const args of [['hooks', 'send', '--url', 'http://example.test', '--data', '{}'], ['hooks', 'send', '--url', 'https://example.test', '--data', 'not-json']]) {
    const r = run(args, { network: false }); assert.ok(JSON.parse(r.stdout).error)
  }
  const r = run([], { network: false }); assert.equal(r.status, 0)
  assert.ok(JSON.parse(r.stdout).usage.hooks)
})
