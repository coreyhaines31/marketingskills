const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

function run(args, dryRun = false, response = null) {
  const cli = path.resolve(__dirname, '../../tools/clis/sendgrid.js')
  const source = `global.fetch = async (url, options) => {
    if (${dryRun}) throw new Error('Unexpected network request');
    const request = { url: String(url), method: options.method, body: options.body ? JSON.parse(options.body) : null };
    return { status: 200, text: async () => JSON.stringify(${JSON.stringify(response)} || request) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const result = spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', timeout: 5000, env: {
    ...process.env, SENDGRID_API_KEY: 'fixture-secret'
  } })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}

test('campaign list reads current Marketing Single Sends with page size', () => {
  const result = run(['campaigns', 'list', '--limit', '25'])
  assert.equal(result.method, 'GET')
  assert.equal(result.url, 'https://api.sendgrid.com/v3/marketing/singlesends?page_size=25')
  assert.equal(result.body, null)
})
test('campaign get reads a Single Send by ID', () => {
  const result = run(['campaigns', 'get', 'e2b5c7df-0026-4a86-8f35-ef134f48f600'])
  assert.equal(result.url, 'https://api.sendgrid.com/v3/marketing/singlesends/e2b5c7df-0026-4a86-8f35-ef134f48f600')
  assert.equal(result.method, 'GET')
})
test('missing campaign ID never fetches', () => {
  assert.match(run(['campaigns', 'get'], true).error, /Campaign ID required/)
})
test('campaign dry run previews the Single Sends route and masks auth', () => {
  const result = run(['campaigns', 'list', '--dry-run'], true)
  assert.equal(new URL(result.url).pathname, '/v3/marketing/singlesends')
  assert.equal(result.headers.Authorization, '***')
})

test('campaign list preserves the provider result and pagination metadata', () => {
  const response = { result: [{ id: 'fixture-send', name: 'Newsletter', status: 'draft' }], _metadata: { next: 'https://api.sendgrid.com/v3/marketing/singlesends?page_token=next' } }
  assert.deepEqual(run(['campaigns', 'list'], false, response), response)
})
test('campaign get preserves the Single Send object', () => {
  const response = { id: 'fixture-send', name: 'Newsletter', status: 'draft', send_to: { list_ids: ['fixture-list'] } }
  assert.deepEqual(run(['campaigns', 'get', 'fixture-send'], false, response), response)
})
