const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const http = require('node:http')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/paddle.js')

async function run(args) {
  const requests = []
  const server = http.createServer((req, res) => {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      const record = { method: req.method, path: req.url, body: JSON.parse(body) }
      requests.push(record)
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ data: record }))
    })
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const local = `http://127.0.0.1:${server.address().port}`
  const source = `const originalFetch = global.fetch;
    global.fetch = (url, options) => {
      const request = new URL(url);
      if (request.origin !== 'https://api.paddle.com') throw new Error('Unexpected external request');
      return originalFetch(${JSON.stringify(local)} + request.pathname + request.search, options);
    };
    process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  try {
    const child = spawn(process.execPath, ['-e', source], {
      env: { ...process.env, PADDLE_API_KEY: 'test-only-key', PADDLE_SANDBOX: 'false' },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let output = '', errors = ''
    child.stdout.on('data', data => { output += data })
    child.stderr.on('data', data => { errors += data })
    const timeout = setTimeout(() => child.kill('SIGKILL'), 5000)
    const exit = await new Promise((resolve, reject) => {
      child.once('error', reject)
      child.once('close', code => resolve(code))
    }).finally(() => clearTimeout(timeout))
    const result = JSON.parse(output)
    // These tests check request contracts; local validation exit conventions
    // are covered separately. Successful requests must exit zero.
    if (!result.error || result.usage) assert.equal(exit, 0, errors)
    else assert.ok(exit === 0 || exit === 1, errors)
    return { result, requests }
  } finally {
    server.closeAllConnections()
    await new Promise(resolve => server.close(resolve))
  }
}
const update = ['subscriptions', 'update', '--id', 'sub_01example']
const items = [{ price_id: 'pri_existing', quantity: 2 }, { price_id: 'pri_new', quantity: 1 }]
test('replaces the complete subscription item list with explicit proration', async () => {
  const { requests } = await run([...update, '--items', JSON.stringify(items), '--proration-billing-mode', 'prorated_next_billing_period'])
  assert.deepEqual(requests, [{ method: 'PATCH', path: '/subscriptions/sub_01example', body: { items, proration_billing_mode: 'prorated_next_billing_period' } }])
})
test('changes the next billing date with explicit proration', async () => {
  const { requests } = await run([...update, '--next-billed-at', '2026-11-01T00:00:00Z', '--proration-billing-mode', 'do_not_bill'])
  assert.deepEqual(requests[0].body, { next_billed_at: '2026-11-01T00:00:00Z', proration_billing_mode: 'do_not_bill' })
})
for (const change of [['--items', JSON.stringify(items)], ['--next-billed-at', '2026-11-01T00:00:00Z']]) {
  test(`${change[0]} requires an explicit billing policy before making a request`, async () => {
    const { result, requests } = await run([...update, ...change])
    assert.match(result.error, /proration-billing-mode required/)
    assert.equal(requests.length, 0)
  })
}
for (const value of ['{', '{}', '[]', 'null']) {
  test(`rejects invalid items ${value} before making a request`, async () => {
    const { result, requests } = await run([...update, '--items', value, '--proration-billing-mode', 'do_not_bill'])
    assert.match(result.error, /JSON|nonempty/)
    assert.equal(requests.length, 0)
  })
}
test('previews both supported changes without sending or exposing credentials', async () => {
  const { result, requests } = await run([...update, '--items', JSON.stringify(items), '--next-billed-at', '2026-11-01T00:00:00Z', '--proration-billing-mode', 'full_next_billing_period', '--dry-run'])
  assert.deepEqual(result.body, { items, next_billed_at: '2026-11-01T00:00:00Z', proration_billing_mode: 'full_next_billing_period' })
  assert.equal(result.headers.Authorization, '***')
  assert.equal(JSON.stringify(result).includes('test-only-key'), false)
  assert.equal(requests.length, 0)
})
test('preserves scheduled-change removal without requiring proration', async () => {
  const { requests } = await run([...update, '--scheduled-change', 'null'])
  assert.deepEqual(requests[0].body, { scheduled_change: null })
})
test('preserves the existing proration-only payload', async () => {
  const { requests } = await run([...update, '--proration-billing-mode', 'do_not_bill'])
  assert.deepEqual(requests[0].body, { proration_billing_mode: 'do_not_bill' })
})
test('preserves no-argument usage without requesting or requiring credentials', async () => {
  const { result, requests } = await run([])
  assert.ok(result.usage.subscriptions)
  assert.equal(requests.length, 0)
})
