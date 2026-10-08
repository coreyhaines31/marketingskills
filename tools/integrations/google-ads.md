# Google Ads

Pay-per-click advertising platform for search, display, and video campaigns.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Google Ads API for campaign management |
| MCP | ✓ | Available via Google Ads MCP server |
| CLI | ✓ | Repository zero-dependency Node.js CLI |
| SDK | ✓ | Client libraries for multiple languages |

## Authentication

- **Type**: OAuth 2.0
- **Scopes**: `https://www.googleapis.com/auth/adwords`
- **Setup**: Create credentials in Google Cloud Console, link to Google Ads account
- **Headers**: `Authorization: Bearer <access_token>`; `login-customer-id` when acting through a manager account
- **API access**: Google Ads API access is assigned to the Google Cloud project that owns your OAuth credentials. Developer tokens were sunset on September 9, 2026; the `developer-token` header is now optional and ignored. Apply for the appropriate project access level in Google Cloud Console, not the retired manager-account API Center process. [Official migration guide](https://developers.google.com/google-ads/api/docs/api-policy/developer-token).

### Repository CLI credentials

The repository's [Google Ads CLI](../clis/google-ads.js) uses `GOOGLE_ADS_TOKEN` (OAuth access token) and `GOOGLE_ADS_CUSTOMER_ID` (target customer ID without hyphens). Set `GOOGLE_ADS_LOGIN_CUSTOMER_ID` when access goes through a manager; it is normalized to digits. Existing setups can still supply `GOOGLE_ADS_DEVELOPER_TOKEN`, but new setups do not need it. The CLI consumes an access token; it does not exchange or refresh OAuth tokens for you. OAuth scopes, user access to the target account, and the Cloud project's API access level remain required.

Use a read-only first call after selecting the intended account:

```bash
node tools/clis/google-ads.js account info
```

A successful response verifies this read's access; it does not establish permission for campaign edits or budget changes.

## Common Agent Operations

### Get account info

```bash
POST https://googleads.googleapis.com/v24/customers/{customer_id}/googleAds:searchStream

{
  "query": "SELECT customer.id, customer.descriptive_name FROM customer"
}
```

### List campaigns

```bash
POST https://googleads.googleapis.com/v24/customers/{customer_id}/googleAds:searchStream

{
  "query": "SELECT campaign.id, campaign.name, campaign.status, campaign_budget.amount_micros FROM campaign ORDER BY campaign.id"
}
```

### Get campaign performance

```bash
POST https://googleads.googleapis.com/v24/customers/{customer_id}/googleAds:searchStream

{
  "query": "SELECT campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM campaign WHERE segments.date DURING LAST_30_DAYS"
}
```

### Get ad group performance

```bash
POST https://googleads.googleapis.com/v24/customers/{customer_id}/googleAds:searchStream

{
  "query": "SELECT ad_group.name, metrics.impressions, metrics.clicks, metrics.conversions FROM ad_group WHERE segments.date DURING LAST_7_DAYS"
}
```

### Get keyword performance

```bash
POST https://googleads.googleapis.com/v24/customers/{customer_id}/googleAds:searchStream

{
  "query": "SELECT ad_group_criterion.keyword.text, metrics.impressions, metrics.clicks, metrics.average_cpc FROM keyword_view WHERE segments.date DURING LAST_30_DAYS ORDER BY metrics.clicks DESC LIMIT 50"
}
```

### Pause campaign

```bash
POST https://googleads.googleapis.com/v24/customers/{customer_id}/campaigns:mutate

{
  "operations": [{
    "update": {
      "resourceName": "customers/{customer_id}/campaigns/{campaign_id}",
      "status": "PAUSED"
    },
    "updateMask": "status"
  }]
}
```

### Update budget

```bash
POST https://googleads.googleapis.com/v24/customers/{customer_id}/campaignBudgets:mutate

{
  "operations": [{
    "update": {
      "resourceName": "customers/{customer_id}/campaignBudgets/{budget_id}",
      "amountMicros": "50000000"
    },
    "updateMask": "amountMicros"
  }]
}
```

## Key Metrics

| Metric | Description |
|--------|-------------|
| `metrics.impressions` | Ad impressions |
| `metrics.clicks` | Clicks |
| `metrics.cost_micros` | Cost in micros (divide by 1M) |
| `metrics.conversions` | Conversions |
| `metrics.conversions_value` | Conversion value |
| `metrics.average_cpc` | Average cost per click |
| `metrics.ctr` | Click-through rate |
| `metrics.conversion_rate` | Conversion rate |

## Campaign Types

- `SEARCH` - Search network text ads
- `DISPLAY` - Display network
- `SHOPPING` - Product shopping ads
- `VIDEO` - YouTube video ads
- `PERFORMANCE_MAX` - AI-optimized across channels
- `DEMAND_GEN` - Discovery/Demand Gen

## GAQL (Google Ads Query Language)

```sql
SELECT
  campaign.name,
  metrics.clicks,
  metrics.conversions
FROM campaign
WHERE
  campaign.status = 'ENABLED'
  AND segments.date DURING LAST_30_DAYS
ORDER BY metrics.conversions DESC
LIMIT 10
```

### Analysis recipes

Baseline queries for reading an account honestly. See the ads skill's `references/reading-google-ads-data.md` for why each matters.

**Campaign inventory** (separates real campaigns from expired experiment arms and learning bid strategies):

```sql
SELECT campaign.id, campaign.name, campaign.status, campaign.serving_status,
       campaign.primary_status, campaign.primary_status_reasons,
       campaign.experiment_type, campaign.bidding_strategy_type
FROM campaign
WHERE campaign.status != 'REMOVED'
```

**Monthly performance since launch** (only months with activity come back, so the first row is the first month with spend; run before quoting any CPA):

```sql
SELECT segments.month, metrics.impressions, metrics.clicks,
       metrics.cost_micros, metrics.conversions
FROM campaign
WHERE campaign.id = <ID>
  AND segments.date BETWEEN '<EARLY_DATE>' AND '<TODAY>'
ORDER BY segments.month
```

**Conversions by action** (primary vs secondary):

```sql
SELECT segments.conversion_action_name, segments.conversion_action_category,
       metrics.conversions, metrics.all_conversions
FROM campaign
WHERE campaign.id = <ID>
  AND segments.date BETWEEN '<START>' AND '<END>'
  AND metrics.all_conversions > 0
```

**Search terms, unfiltered** (then reconcile disclosed clicks against campaign clicks for the same window):

```sql
SELECT search_term_view.search_term, ad_group.name, metrics.impressions,
       metrics.clicks, metrics.cost_micros, metrics.conversions
FROM search_term_view
WHERE campaign.id = <ID>
  AND segments.date BETWEEN '<START>' AND '<END>'
ORDER BY metrics.impressions DESC
LIMIT 1000
```

Raise the limit until disclosed clicks stop growing; a low limit hides the long tail.

**Ads with final URLs** (ad groups often serve several destinations):

```sql
SELECT ad_group.name, ad_group_ad.ad.id, ad_group_ad.status,
       ad_group_ad.ad.final_urls, metrics.clicks, metrics.conversions
FROM ad_group_ad
WHERE campaign.id = <ID>
  AND segments.date BETWEEN '<START>' AND '<END>'
```

**Change history** (who changed what; 30-day maximum):

```sql
SELECT change_event.change_date_time, change_event.change_resource_type,
       change_event.resource_change_operation, change_event.client_type,
       change_event.user_email, change_event.changed_fields
FROM change_event
WHERE change_event.change_date_time >= '<29_DAYS_AGO>'  -- 'YYYY-MM-DD HH:MM:SS'
  AND change_event.change_date_time <= '<TOMORROW>'
ORDER BY change_event.change_date_time DESC
LIMIT 200
```

`LIMIT` is required on `change_event` and capped at 10,000.

### Gotchas

| Problem | Fix |
|---|---|
| `campaign.start_date` → `UNRECOGNIZED_FIELD` | Newer API versions use `campaign.start_date_time`; if that also fails, derive the start from the first month the monthly query returns |
| `DURING LAST_90_DAYS` → `INVALID_VALUE_WITH_DURING_OPERATOR` | Only some date literals are valid; use `segments.date BETWEEN 'YYYY-MM-DD' AND 'YYYY-MM-DD'` |
| `change_event` → `START_DATE_TOO_OLD` | 30-day limit, strictly enforced; pad the start by a day |
| `change_event` errors with no limit | `LIMIT` is required |
| Cost looks 1,000,000x too big | `cost_micros` ÷ 1,000,000 |
| Keyword or change queries return huge payloads | Write to a file and parse; `keyword_view` returns negatives too (split on `ad_group_criterion.negative`) |

## When to Use

- Managing search advertising campaigns
- Analyzing campaign performance
- Adjusting budgets and bids
- Keyword research and management
- Conversion tracking analysis

## Rate Limits

- 15,000 operations per day (basic)
- Higher limits with developer token levels

## Relevant Skills

- ads
- analytics
- cro

### Manager account access in the CLI

When OAuth credentials access a client through a manager account, set
`GOOGLE_ADS_LOGIN_CUSTOMER_ID` to that manager ID. The CLI removes display hyphens
and sends `login-customer-id` on both report and mutation requests. Keep
`GOOGLE_ADS_CUSTOMER_ID` set to the target client account. Direct client access
does not require the manager variable. See
[Google Ads REST authorization](https://developers.google.com/google-ads/api/rest/auth).

### Run custom reports with the CLI

The built-in report commands cover common summaries. Use `query run` for the
[analysis recipes above](#analysis-recipes), additional dimensions, and conversion
actions without writing another client:

```bash
node tools/clis/google-ads.js query run --query \
  "SELECT campaign.id, segments.date, metrics.clicks FROM campaign WHERE segments.date BETWEEN '2026-01-01' AND '2026-01-03' ORDER BY segments.date LIMIT 100"
```

The command forwards the supplied GAQL unchanged to the same authenticated
`googleAds:searchStream` endpoint. Google validates resource and field
compatibility; it does not call a mutation endpoint. `--dry-run` previews the
request with credentials masked. Empty queries and unknown subcommands fail
locally before transport.

Select the fields you need, bound the result with `LIMIT`, and use explicit dates
for reproducible reporting. Adding a segment changes the row grain: campaign
plus date rows are not campaign totals. JSON output preserves every returned
stream chunk and provider integer strings; do not coerce large IDs into JavaScript
numbers. Cost fields in micros still require division by one million.

See [Google's GAQL overview](https://developers.google.com/google-ads/api/docs/query/overview).
