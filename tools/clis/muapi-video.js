#!/usr/bin/env node
/**
 * MuAPI video CLI for text-to-video and image-to-video marketing footage.
 *
 * The default API origin is intentionally fixed to api.muapi.ai. Generation
 * POSTs are sent once; only bounded result GET polling is retried. Credentials
 * are never included in model-output downloads.
 */

const API_BASE = 'https://api.muapi.ai';
const DEFAULT_MODEL = 'hunyuan-text-to-video';
const DEFAULT_MAX_POLLS = 60;
const MAX_ALLOWED_POLLS = 120;
const RETRYABLE_STATUS = new Set([408, 429]);

function parseArgs(argv) {
  const result = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith('--')) {
      result._.push(arg);
      continue;
    }
    const key = arg.slice(2);
    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      result[key] = next;
      index += 1;
    } else {
      result[key] = true;
    }
  }
  return result;
}

function requireApiKey() {
  const key = process.env.MUAPI_API_KEY;
  if (!key) throw new Error('MUAPI_API_KEY environment variable required');
  return key;
}

function modelProfile(model) {
  const profiles = {
    'hunyuan-text-to-video': {
      category: 'Text to Video',
      endpoint: '/api/v1/hunyuan-text-to-video',
      input: { prompt: { type: 'string' }, aspect_ratio: { enum: ['16:9', '9:16', '1:1'] } },
    },
    'hunyuan-image-to-video': {
      category: 'Image to Video',
      endpoint: '/api/v1/hunyuan-image-to-video',
      input: {
        prompt: { type: 'string' },
        image_url: { type: 'string' },
        aspect_ratio: { enum: ['16:9', '9:16', '1:1'] },
      },
    },
  };
  return profiles[model] || null;
}

function inputSchema(modelDetails) {
  return modelDetails?.input_schema?.schemas?.input_data
    || modelDetails?.inputSchema?.schemas?.input_data
    || null;
}

function schemaProperties(profile, details) {
  return inputSchema(details)?.properties || profile?.input || {};
}

export function buildPayload({ model = DEFAULT_MODEL, prompt, image, aspectRatio = '16:9', details = null }) {
  if (!prompt || !prompt.trim()) throw new Error('--prompt is required');
  const profile = modelProfile(model);
  if (!profile && !details) throw new Error(`Unknown model '${model}'; run models first or use a supported model`);
  const properties = schemaProperties(profile, details);
  if (!properties.prompt) throw new Error(`Model '${model}' does not expose a prompt field`);

  const payload = { prompt };
  if (properties.aspect_ratio) {
    const allowed = properties.aspect_ratio.enum || ['16:9', '9:16', '1:1'];
    if (!allowed.includes(aspectRatio)) {
      throw new Error(`--aspect-ratio must be one of: ${allowed.join(', ')}`);
    }
    payload.aspect_ratio = aspectRatio;
  }

  const imageField = properties.image_url ? 'image_url' : properties.images_list ? 'images_list' : null;
  const isImageModel = /image\s*to\s*video/i.test(profile?.category || details?.category || '') || Boolean(imageField);
  if (isImageModel) {
    if (!image) throw new Error('--image is required for image-to-video models');
    if (!/^https:\/\//i.test(image)) throw new Error('--image must be an HTTPS URL');
    payload[imageField || 'image_url'] = imageField === 'images_list' ? [image] : image;
  } else if (image) {
    throw new Error(`Model '${model}' is text-to-video; omit --image or select an image-to-video model`);
  }
  return payload;
}

async function jsonBody(response) {
  return response.json().catch(() => ({}));
}

function requestId(body) {
  return body?.request_id || body?.data?.request_id || body?.id || body?.data?.id || body?.output?.id || null;
}

async function requestJson({ method, url, apiKey, body, fetchImpl = fetch }) {
  const response = await fetchImpl(url, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(apiKey ? { 'x-api-key': apiKey } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const payload = await jsonBody(response);
  if (!response.ok) {
    const error = new Error(`${method} ${url} failed: ${payload?.error || payload?.message || `HTTP ${response.status}`}`);
    error.status = response.status;
    throw error;
  }
  return payload;
}

export async function discoverModel({ model = DEFAULT_MODEL, apiBase = API_BASE, fetchImpl = fetch }) {
  const profile = modelProfile(model);
  const details = await requestJson({
    method: 'GET',
    url: `${apiBase}/api/v1/models/${encodeURIComponent(model)}`,
    fetchImpl,
  });
  const endpoint = details.endpoint || profile?.endpoint;
  if (!endpoint || !endpoint.startsWith('/api/v1/')) throw new Error(`Model '${model}' did not return a valid /api/v1 endpoint`);
  const category = details.category || profile?.category || '';
  if (!/^(text|image)\s+to\s+video$/i.test(category)) throw new Error(`Model '${model}' must be a text-to-video or image-to-video model`);
  return { ...details, endpoint, category };
}

export async function submitGeneration({ apiBase = API_BASE, apiKey, endpoint, payload, fetchImpl = fetch }) {
  if (!apiKey) throw new Error('MUAPI_API_KEY environment variable required');
  const response = await requestJson({
    method: 'POST',
    url: `${apiBase}${endpoint}`,
    apiKey,
    body: payload,
    fetchImpl,
  });
  const id = requestId(response);
  if (!id) throw new Error('MuAPI submission did not return a request ID');
  return { ...response, request_id: id };
}

function collectVideoUrls(value, urls = []) {
  if (typeof value === 'string' && /^https:\/\//i.test(value) && /\.(?:mp4|webm|mov)(?:$|\?)/i.test(value)) urls.push(value);
  if (Array.isArray(value)) value.forEach((item) => collectVideoUrls(item, urls));
  if (value && typeof value === 'object') Object.values(value).forEach((item) => collectVideoUrls(item, urls));
  return urls;
}

export function selectVideoUrl(result) {
  return collectVideoUrls(result)[0] || null;
}

export async function pollGeneration({
  apiBase = API_BASE,
  apiKey,
  id,
  maxPolls = DEFAULT_MAX_POLLS,
  pollIntervalMs = 2000,
  sleepImpl = (delay) => new Promise((resolveSleep) => setTimeout(resolveSleep, delay)),
  fetchImpl = fetch,
}) {
  if (!Number.isInteger(maxPolls) || maxPolls < 1 || maxPolls > MAX_ALLOWED_POLLS) {
    throw new Error(`--max-polls must be an integer from 1 to ${MAX_ALLOWED_POLLS}`);
  }
  for (let attempt = 0; attempt < maxPolls; attempt += 1) {
    try {
      const result = await requestJson({
        method: 'GET',
        url: `${apiBase}/api/v1/predictions/${encodeURIComponent(id)}/result`,
        apiKey,
        fetchImpl,
      });
      const status = String(result?.status || result?.data?.status || result?.output?.status || '').toLowerCase();
      if (['completed', 'succeeded', 'success'].includes(status) || selectVideoUrl(result)) return result;
      if (['failed', 'error', 'canceled', 'cancelled', 'timeout'].includes(status)) {
        throw new Error(result?.error || result?.data?.error || `MuAPI prediction ${status}`);
      }
    } catch (error) {
      const retryable = RETRYABLE_STATUS.has(error.status) || error.status >= 500;
      if (!retryable) throw error;
    }
    if (attempt + 1 < maxPolls) await sleepImpl(pollIntervalMs);
  }
  throw new Error(`MuAPI prediction did not complete after ${maxPolls} polls`);
}

export async function downloadVideo(url, output, fetchImpl = fetch) {
  if (!/^https:\/\//i.test(url)) throw new Error('Refusing to download a non-HTTPS video URL');
  const response = await fetchImpl(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`Video download failed: HTTP ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const { writeFileSync } = await import('node:fs');
  writeFileSync(output, buffer);
  return buffer.length;
}

function usage() {
  console.log(`MuAPI video CLI

Commands:
  models                                  Discover the current video catalog entry
  generate --prompt <text> [options]     Submit one text/image-to-video request
  status --request-id <id>                Fetch one prediction result

Options:
  --model <name>          Default: ${DEFAULT_MODEL}
  --image <https-url>     Required for image-to-video models
  --aspect-ratio <ratio>  Default: 16:9
  --output <file>         Download the first completed MP4/WebM/MOV
  --no-poll               Submit once and print the request ID
  --max-polls <n>         Bounded GET polls (default: ${DEFAULT_MAX_POLLS})
  --dry-run               Print the request without network or credentials`);
}

export async function run(argv = process.argv.slice(2), deps = {}) {
  const args = parseArgs(argv);
  const [command] = args._;
  if (!command || args.help) {
    usage();
    return;
  }
  const apiBase = deps.apiBase || API_BASE;
  const fetchImpl = deps.fetchImpl;

  if (command === 'models') {
    const model = args.model || DEFAULT_MODEL;
    const details = await discoverModel({ model, apiBase, fetchImpl });
    console.log(JSON.stringify({ name: model, category: details.category, endpoint: details.endpoint }, null, 2));
    return details;
  }

  if (command === 'status') {
    if (!args['request-id']) throw new Error('--request-id is required');
    const result = await requestJson({
      method: 'GET',
      url: `${apiBase}/api/v1/predictions/${encodeURIComponent(args['request-id'])}/result`,
      apiKey: requireApiKey(),
      fetchImpl,
    });
    console.log(JSON.stringify(result, null, 2));
    return result;
  }

  if (command !== 'generate') throw new Error(`Unknown command '${command}'`);
  const model = args.model || DEFAULT_MODEL;
  const profile = modelProfile(model);
  const details = args['dry-run'] ? profile : await discoverModel({ model, apiBase, fetchImpl });
  const payload = buildPayload({
    model,
    prompt: args.prompt,
    image: args.image,
    aspectRatio: args['aspect-ratio'] || '16:9',
    details,
  });
  const endpoint = details.endpoint || profile?.endpoint;
  if (args['dry-run']) {
    console.log(JSON.stringify({ model, endpoint, payload }, null, 2));
    return { model, endpoint, payload };
  }

  const submitted = await submitGeneration({
    apiBase,
    apiKey: requireApiKey(),
    endpoint,
    payload,
    fetchImpl,
  });
  console.log(`MuAPI request: ${submitted.request_id}`);
  if (args['no-poll']) {
    console.log(JSON.stringify(submitted, null, 2));
    return submitted;
  }

  const result = await pollGeneration({
    apiBase,
    apiKey: process.env.MUAPI_API_KEY,
    id: submitted.request_id,
    maxPolls: Number.parseInt(args['max-polls'] || String(DEFAULT_MAX_POLLS), 10),
    sleepImpl: deps.sleepImpl,
    fetchImpl,
  });
  const videoUrl = selectVideoUrl(result);
  if (!videoUrl) throw new Error('Completed MuAPI prediction did not include a downloadable video URL');
  if (args.output) {
    const bytes = await downloadVideo(videoUrl, args.output, fetchImpl);
    console.log(JSON.stringify({ ...result, request_id: submitted.request_id, output: args.output, bytes }, null, 2));
  } else {
    console.log(JSON.stringify({ ...result, request_id: submitted.request_id }, null, 2));
  }
  return result;
}

if (process.argv[1] && process.argv[1].endsWith('muapi-video.js')) {
  run().catch((error) => {
    console.error(JSON.stringify({ error: error.message }));
    process.exitCode = 1;
  });
}
