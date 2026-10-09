const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { test } = require('node:test')

const cli = path.resolve(__dirname, '../../tools/clis/amplitude.js')
function run(argv, env, response = "throw new Error('unexpected network request')") {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'marketing-cli-'))
  const mock = path.join(tmp, 'fetch.cjs')
  fs.writeFileSync(mock, `const assert = require('node:assert/strict'); global.fetch = async (url, opts) => { ${response} };`)
  const childEnv = { ...process.env, ...env }
  for (const [key, value] of Object.entries(env)) if (value === undefined) delete childEnv[key]
  try {
    return spawnSync(process.execPath, ['--require', mock, cli, ...argv], { env: childEnv, encoding: 'utf8', timeout: 10000 })
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true })
  }
}
function value(result, expectedStatus = 0) {
  assert.equal(result.status, expectedStatus, result.stderr)
  return JSON.parse(result.stdout)
}

const archive = Buffer.from('UEsDBBQAAAAIAAAAIVzJuwPJKgAAACwAAAALAAAAZXZlbnRzLmpzb26rVkotS80riS+pLEhVslJyy6woKS1KVdJRKi1OLYrPTAGKgVgmRkq1XABQSwECFAMUAAAACAAAACFcybsDySoAAAAsAAAACwAAAAAAAAAAAAAAgAEAAAAAZXZlbnRzLmpzb25QSwUGAAAAAAEAAQA5AAAAUwAAAAAA', 'base64')

const env = { AMPLITUDE_API_KEY:'fixture-key', AMPLITUDE_SECRET_KEY:'fixture-secret' }
const exportArgs=['export','events','--start','20260901T00','--end','20260901T23']
test('ZIP exports preserve every binary byte in a labelled base64 payload', () => {
  const result=run(exportArgs,env,`assert.equal(new URL(url).pathname,'/api/2/export');
    return new Response(Buffer.from('${archive.toString('base64')}','base64'),{headers:{'Content-Type':'application/zip'}});`)
  const data=value(result)
  assert.equal(data.encoding,'base64'); assert.equal(data.contentType,'application/zip')
  assert.deepEqual(Buffer.from(data.body,'base64'),archive)
})
test('export HTTP errors keep their JSON error response', () => {
  const result=run(exportArgs,env,"return new Response(JSON.stringify({error:'no data'}),{status:404});")
  assert.deepEqual(value(result, 1),{error:'no data'})
})
test('ordinary dashboard responses remain JSON', () => {
  const result=run(['users','activity','--user-id','12345'],env,"return new Response(JSON.stringify({events:[{event_type:'Fixture'}]}));")
  assert.deepEqual(value(result),{events:[{event_type:'Fixture'}]})
})
test('export dry-run is redacted and sends no request', () => {
  const result=run([...exportArgs,'--dry-run'],env)
  assert.equal(value(result)._dry_run,true)
  assert.equal(result.stdout.includes('fixture-key'),false)
  assert.equal(result.stdout.includes('fixture-secret'),false)
})
