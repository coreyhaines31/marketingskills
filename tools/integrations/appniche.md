# AppNiche

App Store intelligence platform for app-market research, ASO keyword scoring, competitor discovery, revenue/download estimates, and review analysis.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API at `https://api.getappniche.com/api/v1` |
| MCP | ✓ | HTTP tools at `https://api.getappniche.com/api/mcp/tools` |
| CLI | - | Not available |
| SDK | - | REST API only |

## Authentication

- **Type**: Bearer API key
- **Header**: `Authorization: Bearer {APPNICHE_API_KEY}`
- **Get key**: Create an AppNiche account, upgrade to Pro, then generate a key in Settings -> API keys
- **Docs**: https://getappniche.com/docs/api-and-mcp

## Common Agent Operations

### Search apps

```bash
GET https://api.getappniche.com/api/v1/apps?store=apple&category=Productivity&min_revenue=1000&limit=10

Authorization: Bearer {APPNICHE_API_KEY}
```

Useful filters include `store`, `category`, `search`, `min_rating`, `min_reviews`, `min_downloads`, `min_revenue`, `growth_direction`, `has_meta_ads`, `has_apple_ads`, `has_creators`, `limit`, `offset`, `sort_by`, and `sort_dir`.

### Get app detail

```bash
GET https://api.getappniche.com/api/v1/apps/apple:284882215

Authorization: Bearer {APPNICHE_API_KEY}
```

Use app detail before making claims about one app's downloads, revenue, rating, growth, ads, creators, screenshots, or reviews.

### Score keyword difficulty

```bash
GET https://api.getappniche.com/api/v1/keywords/difficulty?keyword=habit%20tracker&store=apple&country=US&language=en

Authorization: Bearer {APPNICHE_API_KEY}
```

### Fetch reviews

```bash
GET https://api.getappniche.com/api/v1/reviews?store=apple&store_id=284882215&limit=20

Authorization: Bearer {APPNICHE_API_KEY}
```

Reviews are designed for monitored apps. Use them to group pain points, sentiment, and recurring topics.

### List MCP tools

```bash
GET https://api.getappniche.com/api/mcp/tools
```

Available tools:

- `search_apps`
- `get_app_detail`
- `get_keyword_difficulty`
- `batch_keyword_difficulty`
- `get_app_reviews`
- `get_supported_countries`

### MCP search apps

```bash
POST https://api.getappniche.com/api/mcp/tools/search_apps
Authorization: Bearer {APPNICHE_API_KEY}
Content-Type: application/json

{
  "store": "apple",
  "category": "Productivity",
  "limit": 5
}
```

### MCP batch keyword difficulty

```bash
POST https://api.getappniche.com/api/mcp/tools/batch_keyword_difficulty
Authorization: Bearer {APPNICHE_API_KEY}
Content-Type: application/json

{
  "store": "apple",
  "country": "US",
  "language": "en",
  "keywords": ["habit tracker", "daily planner", "focus timer"]
}
```

## Key Metrics

- `downloads_est_monthly` - Directional monthly download estimate
- `revenue_est_monthly` - Directional monthly revenue estimate
- `rating_count` - Store rating or review count signal
- `growth_reviews_7d_pct` - Recent review-growth signal
- `category` - Store category
- `store` and `store_id` - Store identity fields
- Keyword difficulty and opportunity fields returned by the keyword endpoint

## When to Use

- Building ASO keyword research workflows for iOS apps
- Comparing app competitors by directional revenue, downloads, reviews, and growth
- Validating app niches before building or scaling
- Creating app-market research briefs for indie founders and mobile teams
- Feeding app-store context into agents that run competitive intelligence, product research, or ASO audits
- Grouping monitored app reviews by sentiment and topic

## Agent Workflow Examples

### Competitor brief

1. Call `search_apps` with a category, keyword, or store filter.
2. Call `get_app_detail` for the strongest 3-5 app IDs.
3. Compare `downloads_est_monthly`, `revenue_est_monthly`, `rating_count`, and `growth_reviews_7d_pct`.
4. Return a table with risks, missing data, and one product opportunity.

### ASO keyword pass

1. Gather candidate keywords from the app niche and competitor listings.
2. Use `batch_keyword_difficulty` for up to 10 terms per call.
3. Prefer keywords with useful opportunity and manageable difficulty.
4. Return title, subtitle, and keyword-field candidates with credit usage noted.

### Review signal scan

1. Use `get_app_reviews` with a monitored app.
2. Group negative reviews by topic and improvement area.
3. Quote only short snippets returned by AppNiche.
4. Recommend the smallest product change that addresses the most frequent pain.

## Guardrails

- Treat revenue and download estimates as directional market intelligence, not exact financial facts.
- Do not invent rank history, ad spend, creator activity, review text, or revenue claims when the API does not return source data.
- Cite app ID, store, category, rating count, estimated downloads, estimated revenue, and growth fields when they support a recommendation.
- Keep credit usage visible when a tool charges credits.

## Rate Limits

Rate limits and monthly credit allowances depend on the AppNiche plan and API key. API and MCP calls require an active Pro account.

## Relevant Skills

- aso
- competitors
- competitor-profiling
- customer-research
- free-tools
- directory-submissions
