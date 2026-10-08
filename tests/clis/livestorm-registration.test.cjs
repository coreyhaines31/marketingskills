const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/livestorm.js')
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
    env: { ...process.env, LIVESTORM_API_TOKEN: 'fixture-token' },
  })
}
function result(r) { assert.equal(r.status, 0, r.stderr); return JSON.parse(r.stdout) }

test('registration sends an array of field IDs and values using the API token header', () => {
  assert.equal(result(run(['sessions','register','--id','session_123','--email','jane+event@example.com','--first-name','Jane','--last-name','Doe'], `
    assert.equal(options.method, 'POST');
    assert.equal(parsed.pathname, '/v1/sessions/session_123/people');
    assert.equal(options.headers.Authorization, 'fixture-token');
    assert.deepEqual(body, {data:{type:'people',attributes:{fields:[
      {id:'email',value:'jane+event@example.com'},
      {id:'first_name',value:'Jane'},
      {id:'last_name',value:'Doe'}
    ]}}});
  `)).accepted, true)
})
test('email-only registration omits optional name fields', () => {
  result(run(['sessions','register','--id','session_123','--email','jane@example.com'], `
    assert.deepEqual(body.data.attributes.fields, [{id:'email',value:'jane@example.com'}]);
  `))
})
test('registration preview preserves the field array and masks the token', () => {
  const p = result(run(['sessions','register','--id','session_123','--email','jane@example.com','--dry-run'], "throw new Error('unexpected fetch')"))
  assert.deepEqual(p.body.data.attributes.fields, [{id:'email',value:'jane@example.com'}])
  assert.equal(p.headers.Authorization, '***')
  assert.equal(JSON.stringify(p).includes('fixture-token'), false)
})
test('read requests use the same raw API token authentication', () => {
  result(run(['ping'], `
    assert.equal(options.method, 'GET');
    assert.equal(parsed.pathname, '/v1/ping');
    assert.equal(options.headers.Authorization, 'fixture-token');
    assert.equal(options.body, undefined);
  `))
})
test('missing registration email remains rejected without a request', () => {
  assert.match(result(run(['sessions','register','--id','session_123'], "throw new Error('unexpected fetch')")).error, /--email required/)
})
