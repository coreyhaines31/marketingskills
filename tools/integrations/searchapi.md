# SearchApi

Real-time search results as structured JSON: Google (web, News, Shopping, Images, Scholar, Jobs, Trends, Maps, Flights, Hotels), Bing, YouTube, Amazon and 100+ other engines, one `GET` per results page, billed per search.

Facts below were checked against the [Google](https://www.searchapi.io/docs/google), [Google News](https://www.searchapi.io/docs/google-news) and [Google Shopping](https://www.searchapi.io/docs/google-shopping) references and live responses on 2026-11-21.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST, `https://www.searchapi.io/api/v1`, one `GET /search` route; the `engine` parameter picks the source |
| MCP | ✓ | Hosted, `https://www.searchapi.io/mcp` (Streamable HTTP), one tool per engine; OAuth on first connect, or an `X-MCP-Token` header for clients without OAuth |
| CLI | ✓ | [searchapi.js](../clis/searchapi.js) |
| SDK | - | Plain HTTP/JSON |

## Authentication

- **Type**: Bearer token
- **Header**: `Authorization: Bearer {SEARCHAPI_API_KEY}` (an `api_key` query parameter is also accepted; the header keeps the key out of logs and `search_metadata.request_url`)
- **Env var** (convention): `SEARCHAPI_API_KEY`
- **Get key**: the API key on the [dashboard](https://www.searchapi.io/) after signing up

```bash
export SEARCHAPI_API_KEY="..."
curl -s "https://www.searchapi.io/api/v1/search?engine=google&q=email+marketing+software&gl=us&hl=en" \
  -H "Authorization: Bearer $SEARCHAPI_API_KEY"
```

A bad key answers `401 {"error":"Invalid API key."}`; a bad parameter answers `400 {"error":"..."}`. `GET /me` is free and returns `account.remaining_searches`, `account.current_month_usage` and `api_usage.hourly_rate_limit`.

## Common Agent Operations

Every engine takes `q`, and the Google engines take `gl` (country, lower-case ISO 3166-1), `hl` (interface language), `location` (a free-text place such as `Austin, Texas, United States`) and `page` (1-based). Google web and News honor `num` up to 10 results per page; Shopping returns its own page size (about 40) and ignores it.

### Rank check or SERP snapshot (Google web)

```bash
GET https://www.searchapi.io/api/v1/search?engine=google&q=email+marketing+software&gl=us&hl=en&num=10&page=1
```

```json
{
  "search_metadata": { "id": "search_...", "status": "Success", "html_url": "...", "json_url": "..." },
  "search_parameters": { "engine": "google", "q": "email marketing software", "device": "desktop", "hl": "en", "gl": "us", "num": 10 },
  "organic_results": [
    { "position": 1, "title": "...", "link": "https://www.google.com/goto?url=...", "domain": "example.com", "displayed_link": "https://example.com › blog", "snippet": "...", "date": "Oct 26, 2026" }
  ],
  "related_searches": [ { "query": "..." } ],
  "pagination": { "current": 1, "next": "https://www.google.com/search?...&start=10" }
}
```

- `organic_results[].position` is the rank on that page; add `(page - 1) * num` for the absolute position.
- Google often hands out `link` values as `https://www.google.com/goto?url=...` redirects. `domain` and `displayed_link` carry the destination host, which is enough for rank tracking; follow the redirect when you need the final URL.
- SERP features come back as their own top-level keys when Google shows them (`ai_overview`, `answer_box`, `knowledge_graph`, `related_questions`, `top_stories`, `inline_videos`, `related_searches`, ...). A SERP with no organic results answers `200` with `"error": "Google didn't return any results."` and no `organic_results` key; it still counts as one search.
- `time_period` (`last_hour`, `last_day`, `last_week`, `last_month`, `last_year`), `device` (`desktop`, `mobile`, `tablet`) and `safe` (`active`, `off`) narrow the result page. The CLI exposes them as `--time`, `--device` and `--safe`.

```bash
node tools/clis/searchapi.js search "email marketing software" --country us --language en --num 10
node tools/clis/searchapi.js search "email marketing software" --location "Austin, Texas, United States" --device mobile --page 2
node tools/clis/searchapi.js search "crm for agencies" --engine bing
```

### News monitoring (Google News)

```bash
GET https://www.searchapi.io/api/v1/search?engine=google_news&q=acme+corp&gl=us&hl=en&time_period=last_week
```

`organic_results[]` carries `title`, `link` (often a redirect, as above), `source`, `date` (relative), `iso_date` (UTC timestamp) and `snippet`. Filter on `iso_date` and `source` for a mention log.

```bash
node tools/clis/searchapi.js news "acme corp" --time last_week --num 10
```

### Price and seller check (Google Shopping)

```bash
GET https://www.searchapi.io/api/v1/search?engine=google_shopping&q=standing+desk&gl=us&hl=en&price_min=200&price_max=500
```

Results live under `shopping_results[]`, not `organic_results`: `title`, `price`, `extracted_price` (a number), `seller`, `delivery`, `product_link`, `offers_link` and `product_id`. `price_min` and `price_max` bound the price; `page` paginates.

```bash
node tools/clis/searchapi.js shopping "standing desk" --country us --min-price 200 --max-price 500
```

### Other engines

The same route serves every engine; change `engine` and read that engine's reference for its parameters and result keys (for example `google_scholar`, `google_trends`, `google_jobs`, `youtube`, `amazon_search`, `bing`). The CLI passes any engine id through `search --engine <id>` with the shared `--country`, `--language`, `--location`, `--num` and `--page` flags.

### Preview before spending a search

```bash
node tools/clis/searchapi.js search "best crm" --country us --dry-run
node tools/clis/searchapi.js account
```

`--dry-run` prints the request with the key masked and makes no network call. `account` is free. Every other command spends one search per page; the CLI exits 1 on an HTTP error, on an `error` key in the payload (including the empty-SERP case) and on invalid flags, which it rejects before sending anything.

## MCP Setup

```json
{
  "mcpServers": {
    "searchapi": {
      "url": "https://www.searchapi.io/mcp"
    }
  }
}
```

The server asks for a SearchApi sign-in on first connect (OAuth 2.1 with PKCE and dynamic client registration) and exposes one tool per engine; each tool call counts as one search on that account. Hosted MCP sign-in suits interactive sessions; unattended runs (a nightly rank sweep) should use the API key through the CLI or the API instead.

## Limits

- One request returns one results page. Rank tracking across many keywords and locales means one search per keyword, locale and page.
- Google web and News cap `num` at 10; deeper positions need `page`.
- Plan limits and the hourly rate limit are reported by `GET /me`; plans are on [searchapi.io/pricing](https://www.searchapi.io/pricing).
- Results are a live Google page for that query and locale, not an index: two identical requests minutes apart can differ.

## When It Fits

- **Rank tracking** on the live SERP for a keyword set, by country, language, city and device, including which SERP features (AI Overview, People Also Ask, top stories) push organic results down
- **Competitor SERP analysis**: who ranks for your terms, their titles and snippets, and the related searches Google suggests
- **News monitoring** for a brand, competitor or category with `iso_date` timestamps and the publishing source
- **Price research** across Google Shopping sellers for a product category
- **Other search surfaces** an agent needs as JSON (YouTube, Amazon, Google Trends, Google Scholar, Bing) without a per-engine integration

Other guides cover neighbouring jobs: [DataForSEO](dataforseo.md) and [GoAnyAPI](goanyapi.md) for SERP data with keyword volumes and backlinks, [cloro](cloro.md) for AI answers and Google results with the AI Overview per country, [Exa](exa.md) and [Parallel](parallel.md) for neural web search with page contents, [Glasser](glasser.md) as a pay-per-call broker that includes other SERP providers, and [Google Search Console](google-search-console.md) for Google's own data about your site.

## Relevant Skills

- seo-audit
- ai-seo
- programmatic-seo
- competitor-profiling
- content-strategy
- public-relations
- pricing
