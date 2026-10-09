const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { test } = require('node:test')
const cli = path.resolve(__dirname, '../../tools/clis/mixpanel.js')
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

const dates = ['--from-date', '2026-09-01', '--to-date', '2026-09-30']
const operations = [
  ['export', 'events', ...dates],
  ['funnels', 'get', '--funnel-id', '7', ...dates],
  ['retention', 'get', '--born-event', 'Signup', ...dates],
  ['query', 'events', ...dates, '--project-id', '42'],
]
const clean = { MIXPANEL_TOKEN: undefined, MIXPANEL_API_KEY: undefined, MIXPANEL_SECRET: undefined, MIXPANEL_PROJECT_SECRET: undefined }
for (const argv of operations) {
  test(`${argv[0]} keeps service account auth ahead of project secret`, () => {
    const result = run([...argv, '--project-id', '42'], { ...clean, MIXPANEL_API_KEY: 'service-user', MIXPANEL_SECRET: 'service-secret', MIXPANEL_PROJECT_SECRET: 'legacy-secret' }, `
      assert.equal(opts.headers.Authorization, 'Basic ' + Buffer.from('service-user:service-secret').toString('base64'));
      if (opts.method === 'GET') assert.equal(new URL(url).searchParams.get('project_id'), '42');
      else assert.equal(JSON.parse(opts.body).project_id, 42);
      return new Response('{"accepted":true}');`)
    assert.deepEqual(value(result), { accepted: true })
  })
  for (const key of ['MIXPANEL_PROJECT_SECRET', 'MIXPANEL_SECRET']) {
    test(`${argv[0]} supports ${key} only when no service username is configured`, () => {
      const result = run(argv, { ...clean, [key]: 'legacy-secret' }, `
        assert.equal(opts.headers.Authorization, 'Basic ' + Buffer.from('legacy-secret:').toString('base64'));
        return new Response('{"accepted":true}');`)
      assert.deepEqual(value(result), { accepted: true })
    })
  }
}
test('incomplete service account does not downgrade to project-secret auth', () => {
  const result = run(operations[0], { ...clean, MIXPANEL_API_KEY: 'service-user', MIXPANEL_PROJECT_SECRET: 'legacy-secret' })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /MIXPANEL_SECRET/)
})
for (const argv of operations.slice(0, 3)) {
  test(`${argv[0]} requires project selection for service accounts`, () => {
    const result = run(argv, { ...clean, MIXPANEL_API_KEY: 'service-user', MIXPANEL_SECRET: 'service-secret' })
    assert.equal(result.status, 1)
    assert.match(result.stderr, /--project-id/)
  })
}
test('explicit project secret takes precedence over legacy secret-only fallback', () => {
  const result = run(operations[0], { ...clean, MIXPANEL_PROJECT_SECRET: 'explicit', MIXPANEL_SECRET: 'legacy' }, `
    assert.equal(opts.headers.Authorization, 'Basic ' + Buffer.from('explicit:').toString('base64'));
    return new Response('{"accepted":true}');`)
  assert.deepEqual(value(result), { accepted: true })
})
test('query dry-run redacts credentials and does not fetch', () => {
  const result = run([...operations[0], '--project-id', '42', '--dry-run'], { ...clean, MIXPANEL_API_KEY: 'service-user', MIXPANEL_SECRET: 'service-secret' })
  assert.equal(value(result).headers.Authorization, '***')
  assert.equal(new URL(value(result).url).searchParams.get('project_id'), '42')
  assert.equal(result.stdout.includes('service-secret'), false)
})
test('tracking still uses the project token independently of query credentials', () => {
  const result = run(['track', 'event', '--distinct-id', 'fixture', '--event', 'Signup'], { ...clean, MIXPANEL_TOKEN: 'project-token' }, `
    assert.equal(url, 'https://api.mixpanel.com/track');
    assert.equal(JSON.parse(opts.body)[0].properties.token, 'project-token');
    assert.equal(opts.headers.Authorization, undefined);
    return new Response('1');`)
  assert.equal(value(result), 1)
})
test('no credentials still prints usage', () => {
  assert.ok(value(run([], clean)).usage)
})
