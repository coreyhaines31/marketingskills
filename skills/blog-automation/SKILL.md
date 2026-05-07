---
name: blog-automation
description: "When the user wants to automate blog content creation, generate SEO blog posts at scale, run a blog content pipeline, find trending topics, create blog images, or publish articles to Shopify in draft mode. Use when the user says 'automate my blog,' 'generate a blog post,' 'find trending topics,' 'create blog content,' 'post to Shopify blog,' 'blog pipeline,' or references the fragrance-blog CLI. For one-off copywriting, see copywriting. For general SEO audits, see seo-audit."
metadata:
  version: 1.0.0
---

# Blog Automation

You run a fully automated blog content pipeline for Shopify stores. Your output covers topic discovery, SEO content generation, AI image creation with alt text, and draft publishing to Shopify — all through a single repeatable CLI workflow.

## Before Starting

Check if `.agents/product-marketing-context.md` exists and read it. If not, confirm:
- Brand name and store URL
- Niche (e.g., dupe fragrances)
- Target audience and tone
- Shopify blog ID (needed for publishing)

---

## The Pipeline

Every blog post moves through four stages:

```
discover → generate → images → publish (draft)
```

Run all four at once: `node fragrance-blog.js run --topic "..."`  
Or step through each stage manually for more control.

---

## Stage 1: Discover Trending Topics

```bash
node tools/clis/fragrance-blog.js discover --count 5
```

Pulls trending posts from Reddit (`r/fragrance`, `r/DupeFinder`, `r/fragrancediscussion`) and uses Claude to rank 5 blog topic ideas by SEO opportunity and search intent.

**Output:** JSON array of topics with `target_keyword`, `search_intent`, `angle`, and `estimated_difficulty`.

**Best topic patterns for dupe fragrance stores:**
- "Best [designer fragrance] dupes" — high commercial intent, consistent search demand
- "[Designer] vs [dupe brand] — is it worth it?" — comparison intent, great for affiliate/CTAs
- "Top [note/accord] dupes under $X" — price-conscious shoppers, high conversion
- "[TikTok viral scent] dupe — what to buy instead" — trending + social traffic
- "[Season/occasion] fragrance dupes" — seasonal relevance, repeatable each year

**Scheduling recommendation:** Run discover 2x per week (Mon + Thu). Pick the highest-opportunity topic for your posting calendar.

---

## Stage 2: Generate Post

```bash
node tools/clis/fragrance-blog.js generate --topic "Best Baccarat Rouge 540 Dupes Under $50"
```

Claude writes a ~1,800-word blog post and returns structured JSON including:
- `seo_title` — 60-char max title tag
- `meta_description` — 150–155 chars with CTA
- `h1` — post heading
- `url_slug` — hyphenated URL
- `body_html` — full HTML body with H2/H3/table/ul
- `faq` — 5–7 Q&A pairs (auto-embedded as JSON-LD schema)
- `image_prompts` — 3 prompts (hero, comparison, lifestyle) with style preset
- `tags` — 4 Shopify tags for organization

**Post structure (high-retention):**
1. Hook (surprising stat or bold claim, 2–3 sentences)
2. Brief context ("what makes a good dupe?")
3. 3–6 main sections, each covering a specific dupe or category
4. Comparison table (HTML `<table>`)
5. FAQ (schema-ready, injected as JSON-LD)
6. Conclusion + CTA

Saved to: `output/posts/YYYY-MM-DD-{slug}.json`

---

## Stage 3: Generate Images

```bash
node tools/clis/fragrance-blog.js images --file output/posts/2024-01-15-post.json
```

For each image prompt in the post (hero, comparison, lifestyle):
1. Generates image via OpenAI `gpt-image-1` at 1536×1024
2. Refines alt text via Claude (keyword-rich, 125 char max)
3. Uploads to Shopify Files API → gets permanent CDN URL
4. Embeds images back into `body_html`
5. Updates the post JSON with CDN URLs

**Image style presets** (set via `IMAGE_STYLE` env var):
- `luxury-minimal` — dark marble, golden lighting, editorial (default)
- `bright-editorial` — white marble, clean flat-lay, magazine style
- `moody-dark` — black background, dramatic single-bottle lighting

For brand consistency, keep `IMAGE_STYLE` fixed across all posts.

---

## Stage 4: Publish Draft to Shopify

```bash
node tools/clis/fragrance-blog.js publish --file output/posts/2024-01-15-post.json
```

Creates a **draft** Shopify article (never published live automatically) with:
- Title, body_html, author, tags
- `published: false` — always draft mode for human review
- Global metafields for SEO title + meta description
- Hero image set as article featured image

Returns: `admin_url` for direct access in Shopify admin to review and publish.

---

## Full Pipeline (One Command)

```bash
node tools/clis/fragrance-blog.js run --topic "Best Baccarat Rouge 540 Dupes Under $50"
```

Runs all four stages sequentially. Skips images if `OPENAI_API_KEY` is missing. Skips Shopify publish if Shopify vars are missing (saves file locally instead).

---

## Repeatable Weekly Schedule

**Recommended cadence: 3 posts/week (Mon, Wed, Fri)**

| Day | Action | Command |
|-----|--------|---------|
| Monday AM | Discover topics | `discover --count 7` |
| Monday PM | Generate Mon post | `run --topic "..."` |
| Tuesday AM | Review + edit draft in Shopify admin | Manual |
| Tuesday PM | Publish Monday post | Manual in Shopify |
| Wednesday | Generate + review Wed post | `run --topic "..."` |
| Friday | Generate + review Fri post | `run --topic "..."` |

**Automating with cron** (example — runs Mon/Wed/Fri at 7am):
```bash
0 7 * * 1,3,5 cd /path/to/project && node tools/clis/fragrance-blog.js run --topic "$TOPIC_OF_DAY" >> logs/blog.log 2>&1
```

For fully automated topic selection, pipe `discover` output into `generate`:
```bash
node fragrance-blog.js discover --count 1 | node -e "
  const d = require('fs').readFileSync('/dev/stdin','utf8');
  const topics = JSON.parse(d);
  const t = topics[0].topic;
  const { execSync } = require('child_process');
  execSync('node fragrance-blog.js run --topic \"' + t + '\"', { stdio: 'inherit' });
"
```

---

## Environment Setup

Copy these to a `.env` file (never commit it):

```bash
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
SHOPIFY_STORE_URL=mystore.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_...
SHOPIFY_BLOG_ID=12345678
BLOG_BRAND_NAME=Asi
BLOG_AUTHOR=Asi Editors
IMAGE_STYLE=luxury-minimal
```

Load with: `export $(cat .env | xargs) && node tools/clis/fragrance-blog.js run --topic "..."`

---

## Output File Structure

Every generated post is saved as a JSON file at `output/posts/YYYY-MM-DD-{slug}.json` containing all metadata, HTML body, images, and the Shopify article ID after publishing. This serves as a content record and lets you re-publish or update later.

```
output/
├── posts/
│   ├── 2024-01-15-best-baccarat-rouge-540-dupes.json
│   └── 2024-01-17-dior-sauvage-alternatives.json
└── images/
    ├── best-baccarat-rouge-540-dupes-hero.png
    └── best-baccarat-rouge-540-dupes-lifestyle.png
```

---

## SEO Strategy Notes

**Internal linking:** After generating a few posts, weave in links between related topics. The CLI generates `[INTERNAL LINK: ...]` placeholders for manual insertion.

**Topic clustering:** Build around anchor topics (e.g., "Baccarat Rouge dupes", "Dior dupes", "Maison Margiela dupes") and link satellite posts back to them.

**Schema:** Every post includes FAQ schema (JSON-LD) for rich snippets. Add BlogPosting schema manually or via your Shopify theme.

**Freshness:** Re-generate posts annually with current prices and availability. Use the same `url_slug` when updating.

---

## Related Skills

- **seo-content**: For deeper SEO content strategy and optimization
- **programmatic-seo**: For scaling to hundreds of keyword-targeted pages
- **image**: For advanced AI image generation strategies
- **content-strategy**: For editorial calendar planning
- **copywriting**: For manual post writing and refinement
