# Firecrawl

Web scraping API that turns single pages or full sites into clean LLM-ready markdown. Handles JS rendering, anti-bot defenses, and proxy rotation so you can extract structured data from individual public business sites.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API + Python/Node SDKs |
| MCP | ✓ | Official Firecrawl MCP server |
| CLI | - | None official |
| SDK | ✓ | Node, Python, Go, Rust |

## Authentication

- **Type**: API Key
- **Header**: `Authorization: Bearer fc-YOUR_API_KEY`
- **Get key**: https://www.firecrawl.dev/app/api-keys
- **Env var**: `FIRECRAWL_API_KEY`
- **Base URL**: `https://api.firecrawl.dev`

## Core Operations

### Scrape a single page

```bash
POST https://api.firecrawl.dev/v1/scrape
Authorization: Bearer fc-YOUR_API_KEY

{
  "url": "https://joescoffeeshop.com",
  "formats": ["markdown", "html"]
}
```

Returns the page as clean markdown (LLM-ready, no nav cruft) plus optional raw HTML.

### Map a site (discover all URLs)

```bash
POST https://api.firecrawl.dev/v1/map

{
  "url": "https://example.com",
  "limit": 100
}
```

Returns a list of URLs found on the site. Use this to identify key pages (`/pricing`, `/about`, `/contact`, `/team`) before scraping individually.

### Crawl multiple pages

```bash
POST https://api.firecrawl.dev/v1/crawl

{
  "url": "https://example.com",
  "limit": 20,
  "scrapeOptions": {
    "formats": ["markdown"]
  }
}
```

Crawls multiple pages from a single site. **Use sparingly** — costs scale with pages. Set `limit` and `includePaths` to target specific URL patterns.

### Extract structured data

```bash
POST https://api.firecrawl.dev/v1/extract

{
  "urls": ["https://joescoffeeshop.com"],
  "schema": {
    "phone": "string",
    "address": "string",
    "hours": "string",
    "email": "string"
  }
}
```

Returns data matching the schema — useful when you want consistent fields across many sites rather than raw markdown.

### Search the web

```bash
POST https://api.firecrawl.dev/v1/search

{
  "query": "\"Joe's Coffee Shop\" Boulder Colorado",
  "limit": 10
}
```

Web search + scrape of top results. Useful for cross-source verification (find a business's official site when you only have a name + location).

## MCP Tools (when used via MCP server)

| Tool | Purpose |
|------|---------|
| `firecrawl_scrape` | Single-page extraction |
| `firecrawl_map` | URL discovery on a site |
| `firecrawl_crawl` | Multi-page crawl |
| `firecrawl_extract` | Schema-driven structured data |
| `firecrawl_search` | Web search + scrape |

## When to Use

- **Local SMB prospecting**: verify a business's website status (live, weak, missing) at the URL level after manual Maps/Yelp discovery
- **Single-target enrichment**: pull contact info, hours, services from a business's own site
- **Competitor research**: scrape competitor pricing, features, customer pages (this is the primary use in `competitor-profiling` skill)
- **Programmatic page extraction**: when you need many sites' homepages or about pages in a consistent format
- **JS-heavy sites**: when the page won't render with a simple `curl` because content loads after page load

## When NOT to Use

**Critical — do not use Firecrawl to scrape platforms hosting prospects:**

- ✗ **Google Maps / Google search results** — Google ToS prohibits bulk extraction
- ✗ **LinkedIn** — explicit ToS violation, will get scraper accounts banned and risks legal exposure
- ✗ **Yelp** — ToS prohibits commercial scraping
- ✗ **Apollo / ZoomInfo / Clearbit listings** — their ToS prohibits using competing data extracts
- ✗ **Any platform you don't have a legitimate basis to extract from at scale**

**Use Firecrawl for**: the *business's own website* (which you found via manual discovery on those platforms). That's the line — discovery happens on platforms, extraction happens on individual public business sites.

## Pricing

- Free tier: limited monthly credits
- Paid tiers scale by request volume + concurrency
- Confirm at https://www.firecrawl.dev/pricing

## Rate Limits

- Default: tier-dependent (typically 5–20 concurrent requests on paid plans)
- Per-page cost varies by content type and rendering needs

## Relevant Skills

- prospecting (site enrichment for individual business URLs)
- competitor-profiling (primary use: full-site competitor analysis)
- ai-seo (scrape your own content for AI search optimization)
- content-strategy (scrape industry sites for content gap analysis)
