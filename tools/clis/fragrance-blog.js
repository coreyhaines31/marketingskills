#!/usr/bin/env node
/**
 * fragrance-blog.js — Automated blog pipeline for dupe fragrance stores
 *
 * Commands:
 *   discover [--count N]              Trending topics from Reddit + keyword patterns
 *   generate --topic "..."            Full post: SEO meta, HTML body, FAQ, image prompts
 *   images --file path.json           Generate images via gpt-image-1, upload to Shopify
 *   publish --file path.json          Create draft article on Shopify
 *   run [--topic "..."]               Full pipeline: discover → generate → images → publish
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY      Content + alt text (claude-sonnet-4-6)
 *   OPENAI_API_KEY         gpt-image-1 image generation
 *   SHOPIFY_STORE_URL      e.g., mystore.myshopify.com
 *   SHOPIFY_ACCESS_TOKEN   Admin API token (write_content + write_files scopes)
 *   SHOPIFY_BLOG_ID        Numeric blog ID to post to
 *
 * Optional env vars:
 *   BLOG_BRAND_NAME        Brand name (default: "Asi")
 *   BLOG_AUTHOR            Author name (default: "Asi Editors")
 *   IMAGE_STYLE            luxury-minimal | bright-editorial | moody-dark (default: luxury-minimal)
 *   OUTPUT_DIR             Directory for saved post files (default: ./output/posts)
 */

const https = require('https')
const fs = require('fs')
const path = require('path')

// ── Config ────────────────────────────────────────────────────────────────────

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN
const SHOPIFY_BLOG_ID = process.env.SHOPIFY_BLOG_ID
const BRAND_NAME = process.env.BLOG_BRAND_NAME || 'Asi'
const BLOG_AUTHOR = process.env.BLOG_AUTHOR || `${BRAND_NAME} Editors`
const IMAGE_STYLE = process.env.IMAGE_STYLE || 'luxury-minimal'
const OUTPUT_DIR = process.env.OUTPUT_DIR || path.join(process.cwd(), 'output', 'posts')

const IMAGE_STYLE_PRESETS = {
  'luxury-minimal': 'dark slate or marble surface, luxury glass perfume bottles with elegant labels, warm golden rim lighting, cinematic shallow depth of field, editorial fragrance photography, premium aesthetic, 16:9 ratio',
  'bright-editorial': 'white marble background, colorful perfume bottles arranged artfully, clean bright editorial lighting, crisp shadows, magazine-worthy flat-lay composition, luxury fragrance brand aesthetic',
  'moody-dark': 'black velvet background, single perfume bottle with dramatic side lighting creating light refraction and lens flare, luxury dark editorial, cinematic atmosphere',
}

const SHOPIFY_API_VERSION = '2024-04'

// ── Argument parsing ──────────────────────────────────────────────────────────

function parseArgs(argv) {
  const result = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = argv[i + 1]
      if (next && !next.startsWith('--')) { result[key] = next; i++ }
      else result[key] = true
    } else {
      result._.push(arg)
    }
  }
  return result
}

const args = parseArgs(process.argv.slice(2))
const [cmd] = args._

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks = []
      res.on('data', (c) => chunks.push(c))
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString()
        try { resolve({ status: res.status || res.statusCode, body: JSON.parse(text) }) }
        catch { resolve({ status: res.statusCode, body: text }) }
      })
    })
    req.on('error', reject)
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body))
    req.end()
  })
}

async function get(url, headers = {}) {
  const u = new URL(url)
  const opts = { hostname: u.hostname, path: u.pathname + u.search, method: 'GET', headers: { 'User-Agent': 'fragrance-blog-bot/1.0', ...headers } }
  if (args['dry-run']) return { _dry_run: true, url }
  return request(opts)
}

async function post(url, body, headers = {}) {
  const u = new URL(url)
  const payload = typeof body === 'string' ? body : JSON.stringify(body)
  const opts = {
    hostname: u.hostname,
    path: u.pathname + u.search,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), ...headers },
  }
  if (args['dry-run']) return { _dry_run: true, url, body }
  return request(opts, payload)
}

// ── Claude API ────────────────────────────────────────────────────────────────

async function claude(systemPrompt, userPrompt, jsonMode = false) {
  if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY required')
  const body = {
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  }
  if (jsonMode) {
    body.system += '\n\nYou MUST respond with valid JSON only. No markdown, no code fences, no explanation outside the JSON object.'
  }
  const res = await post('https://api.anthropic.com/v1/messages', body, {
    'x-api-key': ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
  })
  if (res._dry_run) return res
  if (res.body?.content?.[0]?.text) return res.body.content[0].text.trim()
  throw new Error(`Claude error: ${JSON.stringify(res.body)}`)
}

// ── OpenAI image generation ───────────────────────────────────────────────────

async function generateImage(prompt) {
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY required')
  const res = await post(
    'https://api.openai.com/v1/images/generations',
    { model: 'gpt-image-1', prompt, n: 1, size: '1536x1024', output_format: 'png' },
    { Authorization: `Bearer ${OPENAI_API_KEY}` }
  )
  if (res._dry_run) return res
  if (res.body?.data?.[0]?.b64_json) return res.body.data[0].b64_json
  if (res.body?.data?.[0]?.url) return { url: res.body.data[0].url }
  throw new Error(`OpenAI error: ${JSON.stringify(res.body)}`)
}

// ── Shopify API ───────────────────────────────────────────────────────────────

function shopifyHeaders() {
  return { 'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN, 'Content-Type': 'application/json' }
}

async function shopifyPost(endpoint, body) {
  if (!SHOPIFY_STORE_URL || !SHOPIFY_ACCESS_TOKEN) throw new Error('SHOPIFY_STORE_URL and SHOPIFY_ACCESS_TOKEN required')
  return post(`https://${SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}${endpoint}`, body, shopifyHeaders())
}

async function uploadImageToShopify(b64Data, filename, alt) {
  const res = await shopifyPost('/files.json', {
    file: { alt, content_type: 'image/png', filename, attachment: b64Data },
  })
  if (res._dry_run) return `https://cdn.shopify.com/dry-run/${filename}`
  const src = res.body?.file?.url || res.body?.file?.src
  if (!src) throw new Error(`Shopify file upload failed: ${JSON.stringify(res.body)}`)
  return src
}

async function publishDraftArticle(article) {
  if (!SHOPIFY_BLOG_ID) throw new Error('SHOPIFY_BLOG_ID required')
  const res = await shopifyPost(`/blogs/${SHOPIFY_BLOG_ID}/articles.json`, { article })
  if (res._dry_run) return res
  if (res.body?.article?.id) return res.body.article
  throw new Error(`Shopify publish failed: ${JSON.stringify(res.body)}`)
}

// ── Reddit topic discovery ────────────────────────────────────────────────────

async function fetchRedditPosts(subreddit, query = null, sort = 'hot') {
  const path = query
    ? `/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&sort=top&t=week&limit=20`
    : `/r/${subreddit}/${sort}.json?limit=20`
  const res = await get(`https://www.reddit.com${path}`, {
    'User-Agent': 'fragrance-blog-research-bot/1.0',
    Accept: 'application/json',
  })
  if (res._dry_run || !res.body?.data?.children) return []
  return res.body.data.children.map((p) => ({
    title: p.data.title,
    score: p.data.score,
    comments: p.data.num_comments,
    flair: p.data.link_flair_text || '',
  }))
}

// ── Commands ──────────────────────────────────────────────────────────────────

async function cmdDiscover() {
  const count = parseInt(args.count || '5', 10)

  console.error('[discover] Fetching Reddit trending posts...')
  const [frHot, dupeFinder, fragranceSearch] = await Promise.all([
    fetchRedditPosts('fragrance', 'dupe'),
    fetchRedditPosts('DupeFinder', null, 'hot'),
    fetchRedditPosts('fragrancediscussion', 'alternative dupe'),
  ])

  const allPosts = [...frHot, ...dupeFinder, ...fragranceSearch]
    .sort((a, b) => b.score + b.comments * 2 - (a.score + a.comments * 2))
    .slice(0, 30)
    .map((p) => `- ${p.title} (score: ${p.score}, comments: ${p.comments})`)
    .join('\n')

  const today = new Date().toISOString().slice(0, 10)

  const system = `You are an SEO content strategist specializing in fragrance dupes.
You analyze trending topics to identify high-traffic blog opportunities.`

  const prompt = `Today is ${today}. Based on these trending Reddit posts in the fragrance dupe community:

${allPosts || '[No Reddit posts fetched — generate ideas based on evergreen dupe fragrance trends]'}

Generate exactly ${count} blog topic ideas for ${BRAND_NAME}, a dupe fragrance store.
Each topic must:
- Target a specific high-intent search query (e.g., "best baccarat rouge 540 dupe")
- Have clear commercial/informational intent
- Be timely or evergreen
- Appeal to fragrance fans who want luxury scents at affordable prices

Return a JSON array with this exact structure:
[
  {
    "topic": "The full blog post title",
    "target_keyword": "primary SEO keyword phrase",
    "search_intent": "informational | commercial | transactional",
    "angle": "one sentence describing the unique angle or hook",
    "estimated_difficulty": "low | medium | high"
  }
]`

  const raw = await claude(system, prompt, true)
  if (raw._dry_run) { console.log(JSON.stringify(raw, null, 2)); return }

  let topics
  try { topics = JSON.parse(raw) }
  catch { topics = JSON.parse(raw.match(/\[[\s\S]+\]/)?.[0] || '[]') }

  console.log(JSON.stringify(topics, null, 2))
}

async function cmdGenerate() {
  const topic = args.topic
  if (!topic) { console.error('Error: --topic "Your Topic Here" is required'); process.exit(1) }

  const targetLength = parseInt(args['target-length'] || '1800', 10)
  const today = new Date().toISOString().slice(0, 10)

  console.error(`[generate] Generating post for: "${topic}"`)

  const styleDesc = IMAGE_STYLE_PRESETS[IMAGE_STYLE] || IMAGE_STYLE_PRESETS['luxury-minimal']

  const system = `You are a senior content writer and SEO specialist for ${BRAND_NAME}, a dupe fragrance store.
You write high-retention blog posts that rank on Google and convert readers into buyers.
Your writing style: direct, specific, conversational, trust-building. No fluff.`

  const prompt = `Write a complete, SEO-optimized blog post for ${BRAND_NAME} about: "${topic}"

Today's date: ${today}
Target word count: ~${targetLength} words
Brand: ${BRAND_NAME} (dupe fragrance store — sells affordable alternatives to luxury fragrances)

CONTENT REQUIREMENTS:
- Open with a hook: surprising stat, bold claim, or relatable question (2-3 sentences max)
- Use H2/H3 heading structure for scannability
- Include specific fragrance names, notes, and price comparisons
- Weave in CTAs naturally ("Shop [product] at ${BRAND_NAME}")
- End with a FAQ section (5-7 questions, schema-ready)
- Conclude with a strong CTA paragraph

STRUCTURE:
1. Hook intro (not starting with brand name)
2. "What makes a good dupe?" context section
3. 3-6 main sections (e.g., each covering a dupe or category)
4. Comparison table (HTML <table>)
5. FAQ section (Q&A format)
6. Conclusion + CTA

Return a JSON object with this EXACT structure:
{
  "seo_title": "60-char max title tag with primary keyword",
  "meta_description": "150-155 char meta description with keyword + CTA",
  "h1": "The actual H1 heading for the post",
  "url_slug": "hyphenated-url-slug",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "focus_keyword": "primary target keyword",
  "author": "${BLOG_AUTHOR}",
  "body_html": "full HTML content (H2s, H3s, p, ul, table, strong) — NO outer wrapper div",
  "faq": [
    { "question": "Question text?", "answer": "Answer text." }
  ],
  "image_prompts": [
    {
      "role": "hero",
      "prompt": "Specific image prompt. Style: ${styleDesc}",
      "alt_text_draft": "Descriptive alt text for this image"
    },
    {
      "role": "comparison",
      "prompt": "Specific comparison image prompt. Style: ${styleDesc}",
      "alt_text_draft": "Descriptive alt text"
    },
    {
      "role": "lifestyle",
      "prompt": "Lifestyle scene prompt. Style: ${styleDesc}",
      "alt_text_draft": "Descriptive alt text"
    }
  ]
}`

  const raw = await claude(system, prompt, true)
  if (raw._dry_run) { console.log(JSON.stringify(raw, null, 2)); return }

  let post
  try { post = JSON.parse(raw) }
  catch {
    const match = raw.match(/\{[\s\S]+\}/)
    if (!match) throw new Error('Could not parse Claude response as JSON')
    post = JSON.parse(match[0])
  }

  // Inject FAQ as JSON-LD + append to body
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (post.faq || []).map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  }
  const faqHtml = (post.faq || [])
    .map((q) => `<h3>${q.question}</h3>\n<p>${q.answer}</p>`)
    .join('\n')

  post.body_html = (post.body_html || '') +
    `\n\n<h2>Frequently Asked Questions</h2>\n${faqHtml}` +
    `\n\n<script type="application/ld+json">\n${JSON.stringify(faqSchema, null, 2)}\n</script>`

  post.generated_at = today
  post.topic = topic
  post.published = false

  // Save to output dir
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  const slug = post.url_slug || topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const filename = `${today}-${slug}.json`
  const filepath = path.join(OUTPUT_DIR, filename)
  fs.writeFileSync(filepath, JSON.stringify(post, null, 2))

  console.error(`[generate] Saved to: ${filepath}`)
  console.log(JSON.stringify({ success: true, file: filepath, seo_title: post.seo_title, focus_keyword: post.focus_keyword }, null, 2))
}

async function cmdImages() {
  const file = args.file
  if (!file) { console.error('Error: --file path/to/post.json is required'); process.exit(1) }

  const post = JSON.parse(fs.readFileSync(file, 'utf-8'))
  if (!post.image_prompts?.length) { console.error('No image_prompts in post file'); process.exit(1) }

  console.error(`[images] Generating ${post.image_prompts.length} images...`)

  const imageDir = path.join(path.dirname(file), '..', 'images')
  fs.mkdirSync(imageDir, { recursive: true })

  post.images = post.images || []

  for (let i = 0; i < post.image_prompts.length; i++) {
    const imgPrompt = post.image_prompts[i]
    const role = imgPrompt.role || `image-${i + 1}`
    const slug = post.url_slug || 'post'

    console.error(`[images] Generating ${role} image (${i + 1}/${post.image_prompts.length})...`)

    const b64OrUrl = await generateImage(imgPrompt.prompt)

    // Refine alt text via Claude
    console.error(`[images] Refining alt text for ${role}...`)
    const altText = await claude(
      'You write concise, descriptive, keyword-rich image alt text for SEO. Return only the alt text string, no quotes.',
      `Write alt text for this fragrance blog image. Prompt used: "${imgPrompt.prompt}". Draft alt: "${imgPrompt.alt_text_draft}". Brand: ${BRAND_NAME}. Focus keyword: ${post.focus_keyword || ''}. Max 125 chars.`
    )

    const filename = `${slug}-${role}.png`
    let shopifyCdnUrl

    if (b64OrUrl._dry_run) {
      shopifyCdnUrl = `https://cdn.shopify.com/dry-run/${filename}`
    } else if (typeof b64OrUrl === 'string') {
      // Save locally
      const localPath = path.join(imageDir, filename)
      fs.writeFileSync(localPath, Buffer.from(b64OrUrl, 'base64'))
      console.error(`[images] Saved locally: ${localPath}`)
      console.error(`[images] Uploading to Shopify CDN...`)
      shopifyCdnUrl = await uploadImageToShopify(b64OrUrl, filename, altText)
    } else if (b64OrUrl.url) {
      shopifyCdnUrl = b64OrUrl.url
    }

    post.images.push({ role, url: shopifyCdnUrl, alt: typeof altText === 'string' ? altText.replace(/^"|"$/g, '') : imgPrompt.alt_text_draft })

    // Embed first image as hero in body_html
    if (role === 'hero' && shopifyCdnUrl) {
      post.body_html = `<img src="${shopifyCdnUrl}" alt="${post.images[post.images.length - 1].alt}" style="width:100%;max-width:1200px" loading="eager" />\n\n` + (post.body_html || '')
    }
  }

  fs.writeFileSync(file, JSON.stringify(post, null, 2))
  console.error(`[images] Updated post file: ${file}`)
  console.log(JSON.stringify({ success: true, images: post.images }, null, 2))
}

async function cmdPublish() {
  const file = args.file
  if (!file) { console.error('Error: --file path/to/post.json is required'); process.exit(1) }

  const post = JSON.parse(fs.readFileSync(file, 'utf-8'))
  const heroImage = post.images?.find((i) => i.role === 'hero')

  console.error(`[publish] Publishing draft to Shopify: "${post.h1 || post.seo_title}"`)

  const article = {
    title: post.h1 || post.seo_title,
    body_html: post.body_html,
    author: post.author || BLOG_AUTHOR,
    tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
    published: false,
    metafields: [
      { key: 'title_tag', value: (post.seo_title || '').slice(0, 60), type: 'single_line_text_field', namespace: 'global' },
      { key: 'description_tag', value: (post.meta_description || '').slice(0, 155), type: 'single_line_text_field', namespace: 'global' },
    ],
  }

  if (heroImage?.url) {
    article.image = { src: heroImage.url, alt: heroImage.alt || '' }
  }

  const result = await publishDraftArticle(article)

  if (result._dry_run) { console.log(JSON.stringify(result, null, 2)); return }

  const adminUrl = `https://${SHOPIFY_STORE_URL}/admin/articles/${result.id}`

  // Save the Shopify article ID back to the file
  post.shopify_article_id = result.id
  post.shopify_admin_url = adminUrl
  post.published_at = new Date().toISOString()
  fs.writeFileSync(file, JSON.stringify(post, null, 2))

  console.log(JSON.stringify({ success: true, article_id: result.id, admin_url: adminUrl, status: 'draft' }, null, 2))
}

async function cmdRun() {
  let topic = args.topic

  if (!topic) {
    console.error('[run] No --topic provided. Running discovery first...')
    const originalCount = args.count
    args.count = '5'
    await cmdDiscover()
    args.count = originalCount
    console.error('\n[run] Pick a topic from the list above and re-run with --topic "Your chosen topic"')
    console.error('Example: node fragrance-blog.js run --topic "Best Baccarat Rouge 540 Dupes Under $50"')
    return
  }

  console.error(`[run] Starting full pipeline for: "${topic}"`)

  args.topic = topic
  await cmdGenerate()

  const today = new Date().toISOString().slice(0, 10)
  const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const file = path.join(OUTPUT_DIR, `${today}-${slug}.json`)

  if (fs.existsSync(file)) {
    args.file = file
    if (OPENAI_API_KEY) {
      await cmdImages()
    } else {
      console.error('[run] Skipping image generation — OPENAI_API_KEY not set')
    }
    if (SHOPIFY_STORE_URL && SHOPIFY_ACCESS_TOKEN && SHOPIFY_BLOG_ID) {
      await cmdPublish()
    } else {
      console.error('[run] Skipping Shopify publish — SHOPIFY_* env vars not set')
      console.error(`[run] Post saved locally: ${file}`)
    }
  }
}

// ── Help ──────────────────────────────────────────────────────────────────────

function showHelp() {
  console.log(`
fragrance-blog.js — Automated blog pipeline for dupe fragrance stores

COMMANDS
  discover [--count N]              Trending topics from Reddit (default: 5)
  generate --topic "..."            Full post: SEO meta, HTML body, FAQ, image prompts
  images --file path.json           Generate + upload images via gpt-image-1
  publish --file path.json          Create Shopify draft article
  run [--topic "..."]               Full pipeline (discover if no topic provided)

FLAGS
  --dry-run                         Preview API calls without sending
  --count N                         Number of topics for discover (default: 5)
  --topic "..."                     Blog topic / title for generate/run
  --file path.json                  Input post file for images/publish
  --target-length N                 Target word count for generate (default: 1800)
  --style luxury-minimal            Image style preset (luxury-minimal | bright-editorial | moody-dark)

REQUIRED ENV VARS
  ANTHROPIC_API_KEY                 claude-sonnet-4-6 for content + alt text
  OPENAI_API_KEY                    gpt-image-1 for images
  SHOPIFY_STORE_URL                 mystore.myshopify.com
  SHOPIFY_ACCESS_TOKEN              Admin API token
  SHOPIFY_BLOG_ID                   Numeric blog ID

OPTIONAL ENV VARS
  BLOG_BRAND_NAME                   Brand name in content (default: Asi)
  BLOG_AUTHOR                       Author name (default: Asi Editors)
  IMAGE_STYLE                       Style preset (default: luxury-minimal)
  OUTPUT_DIR                        Output directory (default: ./output/posts)

WORKFLOW EXAMPLE
  # 1. Find trending topics
  node fragrance-blog.js discover --count 5

  # 2. Generate a post
  node fragrance-blog.js generate --topic "Best Baccarat Rouge 540 Dupes Under \\$50"

  # 3. Generate images and upload to Shopify
  node fragrance-blog.js images --file output/posts/2024-01-15-best-baccarat-rouge-540-dupes.json

  # 4. Publish to Shopify as draft
  node fragrance-blog.js publish --file output/posts/2024-01-15-best-baccarat-rouge-540-dupes.json

  # Or run the full pipeline at once
  node fragrance-blog.js run --topic "Best Baccarat Rouge 540 Dupes Under \\$50"
`)
}

// ── Entry point ───────────────────────────────────────────────────────────────

async function main() {
  switch (cmd) {
    case 'discover': await cmdDiscover(); break
    case 'generate': await cmdGenerate(); break
    case 'images': await cmdImages(); break
    case 'publish': await cmdPublish(); break
    case 'run': await cmdRun(); break
    default: showHelp()
  }
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
