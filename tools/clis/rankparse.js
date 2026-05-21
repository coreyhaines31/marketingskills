#!/usr/bin/env node

const API_KEY = process.env.RANKPARSE_API_KEY
const BASE_URL = 'https://api.rankparse.com/v1'

if (!API_KEY) {
  console.error(JSON.stringify({ error: 'RANKPARSE_API_KEY environment variable required' }))
  process.exit(1)
}

async function api(method, path, body) {
  if (args['dry-run']) {
    return { _dry_run: true, method, url: `${BASE_URL}${path}`, headers: { 'X-API-Key': '***', 'Content-Type': 'application/json' }, body }
  }
  const init = {
    method,
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
  }
  if (body) init.body = JSON.stringify(body)
  const res = await fetch(`${BASE_URL}${path}`, init)
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

const args = parseArgs(process.argv.slice(2))
const [cmd, sub, ...rest] = args._

function requireDomain() {
  if (!args.domain) return { error: '--domain required' }
  return null
}

function requireUrl() {
  if (!args.url) return { error: '--url required' }
  return null
}

async function main() {
  let result

  switch (cmd) {
    case 'domain-authority':
    case 'domain-rank':
    case 'tech-stack':
    case 'site-health':
    case 'similar-domains':
    case 'link-audit':
    case 'site-explorer':
    case 'crawl-history': {
      const err = requireDomain(); if (err) { result = err; break }
      result = await api('GET', `/${cmd}?domain=${encodeURIComponent(args.domain)}`)
      break
    }

    case 'backlinks': {
      const err = requireDomain(); if (err) { result = err; break }
      const params = new URLSearchParams({ domain: args.domain })
      if (args.limit) params.set('limit', args.limit)
      if (args.sort) params.set('sort', args.sort)
      if (args['from-domain']) params.set('from_domain', args['from-domain'])
      if (args['link-type']) params.set('link_type', args['link-type'])
      if (args.score) params.set('score', 'true')
      result = await api('GET', `/backlinks?${params}`)
      break
    }

    case 'referring-domains':
    case 'outbound-links':
    case 'anchor-text':
    case 'top-pages':
    case 'sitemap': {
      const err = requireDomain(); if (err) { result = err; break }
      const params = new URLSearchParams({ domain: args.domain })
      if (args.limit) params.set('limit', args.limit)
      result = await api('GET', `/${cmd}?${params}`)
      break
    }

    case 'domain-overlap': {
      if (!args.domains) { result = { error: '--domains required (comma-separated, 2-5 domains)' }; break }
      const params = new URLSearchParams({ domains: args.domains })
      if (args.limit) params.set('limit', args.limit)
      result = await api('GET', `/domain-overlap?${params}`)
      break
    }

    case 'link-intersect': {
      if (!args['domain-a'] || !args['domain-b']) { result = { error: '--domain-a and --domain-b required' }; break }
      const params = new URLSearchParams({ domain_a: args['domain-a'], domain_b: args['domain-b'] })
      if (args.limit) params.set('limit', args.limit)
      result = await api('GET', `/link-intersect?${params}`)
      break
    }

    case 'competitor-gap': {
      const err = requireDomain(); if (err) { result = err; break }
      if (!args.vs) { result = { error: '--vs required (competitor domain)' }; break }
      const params = new URLSearchParams({ domain: args.domain, vs: args.vs })
      if (args.limit) params.set('limit', args.limit)
      result = await api('GET', `/competitor-gap?${params}`)
      break
    }

    case 'page-seo': {
      const err = requireUrl(); if (err) { result = err; break }
      result = await api('GET', `/page-seo?url=${encodeURIComponent(args.url)}`)
      break
    }

    case 'page-performance': {
      const err = requireUrl(); if (err) { result = err; break }
      const params = new URLSearchParams({ url: args.url })
      if (args.strategy) params.set('strategy', args.strategy)
      result = await api('GET', `/page-performance?${params}`)
      break
    }

    case 'batch': {
      if (!args.domains) { result = { error: '--domains required (comma-separated)' }; break }
      const domains = args.domains.split(',').map(d => d.trim()).filter(Boolean)
      result = await api('POST', '/batch', { domains })
      break
    }

    case 'me':
      result = await api('GET', '/me')
      break

    case 'credits':
      result = await api('GET', '/credits')
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          'domain-authority': 'domain-authority --domain <domain>',
          'domain-rank': 'domain-rank --domain <domain>',
          'backlinks': 'backlinks --domain <domain> [--limit <n>] [--sort importance|recent] [--from-domain <d>] [--link-type <t>] [--score]',
          'referring-domains': 'referring-domains --domain <domain> [--limit <n>]',
          'outbound-links': 'outbound-links --domain <domain> [--limit <n>]',
          'anchor-text': 'anchor-text --domain <domain> [--limit <n>]',
          'top-pages': 'top-pages --domain <domain> [--limit <n>]',
          'domain-overlap': 'domain-overlap --domains <d1,d2,...> [--limit <n>]',
          'link-intersect': 'link-intersect --domain-a <d> --domain-b <d> [--limit <n>]',
          'competitor-gap': 'competitor-gap --domain <d> --vs <competitor> [--limit <n>]',
          'similar-domains': 'similar-domains --domain <domain>',
          'tech-stack': 'tech-stack --domain <domain>',
          'site-health': 'site-health --domain <domain>',
          'sitemap': 'sitemap --domain <domain> [--limit <n>]',
          'crawl-history': 'crawl-history --domain <domain>',
          'page-seo': 'page-seo --url <url>',
          'page-performance': 'page-performance --url <url> [--strategy mobile|desktop]',
          'link-audit': 'link-audit --domain <domain>',
          'site-explorer': 'site-explorer --domain <domain>',
          'batch': 'batch --domains <d1,d2,...>',
          'me': 'me (account info + credit balance)',
          'credits': 'credits (credit balance)',
        }
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
