# Supermetrics

Marketing data pipeline that connects 200+ marketing platforms. Pulls data from ad platforms, analytics, social, SEO, email, and more into a single query interface.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Query any connected data source, manage accounts |
| MCP | ✓ | [Claude connector](https://claude.com/connectors/supermetrics) |
| CLI | ✓ | [supermetrics.js](../clis/supermetrics.js) |
| SDK | - | REST API only |

## Authentication

- **Type**: API Key
- **Query param**: `api_key={api_key}` or **Header**: `Authorization: Bearer {api_key}`
- **Get key**: Supermetrics Hub > API settings at https://hub.supermetrics.com

## Common Agent Operations

### Query a Data Source

```bash
POST https://api.supermetrics.com/query/data/json

{
  "ds_id": "GA4",
  "ds_accounts": "123456789",
  "date_range_type": "custom",
  "start_date": "-28 days",
  "end_date": "yesterday",
  "fields": [
    { "id": "sessions" },
    { "id": "pageviews" },
    { "id": "date" }
  ]
}
```

### Query with Filters

```bash
POST https://api.supermetrics.com/query/data/json

{
  "ds_id": "AW",
  "ds_accounts": "123-456-7890",
  "date_range_type": "last_month",
  "fields": [
    { "id": "campaign_name" },
    { "id": "clicks" },
    { "id": "impressions" },
    { "id": "cost" }
  ],
  "max_rows": 100
}
```

### List Available Data Sources

```bash
GET https://api.supermetrics.com/datasource/search
```

### List Connected Accounts

```bash
GET https://api.supermetrics.com/query/accounts?ds_id=GA4
```

### Get a Team

```bash
GET https://api.supermetrics.com/v1/teams/{team_id}
```

### List Users

```bash
GET https://api.supermetrics.com/v1/teams/{team_id}/users
```

## Key Metrics

### Data Source IDs
- `GA4` - Google Analytics 4
- `GA4_PAID` - Google Analytics (paid)
- `AW` - Google Ads
- `FB` - Facebook Ads
- `LI` - LinkedIn Ads
- `TW_ADS` - Twitter Ads
- `IG_IA` - Instagram
- `FB_IA` - Facebook Pages
- `GSC` - Google Search Console
- `SE` - Semrush
- `MC` - Mailchimp
- `HubSpot` - HubSpot

### Date Range Values
- `last_28_days` - CLI shorthand for a custom range from `-28 days` through `yesterday`
- `last_month` - Previous calendar month
- `this_month` - Current month to date
- `custom` - Custom range (requires `start_date` and `end_date`)

## Parameters

### Query
- `ds_id` - Data source identifier (required)
- `ds_accounts` - Account ID for the data source (required)
- `date_range_type` - Date range preset or "custom" (required)
- `fields` - Array of field objects with required `id` property (required)
- `filter` - Filter expression for narrowing results
- `max_rows` - Maximum number of rows to return
- `start_date` - Start date for custom range (YYYY-MM-DD)
- `end_date` - End date for custom range (YYYY-MM-DD)

### Common Fields by Source
- **GA4**: `sessions`, `pageviews`, `users`, `bounce_rate`, `date`, `source`, `medium`, `page_path`
- **Google Ads**: `campaign_name`, `clicks`, `impressions`, `cost`, `conversions`, `ctr`, `cpc`
- **Facebook Ads**: `campaign_name`, `impressions`, `clicks`, `spend`, `reach`, `cpm`, `cpc`
- **LinkedIn Ads**: `campaign_name`, `impressions`, `clicks`, `cost`, `conversions`
- **GSC**: `query`, `clicks`, `impressions`, `ctr`, `position`, `page`

## When to Use

- Pulling cross-platform marketing data into a single report
- Comparing performance across ad platforms (Google, Meta, LinkedIn, TikTok)
- Aggregating analytics data from multiple sources
- Automating marketing reporting workflows
- Building unified dashboards across marketing channels
- Extracting SEO data alongside paid media metrics

## Rate Limits

- Rate limits vary by plan
- Enterprise API: typically 100 requests/minute
- Query results may be paginated for large datasets
- Recommended: use `max_rows` to control response size

## Relevant Skills

- analytics
- ads
- seo-audit
- content-strategy
- social

## CLI Contract Notes

- `teams get --team-id <id>` retrieves one team; `users list --team-id <id>` lists that team's users. These require a key with the corresponding management permissions. The former unscoped `teams list` has no documented public equivalent and now returns migration guidance.
- Query custom ranges require both `--start-date` and `--end-date`. Field names passed to `--fields` are provider field IDs, not display-name overrides. Empty IDs are rejected before a request.
- HTTP failures exit unsuccessfully; `--dry-run` masks the Bearer credential without sending any request.

Primary contracts: [authentication](https://docs.supermetrics.com/apidocs/authentication), [fields](https://docs.supermetrics.com/apidocs/fields), [relative dates](https://docs.supermetrics.com/apidocs/date-strings), [query data](https://docs.supermetrics.com/apidocs/query-data-3), [source search](https://docs.supermetrics.com/apidocs/search-data-sources), [accounts](https://docs.supermetrics.com/apidocs/get-accounts), [team lookup](https://docs.supermetrics.com/apidocs/get-team-details-by-team-id), and [team users](https://docs.supermetrics.com/apidocs/list-all-users-in-a-team).
