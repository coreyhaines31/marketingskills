const {test} = require('node:test')
const assert = require('node:assert/strict')
const {spawnSync} = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/calendly.js')
const org = 'https://api.calendly.com/organizations/org'
const user = 'https://api.calendly.com/users/user'
const group = 'https://api.calendly.com/groups/group'
function run(args, network = false) {
  const code = `global.fetch = async (url, options) => {
    if (!${network}) throw new Error('Unexpected request');
    const query = new URL(url).searchParams;
    if (query.get('scope') === 'user' && !query.get('user')) throw new Error('400 missing user');
    return {ok: true, status: 200, text: async () => JSON.stringify({ url, method: options.method, body: options.body ? JSON.parse(options.body) : null })};
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', code], {encoding:'utf8', env:{...process.env, CALENDLY_API_KEY:'test-only-key'}})
}
test('user-scoped list includes the requested user', () => {
  const r = run(['webhooks', 'list', '--organization', org, '--scope', 'user', '--user', user], true)
  assert.equal(r.status, 0, r.stderr)
  assert.equal(new URL(JSON.parse(r.stdout).url).searchParams.get('user'), user)
})
test('group-scoped list and create forward the same group URI', () => {
  for (const sub of ['list', 'create']) {
    const r = run(['webhooks', sub, '--organization', org, '--scope', 'group', '--group', group, '--url', 'https://example.com/hook', '--events', 'invitee.created', '--dry-run'])
    const preview = JSON.parse(r.stdout)
    if (sub === 'list') assert.equal(new URL(preview.url).searchParams.get('group'), group)
    else assert.equal(preview.body.group, group)
    assert.equal(preview.headers.Authorization, '***')
  }
})
for (const scope of ['user', 'group', 'invalid']) test(`invalid/incomplete ${scope} scope is rejected before fetch`, () => {
  for (const sub of ['list', 'create']) {
    const r = run(['webhooks', sub, '--organization', org, '--scope', scope, '--url', 'https://example.com/hook', '--events', 'invitee.created'])
    assert.ok(JSON.parse(r.stdout).error)
  }
})
test('default organization scope remains unchanged', () => {
  const r = run(['webhooks', 'list', '--organization', org, '--dry-run'])
  const p = new URL(JSON.parse(r.stdout).url).searchParams
  assert.equal(p.get('scope'), 'organization'); assert.equal(p.get('organization'), org)
})
