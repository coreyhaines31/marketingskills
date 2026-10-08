#!/usr/bin/env node

const rawArgs = process.argv.slice(2)
const API_KEY = process.env.APOLLO_API_KEY
const BASE_URL = 'https://api.apollo.io/api/v1'

if ((!API_KEY) && rawArgs.length > 0) {
  console.error(JSON.stringify({ error: 'APOLLO_API_KEY environment variable required' }))
  process.exit(1)
}

async function api(method, path, body) {
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { 'Content-Type': 'application/json', 'x-api-key': '***' }, body: body || undefined }
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
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

function employeeRanges(value) {
  const message = '--employee-ranges must be min,max or a JSON array of min,max strings'
  if (typeof value !== 'string') throw new Error(message)
  let ranges
  try { ranges = value.trim().startsWith('[') ? JSON.parse(value) : [value] } catch { throw new Error(message) }
  if (!Array.isArray(ranges) || !ranges.length || ranges.some(range => typeof range !== 'string' || !/^\d+,\d+$/.test(range.trim()))) {
    throw new Error(message)
  }
  return ranges.map(range => range.trim())
}

const args = parseArgs(rawArgs)
const [cmd, sub, ...rest] = args._

async function main() {
  let result
  const page = args.page ? Number(args.page) : 1
  const perPage = args['per-page'] ? Number(args['per-page']) : 25

  switch (cmd) {
    case 'people':
      switch (sub) {
        case 'search': {
          const body = { page, per_page: perPage }
          if (args.titles) body.person_titles = args.titles.split(',')
          if (args.locations) body.person_locations = args.locations.split(',')
          if (args.seniorities) body.person_seniorities = args.seniorities.split(',')
          if (args['employee-ranges']) body.organization_num_employees_ranges = employeeRanges(args['employee-ranges'])
          if (args.keywords) body.q_keywords = args.keywords
          result = await api('POST', '/mixed_people/search', body)
          break
        }
        case 'enrich': {
          const body = {}
          if (args.email) body.email = args.email
          if (args['first-name']) body.first_name = args['first-name']
          if (args['last-name']) body.last_name = args['last-name']
          if (args.domain) body.domain = args.domain
          if (args.linkedin) body.linkedin_url = args.linkedin
          if (!args.email && !args.linkedin && !(args['first-name'] && args.domain)) {
            result = { error: '--email, --linkedin, or --first-name + --domain required' }
            break
          }
          result = await api('POST', '/people/match', body)
          break
        }
        case 'bulk-enrich': {
          const emails = args.emails?.split(',')
          if (!emails) { result = { error: '--emails required (comma-separated)' }; break }
          const details = emails.map(email => ({ email: email.trim() }))
          result = await api('POST', '/people/bulk_match', { details })
          break
        }
        default:
          result = { error: 'Unknown people subcommand. Use: search, enrich, bulk-enrich' }
      }
      break

    case 'organizations':
      switch (sub) {
        case 'search': {
          const body = { page, per_page: perPage }
          if (args.locations) body.organization_locations = args.locations.split(',')
          if (args['employee-ranges']) body.organization_num_employees_ranges = employeeRanges(args['employee-ranges'])
          if (args.keywords) body.q_keywords = args.keywords
          result = await api('POST', '/mixed_companies/search', body)
          break
        }
        case 'enrich': {
          const domain = args.domain
          if (!domain) { result = { error: '--domain required' }; break }
          const params = new URLSearchParams({ domain })
          result = await api('GET', `/organizations/enrich?${params}`)
          break
        }
        default:
          result = { error: 'Unknown organizations subcommand. Use: search, enrich' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          people: {
            search: 'people search [--titles <t1,t2>] [--locations <l1,l2>] [--seniorities <s1,s2>] [--employee-ranges <min,max|JSON-array>] [--keywords <kw>] [--page <n>]',
            enrich: 'people enrich --email <email> | --first-name <name> --last-name <name> --domain <domain> | --linkedin <url>',
            'bulk-enrich': 'people bulk-enrich --emails <e1,e2,e3>',
          },
          organizations: {
            search: 'organizations search [--locations <l1,l2>] [--employee-ranges <min,max|JSON-array>] [--keywords <kw>] [--page <n>]',
            enrich: 'organizations enrich --domain <domain>',
          },
        }
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
