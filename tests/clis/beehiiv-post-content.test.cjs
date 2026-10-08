const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

function run(args, dryRun = false) {
  const cli = path.resolve(__dirname, '../../tools/clis/beehiiv.js')
  const source = `global.fetch = async (url, options) => {
    if (${dryRun}) throw new Error('Unexpected network request');
    const request = { url: String(url), method: options.method, body: options.body ? JSON.parse(options.body) : null };
    return { status: 200, text: async () => JSON.stringify(request) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const result = spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', timeout: 5000, env: {
    ...process.env, BEEHIIV_API_KEY: 'fixture-secret'
  } })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}

test('HTML post creation sends the API body_content field', () => {
  const html = '<p>Launch: <a href="https://example.com/?a=1&amp;b=2">Details</a></p>'
  const result = run(['posts', 'create', '--publication', 'pub_123', '--title', 'Launch', '--content', html, '--subtitle', 'This week', '--status', 'draft'])
  assert.equal(result.method, 'POST')
  assert.equal(result.url, 'https://api.beehiiv.com/v2/publications/pub_123/posts')
  assert.deepEqual(result.body, { title: 'Launch', subtitle: 'This week', body_content: html, status: 'draft' })
})
test('omitting post content stops before a network request', () => {
  assert.match(run(['posts', 'create', '--publication', 'pub_123', '--title', 'Empty'], true).error, /content.*required/i)
})
test('bare --content is rejected instead of sending a boolean', () => {
  assert.match(run(['posts', 'create', '--publication', 'pub_123', '--title', 'Empty', '--content'], true).error, /content.*required/i)
})
test('post dry run previews raw HTML and redacts authentication', () => {
  const result = run(['posts', 'create', '--publication', 'pub_123', '--title', 'Launch', '--content', '<p>News</p>', '--dry-run'], true)
  assert.equal(result.body.body_content, '<p>News</p>')
  assert.equal(result.headers.Authorization, '***')
})
