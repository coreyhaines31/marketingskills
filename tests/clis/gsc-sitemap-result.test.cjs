const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { test } = require('node:test')
const cli = path.resolve(__dirname, '../../tools/clis/google-search-console.js')
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

const env = { GSC_ACCESS_TOKEN: 'fixture-token' }
const argv = ['sitemaps', 'submit', '--site-url', 'sc-domain:example.com', '--sitemap-url', 'https://example.com/sitemap.xml']
test('submission dry-run remains a request preview and does not fetch', () => {
  const result = value(run([...argv, '--dry-run'], env))
  assert.equal(result._dry_run, true)
  assert.equal(result.method, 'PUT')
  assert.equal(result.headers.Authorization, '***')
  assert.equal(result.success, undefined)
  assert.equal(result.url, 'https://searchconsole.googleapis.com/webmasters/v3/sites/sc-domain%3Aexample.com/sitemaps/https%3A%2F%2Fexample.com%2Fsitemap.xml')
})
for (const status of [200, 204]) {
  test(`empty HTTP ${status} confirms sitemap submission`, () => {
    const result = value(run(argv, env, `assert.equal(opts.method,'PUT'); assert.equal(opts.body,undefined); assert.equal(opts.headers.Authorization,'Bearer fixture-token'); return new Response(null,{status:${status}});`))
    assert.equal(result.success, true)
    assert.match(result.message, /submitted/i)
  })
}
for (const status of [400, 403, 500]) {
  test(`empty HTTP ${status} is not rewritten as success`, () => {
    const result = value(run(argv, env, `return new Response(null,{status:${status}});`))
    assert.equal(result.success, undefined)
    assert.equal(result.status, status)
  })
}
test('provider JSON errors remain intact', () => {
  const error = { error: { code: 403, message: 'Permission denied' } }
  const result = value(run(argv, env, `return new Response(${JSON.stringify(JSON.stringify(error))},{status:403});`))
  assert.deepEqual(result, error)
})
test('a nonempty provider response is preserved', () => {
  assert.deepEqual(value(run(argv, env, "return new Response('fixture response');")), { status: 200, body: 'fixture response' })
})
