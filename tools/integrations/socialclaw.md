# SocialClaw

Workspace-scoped social media scheduling and publishing API built for AI agents, covering X, LinkedIn, Instagram, Facebook Pages, TikTok, YouTube, Reddit, Pinterest, WordPress, Discord, and Telegram.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API at `https://getsocialclaw.com/v1` (Bearer auth) |
| MCP | ✓ | MCP server bundled with the `socialclaw` CLI |
| CLI | ✓ | Official `socialclaw` CLI (`npm i -g socialclaw`, alias `social`) |
| SDK | - | No separate SDK; use the HTTP API or the CLI |

## Authentication

- **Type**: Workspace API key (Bearer token)
- **Header**: `Authorization: Bearer {SC_API_KEY}`
- **Get key**: Sign in at https://getsocialclaw.com/dashboard (Google sign-in), open the API key section, then create or copy a workspace key
- **Env var**: `SC_API_KEY`
- **Note**: A key alone is not sufficient for execution — the workspace must also have an active trial or paid plan. Requests fail with `plan_required` or `subscription_*` (e.g. `subscription_inactive`, `subscription_past_due`) until billing is active.

## Supported Providers

`x`, `facebook` (Pages), `instagram_business`, `instagram`, `linkedin`, `linkedin_page`, `pinterest`, `tiktok`, `youtube`, `reddit`, `wordpress`, `discord`, `telegram`.

Most providers use a hosted browser OAuth flow. The two exceptions are connected manually:

- **Telegram** — a bot token plus a target `chatId` or `@channelusername`
- **Discord** — a channel webhook URL

## Common Agent Operations

### Validate the workspace key

```bash
curl -sS -H "Authorization: Bearer $SC_API_KEY" \
  https://getsocialclaw.com/v1/keys/validate
```

### Start an account connection

```bash
curl -sS -X POST \
  -H "Authorization: Bearer $SC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"provider":"youtube"}' \
  https://getsocialclaw.com/v1/connections/start
```

Return the authorize URL to the user (or open it), then poll:

```bash
curl -sS -H "Authorization: Bearer $SC_API_KEY" \
  https://getsocialclaw.com/v1/connections/{connection_id}
```

Telegram and Discord skip the browser flow:

```bash
# Telegram
curl -sS -X POST -H "Authorization: Bearer $SC_API_KEY" -H "Content-Type: application/json" \
  -d '{"provider":"telegram","botToken":"{bot_token}","chatId":"@yourchannel"}' \
  https://getsocialclaw.com/v1/connections/start

# Discord
curl -sS -X POST -H "Authorization: Bearer $SC_API_KEY" -H "Content-Type: application/json" \
  -d '{"provider":"discord","webhookUrl":"{discord_webhook_url}"}' \
  https://getsocialclaw.com/v1/connections/start
```

### List connected accounts

```bash
curl -sS -H "Authorization: Bearer $SC_API_KEY" \
  https://getsocialclaw.com/v1/accounts
```

### Inspect what an account supports

```bash
curl -sS -H "Authorization: Bearer $SC_API_KEY" \
  https://getsocialclaw.com/v1/accounts/{account_id}/capabilities
```

### Upload media

```bash
curl -sS -X POST -H "Authorization: Bearer $SC_API_KEY" \
  -F "file=@./image.png" \
  https://getsocialclaw.com/v1/assets/upload
```

Returns a SocialClaw-hosted media link to reference from a post's `assets`.

### Validate, then apply a schedule

```bash
# Dry-run validation
curl -sS -X POST -H "Authorization: Bearer $SC_API_KEY" -H "Content-Type: application/json" \
  -d @schedule.json https://getsocialclaw.com/v1/posts/validate

# Apply (schedule/publish)
curl -sS -X POST -H "Authorization: Bearer $SC_API_KEY" -H "Content-Type: application/json" \
  -d @schedule.json https://getsocialclaw.com/v1/posts/apply
```

### Inspect posts and runs

```bash
curl -sS -H "Authorization: Bearer $SC_API_KEY" "https://getsocialclaw.com/v1/posts?limit=20"
curl -sS -H "Authorization: Bearer $SC_API_KEY" "https://getsocialclaw.com/v1/posts/{post_id}"
curl -sS -H "Authorization: Bearer $SC_API_KEY" "https://getsocialclaw.com/v1/runs/{run_id}"
```

## Schedule Format

`POST /v1/posts/apply` takes a `posts` array. Each post carries the target account handle, its `provider`, copy, an ISO 8601 UTC `publishAt`, and `assets`:

```json
{
  "posts": [
    {
      "account": "instagram:standalone:17841471712xxx",
      "provider": "instagram",
      "name": "My reel",
      "description": "Caption with #hashtags",
      "status": "scheduled",
      "publishAt": "2026-03-22T14:00:00.000Z",
      "assets": [
        { "mediaLink": "https://getsocialclaw.com/media/{asset_id}/{token}/video.mp4" }
      ]
    }
  ]
}
```

The `account` field uses the handle from `GET /v1/accounts` (e.g. `x:@username`, `youtube:channel:UC...`, `pinterest:board:123`). To post immediately, set `publishAt` 1-2 minutes in the future. Draft campaigns use a `campaigns` array with `"mode": "draft"`.

## API Pattern

REST under `https://getsocialclaw.com/v1`, Bearer auth, JSON request bodies. Media is uploaded via multipart and referenced by hosted link. Publishing is a two-phase flow — **validate** (dry run) then **apply** — and posts run asynchronously. A `providerStatus: accepted` does not guarantee the post is live; reconcile after a short delay (`socialclaw posts reconcile --post-id ...`) and treat `published` + confirmed reconciliation as the stronger success signal.

## Official CLI

SocialClaw ships an official Node CLI that wraps the same hosted service:

```bash
npm install -g socialclaw
socialclaw login --api-key {workspace_key}
socialclaw accounts connect --provider youtube --open
socialclaw accounts list --json
socialclaw assets upload --file ./image.png --json
socialclaw validate -f schedule.json --json
socialclaw apply -f schedule.json --json
socialclaw posts get --post-id {post_id} --json
socialclaw posts reconcile --post-id {post_id} --json
socialclaw analytics post --post-id {post_id} --json
socialclaw install --claude   # install the packaged Claude Code command
```

## When to Use

- Programmatically scheduling or publishing across 13 networks from an agent or script
- Multi-platform campaigns where each account needs its own copy, settings, and publish time
- Validate-before-publish workflows with post/run inspection and reconciliation
- Connecting manual-token channels (Telegram bot, Discord channel webhook) alongside OAuth providers
- Provider-aware posting that respects account-type differences (Facebook Pages vs. profiles, Instagram Business vs. standalone, LinkedIn profile vs. page, board-centric Pinterest)

## Plan Requirement

Execution through a workspace key requires an active trial or paid plan. On `plan_required` or `subscription_*` responses, direct the user to https://getsocialclaw.com/pricing or the dashboard rather than retrying the request.

## Relevant Skills

- social
- content-strategy
- launch
- marketing-plan
