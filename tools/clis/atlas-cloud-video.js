#!/usr/bin/env node

const dns = require('dns').promises
const fs = require('fs').promises
const net = require('net')
const path = require('path')

const API_KEY = process.env.ATLASCLOUD_API_KEY
const BASE_URL = 'https://api.atlascloud.ai/api/v1'
const TERMINAL_SUCCESS = new Set(['completed', 'succeeded'])
const TERMINAL_FAILURE = new Set(['failed', 'canceled', 'cancelled', 'timeout'])

function parseArgs(argv) {
  const result = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = argv[i + 1]
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function requestJson(url, options = {}) {
  const method = options.method || 'GET'
  const attempts = method === 'GET' ? 3 : 1
  let lastError

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const response = await fetch(url, options)
      const text = await response.text()
      let payload
      try {
        payload = text ? JSON.parse(text) : {}
      } catch {
        payload = { body: text }
      }
      if (!response.ok) {
        throw new Error(method + ' ' + url + ' failed with HTTP ' + response.status + ': ' + JSON.stringify(payload))
      }
      return payload
    } catch (error) {
      lastError = error
      if (attempt < attempts - 1) {
        await sleep(1000 * (2 ** attempt))
      }
    }
  }

  throw lastError
}

async function listModels() {
  const response = await requestJson(BASE_URL + '/models')
  if (!Array.isArray(response.data)) {
    throw new Error('Atlas Cloud model catalog did not return a data array')
  }
  return response.data
}

async function getModel(modelId) {
  const models = await listModels()
  const model = models.find(item => item.model === modelId && item.display_console !== false)
  if (!model) {
    throw new Error('Model is unavailable in the live Atlas Cloud catalog: ' + modelId)
  }
  if (String(model.type).toLowerCase() !== 'video') {
    throw new Error('Model is not a Video model: ' + modelId)
  }
  if (!model.schema) {
    throw new Error('Model has no schema URL: ' + modelId)
  }
  return model
}

async function getInputSchema(modelId) {
  const model = await getModel(modelId)
  const schemaUrl = new URL(model.schema)
  if (schemaUrl.protocol !== 'https:') {
    throw new Error('Model schema URL must use HTTPS')
  }
  const document = await requestJson(schemaUrl.href)
  const input = document.components?.schemas?.Input
  if (!input || input.type !== 'object' || !input.properties) {
    throw new Error('Model schema has no components.schemas.Input object: ' + modelId)
  }
  return { model, input }
}

function parseParams(args) {
  if (args.params && args['params-file']) {
    throw new Error('Use either --params or --params-file, not both')
  }
  if (!args.params && !args['params-file']) return {}

  const raw = args.params || require('fs').readFileSync(args['params-file'], 'utf8')
  const parsed = JSON.parse(raw)
  if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
    throw new Error('Extra params must be a JSON object')
  }
  if ('model' in parsed || 'prompt' in parsed) {
    throw new Error('Pass model and prompt with --model and --prompt, not in extra params')
  }
  return parsed
}

function validateValue(name, value, property) {
  const typeMatches = {
    string: typeof value === 'string',
    boolean: typeof value === 'boolean',
    number: typeof value === 'number' && Number.isFinite(value),
    integer: Number.isInteger(value),
    array: Array.isArray(value),
    object: value !== null && !Array.isArray(value) && typeof value === 'object',
  }
  if (property.type && typeMatches[property.type] === false) {
    throw new Error('Parameter ' + name + ' must be ' + property.type)
  }
  if (property.enum && !property.enum.includes(value)) {
    throw new Error('Parameter ' + name + ' must be one of: ' + property.enum.join(', '))
  }
  if (typeof value === 'number' && property.minimum !== undefined && value < property.minimum) {
    throw new Error('Parameter ' + name + ' must be >= ' + property.minimum)
  }
  if (typeof value === 'number' && property.maximum !== undefined && value > property.maximum) {
    throw new Error('Parameter ' + name + ' must be <= ' + property.maximum)
  }
}

function buildRequest(model, prompt, extraParams, inputSchema) {
  const body = { model, prompt, ...extraParams }
  const allowed = new Set(Object.keys(inputSchema.properties))
  const unknown = Object.keys(body).filter(key => !allowed.has(key))
  if (unknown.length) {
    throw new Error('Parameters not present in the live model schema: ' + unknown.join(', '))
  }
  for (const required of inputSchema.required || []) {
    if (body[required] === undefined || body[required] === '') {
      throw new Error('Missing required parameter: ' + required)
    }
  }
  for (const [name, value] of Object.entries(body)) {
    validateValue(name, value, inputSchema.properties[name])
  }
  return body
}

function positiveNumber(value, fallback, name, integer = false) {
  const parsed = Number(value === undefined ? fallback : value)
  if (!Number.isFinite(parsed) || parsed <= 0 || (integer && !Number.isInteger(parsed))) {
    throw new Error(name + ' must be a positive ' + (integer ? 'integer' : 'number'))
  }
  return parsed
}

function isPrivateAddress(address) {
  if (net.isIPv4(address)) {
    const parts = address.split('.').map(Number)
    return parts[0] === 0 ||
      parts[0] === 10 ||
      (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) ||
      parts[0] === 127 ||
      (parts[0] === 169 && parts[1] === 254) ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 0) ||
      (parts[0] === 192 && parts[1] === 168) ||
      (parts[0] === 198 && (parts[1] === 18 || parts[1] === 19 || parts[1] === 51)) ||
      (parts[0] === 203 && parts[1] === 0 && parts[2] === 113) ||
      parts[0] >= 224
  }
  if (net.isIPv6(address)) {
    const normalized = address.toLowerCase()
    if (normalized.startsWith('::ffff:')) {
      return isPrivateAddress(normalized.slice(7))
    }
    return normalized === '::' ||
      normalized === '::1' ||
      normalized.startsWith('fc') ||
      normalized.startsWith('fd') ||
      normalized.startsWith('fe8') ||
      normalized.startsWith('fe9') ||
      normalized.startsWith('fea') ||
      normalized.startsWith('feb') ||
      normalized.startsWith('ff') ||
      normalized.startsWith('2001:db8:')
  }
  return true
}

function isSyntheticProxyAddress(address) {
  if (!net.isIPv4(address)) return false
  const parts = address.split('.').map(Number)
  return parts[0] === 198 && (parts[1] === 18 || parts[1] === 19)
}

async function assertSafeOutputUrl(rawUrl) {
  const url = new URL(rawUrl)
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error('Output URL must be credential-free HTTPS')
  }
  if (url.hostname === 'localhost' || url.hostname.endsWith('.localhost')) {
    throw new Error('Output URL cannot target localhost')
  }
  const literalAddress = net.isIP(url.hostname)
  const addresses = literalAddress
    ? [{ address: url.hostname }]
    : await dns.lookup(url.hostname, { all: true, verbatim: true })
  const unsafe = addresses.some(item =>
    isPrivateAddress(item.address) &&
    (literalAddress || !isSyntheticProxyAddress(item.address)),
  )
  if (!addresses.length || unsafe) {
    throw new Error('Output URL cannot target a private or non-routable address')
  }
  return url
}

async function downloadOutput(rawUrl, destination) {
  let current = await assertSafeOutputUrl(rawUrl)

  for (let redirects = 0; redirects <= 5; redirects++) {
    const response = await fetch(current, {
      method: 'GET',
      redirect: 'manual',
      headers: { Accept: 'video/*,application/octet-stream;q=0.9,*/*;q=0.1' },
    })
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location')
      if (!location) throw new Error('Output redirect has no Location header')
      current = await assertSafeOutputUrl(new URL(location, current).href)
      continue
    }
    if (!response.ok) {
      throw new Error('Output download failed with HTTP ' + response.status)
    }
    const finalUrl = await assertSafeOutputUrl(response.url || current.href)
    const bytes = Buffer.from(await response.arrayBuffer())
    const outputPath = path.resolve(destination)
    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    await fs.writeFile(outputPath, bytes, { flag: 'wx' })
    return { path: outputPath, bytes: bytes.length, url: finalUrl.href }
  }

  throw new Error('Output download exceeded 5 redirects')
}

function unwrapPrediction(response) {
  return response.data && typeof response.data === 'object' ? response.data : response
}

async function pollPrediction(id, maxWaitSeconds, intervalSeconds) {
  const deadline = Date.now() + maxWaitSeconds * 1000
  while (Date.now() < deadline) {
    const response = await requestJson(BASE_URL + '/model/prediction/' + encodeURIComponent(id), {
      headers: { Authorization: 'Bearer ' + API_KEY },
    })
    const prediction = unwrapPrediction(response)
    const status = String(prediction.status || '').toLowerCase()
    if (TERMINAL_SUCCESS.has(status)) return prediction
    if (TERMINAL_FAILURE.has(status)) {
      throw new Error('Prediction ' + id + ' ended with status ' + status)
    }
    await sleep(intervalSeconds * 1000)
  }
  throw new Error('Prediction ' + id + ' did not finish within ' + maxWaitSeconds + ' seconds')
}

function usage() {
  return {
    models: 'models [--type Video] [--search <text>] [--limit <n>]',
    schema: 'schema --model <exact-model-id>',
    generate: 'generate --model <exact-model-id> --prompt <text> [--params <json> | --params-file <path>] [--wait] [--max-wait <seconds>] [--interval <seconds>] [--download <path>] [--dry-run]',
  }
}

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv)
  const [command] = args._
  let result

  if (command === 'models') {
    const search = String(args.search || '').toLowerCase()
    const type = String(args.type || 'Video').toLowerCase()
    const limit = Math.min(positiveNumber(args.limit, 50, '--limit', true), 200)
    const models = (await listModels())
      .filter(item => item.display_console !== false)
      .filter(item => !type || String(item.type || '').toLowerCase() === type)
      .filter(item => !search || [item.model, item.displayName, item.profile].some(value => String(value || '').toLowerCase().includes(search)))
      .slice(0, limit)
      .map(item => ({
        model: item.model,
        displayName: item.displayName,
        type: item.type,
        schema: item.schema,
        price: item.price?.actual,
      }))
    result = { count: models.length, models }
  } else if (command === 'schema') {
    if (!args.model) throw new Error('--model is required')
    const { model, input } = await getInputSchema(args.model)
    result = { model: model.model, displayName: model.displayName, schema: input }
  } else if (command === 'generate') {
    if (!args.model) throw new Error('--model is required')
    if (!args.prompt) throw new Error('--prompt is required')
    if (args.download && !args.wait) throw new Error('--download requires --wait')

    const { input } = await getInputSchema(args.model)
    const body = buildRequest(args.model, args.prompt, parseParams(args), input)
    if (args['dry-run']) {
      result = {
        _dry_run: true,
        method: 'POST',
        url: BASE_URL + '/model/generateVideo',
        headers: { Authorization: 'Bearer ***', 'Content-Type': 'application/json' },
        body,
      }
    } else {
      if (!API_KEY) throw new Error('ATLASCLOUD_API_KEY environment variable required')
      const submitted = await requestJson(BASE_URL + '/model/generateVideo', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const initial = unwrapPrediction(submitted)
      if (!initial.id) throw new Error('Atlas Cloud response did not include a prediction id')

      if (!args.wait) {
        result = initial
      } else {
        console.error(JSON.stringify({ prediction_id: initial.id, status: initial.status || 'submitted' }))
        const maxWait = positiveNumber(args['max-wait'], 600, '--max-wait')
        const interval = positiveNumber(args.interval, 5, '--interval')
        const prediction = await pollPrediction(initial.id, maxWait, interval)
        result = { prediction }
        if (args.download) {
          const output = Array.isArray(prediction.outputs) ? prediction.outputs[0] : null
          if (!output) throw new Error('Completed prediction did not include an output URL')
          result.download = await downloadOutput(output, args.download)
        }
      }
    }
  } else {
    result = { error: 'Unknown command', usage: usage() }
  }

  console.log(JSON.stringify(result, null, 2))
}

if (require.main === module) {
  main().catch(error => {
    console.error(JSON.stringify({ error: error.message }))
    process.exit(1)
  })
}

module.exports = {
  assertSafeOutputUrl,
  buildRequest,
  downloadOutput,
  isPrivateAddress,
  isSyntheticProxyAddress,
  main,
  parseArgs,
  positiveNumber,
  requestJson,
}
