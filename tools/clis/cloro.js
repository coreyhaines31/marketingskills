#!/usr/bin/env node

const rawArgs = process.argv.slice(2)
const API_KEY = process.env.CLORO_API_KEY
const BASE_URL = 'https://api.cloro.dev'
const ENGINES = { chatgpt: '/v1/monitor/chatgpt', aimode: '/v1/monitor/aimode', bing_aimode: '/v1/monitor/bing/aimode', gemini: '/v1/monitor/gemini' }
const COUNTRY_MODELS = ['chatgpt', 'aimode', 'bing_aimode', 'gemini', 'google', 'aioverview']

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

if (!API_KEY && rawArgs.length > 0 && !args['dry-run']) {
  console.error(JSON.stringify({ error: 'CLORO_API_KEY environment variable required' }))
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
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { Authorization: '***', 'Content-Type': 'application/json' }, body: body || undefined }
  }
  const res = await fetch(`${BASE_URL}${path}`, { signal: requestSignal(),
    method,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) process.exitCode = 1
  const text = await res.text()
  try {
    const payload = JSON.parse(text)
    // Errors come back as { success: false, error: { code, message } }.
    if (payload?.success === false) process.exitCode = 1
    return payload
  } catch {
    return { status: res.status, body: text }
  }
}

// Returns an upper-case ISO 3166-1 alpha-2 code, or null when the value is not valid.
function countryCode() {
  const raw = args.country ?? 'US'
  if (typeof raw !== 'string' || !/^[A-Za-z]{2}$/.test(raw)) return null
  return raw.toUpperCase()
}

async function main() {
  let result

  switch (cmd) {
    case 'ask': {
      const path = ENGINES[sub]
      if (!path) { result = { error: 'Unknown ask engine. Use: chatgpt, aimode, bing_aimode, gemini' }; break }
      const prompt = args.prompt
      if (typeof prompt !== 'string' || !prompt.trim()) { result = { error: '--prompt required' }; break }
      const country = countryCode()
      if (!country) { result = { error: '--country must be a two-letter ISO 3166-1 code, for example US' }; break }
      const body = { prompt, country }
      if (args.markdown) body.include = { markdown: true }
      result = await api('POST', path, body)
      break
    }

    case 'serp':
      switch (sub) {
        case 'google': {
          const query = args.query
          if (typeof query !== 'string' || !query.trim()) { result = { error: '--query required' }; break }
          const country = countryCode()
          if (!country) { result = { error: '--country must be a two-letter ISO 3166-1 code, for example US' }; break }
          const body = { query, country }
          if (args.aio) body.include = { aioverview: true }
          result = await api('POST', '/v1/monitor/google', body)
          break
        }
        default:
          result = { error: 'Unknown serp subcommand. Use: google' }
      }
      break

    case 'countries': {
      const model = args.model
      if (model !== undefined && !COUNTRY_MODELS.includes(model)) {
        result = { error: `--model must be one of: ${COUNTRY_MODELS.join(', ')}` }; break
      }
      result = await api('GET', model ? `/v1/countries?model=${model}` : '/v1/countries')
      break
    }

    case 'credits':
      result = await api('GET', '/v1/credits')
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          ask: 'ask [chatgpt | aimode | bing_aimode | gemini] --prompt <text> [--country <CC>] [--markdown]',
          serp: 'serp google --query <text> [--country <CC>] [--aio]',
          countries: 'countries [--model chatgpt|aimode|bing_aimode|gemini|google|aioverview]',
          credits: 'credits',
          options: '--country <ISO 3166-1 alpha-2, default US> --dry-run --timeout-ms <1-600000>',
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
