const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

function run(args, dryRun = false) {
  const cli = path.resolve(__dirname, '../../tools/clis/klaviyo.js')
  const source = `global.fetch = async (url, options) => {
    if (${dryRun}) throw new Error('Unexpected network request');
    const request = { url: String(url), method: options.method, body: options.body ? JSON.parse(options.body) : null };
    return { status: 200, text: async () => JSON.stringify(request) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const result = spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', timeout: 5000, env: {
    ...process.env, KLAVIYO_API_KEY: 'fixture-secret'
  } })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}

const cursor = 'next+page/opaque==&filter=other#fragment'
for (const resource of ['profiles', 'lists', 'events', 'campaigns', 'flows', 'metrics', 'segments', 'templates']) {
  test(`${resource} list preserves the opaque pagination cursor`, () => {
    const flags = resource === 'campaigns' ? ['--filter', 'equals(messages.channel,"email")'] : []
    const result = run([resource, 'list', '--page-cursor', cursor, ...flags])
    const url = new URL(result.url)
    assert.equal(result.method, 'GET')
    assert.equal(url.pathname, `/api/${resource}/`)
    assert.equal(url.searchParams.get('page[cursor]'), cursor)
    assert.equal(url.hash, '')
    if (flags.length) assert.equal(url.searchParams.get('filter'), flags[1])
  })
}
test('first page requests omit the cursor', () => {
  assert.equal(new URL(run(['events', 'list']).url).searchParams.has('page[cursor]'), false)
})
test('dry run contains the cursor and masks auth', () => {
  const result = run(['flows', 'list', '--page-cursor', cursor, '--dry-run'], true)
  assert.equal(new URL(result.url).searchParams.get('page[cursor]'), cursor)
  assert.equal(result.headers.Authorization, '***')
})
