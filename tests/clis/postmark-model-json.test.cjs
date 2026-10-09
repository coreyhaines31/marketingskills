const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/postmark.js')
function run(extra) {
  const args = ['email', 'send-template', '--from', 'sender@example.com', '--to', 'recipient@example.com', '--template', 'receipt', ...extra]
  const code = `global.fetch=async(url,options)=>({status:200,text:async()=>JSON.stringify({url,body:JSON.parse(options.body)})});process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', env: { ...process.env, POSTMARK_API_KEY: 'fixture-only' } })
}
const model = { customer: { name: 'Growth, Inc.' }, items: [{ title: 'Service: priority', quantity: 2 }], paid: true, total: 29.5 }
test('structured template models retain nested arrays and numeric/boolean values in the actual request', () => {
  const r = run(['--model-json', JSON.stringify(model)])
  assert.equal(r.status, 0, r.stderr)
  const out = JSON.parse(r.stdout)
  assert.equal(out.url, 'https://api.postmarkapp.com/email/withTemplate')
  assert.deepEqual(out.body.TemplateModel, model)
  assert.equal(out.body.TemplateAlias, 'receipt')
})
test('legacy shorthand remains intact and previews preserve model types without exposing credentials', () => {
  const legacy = run(['--model', 'name:Rudy,url:https://example.com'])
  assert.equal(legacy.status, 0, legacy.stderr)
  assert.deepEqual(JSON.parse(legacy.stdout).body.TemplateModel, { name: 'Rudy', url: 'https://example.com' })
  const preview = run(['--model-json', JSON.stringify(model), '--dry-run'])
  assert.equal(preview.status, 0, preview.stderr)
  const out = JSON.parse(preview.stdout)
  assert.deepEqual(out.body.TemplateModel, model)
  assert.equal(out.headers['X-Postmark-Server-Token'], '***')
})
for (const value of ['null', '[]', '"text"', 'true', '{bad']) test(`invalid object model ${value} fails before delivery`, () => {
  const r = run(['--model-json', value])
  assert.notEqual(r.status, 0)
  assert.match(JSON.parse(r.stderr).error, /model-json/)
})
test('ambiguous legacy and JSON model inputs fail before delivery', () => {
  const r = run(['--model', 'name:old', '--model-json', '{}'])
  assert.notEqual(r.status, 0)
  assert.match(JSON.parse(r.stderr).error, /not both/)
})
