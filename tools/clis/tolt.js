#!/usr/bin/env node

const rawArgs = process.argv.slice(2)
const API_KEY = process.env.TOLT_API_KEY
const BASE_URL = 'https://api.tolt.com/v1'

if ((!API_KEY) && rawArgs.length > 0) {
  console.error(JSON.stringify({ error: 'TOLT_API_KEY environment variable required' }))
  process.exit(1)
}

async function api(method, path, body) {
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { 'Authorization': '***', 'Content-Type': 'application/json' }, body: body || undefined }
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
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

const args = parseArgs(rawArgs)
const [cmd, sub, ...rest] = args._

function listParams() {
  const params = new URLSearchParams({ program_id: args['program-id'] })
  for (const [flag, field] of [['limit', 'limit'], ['starting-after', 'starting_after'], ['ending-before', 'ending_before']]) {
    if (args[flag]) params.set(field, args[flag])
  }
  return params
}

async function main() {
  let result
  const id = rest[0] || args.id
  switch (cmd) {
    case 'partners':
    case 'affiliates':
      switch (sub) {
        case 'list': {
          if (!args['program-id']) { result = { error: '--program-id required' }; break }
          const params = listParams()
          if (args.email) params.set('email', args.email)
          result = await api('GET', `/partners?${params}`)
          break
        }
        case 'get':
          if (!id) { result = { error: 'Partner ID required (positional arg or --id)' }; break }
          result = await api('GET', `/partners/${encodeURIComponent(id)}`)
          break
        case 'create': {
          if (!args.email || !args['first-name'] || !args['last-name'] || !args['program-id']) {
            result = { error: '--email, --first-name, --last-name, and --program-id required' }; break
          }
          const body = {
            first_name: args['first-name'], last_name: args['last-name'],
            email: args.email, program_id: args['program-id'],
          }
          result = await api('POST', '/partners', body)
          break
        }
        case 'update': {
          if (!id) { result = { error: '--id required (Tolt partner ID)' }; break }
          if (args['commission-rate'] !== undefined) {
            result = { error: '--commission-rate is not a documented partner update field; configure the program/group in the Tolt dashboard' }; break
          }
          const body = {}
          if (args['company-name']) body.company_name = args['company-name']
          if (args['payout-method']) body.payout_method = args['payout-method']
          if (args['paypal-email']) body.payout_details = { email: args['paypal-email'] }
          if (Object.keys(body).length === 0) { result = { error: 'Provide --company-name, --payout-method, or --paypal-email' }; break }
          result = await api('PUT', `/partners/${encodeURIComponent(id)}`, body)
          break
        }
        default:
          result = { error: 'Unknown partners subcommand. Use: list, get, create, update' }
      }
      break
    case 'customers':
    case 'referrals':
      switch (sub) {
        case 'list': {
          if (!args['program-id']) { result = { error: '--program-id required' }; break }
          const params = listParams()
          const partnerId = args['partner-id'] || args['affiliate-id']
          if (partnerId) params.set('partner_id', partnerId)
          result = await api('GET', `/customers?${params}`)
          break
        }
        case 'get':
          if (args['customer-id']) { result = { error: 'Use the Tolt customer record ID with --id; an external --customer-id is not a supported lookup' }; break }
          if (!id) { result = { error: '--id required (Tolt customer record ID)' }; break }
          result = await api('GET', `/customers/${encodeURIComponent(id)}`)
          break
        default:
          result = { error: 'Unknown customers subcommand. Use: list, get' }
      }
      break
    case 'commissions':
      if (sub !== 'list') { result = { error: 'Use: commissions list' }; break }
      if (!args['program-id']) { result = { error: '--program-id required' }; break }
      const params = listParams()
      const partnerId = args['partner-id'] || args['affiliate-id']
      if (partnerId) params.set('partner_id', partnerId)
      result = await api('GET', `/commissions?${params}`)
      break
    case 'payouts':
      result = { error: 'Payout history is not documented in the current public API; use the Tolt dashboard' }
      break
    default:
      result = {
        error: 'Unknown command',
        usage: {
          partners: 'partners (or affiliates) [list --program-id <id> | get <id> | create --email <email> --first-name <name> --last-name <name> --program-id <id> | update --id <id> [--company-name <name>] [--payout-method <method>] [--paypal-email <email>]]',
          customers: 'customers (or referrals) [list --program-id <id> [--partner-id <id>] | get --id <Tolt_customer_id>]',
          commissions: 'commissions list --program-id <id> [--partner-id <id>]',
          options: '--limit <n> --starting-after <id> --ending-before <id> --dry-run',
        }
      }
  }
  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
