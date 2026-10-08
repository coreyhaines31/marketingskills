#!/usr/bin/env node

const rawArgs = process.argv.slice(2)
const API_KEY = process.env.AIROPS_API_KEY
const BASE_URL = 'https://api.airops.com/public_api'

if ((!API_KEY) && rawArgs.length > 0) {
  console.error(JSON.stringify({ error: 'AIROPS_API_KEY environment variable required' }))
  process.exit(1)
}

async function api(method, path, body) {
  const url = `${BASE_URL}${path}`
  if (args['dry-run']) {
    return { _dry_run: true, method, url, headers: { 'Authorization': 'Bearer ***', 'Content-Type': 'application/json' }, body: body || undefined }
  }
  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { status: res.status, body: text }
  }
}

function parseArgs(args) {
  const result = { _: [] }
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = args[i + 1]
      if (next && !next.startsWith('--')) {
        result[key] = next
        i++
      } else {
        result[key] = true
      }
    } else {
      result._.push(arg)
    }
  }
  return result
}

const args = parseArgs(rawArgs)
const [cmd, sub, ...rest] = args._

async function main() {
  let result

  switch (cmd) {
    case 'workflows':
    case 'flows':
      switch (sub) {
        case 'list': {
          result = await api('GET', '/airops_apps')
          break
        }
        case 'get': {
          const id = args.id
          if (!id) { result = { error: '--id required' }; break }
          result = await api('GET', `/airops_apps/${encodeURIComponent(id)}`)
          break
        }
        case 'execute': {
          const id = args.id
          if (!id) { result = { error: '--id required' }; break }
          const inputs = args.inputs
          let parsedInputs = {}
          if (inputs) {
            try {
              parsedInputs = JSON.parse(inputs)
            } catch {
              result = { error: '--inputs must be valid JSON' }
              break
            }
          }
          if (!parsedInputs || typeof parsedInputs !== 'object' || Array.isArray(parsedInputs)) { result = { error: '--inputs must be a JSON object' }; break }
          result = await api('POST', `/airops_apps/${encodeURIComponent(id)}/execute`, { inputs: parsedInputs })
          break
        }
        case 'runs': {
          const id = args.id
          if (!id) { result = { error: '--id required' }; break }
          if (!/^\d+$/.test(id)) { result = { error: '--id must be the numeric app ID for run history (not the app UUID)' }; break }
          const params = new URLSearchParams({ airops_app_id: id })
          if (args.cursor) params.set('cursor', args.cursor)
          if (args.items) params.set('items', args.items)
          result = await api('GET', `/airops_apps/${id}/executions?${params}`)
          break
        }
        case 'run-status': {
          const runId = args['run-id']
          if (!runId) { result = { error: '--run-id required' }; break }
          result = await api('GET', `/airops_apps/executions/${encodeURIComponent(runId)}`)
          break
        }
        default:
          result = { error: 'Unknown flows subcommand. Use: list, get, execute, runs, run-status' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          flows: {
            list: 'flows list',
            get: 'flows get --id <app_uuid>',
            execute: 'flows execute --id <app_uuid> --inputs <json>',
            runs: 'flows runs --id <numeric_app_id> [--cursor <cursor>] [--items <1-100>]',
            'run-status': 'flows run-status --run-id <id>',
          },
          workflows: {
            list: 'workflows list',
            execute: 'workflows execute --id <app_uuid> --inputs <json>',
          },
        }
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
