#!/usr/bin/env node

// LinkedIn Marketing API, versioned REST endpoints (https://api.linkedin.com/rest).
// Every call sends a Linkedin-Version header (YYYYMM); each version is supported for at least a year.
// Docs: https://learn.microsoft.com/en-us/linkedin/marketing/versioning

const rawArgs = process.argv.slice(2)
const TOKEN = process.env.LINKEDIN_ACCESS_TOKEN
const VERSION = process.env.LINKEDIN_API_VERSION || '202609'
const BASE_URL = 'https://api.linkedin.com/rest'

if ((!TOKEN) && rawArgs.length > 0) {
  console.error(JSON.stringify({ error: 'LINKEDIN_ACCESS_TOKEN environment variable required' }))
  process.exit(1)
}

async function api(method, path, body, extraHeaders = {}) {
  const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Linkedin-Version': VERSION,
    'X-Restli-Protocol-Version': '2.0.0',
    'Content-Type': 'application/json',
    ...extraHeaders,
  }
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { ...headers, Authorization: 'Bearer ***' }, body: body || undefined }
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!text) return { status: res.status }
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

// Rest.li 2.0 requires URNs inside query parameters to be URL-encoded.
const urn = (type, id) => encodeURIComponent(`urn:li:${type}:${id}`)

function parseDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value))
  return m ? { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) } : null
}

function dateRange() {
  let start = args.start ? parseDate(args.start) : null
  let end = args.end ? parseDate(args.end) : null
  if (!start && args['start-year']) {
    start = { year: Number(args['start-year']), month: Number(args['start-month']), day: Number(args['start-day']) }
  }
  if (!end && args['end-year']) {
    end = { year: Number(args['end-year']), month: Number(args['end-month']), day: Number(args['end-day']) }
  }
  if (!start || [start.year, start.month, start.day].some(Number.isNaN)) return null
  const part = d => `(year:${d.year},month:${d.month},day:${d.day})`
  return end ? `(start:${part(start)},end:${part(end)})` : `(start:${part(start)})`
}

const args = parseArgs(rawArgs)
const [cmd, sub] = args._

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
          const search = args.status ? `&search=(status:(values:List(${args.status})))` : ''
          result = await api('GET', `/adAccounts/${encodeURIComponent(args['account-id'])}/adCampaigns?q=search${search}`)
          break
        }
        case 'create': {
          if (!args['account-id'] || !args.name) { result = { error: '--account-id and --name required' }; break }
          if (!args['campaign-group-id']) { result = { error: '--campaign-group-id required' }; break }
          const body = {
            account: `urn:li:sponsoredAccount:${args['account-id']}`,
            campaignGroup: `urn:li:sponsoredCampaignGroup:${args['campaign-group-id']}`,
            name: args.name,
            type: args.type || 'SPONSORED_UPDATES',
            costType: args['cost-type'] || 'CPC',
            unitCost: { amount: String(args['unit-cost'] || '5.00'), currencyCode: 'USD' },
            dailyBudget: { amount: String(args['daily-budget'] || '100.00'), currencyCode: 'USD' },
            status: 'PAUSED',
          }
          result = await api('POST', `/adAccounts/${encodeURIComponent(args['account-id'])}/adCampaigns`, body)
          break
        }
        case 'update': {
          if (!args['account-id'] || !args.id || !args.status) { result = { error: '--account-id, --id and --status required' }; break }
          result = await api(
            'POST',
            `/adAccounts/${encodeURIComponent(args['account-id'])}/adCampaigns/${encodeURIComponent(args.id)}`,
            { patch: { $set: { status: args.status } } },
            { 'X-RestLi-Method': 'PARTIAL_UPDATE' },
          )
          break
        }
        case 'analytics': {
          if (!args.id) { result = { error: '--id required' }; break }
          const range = dateRange()
          if (!range) { result = { error: '--start YYYY-MM-DD required (optional --end YYYY-MM-DD)' }; break }
          const fields = args.fields || 'impressions,clicks,landingPageClicks,costInLocalCurrency,externalWebsiteConversions,dateRange,pivotValues'
          const granularity = args.granularity || 'ALL'
          result = await api('GET', `/adAnalytics?q=analytics&pivot=CAMPAIGN&timeGranularity=${granularity}&dateRange=${range}&campaigns=List(${urn('sponsoredCampaign', args.id)})&fields=${fields}`)
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
          result = await api('GET', `/adAccounts/${encodeURIComponent(args['account-id'])}/creatives?q=criteria&campaigns=List(${urn('sponsoredCampaign', args['campaign-id'])})`)
          break
        }
        default:
          result = { error: 'Unknown creatives subcommand. Use: list' }
      }
      break

    case 'audiences':
      switch (sub) {
        case 'count': {
          if (!args.targeting || args.targeting === true) {
            result = { error: '--targeting required: a Rest.li targetingCriteria expression with URL-encoded URNs, e.g. (include:(and:List((or:(urn%3Ali%3AadTargetingFacet%3Alocations:List(urn%3Ali%3Ageo%3A103644278))))))' }
            break
          }
          result = await api('GET', `/audienceCounts?q=targetingCriteriaV2&targetingCriteria=${args.targeting}`)
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
          accounts: 'accounts list',
          campaigns: {
            list: 'campaigns list --account-id <id> [--status ACTIVE|PAUSED|DRAFT]',
            create: 'campaigns create --account-id <id> --campaign-group-id <id> --name <name> [--type SPONSORED_UPDATES] [--cost-type CPC] [--unit-cost 5.00] [--daily-budget 100.00]   (created PAUSED)',
            update: 'campaigns update --account-id <id> --id <campaign-id> --status ACTIVE|PAUSED|ARCHIVED',
            analytics: 'campaigns analytics --id <campaign-id> --start YYYY-MM-DD [--end YYYY-MM-DD] [--granularity ALL|DAILY|MONTHLY] [--fields a,b,c]',
          },
          creatives: 'creatives list --account-id <id> --campaign-id <id>',
          audiences: 'audiences count --targeting <restli-targeting-criteria>',
          env: 'LINKEDIN_ACCESS_TOKEN (required), LINKEDIN_API_VERSION (YYYYMM, default 202609)',
          options: '--dry-run (show request without executing)',
        },
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
