# ASOScan

ASOScan is a complete App Store Optimization (ASO) platform for the App Store and Google Play. People use it in the web dashboard, and agents use the same account through the REST API, the hosted MCP server, the ChatGPT app and the open-source ASOScan skills.

What it covers:

- Keyword research with search volume and difficulty, and keyword opportunities from a six-source engine
- Daily keyword rank tracking on iOS and Android, in every store market, with full history
- Competitor intelligence: the keywords a competitor ranks for, and diffs of every listing change
- An ASO score with recommendations, and a metadata simulator that scores a draft before it ships
- AI built in: native-language listing drafts, review replies in the reviewer's language, keyword suggestions
- Ratings, reviews and review sentiment, with replies posted for apps connected to App Store Connect or Google Play Console
- AI Visibility (how often AI assistants recommend the app), client-ready reports, and HMAC-signed webhooks

Everything works on the apps and competitors in your own account.

Facts below were checked against the [OpenAPI spec](https://asoscan.com/api/public/v1/openapi.json), the [developer docs](https://asoscan.com/developers) and the [pricing page](https://asoscan.com/pricing) on 2026-11-23.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST, `https://asoscan.com/api/public/v1`, JSON; read and write (write keys add apps, keywords and competitors) |
| MCP | ✓ | Hosted Streamable HTTP server at `https://asoscan.com/mcp`, OAuth sign-in only (an API key gets 401); 26 tools, each calling the matching API endpoint |
| CLI | - | Not available |
| SDK | - | Plain HTTP |

## Authentication

- **Type**: API key as a Bearer token: `Authorization: Bearer asosk_live_...`
- **Env var** (convention): `ASOSCAN_API_KEY`
- **Get key**: Settings → API access → Create key. Choose read-only or read-write. The key is shown once.
- **MCP**: OAuth 2.1 with PKCE. Scopes `read` and `write`. Disconnect from Settings → Connected AI apps.
- **Credit balance**: `GET /api/public/v1/usage` (free)

## MCP Server Setup

### Claude Code

```bash
claude mcp add --transport http asoscan https://asoscan.com/mcp
```

Run `/mcp` to sign in.

### ChatGPT

ASOScan is listed in ChatGPT's app directory: [chatgpt.com/plugins/plugin_asdk_app_6ac31e16fb6881919510d9cb1ea39463](https://chatgpt.com/plugins/plugin_asdk_app_6ac31e16fb6881919510d9cb1ea39463).

Other MCP clients: use the REST API with a key instead. The OAuth server accepts a fixed list of client hosts, so not every MCP client can sign in.

## Common Agent Operations

Every call works on an app in your account, so list or add the app first and use its `id`.

### Your apps, and adding one

```bash
curl https://asoscan.com/api/public/v1/apps \
  -H "Authorization: Bearer $ASOSCAN_API_KEY"

# Write key. storeUrl is an App Store or Google Play link
curl -X POST https://asoscan.com/api/public/v1/apps \
  -H "Authorization: Bearer $ASOSCAN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"storeUrl": "https://apps.apple.com/us/app/id123456789", "country": "US"}'
```

### Keyword research

```bash
# Volume, difficulty and the top competing apps for any term, live
GET https://asoscan.com/api/public/v1/apps/{id}/keywords/research?term=habit%20tracker&country=US
Authorization: Bearer $ASOSCAN_API_KEY
```

The app `id` sets the platform (App Store or Google Play). A failed lookup returns 400 and is not billed.

### Tracked keywords and rank history

```bash
# Rank, rank movement, volume and difficulty for every tracked keyword
GET https://asoscan.com/api/public/v1/apps/{id}/keywords?country=US&rankWindow=7d

# Daily rank series for one keyword
GET https://asoscan.com/api/public/v1/apps/{id}/keywords/{keywordId}/history?days=30

# Start tracking terms (write key)
POST https://asoscan.com/api/public/v1/apps/{id}/keywords
{"terms": ["habit tracker", "daily planner"], "country": "US"}
```

### Keyword opportunities and keyword spy

```bash
# Keywords ranked by opportunity score (limit 1-200, default 50)
GET https://asoscan.com/api/public/v1/apps/{id}/opportunities?country=US&limit=50

# Every keyword the app ranks for
GET https://asoscan.com/api/public/v1/apps/{id}/keyword-spy?country=US
```

### Listing audit

```bash
GET https://asoscan.com/api/public/v1/apps/{id}/metadata             # current listing text
GET https://asoscan.com/api/public/v1/apps/{id}/metadata/changelog   # what changed and when
GET https://asoscan.com/api/public/v1/apps/{id}/aso-score?country=US # 0-100 score and pillar breakdown
GET https://asoscan.com/api/public/v1/apps/{id}/recommendations?country=US
```

### Competitors, ratings and reviews

```bash
GET  https://asoscan.com/api/public/v1/apps/{id}/competitors?country=US
POST https://asoscan.com/api/public/v1/apps/{id}/competitors   # {"storeUrl": "..."}, write key
GET  https://asoscan.com/api/public/v1/apps/{id}/category-rank
GET  https://asoscan.com/api/public/v1/apps/{id}/rating-history
GET  https://asoscan.com/api/public/v1/apps/{id}/reviews
GET  https://asoscan.com/api/public/v1/apps/{id}/reviews/insights
```

Errors use RFC 7807 problem details.

## Rate Limits and Pricing

- Usage is a monthly credit allowance that scales by plan. Opportunities, keyword spy and every write cost 2 credits; live keyword research costs 8; `GET /usage` is free. Responses carry `X-ApiCredits-Limit`, `X-ApiCredits-Remaining` and `X-ApiCredits-Used` headers.
- Per-key burst limit; a 429 comes with `Retry-After`. The MCP server allows 120 requests a minute per connection on top of the API limits.
- The API is on every paid plan and the 7-day free trial (no card; the trial has a smaller allowance). Plans are $15, $59, $149 and $299 a month; Enterprise is custom.
- Check [asoscan.com/pricing](https://asoscan.com/pricing) for current prices and [asoscan.com/developers](https://asoscan.com/developers) for allowances.

## Tradeoffs

- Works on apps you add to your account, not as a lookup service for any app by id. Webhooks are set up in the dashboard.
- You paste finished listing text into App Store Connect or Google Play Console; installs and revenue stay in those consoles.
- Other routes: [SignalShelf](signalshelf.md) for public reviews alone, [DataForSEO](dataforseo.md) for raw store search results, and AppTweak, Appfigures or Sensor Tower, which have their own APIs.

## Relevant Skills

- **aso**: keyword volume and difficulty, ranks and their history, listing audits
- **competitors**: the keywords and ratings of a tracked competitor app
- **customer-research**: reading app reviews and review insights
