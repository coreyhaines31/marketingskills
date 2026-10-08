const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/firecrawl.js')
const id = '12345678-1234-4234-8234-123456789abc'

function run(args, mode = 'status') {
  const fixture = `global.fetch = async (url, options) => {
    const assert = require('node:assert/strict');
    if (${JSON.stringify(mode)} === 'no-request') throw new Error('unexpected status request');
    const parsed = new URL(url);
    assert.equal(parsed.origin, 'https://api.firecrawl.dev');
    assert.equal(options.method, 'GET'); assert.equal(options.headers.Authorization, 'Bearer fixture-only-key');
    assert.equal(parsed.pathname, '/v2/crawl/${id}' + (${JSON.stringify(mode)} === 'errors' ? '/errors' : ''));
    let payload;
    if (${JSON.stringify(mode)} === 'errors') payload = {errors:[{id:'page-2',url:'https://example.com/failed',error:'Timed out'}],robotsBlocked:['https://example.com/private']};
    else payload = {status:'completed',total:2,completed:2,next:parsed.searchParams.get('skip') === '1' ? null : 'https://api.firecrawl.dev/v2/crawl/${id}?skip=1',data:[{markdown:parsed.searchParams.get('skip') === '1' ? 'Second result' : 'First result'}]};
    return new Response(JSON.stringify(payload), {status:200});
  }; process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', fixture], { encoding:'utf8', timeout:10000, env:{...process.env,FIRECRAWL_API_KEY:'fixture-only-key'} })
}
function output(result) { assert.equal(result.status, 0, result.stderr); return JSON.parse(result.stdout) }

test('completed crawls can retrieve the page referenced by next', () => {
  const first = output(run(['crawl-status', '--id', id]))
  assert.equal(first.status, 'completed')
  assert.equal(first.data[0].markdown, 'First result')
  const skip = new URL(first.next).searchParams.get('skip')
  const next = output(run(['crawl-status', '--id', id, '--skip', skip]))
  assert.equal(next.data[0].markdown, 'Second result')
  assert.equal(next.next, null)
})
test('positional crawl ID also accepts the next result offset', () => {
  const result = output(run(['crawl-status', id, '--skip', '1']))
  assert.equal(result.data[0].markdown, 'Second result')
})
test('crawl errors retain failed pages and robots exclusions separately', () => {
  const result = output(run(['crawl-errors', '--id', id], 'errors'))
  assert.deepEqual(result.errors, [{id:'page-2',url:'https://example.com/failed',error:'Timed out'}])
  assert.deepEqual(result.robotsBlocked, ['https://example.com/private'])
})
test('positional crawl-errors ID requests the same error resource', () => {
  assert.equal(output(run(['crawl-errors', id], 'errors')).errors[0].id, 'page-2')
})
test('status preview includes skip without fetching another page', () => {
  const result = output(run(['crawl-status', '--id', id, '--skip', '1', '--dry-run']))
  const url = new URL(result.url)
  assert.equal(url.pathname, `/v2/crawl/${id}`)
  assert.equal(url.searchParams.get('skip'), '1')
  assert.equal(result.headers.Authorization, 'Bearer ***')
})
test('explicit zero skip remains visible in preview', () => {
  assert.equal(new URL(output(run(['crawl-status', '--id', id, '--skip', '0', '--dry-run'])).url).searchParams.get('skip'), '0')
})
test('error inspection preview uses the read-only errors endpoint', () => {
  const result = output(run(['crawl-errors', '--id', id, '--dry-run'], 'errors'))
  assert.equal(result.url, `https://api.firecrawl.dev/v2/crawl/${id}/errors`)
  assert.equal(result.method, 'GET')
  assert.equal(result.headers.Authorization, 'Bearer ***')
})
test('default status request still returns the first page', () => {
  assert.equal(output(run(['crawl-status', '--id', id])).data[0].markdown, 'First result')
})

test('invalid page offsets are rejected before the status request', () => {
  for (const skip of ['-1', '1.5', 'not-a-number', '9007199254740992']) {
    const result = run(['crawl-status', '--id', id, '--skip', skip], 'no-request')
    // Local result status can be zero on current main or nonzero after the
    // independent CLI exit-status fix; this test covers the request contract.
    assert.ok(result.status === 0 || result.status === 1)
    const payload = JSON.parse(result.stdout || result.stderr)
    assert.match(payload.error, /--skip must be a nonnegative integer/)
  }
})
