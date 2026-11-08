# GoAnyAPI

Public SEO, website, and Google Ads data APIs behind a single bearer key, plus a hosted MCP server for agents.

> **Disclosure**: this guide was contributed by the GoAnyAPI team. It is written to sit alongside the other SEO data options in this registry (Google Search Console, Semrush, Ahrefs, DataForSEO, Keywords Everywhere, RankParse) — pick on fit and per-call cost, not on who wrote the page.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | SERP (Google/Bing), keywords, backlinks, domain rating, traffic, Ads Transparency, AdSense, HTML→Markdown |
| MCP | ✓ | Hosted: `https://mcp.goanyapi.com/mcp` (streamable HTTP, bearer key) |
| CLI | ✓ | [goanyapi.js](../clis/goanyapi.js) |
| SDK | - | Plain HTTP/JSON; no official SDK |

## Authentication

- **Type**: Bearer token
- **Header**: `Authorization: Bearer {api_key}`
- **Base URL**: `https://api.goanyapi.com/api/v1`
- **Get a key**: https://goanyapi.com/pricing (credits are one-time top-ups, no required subscription)
- **Env var for the CLI**: `GOANYAPI_API_KEY`

```bash
export GOANYAPI_API_KEY="sk_live_..."
curl -s "https://api.goanyapi.com/api/v1/dr?domain=example.com" \
  -H "Authorization: Bearer $GOANYAPI_API_KEY"
```

Every endpoint is `GET` with query parameters, and responses are `{code, message, data}`. `code: "ok"` means success. `data.costCredits` (where present) reports what the call charged.

## Common Agent Operations

### Google SERP

Three independent editions — start with Stable and only move up when a request fails or needs a field Stable does not return. **The response shape differs per edition**, so map fields accordingly.

```bash
# Stable (1 credit) — lean response
GET /serp-stable?query=ai+image&gl=us&hl=en
# → data.result.results[], data.result.has_next_page, data.result.serp_features[]

# Standard (2 credits) — more parameters and fields
GET /serp-standard?q=ai+image&gl=us&hl=en
# → data.result.organic_results[], data.result.pagination, data.result.related_questions[]

# Multi-mode (3 credits) — news, videos, shopping, jobs
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
# Discovery first (free-form seed)
GET /keyword-suggestions?keyword=ai+image&page=1
# → data.keywords[]

# Volume — pass an exact term returned by /keyword-suggestions, not an arbitrary phrase
GET /keyword-search-volume?keyword=ai+image
# → data.monthlyVolumes[] {month, volume} — months may be missing; do not read gaps as zero

# Difficulty (3 credits)
GET /keyword-difficulty?keyword=ai+image&country=us
# → data.difficulty, data.serp.results[].position, data.lastUpdate

# Related ideas
GET /keyword-generator?keyword=ai+image&country=us
```

Difficulty scores are provider-specific and **not interchangeable** with Ahrefs KD or Semrush KD — say which vendor produced a score before comparing across sources.

### Domain data

```bash
GET /dr?domain=example.com              # → data.domain, data.domain_rating
GET /dr-history?domain=example.com      # monthly ratings; includeDr=false previews months without charging
GET /backlink?domain=example.com        # → data.refdomains, data.dofollowBacklinks, data.topBacklinks[]
GET /traffic?domain=example.com&month=3 # → data.EstimatedMonthlyVisits, data.TopCountryShares[], data.TrafficSources
```

### Google Ads transparency

```bash
# Exactly one mode per request
GET /transparency?domain=example.com
GET /transparency?keyword=nike
GET /transparency?creativeIds=<id>

GET /ads-statistics?action=<action>&advertiserId=<id>
```

### Forensics helpers

```bash
GET /adsense?domain=example.com         # or ?pubId=pub-123...
GET /html-to-markdown-api?url=https://example.com/post&retainLinks=true
GET /google-trends?q=crm,project+management&geo=US
GET /credits/balance
```

## API Pattern

- `GET` only; parameters in the query string. Coordinates and similar objects must be JSON-serialized in the URL.
- Envelope: `{ code, message, data }`; check `code` rather than the HTTP status alone.
- Billing is per successful non-empty result. Invalid parameters, failed requests, and empty results are free — worth stating explicitly when you report cost.
- Some flows are two-step by design (suggestions → volume; inbound-keyword batches → list). Do not skip the first step.

## Key Metrics

| Metric | Field | Note |
|--------|-------|------|
| Domain Rating | `data.domain_rating` | GoAnyAPI's own 0–100 scale |
| Referring domains | `data.refdomains` | |
| Dofollow backlinks | `data.dofollowBacklinks` | |
| Estimated monthly visits | `data.EstimatedMonthlyVisits` | Estimate, not analytics-grade |
| Keyword difficulty | `data.difficulty` | Vendor-specific formula |
| Monthly volume | `data.monthlyVolumes[].volume` | Per-month, may have gaps |

## When to Use

- Programmatic SERP and keyword pulls where per-call cost matters and you want one key across providers
- Ads Transparency / Reverse AdSense lookups (few providers expose these cheaply)
- Agent workflows that need SEO data as MCP tools rather than a bespoke integration
- Cross-checks against Search Console: GSC for your own first-party queries, GoAnyAPI (or DataForSEO/Semrush) for competitors and third-party terms

## Rate Limits

- Credit-metered rather than request-per-minute metered; concurrency is bounded per plan.
- Check `data.costCredits` and `GET /credits/balance` before batch jobs.
- `402` means insufficient credits for the full result — it is not a transient error, so do not retry blindly.

## Relevant Skills

- seo-audit
- programmatic-seo
- content-strategy
- competitors
- link-building

## CLI examples

```bash
node tools/clis/goanyapi.js domain rating --domain example.com
node tools/clis/goanyapi.js keywords difficulty --keyword "ai image" --country us
node tools/clis/goanyapi.js serp google --query "ai image" --edition stable --gl us
node tools/clis/goanyapi.js account credits

# Preview a paid request without spending credits
node tools/clis/goanyapi.js serp google --query "ai image" --dry-run
```
