const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/dub.js')

function run(args, oracle = '') {
  const code = `global.fetch = async (url, options) => {
    const assert = require('node:assert/strict');
    const body = options.body ? JSON.parse(options.body) : null;
    ${oracle}
    return new Response(JSON.stringify({ url, method: options.method, body }), { status: 200 });
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', code], {
    encoding: 'utf8', timeout: 10000,
    env: { ...process.env, DUB_API_KEY: 'fixture-token' },
  })
}

function result(r) { assert.equal(r.status, 0, r.stderr); return JSON.parse(r.stdout) }

for (const [command, flags, method, endpoint] of [
  ['create', ['--url', 'https://example.com/summer', '--domain', 'links.example.com', '--key', 'summer'], 'POST', '/links'],
  ['update', ['--id', 'cl_owned_link', '--url', 'https://example.com/new-summer'], 'PATCH', '/links/cl_owned_link'],
]) {
  test(`${command} sends tag names in the supported request field`, () => {
    const p = result(run(['links', command, ...flags, '--tags', 'campaign:Summer,channel:email'], `
      assert.equal(new URL(url).pathname, ${JSON.stringify(endpoint)});
      assert.equal(options.method, ${JSON.stringify(method)});
      assert.deepEqual(body.tagNames, ['campaign:Summer', 'channel:email']);
      assert.equal(Object.hasOwn(body, 'tags'), false);
      assert.equal(Object.hasOwn(body, 'tagIds'), false);
    `))
    assert.equal(p.body.url, command === 'create' ? 'https://example.com/summer' : 'https://example.com/new-summer')
    if (command === 'create') {
      assert.equal(p.body.domain, 'links.example.com')
      assert.equal(p.body.key, 'summer')
    }
  })

  test(`${command} previews a single tag name without making a request`, () => {
    const p = result(run(['links', command, ...flags, '--tags', 'channel:email', '--dry-run'], "throw new Error('unexpected fetch')"))
    assert.deepEqual(p.body.tagNames, ['channel:email'])
    assert.equal(Object.hasOwn(p.body, 'tags'), false)
    assert.equal(p.headers.Authorization, '***')
    assert.equal(p.method, method)
  })

  test(`${command} without tags omits tag mutations`, () => {
    result(run(['links', command, ...flags], `
      assert.equal(Object.hasOwn(body, 'tagNames'), false);
      assert.equal(Object.hasOwn(body, 'tags'), false);
      assert.equal(Object.hasOwn(body, 'tagIds'), false);
    `))
  })
}

test('bulk create forwards caller-supplied tag IDs without interpreting them as names', () => {
  const links = [{ url: 'https://example.com', tagIds: ['cl_owned_tag'] }]
  const p = result(run(['links', 'bulk-create', '--links', JSON.stringify(links)], `
    assert.equal(new URL(url).pathname, '/links/bulk');
    assert.equal(options.method, 'POST');
  `))
  assert.deepEqual(p.body, links)
})
