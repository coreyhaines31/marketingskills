#!/usr/bin/env node

const rawArgs = process.argv.slice(2)
const API_KEY = process.env.GOANYAPI_API_KEY
const BASE_URL = 'https://api.goanyapi.com/api/v1'

if ((!API_KEY) && rawArgs.length > 0) {
  console.error(JSON.stringify({ error: 'GOANYAPI_API_KEY environment variable required' }))
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


async function api(path, query) {
  const url = new URL(`${BASE_URL}${path}`)
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value))
  }
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Accept': 'application/json',
  }
  if (args['dry-run']) {
    return { _dry_run: true, method: 'GET', url: url.toString(), headers: { ...headers, Authorization: '***' } }
  }
  const res = await fetch(url, { signal: requestSignal(), method: 'GET', headers })
  const text = await res.text()
  let payload
  try {
    payload = JSON.parse(text)
  } catch {
    return { status: res.status, body: text }
  }
  if (!res.ok || (payload && payload.code && payload.code !== 'ok')) process.exitCode = 1
  return payload
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
const [cmd, sub] = args._

// Required string flag. An omitted value (`--domain`) is rejected rather than
// coerced to the string "true".
function str(name, { required = false, aliases = [] } = {}) {
  let value = args[name]
  for (const alias of aliases) {
    if (value === undefined) value = args[alias]
  }
  if (value === true) throw new Error(`--${name} requires a value`)
  if (value === undefined || value === '') {
    if (required) throw new Error(`--${name} required`)
    return undefined
  }
  if (typeof value !== 'string') throw new Error(`--${name} must be a string`)
  return value
}

function int(name, { min, max, fallback } = {}) {
  const raw = args[name]
  if (raw === undefined) return fallback
  if (typeof raw !== 'string' || !/^-?\d+$/.test(raw)) throw new Error(`--${name} must be an integer`)
  const value = Number(raw)
  if (!Number.isSafeInteger(value) || (min !== undefined && value < min) || (max !== undefined && value > max)) {
    throw new Error(`--${name} must be an integer from ${min ?? '-inf'} to ${max ?? 'inf'}`)
  }
  return value
}

function bool(name) {
  if (args[name] === undefined) return undefined
  if (args[name] === true) return true
  if (args[name] === 'true' || args[name] === 'false') return args[name] === 'true'
  throw new Error(`--${name} must be true or false`)
}

const SERP_EDITIONS = {
  stable: { path: '/serp-stable', keyword: 'query', credits: 1 },
  standard: { path: '/serp-standard', keyword: 'q', credits: 2 },
  multi: { path: '/serp', keyword: 'q', credits: 3 },
}

const AUTOCOMPLETE_ENGINES = {
  google: '/google-autocomplete',
  bing: '/bing-autocomplete',
  duckduckgo: '/duckduckgo-autocomplete',
  naver: '/naver-autocomplete',
  coccoc: '/coccoc-autocomplete',
  yandex: '/yandex-autocomplete',
  youtube: '/youtube-autocomplete',
  yahoo: '/yahoo-autocomplete',
}

async function dispatch() {
  let result

  switch (cmd) {    case 'serp':
      switch (sub) {
        case 'google': {
          const edition = str('edition') || 'stable'
          const config = SERP_EDITIONS[edition]
          if (!config) throw new Error(`--edition must be one of: ${Object.keys(SERP_EDITIONS).join(', ')}`)
          result = await api(config.path, {
            [config.keyword]: str(config.keyword, { required: true, aliases: config.keyword === 'query' ? ['q'] : ['query'] }),
            gl: str('gl'),
            hl: str('hl'),
            start: int('start', { min: 0 }),
            device: str('device'),
            safe: str('safe'),
            ...(edition === 'multi' ? { browser: str('browser') } : {}),
          })
          break
        }
        case 'bing':
          result = await api('/bing-serp', {
            query: str('query', { required: true, aliases: ['q'] }),
            cc: str('cc'),
            mkt: str('mkt'),
            setlang: str('setlang'),
            device: str('device'),
            next_page_token: str('next-page-token'),
          })
          break
        default:
          result = { error: 'Unknown serp subcommand. Use: google, bing' }
      }
      break

    case 'keywords':
      switch (sub) {
        case 'suggestions':
          result = await api('/keyword-suggestions', {
            keyword: str('keyword', { required: true, aliases: ['kw'] }),
            page: int('page', { min: 1 }),
          })
          break

        // The API only returns history for an exact term from keyword suggestions.
        case 'volume':
          result = await api('/keyword-search-volume', { keyword: str('keyword', { required: true, aliases: ['kw'] }) })
          break
        case 'difficulty':
          result = await api('/keyword-difficulty', {
            keyword: str('keyword', { required: true, aliases: ['kw'] }),
            country: str('country'),
          })
          break
        case 'generate':
          result = await api('/keyword-generator', {
            keyword: str('keyword', { required: true, aliases: ['kw'] }),
            country: str('country'),
          })
          break
        case 'autocomplete': {
          const engine = str('engine', { required: true })
          const path = AUTOCOMPLETE_ENGINES[engine]
          if (!path) throw new Error(`--engine must be one of: ${Object.keys(AUTOCOMPLETE_ENGINES).join(', ')}`)
          result = await api(path, {
            q: str('q', { required: true, aliases: ['query', 'keyword'] }),
            hl: str('hl'),
            gl: str('gl'),
            mkt: str('mkt'),
            kl: str('kl'),
            uil: str('uil'),
            domain: str('domain'),
          })
          break
        }
        case 'trends':
          result = await api('/google-trends', {
            q: str('q', { required: true, aliases: ['keyword'] }),
            date: str('date'),
            geo: str('geo'),
            data_type: str('data-type'),
          })
          break
        default:
          result = { error: 'Unknown keywords subcommand. Use: suggestions, volume, difficulty, generate, autocomplete, trends' }
      }
      break

    case 'domain':
      switch (sub) {
        case 'traffic':
          result = await api('/traffic', { domain: str('domain', { required: true }), month: str('month') })
          break
        case 'rating':
          result = await api('/dr', { domain: str('domain', { required: true }) })
          break
        case 'rating-history':
          result = await api('/dr-history', {
            domain: str('domain', { required: true }),
            includeDr: bool('include-dr'),
          })
          break
        case 'backlinks':
          result = await api('/backlink', { domain: str('domain', { required: true }) })
          break
        case 'adsense':
          result = await api('/adsense', { domain: str('domain'), pubId: str('pub-id') })
          break
        default:
          result = { error: 'Unknown domain subcommand. Use: traffic, rating, rating-history, backlinks, adsense' }
      }
      break

    case 'ads':
      switch (sub) {
        case 'transparency':
          result = await api('/transparency', {
            keyword: str('keyword'),
            domain: str('domain'),
            creativeIds: str('creative-ids'),
          })
          break
        case 'statistics':
          result = await api('/ads-statistics', {
            action: str('action', { required: true }),
            keyword: str('keyword'),
            advertiserId: str('advertiser-id'),
            hostId: str('host-id'),
            title: str('title'),
            startDay: str('start-day'),
          })
          break
        default:
          result = { error: 'Unknown ads subcommand. Use: transparency, statistics' }
      }
      break

    case 'page':
      switch (sub) {
        case 'markdown':
          result = await api('/html-to-markdown-api', {
            url: str('url', { required: true }),
            retainImages: bool('retain-images'),
            retainLinks: bool('retain-links'),
            targetSelector: str('target-selector'),
          })
          break
        default:
          result = { error: 'Unknown page subcommand. Use: markdown' }
      }
      break

    case 'account':
      switch (sub) {
        case 'credits':
          result = await api('/credits/balance', {})
          break
        case 'activity':
          result = await api('/activity-credits', {
            page: int('page', { min: 1 }),
            size: int('size', { min: 1 }),
            type: str('type'),
            requestStatus: str('request-status'),
          })
          break
        default:
          result = { error: 'Unknown account subcommand. Use: credits, activity' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          serp: 'serp google --query <q> [--edition stable|standard|multi] [--gl us] [--hl en] [--start 0] [--device desktop] | serp bing --query <q> [--mkt en-US]',
          keywords: 'keywords [suggestions|volume|difficulty|generate] --keyword <kw> | keywords autocomplete --engine <google|bing|duckduckgo|naver|coccoc|yandex|youtube|yahoo> --q <q> | keywords trends --q <kw1,kw2> [--geo US]',
          domain: 'domain [traffic|rating|rating-history|backlinks] --domain <domain> | domain adsense --domain <d> | --pub-id <id>',
          ads: 'ads transparency --keyword <kw> | --domain <d> | --creative-ids <id> ; ads statistics --action <action>',
          page: 'page markdown --url <url> [--retain-images true] [--retain-links true] [--target-selector <css>]',
          account: 'account [credits|activity]',
          options: '--dry-run --timeout-ms <ms>',
        },
      }
  }

  return result
}

async function main() {
  let result
  try {
    result = await dispatch()
  } catch (err) {
    // Argument validation errors are reported as JSON on stdout so callers can
    // parse them, and never reach the network.
    result = { error: err.message }
  }
  if (result?.error && rawArgs.length > 0) process.exitCode = 1
  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
