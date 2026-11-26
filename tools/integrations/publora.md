# Publora

Draft, schedule, and publish posts to LinkedIn, X, Instagram, Threads, TikTok, YouTube, Facebook Pages, Bluesky, Mastodon, and Telegram through one REST API or a remote MCP server. Long X and Threads text is split into a thread automatically. Agencies get separate client workspaces with client review by link.

Facts below were checked against the [OpenAPI spec](https://docs.publora.com/openapi.json) and the [API docs](https://docs.publora.com) on 2026-11-26.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST, `https://api.publora.com/api/v1`, JSON bodies |
| MCP | ✓ | Remote server at `https://mcp.publora.com/mcp`: OAuth sign-in, or the API key as a Bearer token |
| CLI | - | Use the API or MCP |
| SDK | - | Plain HTTP |

## Authentication

- **Type**: API key in a header: `x-publora-key: {api_key}` (keys start with `sk_`)
- **Env var** (convention): `PUBLORA_API_KEY`
- **Get key**: dashboard, **API** in the sidebar, **Generate API Key**. The key is shown once and does not expire.
- **MCP**: Claude users connect from [claude.ai/directory/publora](https://claude.ai/directory/publora). Claude Code: `claude mcp add --transport http publora https://mcp.publora.com/mcp`, then authenticate in `/mcp`. Other clients send `Authorization: Bearer {api_key}`.
- **Plan limits**: the free Starter plan allows 3 accounts, 15 posts a month, 3 scheduled posts at a time, scheduling up to 7 days ahead, and every platform except X. Read the current limits with `GET /account-context`.

## Common Agent Operations

### List connected accounts

```bash
GET https://api.publora.com/api/v1/platform-connections
x-publora-key: $PUBLORA_API_KEY
```

Each connection has a `platformId` such as `linkedin-ABC123`; use it in `platforms` when posting. `connectionStatus: reconnect_required` and `tokenStatus: expired` mean the user must reconnect that account in the dashboard before it can publish.

### Create a draft, schedule, or publish now

```bash
POST https://api.publora.com/api/v1/create-post
Content-Type: application/json
Idempotency-Key: launch-2026-12-01

{
  "content": "We shipped scheduled exports today.",
  "platforms": ["linkedin-ABC123", "twitter-123456", "threads-789012"],
  "scheduledTime": "2026-12-01T14:00:00Z",
  "mediaUrls": ["https://cdn.example.com/exports.png"],
  "firstComments": [{ "text": "Changelog: https://example.com/changelog", "platforms": ["linkedin"] }]
}
```

- Omit `scheduledTime` to save a draft. Send `"publishNow": true` instead to publish at once.
- `mediaUrls` takes up to 10 public HTTPS files that Publora downloads (25 MB per image, 150 MB per video). Instagram, TikTok, and YouTube need media before scheduling. Local files go through `POST /get-upload-url`, a PUT to the signed URL, then `POST /complete-media/{mediaFileId}`.
- `platformSettings` holds per-platform options, for example `youtube.title` and `privacy`, `instagram.videoType` (`REELS` or `STORIES`), `tiktok.viewerSetting`.
- `firstComments` posts up to three comments under the published post on LinkedIn, X, Threads, Bluesky, and Mastodon.
- Repeating a request with the same `Idempotency-Key` and body within 24 hours returns the first result instead of posting twice.

The response has the `postGroupId` used by every follow-up call.

### Check what published

```bash
GET https://api.publora.com/api/v1/get-post/{postGroupId}
GET https://api.publora.com/api/v1/post-logs/{postGroupId}
```

`get-post` returns the overall `status` (`draft`, `scheduled`, `published`, `failed`, `partially_published`) and, per account, `status`, `postedId`, `permalink`, and the error code if it failed. `post-logs` lists each publish attempt, retry, success, and failure from the last 90 days.

### Change, unschedule, or delete

```bash
PUT https://api.publora.com/api/v1/update-post/{postGroupId}
{ "status": "draft" }

DELETE https://api.publora.com/api/v1/delete-post/{postGroupId}
```

`update-post` edits text, accounts, time, settings, or comments of a draft or scheduled post. A `platforms` array replaces the stored list, and `mediaUrls` are added to the media already attached.

### Get notified when a post goes out

```bash
POST https://api.publora.com/api/v1/webhooks
{ "name": "Post status", "url": "https://example.com/hooks/publora", "events": ["post.published", "post.failed"] }
```

Events: `post.scheduled`, `post.published`, `post.failed`, `post.demoted` (returned to draft). Deliveries are signed with HMAC-SHA256 in `X-Publora-Signature`. The signing secret is returned only when the webhook is created. Webhooks are part of the Pro plan.

### Read engagement

LinkedIn post and account analytics: `POST /linkedin-post-statistics`, `POST /linkedin-account-statistics`, `POST /linkedin-followers`. Mastodon and Bluesky counters: `POST /post-statistics`, `POST /profile-statistics`.

## Notes for Agents

- Publishing is outward-facing. Scheduled posts go out on their own at `scheduledTime`, and `publishNow` posts immediately. Keep a post as a draft until the user approves the text, accounts, and time.
- Copy `platformId` values from `platform-connections` exactly; never build them by hand.
- Times are ISO 8601 in UTC (`Z`) or with an explicit offset. Ask for the user's time zone before scheduling.
- Errors come back as `{ "error": "...", "code": "..." }`. Match on `code`, for example `POST_LIMIT_REACHED` when the plan's monthly allowance is used up.
- Media URLs share a limit of 60 per hour (`429 MEDIA_URL_RATE_LIMITED` with `Retry-After`).

## Relevant Skills

- **social**: what to post and when
- **launch**: launch-day posting across networks
