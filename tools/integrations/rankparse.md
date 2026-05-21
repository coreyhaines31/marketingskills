# RankParse

Agent-friendly SEO data API for backlinks, domain authority, tech stack, and on-page metadata. Designed as a low-cost alternative to enterprise SEO suites.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API at `api.rankparse.com` |
| MCP | ✓ | Hosted MCP server for agent use |
| CLI | [✓](../clis/rankparse.js) | Node CLI wrapper |
| SDK | - | API-only (SDKs in progress) |

## Authentication

- **Type**: API Key
- **Header**: `X-API-Key: rp_...`
- **Get key**: Sign up at https://rankparse.com and create a key in the dashboard
- **Billing**: Credit-based (one-time credit packs, no subscription). Each endpoint deducts a fixed number of credits per call.

## Common Agent Operations

### Domain authority

```bash
GET https://api.rankparse.com/v1/domain-authority?domain=example.com

X-API-Key: rp_...
```

Returns authority score, registered date, registrar, and popularity rank.

### Backlinks

```bash
GET https://api.rankparse.com/v1/backlinks?domain=example.com&limit=100

X-API-Key: rp_...
```

Optional params: `sort=importance|recent`, `from_domain=`, `link_type=`, `score=true`.

### Referring domains

```bash
GET https://api.rankparse.com/v1/referring-domains?domain=example.com&limit=100

X-API-Key: rp_...
```

### Outbound links

```bash
GET https://api.rankparse.com/v1/outbound-links?domain=example.com&limit=100

X-API-Key: rp_...
```

### Anchor text profile

```bash
GET https://api.rankparse.com/v1/anchor-text?domain=example.com&limit=100

X-API-Key: rp_...
```

### Top pages

```bash
GET https://api.rankparse.com/v1/top-pages?domain=example.com&limit=50

X-API-Key: rp_...
```

### Domain overlap

```bash
GET https://api.rankparse.com/v1/domain-overlap?domains=a.com,b.com,c.com

X-API-Key: rp_...
```

Compare 2–5 domains.

### Link intersect

```bash
GET https://api.rankparse.com/v1/link-intersect?domain_a=a.com&domain_b=b.com

X-API-Key: rp_...
```

Domains that link to both targets.

### Competitor gap

```bash
GET https://api.rankparse.com/v1/competitor-gap?domain=mysite.com&vs=competitor.com

X-API-Key: rp_...
```

### Similar domains

```bash
GET https://api.rankparse.com/v1/similar-domains?domain=example.com

X-API-Key: rp_...
```

### Tech stack

```bash
GET https://api.rankparse.com/v1/tech-stack?domain=example.com

X-API-Key: rp_...
```

### Page SEO

```bash
GET https://api.rankparse.com/v1/page-seo?url=https://example.com/page

X-API-Key: rp_...
```

Returns title, meta description, OG tags, canonical, and structured metadata for a single URL.

### Page performance

```bash
GET https://api.rankparse.com/v1/page-performance?url=https://example.com/page&strategy=mobile

X-API-Key: rp_...
```

Core Web Vitals via Google PageSpeed Insights. Daily quotas apply.

### Site health

```bash
GET https://api.rankparse.com/v1/site-health?domain=example.com

X-API-Key: rp_...
```

### Sitemap

```bash
GET https://api.rankparse.com/v1/sitemap?domain=example.com&limit=100

X-API-Key: rp_...
```

### Crawl history

```bash
GET https://api.rankparse.com/v1/crawl-history?domain=example.com

X-API-Key: rp_...
```

Wayback Machine snapshots for the domain.

### Link audit

```bash
GET https://api.rankparse.com/v1/link-audit?domain=example.com

X-API-Key: rp_...
```

Combined health score, risk flags, anchor profile, and top backlinks.

### Site explorer

```bash
GET https://api.rankparse.com/v1/site-explorer?domain=example.com

X-API-Key: rp_...
```

All-in-one snapshot of a domain.

### Batch lookup

```bash
POST https://api.rankparse.com/v1/batch
Content-Type: application/json
X-API-Key: rp_...

{ "domains": ["a.com", "b.com", "c.com"] }
```

Bulk domain summaries in one call.

## Free Tools (Unauthenticated)

Public, IP-rate-limited endpoints for quick lookups without an API key:

- `GET /v1/tools/backlinks?domain=`
- `GET /v1/tools/domain-authority?domain=`
- `GET /v1/tools/tech-stack?domain=`
- `GET /v1/tools/similar-websites?domain=`
- `GET /v1/tools/domain-age?domain=`
- `GET /v1/tools/meta-tag-analyzer?url=`
- `GET /v1/tools/link-intersect?domain_a=&domain_b=`
- `GET /v1/tools/page-speed?url=`

## Key Response Fields

### Domain Metrics
- `authority` - Domain authority score
- `popularity_rank` - Tranco popularity rank
- `registered_at` - Domain registration date
- `registrar` - Registrar name

### Backlink Fields
- `from_url` - Source URL
- `to_url` - Target URL
- `anchor` - Anchor text
- `link_type` - dofollow / nofollow / ugc / sponsored
- `first_seen` - First discovery date

## When to Use

- Backlink discovery and analysis
- Competitor link research and gap analysis
- Domain authority lookups at scale
- Tech stack detection
- On-page SEO audits
- Sitemap and crawl history discovery
- Agent-driven SEO workflows where per-call cost matters

## Pricing Model

- Pay-as-you-go credit packs (no subscription)
- Most domain endpoints: 1–2 credits per call
- Aggregated endpoints (overlap, intersect, similar, gap): 5 credits
- Link audit: 8 credits
- Site explorer: 10 credits
- Batch: 1 credit per domain
- Free tier available for unauthenticated endpoints

## MCP Server

RankParse ships a hosted MCP server exposing all endpoints as tools — connect from Claude, Cursor, or any MCP-compatible agent. See https://rankparse.com for connection details.

## Relevant Skills

- seo-audit
- content-strategy
- competitors
- competitor-profiling
- ai-seo
- site-architecture
- schema
