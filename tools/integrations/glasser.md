# Glasser

Pay-per-call access to 1,000+ paid data API endpoints from 20+ providers via a single key. Provides agent-native access to SEO, search, enrichment, email-finding, and scraping vendors that otherwise each need their own account, plan, or minimum deposit.

> **Disclosure:** this guide was contributed by a member of the Glasser team. Glasser is a young product (CLI first published September 2026), so confirm coverage, pricing, and each provider's terms before relying on it.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for searching endpoints, inspecting prices, and running calls |
| MCP | ✓ | Hosted MCP server exposes the same operations |
| CLI | ✓ | `glasser` for searching, inspecting, and running endpoints |

## Authentication

- **Type**: API Key (Bearer)
- **Setup**: `npm install -g @glasser-ai/cli`, then `glasser login` to store a key via browser approval ([current instructions](https://glasser.ai/SKILL.md?utm_source=marketingskills&utm_medium=skill))
- **API Key** (CI / MCP): `GLASSER_API_KEY` env var, created at https://app.glasser.ai/keys

Glasser holds the provider accounts: no signup, plan, or key at any provider, and every call is billed to one prepaid balance at a price shown before the call. Individual provider coverage is listed in the Data Providers table below.

## When to Use Glasser vs. Native Tools

Glasser is an **alternative integration method**, not a replacement. Follow the user's explicit tool choice first. Otherwise, prefer an existing key, integration, or free tool that meets the task's requirements. Use this decision guide:

| Scenario | Use |
|----------|-----|
| Keyword volume or a SERP snapshot for an audit, no DataForSEO account | Glasser (`dataforseo`, `serper`) |
| Occasional backlink or domain-rating checks without your own SEO tool subscription | Glasser (`ahrefs`, `semrush`, `serpstat`), if its per-call access fits the provider's terms for your use |
| Work email for one prospect, no Hunter or Apollo account | Glasser (`hunter`, `leadmagic`, `prospeo`) |
| Firmographics, tech stack, and job openings for a competitor set | Glasser (`pdl`, `builtwith`, `predictleads`) |
| What people say on TikTok, Reddit, Xiaohongshu, or Douyin about a category | Glasser (`scrapecreators`, `tikhub`) |
| You already hold a DataForSEO, Ahrefs, Semrush, Exa, Apollo, ZoomInfo, or Hunter key | That vendor's native guide |
| Your own site's Search Console or GA4 data, ad platforms, CRMs | Native MCP server or API guide |
| Vendor not covered by Glasser | Native API guide |

## Setup

### 1. Install the CLI

```bash
npm install -g @glasser-ai/cli
```

Requires Node.js 22+.

### 2. Log in

```bash
glasser login
```

This opens the console; approve when the code on the page matches the terminal. The key persists across sessions.

### 3. Verify installation

```bash
glasser balance
```

Exit 0 means the key works.

### 4. MCP server (optional)

For agents without a shell, add the hosted server to your MCP client configuration. Set `GLASSER_API_KEY` in the client's environment. For Claude Code, use `.mcp.json`:

```json
{
  "mcpServers": {
    "glasser": {
      "type": "http",
      "url": "https://api.glasser.ai/mcp",
      "headers": { "Authorization": "Bearer ${GLASSER_API_KEY}" }
    }
  }
}
```

In Claude Code, run `/mcp` to confirm `glasser` is connected. For Cursor, Codex, and other clients, follow the [client-specific MCP setup instructions](https://glasser.ai/docs/mcp-server); configuration formats and environment variable syntax differ.

## Data Providers Available via Glasser

### By Marketing Need

One key covers every row. Several providers usually sell the same job; `glasser search` lists them with the price beside each, so the agent picks per call.

| Need | Providers via Glasser | What you get |
|------|----------------------|--------------|
| Keyword research | [DataForSEO](https://glasser.ai/data-sources/dataforseo), [Ahrefs](https://glasser.ai/data-sources/ahrefs), [Semrush](https://glasser.ai/data-sources/semrush), [Serpstat](https://glasser.ai/data-sources/serpstat) | Search volume, keyword ideas, difficulty, CPC from four indexes without a plan at any of them |
| SERP snapshots and rank checks | [DataForSEO](https://glasser.ai/data-sources/dataforseo), [Serper](https://glasser.ai/data-sources/serper), [SerpApi](https://glasser.ai/data-sources/serpapi) | Google, Bing, DuckDuckGo, Baidu result pages; news, images, videos, places, scholar, shopping |
| Backlink audit and domain rating | [Ahrefs](https://glasser.ai/data-sources/ahrefs), [DataForSEO](https://glasser.ai/data-sources/dataforseo), [Semrush](https://glasser.ai/data-sources/semrush), [Serpstat](https://glasser.ai/data-sources/serpstat) | Backlink profiles, referring domains, anchors, DR, broken links — the Ahrefs index without an Ahrefs plan |
| AI search visibility | [Ahrefs](https://glasser.ai/data-sources/ahrefs), [DataForSEO](https://glasser.ai/data-sources/dataforseo) | How often a domain is cited in ChatGPT, Perplexity, Gemini, Copilot and Google AI answers; AI keyword volume |
| Competitor and company research | [People Data Labs](https://glasser.ai/data-sources/pdl), [Apollo](https://glasser.ai/data-sources/apollo), [ZoomInfo](https://glasser.ai/data-sources/zoominfo), [Crustdata](https://glasser.ai/data-sources/crustdata), [Akta](https://glasser.ai/data-sources/akta), [PredictLeads](https://glasser.ai/data-sources/predictleads), [BuiltWith](https://glasser.ai/data-sources/builtwith) | Firmographics, headcount trends, funding and news events, tech stack, products |
| Prospect lists and people search | [People Data Labs](https://glasser.ai/data-sources/pdl), [Apollo](https://glasser.ai/data-sources/apollo), [Lusha](https://glasser.ai/data-sources/lusha), [Crustdata](https://glasser.ai/data-sources/crustdata), [Prospeo](https://glasser.ai/data-sources/prospeo), [ZoomInfo](https://glasser.ai/data-sources/zoominfo) | Person search by title, company, location; lookalikes; enrichment from a LinkedIn URL |
| Work email finding | [Hunter](https://glasser.ai/data-sources/hunter), [LeadMagic](https://glasser.ai/data-sources/leadmagic), [Prospeo](https://glasser.ai/data-sources/prospeo), [ContactOut](https://glasser.ai/data-sources/contactout), [Lusha](https://glasser.ai/data-sources/lusha) | Five finders behind one key; several charge nothing when no email is found (see `inspect`) |
| Hiring signals | [TheirStack](https://glasser.ai/data-sources/theirstack), [PredictLeads](https://glasser.ai/data-sources/predictleads), [Apollo](https://glasser.ai/data-sources/apollo), [Crustdata](https://glasser.ai/data-sources/crustdata) | Job postings by company, role, or technology |
| Social listening | [ScrapeCreators](https://glasser.ai/data-sources/scrapecreators) | TikTok, Instagram, Facebook, YouTube, X, Reddit, LinkedIn, Pinterest: posts, comments, transcripts, profiles |
| Chinese platforms | [TikHub](https://glasser.ai/data-sources/tikhub) | Douyin, Xiaohongshu, Weibo, Bilibili, Kuaishou, WeChat — search, comments, trending; not covered by any other guide in this repo |
| Content research by meaning | [Exa](https://glasser.ai/data-sources/exa) | Neural web search, pages similar to a URL, answers with citations, page text for a list of URLs |
| Web and marketplace scraping | [Serper](https://glasser.ai/data-sources/serper), [Apify](https://glasser.ai/data-sources/apify), [Bright Data](https://glasser.ai/data-sources/brightdata) | Page-to-text; Amazon, app stores, Google Maps, Crunchbase, Glassdoor datasets |

### Alternative to Existing Tools

These vendors **already have API guides** in this repo. Glasser provides an alternative path:

| Tool | Glasser slug | Native Integration | Direct access | Via Glasser |
|------|--------------|-------------------|---------------|-------------|
| [DataForSEO](dataforseo.md) | [`dataforseo`](https://glasser.ai/data-sources/dataforseo) | API ✓, CLI ✓, SDK ✓ | Pay as you go with a minimum deposit | Per call, no deposit |
| [Ahrefs](ahrefs.md) | [`ahrefs`](https://glasser.ai/data-sources/ahrefs) | API ✓, CLI ✓ | API from a paid plan | Per call, no plan |
| [Semrush](semrush.md) | [`semrush`](https://glasser.ai/data-sources/semrush) | API ✓, CLI ✓ | API from a paid plan plus API units | Per call, no plan |
| [Exa](exa.md) | [`exa`](https://glasser.ai/data-sources/exa) | API ✓, MCP ✓, CLI ✓, SDK ✓ | Pay per use, free starter tier | Per call — prefer native (MCP, SDKs) |
| [Apollo](apollo.md) | [`apollo`](https://glasser.ai/data-sources/apollo) | API ✓, CLI ✓ | Free tier includes API credits | Per call, no account |
| [ZoomInfo](zoominfo.md) | [`zoominfo`](https://glasser.ai/data-sources/zoominfo) | API ✓, MCP ✓, CLI ✓ | Pricing not public | Per result — prefer native (MCP, intent data) |
| [Hunter](hunter.md) | [`hunter`](https://glasser.ai/data-sources/hunter) | API ✓, CLI ✓ | Free tier includes API credits; paid plans above | Per call, no account |

Coverage changes over time — `glasser search` lists the current providers.

## Common Agent Operations

### Search endpoints

```bash
glasser search -q "keyword search volume"
```

### Inspect an endpoint's price and input schema

```bash
glasser inspect -p dataforseo -e /v3/keywords_data/google_ads/search_volume/live
```

### Run an endpoint

```bash
glasser run -p dataforseo -e /v3/keywords_data/google_ads/search_volume/live \
  -i '{"keywords":["coffee roaster","espresso machine"],"language_code":"en","location_code":2840}'
```

### Wait for an asynchronous run

Inspect reports `run_mode`. For asynchronous endpoints, add `--wait` to `glasser run`. If a run returns `QUEUED` or `RUNNING`, fetch that run until it settles:

```bash
glasser runs get -r <runId> --wait
```

Do not submit another run to check progress. `COMPLETED` means the provider answered; check the provider response for errors or missing results, and report the final charge.

### Run an endpoint over HTTP

```http
POST https://api.glasser.ai/v1/runs
Authorization: Bearer {key}
Content-Type: application/json
Idempotency-Key: {uuid}

{ "provider": "serper", "endpoint": "/search", "input": { "q": "vector database benchmarks", "num": 10 } }
```

An asynchronous endpoint can return `202` with an in-flight run. Poll `GET /v1/runs/{runId}` until its status is terminal. On a timeout or dropped connection, retry with the same idempotency key; a new key can create a second paid run.

## Example Workflows

### Keyword research for a niche

```
> "Get monthly search volume and related keyword ideas for 'espresso machine' in the US"
```
Agent uses `dataforseo` (`/v3/keywords_data/google_ads/search_volume/live`, `/v3/dataforseo_labs/google/keyword_ideas/live`).

### Competitor profile

```
> "Pull firmographics, tech stack, and recent news for acme.com and two competitors"
```
Agent uses `pdl` (`/v5/company/enrich`), `builtwith` (`/v23/api.json`), and `serper` (`/news`).

### Find a work email before outreach

```
> "Find the work email for Patrick Collison at stripe.com"
```
Agent uses `hunter` (`/v2/email-finder`); `leadmagic` and `prospeo` sell the same lookup.

## Limitations

- **Coverage depth varies** — some providers expose hundreds of endpoints (TikHub, ScrapeCreators, DataForSEO), others a handful (Semrush, Exa, TheirStack)
- **No customization** — you can't add endpoints or change a provider's input schema
- **Vendor dependency** — if Glasser's servers are down, all providers are unavailable through this path
- **Rate limits apply** — Glasser enforces its own per-account and per-endpoint limits
- **Raw provider payloads** — output keeps each provider's own shape; field meanings come from the provider's docs, linked from `inspect`
- **Prepaid balance** — a run that exceeds the available balance is refused before it starts

## Pricing

Pay per call, no subscription. Each endpoint publishes its price; `inspect` shows it before you run. Current prices for every endpoint: https://glasser.ai/data-sources

- Provider errors, timeouts, and internal failures are never charged
- An empty result is charged per the endpoint's `NO_RESULT` clause; free on some endpoints
- A retry with the same idempotency key returns the original run and is never charged twice

## Rate Limits

- Per account and per endpoint; a `429` carries `retry_after_ms`
- `search` returns up to 20 results per page

## See Also

- [How it works](https://glasser.ai/docs/how-it-works) — endpoints, prices, run lifecycle, idempotent retries
- [CLI reference](https://glasser.ai/docs/cli) — every command, flags, exit codes, JSON mode

## Relevant Skills

- seo-audit (DataForSEO, Ahrefs, Semrush via Glasser)
- competitor-profiling (BuiltWith, People Data Labs, news search via Glasser)
- prospecting (People Data Labs, Apollo, Hunter via Glasser)
- cold-email (Hunter, LeadMagic, Prospeo via Glasser)
