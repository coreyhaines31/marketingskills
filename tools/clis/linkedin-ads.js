#!/usr/bin/env node

const rawArgs = process.argv.slice(2)
const TOKEN = process.env.LINKEDIN_ACCESS_TOKEN
const BASE_URL = 'https://api.linkedin.com/rest'
const API_VERSION = process.env.LINKEDIN_API_VERSION || '202609'

if ((!TOKEN) && rawArgs.length > 0) {
  console.error(JSON.stringify({ error: 'LINKEDIN_ACCESS_TOKEN environment variable required' }))
  process.exit(1)
}

async function api(method, path, body, extraHeaders = {}) {
  const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'X-RestLi-Protocol-Version': '2.0.0',
    'Content-Type': 'application/json',
    'LinkedIn-Version': API_VERSION,
    ...extraHeaders,
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
  if (!text && res.ok) {
    const id = res.headers.get('x-restli-id')
    if (id) return { status: res.status, id }
  }
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

// Rest.li 2.0 encodes values and URN keys, keeping record/list delimiters structural.
function restli(value) {
  if (Array.isArray(value)) return `List(${value.map(restli).join(',')})`
  if (value && typeof value === 'object') {
    return `(${Object.entries(value).map(([key, item]) => `${encodeURIComponent(key)}:${restli(item)}`).join(',')})`
  }
  return encodeURIComponent(String(value)).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())
}

async function main() {
  let result

  switch (cmd) {
    case 'accounts':
      switch (sub) {
        case 'list':
          result = await api('GET', '/adAccounts?q=search')
          break
        default:
          result = { error: 'Unknown accounts subcommand. Use: list' }
      }
      break

    case 'campaigns':
      switch (sub) {
        case 'list': {
          if (!args['account-id']) { result = { error: '--account-id required' }; break }
          result = await api('GET', `/adAccounts/${args['account-id']}/adCampaigns?q=search`)
          break
        }
        case 'create': {
          if (!args['account-id'] || !args.name) { result = { error: '--account-id and --name required' }; break }
          if (!args['campaign-group-id']) { result = { error: '--campaign-group-id required' }; break }
          if (!args['locale-country'] || !args['locale-language'] || !args.targeting || !args['political-intent']) {
            result = { error: '--locale-country, --locale-language, --targeting, and --political-intent required' }; break
          }
          let targetingCriteria
          try { targetingCriteria = JSON.parse(args.targeting) } catch { result = { error: 'Invalid JSON for --targeting' }; break }
          if (!targetingCriteria || typeof targetingCriteria !== 'object' || Array.isArray(targetingCriteria)) {
            result = { error: '--targeting must be a JSON object' }; break
          }
          if (['SPONSORED_UPDATES', 'DYNAMIC'].includes(args.type || 'SPONSORED_UPDATES') && !args['associated-entity']) {
            result = { error: '--associated-entity required for Sponsored Content or Dynamic Ads' }; break
          }
          if (args.type === 'DYNAMIC' && !args['total-budget']) {
            result = { error: '--total-budget required for Dynamic Ads' }; break
          }
          if (args.type === 'DYNAMIC' && !['FOLLOW_COMPANY', 'JOBS', 'SPOTLIGHT'].includes(args.format)) {
            result = { error: '--format required for Dynamic Ads (FOLLOW_COMPANY, JOBS, or SPOTLIGHT)' }; break
          }
          const body = {
            locale: { country: args['locale-country'], language: args['locale-language'] },
            targetingCriteria,
            offsiteDeliveryEnabled: false,
            politicalIntent: args['political-intent'],
            account: `urn:li:sponsoredAccount:${args['account-id']}`,
            campaignGroup: `urn:li:sponsoredCampaignGroup:${args['campaign-group-id']}`,
            name: args.name,
            type: args.type || 'SPONSORED_UPDATES',
            costType: args['cost-type'] || 'CPC',
            unitCost: {
              amount: args['unit-cost'] || '5.00',
              currencyCode: args.currency || 'USD',
            },
            dailyBudget: {
              amount: args['daily-budget'] || '100.00',
              currencyCode: args.currency || 'USD',
            },
            status: 'PAUSED',
          }
          if (args.format) body.format = args.format
          if (args['associated-entity']) body.associatedEntity = args['associated-entity']
          if (args['total-budget']) body.totalBudget = { amount: args['total-budget'], currencyCode: args.currency || 'USD' }
          result = await api('POST', `/adAccounts/${args['account-id']}/adCampaigns`, body)
          break
        }
        case 'update': {
          if (!args['account-id'] || !args.id || !args.status) { result = { error: '--account-id, --id, and --status required' }; break }
          result = await api('POST', `/adAccounts/${args['account-id']}/adCampaigns/${args.id}`, {
            patch: {
              $set: {
                status: args.status,
              },
            },
          }, { 'X-RestLi-Method': 'PARTIAL_UPDATE' })
          break
        }
        case 'analytics': {
          if (!args.id) { result = { error: '--id required' }; break }
          if (!args['start-year'] || !args['start-month'] || !args['start-day'] || !args['end-year'] || !args['end-month'] || !args['end-day']) {
            result = { error: '--start-year, --start-month, --start-day, --end-year, --end-month, --end-day required' }
            break
          }
          const dateRange = {
            start: { year: args['start-year'], month: args['start-month'], day: args['start-day'] },
            end: { year: args['end-year'], month: args['end-month'], day: args['end-day'] },
          }
          result = await api('GET', `/adAnalytics?q=analytics&pivot=CAMPAIGN&timeGranularity=ALL&dateRange=${restli(dateRange)}&campaigns=${restli([`urn:li:sponsoredCampaign:${args.id}`])}&fields=impressions,clicks,costInLocalCurrency,externalWebsiteConversions`)
          break
        }
        default:
          result = { error: 'Unknown campaigns subcommand. Use: list, create, update, analytics' }
      }
      break

    case 'creatives':
      switch (sub) {
        case 'list': {
          if (!args['account-id'] || !args['campaign-id']) { result = { error: '--account-id and --campaign-id required' }; break }
          result = await api('GET', `/adAccounts/${args['account-id']}/creatives?q=criteria&campaigns=${restli([`urn:li:sponsoredCampaign:${args['campaign-id']}`])}`)
          break
        }
        default:
          result = { error: 'Unknown creatives subcommand. Use: list' }
      }
      break

    case 'audiences':
      switch (sub) {
        case 'count': {
          if (!args.targeting) { result = { error: '--targeting required (JSON string)' }; break }
          let targeting
          try {
            targeting = JSON.parse(args.targeting)
          } catch {
            result = { error: 'Invalid JSON for --targeting' }
            break
          }
          result = await api('GET', `/audienceCounts?q=targetingCriteriaV2&targetingCriteria=${restli(targeting)}`)
          break
        }
        default:
          result = { error: 'Unknown audiences subcommand. Use: count' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          accounts: 'accounts [list]',
          campaigns: 'campaigns [list|create|update|analytics] [--account-id <id>] [--name <name>] [--campaign-group-id <id>] [--type SPONSORED_UPDATES] [--format <format>] [--cost-type CPC] [--unit-cost 5.00] [--daily-budget 100.00] [--total-budget <amount>] [--currency USD] [--locale-country US] [--locale-language en] [--targeting <json>] [--political-intent POLITICAL|NOT_POLITICAL|NOT_DECLARED] [--associated-entity <urn>] [--id <id>] [--status ACTIVE|PAUSED]',
          creatives: 'creatives [list] --account-id <id> --campaign-id <id>',
          audiences: 'audiences [count] --targeting <json>',
        },
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
