# GoAnyAPI

SEO, keyword, backlink, traffic, and Google Ads data through a GET-only HTTP API and a hosted MCP server, billed against a prepaid credit balance.

Facts below were checked against the [MCP catalog](https://api.goanyapi.com/api/v1/mcp/catalog) (49 endpoints, including each endpoint's input schema) and the [published docs](https://goanyapi.com/llms.txt) on 2026-11-11. Response field paths were not re-verified against a live key in this revision.

## What an agent can do here that the other data guides do not cover

Two surfaces are the reason to reach for this rather than a SERP or social scraper:

- **Google Ads Transparency lookups** — go from a keyword to the advertisers bidding on it, from a domain to its advertisers, or from creative IDs back to the domains running them, then pull weekly per-advertiser and per-domain ad statistics. `scrapecreators.md` covers the Meta/Google/TikTok/LinkedIn ad *libraries* at the creative level; this returns Google's Transparency Center advertiser objects and weekly aggregates instead.
- **Reverse AdSense** — a domain returns the publisher IDs monetizing it, and a `pub-…` ID returns the domains in that publisher's network. Useful for spotting site networks and shared monetization; no other guide in this registry covers it.

The same key also returns Google/Bing SERP, keyword volumes and difficulty, Domain Rating, backlinks, and estimated traffic, so a single workflow does not have to stitch two vendors together. Coverage stops at those datasets — there is no social-platform content, no transcripts, no comment scraping, and no ad-library creative for Meta/TikTok/LinkedIn (`scrapecreators.md` and `apify.md` remain the right tools there).

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST, `https://api.goanyapi.com/api/v1`, every endpoint `GET` with query parameters |
| MCP | ✓ | Hosted Streamable HTTP at `https://mcp.goanyapi.com/mcp`, bearer key; 49 tools mirroring the REST endpoints |
| CLI | ✓ | [goanyapi.js](../clis/goanyapi.js) |
| SDK | - | Plain HTTP/JSON; no official SDK |

## Authentication

- **Type**: Bearer token
- **Header**: `Authorization: Bearer {api_key}`
- **Env var for the CLI**: `GOANYAPI_API_KEY`
- **MCP**: the same key as a bearer header on `https://mcp.goanyapi.com/mcp`

```bash
export GOANYAPI_API_KEY="..."
curl -s "https://api.goanyapi.com/api/v1/dr?domain=example.com" \
  -H "Authorization: Bearer $GOANYAPI_API_KEY"
```

Every response is `{ code, message, data }`; `code: "ok"` means success. Treat `code` as the result, not the HTTP status alone. `data.costCredits`, where present, reports what the call charged.

## Common Agent Operations

### Advertisers bidding on a keyword

```bash
GET /transparency?keyword=nike
# → data.result[] advertiser objects (id, name, domain); use the exact id below
```

Modes are exclusive: pass exactly one of `keyword`, `domain`, or `creativeIds`.

### Who advertises on a domain, and where a creative ran

```bash
GET /transparency?domain=example.com
GET /transparency?creativeIds=CR1234567890,CR0987654321   # comma-separated ids → domains
```

### Weekly ad statistics

`/ads-statistics` is a two-step flow: a search action returns ids, then a statistics action takes that id.

```bash
# 1. search
GET /ads-statistics?action=advertiserSearch&keyword=nike
GET /ads-statistics?action=domainSearch&keyword=nike
GET /ads-statistics?action=titleSearch&keyword=summer%20sale

# 2. statistics — pass an exact data.result[].id from step 1
GET /ads-statistics?action=advertiserStatistics&advertiserId=<id>
GET /ads-statistics?action=domainStatistics&hostId=<id>
```

Other actions: `googleAdsTitleSearch`, `domainTitles`, `hostTitleSearch`, `domainImageAds`, `domainTitleCountries`, `domainTitleImageAds`.

### Reverse AdSense

```bash
GET /adsense?domain=example.com    # → publisher ids monetizing the domain
GET /adsense?pubId=pub-1234567890  # → domains in that publisher network
```

Pass one parameter only; both together is a validation error.

### Google SERP

Three independent editions. **The response shape differs per edition**, so map fields per edition instead of writing one parser for all three.

```bash
# Stable — lean response
GET /serp-stable?query=ai+image&gl=us&hl=en
# → data.result.results[], data.result.has_next_page, data.result.serp_features[]

# Standard — more parameters and fields
GET /serp-standard?q=ai+image&gl=us&hl=en
# → data.result.organic_results[], data.result.pagination, data.result.related_questions[]

# Multi-mode — web, news, images, videos, shopping
GET /serp?q=ai+image&gl=us&hl=en&search_type=web
# → data.result.organic[], data.result.pagination.next_page_start, data.result.related[]
```

### Bing SERP

```bash
GET /bing-serp?query=ai+image&mkt=en-US
```

Pagination uses `next_page_token`; tokens expire after one hour.

### Keyword research

```bash
# Discovery first — free-form seed
GET /keyword-suggestions?keyword=ai+image&page=1
# → data.keywords[]

# Volume — pass an exact term returned by /keyword-suggestions, not an arbitrary phrase
GET /keyword-search-volume?keyword=ai+image
# → data.monthlyVolumes[] {month, volume}; months can be missing, so do not read a gap as zero

# Difficulty
GET /keyword-difficulty?keyword=ai+image&country=us
# → data.difficulty, data.serp.results[].position, data.lastUpdate

# Related terms
GET /keyword-generator?keyword=ai+image&country=us
```

Difficulty is computed from GoAnyAPI's own SERP data and is **not interchangeable** with Ahrefs KD or Semrush KD — name the vendor before comparing scores across sources.

### Domain data

```bash
GET /dr?domain=example.com              # → data.domain, data.domain_rating (0–100, vendor scale)
GET /dr-history?domain=example.com      # monthly ratings; includeDr=false previews months without charging
GET /backlink?domain=example.com        # → data.refdomains, data.dofollowBacklinks, data.topBacklinks[]
GET /traffic?domain=example.com&month=3 # → data.EstimatedMonthlyVisits, data.TopCountryShares[], data.TrafficSources
```

### Page content and other signals

```bash
GET /html-to-markdown-api?url=https://example.com/post&retainLinks=true
GET /google-trends?q=crm,project+management&geo=US
GET /google-scholar?q=retrieval+augmented+generation
GET /youtube-autocomplete?q=seo+tips&hl=en
GET /credits/balance
```

## API Pattern

- `GET` only; parameters ride in the query string. Nested values such as coordinates are JSON-serialized into the parameter.
- Some flows are two-step by design (`keyword-suggestions` → `keyword-search-volume`, `advertiserSearch` → `advertiserStatistics`, inbound-keyword `batches` → `list`). Skipping the first step returns empty results rather than an error.
- Empty results and rejected parameters are not charged; failed requests are not charged. Report the cost you actually saw in `data.costCredits`.

## Key Metrics

| Metric | Field | Note |
|--------|-------|------|
| Domain Rating | `data.domain_rating` | GoAnyAPI's own 0–100 scale, not Ahrefs DR |
| Referring domains | `data.refdomains` | |
| Dofollow backlinks | `data.dofollowBacklinks` | |
| Estimated monthly visits | `data.EstimatedMonthlyVisits` | Estimate, not analytics-grade |
| Keyword difficulty | `data.difficulty` | Vendor-specific formula |
| Monthly volume | `data.monthlyVolumes[].volume` | Per-month; gaps are missing data, not zero |

## Rate Limits

- Credit-metered rather than requests-per-minute metered; concurrency is bounded per account.
- Check `data.costCredits` and `GET /credits/balance` before batch jobs.
- `402` means the balance cannot cover the full result — not a transient error, so do not retry blindly.

## Relevant Skills

- seo-audit
- programmatic-seo
- content-strategy
- competitors
- link-building

## CLI examples

```bash
node tools/clis/goanyapi.js --help

node tools/clis/goanyapi.js ads transparency --keyword nike
node tools/clis/goanyapi.js ads statistics --action advertiserStatistics --advertiser-id <id>
node tools/clis/goanyapi.js domain adsense --pub-id pub-1234567890
node tools/clis/goanyapi.js keywords difficulty --keyword "ai image" --country us
node tools/clis/goanyapi.js serp google --query "ai image" --edition stable --gl us
node tools/clis/goanyapi.js account credits

# Print the request a paid call would send, without spending credits
node tools/clis/goanyapi.js ads transparency --domain example.com --dry-run
```
