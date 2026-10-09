const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

const cli = path.resolve(__dirname, '../../tools/clis/partnerstack.js')
function run(args, network = false) {
  const source = `global.fetch = async (url, options) => {
    if (!${network}) throw new Error('Unexpected network request');
    return { ok: true, status: 200, text: async () => JSON.stringify({ url,
      method: options.method, body: JSON.parse(options.body) }) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const result = spawnSync(process.execPath, ['-e', source], {
    encoding: 'utf8', timeout: 5000,
    env: { ...process.env, PARTNERSTACK_PUBLIC_KEY: 'owned-public', PARTNERSTACK_SECRET_KEY: 'owned-secret' },
  })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}

const create = ['transactions', 'create', '--customer-key', 'cust_owned', '--amount', '9900']
test('transaction category uses the commission category key field', () => {
  const result = run([...create, '--currency', 'USD', '--category', 'subscription'], true)
  assert.deepEqual(result.body, { customer_key: 'cust_owned', amount: 9900, currency: 'USD', category_key: 'subscription' })
  assert.equal(result.url, 'https://api.partnerstack.com/api/v2/transactions')
  assert.equal(result.method, 'POST')
})
test('transaction creation requires its currency before fetching', () => {
  assert.match(run(create).error, /--currency required/)
})
test('transaction product selection remains unchanged without a category', () => {
  assert.deepEqual(run([...create, '--currency', 'EUR', '--product-key', 'pro_plan'], true).body,
    { customer_key: 'cust_owned', amount: 9900, currency: 'EUR', product_key: 'pro_plan' })
})
test('transaction preview includes the selected category without sending it', () => {
  const result = run([...create, '--currency', 'USD', '--category', 'subscription', '--dry-run'])
  assert.equal(result.body.category_key, 'subscription')
  assert.equal(Object.hasOwn(result.body, 'category'), false)
  assert.equal(result.headers.Authorization, '***')
})
