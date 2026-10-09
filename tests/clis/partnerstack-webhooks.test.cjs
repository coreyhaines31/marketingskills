const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

const cli = path.resolve(__dirname, '../../tools/clis/partnerstack.js')
function run(args, network = false) {
  const source = `global.fetch = async (url, options) => {
    if (!${network}) throw new Error('Unexpected network request');
    const body = JSON.parse(options.body);
    const valid = typeof body.target_url === 'string' && Array.isArray(body.events) && body.events.length > 0;
    return { ok: valid, status: valid ? 200 : 400, text: async () => JSON.stringify(valid
      ? { data: { key: 'hook_owned', ...body }, request: { url, method: options.method } }
      : { error: 'target_url and events are required' }) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const result = spawnSync(process.execPath, ['-e', source], {
    encoding: 'utf8', timeout: 5000,
    env: { ...process.env, PARTNERSTACK_PUBLIC_KEY: 'owned-public', PARTNERSTACK_SECRET_KEY: 'owned-secret' },
  })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}

const create = ['webhooks', 'create', '--target', 'https://example.com/partnerstack']
test('webhook creation sends the documented destination and event list', () => {
  const result = run([...create, '--events', 'customer.created,transaction.created'], true)
  assert.deepEqual(result.data, {
    key: 'hook_owned', target_url: 'https://example.com/partnerstack',
    events: ['customer.created', 'transaction.created'],
  })
  assert.deepEqual(result.request, { url: 'https://api.partnerstack.com/api/v2/webhooks', method: 'POST' })
})
test('webhook creation requires events before making a request', () => {
  assert.match(run(create).error, /--events required/)
})
test('webhook creation still requires a destination', () => {
  assert.match(run(['webhooks', 'create', '--events', 'customer.created']).error, /--target required/)
})
test('dry run previews the same webhook payload without credentials or a request', () => {
  const result = run([...create, '--events', 'customer.created', '--dry-run'])
  assert.deepEqual(result.body, { target_url: 'https://example.com/partnerstack', events: ['customer.created'] })
  assert.equal(result.headers.Authorization, '***')
  assert.equal(JSON.stringify(result).includes('owned-secret'), false)
})
