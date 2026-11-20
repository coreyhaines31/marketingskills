# SpecStream

Live web data API for agents: web search, page text extraction, and Deep Search, which turns a request in plain words into a complete list of rows with a source URL on every value.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Web Search, Extract, Deep Search (lists), Research reports |
| MCP | ✓ | Remote server at `https://api.specstream.ai/mcp` (Streamable HTTP); OAuth or API key ([docs](https://specstream.ai/docs/mcp)) |
| CLI | ✓ | `@specstream/cli` on npm (`specstream` command) |
| SDK | ✓ | `@specstream/sdk` (TypeScript), `specstream-client` (Python) |

## Authentication

- **Type**: API key
- **Header**: `Authorization: Bearer {key}`
- **Environment variable**: `SPECSTREAM_API_KEY` (read by the CLI and the SDKs)
- **Get key**: Agents & API at https://specstream.ai/workspace. A key can be limited to chosen projects, operations and a spending limit.

```bash
export SPECSTREAM_API_KEY=...
```

## Endpoints

Base URL: `https://api.specstream.ai`

| Endpoint | Purpose |
|----------|---------|
| `GET /v1/web-search` | Search the live web; returns an answer or rows, with sources (`POST` takes the same parameters as a JSON body) |
| `POST /v1/web-search/batch` | Several searches in one call |
| `POST /v1/extract` | Main text of 1 to 20 URLs as Markdown, text or HTML |
| `POST /v1/parse` | Read a list request in plain words into conditions and columns |
| `POST /v1/capacity/quotes` | Price a parsed request before anything runs |
| `POST /v1/capacity/executions` | Start the run, up to the approved maximum |
| `GET /v1/finds/{id}` | Run status |
| `GET /v1/finds/{id}/rows` | Rows with their source URLs; follow `next_cursor` |
| `POST /v1/research` | Written report with a source for each cited sentence |

Every reply is `{"data": {...}}` on success or `{"error": {"code", "message", "details"}}`.

## MCP Setup

Add the remote server to any MCP client that supports Streamable HTTP:

```json
{
  "mcpServers": {
    "specstream": {
      "url": "https://api.specstream.ai/mcp",
      "headers": { "Authorization": "Bearer ${SPECSTREAM_API_KEY}" }
    }
  }
}
```

Clients that support OAuth can connect without a key and sign the user in. Claude Code:

```bash
claude mcp add --transport http specstream https://api.specstream.ai/mcp
```

Main tools: `search_web` (`{"q": "..."}`), `read_pages` (`{"urls": [...]}`), and for lists `compile`, `quote_capacity_work`, `authorize_capacity_work`, `get_find`, `list_find_rows`. List the rest with `tools/list`. Per-client setup: https://specstream.ai/docs/mcp/clients

## Common Agent Operations

### Web Search

```bash
curl -s "https://api.specstream.ai/v1/web-search" \
  -H "Authorization: Bearer $SPECSTREAM_API_KEY" \
  -G --data-urlencode "q=Which CRM do Series A fintech startups in Berlin use?"
```

`q` is written in everyday words, 1 to 2,000 characters. Add `speed=fast` for the lower-latency tier. `data.kind` is `fact` (one `answer` with the `page` it was read from) or `list` (`rows`), and `data.sources` lists each source with `read_at`.

```bash
specstream search "newsletter platforms used by B2B SaaS companies" --fast --num 20
specstream search "competitor pricing page changes" --news --country us --json
```

### Extract Page Text

```bash
curl -s https://api.specstream.ai/v1/extract \
  -H "Authorization: Bearer $SPECSTREAM_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://example.com/pricing", "https://example.com/blog/launch"], "format": "markdown"}'
```

`format` is `markdown` (default), `text` or `html`. Up to 20 URLs per call, including PDF, Word and Excel files.

```bash
specstream read https://example.com/pricing > pricing.md
```

### Build a List (Deep Search)

Describe the list in plain words. SpecStream reads it into conditions and columns, prices it, and runs only after the approved maximum is sent back.

```bash
# 1. Read the request
curl -s https://api.specstream.ai/v1/parse \
  -H "Authorization: Bearer $SPECSTREAM_API_KEY" -H "Content-Type: application/json" \
  -d '{"q": "B2B SaaS companies in France that raised a Series A in 2026, with their website and CEO"}'

# 2. Price it (use ast_hash from step 1)
curl -s https://api.specstream.ai/v1/capacity/quotes \
  -H "Authorization: Bearer $SPECSTREAM_API_KEY" -H "Content-Type: application/json" \
  -d '{"ast_hash": "<ast_hash>", "operation": "find", "requested_units": 50}'

# 3. Start it with the quote's own maximum, after the user approves it
curl -s https://api.specstream.ai/v1/capacity/executions \
  -H "Authorization: Bearer $SPECSTREAM_API_KEY" -H "Content-Type: application/json" \
  -d '{"quote_id": "<quote_id>", "quote_hash": "<quote_hash>", "confirm_max_cents": <maximum_cents>, "idempotency_key": "<stable key>"}'

# 4. Read the rows when the run ends
curl -s "https://api.specstream.ai/v1/finds/<find_id>/rows" -H "Authorization: Bearer $SPECSTREAM_API_KEY"
```

The same flow from the CLI:

```bash
specstream deep "Marketing agencies in Austin that work with SaaS companies, with website and founder" --results 25
specstream deep approve <quote_id> --max-cents <maximum_cents>
specstream deep rows <find_id> --all
```

Retrying step 3 with the same `idempotency_key` never starts a second run.

### Research Report

```bash
curl -s https://api.specstream.ai/v1/research \
  -H "Authorization: Bearer $SPECSTREAM_API_KEY" -H "Content-Type: application/json" \
  -d '{"input": "How do product-led SaaS companies price usage-based AI features?", "depth": "quick"}'
```

Returns `202` with the report `id`; read it with `GET /v1/research/{id}`. `depth` is `quick`, `standard` or `deep`.

## When to Use

- **Lead and account lists**: companies, people or places matching several conditions, each value with the page it came from
- **Competitor research**: pricing, positioning and launches read from competitors' own pages
- **Content research**: answers with sources for briefs and articles
- **Page extraction**: clean text of landing pages, docs, PDFs and reports for analysis
- **Monitoring**: a saved list request rerun on a schedule, with new and changed rows marked

## Rate Limits and Pricing

- Prices per search, per page and per delivered row: https://specstream.ai/pricing
- Deep Search shows the maximum cost before it runs; nothing starts without `confirm_max_cents`

## Docs

- API and agent guide: https://specstream.ai/agents.md
- Search API: https://specstream.ai/docs/search-api
- Extract API: https://specstream.ai/docs/extract-api
- MCP: https://specstream.ai/docs/mcp

## Relevant Skills

- customer-research
- competitor-profiling
- content-strategy
- ai-seo
- cold-email
