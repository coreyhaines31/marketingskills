# ContentStudio

Social media scheduling, publishing, content categories, approvals, and analytics across multiple platforms — with a REST API, an MCP server, and a CLI for agent-driven workflows.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API v1 for workspaces, accounts, posts, media, comments, analytics |
| MCP | ✓ | [contentstudio-mcp](https://www.npmjs.com/package/contentstudio-mcp) — `npx -y contentstudio-mcp`, or Claude Desktop bundle |
| CLI | ✓ | Official [contentstudio-cli](https://www.npmjs.com/package/contentstudio-cli) (`npm i -g contentstudio-cli`) |
| SDK | - | No official SDK; use the REST API, CLI, or MCP server |

## Authentication

- **Type**: API key
- **Header**: `X-API-Key: {api_key}` (keys are prefixed `cs_`)
- **Base URL**: `https://api.contentstudio.io/api/v1`
- **Get key**: In the ContentStudio dashboard, open your profile menu → **API Key** → **Generate API Key**
- **Reference**: Interactive API guide at https://api.contentstudio.io/guide
- **Note**: Requests are workspace-scoped and consume per-plan API credits. Never commit an API key — store it as an environment variable.

## Common Agent Operations

### Get the authenticated user

```bash
GET https://api.contentstudio.io/api/v1/me

X-API-Key: {api_key}
```

### List workspaces

```bash
GET https://api.contentstudio.io/api/v1/workspaces

X-API-Key: {api_key}
```

### List connected social accounts

```bash
GET https://api.contentstudio.io/api/v1/workspaces/{workspace_id}/accounts

X-API-Key: {api_key}
```

### Create / schedule a post

```bash
POST https://api.contentstudio.io/api/v1/workspaces/{workspace_id}/posts
X-API-Key: {api_key}
Content-Type: application/json

{
  "content": { "text": "Hello from the API" },
  "accounts": ["{account_id}"],
  "scheduling": {
    "publish_type": "scheduled",
    "scheduled_at": "2026-03-01 10:00:00",
    "timezone": "UTC"
  }
}
```

`publish_type` accepts `now`, `scheduled`, `draft`, `queued`, or `content_category`. A successful call returns `{ "status": true, "message": "...", "data": { "id": "...", "post_url": "..." } }`.

### List posts

```bash
GET https://api.contentstudio.io/api/v1/workspaces/{workspace_id}/posts

X-API-Key: {api_key}
```

### Delete a post

```bash
DELETE https://api.contentstudio.io/api/v1/workspaces/{workspace_id}/posts/{post_id}

X-API-Key: {api_key}
```

### Upload media

```bash
POST https://api.contentstudio.io/api/v1/workspaces/{workspace_id}/media
X-API-Key: {api_key}
Content-Type: multipart/form-data

file=@./image.jpg
```

### List content categories, labels, or campaigns

```bash
GET https://api.contentstudio.io/api/v1/workspaces/{workspace_id}/content-categories
GET https://api.contentstudio.io/api/v1/workspaces/{workspace_id}/labels
GET https://api.contentstudio.io/api/v1/workspaces/{workspace_id}/campaigns
```

### Get analytics (Facebook, Instagram, YouTube)

```bash
GET https://api.contentstudio.io/api/v1/workspaces/{workspace_id}/analytics/facebook/summary

X-API-Key: {api_key}
```

Instagram and YouTube expose parallel `analytics/instagram/*` and `analytics/youtube/*` endpoints. Pass the account and date-range query parameters documented in the API guide.

## CLI

The official CLI wraps the same REST API for scripts and agents:

```bash
npm install -g contentstudio-cli

# Authenticate (or set CONTENTSTUDIO_API_KEY)
contentstudio auth:login --api-key cs_xxxxxxxx

# Common operations
contentstudio --json workspaces:list
contentstudio --json accounts:list --platform facebook
contentstudio posts:create -c "Hello 👋" --account {account_id} --publish-type draft
contentstudio --json posts:delete {post_id} --dry-run
```

Commands use `group:action` syntax (`auth`, `workspaces`, `accounts`, `posts`, `comments`, `media`, `campaigns`, `categories`, `labels`, `team`). `--json` returns a stable `{ "ok": true, "data": ... }` envelope and mutating commands support `--dry-run`. The CLI is also installable as an agent skill:

```bash
npx skills add contentstudioio/contentstudio-agent
```

## MCP Server

ContentStudio ships an MCP server so agents can call it directly. Add it to an MCP client config:

```json
{
  "contentstudio": {
    "command": "bash",
    "args": ["-lc", "npx -y contentstudio-mcp"],
    "env": {
      "CONTENTSTUDIO_API_KEY": "<your-api-key>"
    }
  }
}
```

For Claude Desktop, download and double-click the prebuilt bundle from https://contentstudio.io/mcp-server. Exposed tools include `fetch_workspaces`, `fetch_social_accounts`, `fetch_posts`, `create_post`, and `delete_post` — see the [MCP server docs](https://docs.contentstudio.io/article/1172-contentstudio-mcp-server) for the full set. ContentStudio can also be reached through its Zapier, Make, and n8n integrations.

## Parameters

### Create Post Parameters

- `content.text` - Required. Post caption/body (max 5000 chars)
- `accounts` - Array of connected account IDs to publish to (required unless `content_category_id` is set)
- `scheduling.publish_type` - Required. One of `now`, `scheduled`, `draft`, `queued`, `content_category`
- `scheduling.scheduled_at` - `Y-m-d H:i:s`. Required when `publish_type` is `scheduled` or `draft`
- `scheduling.timezone` - Optional timezone for `scheduled_at`
- `content.media.images` / `content.media.video` - Optional media URLs
- `first_comment` - Optional first comment posted after publish
- `labels` - Optional array of label IDs (max 20)
- `campaign_id` - Optional campaign (folder) ID
- `post_type` - Optional post type (default `feed`)

## When to Use

- Scheduling and publishing social posts across multiple platforms via API, CLI, or MCP
- Building agent workflows that create, list, or delete posts programmatically
- Managing evergreen content categories and recurring queues
- Routing posts through approval workflows before publishing
- Automating first comments and per-platform content variants
- Pulling Facebook, Instagram, and YouTube analytics into reports

## Rate Limits

- 100 requests per minute per API key (HTTP 429 on exceed, `retry_after: 60`)
- Per-plan API credit quota (HTTP 403 when the allowance is exhausted)
- See https://api.contentstudio.io/guide for current limits

## Relevant Skills

- social
- launch
