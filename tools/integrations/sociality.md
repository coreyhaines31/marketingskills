# Sociality.io

Social media management platform covering publishing, engagement, listening, analytics, and competitor tracking across Facebook, Instagram, LinkedIn, TikTok, X, and YouTube. Exposes both a REST API and a hosted MCP server, so agents can pull owned-account performance and competitor benchmarks directly.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API v1 — accounts, posts, conversations, mentions, analytics, competitor tracks |
| MCP | ✓ | Hosted server at `https://api.sociality.io/mcp` with managed OAuth |
| CLI | - | Not available |
| SDK | - | No official SDK; `curl` examples in the API docs |

## Authentication

### REST API

- **Type**: API key (Bearer token)
- **Header**: `Authorization: Bearer {api_key}`
- **Get key**: Create one in the [management panel](https://app.sociality.io/management/brands/)
- **Base URL**: `https://api.sociality.io/v1`

### MCP

- **Type**: OAuth 2.1 (authorization code + PKCE, dynamic client registration)
- **Scope**: `mcp:use`
- **Flow**: Handled by the client — no API key to paste, no OAuth proxy to run

## MCP Setup

```bash
claude mcp add --transport http sociality https://api.sociality.io/mcp
```

The same URL works in any MCP-capable client. In Claude.ai, go to **Settings → Connectors → Add custom connector** and paste `https://api.sociality.io/mcp`, then complete the OAuth handshake.

## MCP Tools

| Tool | Returns |
|------|---------|
| `social_accounts_list` | Connected accounts you have access to; filter by `channel` or `name` |
| `social_account_stats_list` | Owned-account insights for a period — followers, views, engagement rate, likes, comments |
| `social_account_posts_list` | Published posts and stories with post-level metrics; filter by `type` |
| `social_competitors_list` | Tracked competitor/public profiles; filter by `channel` or `name` |
| `social_competitor_stats_list` | Public stats for a tracked profile — followers, growth, interactions |
| `social_competitor_posts_list` | A competitor's published posts with engagement metrics |
| `social_competitors_create` | Start tracking a competitor by profile URL |

Stats tools take `since` / `until` (`YYYY-MM-DD`) and an optional `period` of `day`, `week`, or `month`. Post-level metrics lag behind real time by a channel-specific interval — a request through today's date returns whatever is available, not an error.

### Example agent prompts

```
> "Compare engagement rate across our Instagram, LinkedIn, and TikTok accounts
   for the last 30 days, and tell me which format is carrying each channel."
```

```
> "Pull our competitors' LinkedIn posts from the last 60 days, normalize
   engagement by follower count, and show where their posting cadence differs
   from ours."
```

## Common Agent Operations

### List connected accounts

```bash
GET https://api.sociality.io/v1/accounts

Authorization: Bearer {api_key}
```

### Get account analytics for a period

```bash
GET https://api.sociality.io/v1/account_analytics?account_id={id}&since=2026-07-01&until=2026-07-31
```

Returns the account, a `summary` of metrics for the period, daily `series`, and the `posts` published in the window.

### Schedule or publish a post

```bash
POST https://api.sociality.io/v1/posts
Content-Type: application/json

{
  "account_id": "{account_id}",
  "type": "photo",
  "text": "Hello World",
  "media": ["https://example.com/image.png"],
  "published_at": "2026-09-01 10:00:00"
}
```

Set `is_publish_now: true` to publish immediately instead of scheduling. Supported types: `status`, `photo`, `video`, `gif`, `carousel`, `story`, `reels`.

### List tracked competitors

```bash
GET https://api.sociality.io/v1/tracks
```

### Get competitor analytics

```bash
GET https://api.sociality.io/v1/track_analytics?track_id[]={track_id}&since=2026-07-01&until=2026-07-31
```

### Pull brand mentions from listening

```bash
GET https://api.sociality.io/v1/mentions
```

Keywords are managed at `/v1/keywords`.

### Read engagement inbox conversations

```bash
GET https://api.sociality.io/v1/conversations
```

Individual messages are at `/v1/conversation_items`; `/v1/conversation_items/{id}/action` handles replies and status changes.

## Key Metrics

### Account Analytics (`summary`)
- `followers` — follower count at period end
- `posts` / `posts_by_type` — volume, broken out by format (photo, video, carousel, reels)
- `interactions` / `interactions_by_type` — likes, comments, saves
- `interactions_by_source` — organic vs. paid split
- `engagement_rate` — interactions relative to audience
- `video_views` / `video_views_by_source` — organic vs. paid video views

### Track Analytics (`summary`)
- `followers` and `followers_growth` — competitor audience size and net change
- `posts` — competitor posting volume in the period
- `interactions` / `interactions_by_type` — reactions, comments, shares

Both endpoints also return a daily `series` for each metric, which is what you want for trend and cadence analysis rather than point-in-time snapshots.

## When to Use

- Reporting on owned social performance across several channels without exporting CSVs from each platform
- Normalizing competitor engagement against your own to find content gaps
- Auditing which formats and posting cadences actually earn engagement
- Scheduling or publishing posts programmatically from an agent workflow
- Pulling brand mentions and engagement-inbox volume into a broader marketing analysis

Sociality covers owned analytics and competitor tracking in one place, where [buffer.md](buffer.md) is scheduling-first. Use Buffer when the job is queue management; use Sociality when the job is measurement or benchmarking.

## Rate Limits

- No published request quota; `429 Too Many Requests` signals you are going too fast
- Retry with exponential backoff on `429`
- MCP access is metered in credits by plan

## Relevant Skills

- social
- content-strategy
- competitor-profiling
- competitors
- analytics

## Sources

- [Sociality.io API reference](https://docs.sociality.io/)
- [Quick start / API keys](https://docs.sociality.io/quick-start)
- [MCP server overview](https://sociality.io/mcp)
