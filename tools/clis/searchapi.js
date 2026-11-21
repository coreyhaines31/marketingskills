#!/usr/bin/env node

const rawArgs = process.argv.slice(2)
const API_KEY = process.env.SEARCHAPI_API_KEY
const BASE_URL = 'https://www.searchapi.io/api/v1'
const USER_AGENT = 'marketingskills/searchapi-cli'
// Each command pins one engine. `search --engine <name>` reaches any other SearchApi engine (bing, youtube, google_scholar, ...).
const ENGINES = { search: 'google', news: 'google_news', shopping: 'google_shopping' }
const TIME_PERIODS = ['last_hour', 'last_day', 'last_week', 'last_month', 'last_year']
const DEVICES = ['desktop', 'mobile', 'tablet']
const SAFE = ['active', 'off']

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
const [cmd, ...rest] = args._

if (!API_KEY && rawArgs.length > 0 && !args['dry-run']) {
  console.error(JSON.stringify({ error: 'SEARCHAPI_API_KEY environment variable required' }))
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

async function api(path, params) {
  const url = new URL(`${BASE_URL}${path}`)
  for (const [key, value] of Object.entries(params || {})) url.searchParams.set(key, String(value))
  if (args['dry-run']) {
    return { _dry_run: true, method: 'GET', url: url.toString(), headers: { Authorization: '***', Accept: 'application/json', 'User-Agent': USER_AGENT } }
  }
  const res = await fetch(url, { signal: requestSignal(),
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Accept': 'application/json',
      'User-Agent': USER_AGENT,
    },
  })
  if (!res.ok) process.exitCode = 1
  const text = await res.text()
  try {
    // Errors come back as { error: "..." }: 401 for a bad key, 400 for a bad parameter, and 200 with no
    // organic_results when Google returned nothing. The payload is kept and the exit code says it failed.
    return JSON.parse(text)
  } catch {
    return { status: res.status, body: text }
  }
}

// Validates the flags shared by every engine and returns the query parameters, or an error object.
function baseParams(engine) {
  const query = args.query ?? rest.join(' ')
  if (typeof query !== 'string' || !query.trim()) return { error: '--query required' }
  const params = { engine, q: query }
  if (args.country !== undefined) {
    if (typeof args.country !== 'string' || !/^[A-Za-z]{2}$/.test(args.country)) return { error: '--country must be a two-letter ISO 3166-1 code, for example us' }
    params.gl = args.country.toLowerCase()
  }
  if (args.language !== undefined) {
    if (typeof args.language !== 'string' || !/^[a-z]{2}(-[A-Za-z]{2,4})?$/.test(args.language)) return { error: '--language must be a Google language code, for example en or pt-br' }
    params.hl = args.language
  }
  if (args.location !== undefined) {
    if (typeof args.location !== 'string' || !args.location.trim()) return { error: '--location requires a value, for example "Austin, Texas, United States"' }
    params.location = args.location
  }
  if (args.page !== undefined) {
    if (typeof args.page !== 'string' || !/^\d+$/.test(args.page) || Number(args.page) < 1) return { error: '--page must be an integer of 1 or more' }
    params.page = Number(args.page)
  }
  return params
}

// `num` is honored up to 10 on Google web and News; Shopping ignores it, so the flag is refused there.
function numParam(params) {
  if (args.num === undefined) return params
  if (typeof args.num !== 'string' || !/^\d+$/.test(args.num) || Number(args.num) < 1 || Number(args.num) > 10) return { error: '--num must be an integer from 1 to 10' }
  params.num = Number(args.num)
  return params
}

function enumParam(params, flag, values, name) {
  if (args[flag] === undefined) return params
  if (!values.includes(args[flag])) return { error: `--${flag} must be one of: ${values.join(', ')}` }
  params[name] = args[flag]
  return params
}

function priceParam(params, flag, name) {
  if (args[flag] === undefined) return params
  if (typeof args[flag] !== 'string' || !/^\d+(\.\d+)?$/.test(args[flag])) return { error: `--${flag} must be a number, for example 49.99` }
  params[name] = args[flag]
  return params
}

async function main() {
  let result

  switch (cmd) {
    case 'search': {
      let engine = ENGINES.search
      if (args.engine !== undefined) {
        if (typeof args.engine !== 'string' || !/^[a-z0-9_]+$/.test(args.engine)) { result = { error: '--engine must be a SearchApi engine id, for example google, bing or youtube' }; break }
        engine = args.engine
      }
      let params = baseParams(engine)
      if (!params.error) params = numParam(params)
      if (!params.error) params = enumParam(params, 'time', TIME_PERIODS, 'time_period')
      if (!params.error) params = enumParam(params, 'device', DEVICES, 'device')
      if (!params.error) params = enumParam(params, 'safe', SAFE, 'safe')
      if (params.error) { result = params; break }
      result = await api('/search', params)
      break
    }

    case 'news': {
      let params = baseParams(ENGINES.news)
      if (!params.error) params = numParam(params)
      if (!params.error) params = enumParam(params, 'time', TIME_PERIODS, 'time_period')
      if (!params.error) params = enumParam(params, 'device', DEVICES, 'device')
      if (params.error) { result = params; break }
      result = await api('/search', params)
      break
    }

    case 'shopping': {
      let params = baseParams(ENGINES.shopping)
      if (!params.error && args.num !== undefined) params = { error: '--num is not supported by Google Shopping; the engine returns its own page size' }
      if (!params.error) params = priceParam(params, 'min-price', 'price_min')
      if (!params.error) params = priceParam(params, 'max-price', 'price_max')
      if (params.error) { result = params; break }
      result = await api('/search', params)
      break
    }

    case 'account':
      result = await api('/me')
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          search: 'search [query | --query <text>] [--engine <id, default google>] [--country <cc>] [--language <hl>] [--location <text>] [--num <1-10>] [--page <n>] [--time last_hour|last_day|last_week|last_month|last_year] [--device desktop|mobile|tablet] [--safe active|off]',
          news: 'news [query | --query <text>] [--country <cc>] [--language <hl>] [--location <text>] [--num <1-10>] [--page <n>] [--time last_hour|last_day|last_week|last_month|last_year] [--device desktop|mobile|tablet]',
          shopping: 'shopping [query | --query <text>] [--country <cc>] [--language <hl>] [--location <text>] [--page <n>] [--min-price <n>] [--max-price <n>]',
          account: 'account (remaining searches and hourly rate limit; free)',
          options: '--dry-run (preview the request without sending) --timeout-ms <1-600000>',
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
