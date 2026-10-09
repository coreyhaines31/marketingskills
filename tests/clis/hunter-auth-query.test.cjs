const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/hunter.js')

function run(args, key, network = false) {
  const code = `global.fetch = async (url, options) => {
    if (!${network}) throw new Error('Unexpected request');
    return {status: 200, text: async () => JSON.stringify({url: String(url), method: options.method})};
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const r = spawnSync(process.execPath, ['-e', code], {
    encoding: 'utf8', timeout: 5000, env: {...process.env, HUNTER_API_KEY: key},
  })
  assert.equal(r.status, 0, r.stderr)
  return JSON.parse(r.stdout)
}

test('dry run redacts the authentication parameter even if the key also occurs in the domain', () => {
  const result = run(['domain', 'search', '--domain', 'test-key.example.com', '--dry-run'], 'test-key')
  const query = new URL(result.url).searchParams
  assert.equal(query.get('api_key'), '***')
  assert.equal(query.get('domain'), 'test-key.example.com')
})

test('query credentials round trip reserved characters without adding extra parameters', () => {
  const key = 'test+key&injected=1#suffix'
  const result = run(['email', 'verify', '--email', 'hello+tag@example.com'], key, true)
  const query = new URL(result.url).searchParams
  assert.equal(query.get('api_key'), key)
  assert.equal(query.get('email'), 'hello+tag@example.com')
  assert.equal(query.has('injected'), false)
})

test('a dry-run account request contains no credential and makes no request', () => {
  const result = run(['account', 'info', '--dry-run'], 'test+key&injected=1#suffix')
  assert.equal(new URL(result.url).searchParams.get('api_key'), '***')
  assert.equal(JSON.stringify(result).includes('injected'), false)
})

test('ordinary live requests retain method, domain and pagination', () => {
  const result = run(['domain', 'search', '--domain', 'example.com', '--limit', '10'], 'test-key', true)
  assert.equal(result.method, 'GET')
  assert.equal(new URL(result.url).searchParams.get('limit'), '10')
  assert.equal(new URL(result.url).searchParams.get('api_key'), 'test-key')
})
