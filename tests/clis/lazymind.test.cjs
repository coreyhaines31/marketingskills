const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/lazymind.js')
const base = 'https://instance.example/api/core'
const envelope = data => ({ code: 0, message: 'ok', data: {
  contract_version: 'external-workflow.v1', ...data,
} })
const task = overrides => envelope({ task_id: 'task-1', status: 'running',
  result_ready: false, done: false, next_action: 'poll', poll_after_seconds: 3, ...overrides })

function run(args, response, env = {}, status = 200, oracle = '') {
  const code = `let calls=0;process.on('beforeExit',()=>{if(calls>1)process.exitCode=99});
  global.fetch=async(url,options)=>{
    calls++;
    const assert=require('node:assert/strict');
    assert.equal(options.method,'GET');
    assert.equal(options.redirect,'error');
    assert.equal(options.headers.Authorization,'Bearer fixture-token');
    assert.equal(options.headers['X-User-Id'],undefined);
    assert.equal(options.headers['Workflow-Contract-Version'],'workflow.v1');
    assert.equal(options.body,undefined);
    assert.ok(options.signal instanceof AbortSignal);
    ${oracle}
    if (${response === undefined}) throw new Error('unexpected fetch');
    return new Response(${JSON.stringify(JSON.stringify(response) ?? '')},{status:${status}});
  };process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  const r = spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', timeout: 10000,
    env: { LAZYMIND_WORKFLOW_BASE_URL: base, LAZYMIND_WORKFLOW_TOKEN: 'fixture-token', ...env } })
  assert.equal(r.signal, null, r.stderr)
  assert.equal(r.error, undefined)
  return { status: r.status, out: r.stdout.trim() ? JSON.parse(r.stdout) : null,
    err: r.stderr.trim() ? JSON.parse(r.stderr) : null }
}

test('help works without credentials or an endpoint', () => {
  for (const args of [[], ['--help']]) {
    const r = run(args, undefined, { LAZYMIND_WORKFLOW_BASE_URL: '', LAZYMIND_WORKFLOW_TOKEN: '' })
    assert.equal(r.status, 0)
    assert.equal(r.out.commands.length, 3)
  }
})
test('dry-run is offline, redacts authentication and never supplies an identity header', () => {
  const r = run(['tasks', 'get', '--id', 'task-1', '--dry-run'], undefined,
    { LAZYMIND_WORKFLOW_TOKEN: '', LAZYMIND_WORKFLOW_USER_ID: 'private-user' })
  assert.equal(r.status, 0)
  assert.equal(r.out.url, base + '/external-agent/workflow-tasks/task-1')
  assert.equal(r.out.headers.Authorization, 'Bearer ***')
  assert.equal(r.out.headers['X-User-Id'], undefined)
})
test('connection reads the capabilities endpoint and preserves its envelope', () => {
  const response = envelope({ agent_types: ['codex'] })
  const r = run(['connection', 'status'], response, {}, 200,
    `assert.equal(url,'${base}/external-agent/workflow-capabilities')`)
  assert.equal(r.status, 0)
  assert.deepEqual(r.out, response)
})
for (const action of ['get', 'result']) {
  test(`tasks ${action} uses the published endpoint without overriding the authenticated identity`, () => {
    const response = task({})
    const r = run(['tasks', action, '--id', 'task-1'], response,
      { LAZYMIND_WORKFLOW_BASE_URL: base + '/', LAZYMIND_WORKFLOW_USER_ID: 'fixture-user' }, 200,
      `assert.equal(url,'${base}/external-agent/workflow-tasks/task-1${action === 'result' ? '/result' : ''}');
       assert.equal(options.headers['X-User-Id'],undefined)`)
    assert.equal(r.status, 0)
    assert.deepEqual(r.out, response)
  })
}
for (const state of [
  { status: 'waiting_user_action', result_ready: false, next_action: 'open_lazymind', poll_after_seconds: 0 },
  { status: 'failed', done: true, result_ready: false, next_action: 'review_error',
    progress: { completed_steps: 5, total_steps: 5 }, error_code: 'OBJECTIVE_INCOMPLETE' },
  { status: 'succeeded', done: true, result_ready: true, next_action: 'read_result',
    result_artifacts: [{ name: 'brief.md', url: 'https://artifact.example/brief' }] },
]) {
  test(`preserves ${state.status}; never polls, fetches artifacts or infers completion`, () => {
    const response = task(state)
    const r = run(['tasks', 'result', '--id', 'task-1'], response)
    assert.equal(r.status, 0)
    assert.deepEqual(r.out, response)
  })
}
test('invalid arguments fail before any request', () => {
  for (const args of [ ['tasks', 'start'], ['tasks', 'get'],
    ['tasks', 'get', '--id', '../other'], ['tasks', 'get', '--id', 'a/b'],
    ['tasks', 'get', '--id', 'task-1', '--id', 'task-2'],
    ['connection', 'status', '--timeout-ms', '12x'], ['connection', 'status', '--timeout-ms', '0'],
    ['connection', 'status', '--timeout-ms', '600001'], ['connection', 'status', '--wat'],
    ['connection', 'status', 'extra'], ['connection', 'status', '--id', 'task-1'] ]) {
    const r = run(args)
    assert.equal(r.status, 1, JSON.stringify(args))
    assert.doesNotMatch(r.err.error, /Request failed/)
  }
})
test('unsafe or ambiguous URLs fail before any request without echoing secrets', () => {
  for (const url of ['http://remote.example/api/core', 'https://secret@host/api/core',
    'https://host/api/core?token=secret', 'https://host/api/core#secret', 'https://host', 'file:///api/core']) {
    const r = run(['connection', 'status'], undefined, { LAZYMIND_WORKFLOW_BASE_URL: url })
    assert.equal(r.status, 1)
    assert.doesNotMatch(r.err.error, /secret|Request failed/)
  }
})
test('loopback HTTP can be previewed and a live read requires the token', () => {
  const r = run(['connection', 'status', '--dry-run'], undefined,
    { LAZYMIND_WORKFLOW_BASE_URL: 'http://127.0.0.1:49152/api/core' })
  assert.equal(r.status, 0)
  const missing = run(['connection', 'status'], undefined, { LAZYMIND_WORKFLOW_TOKEN: '' })
  assert.equal(missing.status, 1)
  assert.match(missing.err.error, /TOKEN/)
})
test('HTTP failures and redirects are failures, regardless of body', () => {
  for (const status of [302, 401, 403, 404, 429, 500]) {
    const r = run(['connection', 'status'], { secret: 'fixture-token' }, {}, status)
    assert.equal(r.status, 1)
    assert.equal(r.out, null)
    assert.match(r.err.error, new RegExp(String(status)))
    assert.doesNotMatch(r.err.error, /fixture-token/)
  }
})
test('API errors, malformed JSON and incompatible response contracts fail closed', () => {
  for (const response of [undefined, null, {}, { code: 2000104 },
    envelope({ contract_version: 'external-workflow.v2' }), task({ task_id: 'other' }),
    task({ result_ready: 'true' }), { ...task({}), ok: false }]) {
    const r = run(['tasks', 'get', '--id', 'task-1'], response)
    assert.equal(r.status, 1)
    assert.equal(r.out, null)
  }
})
test('network exceptions do not echo arbitrary error text or credentials', () => {
  const r = run(['connection', 'status'], {}, {}, 200, `throw new Error('fixture-token')`)
  assert.equal(r.status, 1)
  assert.doesNotMatch(r.err.error, /fixture-token/)
})
test('a non-JSON success page cannot masquerade as a workflow response', () => {
  const r = run(['connection', 'status'], {}, {}, 200,
    `return new Response('<html>Login required</html>',{status:200})`)
  assert.equal(r.status, 1)
  assert.equal(r.out, null)
  assert.match(r.err.error, /JSON API response/)
})
