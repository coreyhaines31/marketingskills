const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync, spawn } = require('node:child_process')
const http = require('node:http')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/parallel.js')
const env = { PATH: process.env.PATH }
const search = ['search', '--query', 'SaaS onboarding examples']
const schema = { type: 'object', properties: { objective: {}, search_queries: {}, urls: {}, full_content: {}, allow_live_fetch: {}, session_id: {} } }
// Synthetic responses, not retained provider captures.
function run(args, extra = {}, mode = 'ok') {
  const script = `let calls=[];global.fetch=async(url,options)=>{
    const b=options.body&&JSON.parse(options.body);calls.push({url,...options,signal:undefined,body:b});
    if(${JSON.stringify(mode)}==='none') throw new Error('Unexpected network');
    if(${JSON.stringify(mode)}==='http') return new Response('',{status:401});
    if(options.method==='DELETE'||!b.id) return new Response(null,{status:202});
    let result=b.method==='initialize'?{protocolVersion:'2025-03-26'}:
      b.method==='tools/list'?{tools:[{name:'web_search',inputSchema:${JSON.stringify(schema)}},{name:'web_fetch',inputSchema:${JSON.stringify(schema)}}]}:
      {content:[{type:'text',text:'Synthetic passage'}],calls};
    if(${JSON.stringify(mode)}==='tool-error' && b.method==='tools/call') result={isError:true,content:[{type:'text',text:'Synthetic tool failure'}]};
    return new Response(JSON.stringify({jsonrpc:'2.0',id:b.id,result}),{headers:{'Content-Type':'Application/JSON; charset=utf-8','Mcp-Session-Id':'synthetic-session'}});
  };process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)})`
  return spawnSync(process.execPath, ['-e', script], { env: { ...env, ...extra }, encoding: 'utf8', timeout: 5000 })
}
function output(r) { assert.equal(r.status, 0, r.stderr); return JSON.parse(r.stdout) }
test('help and dry runs do not touch the network or require credentials', () => {
  assert.ok(output(run([], {}, 'none')).usage)
  assert.ok(output(run(['--help'], { PARALLEL_API_KEY: '' }, 'none')).usage)
  const dry = output(run([...search, '--dry-run'], { PARALLEL_API_KEY: 'synthetic-secret' }, 'none'))
  assert.equal(dry._dry_run, true)
  assert.equal(dry.headers.Authorization, 'Bearer ***')
  assert.equal(dry.timeout_ms, 120000)
  assert.equal(JSON.stringify(dry).includes('synthetic-secret'), false)
  assert.equal(dry.body.params.name, 'web_search')
})
test('native search discovers tool and preserves output with consistent request headers', () => {
  const result = output(run([...search, '--session-id', 'prior-session']))
  assert.equal(result.content[0].text, 'Synthetic passage')
  assert.deepEqual(result.calls.map(c => c.body.method), ['initialize', 'notifications/initialized', 'tools/list', 'tools/call'])
  for (const c of result.calls) {
    assert.equal(c.headers['User-Agent'], 'marketingskills/parallel-cli')
    assert.equal(c.redirect, 'manual')
    assert.equal(c.headers.Authorization, undefined)
  }
  assert.deepEqual(result.calls[3].body.params.arguments, { objective: 'SaaS onboarding examples', search_queries: ['SaaS onboarding examples'], session_id: 'prior-session' })
})
test('explicit credential is used throughout and never retried anonymously', () => {
  const r = output(run(search, { PARALLEL_API_KEY: 'synthetic-key' }))
  for (const c of r.calls) assert.equal(c.headers.Authorization, 'Bearer synthetic-key')
  const failed = run(search, { PARALLEL_API_KEY: 'synthetic-key' }, 'http')
  assert.equal(failed.status, 1)
  assert.match(failed.stderr, /HTTP 401/)
  assert.doesNotMatch(failed.stderr, /synthetic-key/)
  assert.equal(run(search, {}, 'tool-error').status, 1)
})
test('extract maps supported options without silently broadening cached-only', () => {
  const r = output(run(['extract', '--urls', 'https://example.org/a,https://example.org/b', '--objective', 'Pricing', '--full-content', '--cached-only']))
  assert.deepEqual(r.calls[3].body.params, { name: 'web_fetch', arguments: { urls: ['https://example.org/a', 'https://example.org/b'], objective: 'Pricing', full_content: true, allow_live_fetch: false } })
})
test('invalid options, credentials, and opt-outs fail without network', () => {
  const invalid = [[], ['--timeout-ms'], ...['0', '-1', '1.5', '600001', 'Infinity', '1e3'].map(v => ['--timeout-ms', v])]
  for (const flags of invalid.slice(1)) {
    const r = run([...search, ...flags], {}, 'none'); assert.equal(r.status, 1); assert.match(r.stderr, /timeout-ms/)
  }
  for (const args of [['search'], [...search, '--typo'], [...search, '--query', 'again'], ['extract'], ['extract', '--urls', 'ftp://example.org'], ['extract', '--urls', 'https://user:pass@example.org'], ['extract', '--urls', 'https://example.org', '--objective', 'x'.repeat(201)], [...search, '--cached-only']]) {
    const r = run(args, {}, 'none'); assert.equal(r.status, 1); assert.doesNotMatch(r.stderr, /Unexpected network/)
  }
  for (const extra of [{ PARALLEL_API_KEY: '' }, { PARALLEL_API_KEY: ' ' }, { PARALLEL_API_KEY: 'bad\nkey' }, { PARALLEL_DISABLED: '1' }, { PARALLEL_DISABLED: 'yes' }]) {
    const r = run(search, extra, 'none'); assert.equal(r.status, 1); assert.doesNotMatch(r.stderr, /Unexpected network/)
  }
  const r = run([...search, '--offline'], {}, 'none'); assert.equal(r.status, 1); assert.match(r.stderr, /disabled/)
})

async function local(mode, args = search) {
  const calls = [], sockets = new Set(), timers = new Set()
  const server = http.createServer(async (req, res) => {
    let raw = ''; for await (const chunk of req) raw += chunk
    const b = raw && JSON.parse(raw)
    calls.push({ method: req.method, rpc: b?.method, headers: req.headers })
    const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.add(t) }
    if (mode === 'headers') return
    if (req.method === 'DELETE' || !b.id) { res.writeHead(202); res.end(); return }
    if (mode === 'redirect') { res.writeHead(307, { Location: 'http://127.0.0.1:1/never' }); res.end(); return }
    let result = b.method === 'initialize' ? { protocolVersion: '2025-03-26' } : b.method === 'tools/list' ? { tools: [{ name: 'web_search', inputSchema: schema }] } : { content: [{ type: 'text', text: 'Synthetic café\u2028line\u2029end' }] }
    if (mode === 'schema' && b.method === 'tools/list') result.tools[0].inputSchema = { ...schema, required: ['new_required_argument'] }
    if (mode === 'missing' && b.method === 'tools/list') result.tools = []
    if (mode === 'body') { res.writeHead(200, { 'Content-Type': 'text/event-stream' }); res.write('data: {'); return }
    const message = mode === 'rpc-error' && b.method === 'tools/call' ? { jsonrpc: '2.0', id: b.id, error: { code: -32000, message: 'Synthetic RPC failure' } } : { jsonrpc: '2.0', id: b.id, result }
    const send = () => {
      res.writeHead(200, { 'Content-Type': 'Text/Event-Stream; charset=utf-8', 'Mcp-Session-Id': 'synthetic' })
      // Notification, unrelated ID, CRLF across chunks, UTF-8 across chunks. Keep response OPEN.
      let bytes = Buffer.from(': comment\r\ndata: {"jsonrpc":"2.0","method":"notifications/progress"}\r\n\r\ndata: {"jsonrpc":"2.0","id":999,"result":{}}\r\n\r\ndata: ' + JSON.stringify(message) + '\r\n\r\n')
      if (mode === 'cr') bytes = Buffer.from(bytes.toString().replace(/\r\n/g, '\r'))
      if (mode === 'lf') bytes = Buffer.from(bytes.toString().replace(/\r\n/g, '\n'))
      if (mode === 'chunks') {
        let i = 0
        const next = () => { if (!res.destroyed && i < bytes.length) { res.write(bytes.subarray(i, ++i)); later(next, 1) } }
        next()
      } else res.write(bytes)
    }
    if (mode === 'total') later(send, 90)
    else send()
  })
  server.on('connection', s => { sockets.add(s); s.on('close', () => sockets.delete(s)) })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const script = `const native=fetch;global.fetch=(url,options)=>native('http://127.0.0.1:${server.address().port}/mcp',options);process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)})`
  try {
    const r = await new Promise(resolve => {
      const p = spawn(process.execPath, ['-e', script], { env }); let stdout = '', stderr = ''
      p.stdout.on('data', v => stdout += v); p.stderr.on('data', v => stderr += v)
      const timer = setTimeout(() => p.kill(), 7000)
      p.on('close', (code, signal) => { clearTimeout(timer); resolve({ code, signal, stdout, stderr }) })
    })
    return { ...r, calls }
  } finally {
    for (const t of timers) clearTimeout(t)
    for (const s of sockets) s.destroy()
    await new Promise(resolve => server.close(resolve))
  }
}
test('real HTTP fixture stays open after each matching event; client finishes and tears down', async () => {
  const r = await local('open')
  assert.equal(r.code, 0, JSON.stringify(r)); assert.equal(r.signal, null)
  assert.equal(JSON.parse(r.stdout).content[0].text, 'Synthetic café\u2028line\u2029end')
  assert.deepEqual(r.calls.map(c => c.rpc || c.method), ['initialize', 'notifications/initialized', 'tools/list', 'tools/call', 'DELETE'])
  for (const c of r.calls) assert.equal(c.headers['user-agent'], 'marketingskills/parallel-cli')
})
test('SSE preserves CRLF and UTF-8 across single-byte HTTP chunks', async () => {
  const r = await local('chunks'); assert.equal(r.code, 0, r.stderr)
  assert.equal(JSON.parse(r.stdout).content[0].text, 'Synthetic café\u2028line\u2029end')
})
test('matching RPC errors also close an open SSE response', async () => {
  const r = await local('rpc-error'); assert.equal(r.code, 1); assert.equal(r.signal, null); assert.match(r.stderr, /Synthetic RPC failure/)
  assert.equal(r.calls.at(-1).method, 'DELETE')
})
test('deadline covers stalled headers, body, and aggregate RPC time', async () => {
  for (const mode of ['headers', 'body', 'total']) {
    const r = await local(mode, [...search, '--timeout-ms', '200'])
    assert.equal(r.code, 1, JSON.stringify(r)); assert.equal(r.signal, null); assert.match(r.stderr, /timeout|abort/i)
    if (mode === 'total') assert.ok(r.calls.length < 5)
  }
})
test('redirects are refused and unavailable or incompatible tools are not called', async () => {
  for (const mode of ['redirect', 'schema', 'missing']) {
    const r = await local(mode); assert.equal(r.code, 1)
    assert.equal(r.calls.some(c => c.rpc === 'tools/call'), false)
    if (mode === 'redirect') { assert.equal(r.calls.length, 1); assert.match(r.stderr, /HTTP 307/) }
  }
})

test('SSE accepts CR-only and LF-only protocol lines', async () => {
  for (const mode of ['cr', 'lf']) {
    const r = await local(mode); assert.equal(r.code, 0, r.stderr)
    assert.equal(JSON.parse(r.stdout).content[0].text, 'Synthetic café\u2028line\u2029end')
  }
})
