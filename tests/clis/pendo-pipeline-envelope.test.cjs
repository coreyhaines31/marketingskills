const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { test } = require('node:test')
const cli = path.resolve(__dirname, '../../tools/clis/pendo.js')
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

const env = { PENDO_INTEGRATION_KEY: 'fixture-key' }
const pipeline = [{source:{visitors:null}},{limit:10}]
const argv = ['reports','funnel','--pipeline']
test('pipeline array is wrapped in the documented aggregation envelope', () => {
  const result = run([...argv, JSON.stringify(pipeline)], env, `
    assert.equal(url,'https://app.pendo.io/api/v1/aggregation'); assert.equal(opts.method,'POST');
    assert.equal(opts.headers['x-pendo-integration-key'],'fixture-key');
    assert.deepEqual(JSON.parse(opts.body), {response:{mimeType:'application/json'}, request:{pipeline:${JSON.stringify(pipeline)}}});
    return new Response('{"results":[]}');`)
  assert.deepEqual(value(result), {results:[]})
})
test('full aggregation envelopes remain supported without dropping request settings', () => {
  const body = {response:{mimeType:'application/json'}, request:{requestId:'fixture-report',pipeline}}
  const result = value(run([...argv, JSON.stringify(body), '--dry-run'], env))
  assert.deepEqual(result.body, body)
})
test('dry-run shows the wrapped pipeline without requesting data', () => {
  const result = value(run([...argv, JSON.stringify(pipeline), '--dry-run'], env))
  assert.equal(result._dry_run,true)
  assert.deepEqual(result.body.request.pipeline,pipeline)
  assert.equal(result.headers['x-pendo-integration-key'],'***')
})
for (const input of ['null','42','{}','{"request":{"pipeline":{}}}','{"request":{"pipeline":null}}']) {
  test(`invalid pipeline input ${input} fails before fetch`, () => {
    const result = run([...argv,input],env)
    assert.equal(result.status,1)
    assert.match(result.stderr,/pipeline.*array|array.*pipeline/)
  })
}
test('visitor searches still pass through full query bodies', () => {
  const body={response:{mimeType:'application/json'}, request:{pipeline}}
  assert.deepEqual(value(run(['visitors','search','--query',JSON.stringify(body),'--dry-run'],env)).body,body)
})
