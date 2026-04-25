# Cogny

Hosted MCP gateway that bundles several marketing tools behind one URL with managed OAuth. Useful when you want AI agents to talk to multiple marketing channels without standing up your own OAuth proxy.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | - | Access is via MCP, not a public REST API |
| MCP | ✓ | One MCP URL per channel, bearer-token auth |
| CLI | - | Connect tools via the Cogny dashboard |
| SDK | - | Use any MCP-capable client (Claude API, Claude CLI, etc.) |

## How it works

```
┌──────────────────┐      ┌────────────────────┐      ┌───────────────────┐
│  Claude API /    │──────│  mcp.cogny.com     │──────│  Channel API      │
│  Claude CLI /    │      │  (per-channel URL) │      │  (LinkedIn, GSC,  │
│  ChatGPT, etc.   │      │                    │      │   TikTok, …)      │
└──────────────────┘      └────────────────────┘      └───────────────────┘
        │                          │
        │  Authorization:          │  OAuth tokens stored
        │  Bearer <cogny_token>    │  per workspace, refreshed
        ▼                          ▼  automatically
```

You authenticate once per channel in the Cogny dashboard. Each channel exposes a stable MCP URL that any MCP-capable client can call with a Cogny bearer token.

## When to Use Cogny vs. Native or Composio

Cogny is one of several integration paths. Pick based on what you need:

| Scenario | Suggested |
|----------|-----------|
| Tool has a native MCP server you can self-host | Native MCP |
| You want a single bill / single login across many channels | Cogny or Composio |
| You need 500+ tools (CRM, productivity, dev tools, etc.) | [Composio](composio.md) |
| You only need the marketing channels Cogny ships | Cogny |
| You need deep, custom control over a single tool | Native API + CLI |

Cogny is narrower than Composio — it focuses on marketing channels — but the trade-off is fewer moving parts when you only need those channels.

## Setup

### 1. Connect a channel

1. Sign up at [cogny.com](https://cogny.com) and create a workspace.
2. In the dashboard, connect the channels you want (OAuth flow per tool).
3. Copy your Cogny access token and your workspace (warehouse) ID.

### 2. Wire the MCP server into Claude

Each channel has its own MCP URL of the form `https://mcp.cogny.com/<channel>/<workspace_id>`. Example with the Claude API:

```python
from anthropic import Anthropic

client = Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    mcp_servers=[{
        "type": "url",
        "url": f"https://mcp.cogny.com/search_console/{workspace_id}",
        "name": "Search Console",
        "authorization_token": cogny_access_token,
    }],
    tools=[{"type": "mcp_toolset", "mcp_server_name": "Search Console"}],
    messages=[{"role": "user", "content": "What pages lost the most clicks last week?"}],
)
```

Or with Claude CLI:

```bash
claude --mcp-server https://mcp.cogny.com/linkedin_ads/<workspace_id> \
       --mcp-auth "Bearer <cogny_access_token>" \
       "Show my LinkedIn campaigns with CTR under 0.4%"
```

## Channels Available via Cogny

Coverage changes over time — check the Cogny dashboard for the current list. The channels below are what's live today and not gated behind a vendor approval queue.

### SEO

| Channel | Path | Typical use |
|---------|------|-------------|
| Search Console | `/search_console/<wid>` | Search analytics, URL inspection, sitemap submission |
| Bing Webmaster | `/bing_webmaster/<wid>` | Coverage, query stats, URL submission quota |
| Semrush | `/semrush/<wid>` | Keyword research, competitor checks (subject to Semrush plan) |

### Paid Social

| Channel | Path | Typical use |
|---------|------|-------------|
| LinkedIn Ads | `/linkedin_ads/<wid>` | Campaign reporting, audience overlap, creative checks |
| Reddit Ads | `/reddit_ads/<wid>` | Campaign reporting, audience and conversion lookups |
| TikTok Ads | `/tiktok_ads/<wid>` | Campaign reporting, ad group / creative health |

### Analytics

| Channel | Path | Typical use |
|---------|------|-------------|
| Plausible | `/plausible/<wid>` | Privacy-friendly site analytics, goal reporting |
| Fathom | `/fathom/<wid>` | Privacy-friendly site analytics |

Other channels (e.g. Meta Ads, Google Ads, X Ads) are in various stages of vendor review and may appear in the dashboard but are not promoted here until they're broadly available.

## Common Agent Operations

These work the same way as calling any MCP server — the agent picks tools by name once the MCP server is attached.

### Search Console — pages losing clicks

```
> "Pull Search Console clicks for the last 28 days vs the previous 28 days,
   group by page, and list pages where clicks dropped more than 30%."
```

### LinkedIn Ads — campaign hygiene

```
> "List my active LinkedIn campaigns, their CTR and CPL for the last 14 days,
   and flag anything with CTR below 0.4%."
```

### Reddit Ads — audience overlap

```
> "For my Reddit Ads campaigns this month, summarize spend, conversions, and
   the subreddits driving the most clicks."
```

### TikTok Ads — creative fatigue

```
> "Find TikTok ad groups where CTR has dropped 25%+ over the last 7 days
   compared to the prior 7 days."
```

### Plausible — funnel sanity check

```
> "From Plausible, show top 10 pages by pageviews and the conversion rate
   for the 'Signup' goal over the last 30 days."
```

## Limitations

- **Marketing-only scope** — Cogny ships marketing channels; for CRM, productivity, or dev tools use [Composio](composio.md) or the relevant native integration.
- **Vendor-gated channels** — some platforms (Meta, Google Ads, X) require vendor app approvals; availability varies and isn't guaranteed.
- **Hosted dependency** — if `mcp.cogny.com` is down, the connected channels are unavailable through this path.
- **Coverage depth varies** — read-heavy and reporting tools generally have more depth than write/mutation tools.
- **OAuth tokens** — managed by Cogny; you don't control token refresh or storage directly.

## Pricing

Cogny's Solo plan starts at **$9/month** and includes a 7-day free trial. Higher tiers are available for teams. Check [cogny.com/pricing](https://cogny.com/pricing) for current plans and limits.

## See Also

- [Composio](composio.md) — broader integration layer (500+ tools, OAuth-heavy CRMs and productivity apps)
- [Google Search Console](google-search-console.md) — native API guide if you'd rather call GSC directly
- [LinkedIn Ads](linkedin-ads.md), [TikTok Ads](tiktok-ads.md) — native API guides

## Relevant Skills

- seo-audit (Search Console, Bing Webmaster, Semrush via Cogny)
- paid-ads (LinkedIn, Reddit, TikTok via Cogny)
- analytics-tracking (Plausible, Fathom via Cogny)
