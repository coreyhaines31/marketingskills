# AIsa

> **◆ Verified Partner integration.** AIsa sponsors Marketing Skills. This integration is disclosed and vetted for fit; it does **not** change what any skill recommends. It's listed here alongside the neutral options for the same job — use it when it's the right fit, not because it's a partner. See [Verified Partners](../REGISTRY.md#verified-partners).

One account and one key for third-party data APIs, billed per call. For marketing work, the relevant parts are SEO data (DataForSEO, Semrush, and Ahrefs endpoints), Similarweb market data, social data (X/Twitter, Instagram, Reddit, Pinterest, YouTube), web search and research (Tavily, Firecrawl, Exa, Perplexity), and people and company search. AIsa also offers model inference and finance data, which this guide doesn't cover.

The MCP workflows, authentication, pricing guidance, and coverage below were reviewed against the [MCP guide](https://mcp.aisa.one/llms.txt), the [agent quickstart](https://aisa.one/docs/agent-quickstart), the [public catalogue](https://mcp.aisa.one/servers), and the linked authentication and billing docs on 2026-10-15. This review did not execute authenticated provider calls. Coverage and prices change; inspect the selected operation before use.

See the [quick start](../aisa/README.md), [coverage map](../aisa/coverage-map.md), and [evaluation scenarios](../aisa/evals/README.md) for task-specific setup and validation.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST, Bearer auth. [API reference](https://aisa.one/docs/api-reference), [OpenAPI spec](https://aisa.one/openapi.yaml) |
| MCP | ✓ | Remote, Streamable HTTP: `https://mcp.aisa.one/mcp`. OAuth or Bearer key |
| CLI | ✓ | `@aisa-one/cli` on npm (`aisa login`, `aisa balance`) |
| Agent skill | ✓ | `npx skills add AIsa-team/agent-skills --skill aisa` |

## How the MCP Server Works

Connect to `https://mcp.aisa.one/mcp`. The endpoint lists five tools:

| Tool | What it does | Billed |
|------|--------------|--------|
| `search` | Describe the task in plain words; returns candidate operations with `operation_id`, input schema, and price | No |
| `list_categories` | Categories to narrow a search | No |
| `get_details` | Full contract for an operation: schemas, read-only flag, price for your account, `suggested_max_price_usd`, known pitfalls | No |
| `use` | Runs one operation; `max_price_usd` rejects an execution estimate above the supplied limit | Per call; the documented `account` read is free |
| `batch_use` | Up to 20 operations; inspect its current budget semantics and every item result | Per call |

Use `list_categories` to browse capabilities and `search` to find relevant operations through the same connection.

A `402` can report insufficient balance, an exhausted key limit, missing subscription access, or a price admission rejection. Read the specific error; do not automatically top up, upgrade, or retry.

## Pricing

- Data operations use fixed or metered pricing; rates and access can depend on the account or plan. Check [current plans](https://aisa.one/pricing), the [API catalogue](https://aisa.one/api), and an authenticated quote for the exact request.
- Per the [billing guide](https://aisa.one/docs/guides/pricing), `max_price_usd` is an **estimate-based admission check, not a ceiling on the final metered charge**. Under a fixed budget, also establish a documented maximum or a provable bound from request limits before executing.

## Authentication

- **Interactive MCP:** OAuth. Add the MCP server and approve in the browser; no key has to exist first. The token is scoped to that client and revocable on its own.
- **Headless and CI:** an API key from [console.aisa.one](https://console.aisa.one) exported as `AISA_API_KEY` and sent as `Authorization: Bearer $AISA_API_KEY`. Keep it in a secret manager or the CI's secret store, never in the repo, client-side code, or screenshots.
- The current CLI stores its OAuth session in `~/.aisa/tokens.json`; `AISA_API_KEY` overrides the stored session. Confirm the intended account with `aisa balance` without printing credentials. See [authentication](https://aisa.one/docs/guides/authentication).

## Common agent workflows

**Connect (Claude Code)**

```bash
claude mcp add --transport http aisa https://mcp.aisa.one/mcp
# Then open /mcp in Claude Code, select aisa, and authenticate.
```

Codex: `codex mcp add aisa --url https://mcp.aisa.one/mcp`. Cursor, Windsurf, and other clients take the same URL in their MCP settings. Without a browser, pass the key instead: `--header "Authorization: Bearer $AISA_API_KEY"` (Claude Code) or `--bearer-token-env-var AISA_API_KEY` (Codex).

**Connect (CLI, for scripts and CI)**

```bash
npm install -g @aisa-one/cli      # Node 18+
aisa login                         # or export AISA_API_KEY in CI
aisa balance                       # confirms auth; the free way to check
```

If a CLI is needed, check its [current prerequisites](https://aisa.one/docs/get-started/cli) before installing. Remote MCP does not require the CLI or a bundled installer that changes other agent settings.

### Run a Lookup with a Budget

1. `search` for the task ("referring domains for example.com").
2. Inspect the candidate's schema and obtain a quote for the exact arguments using `get_details` and its quote options. A suggested limit is not spending authorization.
3. Establish the scope, maximum possible cost, and sufficient user authorization. Reuse approval already given for that exact scope; if a metered maximum cannot be bounded within the budget, stop before execution.
4. Call `use` with `max_price_usd` set to the approved admission limit. Account for pagination and additional requests, and reconcile observed charges before retries. Re-quote if arguments change.

For a free connection check, inspect the client's `use` tool schema and invoke the documented `account` read. Discovery metadata alone does not confirm authenticated access.

**Cross-check a number across providers.** Domain authority and backlink counts come from more than one index (DataForSEO, Semrush, Ahrefs). When a decision depends on the figure, pull it from two and report both, labeled by source. They won't match, because each provider crawls differently.

## Tradeoffs

- **One more dependency.** Requests route and bill through AIsa, so an AIsa outage or balance problem stops every provider behind it. Billing goes through AIsa rather than each provider.
- **Not every endpoint of every provider.** The SEO module is a curated set. If you need a report AIsa doesn't expose, go to the provider directly.
- **Direct accounts can still win.** If you already pay for Semrush or Ahrefs and use one provider heavily, a direct account (see the semrush, ahrefs, and dataforseo guides) may cost less and expose more. AIsa fits when you need several providers occasionally and don't want an account and key for each.
- **Costs vary by call.** Metered pricing and batches need bounds on the whole request. Use the interface's supported admission controls and reconcile account usage; a price estimate alone does not bound final spend.

## How it fits the skills

- AIsa is one way to get **data**; what to do with it still comes from the skills. Use `seo-audit` and `ai-seo` for SEO and AI-visibility work, `competitors` and `competitor-profiling` for market research, `content-strategy` and `programmatic-seo` for keyword data, `social` for social listening, and `prospecting` for people and company search.
- Alternatives for the same job: direct provider accounts ([dataforseo](dataforseo.md), [semrush](semrush.md), [ahrefs](ahrefs.md), [similarweb](similarweb.md)), [RankParse](rankparse.md) for cheap backlink and domain data, and [Composio](composio.md) when the need is connecting your own SaaS accounts rather than buying third-party data.
- Apply the approval rule: paid calls need authorization for their scope and bounded cost; an estimate alone does not establish that bound.

## Links

- Site: https://aisa.one
- Docs: https://aisa.one/docs (index at https://aisa.one/docs/llms.txt)
- MCP server guide: https://mcp.aisa.one/llms.txt
- Live MCP catalogue: https://mcp.aisa.one/servers
- Pricing: https://aisa.one/pricing
- Console: https://console.aisa.one
