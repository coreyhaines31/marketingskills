const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/close.js')
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
    env: { ...process.env, CLOSE_API_KEY: 'fixture-token' },
  })
}
function result(r) { assert.equal(r.status, 0, r.stderr); return JSON.parse(r.stdout) }

for (const flag of ['--status-id','--status']) {
  test(`${flag} selects the actual opportunity status ID`, () => {
    assert.equal(result(run(['opportunities','create','--lead-id','lead_123','--value','50000',flag,'stat_won'], `
      assert.equal(options.method, 'POST');
      assert.equal(parsed.pathname, '/api/v1/opportunity/');
      assert.deepEqual(body, {lead_id:'lead_123',value:50000,status_id:'stat_won'});
    `)).accepted, true)
  })
}
for (const type of ['active','won','lost']) {
  test(`ambiguous ${type} status type cannot fall back to a default opportunity stage`, () => {
    const p = result(run(['opportunities','create','--lead-id','lead_123','--value','50000','--status',type], "throw new Error('unexpected opportunity creation')"))
    assert.match(p.error, /--status-id/)
  })
}
test('explicit status ID takes precedence over the legacy alias', () => {
  result(run(['opportunities','create','--lead-id','lead_123','--value','50000','--status','won','--status-id','stat_123'], `
    assert.equal(body.status_id, 'stat_123');
    assert.equal('status_type' in body, false);
  `))
})
test('unspecified status still uses the organization default', () => {
  result(run(['opportunities','create','--lead-id','lead_123','--value','0'], `
    assert.deepEqual(body, {lead_id:'lead_123',value:0});
  `))
})
test('preview shows the selected status ID with credentials redacted', () => {
  const p = result(run(['opportunities','create','--lead-id','lead_123','--value','50000','--status-id','stat_123','--dry-run'], "throw new Error('unexpected fetch')"))
  assert.equal(p.body.status_id, 'stat_123')
  assert.equal(p.headers.Authorization, 'Basic ***')
})
test('opportunity list retains the provider-supported status filter', () => {
  result(run(['opportunities','list','--status','won'], `
    assert.equal(parsed.searchParams.get('status'), 'won');
    assert.equal(options.method, 'GET');
  `))
})
