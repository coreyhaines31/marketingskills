const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/amplitude.js')

function run(args, matches = [], network = false) {
  const source = `const requests = []; global.fetch = async (url, options) => {
    if (!${network}) throw new Error('Unexpected network request');
    const u = new URL(url); requests.push(url);
    const search = u.pathname === '/api/2/usersearch';
    const valid = search || u.searchParams.get('user') === '87654';
    return { ok: valid, status: valid ? 200 : 400, text: async () => JSON.stringify(search
      ? ${JSON.stringify(Array.isArray(matches) ? { matches, type: 'match_user_or_device_id' } : matches)}
      : valid ? { userData: { amplitude_id: 87654 }, requests } : { error: 'Amplitude ID required' }) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const result = spawnSync(process.execPath, ['-e', source], {
    encoding: 'utf8', timeout: 5000,
    env: { ...process.env, AMPLITUDE_API_KEY: 'owned-key', AMPLITUDE_SECRET_KEY: 'owned-secret' },
  })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}

test('user activity resolves an external user ID to the exact Amplitude ID', () => {
  const result = run(['users', 'activity', '--user-id', 'user_owned'], [
    { user_id: 'user_owned_other', amplitude_id: 34567 },
    { user_id: 'user_owned', amplitude_id: 87654 },
  ], true)
  assert.equal(result.userData.amplitude_id, 87654)
  assert.deepEqual(result.requests, [
    'https://amplitude.com/api/2/usersearch?user=user_owned',
    'https://amplitude.com/api/2/useractivity?user=87654',
  ])
})
test('numeric external user IDs are resolved rather than treated as internal IDs', () => {
  const result = run(['users', 'activity', '--user-id', '12345'], [{ user_id: '12345', amplitude_id: 87654 }], true)
  assert.equal(result.userData.amplitude_id, 87654)
})
test('prefix-only search matches do not select another user activity', () => {
  assert.match(run(['users', 'activity', '--user-id', 'user_owned'], [
    { user_id: 'user_owned_other', amplitude_id: 87654 },
  ], true).error, /No exact user ID match/)
})
test('no search matches stop before requesting activity', () => {
  assert.match(run(['users', 'activity', '--user-id', 'user_owned'], [], true).error, /No exact user ID match/)
})
test('multiple exact search matches require an explicit internal ID', () => {
  assert.match(run(['users', 'activity', '--user-id', 'user_owned'], [
    { user_id: 'user_owned', amplitude_id: 87654 },
    { user_id: 'user_owned', amplitude_id: 34567 },
  ], true).error, /Multiple exact user ID matches; use --amplitude-id/)
})
test('a rejected search preserves its provider error without an activity request', () => {
  const error = { error: 'Forbidden', code: 403 }
  assert.deepEqual(run(['users', 'activity', '--user-id', 'user_owned'], error, true), error)
})
test('dry run previews identity lookup without issuing a request', () => {
  const result = run(['users', 'activity', '--user-id', 'user_owned', '--dry-run'])
  assert.equal(result.url, 'https://amplitude.com/api/2/usersearch?user=user_owned')
  assert.equal(result.headers.Authorization, '***')
})
test('event tracking retains the external user ID in its preview', () => {
  const result = run(['track', 'event', '--user-id', 'user_owned', '--event-type', 'signup', '--dry-run'])
  assert.equal(result.body.events[0].user_id, 'user_owned')
})
test('explicit internal Amplitude ID uses one activity request', () => {
  const result = run(['users', 'activity', '--amplitude-id', '87654'], [], true)
  assert.deepEqual(result.requests, ['https://amplitude.com/api/2/useractivity?user=87654'])
})
test('internal ID preview targets activity without a search', () => {
  const result = run(['users', 'activity', '--amplitude-id', '87654', '--dry-run'])
  assert.equal(result.url, 'https://amplitude.com/api/2/useractivity?user=87654')
})
test('two identity flags fail before making any request', () => {
  assert.match(run(['users', 'activity', '--user-id', 'user_owned', '--amplitude-id', '87654']).error, /Use only one/)
})
test('missing query credentials return the existing error without a request', () => {
  const source = `global.fetch = () => { throw new Error('Unexpected network request') };
    process.argv = ['node', ${JSON.stringify(cli)}, 'users', 'activity', '--user-id', 'user_owned']; require(${JSON.stringify(cli)});`
  const result = spawnSync(process.execPath, ['-e', source], {
    encoding: 'utf8', timeout: 5000,
    env: { ...process.env, AMPLITUDE_API_KEY: 'owned-key', AMPLITUDE_SECRET_KEY: '' },
  })
  assert.equal(result.status, 0, result.stderr)
  assert.match(JSON.parse(result.stdout).error, /AMPLITUDE_SECRET_KEY required/)
})
