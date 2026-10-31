# Post Bridge

Social media scheduling and publishing across many accounts and platforms from one post: TikTok, Instagram, YouTube, X, LinkedIn, Facebook, Threads, Bluesky, Pinterest, and Google Business. It also syncs per-post analytics with daily snapshots, which suits the short-form format-finding loop.

Facts below were checked against the [OpenAPI spec](https://www.post-bridge.com/openapi.json) and the [API reference](https://api.post-bridge.com/reference) on 2026-10-30.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST, `https://api.post-bridge.com/v1`, JSON bodies |
| MCP | ✓ | Official remote server at `https://www.post-bridge.com/api/mcp/mcp`, signed in with OAuth (scopes for posts, accounts, media, and analytics) |
| CLI | ✓ | Official CLI that uses the same API key (see their [MCP and agents page](https://www.post-bridge.com/mcp)) |
| SDK | - | Plain HTTP |

## Authentication

- **Type**: Bearer API key: `Authorization: Bearer {api_key}`
- **Env var** (convention): `POST_BRIDGE_API_KEY`
- **Get key**: create one in the Post Bridge dashboard. MCP clients sign in with OAuth instead.
- **Rate limit**: 10 requests per second per key

## Common Agent Operations

### List connected accounts

```bash
GET https://api.post-bridge.com/v1/social-accounts?platform=tiktok
Authorization: Bearer $POST_BRIDGE_API_KEY
```

Returns account IDs for `social_accounts` in posts. An account whose token expired must be reconnected in the dashboard before it can publish.

### Upload a video

```bash
POST https://api.post-bridge.com/v1/media/create-upload-url
Content-Type: application/json

{ "mime_type": "video/mp4", "size_bytes": 18234567, "name": "hook-test-12.mp4" }
```

Returns `media_id` and a signed `upload_url`. PUT the file to `upload_url`, then pass `media_id` in the post. Or skip the upload and pass public file URLs in `media_urls`.

### Schedule one video to several accounts and platforms

```bash
POST https://api.post-bridge.com/v1/posts
Content-Type: application/json

{
  "caption": "3 habits that fixed my sleep (the app is in my bio)",
  "media": ["<media_id>"],
  "social_accounts": [101, 102, 205],
  "scheduled_at": "2026-11-02T17:00:00Z",
  "platform_configurations": {
    "tiktok": { "title": "3 habits that fixed my sleep" },
    "youtube": { "title": "3 habits that fixed my sleep #shorts" }
  }
}
```

- Omit `scheduled_at` to post now, or pass `"use_queue": true` to take the next queue slot (not both).
- `platform_configurations` and `account_configurations` override the caption, media, or title per platform or per account.
- `"is_draft": true` saves a draft for human review instead of scheduling it.
- TikTok, Instagram, YouTube, and Pinterest need media to publish.
- Links are stripped from captions on X. Put the link in a reply or the bio.

### Check what published

```bash
GET https://api.post-bridge.com/v1/post-results?post_id={post_id}
```

Each result has `success`, `error`, and the platform's post data per account.

### Read post analytics

```bash
POST https://api.post-bridge.com/v1/analytics/sync?platform=tiktok     # refresh from the platform
GET  https://api.post-bridge.com/v1/analytics?platform=tiktok&timeframe=30d
GET  https://api.post-bridge.com/v1/analytics/{id}/daily               # daily snapshots and per-day deltas
```

Analytics cover TikTok, YouTube, and Instagram: views, likes, comments, and shares per post. Read views at 48 hours from the daily snapshots to compare formats on equal footing.

## Notes for Agents

- Publishing is outward-facing: create drafts or scheduled posts for the user to approve unless they've said to post directly.
- Several accounts per platform are supported. Keep each account brand-affiliated and within the platform's rules on coordinated accounts and fake engagement (see the short-form guide in the **social** skill).
- Post Bridge counts views, not outcomes. Join its analytics with signups or installs from the user's analytics before calling a format a winner.

## Relevant Skills

- **social**: short-form video, account warm-up, staged cadence, and the winning-format search
- **marketing-loops**: the format-finding loop
- **video**: producing the videos it publishes
