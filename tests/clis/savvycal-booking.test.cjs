const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/savvycal.js')
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
    env: { ...process.env, SAVVYCAL_API_KEY: 'fixture-token' },
  })
}
function result(r) { assert.equal(r.status, 0, r.stderr); return JSON.parse(r.stdout) }

const booking = ['events','create','--link-id','link_123','--start-at','2026-10-10T14:00:00Z','--end-at','2026-10-10T14:30:00Z','--time-zone','America/New_York','--name','Jane Doe','--email','jane@example.com']
const expected = {start_at:'2026-10-10T14:00:00Z',end_at:'2026-10-10T14:30:00Z',time_zone:'America/New_York',display_name:'Jane Doe',email:'jane@example.com'}
test('booking uses the scheduling-link endpoint with all required event fields', () => {
  assert.equal(result(run(booking, `
    assert.equal(options.method, 'POST');
    assert.equal(parsed.pathname, '/v1/links/link_123/events');
    assert.deepEqual(body, ${JSON.stringify(expected)});
  `)).accepted, true)
})
for (const missing of ['--end-at','--time-zone']) {
  test(`missing ${missing} is rejected before a booking request`, () => {
    const incomplete = booking.filter((v,i,a) => v !== missing && a[i-1] !== missing)
    const r = run(incomplete, "throw new Error('booking must not be attempted')")
    const p = result(r)
    assert.match(p.error, new RegExp(missing))
  })
}
test('booking preview matches the contract and never sends a request', () => {
  const p = result(run([...booking,'--dry-run'], "throw new Error('unexpected fetch')"))
  assert.equal(new URL(p.url).pathname, '/v1/links/link_123/events')
  assert.deepEqual(p.body, expected)
  assert.equal(p.headers.Authorization, '***')
})
test('booking encodes a scheduling link ID as one path component', () => {
  const args = booking.map(v => v === 'link_123' ? 'link/with?reserved#chars' : v)
  const p = result(run([...args,'--dry-run'], "throw new Error('unexpected fetch')"))
  assert.equal(new URL(p.url).pathname, '/v1/links/link%2Fwith%3Freserved%23chars/events')
})
test('listing events keeps cursor pagination', () => {
  result(run(['events','list','--after','cursor','--limit','5'], `
    assert.equal(options.method, 'GET');
    assert.equal(parsed.pathname, '/v1/events');
    assert.equal(parsed.searchParams.get('after'), 'cursor');
    assert.equal(parsed.searchParams.get('limit'), '5');
  `))
})
