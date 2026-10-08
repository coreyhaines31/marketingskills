#!/usr/bin/env node

const rawArgs = process.argv.slice(2)
const TOKEN = process.env.MIXPANEL_TOKEN
const API_KEY = process.env.MIXPANEL_API_KEY
const SECRET = process.env.MIXPANEL_SECRET
const PROJECT_SECRET = process.env.MIXPANEL_PROJECT_SECRET
const INGESTION_URL = 'https://api.mixpanel.com'
const QUERY_URL = 'https://mixpanel.com/api/2.0'
const EXPORT_URL = 'https://data.mixpanel.com/api/2.0'

if ((!TOKEN && !API_KEY && !SECRET && !PROJECT_SECRET) && rawArgs.length > 0) {
  console.error(JSON.stringify({ error: 'MIXPANEL_TOKEN (ingestion), MIXPANEL_API_KEY + MIXPANEL_SECRET (service account), or MIXPANEL_PROJECT_SECRET (legacy project auth) required' }))
  process.exit(1)
}

async function ingestApi(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  if (args['dry-run']) {
    const maskedBody = body ? JSON.parse(JSON.stringify(body)) : undefined
    if (Array.isArray(maskedBody)) maskedBody.forEach(item => {
      if (item.properties && item.properties.token) item.properties.token = '***'
      if (item.$token) item.$token = '***'
    })
    return { _dry_run: true, method, url: `${INGESTION_URL}${path}`, headers, body: maskedBody }
  }
  const res = await fetch(`${INGESTION_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) process.exitCode = 1
  const text = await res.text()
  try {
    const payload = JSON.parse(text)
    if (payload === 0) process.exitCode = 1
    return payload
  } catch {
    return { status: res.status, body: text }
  }
}

function queryAuth() {
  // Existing KEY:SECRET credentials are a service account, and always win.
  if (API_KEY) {
    if (!SECRET) throw new Error('MIXPANEL_SECRET required with MIXPANEL_API_KEY for service-account auth')
    if (!args['project-id']) throw new Error('--project-id required for service-account query/export operations')
    return Buffer.from(`${API_KEY}:${SECRET}`).toString('base64')
  }
  const secret = PROJECT_SECRET || SECRET
  if (!secret) throw new Error('Service-account credentials or MIXPANEL_PROJECT_SECRET required for query/export operations')
  return Buffer.from(`${secret}:`).toString('base64')
}

async function queryApi(method, baseUrl, path, params) {
  const auth = queryAuth()
  if (args['project-id']) params.set('project_id', args['project-id'])
  const url = params ? `${baseUrl}${path}?${params}` : `${baseUrl}${path}`
  const headers = {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json',
  }
  if (args['dry-run']) {
    return { _dry_run: true, method, url, headers: { ...headers, Authorization: '***' } }
  }
  const res = await fetch(url, {
    method,
    headers,
  })
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { status: res.status, body: text }
  }
}

async function queryApiPost(path, body) {
  const auth = queryAuth()
  const headers = {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json',
  }
  if (args['dry-run']) {
    return { _dry_run: true, method: 'POST', url: `${QUERY_URL}${path}`, headers: { ...headers, Authorization: '***' }, body: body || undefined }
  }
  const res = await fetch(`${QUERY_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
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
    case 'track':
      switch (sub) {
        case 'event': {
          if (!TOKEN) { result = { error: 'MIXPANEL_TOKEN required for tracking' }; break }
          if (!args['distinct-id']) { result = { error: '--distinct-id required' }; break }
          if (!args.event) { result = { error: '--event required' }; break }
          let properties
          try { properties = args.properties ? JSON.parse(args.properties) : {} } catch { result = { error: 'Invalid JSON in --properties' }; break }
          properties.token = TOKEN
          properties.distinct_id = args['distinct-id']
          result = await ingestApi('POST', '/track', [{
            event: args.event,
            properties,
          }])
          break
        }
        default:
          result = { error: 'Unknown track subcommand. Use: event' }
      }
      break

    case 'profiles':
      switch (sub) {
        case 'set': {
          if (!TOKEN) { result = { error: 'MIXPANEL_TOKEN required for profiles' }; break }
          if (!args['distinct-id']) { result = { error: '--distinct-id required' }; break }
          let properties
          try { properties = args.properties ? JSON.parse(args.properties) : {} } catch { result = { error: 'Invalid JSON in --properties' }; break }
          result = await ingestApi('POST', '/engage', [{
            $token: TOKEN,
            $distinct_id: args['distinct-id'],
            $set: properties,
          }])
          break
        }
        default:
          result = { error: 'Unknown profiles subcommand. Use: set' }
      }
      break

    case 'query':
      switch (sub) {
        case 'events': {
          if (!args['project-id']) { result = { error: '--project-id required' }; break }
          const body = {
            project_id: parseInt(args['project-id']),
            bookmark_id: null,
            params: {
              events: [{ event: args.event || 'all' }],
              time_range: {
                from_date: args['from-date'] || new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
                to_date: args['to-date'] || new Date().toISOString().slice(0, 10),
              },
            },
          }
          result = await queryApiPost('/insights', body)
          break
        }
        default:
          result = { error: 'Unknown query subcommand. Use: events' }
      }
      break

    case 'funnels':
      switch (sub) {
        case 'get': {
          if (!args['funnel-id']) { result = { error: '--funnel-id required' }; break }
          const params = new URLSearchParams()
          params.set('funnel_id', args['funnel-id'])
          if (args['from-date']) params.set('from_date', args['from-date'])
          if (args['to-date']) params.set('to_date', args['to-date'])
          result = await queryApi('GET', QUERY_URL, '/funnels', params)
          break
        }
        default:
          result = { error: 'Unknown funnels subcommand. Use: get' }
      }
      break

    case 'retention':
      switch (sub) {
        case 'get': {
          if (!args['from-date'] || !args['to-date']) { result = { error: '--from-date and --to-date required (YYYY-MM-DD)' }; break }
          const params = new URLSearchParams()
          params.set('from_date', args['from-date'])
          params.set('to_date', args['to-date'])
          params.set('retention_type', 'birth')
          if (args['born-event']) params.set('born_event', args['born-event'])
          result = await queryApi('GET', QUERY_URL, '/retention', params)
          break
        }
        default:
          result = { error: 'Unknown retention subcommand. Use: get' }
      }
      break

    case 'export':
      switch (sub) {
        case 'events': {
          if (!args['from-date']) { result = { error: '--from-date required' }; break }
          if (!args['to-date']) { result = { error: '--to-date required' }; break }
          const params = new URLSearchParams()
          params.set('from_date', args['from-date'])
          params.set('to_date', args['to-date'])
          if (args.event) params.set('event', JSON.stringify([args.event]))
          result = await queryApi('GET', EXPORT_URL, '/export', params)
          break
        }
        default:
          result = { error: 'Unknown export subcommand. Use: events' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          track: 'track event --distinct-id <id> --event <name> [--properties <json>]',
          profiles: 'profiles set --distinct-id <id> [--properties <json>]',
          query: 'query events --project-id <id> [--event <name>] [--from-date <date>] [--to-date <date>]',
          funnels: 'funnels get --funnel-id <id> [--project-id <id>] [--from-date <date>] [--to-date <date>]',
          retention: 'retention get [--project-id <id>] [--from-date <date>] [--to-date <date>] [--born-event <event>]',
          export: 'export events --from-date <date> --to-date <date> [--project-id <id>]',
        }
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
