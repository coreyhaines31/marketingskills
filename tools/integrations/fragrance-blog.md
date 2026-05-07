# Fragrance Blog Automation — Integration Guide

End-to-end setup for the automated blog pipeline: Reddit topic discovery → Claude content generation → gpt-image-1 images → Shopify draft publishing.

**CLI:** `tools/clis/fragrance-blog.js`  
**Skill:** `skills/blog-automation/SKILL.md`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  fragrance-blog.js                       │
│                                                          │
│  discover     Reddit JSON API (public, no auth)          │
│               └→ Claude (topic ranking + ideation)       │
│                                                          │
│  generate     Claude claude-sonnet-4-6                   │
│               └→ SEO meta + HTML body + FAQ + prompts    │
│                                                          │
│  images       OpenAI gpt-image-1 (1536×1024)            │
│               └→ Claude (alt text refinement)            │
│               └→ Shopify Files API (CDN hosting)         │
│                                                          │
│  publish      Shopify Admin API (draft article)          │
│               └→ Sets metafields for SEO title/desc      │
└─────────────────────────────────────────────────────────┘
```

---

## Prerequisites

- Node.js 18+ (uses `fetch` built-in)
- Anthropic API key
- OpenAI API key
- Shopify store with blog created (not the default news blog — create a dedicated "Fragrance Guides" or "Journal" blog)
- Shopify Admin API access token

---

## Step 1: Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. API Keys → Create Key
3. Set: `ANTHROPIC_API_KEY=sk-ant-...`

Used for: content generation (`claude-sonnet-4-6`) and alt text refinement.

---

## Step 2: OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. API Keys → Create new secret key
3. Set: `OPENAI_API_KEY=sk-...`

Used for: `gpt-image-1` image generation at 1536×1024 resolution.

**Cost estimate:** ~$0.04–0.08 per image. 3 images/post × 3 posts/week = ~$0.36–0.72/week.

---

## Step 3: Shopify Setup

### 3a. Create a Blog

In Shopify admin: Online Store → Blog Posts → Manage Blogs → Add Blog

Recommended blog name: **"Fragrance Guides"** or **"The Dupe Edit"**

### 3b. Get Your Blog ID

In Shopify admin, navigate to your blog's settings. The URL will contain the blog ID:
```
https://yourstore.myshopify.com/admin/blogs/12345678
                                              ^^^^^^^^
                                              This is SHOPIFY_BLOG_ID
```

Or via the Admin API:
```bash
curl https://yourstore.myshopify.com/admin/api/2024-04/blogs.json \
  -H "X-Shopify-Access-Token: YOUR_TOKEN"
```

### 3c. Create Admin API Access Token

1. Shopify admin → Settings → Apps and sales channels → Develop apps
2. Create an app → Configure Admin API scopes
3. **Required scopes:**
   - `write_content` (create/edit blog articles)
   - `write_files` (upload images to CDN)
   - `read_content` (verify articles)
4. Install app → Copy the access token
5. Set: `SHOPIFY_ACCESS_TOKEN=shpat_...`

### 3d. Set Your Store URL

```bash
SHOPIFY_STORE_URL=yourstore.myshopify.com
```

No `https://`, no trailing slash.

---

## Step 4: Environment File

Create `.env` in your project root:

```bash
# Content generation
ANTHROPIC_API_KEY=sk-ant-api03-...

# Image generation
OPENAI_API_KEY=sk-proj-...

# Shopify
SHOPIFY_STORE_URL=yourstore.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_...
SHOPIFY_BLOG_ID=12345678

# Brand config
BLOG_BRAND_NAME=Asi
BLOG_AUTHOR=Asi Editors
IMAGE_STYLE=luxury-minimal

# Optional: change output directory
OUTPUT_DIR=./output/posts
```

Load env and run:
```bash
export $(cat .env | xargs) && node tools/clis/fragrance-blog.js discover
```

---

## Step 5: Syntax Check

```bash
node --check tools/clis/fragrance-blog.js
```

Verify commands work (dry-run doesn't call any APIs):
```bash
export $(cat .env | xargs)
node tools/clis/fragrance-blog.js discover --dry-run
node tools/clis/fragrance-blog.js generate --topic "test" --dry-run
```

---

## Running the Pipeline

### Full pipeline (one command):
```bash
node tools/clis/fragrance-blog.js run --topic "Best Baccarat Rouge 540 Dupes Under $50"
```

### Step by step:
```bash
# 1. Discover topics
node tools/clis/fragrance-blog.js discover --count 7

# 2. Generate a post
node tools/clis/fragrance-blog.js generate \
  --topic "Best Baccarat Rouge 540 Dupes Under $50"

# 3. Generate + upload images
node tools/clis/fragrance-blog.js images \
  --file output/posts/2024-01-15-best-baccarat-rouge-540-dupes-under-50.json

# 4. Publish as draft
node tools/clis/fragrance-blog.js publish \
  --file output/posts/2024-01-15-best-baccarat-rouge-540-dupes-under-50.json
```

### Output:
```json
{
  "success": true,
  "article_id": 987654321,
  "admin_url": "https://yourstore.myshopify.com/admin/articles/987654321",
  "status": "draft"
}
```

Open the `admin_url` to review, edit, and publish from Shopify admin.

---

## Weekly Content Calendar Template

| Week | Monday | Wednesday | Friday |
|------|--------|-----------|--------|
| 1 | Best BR540 dupes under $50 | Dior Sauvage alternatives | TikTok viral dupes roundup |
| 2 | Maison Margiela Replica dupes | Chanel No5 alternatives | Best summer fragrance dupes |
| 3 | Creed Aventus dupe guide | YSL Black Opium dupes | Best unisex fragrance dupes |
| 4 | Mugler Angel dupes | Best office-safe fragrance dupes | Fall fragrance dupe picks |

**High-value evergreen topics to always have in rotation:**
- "Best [X] dupe" for all top 10 luxury fragrances
- "[Price range] dupes" (under $20, $30, $50)
- "[Occasion] fragrance dupes" (date night, office, gym)
- "[Season] fragrance dupes" (summer, winter, spring)
- "[Note/accord] fragrances" (oud, vanilla, citrus, fresh)

---

## Scheduling with Cron

### Fully automated daily pipeline

Create a shell script `run-blog.sh`:
```bash
#!/bin/bash
export $(cat /path/to/project/.env | xargs)

# Get top topic from Reddit automatically
TOPIC=$(node /path/to/fragrance-blog.js discover --count 1 | \
  node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); \
  console.log(JSON.parse(d)[0].topic)")

node /path/to/fragrance-blog.js run --topic "$TOPIC" \
  >> /path/to/logs/blog-$(date +%Y-%m-%d).log 2>&1
```

Add to crontab (runs Mon, Wed, Fri at 6 AM):
```
0 6 * * 1,3,5 /path/to/run-blog.sh
```

### Using Claude Code scheduled tasks
```bash
# Schedule via the schedule skill
/schedule "Every Monday, Wednesday, and Friday at 6am: run fragrance blog pipeline"
```

---

## Post-Generation Checklist (Manual Review in Shopify Admin)

Before publishing each draft:

- [ ] Read through body_html for accuracy (fragrance names, prices, notes)
- [ ] Verify internal links to product pages are correct
- [ ] Confirm images render properly and alt text is descriptive
- [ ] Check SEO title is ≤60 chars and includes target keyword
- [ ] Check meta description is 150–155 chars with a CTA
- [ ] Preview mobile layout
- [ ] Set a publish date/time in Shopify admin

---

## Shopify Theme: Enabling SEO Metafields

The pipeline writes SEO title + description to Shopify global metafields (`global.title_tag` and `global.description_tag`). To use them in your theme:

```liquid
{% if article.metafields.global.title_tag != blank %}
  <title>{{ article.metafields.global.title_tag }}</title>
{% else %}
  <title>{{ article.title }} — {{ shop.name }}</title>
{% endif %}

{% if article.metafields.global.description_tag != blank %}
  <meta name="description" content="{{ article.metafields.global.description_tag }}">
{% endif %}
```

Most modern Shopify themes (Dawn, Sense, etc.) handle this automatically via the Online Store 2.0 metafields system.

---

## Troubleshooting

**`ANTHROPIC_API_KEY required` error**
→ Export env vars before running: `export $(cat .env | xargs)`

**`Shopify publish failed: {"errors":{"blog_id":["Blog not found"]}}`**
→ Verify `SHOPIFY_BLOG_ID` is the numeric blog ID, not the handle

**`OpenAI error: {"error":{"code":"model_not_found"}}`**
→ `gpt-image-1` requires Tier 1+ API access. Check [platform.openai.com/account/limits](https://platform.openai.com/account/limits). Fallback: use `dall-e-3` by editing line 97 of fragrance-blog.js

**Reddit fetch returns empty posts**
→ Reddit rate-limits scrapers. Add a delay between requests or use their OAuth API. The pipeline still generates content — it just uses keyword patterns instead of live trending data.

**Images not showing in Shopify**
→ Verify `write_files` scope is enabled on your Shopify app. Re-install the app after changing scopes.

---

## Related Integrations

- [ga4.md](ga4.md) — Track blog traffic and conversions
- [klaviyo.md](klaviyo.md) — Email new blog posts to subscribers  
- [composio.md](composio.md) — Auto-share posts to social media via Slack/Notion triggers
