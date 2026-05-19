# Sociality.io

Sociality.io is a social media intelligence platform with a hosted MCP server for account analytics, post-level insights, and competitor benchmarking across major social channels.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | - | Use the hosted MCP server for agent workflows |
| MCP | ✓ | Remote HTTP MCP server at `https://api.sociality.io/mcp` |
| CLI | - | Configure through each MCP-compatible client |
| SDK | - | MCP tools expose structured actions |

## Authentication

- **Type**: OAuth through the MCP client
- **Server URL**: `https://api.sociality.io/mcp`
- **Scope**: Connected Sociality.io user and workspace permissions
- **Setup**: Add the MCP server in your client, then complete the Sociality.io OAuth flow when prompted

Use the official server URL only. Before production or recurring workflows, confirm the active workspace with `social_workspace_context`.

## MCP Setup

### Remote HTTP MCP

For clients that support remote HTTP MCP servers:

```json
{
  "mcpServers": {
    "sociality": {
      "url": "https://api.sociality.io/mcp"
    }
  }
}
```

### STDIO Bridge

For clients that require STDIO MCP servers, use `mcp-remote`:

```json
{
  "mcpServers": {
    "sociality": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://api.sociality.io/mcp"]
    }
  }
}
```

### Codex

```bash
codex mcp add --url https://api.sociality.io/mcp sociality
```

### Claude Code

```bash
claude mcp add --transport http sociality https://api.sociality.io/mcp
```

### ChatGPT

Open Workspace settings > Apps, create a custom app named `Sociality MCP`, set the MCP server URL to `https://api.sociality.io/mcp`, choose OAuth, and complete authorization.

### Claude

Open Settings > Connectors, add a custom connector named `Sociality MCP`, set the MCP server URL to `https://api.sociality.io/mcp`, then connect and authorize through Sociality.io.

## MCP Resources

Resources are free, read-only context objects. Use them before billable calls.

| Resource | URI | Use For |
|----------|-----|---------|
| `social_workspace_context` | `sociality://workspace/context` | Team, user, credit usage, reset date |
| `social_tools_catalog` | `sociality://tools/catalog` | Tool list, read/write status, billing status |
| `social_platform_capabilities` | `sociality://platform/capabilities` | Supported channels, metric names, metric descriptions, aggregation behavior |

## MCP Prompts

| Prompt | Use For |
|--------|---------|
| `social_guide_tool_usage` | Tool selection, credit behavior, pagination, date ranges, metric selection |
| `social_guide_readiness_check` | Workspace readiness, connected account counts, credit warnings, expired tokens |

Prompt availability depends on the MCP client. If prompts are not exposed, use the resources and tools directly.

## MCP Tools

### Account Tools

Owned account tools work with social accounts connected to the authenticated workspace.

| Tool | Credit Usage | Required Inputs | Use For |
|------|--------------|-----------------|---------|
| `social_accounts_list` | No | None | Discover owned accounts and account IDs |
| `social_account_stats_list` | Yes | `account_id`, `since`, `until`, `metrics` | Account-level trends and KPIs |
| `social_account_posts_list` | Yes | `account_id`, `since`, `until` | Published posts and stories |

Optional account filters:

- `social_accounts_list`: `channel`, `name`, `page`
- `social_account_stats_list`: `period` as `day`, `week`, or `month`
- `social_account_posts_list`: `type`, `order`

### Competitor Tools

Competitor tools work with tracked public social accounts in the current workspace.

| Tool | Credit Usage | Required Inputs | Use For |
|------|--------------|-----------------|---------|
| `social_competitors_list` | No | None | Discover tracked competitors and competitor IDs |
| `social_competitors_create` | No | `url` | Add a tracked competitor by social profile URL |
| `social_competitor_stats_list` | Yes | `competitor_id`, `since`, `until`, `metrics` | Public competitor profile stats |
| `social_competitor_posts_list` | Yes | `competitor_id`, `since`, `until` | Public competitor post performance |

Use `social_competitors_create` only when the user explicitly wants to add a competitor. Confirm the profile URL and workspace before approving the write action.

## Supported Channels

Sociality MCP supports owned account and competitor workflows for:

- Instagram
- TikTok
- Facebook
- YouTube
- X
- LinkedIn

Use `social_platform_capabilities` as the source of truth for metric coverage because available metrics and aggregation behavior vary by platform and data type.

## Common Agent Operations

### Account Performance Report

1. Read `social_workspace_context` for workspace and credit status.
2. Read `social_platform_capabilities` for available account metrics.
3. Call `social_accounts_list` with optional `channel` or `name`.
4. Call `social_account_stats_list` for the selected metrics and date range.
5. Call `social_account_posts_list` for the same period.
6. Summarize KPI changes, top posts, underperforming formats, and recommended tests.

### Competitor Benchmark

1. Read `social_workspace_context`.
2. Read `social_platform_capabilities`.
3. Call `social_accounts_list` for owned accounts.
4. Call `social_competitors_list` for tracked competitors.
5. Query account and competitor stats with matching date ranges and compatible metrics.
6. Query account and competitor posts to analyze formats, hooks, topics, cadence, and engagement patterns.
7. Compare normalized metrics such as engagement rate, engagements per post, follower growth, and post frequency.

### Add and Analyze a Competitor

1. Confirm the user wants to add a new tracked competitor.
2. Confirm the profile URL and active workspace.
3. Call `social_competitors_create` with `url` and optional `timezone`.
4. Use the returned competitor ID for stats and posts after data is available.

## Credit Model

Sociality MCP uses credits for tools that return analytics or post data.

| Returned Data | Credit Model |
|---------------|--------------|
| One day of account metrics | 1 credit |
| One day of competitor insights | 1 credit |
| One post with full details | 1 credit |

Free operations:

- Account list
- Competitor list
- Competitor creation
- Resources
- Prompts

Billable operations:

- Account stats
- Account posts
- Competitor stats
- Competitor posts

Check `social_workspace_context` before large, recurring, or automated workflows.

## Limits

- List tools return up to 50 rows per page.
- Stats and posts tools return up to 50 rows per call.
- Use narrower date ranges, platform filters, post type filters, or multiple calls for larger analyses.
- Responses can include an `_envelope` block with versions, server timestamp, TTL, and warnings.
- Data retention depends on the Sociality plan and platform availability.

## Key Metrics

Metric names, availability, and aggregation behavior are platform-specific. Use social_platform_capabilities as the source of truth before choosing metrics for stats calls.

Common metric families:

- Audience: followers, subscribers, follower growth
- Reach and visibility: reach, impressions, views, profile views
- Engagement: likes, comments, shares, saves, reactions, engagement rate
- Post performance: post type, text/title, media, published date, post metrics
- Competitor performance: public follower counts, public post metrics, publishing cadence

## When to Use

- Automating social performance reports from live account data
- Benchmarking owned accounts against tracked competitors
- Analyzing post-level winners and losers across platforms
- Building social media reporting assistants or internal copilots
- Creating repeatable executive summaries without manual exports
- Feeding social insights into content planning or experimentation workflows

## When to Use Exports Instead

- The user does not have Sociality MCP connected
- Historical data is outside available retention
- The required metric is not available through the connected platform
- The user needs to analyze a custom spreadsheet, agency report, or legacy dataset

## Safety and Permissions

- MCP access follows the connected Sociality.io user and workspace permissions.
- Use least-privilege accounts for production workflows.
- Reconnect OAuth when switching teams or workspaces.
- Review write actions before approving `social_competitors_create`.
- Monitor recurring workflows for credit usage and unusual request volume.

## Relevant Skills

- social-analytics
- social-benchmarking
- social
- analytics
- content-strategy
