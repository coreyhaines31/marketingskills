const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/klaviyo.js')
function run(args, fetch = false, expectedStatus = 0) {
  const source = `global.fetch = async (url, options) => {
    if (!${fetch}) throw new Error('Unexpected network request');
    return { status: 200, text: async () => JSON.stringify({ url, method: options.method, body: options.body ? JSON.parse(options.body) : null }) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const result = spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', env: { ...process.env, KLAVIYO_API_KEY: 'fake-key' }, timeout: 5000 })
  assert.equal(result.status, expectedStatus, result.stderr)
  return JSON.parse(result.stdout)
}

function eventArgs(value) { return ['events', 'create', '--metric', 'Placed Order', '--email', 'buyer@example.com', '--value', value, '--property', 'OrderId:123'] }
test('event value uses the numeric revenue attribute rather than a custom property', () => {
  const result = run(eventArgs('99.95'), true)
  assert.equal(result.method, 'POST')
  const attributes = result.body.data.attributes
  assert.equal(attributes.value, 99.95)
  assert.deepEqual(attributes.properties, { OrderId: '123' })
})
test('explicit zero event value is retained', () => {
  const result = run(eventArgs('0'), true)
  assert.equal(result.body.data.attributes.value, 0)
})
test('invalid event values stop before a request can serialize NaN to null', () => {
  for (const value of ['not-a-number', 'Infinity', '1e999', '']) {
    assert.match(run(eventArgs(value), false, 1).error, /finite number/)
  }
})
test('events without value retain metric, profile and custom properties', () => {
  const result = run(['events', 'create', '--metric', 'Viewed Product', '--email', 'buyer@example.com', '--property', 'SKU:123'], true)
  const attributes = result.body.data.attributes
  assert.equal(Object.hasOwn(attributes, 'value'), false)
  assert.equal(attributes.metric.data.attributes.name, 'Viewed Product')
  assert.equal(attributes.profile.data.attributes.email, 'buyer@example.com')
  assert.deepEqual(attributes.properties, { SKU: '123' })
})
test('dry run exposes exact revenue payload with masked authorization', () => {
  const result = run([...eventArgs('12.50'), '--dry-run'])
  assert.equal(result.body.data.attributes.value, 12.5)
  assert.equal(result.headers.Authorization, '***')
  assert.equal(JSON.stringify(result).includes('fake-key'), false)
})
