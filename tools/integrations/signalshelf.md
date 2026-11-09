# SignalShelf

API for public social media, ad library and local business data: profiles, posts, videos, transcripts and comments on TikTok, Instagram, YouTube, X, Facebook, Pinterest, Telegram and Rumble, plus the Meta, Google and TikTok ad libraries and Google Maps places and reviews. Logged-out public data only. Billed in prepaid credits.

It uses the same `/v1` paths, parameters and JSON shapes as [ScrapeCreators](scrapecreators.md), so a ScrapeCreators recipe runs on SignalShelf by changing the base URL and key. Pick on price, speed and coverage for your endpoints.

> Disclosure: this guide was contributed by SignalShelf's maker.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST, `https://signalshelf.dev`, GET with query parameters |
| MCP | ✓ | Hosted MCP server; setup at [signalshelf.dev/docs/mcp](https://signalshelf.dev/docs/mcp) |
| CLI | - | Use plain HTTP or the MCP server |
| SDK | - | Plain HTTP |

## Authentication

- **Type**: API key in the `x-api-key` header
- **Env var** (convention): `SIGNALSHELF_API_KEY`
- **Get key**: sign up at [signalshelf.dev](https://signalshelf.dev); 1,000 free credits, no card

## Common Agent Operations

### A channel's recent posts

```bash
# TikTok: profile videos, cursor-paged
GET https://signalshelf.dev/v3/tiktok/profile/videos?handle=notionhq
x-api-key: $SIGNALSHELF_API_KEY
# Next page: &max_cursor=<from previous response>

# Instagram: public posts
GET https://signalshelf.dev/v2/instagram/user/posts?handle=notionhq
# Next page: &next_max_id=<from previous response>

# X: a user's recent posts
GET https://signalshelf.dev/v1/twitter/user-tweets?handle=stripe

# YouTube: latest videos
GET https://signalshelf.dev/v1/youtube/channel-videos?handle=stripe
# Next page: &continuationToken=<from previous response>. Shorts: /v1/youtube/channel/shorts
```

Media URLs from TikTok and Instagram expire within hours, so download thumbnails and covers in the same run.

### Ad libraries

```bash
# Meta: find the advertiser's page ID, then its ads
GET https://signalshelf.dev/v1/facebook/adLibrary/search/companies?query=Notion
GET https://signalshelf.dev/v1/facebook/adLibrary/company/ads?pageId=<id>

# Google Ads Transparency Center, by domain
GET https://signalshelf.dev/v1/google/company/ads?domain=notion.so

# TikTok Ads Library, by advertiser name
GET https://signalshelf.dev/v1/tiktok/ad-library/search?advertiser_name=Notion
```

Each ad library endpoint pages with `cursor`. Heavier endpoints cost more than one credit; the [docs](https://signalshelf.dev/docs) list each endpoint's cost.

## Rate Limits and Pricing

- Prepaid credit packs, no subscription; credits don't expire. Most requests cost 1 credit; ad libraries cost 2 and Google search 5. See [pricing](https://signalshelf.dev/pricing).
- Repeat requests for the same data can be served from cache at no charge; the response's `meta` says whether it was cached and when it was fetched.
- Speed comparison with ScrapeCreators, with method and raw data: [benchmark](https://signalshelf.dev/compare/benchmark).

## Usage Rules

- Use it for public posts and ad libraries in competitive research: what a brand publishes, how it performs, and what it advertises.
- Don't use it to build lists of people or to collect personal data. For prospecting, see the sourcing rules in [REGISTRY.md](../REGISTRY.md).
- Don't use the LinkedIn endpoints. This repo doesn't scrape LinkedIn. Read LinkedIn company pages and the LinkedIn Ad Library by hand.

## Relevant Skills

- **reverse-engineer-marketing**: content teardowns per channel and ad library pulls
- **social**: researching what content works in a niche
- **ad-creative**: pulling competitors' active ads to study
- **influencer-marketing**: reviewing a creator's recent posts and engagement
