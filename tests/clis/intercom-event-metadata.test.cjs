const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/intercom.js')

function run(extra) {
  const args = ['events', 'create', '--name', 'purchased-item', '--user-id', 'user_123', '--created-at', '1706140800', ...extra]
  const code = `global.fetch = async (url, options) => {
    process.stderr.write('REQUEST:' + JSON.stringify({ url, body: JSON.parse(options.body) }));
    return new Response(null, { status: 202 });
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', timeout: 10000, env: { ...process.env, INTERCOM_API_KEY: 'fixture-token' } })
}

for (const mode of [[], ['--dry-run']]) {
  test(`malformed event metadata fails without creating or previewing a stripped event ${mode}`, () => {
    const result = run(['--metadata', '{"item_name":"Pro Plan",}', ...mode])
    assert.equal(result.status, 1, result.stdout + result.stderr)
    assert.match(result.stderr, /Invalid JSON in --metadata/)
    assert.doesNotMatch(result.stderr, /REQUEST:/)
    assert.equal(result.stdout, '')
  })
}

test('valid structured event metadata is preserved in the actual request', () => {
  const metadata = { item_name: 'Pro Plan', price: { amount: 9900, currency: 'usd' }, source: 'checkout' }
  const result = run(['--metadata', JSON.stringify(metadata)])
  assert.equal(result.status, 0, result.stderr)
  const request = JSON.parse(result.stderr.slice('REQUEST:'.length))
  assert.equal(new URL(request.url).pathname, '/events')
  assert.deepEqual(request.body, { event_name: 'purchased-item', user_id: 'user_123', created_at: 1706140800, metadata })
  assert.deepEqual(JSON.parse(result.stdout), { status: 202, body: '' })
})

test('events without metadata retain the existing optional-metadata behavior', () => {
  const result = run([])
  assert.equal(result.status, 0, result.stderr)
  const request = JSON.parse(result.stderr.slice('REQUEST:'.length))
  assert.equal(Object.hasOwn(request.body, 'metadata'), false)
})

test('valid metadata preview is identical and does not send a request', () => {
  const metadata = { item_name: 'Pro Plan', price: 99 }
  const result = run(['--metadata', JSON.stringify(metadata), '--dry-run'])
  assert.equal(result.status, 0, result.stderr)
  assert.equal(result.stderr, '')
  assert.deepEqual(JSON.parse(result.stdout).body.metadata, metadata)
})
