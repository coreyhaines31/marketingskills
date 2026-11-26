# AIsa Quick Start

> **◆ Verified Partner integration.** AIsa sponsors Marketing Skills. This guide adds an optional data connection and does not change what any skill recommends. Compare alternatives for the task. See [Verified Partners](../REGISTRY.md#verified-partners).

Use AIsa when a selected marketing workflow needs data from several supported providers through one account. An existing [direct provider connection](../REGISTRY.md), [Composio](../composio/README.md) for connected SaaS accounts, or a manual export may fit better. Check the [coverage map](coverage-map.md) before connecting anything.

## MCP Connection

Connect to `https://mcp.aisa.one/mcp`. Reuse the user's working connection when available.

Use `search`, retrieve a missing schema through `batch_get_schema` or the exposed `get_details` alias, then call `batch_quote` and `batch_use`. Inspect the connected client's actual tools and reuse the `session_id` returned by discovery.

The [agent setup guide](https://aisa.one/llms.txt) and [agent quickstart](https://aisa.one/docs/agent-quickstart) document browser OAuth and Bearer-key setup for this endpoint.

## Connect MCP

Remote MCP needs a compatible client; it does not require installing the AIsa CLI or this repository's Node tools.

Use the command for your client, or add the URL through its connector settings:

```bash
# Claude Code
claude mcp add --transport http aisa https://mcp.aisa.one/mcp

# Codex
codex mcp add aisa --url https://mcp.aisa.one/mcp
```

Complete browser sign-in through that client's MCP controls. For an API-key connection, keep `AISA_API_KEY` in the client's environment or secret store and configure its Bearer-header support; see the [integration guide](../integrations/aisa.md#authentication). Never paste a key into chat or commit it. An existing authorized CLI connection can also be used; see [AIsa's CLI documentation](https://aisa.one/docs/get-started/cli).

## Verify Without Buying Data

Inspect the connected client's tool list and call its free `account` tool. If `account` is unavailable and the client exposes the legacy `use` interface, invoke the documented `account` operation with `operation_id: "account"` and any other required fields from that schema. Confirm successful authentication and the intended account locally. Report connection status and redact account details and identifiers. With an already authenticated CLI, `aisa balance` verifies that CLI session.

Tool listings and OAuth metadata alone do not prove authenticated access. Setup does not authorize paid data retrieval.

## Run a Scoped Lookup

Example request:

> Use my selected AIsa connection to research backlinks for example.com. Discover a suitable read operation and show the scope and cost before retrieving data.

1. Use `search` to discover candidates. Keep the exact tool name and the returned `session_id` for subsequent calls that accept it. Inspect the provider, required inputs, result limits, and read/write behavior.
2. If discovery omits the full input schema, retrieve it using the connected client's schema tool, such as `batch_get_schema` or its documented `get_details` alias. Construct arguments from that schema.
3. Obtain a free `batch_quote` for the exact tools and arguments proposed for execution. A single lookup uses a one-item `calls` array. Treat missing or failed quotes as unknown costs.
4. Establish authorization for the scope and total budget, reusing approval already covering the request. Include planned pages, additional providers, and any authorized retries. Honor an instruction to show the quote first or to wait before execution. For a fixed spending maximum, establish a documented maximum or a provable bound from supported request limits. Leave the paid request unrun until a supported bound fits the remaining budget.
5. Pass the same quoted calls to `batch_use`, following its current input schema and reusing the `session_id`. Re-quote changes to tools, arguments, or scope. The current batch interface accepts up to 20 calls. Its supported controls are the request's actual limits and the task's authorization.
6. Inspect every item result. Report source/provider, collection date, reporting period, filters, result limits, and observed cost when available. Mark missing cost metadata as unknown. Reconcile uncertain execution and charges before proposing a retry.

The [billing guide](https://aisa.one/docs/guides/pricing) describes fixed and metered charges. Current `batch_use` has no `max_price_usd` field. Use each operation's supported limits when establishing a maximum cost for a fixed-budget task.

## Example Tasks

- Compare keyword opportunities using matching geography, language, and device filters.
- Research competitor traffic for the same completed reporting period, labeling estimates by provider.
- Find public posts about a brand, preserving source links and stating the sampling limits.
- Search for companies matching an agreed profile, with enrichment scoped separately.

The [coverage map](coverage-map.md) records evidence and gaps. The existing marketing skills guide analysis and recommendations after data collection.

## Troubleshooting

| Symptom | Next step |
|---------|-----------|
| Connector missing | Check the selected client's configuration and reload requirements |
| Authentication rejected | Complete the chosen sign-in flow; do not expose or extract client-owned tokens |
| `402` response | Read the reported balance, key-limit, or account-access restriction; do not retry or purchase access automatically |
| Operation or parameter missing | Refresh discovery; use an appropriate direct provider or manual source if unsupported |
| Rate limit, timeout, or partial batch | Report what completed and reconcile uncertain paid calls before any retry |
| Empty data | State what query, period, and filters returned no results; do not infer absence everywhere |

## Evidence and Evaluation

MCP workflow and billing documentation were reviewed on **2026-11-25**. Provider coverage retains the dates recorded in the [coverage map](coverage-map.md). Authenticated provider execution remains unverified. Recheck current contracts and account-specific pricing before use.

- [Full integration guide](../integrations/aisa.md): capabilities, authentication, and tradeoffs
- [Coverage map](coverage-map.md): task-level data support and alternatives
- [Evaluation guide](evals/README.md): scenarios, scoring, and optional live checks
- [Guided tool setup](../SETUP.md): selecting and verifying a connection
