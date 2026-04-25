# Cogny

Hosted MCP gateway that bundles several marketing tools behind one URL with managed OAuth. Useful when you want AI agents to talk to multiple marketing channels without standing up your own OAuth proxy.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | - | Access is via MCP, not a public REST API |
| MCP | ✓ | One federated MCP URL, OAuth-managed per channel |
| CLI | - | Connect tools via the Cogny dashboard |
| SDK | - | Use any MCP-capable client (Claude.ai, Claude API, Claude CLI, ChatGPT, etc.) |

## How it works

```
┌──────────────────┐      ┌──────────────────────┐      ┌───────────────────┐
│  Claude.ai /     │──────│  app.cogny.com/mcp   │──────│  Channel API      │
│  Claude CLI /    │      │  (federated MCP      │      │  (LinkedIn, GSC,  │
│  ChatGPT, etc.   │      │   endpoint)          │      │   TikTok, …)      │
└──────────────────┘      └──────────────────────┘      └───────────────────┘
                                    │
                                    │  Federates per-channel
                                    │  mcp.cogny.com endpoints
                                    ▼  with managed OAuth
```

`https://app.cogny.com/mcp` is a single federated endpoint that fans out to the per-channel `mcp.cogny.com` MCP servers — you connect once and every channel you've authorized in the dashboard becomes available.

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

### 1. Connect your channels

1. Sign up at [cogny.com](https://cogny.com) and create a workspace.
2. In the dashboard, connect the channels you want (OAuth flow per tool).

### 2. Add Cogny as a custom connector

In Claude.ai:

1. Go to **Settings → Connectors → Add custom connector**.
2. Enter name **Cogny** and paste your MCP URL:

   ```
   https://app.cogny.com/mcp
   ```

3. Complete the OAuth handshake when prompted.

The same `https://app.cogny.com/mcp` URL works in any MCP-capable client (Claude API, Claude CLI, ChatGPT custom connectors, etc.) — Cogny handles auth and routes each tool call to the right underlying channel.

## Channels Available via Cogny

Coverage changes over time — check the Cogny dashboard for the current list.

### SEO

| Channel | Typical use |
|---------|-------------|
| Search Console | Search analytics, URL inspection, sitemap submission |
| Bing Webmaster | Coverage, query stats, URL submission quota |
| Semrush | Keyword research, competitor checks (subject to Semrush plan) |

### Paid Social

| Channel | Typical use |
|---------|-------------|
| LinkedIn Ads | Campaign reporting, audience overlap, creative checks |
| Reddit Ads | Campaign reporting, audience and conversion lookups |
| TikTok Ads | Campaign reporting, ad group / creative health |

### Analytics

| Channel | Typical use |
|---------|-------------|
| Plausible | Privacy-friendly site analytics, goal reporting |
| Fathom | Privacy-friendly site analytics |

## Common Agent Operations

Once `https://app.cogny.com/mcp` is wired up, the agent picks tools by name across every channel you've connected.

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
- **Hosted dependency** — if `app.cogny.com` is down, the connected channels are unavailable through this path.
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
