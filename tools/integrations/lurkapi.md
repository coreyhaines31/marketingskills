# LurkAPI

API and remote MCP server for public social media and ad library data: profiles, posts, comments, and video transcripts on TikTok, Instagram, YouTube, X, Facebook, Reddit, Threads, Bluesky, and Telegram, plus the Meta, Google, TikTok, and LinkedIn ad libraries. One key, GET requests with query parameters, JSON back, billed in credits.

Facts below were checked against the [OpenAPI spec](https://lurkapi.com/openapi.json) and [docs](https://lurkapi.com/llms.txt) on 2026-11-04.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST, `https://api.lurkapi.com`, GET with query parameters |
| MCP | ✓ | Official remote server at `https://api.lurkapi.com/mcp` (Streamable HTTP), one tool per endpoint; see the [MCP setup docs](https://lurkapi.com/docs#claude) |
| CLI | - | Not available |
| SDK | - | Plain HTTP; each endpoint's doc page has curl, Node.js, Python, Go, PHP, and Ruby samples |

## Authentication

- **Type**: API key in the `x-api-key` header (`Authorization: Bearer` also works)
- **Env var** (convention): `LURKAPI_API_KEY`
- **Get key**: sign in at [lurkapi.com/login](https://lurkapi.com/login) (Google or an emailed code) and copy a key from the dashboard
- **MCP**: interactive clients sign in through the browser (OAuth), so no key is pasted; unattended runs can send the `x-api-key` header instead
- **Credit balance**: `GET /v1/account/credit-balance` (free)

## Common Agent Operations

### A channel's recent posts

```bash
# YouTube: latest videos (title, thumbnail, views, publish date, length)
GET https://api.lurkapi.com/v1/youtube/channel-videos?handle=stripe&sort=latest
x-api-key: $LURKAPI_API_KEY
# Next page: &continuationToken=<from previous response>. Shorts: /v1/youtube/channel/shorts

# TikTok: profile videos, returned as videos[]
GET https://api.lurkapi.com/v3/tiktok/profile/videos?handle=notionhq
# Next page: &max_cursor=<from previous response>

# Instagram: public posts (takes username, not handle)
GET https://api.lurkapi.com/v2/instagram/user/posts?username=notionhq
# Next page: &after=<end_cursor from previous response>

# X: a user's recent posts
GET https://api.lurkapi.com/v1/twitter/user-tweets?handle=stripe
# Next page: &cursor=<from previous response>
```

Media URLs from TikTok and Instagram are signed CDN links that expire, so download thumbnails and covers in the same run.

### Video transcripts

```bash
GET https://api.lurkapi.com/v1/youtube/video/transcript?url=<video URL>
GET https://api.lurkapi.com/v1/tiktok/video/transcript?url=<video URL>
GET https://api.lurkapi.com/v2/instagram/media/transcript?url=<post or reel URL>
```

TikTok and Instagram transcripts cost 1 credit, or 2 when the video has no captions and speech-to-text runs. Pass `max_credits=1` to never pay for speech-to-text.

### Reddit mentions

```bash
GET https://api.lurkapi.com/v1/reddit/search?query=notion&sort=top&timeframe=year
# Next page: &after=<from previous response>
```

### Ad libraries

```bash
# Meta: find the advertiser's page ID, then its ads
GET https://api.lurkapi.com/v1/facebook/adLibrary/search/companies?query=Notion
GET https://api.lurkapi.com/v1/facebook/adLibrary/company/ads?pageId=<page_id>&status=active&trim=true
# status defaults to all (running and stopped); trim=true drops image and video URLs and keeps all text

# Google Ads Transparency Center, by domain
GET https://api.lurkapi.com/v1/google/company/ads?domain=notion.so

# TikTok Ad Library (ads shown in the EU, EEA, UK, Switzerland, and Turkey), by advertiser name
GET https://api.lurkapi.com/v1/tiktok/ad-library/search?advertiser_name=Notion
```

Each ad library endpoint pages with `cursor`; keep the other parameters the same. Check the endpoint's doc page for its date, region, platform, and format filters before calling it.

### Through MCP

```bash
# Claude Code (then /mcp to sign in)
claude mcp add --transport http lurkapi https://api.lurkapi.com/mcp
```

Tools are named `<platform>_<endpoint>`, e.g. `facebook_company_ads`, `youtube_transcript`, `reddit_search`. `https://api.lurkapi.com/mcp?platforms=facebook,google,tiktok` lists only those platforms' tools.

## Overlap with ScrapeCreators

Many LurkAPI endpoints answer at the same path as [ScrapeCreators](scrapecreators.md), with the same `x-api-key` header. Some take different parameters or return a different shape (Instagram posts and reels take `username`; TikTok searches and profile videos return `videos[]`), so check field names on the endpoint's doc page before reusing a parser. The [switching guide](https://lurkapi.com/docs/switching) lists the differences.

## Rate Limits and Pricing

- 50 requests per 10 seconds per account; over it, `429` with a `retry-after` header.
- Prepaid credit packs that don't expire, no subscription. Most calls cost 1 credit; transcripts that need speech-to-text and some web page fetches cost more. See [pricing](https://lurkapi.com/pricing) and each endpoint's doc page for its credit cost.
- New accounts get 100 free credits with no card, and once a day a balance under 25 is topped back up to 25.
- Invalid parameters, `401`/`402`/`429` rejections, and `5xx` errors are free; a `not_found` is charged.

## Usage Rules

- Use it for public posts, transcripts, and ad libraries in competitive research: what a brand publishes, how it performs, and what it advertises.
- It reads public pages only. It doesn't log in to accounts, can't see private profiles or messages, and can't post or message anyone.
- Don't use it to build lists of people or to collect personal data. For prospecting, see the sourcing rules in [REGISTRY.md](../REGISTRY.md).
- Don't use the LinkedIn endpoints. This repo doesn't scrape LinkedIn. Read LinkedIn company pages and the LinkedIn Ad Library by hand.

## Relevant Skills

- **reverse-engineer-marketing**: content teardowns per channel, ad library pulls, and transcripts of a team's videos
- **social**: researching what content works in a niche
- **ad-creative**: pulling competitors' active ads to study
- **influencer-marketing**: reviewing a creator's recent posts and engagement
