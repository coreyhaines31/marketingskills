#!/usr/bin/env node

const API_KEY = process.env.FIRECRAWL_API_KEY
const BASE_URL = 'https://api.firecrawl.dev'

if (!API_KEY) {
  console.error(JSON.stringify({ error: 'FIRECRAWL_API_KEY environment variable required' }))
  process.exit(1)
}

async function api(method, path, body) {
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { Authorization: 'Bearer ***', 'Content-Type': 'application/json' }, body: body || undefined }
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
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

function list(val) {
  return val.split(',').map(s => s.trim()).filter(Boolean)
}

const args = parseArgs(process.argv.slice(2))
const [cmd, ...rest] = args._

async function main() {
  let result

  switch (cmd) {
    case 'scrape': {
      const url = args.url || rest[0]
      if (!url) { result = { error: '--url required' }; break }
      const body = { url }
      body.formats = args.formats ? list(args.formats) : ['markdown']
      // API defaults onlyMainContent to true; --full-page keeps nav/boilerplate.
      if (args['full-page']) body.onlyMainContent = false
      if (args.wait) body.waitFor = Number(args.wait)
      result = await api('POST', '/v2/scrape', body)
      break
    }

    case 'search': {
      const query = args.query || rest.join(' ')
      if (!query) { result = { error: '--query required' }; break }
      const body = { query }
      if (args.limit) body.limit = Number(args.limit)
      if (args.sources) body.sources = list(args.sources).map(type => ({ type }))
      if (args.tbs) body.tbs = args.tbs
      // --scrape pulls page content for each result (billed separately).
      if (args.scrape) body.scrapeOptions = { formats: args.formats ? list(args.formats) : ['markdown'] }
      result = await api('POST', '/v2/search', body)
      break
    }

    case 'map': {
      const url = args.url || rest[0]
      if (!url) { result = { error: '--url required' }; break }
      const body = { url }
      if (args.limit) body.limit = Number(args.limit)
      if (args.search) body.search = args.search
      if (args['include-subdomains']) body.includeSubdomains = true
      result = await api('POST', '/v2/map', body)
      break
    }

    case 'crawl': {
      const url = args.url || rest[0]
      if (!url) { result = { error: '--url required' }; break }
      const body = { url }
      if (args.limit) body.limit = Number(args.limit)
      if (args['max-depth']) body.maxDiscoveryDepth = Number(args['max-depth'])
      if (args['include-paths']) body.includePaths = list(args['include-paths'])
      if (args['exclude-paths']) body.excludePaths = list(args['exclude-paths'])
      body.scrapeOptions = { formats: args.formats ? list(args.formats) : ['markdown'] }
      result = await api('POST', '/v2/crawl', body)
      break
    }

    case 'crawl-status': {
      const id = args.id || rest[0]
      if (!id) { result = { error: '--id required' }; break }
      result = await api('GET', `/v2/crawl/${id}`)
      break
    }

    default:
      result = {
        error: 'Unknown command',
        usage: {
          scrape: 'scrape --url <url> [--formats markdown,html,links,summary] [--full-page] [--wait <ms>]',
          search: 'search --query <q> [--limit <n>] [--sources web,news,images] [--tbs qdr:d|qdr:w|qdr:m] [--scrape] [--formats markdown,html]',
          map: 'map --url <url> [--limit <n>] [--search <term>] [--include-subdomains]',
          crawl: 'crawl --url <url> [--limit <n>] [--max-depth <n>] [--include-paths /blog,/docs] [--exclude-paths /tag] [--formats markdown,html]',
          'crawl-status': 'crawl-status --id <crawlId>',
          options: '--dry-run (preview request without sending)',
        }
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
