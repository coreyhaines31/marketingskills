const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/paddle.js')
function run(args, fetch = false) {
  const source = `global.fetch = async (url, options) => {
    if (!${fetch}) throw new Error('Unexpected network request');
    return { ok: true, status: 200, text: async () => JSON.stringify({ url, method: options.method, body: options.body ? JSON.parse(options.body) : null }) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const result = spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', env: { ...process.env, PADDLE_API_KEY: 'fake-key' }, timeout: 5000 })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}

const discount = ['discounts', 'create', '--amount', '10', '--type', 'percentage', '--code', 'LIMITED']
test('max uses sets the redemption limit, not subscription recurrence', () => {
  const result = run([...discount, '--max-uses', '25'], true)
  assert.equal(result.method, 'POST')
  assert.equal(result.url, 'https://api.paddle.com/discounts')
  assert.equal(result.body.usage_limit, 25)
  assert.equal(Object.hasOwn(result.body, 'maximum_recurring_intervals'), false)
})
test('max uses rejects invalid and nonpositive counts before fetching', () => {
  for (const value of ['0', '-1', '1.5', 'many', 'Infinity', '9007199254740992']) {
    assert.match(run([...discount, '--max-uses', value]).error, /positive safe integer/)
  }
})
test('an omitted max uses preserves the existing unlimited-discount request', () => {
  const result = run(discount, true)
  assert.deepEqual(result.body, { amount: '10', type: 'percentage', description: 'Discount', code: 'LIMITED' })
})
test('flat discount preserves currency and redemption ceiling', () => {
  const result = run(['discounts', 'create', '--amount', '500', '--type', 'flat', '--currency-code', 'USD', '--max-uses', '1'], true)
  assert.equal(result.body.currency_code, 'USD')
  assert.equal(result.body.usage_limit, 1)
})
test('dry run shows bounded discount with masked authorization and no request', () => {
  const result = run([...discount, '--max-uses', '25', '--dry-run'])
  assert.equal(result.body.usage_limit, 25)
  assert.equal(result.headers.Authorization, '***')
  assert.equal(JSON.stringify(result).includes('fake-key'), false)
})
