# Firecrawl

Web scraping API that turns single pages or full sites into clean LLM-ready markdown. Handles JS rendering, anti-bot defenses, and proxy rotation so you can extract structured data from individual public business sites.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API + Python/Node SDKs |
| MCP | ✓ | Official hosted server: `https://mcp.firecrawl.dev/v2/mcp` with a Bearer API key (unattended), `/v2/mcp-oauth` for OAuth; a keyless tier covers scrape, search, and parse ([docs](https://docs.firecrawl.dev/mcp-server)) |
| CLI | ✓ | [firecrawl.js](../clis/firecrawl.js) |
| SDK | ✓ | Node, Python, Go, Rust |

Full API reference: https://docs.firecrawl.dev

## Authentication

- **Type**: API Key
- **Header**: `Authorization: Bearer fc-YOUR_API_KEY`
- **Get key**: https://www.firecrawl.dev/app/api-keys
- **Env var**: `FIRECRAWL_API_KEY`
- **Base URL**: `https://api.firecrawl.dev`

## Core Operations

### Scrape a single page

```bash
POST https://api.firecrawl.dev/v2/scrape
Authorization: Bearer fc-YOUR_API_KEY

{
  "url": "https://joescoffeeshop.com",
  "formats": ["markdown", "html"]
}
```

Returns the page as clean markdown (LLM-ready, no nav cruft) plus optional raw HTML.

### Map a site (discover all URLs)

```bash
POST https://api.firecrawl.dev/v2/map

{
  "url": "https://example.com",
  "limit": 100
}
```

Returns a list of URLs found on the site. Use this to identify key pages (`/pricing`, `/about`, `/contact`, `/team`) before scraping individually.

### Crawl multiple pages

```bash
POST https://api.firecrawl.dev/v2/crawl

{
  "url": "https://example.com",
  "limit": 20,
  "scrapeOptions": {
    "formats": ["markdown"]
  }
}
```

Crawls multiple pages from a single site. **Use sparingly** — costs scale with pages. Set `limit` and `includePaths` to target specific URL patterns.

### Structured data (scrape JSON mode)

```bash
POST https://api.firecrawl.dev/v2/scrape

{
  "url": "https://joescoffeeshop.com",
  "formats": [{
    "type": "json",
    "prompt": "Extract the business contact details",
    "schema": {
      "type": "object",
      "properties": {
        "phone": { "type": "string" },
        "address": { "type": "string" },
        "hours": { "type": "string" },
        "email": { "type": "string" }
      }
    }
  }]
}
```

Returns structured data under `data.json` matching the schema — useful when you want consistent fields across many sites rather than raw markdown.

### Search the web

```bash
POST https://api.firecrawl.dev/v2/search

{
  "query": "\"Joe's Coffee Shop\" Boulder Colorado",
  "limit": 10
}
```

Web search useful for cross-source verification (find a business's official site when you only have a name + location). v2 groups results by source under `data.web` / `data.news` / `data.images`; add `scrapeOptions` to also pull page content for each result (billed separately).

## MCP Tools (when used via MCP server)

| Tool | Purpose |
|------|---------|
| `firecrawl_scrape` | Single-page extraction |
| `firecrawl_map` | URL discovery on a site |
| `firecrawl_crawl` | Multi-page crawl |
| `firecrawl_search` | Web search + scrape |

## CLI

A zero-dependency Node CLI ships in [`tools/clis/firecrawl.js`](../clis/firecrawl.js). Set `FIRECRAWL_API_KEY` and run any of `scrape`, `search`, `map`, `crawl`, or `crawl-status`. Output is JSON on stdout (pipe to `jq`); add `--dry-run` to preview a request without sending it.

```bash
# Scrape a single business site to markdown
node tools/clis/firecrawl.js scrape --url https://joescoffeeshop.com

# Find a business's official site
node tools/clis/firecrawl.js search "\"Joe's Coffee Shop\" Boulder Colorado" --limit 5

# Discover a site's key pages before scraping
node tools/clis/firecrawl.js map --url https://example.com --search pricing

# Crawl a section, then poll the async job
node tools/clis/firecrawl.js crawl --url https://example.com --limit 20 --include-paths /pricing,/about
node tools/clis/firecrawl.js crawl-status --id <crawlId>
```

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

## Inspecting asynchronous crawl results in the CLI

`crawl` starts a job and returns its ID. `crawl-status` retrieves a single result
page; it does not wait for completion or fetch every page automatically:

```bash
node tools/clis/firecrawl.js crawl-status --id <crawlId>
# If the returned next URL ends in ?skip=26, request that next result page:
node tools/clis/firecrawl.js crawl-status --id <crawlId> --skip 26
node tools/clis/firecrawl.js crawl-errors --id <crawlId>
```

Read the returned `next` URL and use its `skip` value unchanged for the same job.
Do not invent the offset from `completed` or increment it by a guessed page size.
A `completed` status can still have more result pages: Firecrawl uses pagination
for responses over 10MB. Follow returned pages until `next` is absent or null.
If the job is still `scraping`, a currently empty page does not establish that
there will be no more results; check status again later using your existing
workflow. `--dry-run` previews either read request with authorization masked.

Job completion does not prove every discovered URL was successfully scraped.
Inspect `crawl-errors` for failed scrapes and `robotsBlocked`, and inspect each
returned page's `metadata.statusCode` for target-site HTTP failures. Firecrawl's
error endpoint may omit some internal failure classes, so an empty error list is
not a guarantee of complete coverage. Keep the result page, job status and error
output together when reporting crawl coverage.

See [crawl response handling](https://docs.firecrawl.dev/features/crawl#response-handling)
and [crawl error reporting](https://docs.firecrawl.dev/api-reference/endpoint/crawl-get-errors)
for the current provider contracts.
