# Omnia

> **◆ Verified Partner integration.** Omnia sponsors Marketing Skills. This integration is disclosed and vetted for fit; it does **not** change what any skill recommends. It's listed here alongside the neutral options for the same job — use it when it's the right fit, not because it's a partner. See [Verified Partners](../REGISTRY.md#verified-partners).

Answer engine optimization (AEO) platform combining AI visibility monitoring, prompt discovery, competitor benchmarking, and citation analysis with an AI agent for content optimization, publishing, and third-party outreach.

## When to Use

Use when the user wants to monitor and improve their brand’s visibility in AI search answers. Track brand mentions, Share of Voice, and citations; review whether answers recommend the brand; compare competitors; and identify opportunities to improve content and third-party presence.

- **Connected assistant:** Use MCP to analyze Omnia data interactively, or the API to build recurring reports and scripts. Apply the ai-seo and content-strategy skills to turn the evidence into content briefs, page improvements, and outreach opportunities.
- **Built-in Omnia Agent:** Use your Omnia Agent to research sources, propose projects, create or update content, and publish or send outreach through connected apps with user approval. Remeasure visibility to inform the next iteration.

For a small audit, manual prompt checks and a spreadsheet are sufficient. See the ai-seo skill for other monitoring tools and options.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for brands, prompts, AI answers, performance, and saved prompt views |
| MCP | ✓ | Remote Streamable HTTP server; OAuth; data and API-documentation discovery tools |
| CLI | - | No dedicated CLI documented; use HTTP requests |
| SDK | - | No official SDK documented; use a standard HTTP client |

The [MCP overview](https://docs.useomnia.com/mcp) describes access to monitoring data and API-documentation discovery. Use current brand, prompt, and view endpoints for visibility, Share of Voice, citations, and sentiment. Engine filters include ChatGPT (`openai`), Perplexity, Google AI Overviews, Google AI Mode, Gemini, Grok, Copilot, and Claude; check the account's monitored engines before comparing results.

The built-in [Omnia Agent](https://www.useomnia.com/omnia-agent) researches citation sources, proposes projects, drafts and updates content, and supports publishing and third-party outreach through connected apps with user approval. These execution features run inside Omnia; the MCP and API setup below covers access to monitoring data and documented API operations.

## Authentication

- **MCP:** OAuth through an active Omnia account. Complete sign-in in the client; do not put an API key into the OAuth config.
- **API:** Generate a key on the [API access page](https://app.useomnia.com/api-access). Send `Authorization: Bearer $OMNIA_API_KEY`.
- Store the API key in an environment variable or secret manager. Keep it out of source control, frontend code, and logs; revoke exposed keys.

See [API authentication](https://docs.useomnia.com/api/authentication).

## MCP Setup

**Claude Code**

```bash
claude mcp add --transport http omnia https://app.useomnia.com/mcp
```

Then go to `/mcp` → omnia → Authenticate and complete OAuth.

**stdio-only clients**

Use `mcp-remote` to proxy Omnia's Streamable HTTP server to stdio:

```bash
npx -y mcp-remote https://app.useomnia.com/mcp
```

Point your client's config at that wrapper and follow its OAuth flow.

After connecting, list the server's tools and read their input schemas. Use a read-only request to confirm the intended brand is accessible. Data tools query monitoring results; discovery tools retrieve live endpoint specifications and schemas for writing API code. Do not guess tool names or assume every tool is read-only.

Example agent request: “For our tracked buyer prompts, compare brand mentions over the last two equal periods, separate citations from recommendations, and show the cited URLs behind persistent gaps.”

## API Setup and Common Operations

The base URL is `https://app.useomnia.com/api/v1`. The examples below require `curl` and an API key supplied securely as `OMNIA_API_KEY`.

### Find the Brand and Prompts

```bash
: "${OMNIA_API_KEY:?Set OMNIA_API_KEY through your secret manager or local environment}"
curl --fail-with-body --silent --show-error \
  'https://app.useomnia.com/api/v1/brands?pageSize=100' \
  -H "Authorization: Bearer $OMNIA_API_KEY"
```

Select the intended brand from `data.brands` and set `OMNIA_BRAND_ID` to its `id` (a UUID). Then read its prompts:

```bash
: "${OMNIA_BRAND_ID:?Set OMNIA_BRAND_ID from the brands response}"
curl --fail-with-body --silent --show-error \
  "https://app.useomnia.com/api/v1/brands/$OMNIA_BRAND_ID/prompts?pageSize=100" \
  -H "Authorization: Bearer $OMNIA_API_KEY"
```

The [brand prompt endpoint](https://docs.useomnia.com/api/prompt/list-brand-prompts) returns `data.prompts` and supports `type` (`Branded` or `Non-Branded`), `countries`, `tags`, and `status` (`active` or `paused`) filters. Its optional `startDate`/`endDate` range sets the window for each prompt's returned `shareOfVoice` and `netSentiment` and for metric-based sorting; it defaults to the last seven days.

### Compare Share of Voice

Set `OMNIA_START_DATE` and `OMNIA_END_DATE` to an inclusive ISO date range with collected data (for example, `2026-10-01` and `2026-10-07`).

```bash
: "${OMNIA_START_DATE:?Set OMNIA_START_DATE}"
: "${OMNIA_END_DATE:?Set OMNIA_END_DATE}"
curl --fail-with-body --silent --show-error --get \
  "https://app.useomnia.com/api/v1/brands/$OMNIA_BRAND_ID/share-of-voice/aggregates" \
  -H "Authorization: Bearer $OMNIA_API_KEY" \
  --data-urlencode "startDate=$OMNIA_START_DATE" \
  --data-urlencode "endDate=$OMNIA_END_DATE" \
  --data-urlencode 'engine=openai' \
  --data-urlencode 'pageSize=100'
```

The [endpoint reference](https://docs.useomnia.com/api/brand/performance/get-share-of-voice-aggregates) documents `engine`, `locations`, `tags`, and `promptType` (`Branded` or `Non-Branded`) filters. Results include `data.aggregates` with `brand`, `mentionCount`, `rank`, `relationship`, and `shareOfVoice`. Share of Voice is each brand's portion of all brand mentions in the sampled answers, not its citation rate. Preserve filters and sampling when comparing periods.

### Inspect the Evidence

These are read-only operations; consult each linked schema for required parameters and response fields:

| Job | Endpoint | Reference |
|-----|----------|-----------|
| Measure brand appearance | `GET /brands/{brand}/visibility/aggregates` | [Visibility aggregates](https://docs.useomnia.com/api/brand/performance/get-visibility-aggregates) |
| Analyze sentiment by brand and feature | `GET /brands/{brand}/sentiment/aggregates` | [Sentiment aggregates](https://docs.useomnia.com/api/brand/performance/get-sentiment-aggregates) |
| Read brand details | `GET /brands/{brand}` | [Brand details](https://docs.useomnia.com/api/brand/get-brand) |
| List answers behind a prompt's metrics | `GET /prompts/{prompt}/ai-answers` | [AI answers](https://docs.useomnia.com/api/ai-answer/list-ai-answers) |
| Read one answer's full text and citations | `GET /ai-answers/{ai-answer}` | [AI answer](https://docs.useomnia.com/api/ai-answer/get-ai-answer) |
| Find cited pages for a prompt | `GET /prompts/{prompt}/citations/aggregates` | [Citation aggregates](https://docs.useomnia.com/api/prompt/performance/get-citations-aggregates) |
| Compare share of voice over time | `GET /brands/{brand}/share-of-voice/timeseries` | [Time series](https://docs.useomnia.com/api/brand/performance/get-share-of-voice-time-series) |

Paths are relative to the API base URL. AI-answer and performance queries require `startDate` and `endDate`. Visibility measures the share of monitored prompts whose answers mention a brand; sentiment aggregates count endorsed, undermined, and neutral feature mentions. The answer listing returns metadata (engine, `mentioned`, `mentionedBrands`, cited `domains`), not the answer text; fetch individual answers to read the wording and distinguish recommendations from passing mentions, and read cited pages before treating brand absence as a content gap.

## Practical Workflows

1. **Visibility monitoring:** Select commercially relevant tracked prompts, record engine/location/date filters, compare brand mentions and Share of Voice across equal periods.
2. **Competitor analysis:** Compare `competitor` rows in visibility and Share of Voice aggregates, and check `mentionedBrands` in AI answers. Review recurring recommendations and their context.
3. **Citation-gap analysis:** Inspect cited URLs for prompts where competing brands appear and the user's brand does not. Check whether those pages actually cover the competitors, then distinguish missing owned answers from missing credible third-party coverage.
4. **Prioritize improvements:** Combine repeated gaps with customer questions, product fit, available evidence, and effort. Draft page updates, content briefs, or relevant third-party outreach opportunities; remeasure the same prompts after publishing. Observed patterns inform priorities; they do not prove a cause or guarantee a remedy.

Use the `ai-seo` and `content-strategy` skills for decisions and execution beyond data retrieval.

## Limitations and Prerequisites

- An active account, accessible brand, and collected prompt-monitoring data are required for meaningful analysis. Confirm plan entitlements, monitoring limits, and credits before enabling monitoring.
- MCP uses interactive OAuth. For unattended scripts, use the documented API-key flow (keys start with `ot_`); store the key in `OMNIA_API_KEY`. API-key authentication on the MCP server is not documented here.
- Rate limits: token bucket; each GET costs 1 token and each write costs 5. Check `X-RateLimit-Remaining`, and on `429` back off using `Retry-After`. See [rate limiting](https://docs.useomnia.com/api/rate-limiting).
- Some operations consume credits (e.g., generating insights). Check your account's credit balance before enabling automated workflows that may spend credits.
- AI answers vary between runs, engines, locations, and time periods. Monitoring reflects the configured prompt sample, not every buyer conversation or actual search demand. Citation changes do not prove an intervention caused recommendations.
- APIs also support writes. Read the current schema and confirm intended scope before changing brands, prompts, or monitoring; deletions can remove history permanently.
- Follow pagination `links.next` until exhausted (`pageSize` accepts 5–100). AI-answer listing warns that page lengths and reported totals can be approximate. See [pagination](https://docs.useomnia.com/api/pagination) and the AI-answer reference above.
- Response shapes vary by endpoint. Parse the documented `data` fields; [streaming metrics exports](https://docs.useomnia.com/api/brand/performance/stream-metrics-export) use NDJSON, while [asynchronous metrics exports](https://docs.useomnia.com/api/brand/performance/create-metrics-export-task) produce a downloadable ZIP with NDJSON or CSV files. Exports cover Share of Voice, visibility, and citations at brand or prompt granularity. Async results can be obtained by polling or completion webhooks; see [responses](https://docs.useomnia.com/api/responses) and [async operations](https://docs.useomnia.com/api/async-operations).

## Documentation

- [REST API overview](https://docs.useomnia.com/api)
- [MCP overview and tool families](https://docs.useomnia.com/mcp)
