# ScrapeCreators

API for public social media and ad library data: profiles, posts, videos, transcripts, and comments on TikTok, Instagram, YouTube, X, Facebook, Reddit, Threads, Bluesky, and Pinterest, plus the Meta, Google, TikTok, and LinkedIn ad libraries. One key and one response style across platforms, billed in credits.

Facts below were checked against the [OpenAPI spec](https://docs.scrapecreators.com/openapi.json) and [docs](https://docs.scrapecreators.com/llms.txt) on 2026-10-30.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST, `https://api.scrapecreators.com`, GET with query parameters |
| MCP | ✓ | Official MCP server; see their [integrations docs](https://docs.scrapecreators.com/integrations/overview) for setup |
| CLI | ✓ | Official CLI covering most endpoints, which can also run as an MCP server |
| SDK | - | Plain HTTP; Apify actors are also published |

## Authentication

- **Type**: API key in the `x-api-key` header
- **Env var** (convention): `SCRAPECREATORS_API_KEY`
- **Get key**: sign up at [scrapecreators.com](https://scrapecreators.com)
- **Credit balance**: `GET /v1/credit-balance`

## Common Agent Operations

### A channel's recent posts

```bash
# YouTube: latest videos (title, thumbnail, views, publish date, duration)
GET https://api.scrapecreators.com/v1/youtube/channel-videos?handle=stripe&sort=latest
x-api-key: $SCRAPECREATORS_API_KEY
# Next page: &continuationToken=<from previous response>. Shorts: /v1/youtube/channel/shorts

# TikTok: profile videos, cursor-paged
GET https://api.scrapecreators.com/v3/tiktok/profile/videos?handle=notionhq&trim=true
# Next page: &max_cursor=<from previous response>

# Instagram: public posts
GET https://api.scrapecreators.com/v2/instagram/user/posts?handle=notionhq&trim=true
# Next page: &next_max_id=<from previous response>

# X: a user's recent posts
GET https://api.scrapecreators.com/v1/twitter/user-tweets?handle=stripe&trim=true
```

`trim=true` returns a smaller response where the endpoint supports it. Media URLs from TikTok and Instagram expire within hours, so download thumbnails and covers in the same run.

### Reddit mentions

```bash
GET https://api.scrapecreators.com/v1/reddit/search?query=notion&sort=top&timeframe=year&trim=true
# Next page: &after=<from previous response>
```

### Ad libraries

```bash
# Meta: find the advertiser's page ID, then its ads
GET https://api.scrapecreators.com/v1/facebook/adLibrary/search/companies?query=Notion
GET https://api.scrapecreators.com/v1/facebook/adLibrary/company/ads?pageId=<id>&status=ACTIVE&trim=true

# Google Ads Transparency Center, by domain
GET https://api.scrapecreators.com/v1/google/company/ads?domain=notion.so

# TikTok Ads Library, by advertiser name
GET https://api.scrapecreators.com/v1/tiktok/ad-library/search?advertiser_name=Notion
```

Each ad library endpoint pages with `cursor`. Check the endpoint's doc page for its date and region filters before calling it.

## Rate Limits and Pricing

- Concurrency is set per account; see their [rate limit policy](https://scrapecreators.com/no-rate-limits).
- Billed in prepaid credits, mostly per request; some endpoints cost more. See [pricing](https://scrapecreators.com/#pricing) and each endpoint's doc page for its credit cost.

## Usage Rules

- Use it for public posts and ad libraries in competitive research: what a brand publishes, how it performs, and what it advertises.
- Don't use it to build lists of people or to collect personal data. For prospecting, see the sourcing rules in [REGISTRY.md](../REGISTRY.md).
- Don't use the LinkedIn endpoints. This repo doesn't scrape LinkedIn. Read LinkedIn company pages and the LinkedIn Ad Library by hand.

## Relevant Skills

- **reverse-engineer-marketing**: content teardowns per channel and ad library pulls
- **social**: researching what content works in a niche
- **ad-creative**: pulling competitors' active ads to study
- **influencer-marketing**: reviewing a creator's recent posts and engagement
