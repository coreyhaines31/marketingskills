const { test } = require('node:test')
const assert = require('node:assert/strict')
const { createServer } = require('node:http')
const { spawn } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/plausible.js')

async function run(args) {
  const requests = []
  const cursor = 'next+/= page'
  const server = createServer(async (req, res) => {
    let text = ''
    for await (const chunk of req) text += chunk
    const url = new URL(req.url, 'http://fixture.test')
    const body = text ? JSON.parse(text) : undefined
    requests.push({ method: req.method, url, body })
    let payload
    if (url.pathname === '/api/v2/query') {
      payload = { results: [{ dimensions: [body.pagination?.offset === 20 ? '/second-page' : '/first-page'], metrics: [1] }], meta: {} }
    } else {
      const collection = url.pathname.endsWith('/goals') ? 'goals' : 'sites'
      const next = url.searchParams.get('after') === cursor
      payload = { [collection]: [{ id: next ? 'second-page' : 'first-page' }], meta: { after: next ? null : cursor, before: next ? 'previous==' : null, limit: Number(url.searchParams.get('limit') || 100) } }
    }
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(payload))
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  try {
    const child = spawn(process.execPath, [cli, ...args], { env: { ...process.env, PLAUSIBLE_API_KEY: 'owned-fixture-key', PLAUSIBLE_BASE_URL: `http://127.0.0.1:${server.address().port}` } })
    let stdout = '', stderr = ''
    child.stdout.on('data', data => { stdout += data })
    child.stderr.on('data', data => { stderr += data })
    const status = await new Promise(resolve => child.on('close', resolve))
    assert.equal(status, 0, stderr)
    return { payload: JSON.parse(stdout), requests, cursor }
  } finally { await new Promise(resolve => server.close(resolve)) }
}

for (const collection of ['sites', 'goals']) {
  const args = [collection, 'list', ...(collection === 'goals' ? ['--site-id', 'example.com'] : [])]
  test(`${collection} list honors an explicit page limit`, async () => {
    const result = await run([...args, '--limit', '20'])
    assert.equal(result.requests[0].url.searchParams.get('limit'), '20')
    assert.equal(result.payload.meta.limit, 20)
  })
  test(`${collection} list follows the returned opaque next cursor`, async () => {
    const first = await run([...args, '--limit', '20'])
    const second = await run([...args, '--after', first.payload.meta.after, '--limit', '20'])
    assert.equal(second.requests[0].url.searchParams.get('after'), first.cursor)
    assert.equal(second.payload[collection][0].id, 'second-page')
    assert.equal(second.payload.meta.after, null)
    if (collection === 'goals') assert.equal(second.requests[0].url.searchParams.get('site_id'), 'example.com')
  })
  test(`${collection} list encodes a previous cursor`, async () => {
    const result = await run([...args, '--before', 'previous+/= page'])
    assert.equal(result.requests[0].url.searchParams.get('before'), 'previous+/= page')
  })
  test(`${collection} default remains its first page`, async () => {
    const result = await run(args)
    assert.equal(result.payload[collection][0].id, 'first-page')
    assert.equal(result.payload.meta.limit, 100)
    assert.equal(result.requests[0].url.searchParams.has('after'), false)
    assert.equal(result.requests[0].url.searchParams.has('before'), false)
  })
  test(`${collection} page preview has the same encoded query and no request`, async () => {
    const result = await run([...args, '--after', 'next+/= page', '--limit', '20', '--dry-run'])
    assert.equal(result.requests.length, 0)
    const preview = new URL(result.payload.url)
    assert.equal(preview.searchParams.get('after'), 'next+/= page')
    assert.equal(preview.searchParams.get('limit'), '20')
    assert.equal(result.payload.headers.Authorization, '***')
  })
}
for (const sub of ['pages', 'sources', 'countries', 'devices', 'utm', 'query']) {
  test(`stats ${sub} requests the next offset instead of repeating the first rows`, async () => {
    const result = await run(['stats', sub, '--site-id', 'example.com', '--metrics', 'visitors', '--limit', '20', '--offset', '20'])
    assert.deepEqual(result.requests[0].body.pagination, { limit: 20, offset: 20 })
    assert.equal(result.payload.results[0].dimensions[0], '/second-page')
  })
}
test('stats page defaults preserve the existing request', async () => {
  const result = await run(['stats', 'pages', '--site-id', 'example.com'])
  assert.deepEqual(result.requests[0].body.pagination, { limit: 100 })
})
test('stats preview exposes an explicit zero offset without making a request', async () => {
  const result = await run(['stats', 'pages', '--site-id', 'example.com', '--offset', '0', '--dry-run'])
  assert.equal(result.requests.length, 0)
  assert.deepEqual(result.payload.body.pagination, { limit: 100, offset: 0 })
  assert.equal(result.payload.headers.Authorization, '***')
})
