# Adeli

One API and MCP server for publishing, comments, DMs, analytics, and paid ads across many brands' social accounts: Instagram, Facebook, TikTok, YouTube, X, Bluesky, and LinkedIn, plus Meta Ads, TikTok Ads, and LinkedIn Ads. Each brand or client is a separate profile, so one key can run a whole agency roster without mixing accounts.

Facts below were checked against the [full docs corpus](https://www.tryadeli.com/llms.txt), the [API reference](https://www.tryadeli.com/docs/api), and the [OpenAPI spec](https://www.tryadeli.com/docs/openapi.json) on 2026-11-12.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST, `https://app.tryadeli.com/api/v1`, JSON bodies, OpenAPI 3.1 |
| MCP | ✓ | Official remote server at `https://app.tryadeli.com/mcp` (Streamable HTTP). Claude and ChatGPT sign in with OAuth; other clients send the API key. The tools are the REST endpoints, nothing more or less |
| CLI | - | Use the MCP server or plain HTTP |
| SDK | ✓ | `@adeli/sdk` (TypeScript, server-side only: Node 22+, Vercel, Cloudflare Workers) |

## Authentication

- **Type**: Bearer API key: `Authorization: Bearer rk_live_...`
- **Env var** (convention): `ADELI_API_KEY`
- **Get key**: Settings → API keys in the Adeli dashboard. The secret is shown once.
- **Scope**: a key belongs to the organization and reaches every profile in it. There are no per-endpoint scopes. Keep it on a server, never in a browser bundle or a URL.
- **Rate limit**: none in v1, but the providers' own limits apply (YouTube's daily quota, TikTok and LinkedIn throttling return `429`).

## Setup

### Add the MCP server

```bash
claude mcp add --transport http adeli https://app.tryadeli.com/mcp \
  --header "Authorization: Bearer $ADELI_API_KEY"
```

Codex (`~/.codex/config.toml`):

```toml
[mcp_servers.adeli]
url = "https://app.tryadeli.com/mcp"
bearer_token_env_var = "ADELI_API_KEY"
```

Claude.ai, Claude Desktop, and ChatGPT add `https://app.tryadeli.com/mcp` as a custom connector and sign in instead of using a key. Turning off **Let it make changes** during sign-in gives a read-only connection.

### Profiles and accounts

A **profile** is one brand or client. Inside it, each social network is one connected **account**. Nothing defaults to a profile: every profile-scoped call passes `profileId`, or an `accountId` (which names its own profile). A call with neither returns `400 profile_required`.

```bash
GET https://app.tryadeli.com/api/v1/profiles
POST https://app.tryadeli.com/api/v1/profiles     # { "name": "Acme Coffee", "externalId": "client-42" }
GET https://app.tryadeli.com/api/v1/accounts      # every connected account in the organization
```

### Connect a client's account

```bash
POST https://app.tryadeli.com/api/v1/profiles/{profileId}/connect
Content-Type: application/json

{ "platform": "instagram", "redirectUrl": "https://your-app.example/callback" }
```

Returns an `authUrl` and a session ID. The client opens `authUrl` in their own browser and approves access with the network directly. Poll `GET /api/v1/profiles/{profileId}/connect/{sessionId}` until it lands. The `redirectUrl` must be registered first under Settings → OAuth. Ads are separate connections: `meta_ads`, `linkedin_ads`, `tiktok_ads`.

## Common Agent Operations

### Upload media once for several platforms

```bash
POST https://app.tryadeli.com/api/v1/media/uploads
Content-Type: application/json

{
  "profileId": "<profileId>",
  "platforms": ["instagram", "tiktok", "youtube"],
  "files": [{ "clientId": "video", "purpose": "post_media", "contentType": "video/mp4", "size": 18234567, "filename": "hook-test-12.mp4" }]
}
```

Returns an `uploadId` and a signed `url` per file. PUT the raw bytes to `url` with every returned header unchanged (URLs expire after ten minutes), then reference `{ "upload_id": "<uploadId>" }` in the post. Each file must fit the strictest platform listed. A public HTTPS `{ "url": ... }` also works for video.

### Publish or schedule one post to several accounts

```bash
POST https://app.tryadeli.com/api/v1/publications
Content-Type: application/json
Idempotency-Key: 8f6d2b1e-6a1f-4c55-9d0a-5d7c0a2f1e11

{
  "profileId": "<profileId>",
  "content": "3 habits that fixed my sleep",
  "media": [{ "upload_id": "shared/staging/opaque.mp4" }],
  "platforms": [
    { "platform": "instagram", "accountId": "<ig accountId>", "kind": "reel" },
    { "platform": "tiktok", "accountId": "<tiktok accountId>", "options": { "privacy_level": "PUBLIC_TO_EVERYONE", "music_usage_confirmed": true } },
    { "platform": "youtube", "accountId": "<yt accountId>", "options": { "privacy_status": "public", "made_for_kids": false } }
  ],
  "scheduledFor": "2026-11-20T17:00:00-05:00",
  "timeZone": "America/New_York"
}
```

- Omit `scheduledFor` to publish now (`202`), or pass `"draft": true` to save it for review (`201`).
- `platforms[].content` and `platforms[].media` override the shared caption or media for one account, such as a shorter caption for X.
- Every target is validated before anything is written. One invalid target returns `400` and nothing publishes.
- Poll `GET /api/v1/publications/{publicationId}` until `status` is `published`, `partial`, or `failed`. `POST /api/v1/publications/{id}/retry` retries only the failed accounts.
- Drafts and scheduled posts: `GET /api/v1/publications` lists them, `PATCH` reschedules, `POST .../publish` publishes now, and `DELETE` cancels.
- Without an `Idempotency-Key`, a retry after a timeout can publish twice. Check the publication or the post list before retrying.

### Read and reply to comments

```bash
GET  https://app.tryadeli.com/api/v1/comments?platform=tiktok&accountId={accountId}&postId={postId}
POST https://app.tryadeli.com/api/v1/comments
Content-Type: application/json

{ "platform": "tiktok", "accountId": "<accountId>", "postId": "<postId>", "parentId": "<commentId>", "message": "Thank you!" }
```

Comments can also be hidden and deleted (`PATCH` and `DELETE /api/v1/comments/{commentId}`). Provider rules differ: TikTok deletes only the account's own comments, and YouTube holds hidden comments for review.

### Read and send Instagram DMs

```bash
GET  https://app.tryadeli.com/api/v1/messages?platform=instagram&accountId={accountId}
POST https://app.tryadeli.com/api/v1/messages
Content-Type: application/json

{ "platform": "instagram", "accountId": "<accountId>", "recipient": "<instagram-scoped user id>", "text": "Yes, we ship to Canada." }
```

Instagram supports reading and sending text DMs. Facebook and WhatsApp messages arrive by webhook. WhatsApp sends approved templates only. TikTok and YouTube have no DM API.

### Get comments and DMs as they arrive

```bash
POST https://app.tryadeli.com/api/v1/webhooks
Content-Type: application/json

{ "profileId": "<profileId>", "url": "https://your-app.example/webhooks/adeli", "events": ["comment.created", "message.created"], "platform": "instagram" }
```

Events: `comment.created` (Instagram, TikTok), `message.created` (Instagram, Facebook, WhatsApp), `message.postback` (Instagram). Payloads are signed. `POST /api/v1/webhooks/{id}/test` sends a test event.

### Read analytics

```bash
GET https://app.tryadeli.com/api/v1/analytics/tiktok/account-insights?accountId={accountId}
GET https://app.tryadeli.com/api/v1/analytics/tiktok/video-insights?accountId={accountId}&videoIds={videoId}
GET https://app.tryadeli.com/api/v1/analytics/youtube/video-insights?accountId={accountId}
GET https://app.tryadeli.com/api/v1/analytics/linkedin/post-insights?accountId={accountId}
```

Analytics are per network and not normalized, since the networks measure different things. TikTok and YouTube give per-post watch time and retention. LinkedIn has account and post insights. Instagram and Facebook insights depend on the permissions the connection was granted, and Instagram per-post insights are not available.

### Run paid ads

```bash
GET https://app.tryadeli.com/api/v1/ads/accounts?accountId={metaAdsAccountId}
GET https://app.tryadeli.com/api/v1/ads/tree?adAccountId=act_1234567890&since=2026-11-01&until=2026-11-07&accountId={metaAdsAccountId}
GET https://app.tryadeli.com/api/v1/ads/insights?adAccountId=act_1234567890&attributionWindows=7d_click,1d_view&accountId={metaAdsAccountId}
```

Boost a Page post as a new campaign, created **paused**:

```bash
POST https://app.tryadeli.com/api/v1/ads/campaigns?accountId={metaAdsAccountId}
Content-Type: application/json
Idempotency-Key: fall-launch-boost

{ "adAccountId": "act_1234567890", "pagePostId": "987654321098765", "dailyBudget": 25, "startDate": "2026-11-20", "endDate": "2026-11-27", "campaignName": "Fall launch" }
```

- The full Meta body also takes an objective, a lifetime budget, a bid strategy, targeting (`GET /api/v1/ads/targeting`, `POST /api/v1/ads/reach-estimate`), and new image, video, or carousel creative. `validateOnly: true` has Meta check it without creating anything.
- LinkedIn campaigns sponsor an existing Page post and are created as drafts. TikTok campaigns (campaign, ad group, and video ad) are created disabled, and TikTok reports ad metrics a few hours late.
- Insights break down by age, gender, placement, and device, with ROAS and cost per result. `GET /api/v1/ads/leads` returns Meta lead form submissions.
- Nothing spends until `PUT /api/v1/ads/status` sets an object to `ACTIVE`.

## Notes for Agents

- Publishing, replying, messaging, and ads act on a real brand's real accounts. Ask before calling `create_post`, `create_publication`, `send_message`, or any ads create tool, and save drafts (`"draft": true`) while a post waits for approval.
- Never set ad status to `ACTIVE` unless the user has confirmed the budget and dates in the conversation. It starts spending money. A Meta ad account, once created, cannot be closed through the API.
- For YouTube, ask the user for `privacy_status` and `made_for_kids`; never choose them for the user.
- Reads that span several accounts can return `207` with `status: "partial"`. The records that loaded are valid; check `errors` before treating the list as complete.
- An account with `connectionStatus` other than `connected` has to be reconnected by the client through the connect flow.
- Posting to X needs a paid Adeli plan; the free tier is capped at 10 posts in total.

## Links

- [Docs](https://www.tryadeli.com/docs)
- [Quickstart](https://www.tryadeli.com/docs/quickstart)
- [MCP server](https://www.tryadeli.com/docs/mcp) and [MCP tools](https://www.tryadeli.com/docs/mcp/tools)
- [API reference](https://www.tryadeli.com/docs/api)
- [OpenAPI spec](https://www.tryadeli.com/docs/openapi.json)
- [Full docs as one text file for agents](https://www.tryadeli.com/llms.txt)

## Relevant Skills

- **social**: publishing from an agent, cadence, and the short-form format search
- **ads**: campaign structure, budgets, and testing on Meta and LinkedIn
- **ad-creative**: the creative its ads run
- **video**: producing the videos it publishes
