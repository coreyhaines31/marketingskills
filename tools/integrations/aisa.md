# AIsa

> **◆ Verified Partner integration.** AIsa sponsors Marketing Skills. This integration is disclosed and vetted for fit; it does **not** change what any skill recommends. It's listed here alongside the neutral options for the same job — use it when it's the right fit, not because it's a partner. See [Verified Partners](../REGISTRY.md#verified-partners).

One account and one key for third-party data APIs, billed per call. For marketing work, the relevant parts are SEO data (DataForSEO, Semrush, and Ahrefs endpoints), Similarweb market data, social data (X/Twitter, Instagram, Reddit, Pinterest, YouTube), web search and research (Tavily, Firecrawl, Exa, Perplexity), and people and company search. AIsa also offers model inference and finance data, which this guide doesn't cover.

Facts below were checked against [aisa.one/llms.txt](https://aisa.one/llms.txt), the MCP server's own [llms.txt](https://mcp.aisa.one/llms.txt), and the [live MCP catalogue](https://mcp.aisa.one/servers) on 2026-10-06. Provider coverage, tool counts, and prices change; check the live catalogue before relying on a specific endpoint.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST, Bearer auth. [API reference](https://aisa.one/docs/api-reference), [OpenAPI spec](https://aisa.one/openapi.yaml) |
| MCP | ✓ | Remote, Streamable HTTP: `https://mcp.aisa.one/mcp`. OAuth or Bearer key |
| CLI | ✓ | `@aisa-one/cli` on npm (`aisa login`, `aisa balance`) |
| Agent skill | ✓ | `npx skills add AIsa-team/agent-skills --skill aisa` |

## How the MCP server works

The root endpoint lists five tools instead of hundreds:

| Tool | What it does | Billed |
|------|--------------|--------|
| `search` | Describe the task in plain words; returns candidate operations with `operation_id`, input schema, and price | No |
| `list_categories` | Categories to narrow a search | No |
| `get_details` | Full contract for an operation: schemas, read-only flag, price for your account, `suggested_max_price_usd`, known pitfalls | No |
| `use` | Runs one operation, refusing it before any charge if it would cost more than `max_price_usd` | Per call |
| `batch_use` | Up to 20 operations under the same cap | Per call |

For a shorter tool list, connect a module endpoint instead: `https://mcp.aisa.one/seo/mcp` (keywords, SERPs, backlinks, site audit, AI-answer visibility), or `social`, `search`, `sales`, `gtm`. `search` still reaches the whole catalogue from any entry point.

A `402` means either the balance is too low or the operation needs a subscription; the error says which.

## Pricing

- Pay-as-you-go per call. All plans, including Pay-as-you-go, reach the full data catalogue at the same per-call rate; paid plans (Builder, Team) add bonus credits rather than lower prices. Current prices: [aisa.one/pricing](https://aisa.one/pricing), and per provider from the [API catalogue](https://aisa.one/api).
- Some providers price dynamically (Similarweb is AIsa's own example), so the cost of a call depends on its arguments. Read `get_details` before running anything at volume.

## Authentication

- **Interactive (recommended):** OAuth. Add the MCP server and approve in the browser; no key has to exist first. The token is scoped to that client and revocable on its own.
- **Headless and CI:** an API key from [console.aisa.one](https://console.aisa.one) exported as `AISA_API_KEY` and sent as `Authorization: Bearer $AISA_API_KEY`. Keep it in a secret manager or the CI's secret store, never in the repo, client-side code, or screenshots.
- The CLI stores its key in `~/.aisa/key`. A browser sign-in and a stored key can belong to different AIsa accounts, which changes whose balance is charged. Check with `aisa balance`.

## Common agent workflows

**Connect (Claude Code)**

```bash
claude mcp add --transport http aisa https://mcp.aisa.one/mcp
claude mcp login aisa              # opens the browser; --no-browser prints the URL for SSH
```

Codex: `codex mcp add aisa --url https://mcp.aisa.one/mcp`. Cursor, Windsurf, and other clients take the same URL in their MCP settings. Without a browser, pass the key instead: `--header "Authorization: Bearer $AISA_API_KEY"` (Claude Code) or `--bearer-token-env-var AISA_API_KEY` (Codex).

**Connect (CLI, for scripts and CI)**

```bash
npm install -g @aisa-one/cli      # Node 18+
aisa login                         # or export AISA_API_KEY in CI
aisa balance                       # confirms auth; the free way to check
```

On a machine without Node, AIsa's `curl -fsSL https://aisa.one/install.sh | sh` installs a Node runtime and the CLI. Read the script before piping it to a shell.

**Run a lookup with a spend cap**

1. `search` for the task ("referring domains for example.com").
2. `get_details` on the candidate to see the price and `suggested_max_price_usd`.
3. Tell the user the scope and the maximum cost, and wait for approval.
4. `use` with `max_price_usd` set to the approved cap.

**Cross-check a number across providers.** Domain authority and backlink counts come from more than one index (DataForSEO, Semrush, Ahrefs). When a decision depends on the figure, pull it from two and report both, labeled by source. They won't match, because each provider crawls differently.

## Tradeoffs

- **One more dependency.** Requests route and bill through AIsa, so an AIsa outage or balance problem stops every provider behind it. Billing goes through AIsa rather than each provider.
- **Not every endpoint of every provider.** The SEO module is a curated set. If you need a report AIsa doesn't expose, go to the provider directly.
- **Direct accounts can still win.** If you already pay for Semrush or Ahrefs and use one provider heavily, a direct account (see the semrush, ahrefs, and dataforseo guides) may cost less and expose more. AIsa fits when you need several providers occasionally and don't want an account and key for each.
- **Costs vary by call.** Dynamic pricing and batch calls make budgets harder to predict. Use `max_price_usd` on every call and check `account` usage periodically.

## How it fits the skills

- AIsa is one way to get **data**; what to do with it still comes from the skills. Use `seo-audit` and `ai-seo` for SEO and AI-visibility work, `competitors` and `competitor-profiling` for market research, `content-strategy` and `programmatic-seo` for keyword data, `social` for social listening, and `prospecting` for people and company search.
- Alternatives for the same job: direct provider accounts ([dataforseo](dataforseo.md), [semrush](semrush.md), [ahrefs](ahrefs.md), [similarweb](similarweb.md)), [RankParse](rankparse.md) for cheap backlink and domain data, and [Composio](composio.md) when the need is connecting your own SaaS accounts rather than buying third-party data.
- Apply the approval rule: never make a paid call without stating the scope and cap first.

## Links

- Site: https://aisa.one
- Docs: https://aisa.one/docs (index at https://aisa.one/docs/llms.txt)
- MCP server guide: https://mcp.aisa.one/llms.txt
- Live MCP catalogue: https://mcp.aisa.one/servers
- Pricing: https://aisa.one/pricing
- Console: https://console.aisa.one
