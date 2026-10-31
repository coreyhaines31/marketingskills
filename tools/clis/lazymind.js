#!/usr/bin/env node

// Read existing tasks through LazyMind's external-workflow.v1 API.
const USAGE = {
  description: 'Read LazyMind task state; does not start, resume, approve, or publish work.',
  commands: ['connection status', 'tasks get --id <task-id>', 'tasks result --id <task-id>'],
  options: ['--dry-run', '--timeout-ms <1-600000>', '--help'],
  environment: ['LAZYMIND_WORKFLOW_BASE_URL (authenticated gateway URL ending in /api/core)',
    'LAZYMIND_WORKFLOW_TOKEN (Bearer token)'],
}

function parseArgs(argv) {
  const args = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--dry-run') args.dryRun = true
    else if (arg === '--id' || arg === '--timeout-ms') {
      const value = argv[++i]
      if (!value || value.startsWith('--')) throw new Error(`${arg} requires a value`)
      if (args[arg] !== undefined) throw new Error(`Duplicate option ${arg}`)
      args[arg] = value
    } else if (arg.startsWith('-')) throw new Error('Unknown option; use --help')
    else args._.push(arg)
  }
  return args
}

async function main() {
  const argv = process.argv.slice(2)
  if (!argv.length || (argv.length === 1 && argv[0] === '--help')) return USAGE
  const args = parseArgs(argv)
  const [group, action] = args._
  if (args._.length !== 2) throw new Error('Expected one command; use --help')
  let path
  if (group === 'connection' && action === 'status' && !args['--id']) {
    path = '/external-agent/workflow-capabilities'
  } else if (group === 'tasks' && ['get', 'result'].includes(action)) {
    if (!/^[A-Za-z0-9_-]{1,200}$/.test(args['--id'] || '')) {
      throw new Error('--id must be a task ID containing letters, numbers, underscores or hyphens')
    }
    path = `/external-agent/workflow-tasks/${args['--id']}${action === 'result' ? '/result' : ''}`
  } else throw new Error('Unknown command; use --help')

  const timeout = args['--timeout-ms'] ?? '15000'
  if (!/^\d+$/.test(timeout) || Number(timeout) < 1 || Number(timeout) > 600000) {
    throw new Error('--timeout-ms must be an integer from 1 to 600000')
  }
  let base
  try { base = new URL(process.env.LAZYMIND_WORKFLOW_BASE_URL) } catch {
    throw new Error('Set LAZYMIND_WORKFLOW_BASE_URL to the authenticated gateway URL ending in /api/core')
  }
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname)
  if (!(base.protocol === 'https:' || (base.protocol === 'http:' && loopback)) ||
      base.username || base.password || base.search || base.hash ||
      !base.pathname.replace(/\/+$/, '').endsWith('/api/core')) {
    throw new Error('Gateway URL needs HTTPS (or HTTP on loopback), /api/core, and no credentials, query or fragment')
  }
  const url = base.href.replace(/\/+$/, '') + path
  const headers = { 'Workflow-Contract-Version': 'workflow.v1', Accept: 'application/json' }
  if (args.dryRun) {
    return { _dry_run: true, method: 'GET', url, timeout_ms: Number(timeout),
      headers: { ...headers, Authorization: 'Bearer ***' } }
  }
  const token = process.env.LAZYMIND_WORKFLOW_TOKEN
  if (!token?.trim()) throw new Error('LAZYMIND_WORKFLOW_TOKEN environment variable required')
  headers.Authorization = `Bearer ${token}`
  let response
  try {
    response = await fetch(url, { method: 'GET', headers, redirect: 'error',
      signal: AbortSignal.timeout(Number(timeout)) })
  } catch {
    throw new Error('Request failed (network, redirect or timeout); check the selected instance')
  }
  if (!response.ok) throw new Error(`LazyMind HTTP ${response.status}; response body omitted`)
  let body
  try { body = await response.json() } catch { throw new Error('Expected a JSON API response') }
  if (!body || body.code !== 0 || body.ok === false || body.error) {
    throw new Error('LazyMind API did not return a successful code=0 envelope')
  }
  const data = body.data
  if (!data || data.contract_version !== 'external-workflow.v1') {
    throw new Error('Unsupported or missing external-workflow.v1 response contract')
  }
  if (group === 'tasks' && (data.task_id !== args['--id'] ||
      typeof data.status !== 'string' || typeof data.result_ready !== 'boolean')) {
    throw new Error('Task response identity or state fields do not match the request')
  }
  // A successful read can describe failed or blocked work. Preserve the API state.
  return body
}

main().then(result => console.log(JSON.stringify(result, null, 2))).catch(error => {
  console.error(JSON.stringify({ error: error.message }))
  process.exitCode = 1
})
