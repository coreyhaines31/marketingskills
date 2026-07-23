# Hermes Tweet

Hermes Agent plugin for X/Twitter search, monitoring, exports, and approval-gated account actions through Xquik.

Xquik is an independent third-party service. Not affiliated with X Corp.
"Twitter" and "X" are trademarks of X Corp.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Xquik REST API through the plugin's endpoint catalog |
| MCP | - | Hermes Agent plugin, not an MCP server |
| CLI | - | Installed through `hermes plugins` |
| SDK | ✓ | Python package on PyPI: `hermes-tweet` |

## Authentication

- **Type**: API Key
- **Env var**: `XQUIK_API_KEY`
- **Get key**: https://dashboard.xquik.com
- **Actions**: Set `HERMES_TWEET_ENABLE_ACTIONS=true` only when posting, deleting, monitoring, or other state-changing workflows are expected.

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
  "method": "GET",
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
  "path": "/api/v1/account",
  "method": "GET"
}
```

### Post or mutate state

Use `tweet_action` only after the user confirms the exact operation and `HERMES_TWEET_ENABLE_ACTIONS=true` is set.

```json
{
  "path": "/api/v1/x/tweets",
  "method": "POST",
  "body": {
    "text": "Launch post draft approved by the operator."
  }
}
```

## When to Use

- X/Twitter research for launch, social, customer research, or competitor workflows
- Monitoring X/Twitter mentions, keywords, or accounts for marketing signals
- Exporting followers, replies, mentions, or search results for analysis
- Drafting and publishing approved X/Twitter posts from a Hermes Agent workflow
- Keeping read-only social listening separate from opt-in posting or account actions

## When NOT to Use

- Cross-platform social scheduling across LinkedIn, Instagram, Facebook, and TikTok - use Buffer
- Paid ad campaign management - use the ads skill and platform-specific ad integrations
- Workflows where no Xquik API key is available and the task needs live X/Twitter data
- Unapproved writes, deletes, follows, DMs, or monitor changes

## Safety Notes

- `tweet_explore` is safe and does not make network calls.
- `tweet_read` requires `XQUIK_API_KEY` and rejects write-like endpoints.
- `tweet_action` requires both `XQUIK_API_KEY` and `HERMES_TWEET_ENABLE_ACTIONS=true`.
- Keep actions disabled for social listening, reporting, and research workflows.
- Always summarize the exact endpoint and payload before state-changing calls.

## Relevant Skills

- social
- launch
- customer-research
- competitor-profiling
- content-strategy

## Resources

- [Hermes Tweet repository](https://github.com/Xquik-dev/hermes-tweet)
- [Hermes Tweet package](https://pypi.org/project/hermes-tweet/)
- [Xquik dashboard](https://dashboard.xquik.com)
