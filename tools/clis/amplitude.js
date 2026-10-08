#!/usr/bin/env node

const rawArgs = process.argv.slice(2)
const API_KEY = process.env.AMPLITUDE_API_KEY
const SECRET_KEY = process.env.AMPLITUDE_SECRET_KEY
const INGESTION_URL = 'https://api2.amplitude.com'
const QUERY_URL = 'https://amplitude.com/api/2'

if ((!API_KEY) && rawArgs.length > 0) {
  console.error(JSON.stringify({ error: 'AMPLITUDE_API_KEY environment variable required' }))
  process.exit(1)
}

async function ingestApi(method, path, body) {
  if (args['dry-run']) {
    const maskedBody = body ? JSON.parse(JSON.stringify(body)) : undefined
    if (maskedBody && maskedBody.api_key) maskedBody.api_key = '***'
    return { _dry_run: true, method, url: `${INGESTION_URL}${path}`, headers: { 'Content-Type': 'application/json' }, body: maskedBody }
  }
  const res = await fetch(`${INGESTION_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { status: res.status, body: text }
  }
}

async function queryApi(method, path, params) {
  if (!SECRET_KEY) {
    return { error: 'AMPLITUDE_SECRET_KEY required for query/export operations' }
  }
  const url = params ? `${QUERY_URL}${path}?${params}` : `${QUERY_URL}${path}`
  if (args['dry-run']) {
    return { _dry_run: true, method, url, headers: { 'Authorization': '***', 'Content-Type': 'application/json' } }
  }
  const auth = Buffer.from(`${API_KEY}:${SECRET_KEY}`).toString('base64')
  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
  })
  // Export responses are ZIP archives, not text. Keep JSON stdout while
  // preserving their bytes: Buffer.from(result.body, 'base64') restores the ZIP.
  if (path === '/export' && res.ok) {
    return {
      status: res.status,
      contentType: 'application/zip',
      encoding: 'base64',
      body: Buffer.from(await res.arrayBuffer()).toString('base64'),
    }
  }
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
          for (const key of ['user-id', 'device-id']) {
            if (args[key] !== undefined && (typeof args[key] !== 'string' || args[key].trim().length === 0)) throw new Error(`--${key} requires a non-empty string`)
          }
          if (!args['user-id'] && !args['device-id']) { result = { error: '--user-id or --device-id required' }; break }
          if (!args['event-type']) { result = { error: '--event-type required' }; break }
          const event = {
            ...(args['user-id'] !== undefined ? { user_id: args['user-id'] } : {}),
            ...(args['device-id'] !== undefined ? { device_id: args['device-id'] } : {}),
            event_type: args['event-type'],
          }
          if (args.properties) {
            event.event_properties = JSON.parse(args.properties)
          }
          result = await ingestApi('POST', '/2/httpapi', {
            api_key: API_KEY,
            events: [event],
          })
          break
        }
        case 'batch': {
          if (!args.events) { result = { error: '--events required (JSON array)' }; break }
          const events = JSON.parse(args.events)
          result = await ingestApi('POST', '/batch', {
            api_key: API_KEY,
            events,
          })
          break
        }
        default:
          result = { error: 'Unknown track subcommand. Use: event, batch' }
      }
      break

    case 'users':
      switch (sub) {
        case 'activity': {
          const userId = args['user-id']
          let amplitudeId = args['amplitude-id']
          if (!userId && !amplitudeId) { result = { error: '--user-id or --amplitude-id required' }; break }
          if (userId && amplitudeId) { result = { error: 'Use only one of --user-id or --amplitude-id' }; break }
          if (userId) {
            const searchParams = new URLSearchParams({ user: userId })
            const search = await queryApi('GET', '/usersearch', searchParams)
            if (search._dry_run || !Array.isArray(search.matches)) { result = search; break }
            const matches = search.matches.filter(match => match.user_id === userId)
            if (matches.length !== 1) {
              result = { error: matches.length ? 'Multiple exact user ID matches; use --amplitude-id' : 'No exact user ID match found' }
              break
            }
            amplitudeId = matches[0].amplitude_id
          }
          const params = new URLSearchParams()
          params.set('user', amplitudeId)
          result = await queryApi('GET', '/useractivity', params)
          break
        }
        default:
          result = { error: 'Unknown users subcommand. Use: activity' }
      }
      break

    case 'export':
      switch (sub) {
        case 'events': {
          if (!args.start) { result = { error: '--start required (e.g. 20240101T00)' }; break }
          if (!args.end) { result = { error: '--end required (e.g. 20240131T23)' }; break }
          const params = new URLSearchParams()
          params.set('start', args.start)
          params.set('end', args.end)
          result = await queryApi('GET', '/export', params)
          break
        }
        default:
          result = { error: 'Unknown export subcommand. Use: events' }
      }
      break

    case 'retention':
      switch (sub) {
        case 'get': {
          if (!args.start) { result = { error: '--start required (e.g. 20240101)' }; break }
          if (!args.end) { result = { error: '--end required (e.g. 20240131)' }; break }
          const params = new URLSearchParams()
          params.set('start', args.start)
          params.set('end', args.end)
          for (const key of ['start-event', 'return-event', 'event']) {
            if (args[key] !== undefined && (typeof args[key] !== 'string' || !args[key].trim())) {
              throw new Error(`--${key} requires a nonempty event name`)
            }
          }
          params.set('se', JSON.stringify({ event_type: args['start-event'] || '_new' }))
          params.set('re', JSON.stringify({ event_type: args['return-event'] || args.event || '_active' }))
          result = await queryApi('GET', '/retention', params)
          break
        }
        default:
          result = { error: 'Unknown retention subcommand. Use: get' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          track: 'track [event [--user-id <id>] [--device-id <id>] --event-type <type> [--properties <json>] | batch --events <json>]',
          users: 'users activity [--user-id <external-user-id> | --amplitude-id <internal-id>] (--user-id dry-run previews the initial lookup)',
          export: "export events --start <YYYYMMDDThh> --end <YYYYMMDDThh> (ZIP in base64 body; decode with Buffer.from(result.body, 'base64'))",
          retention: 'retention get --start <YYYYMMDD> --end <YYYYMMDD> [--start-event <type>] [--return-event <type>] [--event <return-type>]',
        }
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
