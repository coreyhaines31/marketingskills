#!/usr/bin/env node

// Standalone Node 18+ client for the Unified MCP server. No background GET stream.
const ENDPOINT = 'https://mcp.parallel.ai/mcp'
const USER_AGENT = 'marketingskills/parallel-cli'
const rawArgs = process.argv.slice(2)
const key = process.env.PARALLEL_API_KEY

function parseArgs(argv) {
  const args = { _: [] }
  const values = new Set(['query', 'objective', 'urls', 'session-id', 'timeout-ms'])
  const flags = new Set(['help', 'dry-run', 'full-content', 'cached-only', 'offline'])
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (!arg.startsWith('--')) { args._.push(arg); continue }
    const name = arg.slice(2)
    if (Object.hasOwn(args, name)) throw new Error(`Duplicate option --${name}`)
    if (flags.has(name)) args[name] = true
    else if (values.has(name)) {
      const value = argv[++i]
      if (!value || value.startsWith('--') || !value.trim()) throw new Error(`--${name} requires a value`)
      args[name] = value
    } else throw new Error(`Unknown option ${arg}`)
  }
  return args
}

const usage = {
  search: 'search [query | --query <text>] [--objective <text>]',
  extract: 'extract --urls <url1,url2> [--objective <text>] [--full-content] [--cached-only]',
  options: '--session-id <returned ID> --timeout-ms <1-600000> (default 120000, total deadline) --dry-run --offline --help',
  authentication: 'Anonymous when PARALLEL_API_KEY is unset; otherwise Bearer authentication. PARALLEL_DISABLED=1 disables network access.'
}

// SSE protocol lines end only at CR/LF, never at Unicode separators inside JSON.
async function readRpc(res, id) {
  const type = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase()
  if (type === 'application/json') return checkRpc(await res.json(), id)
  if (type !== 'text/event-stream') {
    await res.body?.cancel()
    throw new Error('Unsupported MCP response Content-Type')
  }
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = '', data = [], size = 0, afterCR = false
  function line(text) {
    if (text === '') {
      if (!data.length) return
      const event = JSON.parse(data.join('\n'))
      data = []
      if (event.id === id) return checkRpc(event, id)
    } else if (text.startsWith('data:')) data.push(text.slice(5).replace(/^ /, ''))
  }
  try {
    while (true) {
      const { value, done } = await reader.read()
      size += value?.byteLength || 0
      if (size > 16 * 1024 * 1024) throw new Error('MCP response exceeds 16 MiB')
      for (const char of decoder.decode(value, { stream: !done })) {
        if (afterCR) {
          afterCR = false
          if (char === '\n') continue
        }
        if (char === '\r' || char === '\n') {
          const result = line(buffer)
          buffer = ''
          afterCR = char === '\r'
          if (result !== undefined) return result
        } else buffer += char
      }
      if (done) throw new Error('MCP stream ended without a matching response')
    }
  } finally {
    // A complete RPC event is sufficient, even if the server keeps SSE open.
    await reader.cancel()
  }
}

function checkRpc(message, id) {
  if (message.jsonrpc !== '2.0' || message.id !== id) throw new Error('Mismatched MCP response')
  if (message.error) throw new Error(`MCP error ${message.error.code}: ${message.error.message}`)
  if (!Object.hasOwn(message, 'result') || message.result === undefined) throw new Error('Missing MCP result')
  return message.result
}

async function main() {
  const args = parseArgs(rawArgs)
  if (!rawArgs.length || args.help) { console.log(JSON.stringify({ usage }, null, 2)); return }
  const [command, ...rest] = args._
  if (!['search', 'extract'].includes(command)) throw new Error('Unknown command; use --help')
  const timeout = args['timeout-ms'] ?? '120000'
  if (!/^\d+$/.test(timeout) || !Number.isSafeInteger(Number(timeout)) || Number(timeout) < 1 || Number(timeout) > 600000) {
    throw new Error('--timeout-ms must be an integer from 1 to 600000')
  }
  if (key !== undefined && (!key.trim() || /\s/.test(key))) throw new Error('PARALLEL_API_KEY must be a nonempty token or unset for anonymous access')
  const disabled = process.env.PARALLEL_DISABLED
  if (disabled !== undefined && !['0', '1'].includes(disabled)) throw new Error('PARALLEL_DISABLED must be 0 or 1')
  let name, input
  if (command === 'search') {
    if (args.urls || args['full-content'] || args['cached-only']) throw new Error('Extract options require extract')
    if (args.query && rest.length) throw new Error('Use --query or a positional query')
    const query = args.query || rest.join(' ')
    if (!query.trim()) throw new Error('search requires a nonempty query')
    name = 'web_search'
    input = { objective: args.objective || query, search_queries: [query] }
  } else {
    if (args.query || rest.length) throw new Error('extract requires --urls')
    const urls = (args.urls || '').split(',').map(s => s.trim())
    if (!urls.length || urls.length > 20 || urls.some(s => {
      try { const u = new URL(s); return !['http:', 'https:'].includes(u.protocol) || !!u.username || !!u.password } catch { return true }
    })) throw new Error('--urls requires one to twenty HTTP(S) URLs without credentials')
    if (args.objective?.length > 200) throw new Error('extract --objective must be at most 200 characters')
    name = 'web_fetch'
    input = { urls }
    if (args.objective) input.objective = args.objective
    if (args['full-content']) input.full_content = true
    if (args['cached-only']) input.allow_live_fetch = false
  }
  if (args['session-id']) input.session_id = args['session-id']
  const headers = { 'User-Agent': USER_AGENT, 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' }
  if (key !== undefined) headers.Authorization = `Bearer ${key}`
  const params = { name, arguments: input }
  if (args['dry-run']) {
    console.log(JSON.stringify({ _dry_run: true, method: 'POST', url: ENDPOINT,
      headers: { ...headers, ...(key !== undefined ? { Authorization: 'Bearer ***' } : {}) },
      body: { jsonrpc: '2.0', id: 3, method: 'tools/call', params },
      setup: ['initialize', 'notifications/initialized', 'tools/list'], timeout_ms: Number(timeout) }, null, 2))
    return
  }
  if (disabled === '1' || args.offline) throw new Error('Parallel network access disabled')
  const signal = AbortSignal.timeout(Number(timeout))
  let session, protocol, nextId = 0
  async function request(method, rpcMethod, rpcParams, notification = false) {
    signal.throwIfAborted()
    const id = ++nextId
    const body = method === 'POST' ? { jsonrpc: '2.0', ...(!notification ? { id } : {}), method: rpcMethod, params: rpcParams } : undefined
    const res = await fetch(ENDPOINT, { method, signal, redirect: 'manual',
      headers: { ...headers, ...(session ? { 'Mcp-Session-Id': session } : {}), ...(protocol ? { 'MCP-Protocol-Version': protocol } : {}) },
      body: body ? JSON.stringify(body) : undefined })
    if (!res.ok) {
      await res.body?.cancel()
      throw new Error(`Parallel HTTP ${res.status}; no retry or anonymous fallback`)
    }
    if (rpcMethod === 'initialize') session = res.headers.get('mcp-session-id')
    if (notification || method === 'DELETE') { await res.body?.cancel(); return }
    return readRpc(res, id)
  }
  let failed = false
  try {
    const init = await request('POST', 'initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'marketingskills', version: '2.14.1' } })
    if (!['2025-03-26', '2025-06-18', '2025-11-25'].includes(init.protocolVersion)) throw new Error('Unsupported MCP protocol version')
    protocol = init.protocolVersion
    await request('POST', 'notifications/initialized', {}, true)
    let cursor, tool
    const seen = new Set()
    do {
      const listing = await request('POST', 'tools/list', cursor ? { cursor } : {})
      tool = listing.tools?.find(t => t.name === name)
      cursor = listing.nextCursor
      if (cursor && seen.has(cursor)) throw new Error('Repeated tools/list cursor')
      seen.add(cursor)
    } while (!tool && cursor)
    if (!tool) throw new Error(`MCP tool ${name} is unavailable`)
    const schema = tool.inputSchema
    if (schema?.type !== 'object' || Object.keys(input).some(k => !schema.properties?.[k]) ||
        (schema.required || []).some(k => !Object.hasOwn(input, k))) throw new Error(`Unsupported ${name} input schema`)
    const result = await request('POST', 'tools/call', params)
    if (result.isError || result.structuredContent?.errors?.length) process.exitCode = 1
    console.log(JSON.stringify(result, null, 2))
  } catch (err) {
    failed = true
    throw err
  } finally {
    if (session && !signal.aborted) {
      try { await request('DELETE') } catch (err) { if (!failed) throw err }
    }
  }
}

main().catch(err => {
  const message = key ? err.message.split(key).join('***') : err.message
  console.error(JSON.stringify({ error: message }))
  process.exitCode = 1
})
