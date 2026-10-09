const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

const cli = path.resolve(__dirname, '../../tools/clis/dataforseo.js')
function run(args, dry = false) {
  const source = `global.fetch = async (url, options) => ({ ok: true, status: 200, text: async () => JSON.stringify({ url, method: options.method, body: JSON.parse(options.body) }) }); process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}, ...( ${dry} ? ['--dry-run'] : [])]; require(${JSON.stringify(cli)});`
  const result = spawnSync(process.execPath, ['-e', source], {encoding: 'utf8', env: {...process.env, DATAFORSEO_LOGIN: 'fixture-login', DATAFORSEO_PASSWORD: 'fixture-password'}})
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}
test('SERP code flags select the requested market and language', () => {
  const result = run(['serp', 'google', '--keyword', 'chaussures', '--location-code', '2250', '--language-code', 'fr'])
  assert.deepEqual(result.body, [{keyword: 'chaussures', location_code: 2250, language_code: 'fr'}])
})
test('codes take precedence over conflicting name flags without sending both', () => {
  const result = run(['serp', 'google', '--keyword', 'shoes', '--location', 'United States', '--location-code', '2250', '--language', 'English', '--language-code', 'fr'])
  assert.deepEqual(result.body, [{keyword: 'shoes', location_code: 2250, language_code: 'fr'}])
})
test('explicit names and defaults retain their existing contract', () => {
  assert.deepEqual(run(['serp','google','--keyword','shoes']).body, [{keyword:'shoes',location_name:'United States',language_name:'English'}])
  assert.deepEqual(run(['serp','google','--keyword','chaussures','--location','France','--language','French']).body, [{keyword:'chaussures',location_name:'France',language_name:'French'}])
})
test('invalid or missing location code is rejected before requesting a paid report', () => {
  for (const value of ['abc', '0', '1.5', '9007199254740993', undefined]) {
    const result = run(['serp','google','--keyword','shoes','--location-code', ...(value === undefined ? [] : [value])])
    assert.match(result.error || '', /location-code/)
    assert.equal(result.body, undefined)
  }
})
test('missing language code is rejected and dry run uses the same market with masked auth', () => {
  assert.match(run(['serp','google','--keyword','shoes','--language-code']).error || '', /language-code/)
  const result = run(['serp','google','--keyword','shoes','--location-code','2250','--language-code','fr'], true)
  assert.deepEqual(result.body, [{keyword:'shoes',location_code:2250,language_code:'fr'}])
  assert.equal(result.headers.Authorization, '***')
})
