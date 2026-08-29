# Hermes Tweet

Hermes Agent plugin for X/Twitter search, monitoring, exports, and approval-gated Xquik workflows.

> **Disclosure:** This guide was contributed by an Xquik maintainer. Xquik did
> not pay for placement. Use this integration only when Hermes Agent and Xquik
> fit the workflow.

Xquik is an independent third-party service. Not affiliated with X Corp.
"Twitter" and "X" are trademarks of X Corp.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Xquik REST API through the plugin's endpoint catalog |
| MCP | - | Hermes Agent plugin, not an MCP server |
| CLI | - | Installed through `hermes plugins` |
| SDK | - | The PyPI package installs the plugin; it is not an SDK |

## Authentication

- **Type**: API Key
- **Env var**: `XQUIK_API_KEY`
- **Get key**: https://dashboard.xquik.com
- **Actions**: Set `HERMES_TWEET_ENABLE_ACTIONS=true` only for catalog actions such as composition, exports, or monitors.

## Install

```bash
hermes plugins install Xquik-dev/hermes-tweet --enable
```

After setting `XQUIK_API_KEY`, run `/reload` in an interactive Hermes session or
restart gateway and cron processes so gated read tools are available.

## Common Agent Operations

### Discover X/Twitter endpoints

Use `tweet_explore` before making a read or action call.

```json
{
  "query": "tweet search",
  "limit": 10
}
```

### Search public tweets

Use `tweet_read` only with a read-only endpoint returned by `tweet_explore`.

```json
{
  "path": "/api/v1/x/tweets/search",
  "query": {
    "q": "launch announcement",
    "limit": "20"
  }
}
```

### Read account or audience data

Use public or account-scoped read endpoints for marketing research, audience checks, and reporting. Keep write actions disabled for research-only workflows.

```json
{
  "path": "/api/v1/account"
}
```

### Prepare a post draft

Hermes routes non-GET endpoints through `tweet_action`, including read-only
composition. State the reason and review the returned draft before publishing.

```json
{
  "path": "/api/v1/compose",
  "method": "POST",
  "reason": "Prepare a launch draft for operator review.",
  "body": {
    "step": "compose",
    "topic": "Product launch",
    "goal": "conversation"
  }
}
```

## When to Use

- X/Twitter research for launch, social, customer research, or competitor workflows
- Monitoring X/Twitter mentions, keywords, or accounts for marketing signals
- Exporting followers, replies, mentions, or search results for analysis
- Preparing post drafts and running supported, approved Xquik actions
- Keeping read-only social listening separate from opt-in catalog actions

## When NOT to Use

- Cross-platform social scheduling across LinkedIn, Instagram, Facebook, and TikTok - use Buffer
- Paid ad campaign management - use the ads skill and platform-specific ad integrations
- First-party X API workflows or endpoints outside the plugin catalog - use the X API directly
- Workflows where no Xquik API key is available and the task needs live X/Twitter data
- Unapproved writes, deletes, follows, DMs, or monitor changes

## Safety Notes

- `tweet_explore` is safe and does not make network calls.
- `tweet_read` requires `XQUIK_API_KEY` and rejects write-like endpoints.
- `tweet_action` requires an explicit `reason`, `XQUIK_API_KEY`, and `HERMES_TWEET_ENABLE_ACTIONS=true`.
- Keep actions disabled for social listening, reporting, and research workflows.
- Always summarize the exact endpoint and payload before state-changing calls.
- Some reads spend credits. Use `tweet_explore` to check the `free` field and set a result limit.
- Active monitors spend credits over time. Check `/api/v1/account` before creating one.

## Relevant Skills

- social
- launch
- customer-research
- competitor-profiling
- content-strategy

## Resources

- [Hermes Tweet repository](https://github.com/Xquik-dev/hermes-tweet)
- [Hermes Tweet package](https://pypi.org/project/hermes-tweet/)
- [Xquik API reference](https://docs.xquik.com/api-reference/overview)
- [Xquik dashboard](https://dashboard.xquik.com)
