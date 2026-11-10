# AIsa Quick Start

> **◆ Verified Partner integration.** AIsa sponsors Marketing Skills. This guide adds an optional data connection and does not change what any skill recommends. Compare alternatives for the task. See [Verified Partners](../REGISTRY.md#verified-partners).

Use AIsa when a selected marketing workflow needs data from several supported providers through one account. An existing [direct provider connection](../REGISTRY.md), [Composio](../composio/README.md) for connected SaaS accounts, or a manual export may fit better. Check the [coverage map](coverage-map.md) before connecting anything.

## MCP Connection

Connect to `https://mcp.aisa.one/mcp`. Reuse the user's working connection when available.

The workflow is `search` → `get_details` → `use` or `batch_use`; `list_categories` browses coverage. Discover the operation and inspect its schema before constructing a request.

The [MCP guide](https://mcp.aisa.one/llms.txt) and [agent quickstart](https://aisa.one/docs/agent-quickstart) document browser OAuth and Bearer-key setup for this endpoint.

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

Inspect the client's `use` tool schema, then invoke its documented free account read with `operation_id: "account"`, supplying any other required fields as that schema specifies. Confirm successful authentication and the intended account locally; report only connection status and redact returned identifiers or account details. With an already configured CLI, `aisa balance` is the alternative free check.

Tool listings and OAuth metadata alone do not prove authenticated access. Setup does not authorize paid data retrieval.

## Run a Scoped Lookup

Example request:

> Use my selected AIsa connection to research backlinks for example.com. Discover a suitable read operation and show the scope and cost before retrieving data.

1. Discover candidates for the task. Inspect the exact schema, provider, filters, result limits, and read/write behavior. Use the operation ID returned by `search`.
2. Get a quote for the exact arguments and account using `get_details` with its quote options. Missing or incomplete pricing means the cost is unknown.
3. Establish authorization for the scope and total budget, reusing approval already given for that request. Include pagination, additional providers, and retries in the budget. Re-quote if arguments change.
4. Set `max_price_usd` to the authorized admission limit. **This checks an estimate; it does not cap the final metered charge.** A fixed budget also requires a documented maximum or a provable bound from the operation's limits. If that bound is unavailable, stop before execution.
5. Execute only the authorized request. Return source/provider, collection date, reporting period, filters, result limits, and observed cost when available. Treat absent cost metadata as unknown. Inspect partial failures before deciding whether another call is needed.

The [billing guide](https://aisa.one/docs/guides/pricing) explains quotes, admission limits, and settled charges. A batch's estimate or a per-call limit is not proof that its combined final cost fits the task budget.

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

Documentation and the public MCP catalogue were reviewed on **2026-10-15**. This is a documentation snapshot, not an authenticated execution or availability guarantee. Recheck contracts and account-specific pricing before use.

- [Full integration guide](../integrations/aisa.md): capabilities, authentication, and tradeoffs
- [Coverage map](coverage-map.md): task-level data support and alternatives
- [Evaluation guide](evals/README.md): scenarios, scoring, and optional live checks
- [Guided tool setup](../SETUP.md): selecting and verifying a connection
