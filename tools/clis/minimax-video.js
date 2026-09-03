#!/usr/bin/env node

// MiniMax text-to-video and image-to-video CLI for marketing footage generation.

const API_KEY = process.env.MINIMAX_API_KEY

// Regional endpoints. Global (English) is the default; the mainland China
// region uses a different host. Override the host entirely with MINIMAX_BASE_URL.
const REGIONS = {
  global_en: 'https://api.minimax.io',
  cn_zh: 'https://api.minimaxi.com',
}

const VIDEO_MODELS = [
  'MiniMax-H3',
  'MiniMax-Hailuo-2.3',
  'MiniMax-Hailuo-2.3-Fast',
  'MiniMax-Hailuo-02',
  'T2V-01-Director',
  'T2V-01',
  'I2V-01-Director',
  'I2V-01-live',
  'I2V-01',
]
const DEFAULT_MODEL = 'MiniMax-H3'

const V2_FIELDS = ['model', 'content', 'resolution', 'duration', 'ratio', 'callback_url']
const V1_FIELDS = ['model', 'prompt', 'first_frame_image', 'prompt_optimizer', 'fast_pretreatment', 'duration', 'resolution', 'callback_url']

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

const args = parseArgs(process.argv.slice(2))
const [cmd, sub] = args._

const region = args.region || process.env.MINIMAX_REGION || 'global_en'
if (!REGIONS[region]) {
  console.error(JSON.stringify({ error: `Unknown region "${region}". Use: ${Object.keys(REGIONS).join(', ')}` }))
  process.exit(1)
}
const BASE_URL = process.env.MINIMAX_BASE_URL || REGIONS[region]

async function api(method, path, body) {
  if (args['dry-run']) {
    return {
      _dry_run: true,
      method,
      url: `${BASE_URL}${path}`,
      headers: { 'Authorization': 'Bearer ***', 'Content-Type': 'application/json' },
      body: body || undefined,
    }
  }
  if (!API_KEY) {
    return { error: 'MINIMAX_API_KEY environment variable required' }
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

// Numeric flags stay numeric so the API sees the right JSON types.
function numeric(value) {
  const n = Number(value)
  return Number.isNaN(n) ? value : n
}

function videoApiVersion(model) {
  const version = args['api-version'] || (model === 'MiniMax-H3' ? 'v2' : 'v1')
  if (!['v1', 'v2'].includes(version)) throw new Error('--api-version must be v1 or v2')
  return version
}

function v2Content(prompt) {
  const content = [{ type: 'text', text: prompt }]
  if (args['first-frame-image']) content.push({ type: 'image_url', image_url: { url: args['first-frame-image'] }, role: 'first_frame' })
  if (args['last-frame-image']) content.push({ type: 'image_url', image_url: { url: args['last-frame-image'] }, role: 'last_frame' })
  return content
}

async function main() {
  let result

  switch (cmd) {
    case 'video':
      switch (sub) {
        case 'generate': {
          const model = args.model || DEFAULT_MODEL
          const version = videoApiVersion(model)
          const prompt = args.prompt
          if (version === 'v2' && !prompt) { result = { error: '--prompt required' }; break }
          if (version === 'v1' && !prompt && !args['first-frame-image']) {
            result = { error: '--prompt or --first-frame-image required' }
            break
          }
          if (version === 'v2') {
            const hasFrame = args['first-frame-image'] || args['last-frame-image']
            const body = {
              model,
              content: v2Content(prompt),
              resolution: args.resolution || '2K',
              duration: numeric(args.duration || 5),
              ratio: args.ratio || (hasFrame ? 'adaptive' : '16:9'),
            }
            if (args['callback-url']) body.callback_url = args['callback-url']
            result = await api('POST', '/v2/video_generation', body)
          } else {
            const body = { model }
            if (prompt) body.prompt = prompt
            if (args['first-frame-image']) body.first_frame_image = args['first-frame-image']
            if (args['prompt-optimizer'] !== undefined) body.prompt_optimizer = args['prompt-optimizer'] !== 'false'
            if (args['fast-pretreatment'] !== undefined) body.fast_pretreatment = args['fast-pretreatment'] !== 'false'
            if (args.duration !== undefined) body.duration = numeric(args.duration)
            if (args.resolution) body.resolution = args.resolution
            if (args['callback-url']) body.callback_url = args['callback-url']
            result = await api('POST', '/v1/video_generation', body)
          }
          break
        }
        case 'status': {
          const taskId = args['task-id']
          if (!taskId) { result = { error: '--task-id required' }; break }
          const version = videoApiVersion(args.model || DEFAULT_MODEL)
          const path = version === 'v2'
            ? `/v2/query/video_generation/${encodeURIComponent(taskId)}`
            : `/v1/query/video_generation?task_id=${encodeURIComponent(taskId)}`
          result = await api('GET', path)
          break
        }
        case 'list': {
          const query = new URLSearchParams()
          if (args['page-num']) query.set('page_num', args['page-num'])
          if (args['page-size']) query.set('page_size', args['page-size'])
          result = await api('GET', `/v2/query/video_generation${query.size ? `?${query}` : ''}`)
          break
        }
        case 'delete': {
          const taskId = args['task-id']
          if (!taskId) { result = { error: '--task-id required' }; break }
          result = await api('DELETE', `/v2/video_generation/${encodeURIComponent(taskId)}`)
          break
        }
        case 'download': {
          const fileId = args['file-id']
          if (!fileId) { result = { error: '--file-id required' }; break }
          result = await api('GET', `/v1/files/retrieve?file_id=${encodeURIComponent(fileId)}`)
          break
        }
        default:
          result = { error: 'Unknown video subcommand. Use: generate, status, list, delete, download' }
      }
      break

    case 'models':
      result = { default: DEFAULT_MODEL, video: VIDEO_MODELS }
      break

    default:
      result = {
        error: 'Unknown command',
        usage: {
          video: 'video [generate --prompt <text> [--model <id>] [--first-frame-image <url>] [--last-frame-image <url>] [--duration <n>] [--resolution <res>] [--ratio <ratio>] [--callback-url <url>] | status --task-id <id> | list | delete --task-id <id> | download --file-id <id>]',
          models: 'models',
          options: '--region <global_en|cn_zh> --api-version <v1|v2> --dry-run',
          fields: { v2: V2_FIELDS, v1: V1_FIELDS },
        },
      }
  }

  console.log(JSON.stringify(result, null, 2))
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})
