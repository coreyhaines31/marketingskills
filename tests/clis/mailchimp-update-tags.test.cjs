const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/mailchimp.js')
function run(args) {
  // A real local HTTP server enforces the published distinction between
  // PATCH member fields and POST tag activation objects, without Mailchimp calls.
  const code = `const http = require('node:http'); const realFetch = global.fetch;
    const server = http.createServer(async (req, res) => {
      let raw = ''; for await (const part of req) raw += part;
      const body = raw ? JSON.parse(raw) : null;
      process.stderr.write('fixture_request=' + JSON.stringify({method: req.method, path: req.url, body}) + String.fromCharCode(10));
      if (req.method === 'POST' && req.url.endsWith('/tags') && body.tags.every(tag => tag.name && tag.status === 'active')) {
        res.writeHead(204); res.end();
      } else if (req.method === 'PATCH' && body.tags) {
        res.writeHead(400, {'Content-Type': 'application/json'}); res.end(JSON.stringify({title: 'Unsupported member update field'}));
      } else { res.writeHead(200, {'Content-Type': 'application/json'}); res.end(JSON.stringify({id: 'member123'})); }
    });
    server.listen(0, '127.0.0.1', () => {
      const write = process.stdout.write.bind(process.stdout);
      process.stdout.write = (chunk, ...rest) => { const result = write(chunk, ...rest); server.close(); server.closeAllConnections(); return result; };
      global.fetch = (url, options) => {
        const local = new URL(url); local.protocol = 'http:'; local.hostname = '127.0.0.1'; local.port = server.address().port;
        return realFetch(local, options);
      };
      process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});
    });`
  const r = spawnSync(process.execPath, ['-e', code], {encoding: 'utf8', env: {...process.env, MAILCHIMP_API_KEY: 'test-only-us7'}, timeout: 10000})
  assert.equal(r.status, 0, r.stderr)
  const requests = r.stderr.split('\n').filter(line => line.startsWith('fixture_request=')).map(line => JSON.parse(line.slice('fixture_request='.length)))
  return {result: JSON.parse(r.stdout), requests}
}
const update = ['members', 'update', 'hash123', '--list-id', 'audience123']
test('tag-only updates use the tag activation endpoint on actual HTTP', () => {
  const r = run([...update, '--tags', 'newsletter, trial'])
  assert.equal(r.result.status, 204)
  assert.deepEqual(r.requests, [{method: 'POST', path: '/3.0/lists/audience123/members/hash123/tags', body: {tags: [{name: 'newsletter', status: 'active'}, {name: 'trial', status: 'active'}]}}])
})
for (const extra of [['--status', 'unsubscribed'], ['--first-name', 'Zoë']]) {
  test(`mixed tag and member-field update ${extra[0]} fails before either mutation`, () => {
    const r = run([...update, '--tags', 'newsletter', ...extra])
    assert.match(r.result.error || '', /separately/)
    assert.equal(r.requests.length, 0)
  })
}
for (const tags of ['newsletter,,trial', '  ', null]) {
  test(`invalid tag list ${JSON.stringify(tags)} is rejected before HTTP`, () => {
    const r = run([...update, '--tags', ...(tags === null ? [] : [tags])])
    assert.match(r.result.error || '', /non-empty tag/)
    assert.equal(r.requests.length, 0)
  })
}
test('tag previews redact credentials and send no HTTP request', () => {
  const r = run([...update, '--tags', 'newsletter', '--dry-run'])
  assert.equal(r.result.method, 'POST')
  assert.equal(r.result.url.endsWith('/tags'), true)
  assert.equal(r.result.headers.Authorization, '***')
  assert.deepEqual(r.result.body, {tags: [{name: 'newsletter', status: 'active'}]})
  assert.equal(r.requests.length, 0)
})
test('profile updates remain a single PATCH without tags', () => {
  const r = run([...update, '--first-name', 'Zoë', '--status', 'pending'])
  assert.deepEqual(r.requests, [{method: 'PATCH', path: '/3.0/lists/audience123/members/hash123', body: {status: 'pending', merge_fields: {FNAME: 'Zoë'}}}])
})
test('creation keeps its supported string-array tags contract', () => {
  const r = run(['members', 'add', '--list-id', 'audience123', '--email', 'user@example.com', '--tags', 'newsletter,trial'])
  assert.equal(r.requests[0].method, 'POST')
  assert.deepEqual(r.requests[0].body.tags, ['newsletter', 'trial'])
})
