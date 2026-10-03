#!/usr/bin/env node

const rawArgs = process.argv.slice(2)
const API_KEY = process.env.KEYWORDS_EVERYWHERE_API_KEY
const BASE_URL = 'https://api.keywordseverywhere.com/v1'

if ((!API_KEY) && rawArgs.length > 0) {
  console.error(JSON.stringify({ error: 'KEYWORDS_EVERYWHERE_API_KEY environment variable required' }))
  process.exit(1)
}

async function api(method, path, body) {
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { ...headers, Authorization: '***' }, body: body || undefined }
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
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

function suggestionBody() {
  const keyword = args.keyword !== undefined ? args.keyword : args.kw
  if (typeof keyword !== 'string' || !keyword.trim()) throw new Error('--keyword required (one seed keyword; --kw is an alias)')
  const body = { keyword }
  if (args.num !== undefined) {
    const num = Number(args.num)
    if (typeof args.num !== 'string' || !Number.isSafeInteger(num) || num < 1 || num > 10000) {
      throw new Error('--num must be an integer from 1 to 10000')
    }
    body.num = num
  }
  return body
}

async function main() {
  let result
  const country = args.country || 'us'
  const currency = args.currency || 'USD'
  const dataSource = args['data-source'] || 'gkp'

  switch (cmd) {
    case 'keywords':
      switch (sub) {
        case 'data': {
          const kw = args.kw?.split(',')
          if (!kw) { result = { error: '--kw required (comma-separated keywords, max 100)' }; break }
          result = await api('POST', '/get_keyword_data', { country, currency, dataSource, kw })
          break
        }
        case 'related': {
          result = await api('POST', '/get_related_keywords', suggestionBody())
          break
        }
        case 'pasf': {
          result = await api('POST', '/get_pasf_keywords', suggestionBody())
          break
        }
        default:
          result = { error: 'Unknown keywords subcommand. Use: data, related, pasf' }
      }
      break

    case 'domain':
      switch (sub) {
        case 'keywords': {
          const domain = args.domain
          if (!domain) { result = { error: '--domain required' }; break }
          result = await api('POST', '/get_domain_keywords', { country, currency, domain })
          break
        }
        case 'traffic': {
          const domain = args.domain
          if (!domain) { result = { error: '--domain required' }; break }
          result = await api('POST', '/get_domain_traffic', { country, domain })
          break
        }
        case 'backlinks': {
          const domain = args.domain
          if (!domain) { result = { error: '--domain required' }; break }
          result = await api('POST', '/get_domain_backlinks', { domain })
          break
        }
        case 'unique-backlinks': {
          const domain = args.domain
          if (!domain) { result = { error: '--domain required' }; break }
          result = await api('POST', '/get_unique_domain_backlinks', { domain })
          break
        }
        default:
          result = { error: 'Unknown domain subcommand. Use: keywords, traffic, backlinks, unique-backlinks' }
      }
      break

    case 'url':
      switch (sub) {
        case 'keywords': {
          const url = args.url
          if (!url) { result = { error: '--url required' }; break }
          result = await api('POST', '/get_url_keywords', { country, currency, url })
          break
        }
        case 'traffic': {
          const url = args.url
          if (!url) { result = { error: '--url required' }; break }
          result = await api('POST', '/get_url_traffic', { country, url })
          break
        }
        case 'backlinks': {
          const url = args.url
          if (!url) { result = { error: '--url required' }; break }
          result = await api('POST', '/get_page_backlinks', { url })
          break
        }
        case 'unique-backlinks': {
          const url = args.url
          if (!url) { result = { error: '--url required' }; break }
          result = await api('POST', '/get_unique_page_backlinks', { url })
          break
        }
        default:
          result = { error: 'Unknown url subcommand. Use: keywords, traffic, backlinks, unique-backlinks' }
      }
      break

    case 'account':
      switch (sub) {
        case 'credits':
          result = await api('GET', '/get_credits')
          break
        case 'countries':
          result = await api('GET', '/get_countries')
          break
        case 'currencies':
          result = await api('GET', '/get_currencies')
          break
        default:
          result = { error: 'Unknown account subcommand. Use: credits, countries, currencies' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          keywords: 'keywords data --kw <kw1,kw2,...> | keywords [related|pasf] --keyword <seed> [--num <n>] (--kw is a seed alias)',
          domain: 'domain [keywords|traffic|backlinks|unique-backlinks] --domain <domain>',
          url: 'url [keywords|traffic|backlinks|unique-backlinks] --url <url>',
          account: 'account [credits|countries|currencies]',
          options: '--country <us> --currency <USD> --data-source <gkp>',
        }
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
