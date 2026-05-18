#!/usr/bin/env node

const TOKEN = process.env.GITHUB_TOKEN
const BASE_URL = 'https://api.github.com'
const USER_AGENT = 'marketingskills-prospects-cli'

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

const args = parseArgs(process.argv.slice(2))

async function api(path, opts = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`
  const headers = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': USER_AGENT,
  }
  if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`

  if (args['dry-run']) {
    return {
      _dry_run: true,
      method: 'GET',
      url,
      headers: { ...headers, Authorization: TOKEN ? 'Bearer ***' : undefined },
    }
  }

  const res = await fetch(url, { headers })
  const rateLimitRemaining = res.headers.get('x-ratelimit-remaining')
  const rateLimitReset = res.headers.get('x-ratelimit-reset')

  if (res.status === 401 || res.status === 403) {
    const body = await res.text()
    return {
      error: `HTTP ${res.status}`,
      hint: TOKEN
        ? 'Token rejected — check GITHUB_TOKEN scopes (public_repo is enough for public data).'
        : 'Set GITHUB_TOKEN env var to raise rate limit from 60/hr to 5000/hr.',
      rate_limit_remaining: rateLimitRemaining,
      rate_limit_reset_unix: rateLimitReset,
      body,
    }
  }

  if (!res.ok) {
    const body = await res.text()
    return { error: `HTTP ${res.status}`, body }
  }

  const data = await res.json()
  const linkHeader = res.headers.get('link') || ''
  const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/)
  return {
    data,
    next: nextMatch ? nextMatch[1] : null,
    rate_limit_remaining: rateLimitRemaining,
  }
}

async function paginate(path, { limit, perPage = 100 } = {}) {
  const initial = path.includes('?') ? `${path}&per_page=${perPage}` : `${path}?per_page=${perPage}`
  const all = []
  let next = initial
  let lastRate = null
  while (next) {
    const result = await api(next)
    if (result._dry_run) return result
    if (result.error) return result
    lastRate = result.rate_limit_remaining
    all.push(...result.data)
    if (limit && all.length >= limit) {
      return { data: all.slice(0, limit), rate_limit_remaining: lastRate, truncated: true }
    }
    next = result.next
  }
  return { data: all, rate_limit_remaining: lastRate, truncated: false }
}

async function getUser(login) {
  const result = await api(`/users/${encodeURIComponent(login)}`)
  if (result._dry_run || result.error) return result
  return result.data
}

function matchesFilter(user, opts) {
  if (!user) return false
  if (opts['with-email'] && !user.email) return false
  if (opts['with-company'] && !user.company) return false
  if (opts['with-blog'] && !user.blog) return false
  if (opts['type'] && user.type !== opts.type) return false
  return true
}

async function enrichUsers(users, opts = {}, { concurrency = 5, targetCount } = {}) {
  const matched = []
  for (let i = 0; i < users.length; i += concurrency) {
    const batch = users.slice(i, i + concurrency)
    const profiles = await Promise.all(batch.map(u => getUser(u.login)))
    for (const profile of profiles) {
      if (!profile || profile.error) continue
      if (matchesFilter(profile, opts)) matched.push(profile)
    }
    if (targetCount && matched.length >= targetCount) {
      return matched.slice(0, targetCount)
    }
  }
  return matched
}

function toCSV(users) {
  const cols = ['login', 'name', 'company', 'email', 'blog', 'location', 'bio', 'twitter_username', 'public_repos', 'followers', 'created_at', 'html_url']
  const escape = (v) => {
    if (v === null || v === undefined) return ''
    const s = String(v).replace(/\r?\n/g, ' ')
    if (s.includes(',') || s.includes('"')) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  const lines = [cols.join(',')]
  for (const u of users) {
    lines.push(cols.map(c => escape(u[c])).join(','))
  }
  return lines.join('\n')
}

function parseRepo(input) {
  if (!input) return null
  const trimmed = input.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '').replace(/\/$/, '')
  const parts = trimmed.split('/')
  if (parts.length < 2) return null
  return { owner: parts[0], repo: parts[1] }
}

async function main() {
  const [command, ...rest] = args._

  let result

  switch (command) {
    case 'stargazers': {
      const repo = parseRepo(rest[0])
      if (!repo) { result = { error: 'Usage: stargazers <owner/repo> [--limit N] [--target N] [--enrich] [--with-email] [--with-company] [--with-blog] [--format csv|json]' }; break }
      const limit = args.limit ? parseInt(args.limit, 10) : undefined
      const target = args.target ? parseInt(args.target, 10) : undefined
      const page = await paginate(`/repos/${repo.owner}/${repo.repo}/stargazers`, { limit })
      if (page._dry_run || page.error) { result = page; break }
      let users = page.data
      if (args.enrich || args['with-email'] || args['with-company'] || args['with-blog'] || args.type) {
        users = await enrichUsers(users, args, { targetCount: target })
      }
      if (args.format === 'csv') {
        console.log(toCSV(users))
        return
      }
      result = { count: users.length, rate_limit_remaining: page.rate_limit_remaining, truncated: page.truncated, users }
      break
    }

    case 'forks': {
      const repo = parseRepo(rest[0])
      if (!repo) { result = { error: 'Usage: forks <owner/repo> [--limit N] [--target N] [--enrich] [--with-email] [--with-company] [--with-blog] [--format csv|json]' }; break }
      const limit = args.limit ? parseInt(args.limit, 10) : undefined
      const target = args.target ? parseInt(args.target, 10) : undefined
      const page = await paginate(`/repos/${repo.owner}/${repo.repo}/forks`, { limit })
      if (page._dry_run || page.error) { result = page; break }
      const forkOwners = page.data.map(f => f.owner)
      let users = forkOwners
      if (args.enrich || args['with-email'] || args['with-company'] || args['with-blog'] || args.type) {
        users = await enrichUsers(forkOwners, args, { targetCount: target })
      }
      if (args.format === 'csv') {
        console.log(toCSV(users))
        return
      }
      result = { count: users.length, rate_limit_remaining: page.rate_limit_remaining, truncated: page.truncated, users }
      break
    }

    case 'watchers': {
      const repo = parseRepo(rest[0])
      if (!repo) { result = { error: 'Usage: watchers <owner/repo> [--limit N] [--target N] [--enrich] [--with-email] [--with-company] [--with-blog] [--format csv|json]' }; break }
      const limit = args.limit ? parseInt(args.limit, 10) : undefined
      const target = args.target ? parseInt(args.target, 10) : undefined
      const page = await paginate(`/repos/${repo.owner}/${repo.repo}/subscribers`, { limit })
      if (page._dry_run || page.error) { result = page; break }
      let users = page.data
      if (args.enrich || args['with-email'] || args['with-company'] || args['with-blog'] || args.type) {
        users = await enrichUsers(users, args, { targetCount: target })
      }
      if (args.format === 'csv') {
        console.log(toCSV(users))
        return
      }
      result = { count: users.length, rate_limit_remaining: page.rate_limit_remaining, truncated: page.truncated, users }
      break
    }

    case 'user': {
      const login = rest[0]
      if (!login) { result = { error: 'Usage: user <username>' }; break }
      result = await getUser(login)
      break
    }

    case 'rate-limit': {
      const res = await api('/rate_limit')
      result = res._dry_run || res.error ? res : res.data
      break
    }

    default:
      result = {
        error: 'Unknown command',
        usage: {
          stargazers: 'stargazers <owner/repo> [--limit N] [--target N] [--enrich] [--with-email] [--with-company] [--with-blog] [--type User|Organization] [--format csv|json]',
          forks: 'forks <owner/repo> [--limit N] [--target N] [--enrich] [--with-email] [--with-company] [--with-blog] [--type User|Organization] [--format csv|json]',
          watchers: 'watchers <owner/repo> [--limit N] [--target N] [--enrich] [--with-email] [--with-company] [--with-blog] [--format csv|json]',
          user: 'user <username>',
          'rate-limit': 'rate-limit',
        },
        notes: [
          'Set GITHUB_TOKEN env var for 5000 req/hr (vs 60/hr unauthenticated).',
          'Token needs only public_repo scope for public data; no scope is required to list public stargazers/forks.',
          '--enrich fetches each users full profile (1 extra request per user). Use with --limit on large repos.',
          '--with-email / --with-company / --with-blog imply --enrich.',
          '--target N stops enrichment as soon as N users match the filters (saves API quota on restrictive filters).',
          '--format csv outputs prospecting-ready CSV; default JSON.',
          'Pair with Apollo, Clay, Hunter, or Truelist to fill in missing emails.',
        ],
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
