const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/savvycal.js')
const cases = [
  { name: 'list', args: ['links', 'list', '--limit', '7', '--after', 'cursor+next'], method: 'GET', resource: '/links?limit=7&after=cursor%2Bnext' },
  { name: 'get', args: ['links', 'get', '--id', 'owned-link'], method: 'GET', resource: '/links/owned-link' },
  { name: 'create', args: ['links', 'create', '--name', 'Owned Meeting'], method: 'POST', resource: '/links', body: { name: 'Owned Meeting' } },
  { name: 'update', args: ['links', 'update', '--id', 'owned-link', '--name', 'Updated Meeting'], method: 'PATCH', resource: '/links/owned-link', body: { name: 'Updated Meeting' } },
  { name: 'delete', args: ['links', 'delete', '--id', 'owned-link'], method: 'DELETE', resource: '/links/owned-link' },
  { name: 'duplicate', args: ['links', 'duplicate', '--id', 'owned-link'], method: 'POST', resource: '/links/owned-link/duplicate' },
  { name: 'toggle', args: ['links', 'toggle', '--id', 'owned-link'], method: 'POST', resource: '/links/owned-link/toggle' },
  { name: 'slots', args: ['links', 'slots', '--id', 'owned-link'], method: 'GET', resource: '/links/owned-link/slots' },
]
function run(args, oracle) {
  const fixture = `global.fetch=async(url,options)=>{const assert=require('node:assert/strict');${oracle};return new Response(JSON.stringify({data:[{id:'owned-link'}],meta:{after:'next'}}),{status:200})};process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', fixture], { encoding: 'utf8', timeout: 10000, env: { ...process.env, SAVVYCAL_API_KEY: 'fixture-token' } })
}
function output(result) { assert.equal(result.status, 0, result.stderr); return JSON.parse(result.stdout) }
for (const item of cases) {
  test(`links ${item.name} uses the documented resource and preserves request and response`, () => {
    const oracle = `assert.equal(url,${JSON.stringify('https://api.savvycal.com/v1' + item.resource)});assert.equal(options.method,${JSON.stringify(item.method)});assert.equal(options.headers.Authorization,'Bearer fixture-token');assert.deepEqual(options.body?JSON.parse(options.body):undefined,${JSON.stringify(item.body) || 'undefined'})`
    assert.deepEqual(output(run(item.args, oracle)), { data: [{ id: 'owned-link' }], meta: { after: 'next' } })
  })
  test(`links ${item.name} previews the same request without network access`, () => {
    const result = output(run([...item.args, '--dry-run'], "throw new Error('unexpected request')"))
    assert.equal(result.url, 'https://api.savvycal.com/v1' + item.resource)
    assert.equal(result.method, item.method)
    assert.equal(result.headers.Authorization, '***')
    assert.deepEqual(result.body, item.body)
  })
}
test('current-user discovery retains its existing resource', () => {
  output(run(['me'], "assert.equal(url,'https://api.savvycal.com/v1/me');assert.equal(options.method,'GET')"))
})
test('event reads retain their existing resource', () => {
  output(run(['events', 'get', '--id', 'owned-event'], "assert.equal(url,'https://api.savvycal.com/v1/events/owned-event');assert.equal(options.method,'GET')"))
})
