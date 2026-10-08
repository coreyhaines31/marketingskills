#!/usr/bin/env node

// Instantly API v2 (v1 was deprecated on 2026-01-19).
// Docs: https://developer.instantly.ai/api-reference/introduction

const rawArgs = process.argv.slice(2)
const API_KEY = process.env.INSTANTLY_API_KEY
const BASE_URL = 'https://api.instantly.ai/api/v2'

if ((!API_KEY) && rawArgs.length > 0) {
  console.error(JSON.stringify({ error: 'INSTANTLY_API_KEY environment variable required' }))
  process.exit(1)
}

const INTEREST_STATUSES = {
  'out-of-office': 0,
  interested: 1,
  'meeting-booked': 2,
  'meeting-completed': 3,
  won: 4,
  'not-interested': -1,
  'wrong-person': -2,
  lost: -3,
  'no-show': -4,
}

async function api(method, path, body) {
  const url = `${BASE_URL}${path}`
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' }
  if (args['dry-run']) {
    return { _dry_run: true, method, url, headers: { ...headers, Authorization: 'Bearer ***' }, body: body || undefined }
  }
  const res = await fetch(url, {
    method,
    headers: { ...headers, Authorization: `Bearer ${API_KEY}` },
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

function query(map) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(map)) {
    if (value !== undefined && value !== true && value !== '') params.set(key, value)
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

function list(value) {
  return String(value).split(',').map(v => v.trim()).filter(Boolean)
}

function target() {
  if (args['campaign-id'] && args['list-id']) return { error: 'Use --campaign-id or --list-id, not both' }
  if (args['campaign-id']) return { campaign_id: args['campaign-id'] }
  if (args['list-id']) return { list_id: args['list-id'] }
  return { error: '--campaign-id or --list-id required' }
}

const args = parseArgs(rawArgs)
const [cmd, sub] = args._

async function main() {
  let result

  switch (cmd) {
    case 'campaigns':
      switch (sub) {
        case 'list':
          result = await api('GET', `/campaigns${query({ limit: args.limit, starting_after: args['starting-after'], search: args.search, status: args.status })}`)
          break
        case 'get':
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/campaigns/${encodeURIComponent(args.id)}`)
          break
        case 'activate':
        case 'launch':
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('POST', `/campaigns/${encodeURIComponent(args.id)}/activate`)
          break
        case 'pause':
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('POST', `/campaigns/${encodeURIComponent(args.id)}/pause`)
          break
        case 'sending-status':
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('GET', `/campaigns/${encodeURIComponent(args.id)}/sending-status`)
          break
        default:
          result = { error: 'Unknown campaigns subcommand. Use: list, get, activate, pause, sending-status' }
      }
      break

    case 'leads':
      switch (sub) {
        case 'list': {
          const body = {}
          if (args['campaign-id']) body.campaign = args['campaign-id']
          if (args['list-id']) body.list_id = args['list-id']
          if (args.search) body.search = args.search
          if (args.limit) body.limit = Number(args.limit)
          if (args['starting-after']) body.starting_after = args['starting-after']
          result = await api('POST', '/leads/list', body)
          break
        }
        case 'add': {
          if (!args.email) { result = { error: '--email required' }; break }
          const dest = target()
          if (dest.error) { result = dest; break }
          const body = { email: args.email }
          if (dest.campaign_id) body.campaign = dest.campaign_id
          if (dest.list_id) body.list_id = dest.list_id
          if (args['first-name']) body.first_name = args['first-name']
          if (args['last-name']) body.last_name = args['last-name']
          if (args.company) body.company_name = args.company
          if (args['job-title']) body.job_title = args['job-title']
          if (args.website) body.website = args.website
          if (args.personalization) body.personalization = args.personalization
          if (args['skip-if-in-workspace']) body.skip_if_in_workspace = true
          result = await api('POST', '/leads', body)
          break
        }
        case 'bulk-add': {
          const dest = target()
          if (dest.error) { result = dest; break }
          if (!args.file) { result = { error: '--file required (JSON array of lead objects, max 1000)' }; break }
          let leads
          try {
            leads = JSON.parse(require('node:fs').readFileSync(args.file, 'utf8'))
          } catch (e) {
            result = { error: `Could not read --file as JSON: ${e.message}` }; break
          }
          if (!Array.isArray(leads) || leads.length === 0 || leads.length > 1000) {
            result = { error: '--file must contain a JSON array of 1 to 1000 leads' }; break
          }
          const body = { ...dest, leads }
          if (args['skip-if-in-workspace']) body.skip_if_in_workspace = true
          if (args['verify-on-import']) body.verify_leads_on_import = true
          result = await api('POST', '/leads/add', body)
          break
        }
        case 'delete':
          if (!args.id) { result = { error: '--id required (lead ID; find it with leads list)' }; break }
          result = await api('DELETE', `/leads/${encodeURIComponent(args.id)}`)
          break
        case 'interest': {
          if (!args.email) { result = { error: '--email required' }; break }
          if (args.status === undefined || args.status === true) {
            result = { error: `--status required. Use one of: ${Object.keys(INTEREST_STATUSES).join(', ')}` }; break
          }
          const value = INTEREST_STATUSES[args.status]
          if (value === undefined) {
            result = { error: `Unknown --status. Use one of: ${Object.keys(INTEREST_STATUSES).join(', ')}` }; break
          }
          const body = { lead_email: args.email, interest_value: value }
          if (args['campaign-id']) body.campaign_id = args['campaign-id']
          result = await api('POST', '/leads/update-interest-status', body)
          break
        }
        default:
          result = { error: 'Unknown leads subcommand. Use: list, add, bulk-add, delete, interest' }
      }
      break

    case 'accounts':
      switch (sub) {
        case 'list':
          result = await api('GET', `/accounts${query({ limit: args.limit, starting_after: args['starting-after'], search: args.search })}`)
          break
        case 'get':
          if (!args.email) { result = { error: '--email required' }; break }
          result = await api('GET', `/accounts/${encodeURIComponent(args.email)}`)
          break
        case 'warmup-analytics':
          if (!args.emails) { result = { error: '--emails required (comma-separated sending accounts)' }; break }
          result = await api('POST', '/accounts/warmup-analytics', { emails: list(args.emails) })
          break
        default:
          result = { error: 'Unknown accounts subcommand. Use: list, get, warmup-analytics' }
      }
      break

    case 'analytics':
      switch (sub) {
        case 'campaign':
          result = await api('GET', `/campaigns/analytics${query({ id: args['campaign-id'], start_date: args['start-date'], end_date: args['end-date'] })}`)
          break
        case 'overview':
          result = await api('GET', `/campaigns/analytics/overview${query({ id: args['campaign-id'], start_date: args['start-date'], end_date: args['end-date'] })}`)
          break
        case 'steps':
          if (!args['campaign-id']) { result = { error: '--campaign-id required' }; break }
          result = await api('GET', `/campaigns/analytics/steps${query({ campaign_id: args['campaign-id'], start_date: args['start-date'], end_date: args['end-date'] })}`)
          break
        default:
          result = { error: 'Unknown analytics subcommand. Use: campaign, overview, steps' }
      }
      break

    case 'emails':
      switch (sub) {
        case 'replies':
          result = await api('GET', `/emails${query({ email_type: 'received', campaign_id: args['campaign-id'], is_unread: args.unread ? 'true' : undefined, limit: args.limit, starting_after: args['starting-after'] })}`)
          break
        case 'unread-count':
          result = await api('GET', '/emails/unread/count')
          break
        default:
          result = { error: 'Unknown emails subcommand. Use: replies, unread-count' }
      }
      break

    case 'blocklist':
      switch (sub) {
        case 'list':
          result = await api('GET', `/block-lists-entries${query({ limit: args.limit, starting_after: args['starting-after'], search: args.search })}`)
          break
        case 'add': {
          if (!args.entries) { result = { error: '--entries required (comma-separated emails or domains)' }; break }
          const values = list(args.entries)
          if (values.length > 1000) { result = { error: 'At most 1000 entries per call' }; break }
          result = await api('POST', '/block-lists-entries/bulk-create', { bl_values: values })
          break
        }
        default:
          result = { error: 'Unknown blocklist subcommand. Use: list, add' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          campaigns: {
            list: 'campaigns list [--limit <n>] [--starting-after <cursor>] [--search <text>] [--status <n>]',
            get: 'campaigns get --id <id>',
            activate: 'campaigns activate --id <id>',
            pause: 'campaigns pause --id <id>',
            'sending-status': 'campaigns sending-status --id <id>',
          },
          leads: {
            list: 'leads list [--campaign-id <id> | --list-id <id>] [--search <text>] [--limit <n>] [--starting-after <cursor>]',
            add: 'leads add --campaign-id <id> | --list-id <id> --email <email> [--first-name] [--last-name] [--company] [--job-title] [--website] [--personalization] [--skip-if-in-workspace]',
            'bulk-add': 'leads bulk-add --campaign-id <id> | --list-id <id> --file leads.json [--skip-if-in-workspace] [--verify-on-import]',
            delete: 'leads delete --id <lead-id>',
            interest: `leads interest --email <email> --status <${Object.keys(INTEREST_STATUSES).join('|')}> [--campaign-id <id>]`,
          },
          accounts: {
            list: 'accounts list [--limit <n>] [--starting-after <cursor>] [--search <text>]',
            get: 'accounts get --email <sending-account>',
            'warmup-analytics': 'accounts warmup-analytics --emails <a@x.com,b@x.com>',
          },
          analytics: {
            campaign: 'analytics campaign [--campaign-id <id>] [--start-date YYYY-MM-DD] [--end-date YYYY-MM-DD]',
            overview: 'analytics overview [--campaign-id <id>] [--start-date YYYY-MM-DD] [--end-date YYYY-MM-DD]',
            steps: 'analytics steps --campaign-id <id> [--start-date YYYY-MM-DD] [--end-date YYYY-MM-DD]',
          },
          emails: {
            replies: 'emails replies [--campaign-id <id>] [--unread] [--limit <n>] [--starting-after <cursor>]',
            'unread-count': 'emails unread-count',
          },
          blocklist: {
            list: 'blocklist list [--search <text>] [--limit <n>]',
            add: 'blocklist add --entries <email-or-domain,email-or-domain>',
          },
          options: '--dry-run (show request without executing)',
        }
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
