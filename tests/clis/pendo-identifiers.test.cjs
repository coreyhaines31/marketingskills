const { test } = require('node:test')
const assert = require('node:assert/strict')
const { createServer } = require('node:http')
const { spawn } = require('node:child_process')
const { once } = require('node:events')
const path = require('node:path')

const cli = path.resolve(__dirname, '../../tools/clis/pendo.js')

async function run(kind, id, dryRun = false) {
  const requests = []
  const server = createServer((req, res) => {
    requests.push(req.url)
    const parts = new URL(req.url, 'http://localhost').pathname.split('/')
    let decoded
    try { decoded = decodeURIComponent(parts[4]) } catch {}
    const accepted = parts.length === 5 && parts[3] === kind && decoded === id
    res.writeHead(accepted ? 200 : 404, { 'content-type': 'application/json' })
    res.end(JSON.stringify(accepted ? { id: decoded, route: req.url } : { error: 'No exact record', route: req.url }))
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const origin = `http://127.0.0.1:${server.address().port}`
  const args = [kind === 'visitor' ? 'visitors' : 'accounts', 'get', '--id', id]
  if (dryRun) args.push('--dry-run')
  const source = `const nativeFetch = global.fetch;
    global.fetch = (input, options) => {
      const url = new URL(input); url.protocol = 'http:'; url.host = new URL(${JSON.stringify(origin)}).host;
      return nativeFetch(url, options);
    };
    process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const child = spawn(process.execPath, ['-e', source], {
    env: { ...process.env, PENDO_INTEGRATION_KEY: 'owned-fixture-key' }, stdio: ['ignore', 'pipe', 'pipe'],
  })
  let output = '', error = ''
  child.stdout.on('data', chunk => { output += chunk })
  child.stderr.on('data', chunk => { error += chunk })
  const timer = setTimeout(() => child.kill(), 5000)
  try {
    const [code] = await once(child, 'close')
    assert.equal(code, 0, error)
    return { result: JSON.parse(output), requests }
  } finally {
    clearTimeout(timer)
    server.closeAllConnections()
    await new Promise(resolve => server.close(resolve))
  }
}

for (const kind of ['visitor', 'account']) {
  for (const id of ['Lee#Ops@example.test', 'Acme/Europe', '100% Club', 'team%2Fnorth', 'Café & North', 'caseSensitive-123']) {
    test(`${kind} lookup retains literal identifier ${id}`, async () => {
      const { result, requests } = await run(kind, id)
      assert.equal(result.id, id, JSON.stringify(result))
      assert.equal(requests.length, 1)
      assert.equal(requests[0], `/api/v1/${kind}/${encodeURIComponent(id)}`)
    })
  }
  test(`${kind} preview encodes its path without making a request`, async () => {
    const id = 'Acme/Europe#2%'
    const { result, requests } = await run(kind, id, true)
    assert.deepEqual(requests, [])
    assert.equal(result.url, `https://app.pendo.io/api/v1/${kind}/${encodeURIComponent(id)}`)
    assert.equal(result.headers['x-pendo-integration-key'], '***')
    assert.equal(JSON.stringify(result).includes('owned-fixture-key'), false)
  })
}
