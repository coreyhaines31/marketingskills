# Exa

AI-powered web search API built for LLMs and agents. Returns high-quality search results with neural and keyword matching, plus on-demand content retrieval (full text, highlights, and summaries) in a single request.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Search, Find Similar, Contents |
| MCP | ✓ | Official MCP server available |
| CLI | ✓ | [exa.js](../clis/exa.js) |
| SDK | ✓ | `exa-py` (Python), `exa-js` (TypeScript) |

## Authentication

- **Type**: API Key
- **Header**: `x-api-key: {key}`
- **Get key**: https://dashboard.exa.ai

## Endpoints

Base URL: `https://api.exa.ai`

| Endpoint | Purpose |
|----------|---------|
| `POST /search` | Search the web with neural, keyword-like, or auto-routed modes |
| `POST /findSimilar` | Find pages similar to a given URL |
| `POST /contents` | Fetch text, highlights, or summaries for one or more URLs |

## Common Agent Operations

### Web Search with Content

```bash
POST https://api.exa.ai/search
{
  "query": "best B2B SaaS onboarding flows",
  "type": "auto",
  "numResults": 10,
  "contents": {
    "text": { "maxCharacters": 1000 },
    "highlights": true
  }
}
```

### Competitor Content Discovery

```bash
POST https://api.exa.ai/search
{
  "query": "landing page teardowns",
  "includeDomains": ["goodui.org", "growth.design", "marketingexamples.com"],
  "startPublishedDate": "2024-01-01T00:00:00Z",
  "contents": { "highlights": true }
}
```

### Find Similar Pages

```bash
POST https://api.exa.ai/findSimilar
{
  "url": "https://stripe.com/pricing",
  "numResults": 20,
  "contents": { "summary": { "query": "What pricing model and price points does this page use?" } }
}
```

### Category-Filtered Search

```bash
POST https://api.exa.ai/search
{
  "query": "DTC beauty brand raising Series A",
  "category": "news",
  "numResults": 25,
  "startPublishedDate": "2024-06-01T00:00:00Z"
}
```

### Fetch Contents for Known URLs

```bash
POST https://api.exa.ai/contents
{
  "urls": ["https://example.com/post-1", "https://example.com/post-2"],
  "text": true,
  "summary": { "query": "Summarize this article's key argument in one paragraph." }
}
```

## Key Parameters

### Search Types
- `auto` - Automatically routes between neural and keyword matching (default)
- `neural` - Embedding-based semantic search; best for concept/idea queries
- `fast` - Lower-latency neural search
- `instant` - Returns cached results near-instantly
- `deep-lite`, `deep`, `deep-reasoning` - Agentic search variants that plan multiple queries and synthesize

### Categories
`company`, `research paper`, `news`, `personal site`, `financial report`, `people`

### Filtering
- `includeDomains` / `excludeDomains` - Restrict to or exclude specific domains (up to 1200)
- `includeText` / `excludeText` - Require or forbid phrases in result pages
- `startPublishedDate` / `endPublishedDate` - ISO 8601 publication date range
- `startCrawlDate` / `endCrawlDate` - ISO 8601 crawl date range
- `userLocation` - Two-letter country code (e.g., `US`)

### Contents (Mix and Match)
All three can be requested in the same call:
- `text: true` or `{ maxCharacters, includeHtmlTags, verbosity }` - Full or truncated page text
- `highlights: true` or `{ query, maxCharacters }` - LLM-selected relevant snippets
- `summary: { query, schema }` - LLM-generated summary, optionally conforming to a JSON schema

## When to Use

- **Content research** - Find high-quality long-form content on niche topics by meaning, not just keywords
- **Competitor discovery** - Find companies similar to one you've identified via `findSimilar`
- **SEO content gap analysis** - Search for topics your competitors rank for and pull highlights for quick review
- **Customer research** - Find forum threads, blog posts, and reviews about your product or category
- **Audience research** - Discover blogs, newsletters, and communities where your ICP publishes or comments
- **News monitoring** - Track mentions of your brand, competitors, or category with date-filtered news search
- **Link prospecting** - Find authoritative pages covering topics you write about, for outreach
- **Lead research** - Use the `company` and `people` categories to discover accounts or individuals matching criteria

## Rate Limits

- Varies by plan; see https://exa.ai/pricing
- Most production plans support hundreds of concurrent requests
- Content retrieval (text/highlights/summary) is billed separately from the base search

## Relevant Skills

- seo-audit
- ai-seo
- content-strategy
- competitor-profiling
- competitor-alternatives
- customer-research
- cold-email
- lead-magnets
- marketing-ideas
