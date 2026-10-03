const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/instantly.js')
function run(args, oracle = '', key = 'fixture-v2-token') {
  const code = `global.fetch = async (url, options) => {
    const assert = require('node:assert/strict'); const parsed = new URL(url);
    const body = options.body ? JSON.parse(options.body) : undefined;
    assert.equal(parsed.origin, 'https://api.instantly.ai');
    assert.equal(options.headers.Authorization, 'Bearer fixture-v2-token');
    assert.equal(parsed.searchParams.has('api_key'), false);
    assert.equal(body?.api_key, undefined);
    ${oracle}
    return new Response(JSON.stringify({accepted:true}), {status:200});
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', code], {encoding:'utf8', timeout:10000,
    env:{...process.env,INSTANTLY_API_KEY:key}})
}
function result(r) { assert.equal(r.status, 0, r.stderr); return JSON.parse(r.stdout) }
const operations = [
  [['campaigns','list','--limit','20','--starting-after','cursor'], 'GET', '/api/v2/campaigns', undefined, {limit:'20',starting_after:'cursor'}],
  [['campaigns','get','--id','campaign'], 'GET', '/api/v2/campaigns/campaign'],
  [['campaigns','status','--id','campaign'], 'GET', '/api/v2/campaigns/campaign'],
  [['campaigns','launch','--id','campaign'], 'POST', '/api/v2/campaigns/campaign/activate'],
  [['campaigns','pause','--id','campaign'], 'POST', '/api/v2/campaigns/campaign/pause'],
  [['leads','list','--campaign-id','campaign','--limit','30','--starting-after','lead-cursor'], 'POST', '/api/v2/leads/list', {campaign:'campaign',limit:30,starting_after:'lead-cursor'}],
  [['leads','add','--campaign-id','campaign','--email','jane@example.com','--first-name','Jane','--last-name','Doe','--company','Example'], 'POST', '/api/v2/leads', {campaign:'campaign',email:'jane@example.com',first_name:'Jane',last_name:'Doe',company_name:'Example'}],
  [['leads','delete','--id','lead'], 'DELETE', '/api/v2/leads/lead'],
  [['leads','status','--id','lead'], 'GET', '/api/v2/leads/lead'],
  [['accounts','list','--limit','20','--starting-after','cursor'], 'GET', '/api/v2/accounts', undefined, {limit:'20',starting_after:'cursor'}],
  [['accounts','status','--account-id','jane+sender@example.com'], 'GET', '/api/v2/accounts/jane%2Bsender%40example.com'],
  [['accounts','warmup-status','--account-id','jane@example.com'], 'POST', '/api/v2/accounts/warmup-analytics', {emails:['jane@example.com']}],
  [['analytics','campaign','--campaign-id','campaign','--start-date','2026-09-01','--end-date','2026-09-30'], 'GET', '/api/v2/campaigns/analytics', undefined, {id:'campaign',start_date:'2026-09-01',end_date:'2026-09-30'}],
  [['analytics','steps','--campaign-id','campaign'], 'GET', '/api/v2/campaigns/analytics/steps', undefined, {campaign_id:'campaign'}],
  [['analytics','account','--start-date','2026-09-01','--end-date','2026-09-30'], 'GET', '/api/v2/accounts/analytics/daily', undefined, {start_date:'2026-09-01',end_date:'2026-09-30'}],
  [['blocklist','list','--starting-after','cursor','--limit','10'], 'GET', '/api/v2/block-lists-entries', undefined, {starting_after:'cursor',limit:'10'}],
  [['blocklist','add','--entries',' example.com, spam@example.com '], 'POST', '/api/v2/block-lists-entries/bulk-create', {bl_values:['example.com','spam@example.com']}],
]
for (const [args,method,pathname,body,query = {}] of operations) {
  test(`v2 ${args[0]} ${args[1]} request contract`, () => {
    assert.equal(result(run(args, `assert.equal(options.method, ${JSON.stringify(method)});
      assert.equal(parsed.pathname, ${JSON.stringify(pathname)});
      assert.deepEqual(body, ${body === undefined ? 'undefined' : JSON.stringify(body)});
      assert.deepEqual(Object.fromEntries(parsed.searchParams), ${JSON.stringify(query)});`)).accepted, true)
  })
}
test('help needs no credentials and makes no request', () => {
  assert.ok(result(run([], "throw new Error('unexpected fetch')", '')).usage)
})
test('v2 preview masks bearer credentials and never sends', () => {
  const p = result(run(['leads','add','--campaign-id','campaign','--email','jane@example.com','--dry-run'], "throw new Error('unexpected fetch')"))
  assert.equal(p.url, 'https://api.instantly.ai/api/v2/leads')
  assert.equal(p.headers.Authorization, '***')
  assert.deepEqual(p.body, {campaign:'campaign',email:'jane@example.com'})
  assert.equal(JSON.stringify(p).includes('fixture-v2-token'), false)
})
for (const sub of ['status','delete']) {
  test(`legacy email ${sub} cannot become a bulk operation`, () => {
    assert.match(result(run(['leads',sub,'--campaign-id','campaign','--email','jane@example.com'], "throw new Error('unexpected fetch')")).error, /--id.*lead/i)
  })
}
for (const group of ['campaigns','accounts','leads']) {
  test(`${group} rejects offset pagination instead of silently replaying page one`, () => {
    const args = [group,'list','--skip','10']; if (group === 'leads') args.push('--campaign-id','campaign')
    assert.match(result(run(args, "throw new Error('unexpected fetch')")).error, /--starting-after/)
  })
}
test('missing v2 credentials fails only for an actual request', () => {
  const r = run(['campaigns','list'], "throw new Error('unexpected fetch')", '')
  assert.equal(r.status, 1); assert.match(r.stderr, /INSTANTLY_API_KEY/)
})
test('documented start/end aliases preserve analytics dates', () => {
  assert.equal(result(run(['analytics','account','--start','2026-09-01','--end','2026-09-30'], `assert.equal(parsed.pathname, '/api/v2/accounts/analytics/daily'); assert.equal(parsed.searchParams.get('start_date'), '2026-09-01'); assert.equal(parsed.searchParams.get('end_date'), '2026-09-30');`)).accepted, true)
})
