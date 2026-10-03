#!/usr/bin/env node

const API_KEY = process.env.INSTANTLY_API_KEY
const BASE_URL = 'https://api.instantly.ai/api/v2'

async function api(method, path, body) {
  const url = `${BASE_URL}${path}`
  if (args['dry-run']) {
    return { _dry_run: true, method, url, headers: { Authorization: '***', 'Content-Type': 'application/json', Accept: 'application/json' }, body }
  }
  if (!API_KEY) throw new Error('INSTANTLY_API_KEY environment variable required (use an API v2 key)')
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  try { return JSON.parse(text) } catch { return { status: res.status, body: text } }
}

function parseArgs(argv) {
  const result = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = argv[i + 1]
      if (next && !next.startsWith('--')) { result[key] = next; i++ }
      else result[key] = true
    } else result._.push(arg)
  }
  return result
}
const args = parseArgs(process.argv.slice(2))
const [cmd, sub] = args._

function pagination() {
  const params = new URLSearchParams()
  if (args.limit) params.set('limit', args.limit)
  if (args['starting-after']) params.set('starting_after', args['starting-after'])
  return params.toString() ? `?${params}` : ''
}
function dates(params) {
  const start = args['start-date'] || args.start
  const end = args['end-date'] || args.end
  if (start) params.set('start_date', start)
  if (end) params.set('end_date', end)
  return params
}

async function main() {
  let result
  if (args.skip !== undefined && sub === 'list') {
    result = { error: 'API v2 uses cursor pagination; replace --skip with --starting-after <next_starting_after>' }
  } else switch (cmd) {
    case 'campaigns':
      switch (sub) {
        case 'list': result = await api('GET', `/campaigns${pagination()}`); break
        case 'get':
        case 'status':
        case 'launch':
        case 'pause': {
          if (!args.id) { result = { error: '--id required' }; break }
          const action = sub === 'launch' ? '/activate' : sub === 'pause' ? '/pause' : ''
          result = await api(action ? 'POST' : 'GET', `/campaigns/${encodeURIComponent(args.id)}${action}`)
          break
        }
        default: result = { error: 'Unknown campaigns subcommand. Use: list, get, status, launch, pause' }
      }
      break
    case 'leads':
      switch (sub) {
        case 'list': {
          if (!args['campaign-id']) { result = { error: '--campaign-id required' }; break }
          const body = { campaign: args['campaign-id'] }
          if (args.limit) body.limit = Number(args.limit)
          if (args['starting-after']) body.starting_after = args['starting-after']
          result = await api('POST', '/leads/list', body)
          break
        }
        case 'add': {
          if (!args['campaign-id']) { result = { error: '--campaign-id required' }; break }
          if (!args.email) { result = { error: '--email required' }; break }
          const body = { campaign: args['campaign-id'], email: args.email }
          if (args['first-name']) body.first_name = args['first-name']
          if (args['last-name']) body.last_name = args['last-name']
          if (args.company) body.company_name = args.company
          result = await api('POST', '/leads', body)
          break
        }
        case 'delete':
        case 'status': {
          if (!args.id) { result = { error: '--id required: use the lead ID returned by leads list (API v2 no longer accepts campaign/email for this command)' }; break }
          result = await api(sub === 'delete' ? 'DELETE' : 'GET', `/leads/${encodeURIComponent(args.id)}`)
          break
        }
        default: result = { error: 'Unknown leads subcommand. Use: list, add, delete, status' }
      }
      break
    case 'accounts':
      switch (sub) {
        case 'list': result = await api('GET', `/accounts${pagination()}`); break
        case 'status':
        case 'warmup-status': {
          if (!args['account-id']) { result = { error: '--account-id required' }; break }
          result = sub === 'status'
            ? await api('GET', `/accounts/${encodeURIComponent(args['account-id'])}`)
            : await api('POST', '/accounts/warmup-analytics', { emails: [args['account-id']] })
          break
        }
        default: result = { error: 'Unknown accounts subcommand. Use: list, status, warmup-status' }
      }
      break
    case 'analytics':
      switch (sub) {
        case 'campaign':
        case 'steps': {
          if (!args['campaign-id']) { result = { error: '--campaign-id required' }; break }
          const params = dates(new URLSearchParams({ [sub === 'campaign' ? 'id' : 'campaign_id']: args['campaign-id'] }))
          result = await api('GET', `/campaigns/analytics${sub === 'steps' ? '/steps' : ''}?${params}`)
          break
        }
        case 'account': {
          if (!(args['start-date'] || args.start)) { result = { error: '--start-date required' }; break }
          if (!(args['end-date'] || args.end)) { result = { error: '--end-date required' }; break }
          result = await api('GET', `/accounts/analytics/daily?${dates(new URLSearchParams())}`)
          break
        }
        default: result = { error: 'Unknown analytics subcommand. Use: campaign, steps, account' }
      }
      break
    case 'blocklist':
      switch (sub) {
        case 'list': result = await api('GET', `/block-lists-entries${pagination()}`); break
        case 'add': {
          if (!args.entries) { result = { error: '--entries required (comma-separated emails or domains)' }; break }
          result = await api('POST', '/block-lists-entries/bulk-create', { bl_values: args.entries.split(',').map(e => e.trim()) })
          break
        }
        default: result = { error: 'Unknown blocklist subcommand. Use: list, add' }
      }
      break
    default:
      result = { error: 'Unknown command', usage: {
        campaigns: {
          list: 'campaigns list [--limit <n>] [--starting-after <cursor>]',
          get: 'campaigns get --id <id>', status: 'campaigns status --id <id>',
          launch: 'campaigns launch --id <id>', pause: 'campaigns pause --id <id>',
        },
        leads: {
          list: 'leads list --campaign-id <id> [--limit <n>] [--starting-after <cursor>]',
          add: 'leads add --campaign-id <id> --email <email> [--first-name <name>] [--last-name <name>] [--company <name>]',
          delete: 'leads delete --id <lead-id>', status: 'leads status --id <lead-id>',
        },
        accounts: {
          list: 'accounts list [--limit <n>] [--starting-after <cursor>]',
          status: 'accounts status --account-id <email>', 'warmup-status': 'accounts warmup-status --account-id <email>',
        },
        analytics: {
          campaign: 'analytics campaign --campaign-id <id> [--start-date YYYY-MM-DD] [--end-date YYYY-MM-DD]',
          steps: 'analytics steps --campaign-id <id> [--start-date YYYY-MM-DD] [--end-date YYYY-MM-DD]',
          account: 'analytics account --start-date YYYY-MM-DD --end-date YYYY-MM-DD',
        },
        blocklist: { list: 'blocklist list [--limit <n>] [--starting-after <cursor>]', add: 'blocklist add --entries <email-or-domain,email-or-domain>' },
        options: '--dry-run (show request without executing)',
      } }
  }
  console.log(JSON.stringify(result, null, 2))
}
main().catch(err => { console.error(JSON.stringify({ error: err.message })); process.exit(1) })
