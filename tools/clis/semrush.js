#!/usr/bin/env node

const rawArgs = process.argv.slice(2)
const API_KEY = process.env.SEMRUSH_API_KEY
const BASE_URL = 'https://api.semrush.com/'
const BACKLINKS_URL = 'https://api.semrush.com/analytics/v1/'

if ((!API_KEY) && rawArgs.length > 0) {
  console.error(JSON.stringify({ error: 'SEMRUSH_API_KEY environment variable required' }))
  process.exit(1)
}

function parseCSV(text) {
  const records = []
  let values = []
  let value = ''
  let quoted = false
  const finishRecord = () => {
    values.push(value)
    if (values.some(cell => cell.trim())) records.push(values)
    values = []
    value = ''
  }
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        value += '"'
        i++
      } else {
        quoted = !quoted
      }
    } else if (!quoted && char === ';') {
      values.push(value)
      value = ''
    } else if (!quoted && (char === '\n' || char === '\r')) {
      finishRecord()
      if (char === '\r' && text[i + 1] === '\n') i++
    } else {
      value += char
    }
  }
  if (value || values.length) finishRecord()
  const [headers, ...rows] = records
  if (!headers) return []
  return rows.map(cells => Object.fromEntries(headers.map((header, index) => [header, cells[index] || ''])))
}

async function api(params, baseUrl = BASE_URL) {
  params.set('key', API_KEY)
  params.set('export_escape', '1')
  if (args['dry-run']) {
    const maskedParams = new URLSearchParams(params)
    maskedParams.set('key', '***')
    return { _dry_run: true, method: 'GET', url: `${baseUrl}?${maskedParams}`, headers: {}, body: undefined }
  }
  const res = await fetch(`${baseUrl}?${params}`)
  const text = await res.text()
  if (!res.ok) {
    process.exitCode = 1
    return { error: text.trim(), status: res.status }
  }
  if (text.startsWith('ERROR')) {
    // ERROR 50 describes an empty result, rather than a rejected request.
    if (!/^ERROR\s+50\s*::/.test(text)) process.exitCode = 1
    return { error: text.trim() }
  }
  return parseCSV(text)
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
  const database = args.database || 'us'

  switch (cmd) {
    case 'domain':
      switch (sub) {
        case 'overview': {
          if (!args.domain) { result = { error: '--domain required' }; break }
          const params = new URLSearchParams({
            type: 'domain_ranks',
            export_columns: 'Db,Dn,Rk,Or,Ot,Oc,Ad,At,Ac',
            domain: args.domain,
          })
          result = await api(params)
          break
        }
        case 'organic': {
          if (!args.domain) { result = { error: '--domain required' }; break }
          const params = new URLSearchParams({
            type: 'domain_organic',
            export_columns: 'Ph,Po,Pp,Pd,Nq,Cp,Ur,Tr,Tc,Co,Nr',
            domain: args.domain,
            database,
          })
          if (args.limit) params.set('display_limit', args.limit)
          result = await api(params)
          break
        }
        case 'competitors': {
          if (!args.domain) { result = { error: '--domain required' }; break }
          const params = new URLSearchParams({
            type: 'domain_organic_organic',
            export_columns: 'Dn,Cr,Np,Or,Ot,Oc,Ad',
            domain: args.domain,
            database,
          })
          if (args.limit) params.set('display_limit', args.limit)
          result = await api(params)
          break
        }
        default:
          result = { error: 'Unknown domain subcommand. Use: overview, organic, competitors' }
      }
      break

    case 'keywords':
      switch (sub) {
        case 'overview': {
          if (!args.phrase) { result = { error: '--phrase required' }; break }
          const params = new URLSearchParams({
            type: 'phrase_all',
            export_columns: 'Ph,Nq,Cp,Co,Nr',
            phrase: args.phrase,
            database,
          })
          result = await api(params)
          break
        }
        case 'related': {
          if (!args.phrase) { result = { error: '--phrase required' }; break }
          const params = new URLSearchParams({
            type: 'phrase_related',
            export_columns: 'Ph,Nq,Cp,Co,Nr,Td',
            phrase: args.phrase,
            database,
          })
          if (args.limit) params.set('display_limit', args.limit)
          result = await api(params)
          break
        }
        case 'difficulty': {
          if (!args.phrase) { result = { error: '--phrase required' }; break }
          const params = new URLSearchParams({
            type: 'phrase_kdi',
            export_columns: 'Ph,Kd',
            phrase: args.phrase,
            database,
          })
          result = await api(params)
          break
        }
        default:
          result = { error: 'Unknown keywords subcommand. Use: overview, related, difficulty' }
      }
      break

    case 'backlinks':
      switch (sub) {
        case 'overview': {
          if (!args.target) { result = { error: '--target required' }; break }
          const params = new URLSearchParams({
            type: 'backlinks_overview',
            target: args.target,
            target_type: 'root_domain',
          })
          result = await api(params, BACKLINKS_URL)
          break
        }
        case 'list': {
          if (!args.target) { result = { error: '--target required' }; break }
          const params = new URLSearchParams({
            type: 'backlinks',
            target: args.target,
            target_type: 'root_domain',
            export_columns: 'source_url,source_title,target_url,anchor',
          })
          if (args.limit) params.set('display_limit', args.limit)
          result = await api(params, BACKLINKS_URL)
          break
        }
        default:
          result = { error: 'Unknown backlinks subcommand. Use: overview, list' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          'domain overview': 'domain overview --domain <domain>',
          'domain organic': 'domain organic --domain <domain> [--database <db>] [--limit <n>]',
          'domain competitors': 'domain competitors --domain <domain> [--database <db>] [--limit <n>]',
          'keywords overview': 'keywords overview --phrase <phrase> [--database <db>]',
          'keywords related': 'keywords related --phrase <phrase> [--database <db>] [--limit <n>]',
          'keywords difficulty': 'keywords difficulty --phrase <phrase> [--database <db>]',
          'backlinks overview': 'backlinks overview --target <domain>',
          'backlinks list': 'backlinks list --target <domain> [--limit <n>]',
          'databases': 'us (default), uk, de, fr, ca, au, etc.',
        }
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
