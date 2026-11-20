# SocialToAI

Hosted MCP server and REST API that reads publicly visible social media content (posts, comments, profiles, and trending lists) on 18 platforms: Reddit, X, TikTok, Instagram, YouTube, Facebook, LinkedIn, Threads, Telegram, Pinterest, and the Chinese platforms Xiaohongshu (RedNote), Douyin, Weibo, Bilibili, Zhihu, Kuaishou, WeChat Articles, and WeChat Channels. Billed per call from prepaid credits; failed calls are free.

> **Disclosure:** this guide was contributed by the SocialToAI team. SocialToAI is a young product (the current version went live in October 2026), so confirm coverage, prices, and each platform's terms before relying on it. Facts below were checked against [socialtoai.com/llms.txt](https://socialtoai.com/llms.txt), the [API docs](https://socialtoai.com/docs.md), and the [MCP tool list](https://socialtoai.com/docs/mcp/tools.md) on 2026-10-29.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST over HTTPS, one route per action (`POST /v1/search`, `/v1/comments`, …) and per ready-made tool (`POST /v1/tools/brand_buzz`, …). [OpenAPI](https://socialtoai.com/openapi.json) |
| MCP | ✓ | Hosted, Streamable HTTP: `https://mcp.socialtoai.com/mcp`. 18 tools: 16 that read, plus `watch` and `watch_news` for daily or weekly watches that deliver only what is new. OAuth sign-in, or an API key in a header |
| CLI | - | None; use MCP or HTTP |
| SDK | - | None; plain HTTP with any client |
| Agent skill | ✓ | One skill file: `https://socialtoai.com/skills/socialtoai/SKILL.md`; also a Claude Code plugin marketplace at `socialtoai/socialtoai-skills` |

## Authentication

- **Interactive MCP:** OAuth. ChatGPT, Claude (web, desktop, mobile), Claude Code, Codex, and Cursor add the MCP URL, then sign in (Google or an emailed code) and press Allow; no key is copied. Signing in creates the account; the connection shows up in the console like a key and can be capped or revoked.
- **Scripts, CI, and clients that only take a header:** an API key from the [console](https://socialtoai.com/console/keys/?utm_source=marketingskills&utm_medium=directory), kept in an env var (`SOCIALTOAI_KEY` by convention) and sent as `Authorization: Bearer $SOCIALTOAI_KEY` or `X-API-Key`. Keys start with `stai_live_` and are shown once. Keep them in a secret manager, never in the repo, client-side code, or a URL: a request with a key in the address is refused.
- **No key needed** for `capabilities`, `find`, and the OpenAPI document (60 requests a minute per IP).

## When to Use SocialToAI vs. Other Options

SocialToAI is one way to read public posts and comments. Follow the user's explicit tool choice first; otherwise prefer a free path or an integration the user already has that meets the task's requirements. This table covers reading other people's content; for publishing to your own accounts, see [buffer](buffer.md).

| Scenario | Options |
|----------|---------|
| A handful of Reddit, Hacker News, or Bluesky searches | The free public endpoints in the social skill's [listening reference](../../skills/social/references/listening.md); no account |
| YouTube videos, comments, and channel stats within a daily quota | The YouTube Data API (free quota, Google Cloud key) |
| X posts at volume with an X developer account | X's official API (paid per use) |
| Posts, comments, profiles, or trending lists across several platforms from one agent, without platform accounts | SocialToAI; [◆ AIsa](aisa.md) (X, Instagram, Reddit, Pinterest, YouTube); [Glasser](glasser.md) (social providers in its broker catalog) |
| Xiaohongshu, Douyin, Weibo, Bilibili, Zhihu, Kuaishou, or WeChat | SocialToAI; Glasser (through its Chinese-platforms provider); the platform's own creator marketplace for rates and audience data (see [chinese-platforms.md](../../skills/social/references/chinese-platforms.md)) |
| A specific site, or a platform none of these cover | [Apify](apify.md) Store Actors (per-Actor pricing; check the Actor's and the platform's terms) |
| Brand-mention summaries, comment topic analysis, or creator search done server-side in one request | SocialToAI's ready-made tools (`brand_buzz`, `comment_insights`, `find_creators`); or fetch raw posts with any option above and analyze them in the agent |
| Your own accounts' analytics | The platform's native analytics, or your scheduling tool |

## Setup

### 1. Connect over MCP

```bash
# Claude Code
claude mcp add --transport http socialtoai https://mcp.socialtoai.com/mcp
# then run /mcp, pick socialtoai, sign in, and press Allow

# Codex
codex mcp add socialtoai --url https://mcp.socialtoai.com/mcp
```

ChatGPT, the Claude apps, and Cursor take the same URL as a custom connector or MCP server. Client-specific steps: [socialtoai.com/mcp](https://socialtoai.com/mcp.md).

### 2. Or with an API key (headless agents, CI)

`.mcp.json` for Claude Code:

```json
{
  "mcpServers": {
    "socialtoai": {
      "type": "http",
      "url": "https://mcp.socialtoai.com/mcp",
      "headers": { "Authorization": "Bearer ${SOCIALTOAI_KEY}" }
    }
  }
}
```

### 3. Verify

- The free `account` tool returns the plan, the credit balance, and today's spend and limit.
- The free `capabilities` tool (or `GET https://api.socialtoai.com/v1/capabilities?platform=reddit`, no key) lists each action and platform-specific operation with its parameters and credits per call.

## How the MCP Server Works

| Tool | What it does | Billed |
|------|--------------|--------|
| `search`, `trending`, `detail`, `comments`, `user_profile`, `user_posts` | The six actions; each takes `platform` (one or a list) plus that platform's parameters, and answers in one format | 1–12 credits per call, by platform |
| `find` | Describe a job in plain words (English or Chinese); returns matching calls with parameters and price | Free |
| `capabilities` | Every action and operation per platform, with parameters, page size, credits, and fields the platform can't give | Free |
| `call` | Runs a platform-specific operation (`op`, e.g. `douyin.keyword_history`) that the six actions don't cover | 1–24 credits |
| `account` | Balance, today's spend, daily limit | Free |
| `brand_buzz` | What people say about a brand or product on each platform: share of each attitude, what is mentioned most, top posts with links | Quoted before a costly run |
| `comment_insights` | Topics and their shares in the comments under 1–20 posts, plus questions, buying intent, and complaints, quoted | Quoted before a costly run |
| `find_creators` | Creators on one platform for a niche, with size, recent posts, and fit against a brief | Quoted before a costly run |
| `account_watch` | What a set of accounts posted lately and which posts beat each account's usual | Quoted before a costly run |
| `creator_card` | One creator's accounts across platforms, with numbers and how strong the match evidence is | Quoted before a costly run |
| `research` | Runs `batch_stats` (current numbers for a list of links) and `viral_finder` (posts that beat their author's usual) | Quoted before a costly run |

- `max_cost_credits` on any call refuses it, free, if it would cost more; `confirm: false` on a ready-made tool returns the plan and price without running.
- Every answer carries `billing.display`, one sentence with the credits charged and the balance, for the agent to repeat to the user.
- Every charged tool takes `handle`: it re-reads an earlier result for free.

## Common Agent Operations

### Search posts

```http
POST https://api.socialtoai.com/v1/search
Authorization: Bearer {key}
Content-Type: application/json
Idempotency-Key: {uuid}

{ "platform": "reddit", "query": "standing desk", "sort": "latest", "published_within": "week" }
```

The answer is an envelope with `status` (`ok`, `empty`, `error`, `not_supported`, `timeout`, `skipped`), `items` in one format across platforms (`text`, `url`, `published_at`, `author`, `metrics.likes/comments/shares/collects/views/reposts`), `unavailable` (fields this platform can't give, always `null`), `page.cursor`, and `billing`.

### Read the comments under a post

```json
POST https://api.socialtoai.com/v1/comments
{ "platform": "xiaohongshu", "url": "<the note link, whole, as shared>", "limit": 50 }
```

`limit` fetches pages one after another in one request, each page charged as a call; pages not needed cost nothing. Commenters come back as anonymous labels, stable within one answer.

### Brand mentions in one request

```bash
curl https://api.socialtoai.com/v1/tools/brand_buzz \
  -H "Authorization: Bearer $SOCIALTOAI_KEY" \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{"brand":"Notion","about":"a note-taking and workspace app","platforms":["x"],"window":"30d","scale":"small","max_cost_credits":50}'
```

### Retry safely

- The same `Idempotency-Key` with the same parameters returns the first result and is not charged twice.
- `timeout` means the result is unknown; SocialToAI does not retry on its own and does not charge. Send a new request only if the user still needs it.
- Errors carry `fix` (what to change) and are never charged.

## Example Workflows

These were run on the live service on 2026-10-18; the full calls and answers are on the linked pages.

```
> "What do people complain about with standing desks on Reddit and X?"
```
Agent uses `search` on Reddit and X, then `comment_insights` on the three most-discussed Reddit threads: 3 requests, 191 items, 88 credits ([recorded run](https://socialtoai.com/docs/guides/read-reddit-and-x-for-product-complaints.md)).

```
> "What are people on Xiaohongshu saying about camping coffee?"
```
Agent uses `brand_buzz` with `brand: "露营咖啡"`, `platforms: ["xiaohongshu"]`, `window: "90d"`: 1 request, 13 notes, 36 credits ([recorded run](https://socialtoai.com/docs/guides/read-xiaohongshu-notes-on-a-topic.md)).

```
> "Find home-organisation creators on Douyin for a collaboration"
```
Agent uses `find_creators` with `query: "家居收纳"`: 1 request, 20 accounts from the platform's creator marketplace, 9 credits ([recorded run](https://socialtoai.com/docs/guides/find-creators-on-douyin.md)).

## Limitations

- **Read-only, public content only.** No posting, no DMs, no private or logged-in-only content.
- **Fields differ by platform.** `unavailable` lists what a platform can't give: for example, Reddit search returns no like count, and Xiaohongshu returns no view counts.
- **Not every action on every platform.** For example, Facebook and Telegram have no keyword search; `capabilities` is the current list.
- **Search returns what the platform's search returns**: a sample, ordered by the platform, not an exhaustive archive. Counts are snapshots at `fetched_at`.
- **Commenters are anonymized**, so the output does not suit building contact lists.
- **Vendor dependency.** If SocialToAI is down, every platform is unavailable through this path; live state is on the [status page](https://socialtoai.com/status.md).

## Pricing

Prepaid credits, no subscription: $10 = 3,000 credits, $50 = 20,000, $200 = 100,000, or any whole amount from $10 to $2,000. Most calls cost 2 credits (range 1–24); search on Xiaohongshu, Douyin, Kuaishou, WeChat, and WeChat Channels costs 12. Sign-up includes 100 free credits, no card. Credits never expire; purchases are not refunded. Card or Alipay, in USD. Every call's credits: [pricing.md](https://socialtoai.com/pricing.md).

- Charged: successful calls, including a search that ran and found nothing (`status: "empty"`)
- Not charged: errors, `not_supported`, `timeout`, `skipped`

## Rate Limits

- 5 calls a second per key; 20 a second after the account's first purchase. Over the limit: `rate_limited` with `Retry-After`, not charged
- A new account has a daily limit of 100,000 credits (adjustable in the console); keys can have their own
- One request takes at most 20 platforms or targets

## See Also

- [llms.txt](https://socialtoai.com/llms.txt) — the fact table and every page, for agents
- [MCP tool list](https://socialtoai.com/docs/mcp/tools.md) — each tool's description and parameters as the server lists them
- [Response format](https://socialtoai.com/docs/api/response.md) and [errors](https://socialtoai.com/docs/api/errors.md)
- [Chinese platforms reference](../../skills/social/references/chinese-platforms.md) — search, metrics, and disclosure on Xiaohongshu, Douyin, Weibo, Bilibili, and WeChat

## Relevant Skills

- social (listening, brand mentions, Chinese platforms)
- customer-research (complaints and wishes in Reddit, X, and YouTube comments)
- influencer-marketing (creator search and vetting)
- competitor-profiling (what competitor accounts post and what beats their usual)
- content-strategy (what is taking off in a niche)
