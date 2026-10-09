const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/ga4.js')
const command = ['events', 'send', '--measurement-id', 'G-TEST', '--api-secret', 'test-only-secret', '--client-id', '123.456', '--event-name', 'purchase']
function run(args) {
  // The actual CLI fetch reaches an actual local HTTP server returning 204,
  // matching the documented collect response for malformed payloads.
  const code = `const http = require('node:http'); const realFetch = global.fetch;
    const server = http.createServer(async (req, res) => {
      let body = ''; for await (const part of req) body += part;
      process.stderr.write('fixture_request=' + JSON.stringify({method: req.method, body: JSON.parse(body)}) + String.fromCharCode(10));
      res.writeHead(204); res.end();
    });
    server.listen(0, '127.0.0.1', () => {
      const write = process.stdout.write.bind(process.stdout);
      process.stdout.write = (chunk, ...rest) => { const result = write(chunk, ...rest); server.close(); server.closeAllConnections(); return result; };
      global.fetch = async (url, options) => {
        const local = new URL(url); local.protocol = 'http:'; local.hostname = '127.0.0.1'; local.port = server.address().port;
        return realFetch(local, options);
      };
      process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify([...command, ...args])}]; require(${JSON.stringify(cli)});
    });`
  const env = {...process.env}; delete env.GA4_ACCESS_TOKEN
  const r = spawnSync(process.execPath, ['-e', code], {encoding: 'utf8', timeout: 10000, env})
  assert.equal(r.status, 0, r.stderr)
  return {result: JSON.parse(r.stdout), stderr: r.stderr}
}
for (const params of ['null', '[]', 'true', '42', '"hello"']) {
  test(`non-object event parameters ${params} are rejected before an HTTP 204 receipt`, () => {
    const r = run(['--params', params])
    assert.match(r.result.error || '', /JSON object/, JSON.stringify(r.result))
    assert.equal(r.stderr.includes('fixture_request='), false)
  })
}
test('valid event parameters retain nested ecommerce items on a real HTTP request', () => {
  const params = {currency: 'USD', value: 12.5, items: [{item_id: 'sku123', price: 12.5}]}
  const r = run(['--params', JSON.stringify(params)])
  assert.equal(r.result.status, 204)
  const request = JSON.parse(r.stderr.split('\n').find(line => line.startsWith('fixture_request=')).slice('fixture_request='.length))
  assert.equal(request.method, 'POST')
  assert.deepEqual(request.body.events[0].params, params)
})
test('omitted parameters still send an empty object', () => {
  const r = run([])
  const request = JSON.parse(r.stderr.split('\n').find(line => line.startsWith('fixture_request=')).slice('fixture_request='.length))
  assert.deepEqual(request.body.events[0].params, {})
})
test('valid parameter previews preserve the object and make no HTTP request', () => {
  const r = run(['--params', '{"session_id":123}', '--dry-run'])
  assert.deepEqual(r.result.body.events[0].params, {session_id: 123})
  assert.equal(new URL(r.result.url).searchParams.get('api_secret'), '***')
  assert.equal(r.stderr.includes('fixture_request='), false)
})
