const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/klaviyo.js')
function run(extra, allowFetch = true) {
  const args = ['events', 'create', '--metric', 'Placed Order', '--email', 'buyer@example.com', ...extra]
  const code = `global.fetch=async(url,options)=>{if(!${allowFetch})throw new Error('unexpected fetch');return {status:200,text:async()=>JSON.stringify({url,body:JSON.parse(options.body)})}};process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', env: { ...process.env, KLAVIYO_API_KEY: 'fixture-only' } })
}
const properties = { items: [{ SKU: 'sku:one,two', quantity: 2 }], VIP: true, customer: { tier: 'Gold' }, orderTotal: 42.5 }
test('event properties preserve structured product arrays and primitive types', () => {
  const r = run(['--properties', JSON.stringify(properties), '--value', '42.5'])
  assert.equal(r.status, 0, r.stderr)
  const out = JSON.parse(r.stdout)
  assert.equal(out.url, 'https://a.klaviyo.com/api/events/')
  assert.deepEqual(out.body.data.attributes.properties, properties)
  assert.equal(out.body.data.attributes.value, 42.5)
  assert.equal(out.body.data.attributes.metric.data.attributes.name, 'Placed Order')
})
test('legacy property shorthand and JSON previews remain compatible', () => {
  const r = run(['--property', 'SKU:sku:one,OrderId:123'])
  assert.equal(r.status, 0, r.stderr)
  assert.deepEqual(JSON.parse(r.stdout).body.data.attributes.properties, { SKU: 'sku:one', OrderId: '123' })
  const preview = run(['--properties', JSON.stringify(properties), '--dry-run'], false)
  assert.equal(preview.status, 0, preview.stderr)
  const out = JSON.parse(preview.stdout)
  assert.deepEqual(out.body.data.attributes.properties, properties)
  assert.equal(out.headers.Authorization, '***')
})
for (const extra of [['--properties', 'null'], ['--properties', '[]'], ['--properties', 'true'], ['--properties', '{bad'], ['--properties'], ['--property', 'a:b', '--properties', '{}']]) {
  test(`invalid or ambiguous properties ${extra.join(' ')} stop before fetch`, () => {
    const r = run(extra, false)
    assert.equal(r.status, 1)
    assert.match(JSON.parse(r.stderr).error, /properties|not both/)
  })
}
