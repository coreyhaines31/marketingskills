# AIsa

> **◆ Verified Partner integration.** AIsa sponsors Marketing Skills. This integration is disclosed and vetted for fit; it does **not** change what any skill recommends. It's listed here alongside the neutral options for the same job — use it when it's the right fit, not because it's a partner. See [Verified Partners](../REGISTRY.md#verified-partners).

AIsa gives agents one connection to discover, access, and pay for premium data across supported providers. For marketing work, the relevant parts are SEO data (DataForSEO, Semrush, and Ahrefs endpoints), Similarweb market data, social data (X/Twitter, Instagram, Reddit, Pinterest, YouTube), web search and research (Tavily, Firecrawl, Exa, Perplexity), and people and company search. AIsa also offers model inference and finance data, which this guide doesn't cover.

The MCP workflow and billing guidance were reviewed on 2026-11-25 using the [agent setup guide](https://aisa.one/llms.txt), [agent quickstart](https://aisa.one/docs/agent-quickstart), and linked billing docs. Provider coverage retains its 2026-10-15 documentation snapshot. Consult the [public API catalog](https://aisa.one/catalog) and inspect the selected operation's current schema, account access, and quote before use. Authenticated provider execution remains unverified.

See the [quick start](../aisa/README.md), [coverage map](../aisa/coverage-map.md), and [evaluation scenarios](../aisa/evals/README.md) for task-specific setup and validation.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST, Bearer auth. [API reference](https://aisa.one/docs/api-reference), [OpenAPI spec](https://aisa.one/openapi.yaml) |
| MCP | ✓ | Remote, Streamable HTTP: `https://mcp.aisa.one/mcp`. OAuth or Bearer key |
| CLI | ✓ | `@aisa-one/cli` on npm (`aisa login`, `aisa balance`) |
| Agent skill | ✓ | `npx skills add AIsa-team/agent-skills --skill aisa` |

## How the MCP Server Works

Connect to `https://mcp.aisa.one/mcp` and inspect the tools exposed by the client. Names and compatibility interfaces can vary by connection.

| Tool | What it does | Billed |
|------|--------------|--------|
| `search` | Find candidate tools for a task and obtain exact names, available schemas, list prices, and a `session_id` | No |
| `list_categories`, when exposed | Browse categories to narrow discovery | No |
| `batch_get_schema`, or the documented `get_details` alias | Retrieve a missing schema, read/write behavior, side effects, and other contract details | No |
| `batch_quote` | Quote the exact proposed tools and arguments without executing the data requests | No |
| `batch_use` | Execute up to 20 quoted calls and inspect each result and reported charge | According to each operation |
| `account`, when exposed | Verify authentication and inspect the selected account's balance and usage | No |
| `use`, when exposed | Legacy single-call interface. Inspect its actual schema before use, including for the free `account` fallback | According to the operation. The account read is free |

Reuse the `session_id` from `search` in subsequent calls that accept it. Take the tool names and arguments from discovery and schemas.

A `402` can report insufficient balance, an exhausted key limit, or missing subscription access. On a route with an estimated-price admission check, it can also report a price rejection. Read the specific error. Obtain any missing authorization before changing funding or plan access. Resolve the reported cause and confirm that the scope and budget cover a retry before another paid attempt.

## Pricing

- Data operations use fixed or metered pricing, and access can depend on the account or plan. Consult [current plans](https://aisa.one/pricing), the [public API catalog](https://aisa.one/catalog), and a quote for the exact request.
- Use `batch_quote` followed by `batch_use` for the current MCP workflow. `batch_use` and CLI `aisa call` have no price-cap argument. Bound a fixed-budget request through documented charges and supported operation limits, including all calls in the task.
- Direct HTTP routes that declare support accept `X-AISA-Max-Price-USD`. This checks the estimated cost before execution. Final metered charges depend on actual consumption. See the [billing guide](https://aisa.one/docs/guides/pricing) for the route's applicable controls.

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

1. Use `search` to discover candidates. Keep the exact tool name and the returned `session_id` for subsequent calls that accept it. Inspect the provider, required inputs, result limits, and read/write behavior.
2. If discovery omits the full input schema, retrieve it using the connected client's schema tool, such as `batch_get_schema` or its documented `get_details` alias. Construct arguments from that schema.
3. Obtain a free `batch_quote` for the exact tools and arguments proposed for execution. A single lookup uses a one-item `calls` array. Treat missing or failed quotes as unknown costs.
4. Establish authorization for the scope and total budget, reusing approval already covering the request. Include planned pages, additional providers, and any authorized retries. Honor an instruction to show the quote first or to wait before execution. For a fixed spending maximum, establish a documented maximum or a provable bound from supported request limits. Leave the paid request unrun until a supported bound fits the remaining budget.
5. Pass the same quoted calls to `batch_use`, following its current input schema and reusing the `session_id`. Re-quote changes to tools, arguments, or scope. The current batch interface accepts up to 20 calls. Its supported controls are the request's actual limits and the task's authorization.
6. Inspect every item result. Report source/provider, collection date, reporting period, filters, result limits, and observed cost when available. Mark missing cost metadata as unknown. Reconcile uncertain execution and charges before proposing a retry.

Inspect the connected client's tool list and call its free `account` tool. If `account` is unavailable and the client exposes the legacy `use` interface, invoke the documented `account` operation with `operation_id: "account"` and any other required fields from that schema. Confirm successful authentication and the intended account locally. Report connection status and redact account details and identifiers. With an already authenticated CLI, `aisa balance` verifies that CLI session.

**Cross-check referring-domain counts.** Query supported Semrush and DataForSEO operations for the same target and matching filters. Report each count with its provider and retrieval date. The indexes can differ in coverage and update times. Treat proprietary authority scores as provider-specific metrics.

## Tradeoffs

- **One more dependency.** Requests route and bill through AIsa, so an AIsa outage or balance problem stops every provider behind it. Billing goes through AIsa rather than each provider.
- **Not every endpoint of every provider.** The SEO module is a curated set. If you need a report AIsa doesn't expose, go to the provider directly.
- **Direct accounts can still win.** If you already pay for Semrush or Ahrefs and use one provider heavily, a direct account (see the semrush, ahrefs, and dataforseo guides) may cost less and expose more. AIsa supports one-off and recurring research across several providers through one connection and usage-based billing.
- **Costs vary by call.** Metered pricing and batches need bounds on the whole request. Use the interface's supported admission controls and reconcile account usage; a price estimate alone does not bound final spend.

## How it fits the skills

- AIsa is one way to get **data**; what to do with it still comes from the skills. Use `seo-audit` and `ai-seo` for SEO and AI-visibility work, `competitors` and `competitor-profiling` for market research, `content-strategy` and `programmatic-seo` for keyword data, `social` for social listening, and `prospecting` for people and company search.
- Alternatives for the same job: direct provider accounts ([dataforseo](dataforseo.md), [semrush](semrush.md), [ahrefs](ahrefs.md), [similarweb](similarweb.md)), [RankParse](rankparse.md) for cheap backlink and domain data, and [Composio](composio.md) when the need is connecting your own SaaS accounts rather than buying third-party data.
- Apply the approval rule: paid calls need authorization for their scope and bounded cost; an estimate alone does not establish that bound.

## Links

- Site: https://aisa.one
- Docs: https://aisa.one/docs (index at https://aisa.one/docs/llms.txt)
- [Agent setup guide](https://aisa.one/llms.txt)
- [Public API catalog](https://aisa.one/catalog). Inspect the connected client's tool list for its MCP interface.
- Pricing: https://aisa.one/pricing
- Console: https://console.aisa.one
