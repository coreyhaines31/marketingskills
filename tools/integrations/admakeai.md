# AdMakeAI

Ad creative tool for Meta and TikTok advertisers: generates ad images in Meta placement ratios and UGC-style video ads from a product photo or a brief, pulls an advertiser's live ads from the Meta Ad Library, and drafts Meta campaigns. Billed in credits.

Facts below were checked against the [API docs](https://admakeai.com/api/docs) and [pricing](https://admakeai.com/pricing) on 2026-11-09.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST, `https://admakeai.com/api/v1/<tool>`, POST with a JSON body; the same tools as the MCP server |
| MCP | ✓ | Official hosted server at `https://admakeai.com/api/mcp` (Streamable HTTP, OAuth or API key) |
| CLI | - | Not available |
| SDK | - | Plain HTTP |

## Authentication

- **Type**: API key in the `x-api-key` header (or `Authorization: Bearer <key>`); MCP clients can sign in with OAuth instead
- **Env var** (convention): `ADMAKEAI_API_KEY`
- **Get key**: Dashboard → Integrations → API (`https://admakeai.com/dashboard/integrations/api`)
- **OAuth scopes**: `mcp:read` (account, projects, research, analytics), `mcp:write` (generation, ad sets, campaign drafts), `mcp:publish` (pause and resume live ads). A connection approved without `mcp:publish` never lists those tools.

## MCP Server Setup

### Claude Code

```bash
claude mcp add --transport http admakeai https://admakeai.com/api/mcp
```

Run `/mcp` to sign in. Setup for Claude, ChatGPT, Cursor and VS Code is at [admakeai.com/connect](https://admakeai.com/connect).

## Common Agent Operations

Every generation belongs to a project (a brand and its brief), so list projects before generating.

### Credits and projects

```bash
curl -X POST https://admakeai.com/api/v1/user__getCredits \
  -H "x-api-key: $ADMAKEAI_API_KEY"

curl -X POST https://admakeai.com/api/v1/adResearch__listProjects \
  -H "x-api-key: $ADMAKEAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"limit": 20}'
```

### A brand's live Meta ads

```bash
# Find the advertiser's Facebook Page, then the ads it's running
curl -X POST https://admakeai.com/api/v1/adResearch__searchCompanies \
  -H "x-api-key: $ADMAKEAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "Huel"}'

curl -X POST https://admakeai.com/api/v1/adResearch__getCompanyAds \
  -H "x-api-key: $ADMAKEAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"pageId": "<id>", "country": "US"}'
# Next page: "cursor" from the previous response (paid plans)
```

### Generate an ad image

```bash
curl -X POST https://admakeai.com/api/v1/adGeneration__create \
  -H "x-api-key: $ADMAKEAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"projectId": "<id>", "prompt": "Morning routine angle, product on a kitchen counter", "aspectRatio": "4:5"}'
# Returns a generation ID; poll adGeneration__getById with {"id": "<id>"} until status is COMPLETED
```

- `adGeneration__create` makes a finished ad: it rewrites the brief with the project's brand brief and adds a headline, subline, CTA button and logo.
- `adGeneration__generateImage` sends the prompt to the image model as written, with no added text.
- `aspectRatio` is `1:1`, `4:5`, `9:16` or `16:9`; `quality` is `low`, `high` or `ultra`.

## Rate Limits and Pricing

- 30 free credits on signup, no card. Plans are $39, $79 and $139 a month for 500, 1,500 and 4,000 credits; one-time packs are also sold.
- A standard image ad costs 2 credits (8 high quality, 20 ultra). A UGC video clip costs 5, 15 or 50 by quality.
- Ad Library lookups don't spend credits. Paging past the first page of an advertiser's ads, UGC video and publishing to Meta need a paid plan.
- Check [admakeai.com/pricing](https://admakeai.com/pricing) for current prices.

## Tradeoffs

- Generation is asynchronous and polled; there is no completion webhook.
- Campaigns pushed to Meta arrive paused, and a person turns them on in Ads Manager. There are no delete tools, and tools that change live ads ask for confirmation.
- It publishes to Meta only. For TikTok, download the files and upload them yourself.
- For other routes to the same jobs: an image model directly (see `ad-creative`'s [generative tools reference](../../skills/ad-creative/references/generative-tools.md)), [HeyGen](heygen.md) for avatar video, [Meta Ads](meta-ads.md) for campaigns without a creative tool, and [ScrapeCreators](scrapecreators.md) for ad library data alone.

## Relevant Skills

- **ad-creative**: generating ad images and variations from a brief
- **ads**: drafting Meta campaigns and reading their results
- **reverse-engineer-marketing**: pulling a brand's live Meta ads to study
