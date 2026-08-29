# Xquik

Structured X/Twitter data for source-backed social listening, customer-language
research, competitor monitoring, creator research, and approved account actions.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | OpenAPI-described REST API |
| MCP | ✓ | Streamable HTTP endpoint with OAuth support |
| CLI | ✓ | `x-twitter-scraper` CLI |
| SDK | ✓ | TypeScript, Python, Go, Ruby, Java, Kotlin, C#, and PHP |

## Canonical Contracts

- Documentation: https://docs.xquik.com
- OpenAPI: https://xquik.com/openapi.yaml
- REST base URL: `https://xquik.com/api/v1`
- MCP endpoint: `https://xquik.com/mcp`
- MCP manifest: https://xquik.com/.well-known/mcp.json

Check these sources before using a path or parameter. Do not infer endpoint
names from examples in this guide.

## Authentication

Use the credential flow already approved by the user:

- API key in `X_TWITTER_SCRAPER_API_KEY` for the CLI and SDKs
- OAuth token in `X_TWITTER_SCRAPER_BEARER_TOKEN` for supported clients
- Eligible public or prepaid read flow described by the current API contract

For direct API-key requests, use the primary header form:

```bash
x-api-key: $X_TWITTER_SCRAPER_API_KEY
```

Keep credentials in the runtime environment or secret store. Never put keys in
prompts, query strings, source packets, exports, logs, or committed files.

## Core Research Operations

Use the current OpenAPI contract for exact parameters and response fields.

| Task | Common REST Route |
|------|-------------------|
| Search public posts | `GET /x/tweets/search` |
| Look up a post | `GET /x/tweets/{id}` |
| Look up a user | `GET /x/users/{id}` |
| Read a user timeline | `GET /x/users/{id}/tweets` |
| Read replies | `GET /x/tweets/{id}/replies` |
| Read a thread | `GET /x/tweets/{id}/thread` |
| Read followers/following | `GET /x/users/{id}/followers` and `/following` |
| Read list or community posts | `GET /x/lists/{id}/tweets` and `/x/communities/{id}/tweets` |
| Read trends | `GET /trends` or `GET /x/trends` |

### Search Example

```bash
curl --get 'https://xquik.com/api/v1/x/tweets/search' \
  --header "x-api-key: $X_TWITTER_SCRAPER_API_KEY" \
  --header 'xquik-api-contract: 2026-04-29' \
  --data-urlencode 'q="webhook reliability" -filter:retweets' \
  --data-urlencode 'limit=25'
```

Use `--data-urlencode` for query text. Preserve the original query and pass
returned cursors back unchanged until the requested window is complete or the
user's cap is reached.

Search uses 1 credit per returned post under the current billing contract. Set
an explicit result cap. Recheck the billing guide before a large collection.

## MCP Workflow

Use the remote MCP endpoint when the host supports Streamable HTTP and OAuth.
Discover available tools from the server instead of hardcoding tool names.

1. Add `https://xquik.com/mcp` to the host's MCP configuration.
2. Complete the host's OAuth or approved bearer-token flow.
3. Inspect the live tool catalog.
4. Choose the narrowest public read that answers the question.
5. Keep private, write, export, monitor, webhook, and account operations behind
   an explicit user approval step.

## Evidence Packet

Normalize collected records before synthesis:

```markdown
## X Source Packet
- Objective: [decision this research informs]
- Window: [start and end]
- Queries: [exact query groups]
- Coverage: [reviewed, kept, pages/cursors, and cap]

| ID | URL | Date | Author | Short Excerpt | Visible Metrics | Theme |
|----|-----|------|--------|---------------|-----------------|-------|
```

Keep raw fields separate from derived sentiment, themes, and confidence labels.
Engagement is visible activity, not proof of purchase intent or market size.

## Approval Boundary

Public reads are the default. Get explicit approval before:

- Private reads or bookmarks
- Bulk extraction jobs
- Monitors or webhooks
- Publishing, deletion, likes, reposts, follows, or direct messages
- Profile, media, account, or credential changes

State the target, payload, account, expected effect, and ongoing behavior before
calling an operation with side effects.

## Relevant Skills

- `social` - source-backed listening, research, triage, and content follow-up
- `customer-research` - combine X evidence with interviews, reviews, and forums
- `competitor-profiling` - investigate competitors after a signal is qualified
- `content-strategy` - turn repeated evidence into an editorial plan

Xquik is an independent third-party service. Not affiliated with X Corp.
"Twitter" and "X" are trademarks of X Corp.

Contributor disclosure: An Xquik maintainer contributed this integration. It
is not a paid placement.
