const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/paddle.js')

function run(args) {
  const source = `global.fetch = async (url, options) => {
    console.error('REQUEST ' + JSON.stringify({ url, method: options.method, body: JSON.parse(options.body) }));
    return new Response(JSON.stringify({ data: { id: 'pri_fixture' } }), { status: 201 });
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', source], {
    encoding: 'utf8', timeout: 5000,
    env: { ...process.env, PADDLE_API_KEY: 'test-only-key', PADDLE_SANDBOX: 'false' },
  })
}
const create = ['prices', 'create', '--product-id', 'pro_fixture', '--amount', '2000']
for (const flags of [['--interval', 'month'], ['--frequency', '1'], ['--interval', 'month', '--frequency'], ['--interval', '', '--frequency', '1']]) {
  for (const preview of [false, true]) {
    test(`incomplete recurrence ${JSON.stringify(flags)} rejects before ${preview ? 'preview' : 'creation'}`, () => {
      const child = run([...create, ...flags, ...(preview ? ['--dry-run'] : [])])
      assert.equal(child.status, 1, child.stderr)
      assert.match(JSON.parse(child.stdout).error, /--interval and --frequency.*together/)
      assert.equal(child.stderr.includes('REQUEST '), false, 'must not create a one-time price')
    })
  }
}
for (const cycle of [null, { interval: 'month', frequency: 1 }, { interval: 'year', frequency: 2 }]) {
  for (const preview of [false, true]) {
    test(`${cycle ? JSON.stringify(cycle) : 'one-time'} price preserves ${preview ? 'preview' : 'creation'} payload`, () => {
      const flags = cycle ? ['--interval', cycle.interval, '--frequency', String(cycle.frequency)] : []
      const child = run([...create, ...flags, ...(preview ? ['--dry-run'] : [])])
      assert.equal(child.status, 0, child.stderr)
      let request
      if (preview) {
        request = JSON.parse(child.stdout)
        assert.equal(request.headers.Authorization, '***')
        assert.equal(child.stderr.includes('REQUEST '), false)
      } else {
        request = JSON.parse(child.stderr.split('REQUEST ')[1])
      }
      assert.equal(request.url, 'https://api.paddle.com/prices')
      assert.equal(request.method, 'POST')
      const expected = { product_id: 'pro_fixture', description: 'Price', unit_price: { amount: '2000', currency_code: 'USD' } }
      if (cycle) expected.billing_cycle = cycle
      assert.deepEqual(request.body, expected)
      assert.equal(child.stdout.includes('test-only-key'), false)
    })
  }
}
