# ScrapeWhale

API and MCP server for public web data about a brand: estimated website traffic and its sources, domain authority and organic search totals, the Meta and Google ad libraries, public social profiles and posts (Instagram, TikTok, YouTube, X, Facebook pages), Google search results and AI Overviews, Google Trends, and any web page as markdown. One key and one credit balance across all of them; every endpoint returns structured JSON, clean markdown, or both.

Facts below were checked against the [OpenAPI spec](https://scrapewhale.dev/openapi.json) and [llms.txt](https://scrapewhale.dev/llms.txt) on 2026-11-14.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST, `https://scrapewhale.dev/api/v1`, GET with query parameters |
| MCP | ✓ | Hosted remote MCP server at `https://scrapewhale.dev/mcp` (Streamable HTTP, OAuth sign-in) |
| CLI | - | Use the API or MCP |
| SDK | - | Plain HTTP; OpenAPI 3.1 spec for codegen |

What it adds next to the existing guides: traffic estimates, SEO metrics, ad libraries, social profiles, Google results and AI Overviews for the same brand from one account, and a one-call brand summary (`/brand`). Each response can come back as markdown, which an agent can read without parsing JSON.

## Authentication

- **API**: API key in the `x-api-key` header
- **Env var** (convention): `SCRAPEWHALE_API_KEY`
- **Get key**: sign up at [scrapewhale.dev](https://scrapewhale.dev), then Settings → API keys
- **MCP**: OAuth in the client; no key needed. Claude Code:
  `claude mcp add --transport http scrapewhale https://scrapewhale.dev/mcp`, then `/mcp` to sign in.
  Other clients: add the URL as a remote MCP server ([setup guides](https://scrapewhale.dev/docs/api)).

## Response format

Every endpoint takes `format=json`, `markdown` or `both` (API default `both`). Responses include an `id`; `GET /api/v1/conversions/{id}` returns a past result again for free. A 422 means the lookup failed and the credits were refunded; `code` says why (`provider_error` is often fixed by one retry after a pause, `empty_result` means no data).

## Common Agent Operations

### One-call brand summary

```bash
# Default parts: logo, traffic, authority, Google ads, homepage as markdown
GET https://scrapewhale.dev/api/v1/brand?domain=notion.so
x-api-key: $SCRAPEWHALE_API_KEY

# Opt-in parts: organic, backlinks, registration, agent_ready
GET https://scrapewhale.dev/api/v1/brand?domain=notion.so&parts=traffic,authority,organic,backlinks
```

Each part succeeds or fails on its own (`parts.<name>.ok`); credits are the sum of the parts that ran.

### Traffic and SEO for a domain

```bash
# Estimated monthly visits and trend, traffic source shares, top countries,
# top keywords with volume and CPC, AI chatbot referrals where available
GET https://scrapewhale.dev/api/v1/traffic?domain=notion.so

# Domain rating (keep the licence text the response includes)
GET https://scrapewhale.dev/api/v1/seo/authority?domain=notion.so

# Organic totals (US database): keyword count, est. organic visits, traffic cost, rank
GET https://scrapewhale.dev/api/v1/seo/organic?domain=notion.so

# Backlink counts for the root domain, hostname and URL (counts only, no link list)
GET https://scrapewhale.dev/api/v1/seo/backlinks?domain=notion.so
```

Traffic and keyword figures are third-party estimates; report them with the `SnapshotDate` the response carries.

### Ad libraries

```bash
# Meta: pass the Facebook page slug, URL or page_id; resolved to the page internally
GET https://scrapewhale.dev/api/v1/ads/meta?slug=notionhq&max_pages=3&format=json
# 30 ads per page, max_pages 1-10, same price. Fields per ad: is_active, start_date,
# end_date, publisher_platform, and snapshot.{title, body, link_url, cta_text, display_format}

# Google Ads Transparency Center by domain (creative IDs and links)
GET https://scrapewhale.dev/api/v1/ads/google?domain=notion.so&max_pages=2
# Detail for one creative: format, first/last shown, regions, landing URL, previews
GET https://scrapewhale.dev/api/v1/ads/google/creative?advertiser_id=AR...&creative_id=CR...
```

Ad libraries show what is running and since when; they don't show spend or results.

### Search results and AI Overviews

```bash
# Organic results, answer box, People Also Ask, related searches, videos
GET https://scrapewhale.dev/api/v1/search?q=best+crm+for+agencies&gl=us&hl=en&num=10

# Google's AI Overview for a query: answer text blocks and their cited references
GET https://scrapewhale.dev/api/v1/search/ai-overview?q=best+crm+for+agencies&gl=us
# has_overview: false means no AI Overview was shown for that query and market
```

### Social profiles and posts

```bash
GET https://scrapewhale.dev/api/v1/social/instagram/profile?username=notionhq
GET https://scrapewhale.dev/api/v1/social/tiktok/profile?username=notionhq
GET https://scrapewhale.dev/api/v1/social/youtube/channel?handle=Notion
GET https://scrapewhale.dev/api/v1/social/youtube/channel/videos?handle=Notion&sort=latest
GET https://scrapewhale.dev/api/v1/social/youtube/transcript?video_id=<id>
GET https://scrapewhale.dev/api/v1/social/x/tweets?handle=NotionHQ
GET https://scrapewhale.dev/api/v1/social/x/replies?url=<post url>
GET https://scrapewhale.dev/api/v1/social/facebook/page?slug=notionhq
```

### Demand and pages

```bash
# Google Trends: relative interest over time for up to 5 comma-separated terms
GET https://scrapewhale.dev/api/v1/trends/interest?q=notion,obsidian&time=today%2012-m
GET https://scrapewhale.dev/api/v1/trends/related?q=notion   # rising and top queries

# Any page as clean markdown (pricing pages, articles, docs)
GET https://scrapewhale.dev/api/v1/markdown/url?url=https://www.notion.com/pricing

# llms.txt, agents.md, UCP manifest and MCP endpoint checks for a domain
GET https://scrapewhale.dev/api/v1/agent-ready?domain=notion.so
```

### MCP tools

The MCP server exposes the same lookups as tools with an `action` parameter: `brand_dossier`, `domain_intel` (`traffic`, `authority`, `organic`, `backlinks`, `registration`, `agent_ready`), `ads` (`meta`, `google`, `google_creative`, `google_advertiser`), `google_search` (`web`, `ai_overview`), `google_trends`, `youtube`, `x_twitter`, `instagram_profile`, `tiktok_profile`, `facebook_page`, `read_url` and `get_result`. All tools are read-only.

## Rate Limits and Pricing

- Prepaid credit packs that don't expire; no subscription. New accounts get 10 free credits.
- Most lookups cost 1 credit; ad library lookups and AI Overviews cost 2; `/brand` costs the sum of its parts (up to 6 by default).
- Results fetched recently by anyone are served from cache for free (`cached: true`); failed lookups are refunded.
- Prices: [scrapewhale.dev/pricing](https://scrapewhale.dev/pricing).

## Usage Rules

- Use it for public data about companies: what a brand publishes, advertises and ranks for, and how much traffic it gets.
- Don't use it to build lists of people or collect personal data. For prospecting, see the sourcing rules in [REGISTRY.md](../REGISTRY.md).
- Don't use the LinkedIn or Google Maps endpoints. This repo doesn't scrape LinkedIn or Google Maps.
- Keep the domain-rating licence text when you show authority figures.

## Links

- API reference: https://scrapewhale.dev/docs/api
- OpenAPI: https://scrapewhale.dev/openapi.json
- llms.txt: https://scrapewhale.dev/llms.txt
