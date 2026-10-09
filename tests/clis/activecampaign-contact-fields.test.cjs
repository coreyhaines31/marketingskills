const { test } = require('node:test')
const assert = require('node:assert/strict')
const { createServer } = require('node:http')
const { spawn } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/activecampaign.js')
const values = [{ field: '12', value: 'Enterprise' }, { field: '13', value: '' }]

async function run(args) {
  const requests = []
  const server = createServer(async (req, res) => {
    let text = ''
    for await (const chunk of req) text += chunk
    requests.push({ method: req.method, url: new URL(req.url, 'http://fixture.test'),
      body: text ? JSON.parse(text) : undefined, token: req.headers['api-token'] })
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ fields: [{ id: '12', title: 'Plan', perstag: 'PLAN' }], contact: requests.at(-1).body?.contact }))
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  try {
    const child = spawn(process.execPath, [cli, ...args], { env: { ...process.env,
      ACTIVECAMPAIGN_API_KEY: 'owned-fixture-key', ACTIVECAMPAIGN_API_URL: `http://127.0.0.1:${server.address().port}` } })
    let stdout = '', stderr = ''
    child.stdout.on('data', chunk => { stdout += chunk })
    child.stderr.on('data', chunk => { stderr += chunk })
    const status = await new Promise(resolve => child.on('close', resolve))
    return { status, payload: JSON.parse(stdout || stderr), requests }
  } finally { await new Promise(resolve => server.close(resolve)) }
}

for (const sub of ['create', 'update', 'sync']) {
  const args = ['contacts', sub, ...(sub === 'update' ? ['--id', '24'] : ['--email', 'owned@example.com'])]
  test(`${sub} sends custom values inside the contact object`, async () => {
    const result = await run([...args, '--field-values', JSON.stringify(values)])
    assert.equal(result.status, 0)
    assert.equal(result.requests.length, 1)
    assert.equal(result.requests[0].method, sub === 'update' ? 'PUT' : 'POST')
    assert.equal(result.requests[0].url.pathname, sub === 'sync' ? '/api/3/contact/sync' : sub === 'update' ? '/api/3/contacts/24' : '/api/3/contacts')
    assert.equal(result.requests[0].token, 'owned-fixture-key')
    assert.deepEqual(result.payload.contact.fieldValues, values)
  })
  test(`${sub} preview includes custom values without a request`, async () => {
    const result = await run([...args, '--field-values', JSON.stringify(values), '--dry-run'])
    assert.equal(result.status, 0)
    assert.equal(result.requests.length, 0)
    assert.deepEqual(result.payload.body.contact.fieldValues, values)
    assert.equal(result.payload.headers['Api-Token'], '***')
  })
  test(`${sub} preserves the request when fields are omitted`, async () => {
    const result = await run(args)
    assert.equal(result.status, 0)
    assert.deepEqual(result.payload.contact, sub === 'update' ? {} : { email: 'owned@example.com' })
  })
}
test('field discovery preserves provider definitions and paginates', async () => {
  const result = await run(['fields', 'list', '--limit', '10', '--offset', '20', '--search', 'Customer plan'])
  assert.equal(result.status, 0)
  assert.deepEqual(result.payload.fields, [{ id: '12', title: 'Plan', perstag: 'PLAN' }])
  const url = result.requests[0].url
  assert.equal(url.pathname, '/api/3/fields')
  assert.equal(url.searchParams.get('limit'), '10')
  assert.equal(url.searchParams.get('offset'), '20')
  assert.equal(url.searchParams.get('search'), 'Customer plan')
})
test('field discovery preview makes no request', async () => {
  const result = await run(['fields', 'list', '--dry-run'])
  assert.equal(result.status, 0)
  assert.equal(result.requests.length, 0)
  assert.equal(new URL(result.payload.url).pathname, '/api/3/fields')
})
test('invalid field-values fail before changing a contact', async () => {
  for (const input of ['[bad', '{}', 'null', '[null]', '[{"field":"12"}]', '[{"value":"x"}]']) {
    const result = await run(['contacts', 'sync', '--email', 'owned@example.com', '--field-values', input])
    assert.equal(result.status, 1)
    assert.match(result.payload.error, /--field-values/)
    assert.equal(result.requests.length, 0)
  }
})
