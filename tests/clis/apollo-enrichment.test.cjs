const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/apollo.js')
function run(args, oracle = '') {
  const code = `global.fetch = async (url, options) => {
    const assert = require('node:assert/strict');
    const parsed = new URL(url);
    const body = options.body ? JSON.parse(options.body) : null;
    ${oracle}
    return new Response(JSON.stringify({accepted:true, url, body}), {status:200});
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', code], {
    encoding: 'utf8', timeout: 10000,
    env: { ...process.env, APOLLO_API_KEY: 'fixture-token' },
  })
}
function result(r) { assert.equal(r.status, 0, r.stderr); return JSON.parse(r.stdout) }

test('organization enrichment uses authenticated GET query without a request body', () => {
  const p = result(run(['organizations','enrich','--domain','example.com'], `
    assert.equal(options.method, 'GET');
    assert.equal(parsed.pathname, '/api/v1/organizations/enrich');
    assert.equal(parsed.searchParams.get('domain'), 'example.com');
    assert.equal(options.body, undefined);
    assert.equal(options.headers['x-api-key'], 'fixture-token');
  `))
  assert.equal(p.accepted, true)
})
test('people enrichment authenticates in the header and keeps business fields in the body', () => {
  assert.equal(result(run(['people','enrich','--email','jane@example.com'], `
    assert.equal(options.method, 'POST');
    assert.equal(parsed.pathname, '/api/v1/people/match');
    assert.equal(options.headers['x-api-key'], 'fixture-token');
    assert.deepEqual(body, {email:'jane@example.com'});
  `)).accepted, true)
})
test('bulk and organization search keep their POST payloads and header authentication', () => {
  result(run(['people','bulk-enrich','--emails','a@example.com,b@example.com'], `
    assert.equal(options.method, 'POST');
    assert.equal(options.headers['x-api-key'], 'fixture-token');
    assert.deepEqual(body, {details:[{email:'a@example.com'},{email:'b@example.com'}]});
  `))
  result(run(['organizations','search','--locations','New York'], `
    assert.equal(options.method, 'POST');
    assert.equal(options.headers['x-api-key'], 'fixture-token');
    assert.deepEqual(body, {page:1,per_page:25,organization_locations:['New York']});
  `))
})
test('enrichment previews match the actual request and redact the key', () => {
  const p = result(run(['organizations','enrich','--domain','example.com','--dry-run'], "throw new Error('unexpected fetch')"))
  assert.equal(p.method, 'GET')
  assert.equal(new URL(p.url).searchParams.get('domain'), 'example.com')
  assert.equal(p.headers['x-api-key'], '***')
  assert.equal(p.body, undefined)
  assert.equal(JSON.stringify(p).includes('fixture-token'), false)
  const person = result(run(['people','enrich','--email','jane@example.com','--dry-run'], "throw new Error('unexpected fetch')"))
  assert.equal(person.headers['x-api-key'], '***')
  assert.deepEqual(person.body, {email:'jane@example.com'})
})
