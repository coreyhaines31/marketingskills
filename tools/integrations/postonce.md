# PostOnce

Publish and schedule one post or video to TikTok, Instagram, YouTube, LinkedIn, Facebook, X, Threads, Pinterest, and Bluesky through each platform's official API. It can also keep crossposting automatically: a workflow sends every new post from one connected account to others. Analytics cover TikTok, Instagram, YouTube, and Facebook, including posts made outside PostOnce.

Facts below were checked against the [OpenAPI spec](https://postonce.to/api/openapi.json) and the [API docs](https://docs.postonce.to) on 2026-11-16.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST, `https://postonce.to/api/public/v1`, JSON bodies |
| MCP | ✓ | Official remote server at `https://postonce.to/mcp`, signed in with OAuth (no API key) |
| CLI | - | Use the API or MCP |
| SDK | - | Plain HTTP |

## Authentication

- **Type**: Bearer API key: `Authorization: Bearer {api_key}`
- **Env var** (convention): `POSTONCE_API_KEY`
- **Get key**: dashboard, **Preferences > API Keys**. Pick scopes: `accounts:read`, `media:write`, `posts:read`, `posts:write`, `workflows:read`, `workflows:write`. A missing scope returns `403 missing_scope`.
- **Rate limit**: 60 or 300 requests per minute per key, depending on plan. MCP clients sign in with OAuth instead.

## Common Agent Operations

### List connected accounts

```bash
GET https://postonce.to/api/public/v1/accounts
Authorization: Bearer $POSTONCE_API_KEY
```

Returns each account's `id`, `platform`, `username`, and `status` (`active`, `auth_required`, `disconnected`). An `auth_required` account must be reconnected in the dashboard before it can publish. `media_requirements` lists each account's file limits, durations, and whether media is required, so check it before posting text only.

### Upload a video

```bash
POST https://postonce.to/api/public/v1/media/uploads
Content-Type: application/json

{ "filename": "hook-test-12.mp4", "content_type": "video/mp4" }
```

Returns `data.media_id` and a signed URL at `data.upload.signedUrl`. PUT the file's bytes to that URL; creating it uploads nothing. Then pass the media's public URL in `media[].url`. Files that are already public can be passed by URL without an upload.

### Post one video to several accounts and platforms

```bash
POST https://postonce.to/api/public/v1/posts
Content-Type: application/json
Idempotency-Key: launch-video-2026-11-20

{
  "content": "3 habits that fixed my sleep",
  "media": [{ "url": "https://cdn.example.com/hook-test-12.mp4", "type": "video" }],
  "publish_at": "2026-11-20T17:00:00Z",
  "targets": [
    { "account_id": "<tiktok_account_id>" },
    { "account_id": "<instagram_account_id>" },
    { "account_id": "<youtube_account_id>", "platform_options": { "title": "3 habits that fixed my sleep #shorts" } },
    { "account_id": "<linkedin_account_id>", "content_override": "Three changes that fixed my sleep, and what I measured." }
  ]
}
```

- Omit `publish_at` to post now.
- `content_override` replaces the caption for one target; `platform_options` holds per-platform settings such as `title`, `ai_generated`, or Instagram's `publish_as_trial_reel`.
- `media[].thumbnail_url` sets the video cover on Instagram Reels, Facebook Reels, and TikTok.
- Retrying with the same `Idempotency-Key` and body returns the original post instead of posting twice.
- To save a post for review instead, use `POST /v1/drafts` with `content`, `media`, and `selected_account_ids`. Drafts are never published or scheduled on their own.

### Check what published

```bash
GET https://postonce.to/api/public/v1/posts/{post_id}
```

The post has a `status` (`scheduled`, `processing`, `partial`, `published`, `failed`, ...), and each entry in `targets` has its own `status`, `error`, and `platform_post_url`. Retry one failed destination with `POST /v1/posts/{id}/targets/{targetId}/retry`; cancel a scheduled post with `POST /v1/posts/{id}/cancel`.

### Crosspost every new post automatically

```bash
POST https://postonce.to/api/public/v1/workflows
Content-Type: application/json

{
  "name": "Reels to TikTok and Shorts",
  "source_account_id": "<instagram_account_id>",
  "target_account_ids": ["<tiktok_account_id>", "<youtube_account_id>"],
  "settings": { "content_filters": { "types": { "video": true, "image": false, "text": false } } }
}
```

From then on, each new post on the source account that passes the filters is published to the targets. Use `content_filters.hashtags.include` or `exclude` to send only some posts.

### Read post analytics

```bash
GET https://postonce.to/api/public/v1/analytics?days=30
GET https://postonce.to/api/public/v1/posts/{post_id}/analytics
```

Views, likes, comments, shares, and saves per post and per platform for the last 7, 30, or 90 days. Each copy has `views_vs_account_median` (2 means twice the account's usual views), so above- and below-average posts can be compared across accounts of different sizes. `media_url` points at the file that was published, so an agent can watch the winners.

## Notes for Agents

- Publishing is outward-facing. Scheduled posts go out on their own at `publish_at`, and a workflow keeps posting until it is turned off. Use drafts while a post waits for approval, and create workflows only when the user asks for automatic crossposting.
- Instagram needs a Business or Creator account, Facebook posts go to Pages, and TikTok, Instagram, YouTube, and Pinterest need media.
- Views are not outcomes. Join the analytics with signups or sales from the user's own analytics before calling a format a winner.

## Relevant Skills

- **social**: short-form video, staged cadence, and the winning-format search
- **marketing-loops**: the format-finding loop
- **video**: producing the videos it publishes
