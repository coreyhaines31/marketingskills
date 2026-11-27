#!/usr/bin/env node

const rawArgs = process.argv.slice(2)
const API_KEY = process.env.CLAY_API_KEY
const BASE_URL = 'https://api.clay.com/public/v0'

if ((!API_KEY) && rawArgs.length > 0) {
  console.error(JSON.stringify({ error: 'CLAY_API_KEY environment variable required (a Clay Public API key)' }))
  process.exit(1)
}


function requestSignal() {
  const raw = args['timeout-ms'] ?? '120000'
  const ms = Number(raw)
  if (typeof raw !== 'string' || !/^\d+$/.test(raw) || !Number.isSafeInteger(ms) || ms < 1 || ms > 600000) {
    throw new Error('--timeout-ms must be an integer from 1 to 600000')
  }
  return AbortSignal.timeout(ms)
}


async function api(method, path, body) {
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { 'clay-api-key': '***', 'Content-Type': 'application/json' }, body: body || undefined }
  }
  const options = {
    method,
    headers: {
      'clay-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
  }
  if (body) options.body = JSON.stringify(body)
  const res = await fetch(`${BASE_URL}${path}`, { ...options, signal: requestSignal() })
  if (!res.ok) process.exitCode = 1
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

function intArg(name, min, max) {
  const raw = args[name]
  if (raw === undefined) return { value: undefined }
  const n = Number(raw)
  if (!Number.isInteger(n) || n < min || n > max) return { error: `--${name} must be an integer from ${min} to ${max}` }
  return { value: n }
}

function jsonArg(name) {
  try {
    return { value: JSON.parse(args[name]) }
  } catch {
    return { error: `Invalid JSON in --${name}` }
  }
}

const args = parseArgs(rawArgs)
const [cmd, sub, ...rest] = args._

async function main() {
  let result

  switch (cmd) {
    case 'me':
      result = await api('GET', '/me')
      break

    case 'credits':
      switch (sub) {
        case 'balance':
          result = await api('GET', '/credits/balance')
          break
        default:
          result = { error: 'Unknown credits subcommand. Use: balance' }
      }
      break

    case 'search':
      switch (sub) {
        case 'reference': {
          const qs = typeof args.sections === 'string' ? `?sections=${encodeURIComponent(args.sections)}` : ''
          result = await api('GET', `/search/query-mode/reference${qs}`)
          break
        }
        case 'create': {
          if (typeof args.query !== 'string') { result = { error: '--query required (a Clay search query; see: search reference)' }; break }
          result = await api('POST', '/search/query-mode', { query: args.query })
          break
        }
        case 'run': {
          const id = args.id
          if (!id) { result = { error: '--id required (search_id from search create)' }; break }
          const limit = intArg('limit', 1, 500)
          if (limit.error) { result = { error: limit.error }; break }
          const body = {}
          if (limit.value !== undefined) body.limit = limit.value
          result = await api('POST', `/search/query-mode/${encodeURIComponent(id)}/run`, body)
          break
        }
        default:
          result = { error: 'Unknown search subcommand. Use: reference, create, run' }
      }
      break

    case 'routines':
      switch (sub) {
        case 'run': {
          const id = args.id
          if (!id) { result = { error: '--id required (routine_id)' }; break }
          if (!args.items) { result = { error: '--items required (JSON array of {"id","inputs"})' }; break }
          const items = jsonArg('items')
          if (items.error) { result = { error: items.error }; break }
          if (!Array.isArray(items.value) || items.value.length < 1 || items.value.length > 100) {
            result = { error: '--items must be a JSON array of 1 to 100 {"id","inputs"} objects' }
            break
          }
          const body = { items: items.value }
          if (typeof args['webhook-id'] === 'string') body.webhook_id = args['webhook-id']
          result = await api('POST', `/routines/${encodeURIComponent(id)}/run`, body)
          break
        }
        case 'results': {
          const runId = args['run-id']
          if (!runId) { result = { error: '--run-id required (routine_run_id from routines run)' }; break }
          const limit = intArg('limit', 1, 100)
          if (limit.error) { result = { error: limit.error }; break }
          const params = new URLSearchParams()
          if (typeof args.cursor === 'string') params.set('cursor', args.cursor)
          if (limit.value !== undefined) params.set('limit', String(limit.value))
          const qs = params.toString() ? `?${params}` : ''
          result = await api('GET', `/routines/run/${encodeURIComponent(runId)}/results${qs}`)
          break
        }
        default:
          result = { error: 'Unknown routines subcommand. Use: run, results' }
      }
      break

    case 'tables':
      switch (sub) {
        case 'query': {
          if (!args.query) { result = { error: '--query required (JSON structured query, e.g. {"tables":["<table_id>"]})' }; break }
          const query = jsonArg('query')
          if (query.error) { result = { error: query.error }; break }
          const limit = intArg('limit', 1, 100)
          if (limit.error) { result = { error: limit.error }; break }
          const body = { query: query.value }
          if (typeof args.cursor === 'string') body.cursor = args.cursor
          if (limit.value !== undefined) body.limit = limit.value
          result = await api('POST', '/tables/query', body)
          break
        }
        default:
          result = { error: 'Unknown tables subcommand. Use: query' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          me: 'me',
          credits: {
            balance: 'credits balance',
          },
          search: {
            reference: 'search reference [--sections grammar,examples,people-fields]',
            create: 'search create --query <clay search query>',
            run: 'search run --id <search_id> [--limit <1-500>]',
          },
          routines: {
            run: 'routines run --id <routine_id> --items <json array of {"id","inputs"}> [--webhook-id <id>]',
            results: 'routines results --run-id <routine_run_id> [--cursor <c>] [--limit <1-100>]',
          },
          tables: {
            query: 'tables query --query <json> [--cursor <c>] [--limit <1-100>]',
          },
        }
      }
  }

  if (result?.error && rawArgs.length > 0) process.exitCode = 1
  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
