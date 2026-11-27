# Clay

GTM data and automation platform: search a database of people and companies, run enrichment functions (including waterfalls across many providers), and query Clay tables.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Public API v0: search, routines (functions), table queries, credits |
| MCP | ✓ | Official hosted server at `https://api.clay.com/v3/mcp` (OAuth): find and enrich people and companies, run your Clay workflows ([guide](https://www.clay.com/guides/clay-mcp)) |
| CLI | ✓ | [clay.js](../clis/clay.js) for the Public API; official `clay` CLI for the full workspace (see below) |
| SDK | - | REST API only ([OpenAPI spec](https://developers.clay.com/openapi.json)) |

## Authentication

- **Type**: API key
- **Header**: `clay-api-key: {api_key}` (not `Authorization: Bearer`)
- **Env var**: `CLAY_API_KEY` for `clay.js`
- **Get key**: Settings > API and CLI > API keys at https://app.clay.com, or `clay api-keys create --name "<name>"` with the official CLI. The secret is shown once, at creation.
- **Base URL**: `https://api.clay.com/public/v0`

The session from `clay login` (OAuth) works for the official CLI only. Public API calls need an API key.

## Official CLI

Clay ships its own JSON-first CLI, which covers more than the Public API: tables, routines, workflows, audiences, sequences, signals and webhooks.

```bash
# Install and sign in: follow the "Run the cli-setup skill" steps in
# https://github.com/clay-run/agent-plugins/blob/main/GETTING_STARTED.md
clay login
clay whoami

clay routines list        # find routine ids for functions you can run
clay tables --help
clay --help               # full command surface
```

Exit codes: `3` auth error, `4` rate limited (`details.retryAfter` in the error), `5` network error.

## Common Agent Operations

### Check the key and credits

```bash
GET https://api.clay.com/public/v0/me
GET https://api.clay.com/public/v0/credits/balance

clay-api-key: {api_key}
```

```bash
node tools/clis/clay.js me
node tools/clis/clay.js credits balance
```

Reading balances does not consume credits.

### Search people or companies

Fetch the query reference first. It documents the fields and grammar.

```bash
GET https://api.clay.com/public/v0/search/query-mode/reference?sections=grammar,examples,people-fields
```

Create the search, then page results with its `search_id`:

```bash
POST https://api.clay.com/public/v0/search/query-mode

{
  "query": "select from people where experiences.any(is_current = true and job_title is_similar_to (\"VP Sales\") and company.estimated_employee_count >= 500)"
}

POST https://api.clay.com/public/v0/search/query-mode/{search_id}/run

{ "limit": 20 }
```

```bash
node tools/clis/clay.js search reference --sections grammar,examples
node tools/clis/clay.js search create --query 'select from companies where people.exists(is_current = true and job_title is_similar_to ("VP Sales"))'
node tools/clis/clay.js search run --id <search_id> --limit 50
```

`limit` is 1 to 500 per page. Count queries and job searches are not available through the Public API.

### Enrich with a function (routine)

Enrichment runs through routines: Clay-managed functions (work email, phone, company data, tech stack, funding, news) or custom functions built in the Clay UI. Custom function ids look like `function:t_...`. Get ids from `clay routines list` or the Clay app. The Public API has no list endpoint.

```bash
POST https://api.clay.com/public/v0/routines/{routine_id}/run

{
  "items": [
    { "id": "row-1", "inputs": { "domain": "acme.com" } },
    { "id": "row-2", "inputs": { "domain": "example.com" } }
  ]
}
```

```bash
node tools/clis/clay.js routines run --id function:t_abc123 --items '[{"id":"row-1","inputs":{"domain":"acme.com"}}]'
```

One request takes 1 to 100 items and returns a `routine_run_id`. Pass `webhook_id` (`--webhook-id`) to get notified when the run finishes instead of polling. For larger lists, use the batch endpoints (upload a JSONL file, then `run-batch/start`); see the [batch runs guide](https://developers.clay.com/routines/batch-runs.md).

Runs spend credits. Check the balance first and confirm with the user before large runs.

### Read routine results

```bash
GET https://api.clay.com/public/v0/routines/run/{routine_run_id}/results?limit=20&cursor={cursor}
```

```bash
node tools/clis/clay.js routines results --run-id <routine_run_id>
```

While the run is processing, it returns HTTP 202 with `status: "in_progress"` and progress counters. When finished, it returns HTTP 200 with `status: "complete"` and a `data` array. Each item's `id` matches the id you sent. Check each item's `status`, because a complete run can contain failed items. Poll at a modest interval.

### Query a table

Structured queries against tables you already have (Enterprise plan). Pass the returned `cursor` to fetch the next page. Records updated mid-scan can repeat, so deduplicate by id.

```bash
POST https://api.clay.com/public/v0/tables/query

{
  "query": { "tables": ["<table_id>"] },
  "limit": 50
}
```

```bash
node tools/clis/clay.js tables query --query '{"tables":["<table_id>"]}' --limit 50
```

`query` also accepts `select`, `filter`, `join`, `group_by` and `order_by`; see the [tables guide](https://developers.clay.com/tables.md). The Public API has no endpoint for inserting table rows. Send inbound records to a table through its webhook source in Clay.

## Rate Limits

- Default: 300 requests per minute per workspace, shared across all keys and OAuth credentials
- `429` responses include `Retry-After` (seconds), plus `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset` when available
- Spread requests out; bursts can hit `429` under the per-minute total
- Prefer batch runs and run webhooks over tight polling loops
- Enrichment credits are charged per function run and vary by data provider

## When to Use

- Building enriched prospect lists with waterfall enrichment across multiple providers
- Finding people or companies that match an ICP with nested, cross-entity criteria
- Finding verified contact info (emails, phone numbers) for a list
- Company research: firmographics, tech stack, funding, hiring
- Running a team's own Clay functions from a backend job or agent
- Reading enriched data back out of Clay tables

## Docs

- Developer docs: https://developers.clay.com (agent index: https://developers.clay.com/llms.txt)
- OpenAPI spec: https://developers.clay.com/openapi.json
- Official agent plugin and CLI: https://github.com/clay-run/agent-plugins

## Relevant Skills

- cold-email
- revops
- sales-enablement
- competitors
