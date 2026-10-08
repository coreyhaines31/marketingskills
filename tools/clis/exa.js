#!/usr/bin/env node

const rawArgs = process.argv.slice(2)
const API_KEY = process.env.EXA_API_KEY
const BASE_URL = 'https://api.exa.ai'

if ((!API_KEY) && rawArgs.length > 0) {
  console.error(JSON.stringify({ error: 'EXA_API_KEY environment variable required' }))
  process.exit(1)
}

async function api(method, path, body) {
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { 'x-api-key': '***', 'Content-Type': 'application/json', 'x-exa-integration': 'marketingskills' }, body: body || undefined }
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json',
      'x-exa-integration': 'marketingskills',
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

function buildContents(args) {
  const contents = {}
  if (args.text) {
    contents.text = args['max-chars']
      ? { maxCharacters: Number(args['max-chars']) }
      : true
  }
  if (args.highlights) {
    contents.highlights = args['highlight-query']
      ? { query: args['highlight-query'] }
      : true
  }
  if (args.summary) {
    contents.summary = args['summary-query']
      ? { query: args['summary-query'] }
      : {}
  }
  return Object.keys(contents).length ? contents : null
}

function buildResearch(args) {
  const research = {}
  if (args['output-schema'] !== undefined) {
    let schema
    try { schema = JSON.parse(args['output-schema']) } catch { throw new Error('--output-schema requires valid JSON') }
    if (!schema || typeof schema !== 'object' || Array.isArray(schema) || !['text', 'object'].includes(schema.type)) {
      throw new Error('--output-schema requires an object with root type text or object')
    }
    research.outputSchema = schema
  }
  for (const [flag, field] of [['objective', 'objective'], ['system-prompt', 'systemPrompt']]) {
    if (args[flag] !== undefined) {
      if (typeof args[flag] !== 'string' || !args[flag].trim() || (flag === 'objective' && args[flag].length > 4096)) {
        throw new Error(`--${flag} requires nonempty text${flag === 'objective' ? ' of at most 4096 characters' : ''}`)
      }
      research[field] = args[flag]
    }
  }
  if (args['additional-queries'] !== undefined) {
    let queries
    try { queries = JSON.parse(args['additional-queries']) } catch { throw new Error('--additional-queries requires a JSON array') }
    if (!Array.isArray(queries) || queries.length < 1 || queries.length > 10 || queries.some(query => typeof query !== 'string' || !query.trim())) {
      throw new Error('--additional-queries requires one to ten nonempty strings')
    }
    if (!['deep-lite', 'deep', 'deep-reasoning'].includes(args.type)) {
      throw new Error('--additional-queries requires --type deep-lite, deep, or deep-reasoning')
    }
    research.additionalQueries = queries
  }
  return research
}

const args = parseArgs(rawArgs)
const [cmd, ...rest] = args._

async function main() {
  let result

  switch (cmd) {
    case 'answer': {
      const query = args.query ?? rest.join(' ')
      if (typeof query !== 'string' || !query.trim()) throw new Error('answer requires a nonempty --query or positional question')
      const body = { query }
      for (const [flag, field] of [['model', 'model'], ['system-prompt', 'systemPrompt']]) {
        if (args[flag] === undefined) continue
        if (typeof args[flag] !== 'string' || !args[flag].trim()) throw new Error(`--${flag} requires a value`)
        body[field] = args[flag]
      }
      if (args.text !== undefined) {
        if (args.text === true || args.text === 'true') body.text = true
        else if (args.text === 'false') body.text = false
        else throw new Error('--text must be true or false (or a bare flag for true)')
      }
      if (args['output-schema'] !== undefined) {
        let schema
        try { schema = JSON.parse(args['output-schema']) } catch { throw new Error('--output-schema must be a JSON object') }
        if (!schema || typeof schema !== 'object' || Array.isArray(schema)) throw new Error('--output-schema must be a JSON object')
        body.outputSchema = schema
      }
      result = await api('POST', '/answer', body)
      break
    }

    case 'search': {
      const query = args.query || rest.join(' ')
      if (!query) { result = { error: '--query required' }; break }
      const body = { query, ...buildResearch(args) }
      if (args.type) body.type = args.type
      if (args.num) body.numResults = Number(args.num)
      if (args.category) body.category = args.category
      if (args['include-domains']) body.includeDomains = args['include-domains'].split(',').map(s => s.trim())
      if (args['exclude-domains']) body.excludeDomains = args['exclude-domains'].split(',').map(s => s.trim())
      if (args['include-text']) body.includeText = args['include-text'].split(',').map(s => s.trim())
      if (args['exclude-text']) body.excludeText = args['exclude-text'].split(',').map(s => s.trim())
      if (args['start-published']) body.startPublishedDate = args['start-published']
      if (args['end-published']) body.endPublishedDate = args['end-published']
      if (args['start-crawl']) body.startCrawlDate = args['start-crawl']
      if (args['end-crawl']) body.endCrawlDate = args['end-crawl']
      if (args['user-location']) body.userLocation = args['user-location']
      const contents = buildContents(args)
      if (contents) body.contents = contents
      result = await api('POST', '/search', body)
      break
    }

    case 'find-similar': {
      const url = args.url
      if (!url) { result = { error: '--url required' }; break }
      const body = { url }
      if (args.num) body.numResults = Number(args.num)
      if (args['include-domains']) body.includeDomains = args['include-domains'].split(',').map(s => s.trim())
      if (args['exclude-domains']) body.excludeDomains = args['exclude-domains'].split(',').map(s => s.trim())
      if (args['start-published']) body.startPublishedDate = args['start-published']
      if (args['end-published']) body.endPublishedDate = args['end-published']
      if (args['start-crawl']) body.startCrawlDate = args['start-crawl']
      if (args['end-crawl']) body.endCrawlDate = args['end-crawl']
      const contents = buildContents(args)
      if (contents) body.contents = contents
      result = await api('POST', '/findSimilar', body)
      break
    }

    case 'contents': {
      const urls = args.urls?.split(',').map(s => s.trim())
      if (!urls || !urls.length) { result = { error: '--urls required (comma-separated)' }; break }
      const body = { urls }
      const contents = buildContents(args)
      if (contents) Object.assign(body, contents)
      else body.text = true
      result = await api('POST', '/contents', body)
      break
    }

    default:
      result = {
        error: 'Unknown command',
        usage: {
          answer: 'answer [question | --query <q>] [--model <model>] [--system-prompt <instructions>] [--text true|false] [--output-schema <JSON object>]',
          search: 'search --query <q> [--type neural|fast|auto|deep-lite|deep|deep-reasoning|instant] [--num <n>] [--category company|research paper|news|personal site|financial report|people] [--include-domains <d1,d2>] [--exclude-domains <d1,d2>] [--include-text <phrases>] [--exclude-text <phrases>] [--start-published <ISO>] [--end-published <ISO>] [--user-location <CC>] [--text] [--highlights] [--summary] [--max-chars <n>] [--highlight-query <q>] [--summary-query <q>] [--output-schema <JSON>] [--objective <text>] [--system-prompt <text>] [--additional-queries <JSON-array>]',
          'find-similar': 'find-similar --url <url> [--num <n>] [--include-domains <d1,d2>] [--exclude-domains <d1,d2>] [--start-published <ISO>] [--end-published <ISO>] [--text] [--highlights] [--summary]',
          contents: 'contents --urls <url1,url2> [--text] [--highlights] [--summary] [--max-chars <n>] [--highlight-query <q>] [--summary-query <q>]',
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
