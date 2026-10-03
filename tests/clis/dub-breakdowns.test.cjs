const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/dub.js')
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
    env: { ...process.env, DUB_API_KEY: 'fixture-token' },
  })
}
function result(r) { assert.equal(r.status, 0, r.stderr); return JSON.parse(r.stdout) }

for (const [command, dimension] of [['country','countries'],['device','devices']]) {
  test(`${command} breakdown uses the documented analytics grouping`, () => {
    const p = result(run(['analytics',command,'--domain','links.example.com','--key','summer sale','--interval','30d'], `
      assert.equal(options.method, 'GET');
      assert.equal(parsed.pathname, '/analytics');
      assert.equal(parsed.searchParams.get('groupBy'), ${JSON.stringify(dimension)});
      assert.equal(parsed.searchParams.get('domain'), 'links.example.com');
      assert.equal(parsed.searchParams.get('key'), 'summer sale');
      assert.equal(parsed.searchParams.get('interval'), '30d');
      assert.equal(options.body, undefined);
    `))
    assert.equal(p.accepted, true)
  })
  test(`${command} preview preserves grouping and redacts credentials`, () => {
    const p = result(run(['analytics',command,'--dry-run'], "throw new Error('unexpected fetch')"))
    assert.equal(new URL(p.url).pathname, '/analytics')
    assert.equal(new URL(p.url).searchParams.get('groupBy'), dimension)
    assert.equal(p.headers.Authorization, '***')
  })
}
test('total analytics retain their original endpoint and interval', () => {
  result(run(['analytics','get','--interval','7d'], `
    assert.equal(parsed.pathname, '/analytics');
    assert.equal(parsed.searchParams.has('groupBy'), false);
    assert.equal(parsed.searchParams.get('interval'), '7d');
  `))
})
