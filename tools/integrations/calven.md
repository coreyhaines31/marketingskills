# Calven

AI product marketing platform: agents keep a company's positioning, messaging, ICP, personas, competitor battlecards, customer voice and win/loss in one workspace, which a person approves. The MCP server lets an agent read that approved context, with sources, and review copy against the workspace's personas.

Facts below were checked against the [tool catalog](https://github.com/calven-ai/calven-mcp/blob/main/docs/tool-catalog.md), the [authentication doc](https://github.com/calven-ai/calven-mcp/blob/main/docs/authentication.md) and [pricing](https://calven.ai/pricing) on 2026-11-16.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | - | No public REST API; agents use the MCP server |
| MCP | ✓ | Official hosted server at `https://api.calven.ai/mcp` (Streamable HTTP, OAuth). 15 read tools and 2 actions |
| CLI | - | Not available |
| SDK | - | Not available |

## Authentication

- **Type**: OAuth 2.1 with PKCE. Each user signs in to Calven as themselves; there are no API keys.
- **Client registration**: Client ID Metadata Documents only. A client that can register only through Dynamic Client Registration cannot sign in.
- **Scopes**: `profile`, `email`, `offline_access`, `user:org:read`. The user's Calven role decides what each tool returns, and admins decide whether call transcripts and CRM pipeline are readable over MCP.
- **Needs**: a Calven workspace (14-day trial, no card).

## MCP Server Setup

### Claude Code

```bash
claude mcp add --transport http calven https://api.calven.ai/mcp
claude mcp login calven
```

### Codex

```bash
codex mcp add calven --url https://api.calven.ai/mcp
codex mcp login calven
```

### Cursor (`~/.cursor/mcp.json`)

```json
{ "mcpServers": { "calven": { "url": "https://api.calven.ai/mcp" } } }
```

Setup for Claude (web and desktop), ChatGPT and VS Code is in the [server README](https://github.com/calven-ai/calven-mcp#connect).

## Common Agent Operations

Start with `get_workspace_overview`: it lists the products, which strategy documents are published and how many records each kind holds, so the agent knows what it can answer before it asks.

### Read approved positioning, messaging, ICP or the product brief

```text
get_strategy_document({ document: "positioning" })
get_strategy_document({ document: "messaging", product: "Billing" })
```

`document` is `positioning`, `messaging`, `icp` or `product_brief`. With `product`, the product's own version comes back, or the company-wide one with a note. A `null` result means the document is not published.

### Read one competitor

```text
get_competitor({ name: "Acme" })
```

Returns the battlecard (traps, objections, proof points), recent competitive signals and the outline of the deep-dive dossier, with the `read_document` call that reads the dossier whole. Competitor pricing lives in the dossier.

### Read customer voice and win/loss rows

```text
list_records({ kind: "quotes", filter: [{ key: "sentiment", value: "negative" }], limit: 10 })
list_records({ kind: "deal_drivers", filter: [{ key: "competitor", value: "Acme" }] })
```

Other kinds include `competitors`, `competitive_signals`, `personas`, `trends`, `themes`, `customer_conversations`, `surveyed_deals`, `claims` and the permitted CRM `crm_accounts`, `crm_contacts` and `crm_deals`. Each result starts with the filter, sort and search keys allowed for that kind.

### Read a dashboard number

```text
get_insights({ dashboard: "win_loss", timeframe: "lastQuarter" })
```

Dashboards: `win_loss`, `competitive_intelligence`, `voice_of_customer`, `icp`, `persona`, `positioning`, `messaging`, `market_research`, `product_intelligence`, `win_loss_program_health`. Every rate comes with its sample size and window; quote both rather than adding up rows.

### Review copy against the workspace's personas

```text
review_against_personas({ text: "<draft>", scope: "buyers" })
get_task({ task_id: "<id>" })   # poll while status is "working"
```

Returns findings rated by severity, per persona.

## Rate Limits and Pricing

- Individual: $99 a month, one seat, one workspace per company, no CRM or call-recording integrations.
- Professional: $1,000 a month or $9,600 a year, unlimited seats, CRM and call-recording integrations (Gong, Salesforce and others).
- Enterprise: from $1,600 a month billed annually, more products and competitors, SSO.
- The MCP server is in every plan. Check [calven.ai/pricing](https://calven.ai/pricing) for current prices.

## Tradeoffs

- The server returns only what the workspace holds. A new workspace starts from public research on the market and the competitors you name plus the documents you upload; customer voice and win/loss stay empty until call recordings, a CRM or win/loss surveys feed it. An empty result means nothing is recorded, not that the answer is no.
- The server does no web search. For live public data on a competitor, use [Similarweb](similarweb.md) for traffic or [ScrapeCreators](scrapecreators.md) for social posts and ad libraries.
- Over MCP, agents read and review. The only tool that changes workspace content is `resolve_inbox_items`, which publishes or discards drafts the platform's own agents proposed in the user's inbox; editing a battlecard or a strategy document directly happens in the Calven app.
- OAuth only, so it fits interactive agent sessions better than headless scripts.
- For other routes to the same jobs: the `product-marketing` skill keeps a hand-written context file at no cost; Klue ([Claude connector](https://claude.com/connectors/klue)) and Crayon (MCP at `https://mcp.crayon.co/mcp/`) expose an existing CI program's battlecards and content to agents; [Gong](gong.md) gives raw call transcripts to mine directly.

## Relevant Skills

- **product-marketing**: filling `.agents/product-marketing.md` from approved positioning, messaging and ICP
- **competitor-profiling**: starting a profile from an existing battlecard and dossier
- **sales-enablement**: battle cards and objection handling from win/loss and battlecard data
- **customer-research**: verbatim quotes and themes from customer conversations
- **copywriting**: checking a draft against approved messaging and the personas
