#!/usr/bin/env node

const rawArgs = process.argv.slice(2)
const CLIENT_ID = process.env.SNOV_CLIENT_ID
const CLIENT_SECRET = process.env.SNOV_CLIENT_SECRET
const BASE_URL = 'https://api.snov.io/v1'

if ((!CLIENT_ID || !CLIENT_SECRET) && rawArgs.length > 0) {
  console.error(JSON.stringify({ error: 'SNOV_CLIENT_ID and SNOV_CLIENT_SECRET environment variables required' }))
  process.exit(1)
}

let cachedToken = null

async function getToken() {
  if (cachedToken) return cachedToken
  const res = await fetch('https://api.snov.io/v1/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grant_type: 'client_credentials', client_id: CLIENT_ID, client_secret: CLIENT_SECRET }),
  })
  const data = await res.json()
  if (!data.access_token) {
    throw new Error(data.error_description || data.error || 'Failed to obtain access token')
  }
  cachedToken = data.access_token
  return cachedToken
}

async function api(method, path, body, base = BASE_URL) {
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${base}${path}`, headers: { Authorization: '***', 'Content-Type': 'application/json', Accept: 'application/json' }, body: body || undefined }
  }
  const token = await getToken()
  const opts = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(`${base}${path}`, opts)
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

function domainTaskPath() {
  const routes = { company: '', emails: '/domain-emails', generic: '/generic-contacts', prospects: '/prospects' }
  if (typeof args.kind !== 'string' || !Object.hasOwn(routes, args.kind)) {
    throw new Error('--kind must be company, emails, generic, or prospects')
  }
  for (const flag of ['type', 'limit']) {
    if (args[flag] !== undefined) throw new Error(`--${flag} belongs to legacy domain search`)
  }
  const root = `/domain-search${routes[args.kind]}`
  if (sub === 'result') {
    for (const flag of ['domain', 'page', 'positions', 'next']) {
      if (args[flag] !== undefined) throw new Error(`--${flag} belongs to domain start`)
    }
    if (typeof args['task-hash'] !== 'string' || !/^[A-Za-z0-9_-]+$/.test(args['task-hash'])) {
      throw new Error('--task-hash must be a nonempty task identifier (letters, digits, underscores or hyphens)')
    }
    return `${root}/result/${encodeURIComponent(args['task-hash'])}`
  }
  if (typeof args.domain !== 'string' || !args.domain.trim()) throw new Error('--domain required')
  if (args['task-hash'] !== undefined) throw new Error('--task-hash belongs to domain result')
  const params = new URLSearchParams({ domain: args.domain })
  if (args.next !== undefined) {
    if (!['emails', 'generic'].includes(args.kind) || typeof args.next !== 'string' || !args.next) {
      throw new Error('--next requires a nonempty cursor and kind emails or generic')
    }
    params.set('next', args.next)
  }
  if (args.page !== undefined || args.positions !== undefined) {
    if (args.kind !== 'prospects') throw new Error('--page and --positions require kind prospects')
    if (args.page !== undefined) {
      const page = Number(args.page)
      if (typeof args.page !== 'string' || !/^\d+$/.test(args.page) || !Number.isSafeInteger(page) || page < 1) {
        throw new Error('--page must be a positive safe integer')
      }
      params.set('page', args.page)
    }
    if (args.positions !== undefined) {
      if (typeof args.positions !== 'string') throw new Error('--positions requires comma-separated job titles')
      const positions = args.positions.split(',').map(position => position.trim())
      if (positions.length > 10 || positions.some(position => !position)) {
        throw new Error('--positions must contain one to ten nonempty job titles')
      }
      for (const position of positions) params.append('positions[]', position)
    }
  }
  return `${root}/start?${params}`
}

async function main() {
  let result

  switch (cmd) {
    case 'domain':
      switch (sub) {
        case 'start':
        case 'result':
          result = await api(sub === 'start' ? 'POST' : 'GET', domainTaskPath(), undefined, 'https://api.snov.io/v2')
          break
        case 'search': {
          const domain = args.domain
          if (!domain) { result = { error: '--domain required' }; break }
          const body = { domain, type: args.type || 'all', limit: Number(args.limit || 100), lastId: 0 }
          result = await api('POST', '/get-domain-emails-with-info', body)
          break
        }
        case 'count': {
          const domain = args.domain
          if (!domain) { result = { error: '--domain required' }; break }
          result = await api('POST', '/get-domain-emails-count', { domain })
          break
        }
        default:
          result = { error: 'Unknown domain subcommand. Use: search, count, start, result' }
      }
      break

    case 'email':
      switch (sub) {
        case 'find': {
          const domain = args.domain
          const firstName = args['first-name']
          const lastName = args['last-name']
          if (!domain || !firstName || !lastName) { result = { error: '--domain, --first-name, and --last-name required' }; break }
          result = await api('POST', '/get-emails-from-names', { firstName, lastName, domain })
          break
        }
        case 'verify': {
          const email = args.email
          if (!email) { result = { error: '--email required' }; break }
          result = await api('POST', '/get-emails-verification-status', { emails: [email] })
          break
        }
        default:
          result = { error: 'Unknown email subcommand. Use: find, verify' }
      }
      break

    case 'prospect':
      switch (sub) {
        case 'find': {
          const email = args.email
          if (!email) { result = { error: '--email required' }; break }
          result = await api('POST', '/get-prospects-by-email', { email })
          break
        }
        case 'add': {
          const email = args.email
          if (!email) { result = { error: '--email required' }; break }
          const body = { email }
          if (args['first-name']) body.firstName = args['first-name']
          if (args['last-name']) body.lastName = args['last-name']
          if (args['list-id']) body.listId = args['list-id']
          result = await api('POST', '/add-prospect-to-list', body)
          break
        }
        default:
          result = { error: 'Unknown prospect subcommand. Use: find, add' }
      }
      break

    case 'lists':
      switch (sub) {
        case 'list':
          result = await api('GET', '/get-user-lists')
          break
        case 'prospects': {
          const id = args.id
          if (!id) { result = { error: '--id required' }; break }
          const body = { listId: id }
          if (args.page) body.page = Number(args.page)
          if (args['per-page']) body.perPage = Number(args['per-page'])
          result = await api('POST', '/prospect-list', body)
          break
        }
        default:
          result = { error: 'Unknown lists subcommand. Use: list, prospects' }
      }
      break

    case 'technology':
      switch (sub) {
        case 'check': {
          const domain = args.domain
          if (!domain) { result = { error: '--domain required' }; break }
          result = await api('POST', '/get-technology-checker', { domain })
          break
        }
        default:
          result = { error: 'Unknown technology subcommand. Use: check' }
      }
      break

    case 'drips':
      switch (sub) {
        case 'list':
          result = await api('GET', '/get-user-campaigns')
          break
        case 'get': {
          const id = args.id
          if (!id) { result = { error: '--id required' }; break }
          result = await api('GET', `/get-emails-from-campaign?id=${encodeURIComponent(id)}`)
          break
        }
        case 'add-prospect': {
          const campaignId = args['campaign-id']
          const email = args.email
          if (!campaignId || !email) { result = { error: '--campaign-id and --email required' }; break }
          const body = { campaignId, email }
          if (args['first-name']) body.firstName = args['first-name']
          if (args['last-name']) body.lastName = args['last-name']
          result = await api('POST', '/add-prospect-to-email-campaign', body)
          break
        }
        default:
          result = { error: 'Unknown drips subcommand. Use: list, get, add-prospect' }
      }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          domain: {
            start: 'domain start --kind company|emails|generic|prospects --domain <domain> [--next <cursor>] [--page <n>] [--positions <titles>]',
            result: 'domain result --kind company|emails|generic|prospects --task-hash <hash>',
            search: 'domain search --domain <domain> [--type all|personal|generic] [--limit <n>]',
            count: 'domain count --domain <domain>',
          },
          email: {
            find: 'email find --domain <domain> --first-name <name> --last-name <name>',
            verify: 'email verify --email <email>',
          },
          prospect: {
            find: 'prospect find --email <email>',
            add: 'prospect add --email <email> [--first-name <name>] [--last-name <name>] [--list-id <id>]',
          },
          lists: {
            list: 'lists list',
            prospects: 'lists prospects --id <id> [--page <n>] [--per-page <n>]',
          },
          technology: 'technology check --domain <domain>',
          drips: {
            list: 'drips list',
            get: 'drips get --id <id>',
            'add-prospect': 'drips add-prospect --campaign-id <id> --email <email> [--first-name <name>] [--last-name <name>]',
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
