# Composio

Managed OAuth and pre-built tool connectors for 500+ apps via a single MCP server. Provides agent-native access to marketing tools that lack native MCP support.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for managing connections and triggering actions |
| MCP | ✓ | Single MCP server exposes all connected tools |
| CLI | ✓ | `npx composio` for managing apps, connections, and actions |
| SDK | ✓ | TypeScript and Python SDKs |

## Authentication

- **Type**: OAuth 2.0 (per-tool, managed by Composio) or API Key
- **Setup**: `npx @composio/mcp@latest setup` to install, then authenticate each tool via Connect Link in browser
- **API Key** (optional): `COMPOSIO_API_KEY` env var for advanced/team usage

Composio handles OAuth token management, refresh, and storage for all connected tools. Individual tool auth types are listed in the Marketing Tools table below.

## When to Use Composio vs. Native Tools

Composio is an **alternative integration method**, not a replacement. Use this decision guide:

| Scenario | Use |
|----------|-----|
| Tool has native MCP server (GA4, Stripe, Mailchimp) | Native MCP server |
| Tool has CLI but no MCP (Meta Ads, LinkedIn Ads, HubSpot) | Composio for MCP access |
| OAuth-heavy tool with no CLI (Google Sheets, Slack, Notion) | Composio |
| Need deep, customized integration | Native API + CLI |
| Need quick read/write access across many tools | Composio |
| Tool not covered by Composio | Native API guide |

## Setup

### 1. Install the MCP server

```bash
npx @composio/mcp@latest setup
```

This adds the Composio MCP server to your Claude Code configuration.

### 2. Verify installation

In Claude Code, run `/mcp` to confirm `composio` appears in your MCP server list.

### 3. Authenticate a tool

When you first use a Composio-backed tool, you'll receive a Connect Link. Open it in your browser to complete OAuth. The connection persists across sessions.

```
# Example: connect HubSpot
> "Pull my top 10 HubSpot contacts"
# Agent will prompt: "Please authenticate HubSpot: [Connect Link]"
# Click link → authorize → done
```

### 4. API key (optional)

For advanced usage or team setups, set your Composio API key:

```bash
export COMPOSIO_API_KEY=your_key_here
```

## Marketing Tools Available via Composio

### New MCP Coverage

These tools have API guides in this repo but **no native MCP server**. Composio adds MCP access:

| Tool | Composio Toolkit | Auth Type | Coverage Depth |
|------|-----------------|-----------|----------------|
| HubSpot | `HUBSPOT` | OAuth 2.0 | Deep (contacts, deals, companies, lists, email) |
| Salesforce | `SALESFORCE` | OAuth 2.0 | Deep (SOQL, objects, leads, opportunities) |
| Meta Ads | `FACEBOOKADS` | OAuth 2.0 | Medium (campaigns, ad sets, insights) |
| LinkedIn Ads | `LINKEDIN` | OAuth 2.0 | Medium (campaigns, analytics, company pages) |
| Google Sheets | `GOOGLESHEETS` | OAuth 2.0 | Deep (read, write, create, format) |
| Slack | `SLACK` | OAuth 2.0 | Deep (messages, channels, files) |
| Notion | `NOTION` | OAuth 2.0 | Deep (pages, databases, blocks) |
| Airtable | `AIRTABLE` | OAuth 2.0 | Deep (records, tables, views) |
| ActiveCampaign | `ACTIVECAMPAIGN` | API Key | Medium (contacts, lists, automations) |
| Klaviyo | `KLAVIYO` | API Key | Medium (profiles, lists, campaigns) |
| Shopify | `SHOPIFY` | OAuth 2.0 | Deep (products, orders, customers) |
| Gmail | `GMAIL` | OAuth 2.0 | Deep (read, send, labels, search) |

### Alternative to Existing Tools

These tools **already have native MCP or CLI** in this repo. Composio provides an alternative path:

| Tool | Native Integration | Composio Toolkit | When to Use Composio |
|------|-------------------|-----------------|---------------------|
| Mailchimp | MCP ✓, CLI ✓ | `MAILCHIMP` | If native MCP setup fails |
| Google Ads | MCP ✓, CLI ✓ | `GOOGLEADS` | If OAuth is simpler via Composio |
| Stripe | MCP ✓, CLI ✓ | `STRIPE` | Prefer native (deeper coverage) |
| GA4 | MCP ✓, CLI ✓ | `GOOGLEANALYTICS` | Prefer native (deeper coverage) |

## Common Agent Operations

### List available tools

```bash
# Via Composio CLI
npx composio apps list
```

### Check connection status

```bash
npx composio connections list
```

### Trigger an action programmatically

```bash
POST https://backend.composio.dev/api/v1/actions/{action_id}/execute

{
  "connectedAccountId": "account_xxx",
  "input": {
    "query": "contact email = user@example.com"
  }
}
```

### Disconnect a tool

```bash
npx composio connections remove {connection_id}
```

## Example Workflows

### Pull CRM data into a spreadsheet

```
> "Get my top 20 HubSpot contacts by last activity and add them to a Google Sheet"
```
Agent uses Composio's `HUBSPOT` to fetch contacts and `GOOGLESHEETS` to write rows.

### Cross-platform ad reporting

```
> "Compare my Meta Ads and LinkedIn Ads spend this month"
```
Agent uses `FACEBOOKADS` and `LINKEDIN` toolkits to pull campaign data.

### Notify team about new leads

```
> "Get my Salesforce leads from today and post a summary in Slack #sales"
```
Agent uses `SALESFORCE` to read leads and `SLACK` to post messages.

## Limitations

- **Coverage depth varies** — some toolkits expose hundreds of actions (HubSpot, Google Sheets), others only a handful
- **No customization** — you can't modify Composio's action schemas or add custom endpoints
- **Vendor dependency** — if Composio's servers are down, all connected tools are unavailable
- **Rate limits apply** — Composio enforces its own rate limits on top of each tool's native limits
- **OAuth tokens** — managed by Composio; you don't control token refresh or storage
- **Action naming** — Composio action names may differ from native API terminology

## Pricing

| Plan | Monthly Price | API Calls | Notes |
|------|--------------|-----------|-------|
| Free | $0 | 20,000 | Good for exploration and personal use |
| Growth | $29 | 200,000 | For regular use across multiple tools |
| Business | $229 | 2,000,000 | For teams and heavy automation |

## Rate Limits

- Free tier: 20,000 calls/month, 10 req/sec
- Growth tier: 200,000 calls/month, 50 req/sec
- Business tier: 2,000,000 calls/month, 100 req/sec

## See Also

- [Quick start guide](../composio/README.md) — install, connect, and use in 5 minutes
- [Marketing tools mapping](../composio/marketing-tools.md) — detailed toolkit-to-category reference

## Relevant Skills

- analytics (cross-platform data via Composio connectors)
- emails (ActiveCampaign, Klaviyo access)
- ads (Meta Ads, LinkedIn Ads MCP access)
- referrals (Shopify integration)
