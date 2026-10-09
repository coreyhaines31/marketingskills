const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/ahrefs.js')
function run(args, network = false) {
  const code = `global.fetch = async (url, options) => {
    if (!${network}) throw new Error('Unexpected request');
    const parsed = new URL(url);
    if (!['/v3/site-explorer/all-backlinks', '/v3/site-explorer/refdomains'].includes(parsed.pathname) || !parsed.searchParams.get('select')) throw new Error('Invalid link-report contract');
    return new Response(JSON.stringify({url, method: options.method}));
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', code], {encoding: 'utf8', timeout: 5000, env: {...process.env, AHREFS_API_KEY: 'test-only-key'}})
}
for (const [command, route, selected] of [
  ['backlinks', 'all-backlinks', 'url_from,url_to,anchor,is_dofollow'],
  ['refdomains', 'refdomains', 'domain,domain_rating,links_to_target'],
]) {
  test(`${command} supplies required selected columns on the published route`, () => {
    const r = run([command, 'list', '--target', 'example.com', '--limit', '5'], true)
    assert.equal(r.status, 0, r.stderr)
    const result = JSON.parse(r.stdout)
    const parsed = new URL(result.url)
    assert.equal(parsed.pathname, `/v3/site-explorer/${route}`)
    assert.equal(parsed.searchParams.get('select'), selected)
    assert.equal(parsed.searchParams.get('target'), 'example.com')
    assert.equal(parsed.searchParams.get('limit'), '5')
    assert.equal(result.method, 'GET')
  })
  test(`${command} respects explicit columns in previews without making a request`, () => {
    const r = run([command, 'list', '--target', 'example.com', '--select', 'first_seen', '--dry-run'])
    assert.equal(r.status, 0, r.stderr)
    const result = JSON.parse(r.stdout)
    assert.equal(new URL(result.url).searchParams.get('select'), 'first_seen')
    assert.equal(result.headers.Authorization, '***')
  })
  test(`${command} rejects an incomplete column list before making a request`, () => {
    const r = run([command, 'list', '--target', 'example.com', '--select', 'domain,'])
    assert.notEqual(r.status, 0)
    assert.match(JSON.parse(r.stderr).error, /select/)
  })
}
