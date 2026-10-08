# Google Search Console

Free tool for monitoring website search performance and indexing.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Search Analytics API, URL Inspection API |
| MCP | - | Not available |
| CLI | - | Use gcloud or API scripts |
| SDK | ✓ | Google API client libraries |

## Authentication

- **Type**: OAuth 2.0 or Service Account
- **Scopes**: `https://www.googleapis.com/auth/webmasters.readonly`
- **Setup**: Create credentials in Google Cloud Console

## Common Agent Operations

### Get search analytics

```bash
POST https://searchconsole.googleapis.com/webmasters/v3/sites/{site_url}/searchAnalytics/query

{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "dimensions": ["query"],
  "rowLimit": 100
}
```

### Get performance by page

```bash
POST https://searchconsole.googleapis.com/webmasters/v3/sites/{site_url}/searchAnalytics/query

{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "dimensions": ["page"],
  "rowLimit": 50
}
```

### Get performance by country

```bash
POST https://searchconsole.googleapis.com/webmasters/v3/sites/{site_url}/searchAnalytics/query

{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "dimensions": ["country", "query"],
  "rowLimit": 100
}
```

### Inspect URL

```bash
POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect

{
  "inspectionUrl": "https://example.com/page",
  "siteUrl": "https://example.com/"
}
```

### List sitemaps

```bash
GET https://searchconsole.googleapis.com/webmasters/v3/sites/{site_url}/sitemaps

Authorization: Bearer {access_token}
```

### Submit sitemap

```bash
PUT https://searchconsole.googleapis.com/webmasters/v3/sites/{site_url}/sitemaps/{sitemap_url}

Authorization: Bearer {access_token}
```

A successful [sitemap submission](https://developers.google.com/webmaster-tools/v1/sitemaps/submit)
returns an empty response body. The CLI confirms submission only for a successful
HTTP response. `--dry-run` prints the redacted PUT request without claiming submission.

```bash
node tools/clis/google-search-console.js sitemaps submit --site-url sc-domain:example.com \
  --sitemap-url https://example.com/sitemap.xml --dry-run
```

### Request indexing

```bash
POST https://indexing.googleapis.com/v3/urlNotifications:publish

{
  "url": "https://example.com/new-page",
  "type": "URL_UPDATED"
}
```

## Dimensions

- `query` - Search query
- `page` - Page URL
- `country` - Country code
- `device` - Device type (MOBILE, DESKTOP, TABLET)
- `date` - Date
- `searchAppearance` - Search result type

## Metrics

- `clicks` - Clicks from search
- `impressions` - Search impressions
- `ctr` - Click-through rate
- `position` - Average position

## Filters

```json
{
  "dimensionFilterGroups": [{
    "filters": [{
      "dimension": "query",
      "operator": "contains",
      "expression": "keyword"
    }]
  }]
}
```

## When to Use

- Analyzing search performance
- Finding keyword opportunities
- Monitoring indexing status
- Submitting new pages for indexing
- Identifying crawl issues
- Tracking position changes

## Rate Limits

- 200 queries per minute
- 1,200 requests per minute

## Relevant Skills

- seo-audit
- programmatic-seo
- analytics

## CLI result pages

The local CLI supports `--start-row` for all three Search Analytics commands:
`search query`, `search pages`, and `search countries`. The offset is zero-based;
`--limit` accepts 1–25,000 rows. The CLI retains its default page size of 100 and
omits `startRow` unless you specify it.

```bash
# First page
node tools/clis/google-search-console.js search query \
  --site-url sc-domain:example.com \
  --start-date 2026-09-01 --end-date 2026-09-30 --limit 1000

# Next page, after receiving 1,000 rows
node tools/clis/google-search-console.js search query \
  --site-url sc-domain:example.com \
  --start-date 2026-09-01 --end-date 2026-09-30 --limit 1000 --start-row 1000
```

Keep the same property, command, explicit dates, and page size while reading
pages. Advance the offset by the number of rows actually returned. An offset
past the available results produces a successful empty response; do not treat
that as an API failure. `--dry-run` previews the page body with masked credentials
without making a request. Invalid offsets and page sizes fail locally.

Paging exposes additional available rows, not a complete search-data export.
Google returns top rows subject to internal limits, ordered by descending clicks;
rows tied on clicks have arbitrary order. The API provides no stable tie-breaker
or snapshot guarantee, so do not claim an exactly-once or exhaustive export.
Use explicit dates rather than recalculating the CLI's moving default range
between pages. URL Inspection and sitemap commands are unaffected.

Reference: [Search Analytics query and pagination contract](https://developers.google.com/webmaster-tools/v1/searchanalytics/query).
