#!/usr/bin/env node

// Truelist email verification API.
// Spec: https://truelist.io/spec.yaml (API reference: https://truelist.io/docs/api)

const fs = require('node:fs')

const rawArgs = process.argv.slice(2)
const API_KEY = process.env.TRUELIST_API_KEY
const BASE_URL = 'https://api.truelist.io'

if ((!API_KEY) && rawArgs.length > 0) {
  console.error(JSON.stringify({ error: 'TRUELIST_API_KEY environment variable required' }))
  process.exit(1)
}

const INLINE_STRATEGIES = ['accurate', 'fast', 'thorough', 'enhanced']
const BATCH_STRATEGIES = ['accurate', 'fast']
const STATES = ['ok', 'risky', 'invalid', 'unknown']

async function api(method, path, { form } = {}) {
  const url = `${BASE_URL}${path}`
  const headers = { Accept: 'application/json' }
  let body
  if (form) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    body = new URLSearchParams(form).toString()
  }
  if (args['dry-run']) {
    return { _dry_run: true, method, url, headers: { ...headers, Authorization: 'Bearer ***' }, body: form || undefined }
  }
  const res = await fetch(url, { method, headers: { ...headers, Authorization: `Bearer ${API_KEY}` }, body })
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

// Accepts a JSON array of emails, or text/CSV with the email in the first column (header row optional).
function readEmails(file) {
  const raw = fs.readFileSync(file, 'utf8').trim()
  let emails
  if (raw.startsWith('[')) {
    emails = JSON.parse(raw).map(item => Array.isArray(item) ? item[0] : item)
  } else {
    emails = raw.split(/\r?\n/).map(line => line.split(',')[0].trim().replace(/^"|"$/g, ''))
  }
  return [...new Set(emails.filter(e => typeof e === 'string' && e.includes('@')))]
}

const args = parseArgs(rawArgs)
const [cmd, sub] = args._

async function main() {
  let result

  switch (cmd) {
    case 'verify': {
      if (!args.email || args.email === true) { result = { error: '--email required (one address, or several comma-separated)' }; break }
      if (args.strategy && !INLINE_STRATEGIES.includes(args.strategy)) {
        result = { error: `--strategy must be one of: ${INLINE_STRATEGIES.join(', ')}` }; break
      }
      const emails = String(args.email).split(',').map(e => e.trim()).filter(Boolean)
      result = await api('POST', `/api/v1/verify_inline${query({ email: emails.join(' '), validation_strategy: args.strategy })}`)
      break
    }

    case 'batch':
      switch (sub) {
        case 'create': {
          if (!args.file) { result = { error: '--file required (JSON array, or CSV/text with the email in the first column)' }; break }
          if (args.strategy && !BATCH_STRATEGIES.includes(args.strategy)) {
            result = { error: `--strategy must be one of: ${BATCH_STRATEGIES.join(', ')}` }; break
          }
          let emails
          try {
            emails = readEmails(args.file)
          } catch (e) {
            result = { error: `Could not read --file: ${e.message}` }; break
          }
          if (emails.length < 2) { result = { error: 'A batch needs at least 2 email addresses; use verify for one' }; break }
          const form = { data: JSON.stringify(emails.map(e => [e])), filename: args.name || require('node:path').basename(args.file) }
          if (args['webhook-url']) form.webhook_url = args['webhook-url']
          if (args.strategy) form.validation_strategy = args.strategy
          result = await api('POST', '/api/v1/batches', { form })
          break
        }
        case 'list':
          result = await api('GET', '/api/v1/batches')
          break
        case 'get':
          if (!args.id) { result = { error: '--id required (batch UUID)' }; break }
          result = await api('GET', `/api/v1/batches/${encodeURIComponent(args.id)}`)
          break
        case 'delete':
          if (!args.id) { result = { error: '--id required (batch UUID)' }; break }
          result = await api('DELETE', `/api/v1/batches/${encodeURIComponent(args.id)}`)
          break
        default:
          result = { error: 'Unknown batch subcommand. Use: create, list, get, delete' }
      }
      break

    case 'results': {
      if (!args['batch-id'] && !args.state && !args.email) {
        result = { error: '--batch-id, --state, or --email required' }; break
      }
      if (args.state && !STATES.includes(args.state)) { result = { error: `--state must be one of: ${STATES.join(', ')}` }; break }
      result = await api('GET', `/api/v1/email_addresses${query({
        batch_uuid: args['batch-id'],
        email_state: args.state,
        email_sub_state: args['sub-state'],
        email_address: args.email,
        page: args.page,
        per_page: args['per-page'],
      })}`)
      break
    }

    case 'account':
      result = await api('GET', '/me')
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          verify: `verify --email <a@x.com[,b@y.com]> [--strategy ${INLINE_STRATEGIES.join('|')}]`,
          batch: {
            create: `batch create --file <emails.csv|emails.json> [--name <name>] [--webhook-url <url>] [--strategy ${BATCH_STRATEGIES.join('|')}]`,
            list: 'batch list',
            get: 'batch get --id <batch-uuid>   (includes CSV download URLs once completed)',
            delete: 'batch delete --id <batch-uuid>',
          },
          results: `results --batch-id <uuid> [--state ${STATES.join('|')}] [--sub-state <sub-state>] [--page <n>] [--per-page <n, max 100>]`,
          account: 'account',
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
