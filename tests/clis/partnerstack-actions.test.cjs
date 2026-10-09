const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

const cli = path.resolve(__dirname, '../../tools/clis/partnerstack.js')
function run(args, network = false) {
  const source = `global.fetch = async (url, options) => {
    if (!${network}) throw new Error('Unexpected network request');
    const body = options.body ? JSON.parse(options.body) : undefined;
    const valid = options.method === 'GET' || (body.target_key && body.target_type === 'customer'
      && body.type && Number.isInteger(body.value) && body.value >= 1);
    return { ok: !!valid, status: valid ? 200 : 400, text: async () => JSON.stringify(valid
      ? { url, method: options.method, body }
      : { error: 'target_key, target_type, type and positive integer value are required' }) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  const result = spawnSync(process.execPath, ['-e', source], {
    encoding: 'utf8', timeout: 5000,
    env: { ...process.env, PARTNERSTACK_PUBLIC_KEY: 'owned-public', PARTNERSTACK_SECRET_KEY: 'owned-secret' },
  })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}

const create = ['actions', 'create', '--customer-key', 'cust_owned', '--action-key', 'signup_completed']
test('customer action flags produce the documented target and action type', () => {
  assert.deepEqual(run([...create, '--value', '3'], true), {
    url: 'https://api.partnerstack.com/api/v2/actions', method: 'POST',
    body: { target_key: 'cust_owned', target_type: 'customer', type: 'signup_completed', value: 3 },
  })
})
test('an action without an explicit count records one occurrence', () => {
  assert.equal(run(create, true).body.value, 1)
})
test('action counts must be positive integers before fetching', () => {
  for (const value of ['0', '-1', '1.5', 'many']) {
    assert.match(run([...create, '--value', value]).error, /--value must be a positive integer/)
  }
})
test('dry run shows the supported action payload without sending it', () => {
  const result = run([...create, '--dry-run'])
  assert.deepEqual(result.body, { target_key: 'cust_owned', target_type: 'customer', type: 'signup_completed', value: 1 })
  assert.equal(result.headers.Authorization, '***')
})
test('action listing keeps its cursor request and no body', () => {
  assert.deepEqual(run(['actions', 'list', '--after', 'act_owned'], true), {
    url: 'https://api.partnerstack.com/api/v2/actions?starting_after=act_owned', method: 'GET',
  })
})
