#!/usr/bin/env node

const rawArgs = process.argv.slice(2)
const TOKEN = process.env.GOOGLE_ADS_TOKEN
const DEV_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
const CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID
const LOGIN_CUSTOMER_ID = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.replace(/-/g, '')
const BASE_URL = 'https://googleads.googleapis.com/v24'

if ((!TOKEN || !CUSTOMER_ID) && rawArgs.length > 0) {
  console.error(JSON.stringify({ error: 'GOOGLE_ADS_TOKEN and GOOGLE_ADS_CUSTOMER_ID environment variables required' }))
  process.exit(1)
}

async function api(method, path, body) {
  const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  }
  if (DEV_TOKEN) headers['developer-token'] = DEV_TOKEN
  if (LOGIN_CUSTOMER_ID) headers['login-customer-id'] = LOGIN_CUSTOMER_ID
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { ...headers, Authorization: '***', ...(DEV_TOKEN ? { 'developer-token': '***' } : {}) }, body: body || undefined }
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

async function gaql(query) {
  return api('POST', `/customers/${CUSTOMER_ID}/googleAds:searchStream`, { query })
}

const BOOLEAN_FLAGS = ['dry-run']

function parseArgs(args) {
  const result = { _: [] }
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = args[i + 1]
      if (!BOOLEAN_FLAGS.includes(key) && next && !next.startsWith('--')) {
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

// Computed ranges use this machine's calendar date; Google evaluates them in the account's time zone.
function dateFilter(days) {
  const d = days === undefined ? 30 : typeof days === 'string' ? Number(days) : NaN
  if (!Number.isInteger(d) || d < 1 || d > 3650) throw new Error('--days must be a whole number from 1 to 3650')
  if ([7, 14, 30].includes(d)) return `segments.date DURING LAST_${d}_DAYS`
  const pad = (n) => String(n).padStart(2, '0')
  const fmt = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  const end = new Date()
  end.setDate(end.getDate() - 1)
  const start = new Date(end)
  start.setDate(start.getDate() - (d - 1))
  return `segments.date BETWEEN '${fmt(start)}' AND '${fmt(end)}'`
}

async function main() {
  let result

  switch (cmd) {
    case 'query':
      if (sub !== 'run') throw new Error('Unknown query subcommand. Use: run')
      if (typeof args.query !== 'string' || !args.query.trim()) throw new Error('--query requires a non-empty GAQL query')
      result = await gaql(args.query)
      break

    case 'account':
      switch (sub) {
        case 'info':
        default:
          result = await gaql('SELECT customer.id, customer.descriptive_name FROM customer')
      }
      break

    case 'campaigns':
      switch (sub) {
        case 'list':
          result = await gaql('SELECT campaign.id, campaign.name, campaign.status, campaign_budget.amount_micros FROM campaign ORDER BY campaign.id')
          break
        case 'performance': {
          const dateWhere = dateFilter(args.days)
          result = await gaql(`SELECT campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM campaign WHERE ${dateWhere}`)
          break
        }
        case 'pause': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('POST', `/customers/${CUSTOMER_ID}/campaigns:mutate`, {
            operations: [{
              update: {
                resourceName: `customers/${CUSTOMER_ID}/campaigns/${args.id}`,
                status: 'PAUSED',
              },
              updateMask: 'status',
            }],
          })
          break
        }
        case 'enable': {
          if (!args.id) { result = { error: '--id required' }; break }
          result = await api('POST', `/customers/${CUSTOMER_ID}/campaigns:mutate`, {
            operations: [{
              update: {
                resourceName: `customers/${CUSTOMER_ID}/campaigns/${args.id}`,
                status: 'ENABLED',
              },
              updateMask: 'status',
            }],
          })
          break
        }
        default:
          result = { error: 'Unknown campaigns subcommand. Use: list, performance, pause, enable' }
      }
      break

    case 'adgroups':
      switch (sub) {
        case 'performance': {
          const dateWhere = dateFilter(args.days)
          const limit = args.limit ? ` LIMIT ${args.limit}` : ''
          result = await gaql(`SELECT ad_group.name, metrics.impressions, metrics.clicks, metrics.conversions FROM ad_group WHERE ${dateWhere}${limit}`)
          break
        }
        default:
          result = { error: 'Unknown adgroups subcommand. Use: performance' }
      }
      break

    case 'keywords':
      switch (sub) {
        case 'performance': {
          const dateWhere = dateFilter(args.days)
          const limit = args.limit || '50'
          result = await gaql(`SELECT ad_group_criterion.keyword.text, metrics.impressions, metrics.clicks, metrics.average_cpc FROM keyword_view WHERE ${dateWhere} ORDER BY metrics.clicks DESC LIMIT ${limit}`)
          break
        }
        default:
          result = { error: 'Unknown keywords subcommand. Use: performance' }
      }
      break

    case 'budgets':
      switch (sub) {
        case 'update': {
          if (!args.id || !args.amount) { result = { error: '--id and --amount required' }; break }
          const amountMicros = String(Math.round(parseFloat(args.amount) * 1000000))
          result = await api('POST', `/customers/${CUSTOMER_ID}/campaignBudgets:mutate`, {
            operations: [{
              update: {
                resourceName: `customers/${CUSTOMER_ID}/campaignBudgets/${args.id}`,
                amount_micros: amountMicros,
              },
              updateMask: 'amount_micros',
            }],
          })
          break
        }
        default:
          result = { error: 'Unknown budgets subcommand. Use: update' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          query: 'query run --query <GAQL> [--dry-run]',
          account: 'account [info]',
          campaigns: 'campaigns [list|performance|pause|enable] [--days 30] [--id <id>]',
          adgroups: 'adgroups [performance] [--days 30] [--limit <n>]',
          keywords: 'keywords [performance] [--days 30] [--limit 50]',
          budgets: 'budgets [update] --id <budget_id> --amount <dollars>',
        },
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
