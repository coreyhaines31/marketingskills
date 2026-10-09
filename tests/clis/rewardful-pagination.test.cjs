const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/rewardful.js')

function run(args) {
  const code = `global.fetch = async (url, options) => ({ status: 200, text: async () => JSON.stringify({ url, method: options.method, page: new URL(url).searchParams.get('page') || '1' }) }); process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const result = spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', env: { ...process.env, REWARDFUL_API_KEY: 'fixture-only' } })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}

for (const command of [['affiliates', 'list'], ['affiliates', 'search', '--email', 'rudy+growth@example.com'], ['referrals', 'list', '--affiliate-id', 'aff-1'], ['referrals', 'get', '--stripe-customer-id', 'cus-1'], ['commissions', 'list', '--affiliate-id', 'aff-1']]) {
  test(`${command.join(' ')} can request later collection pages`, () => {
    const result = run([...command, '--page', '3', '--limit', '50'])
    const query = new URL(result.url).searchParams
    assert.equal(result.page, '3')
    assert.equal(query.get('limit'), '50')
    if (command.includes('--email')) assert.equal(query.get('email'), 'rudy+growth@example.com')
    if (command.includes('--affiliate-id')) assert.equal(query.get('affiliate_id'), 'aff-1')
    if (command.includes('--stripe-customer-id')) assert.equal(query.get('stripe_customer_id'), 'cus-1')
  })
}

test('pagination preview remains credential-redacted without changing default list requests', () => {
  const preview = run(['commissions', 'list', '--page', '2', '--limit', '25', '--dry-run'])
  assert.equal(preview.headers.Authorization, '***')
  assert.equal(new URL(preview.url).searchParams.get('page'), '2')
  assert.equal(new URL(run(['referrals', 'list']).url).searchParams.has('page'), false)
})

for (const extra of [['--page'], ['--page', 'NaN'], ['--page', '0'], ['--page', '1.5'], ['--page', '9007199254740992'], ['--limit'], ['--limit', '101'], ['--limit', '0'], ['--limit', 'Infinity']]) {
  test(`invalid pagination ${extra.join(' ')} fails before fetching`, () => {
    const args = ['affiliates', 'list', ...extra]
    const code = `global.fetch=async()=>{throw new Error('unexpected fetch')};process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
    const result = spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', env: { ...process.env, REWARDFUL_API_KEY: 'fixture-only' } })
    assert.equal(result.status, 1)
    assert.match(JSON.parse(result.stderr).error, /must be an integer/)
  })
}
