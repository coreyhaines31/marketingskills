# Composio Quick Start

Get MCP access to 500+ marketing tools through a single integration.

## Prerequisites

- Node.js 18+ (to run the Composio setup)
- A Dust workspace (Builder or Admin, to add MCP servers)

## Install

```bash
npx @composio/mcp@latest setup
```

Add the resulting Composio MCP server to Dust as a remote MCP server, then confirm `composio` appears in your workspace's tool list.

## Connect a Tool

When you ask the agent to use a Composio-backed tool for the first time, it will provide a Connect Link. Open the link in your browser, authorize the app, and you're set. The connection persists across sessions.

```
You: "Get my top HubSpot contacts"
Agent: "Please connect HubSpot first: https://app.composio.dev/connect/..."
# Click the link → authorize → return to Dust
Agent: "Here are your top contacts: ..."
```

## Usage Examples

### Pull CRM contacts

```
"Show me my 10 most recent HubSpot contacts with their deal stages"
```

### Get ad performance

```
"What's my Meta Ads spend and ROAS for the last 7 days?"
```

### Write to a spreadsheet

```
"Add a row to my 'Campaign Tracker' Google Sheet with today's LinkedIn Ads metrics"
```

### Cross-tool workflow

```
"Find Salesforce leads from this week and post a summary in Slack #new-leads"
```

## Available Marketing Tools

See [marketing-tools.md](marketing-tools.md) for the full list of Composio toolkits mapped to marketing use cases.

Key tools with new MCP access (no native MCP server in this repo):
- **HubSpot** — contacts, deals, companies, lists
- **Salesforce** — SOQL queries, leads, opportunities
- **Meta Ads** — campaigns, ad sets, insights
- **LinkedIn Ads** — campaigns, analytics
- **Google Sheets** — read, write, create spreadsheets
- **Slack** — messages, channels
- **Notion** — pages, databases
- **Klaviyo** — profiles, lists, campaigns
- **ActiveCampaign** — contacts, automations

## Troubleshooting

### "Tool not found" error

The tool may not be connected yet. Ask the agent to connect it, or run:

```bash
npx composio apps list
```

### Expired authentication

OAuth tokens expire. If a tool stops working, re-authenticate:

```bash
npx composio connections list    # Find the connection
npx composio connections remove {id}  # Remove it
# Then ask the agent to use the tool again to trigger re-auth
```

### Rate limit errors

Composio has its own rate limits (free: 20K calls/mo, 10 req/sec). If you hit them:
- Reduce request frequency
- Upgrade your Composio plan
- Use a native Dust connector for high-volume operations

### MCP server not appearing

Re-run the setup command:

```bash
npx @composio/mcp@latest setup
```

Then re-add or re-sync the Composio MCP server in Dust.
