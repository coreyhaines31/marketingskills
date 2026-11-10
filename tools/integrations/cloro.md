# cloro

API that sends a prompt to ChatGPT, Google AI Mode, Bing AI Mode or Gemini, or a query to Google Search, from a chosen country, and returns the parsed answer: the text, the sources it cites, and for Google the organic results with the AI Overview. Billed in credits per request.

Facts below were checked against the [API reference](https://cloro.dev/docs/api-reference/introduction) and live responses on 2026-11-05. Bing AI Mode facts come from the [API reference](https://cloro.dev/docs/api-reference/endpoint/monitor-bing-aimode).

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST, `https://api.cloro.dev`. Sync (`/v1/monitor/*`) and async batch (`/v1/async/*`) |
| MCP | ✓ | Hosted, `https://mcp.cloro.dev/mcp` (Streamable HTTP), API key or OAuth |
| CLI | ✓ | [cloro.js](../clis/cloro.js) |
| SDK | - | Plain HTTP |

## Authentication

- **Type**: Bearer token
- **Header**: `Authorization: Bearer {CLORO_API_KEY}`
- **Env var** (convention): `CLORO_API_KEY`
- **Get key**: [dashboard.cloro.dev/api-keys](https://dashboard.cloro.dev/api-keys). The free plan includes 500 credits a month.

## Common Agent Operations

All request bodies take `country` as an ISO 3166-1 alpha-2 code (`US`, `DE`, `BR`). `GET /v1/countries?model=chatgpt` lists the codes each engine supports.

### AI answer with cited sources (ChatGPT, Google AI Mode, Bing AI Mode, Gemini)

```bash
POST https://api.cloro.dev/v1/monitor/chatgpt
Authorization: Bearer $CLORO_API_KEY

{
  "prompt": "What are the best CRM tools for small agencies?",
  "country": "US",
  "include": { "markdown": true }
}
```

Use the same body for `/v1/monitor/aimode` (Google AI Mode), `/v1/monitor/bing/aimode` (Bing AI Mode) and `/v1/monitor/gemini`. Response:

```json
{
  "success": true,
  "result": {
    "text": "For small agencies, ...",
    "markdown": "For small agencies, ...",
    "sources": [
      { "position": 1, "label": "Best CRM for agencies", "url": "https://example.com/crm", "description": "..." }
    ],
    "citationPills": [],
    "model": null
  }
}
```

- `sources` is every source the answer used. Count each one as a citation. The `footnote` flag on ChatGPT sources is not a reliable marker of an inline citation.
- `citationPills` are the inline source chips. The list can be empty.
- `model` can be `null` on ChatGPT. Bing AI Mode has no `model` field.
- `include.markdown` adds no cost.

### Google results with the AI Overview

```bash
POST https://api.cloro.dev/v1/monitor/google
Authorization: Bearer $CLORO_API_KEY

{
  "query": "best crm for small agencies",
  "country": "US",
  "include": { "aioverview": true }
}
```

The `result` has `organicResults` (`position`, `title`, `link`, `displayedLink`, `snippet`, `page`), `peopleAlsoAsk`, `relatedSearches`, `ads` when present, and `aioverview` (`text`, `sources`, `citationPills`) when Google shows one for that query. Without `include.aioverview` the AI Overview is not returned.

A result `link` can be empty or a `google.com/goto` URL. Skip those results, or resolve the `redirectLink` with `POST /v1/monitor/google/goto` (`{ "url": "<redirectLink>" }`, 1 credit).

### Many prompts (async batch)

```bash
POST https://api.cloro.dev/v1/async/task/batch

[
  { "taskType": "CHATGPT", "idempotencyKey": "crm-chatgpt-us", "payload": { "prompt": "best crm for small agencies", "country": "US" } },
  { "taskType": "AIMODE",  "idempotencyKey": "crm-aimode-us",  "payload": { "prompt": "best crm for small agencies", "country": "US" } },
  { "taskType": "GOOGLE",  "idempotencyKey": "crm-google-us",  "payload": { "query": "best crm for small agencies", "country": "US", "include": { "aioverview": true } } }
]
```

`taskType` is `CHATGPT`, `AIMODE`, `BING_AIMODE`, `GEMINI` or `GOOGLE`. The response lists one task `id` for each item. Poll each one:

```bash
GET https://api.cloro.dev/v1/async/task/{id}
```

`task.status` goes `QUEUED` → `PROCESSING` → `COMPLETED` or `FAILED`. When it is `COMPLETED`, the engine result is in `response` (same shape as the sync `result`). Webhooks are also available; see the [async guide](https://cloro.dev/docs/guides/making-requests/async).

### Credit balance

```bash
GET https://api.cloro.dev/v1/credits
```

Returns `remaining`, `perCycle` and `cycleResetsAt`. The value can lag by up to 60 seconds.

## MCP

Hosted server at `https://mcp.cloro.dev/mcp`. In Claude Code:

```bash
claude mcp add --transport http cloro https://mcp.cloro.dev/mcp
```

Then run `/mcp` in a session to sign in with OAuth. Clients that can set headers can send `Authorization: Bearer $CLORO_API_KEY` instead.

This guide covers these tools: `scrape_chatgpt`, `scrape_google_ai_mode`, `scrape_bing_aimode`, `scrape_gemini`, `scrape_google` and `list_countries`. The server lists other tools as well; use only the ones named here. Each MCP call is a sync request at the sync price below.

## Credits and Limits

| Request | Sync | Async |
|---------|-----:|------:|
| ChatGPT | 7 | 5 |
| Google AI Mode | 6 | 4 |
| Bing AI Mode | 6 | 4 |
| Gemini | 6 | 4 |
| Google Search | 5 | 3 |
| Google Search with AI Overview | 7 | 5 |

- Sync responses carry `X-Credits-Charged` and `X-Request-ID` headers.
- Concurrency is set per account (`X-Concurrency-Limit`). Over the limit, the API returns 429.
- Errors return `{ "success": false, "error": { "code", "message" } }`. A bad key returns 401 (`INVALID_API_KEY_FORMAT`). An empty balance returns 403 (`INSUFFICIENT_CREDITS`).
- A sync AI answer can take up to about a minute. A Google Search takes a few seconds. Use async for more than a few prompts.
- For plain web search with no AI answers or AI Overview, a general SERP API costs less per query.

## When to Use

- Check what ChatGPT, Google AI Mode, Bing AI Mode or Gemini answers for a buyer prompt in a given country, and which pages it cites.
- Check if a Google query shows an AI Overview, and which sources it cites, next to the organic results.
- Build your own share-of-voice count over a fixed prompt set with the async batch.

cloro returns raw answers and sources. It has no dashboard, trend charts or alerts, so the agent (or a script) does the counting. For a hosted tracker with history and reports, see the monitoring tools in the ai-seo skill (Otterly AI, Peec AI, ZipTie, LLMrefs, Profound, Ahrefs Brand Radar, Semrush, Omnia), or the DIY method in that skill.

## Relevant Skills

- **ai-seo**: monitoring AI visibility and citations
- **seo-audit**: checking AI Overview presence for target queries
- **competitor-profiling**: which competitors AI answers name and cite

## CLI

```bash
node tools/clis/cloro.js ask chatgpt --prompt "best crm for small agencies" --country US
node tools/clis/cloro.js ask aimode --prompt "best crm for small agencies" --markdown
node tools/clis/cloro.js ask bing_aimode --prompt "best crm for small agencies" --country GB
node tools/clis/cloro.js serp google --query "best crm for small agencies" --country DE --aio
node tools/clis/cloro.js countries --model gemini
node tools/clis/cloro.js credits
```

`--country` defaults to `US`. Preview a paid request without sending it, and without a key, with `--dry-run`.
