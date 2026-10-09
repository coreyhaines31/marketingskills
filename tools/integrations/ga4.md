# Google Analytics 4 (GA4)

Web analytics platform for tracking user behavior, conversions, and marketing performance.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Data API for reports, Admin API for configuration |
| MCP | ✓ | Available via Google Analytics MCP server |
| CLI | - | Use gcloud for some operations |
| SDK | ✓ | gtag.js, Google Analytics SDK for mobile |

## Authentication

- **Data/Admin APIs**: OAuth 2.0 or Service Account
- **Scopes**: `https://www.googleapis.com/auth/analytics.readonly` (read), `https://www.googleapis.com/auth/analytics.edit` (write)
- **Setup**: Create credentials in Google Cloud Console
- **Measurement Protocol**: Authenticate with a stream API secret and measurement ID,
  independently of OAuth. The CLI `events send` command requires `--api-secret`,
  `--measurement-id`, and `--client-id`; it does not require `GA4_ACCESS_TOKEN`.

## Common Agent Operations

### Run a report (Data API)

```bash
POST https://analyticsdata.googleapis.com/v1beta/properties/{property_id}:runReport

{
  "dateRanges": [{"startDate": "30daysAgo", "endDate": "today"}],
  "dimensions": [{"name": "sessionSource"}],
  "metrics": [{"name": "sessions"}, {"name": "conversions"}]
}
```

### Get real-time data

```bash
POST https://analyticsdata.googleapis.com/v1beta/properties/{property_id}:runRealtimeReport

{
  "dimensions": [{"name": "country"}],
  "metrics": [{"name": "activeUsers"}]
}
```

### List conversion events

```bash
GET https://analyticsadmin.googleapis.com/v1beta/properties/{property_id}/conversionEvents
```

### Create a conversion event

```bash
POST https://analyticsadmin.googleapis.com/v1beta/properties/{property_id}/conversionEvents

{
  "eventName": "purchase"
}
```

## Client-Side Tracking

### Send custom event (gtag.js)

```javascript
gtag('event', 'signup_completed', {
  'method': 'email',
  'plan': 'free'
});
```

### Send event via Measurement Protocol

The CLI's `--params` must be a JSON object, such as
`'{"currency":"USD","value":12.5}'`; arrays, `null`, and scalar values are
rejected before sending. Nested ecommerce `items` arrays inside that object are
preserved. A successful HTTP response from `collect` confirms receipt, not that
Analytics processed the event. Use Google's validation guidance for semantic
checks; this CLI preflight is not a complete event-schema validator.
See the [Measurement Protocol reference](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference).

```bash
POST https://www.google-analytics.com/mp/collect?measurement_id={measurement_id}&api_secret={api_secret}

{
  "client_id": "client_123",
  "events": [{
    "name": "purchase",
    "params": {
      "value": 99.99,
      "currency": "USD"
    }
  }]
}
```

## Key Dimensions & Metrics

### Common Dimensions
- `sessionSource` - Traffic source
- `sessionMedium` - Traffic medium
- `sessionCampaignName` - Campaign name
- `landingPage` - Entry page
- `deviceCategory` - Device type
- `country` - User country

### Common Metrics
- `sessions` - Total sessions
- `activeUsers` - Active users
- `newUsers` - New users
- `conversions` - Conversion events
- `engagementRate` - Engaged sessions rate
- `averageSessionDuration` - Session duration

## When to Use

- Tracking website traffic and user behavior
- Measuring marketing campaign performance
- Setting up conversion tracking
- Analyzing user journeys and funnels
- Attribution modeling

## Rate Limits

- Data API: 10 requests per second per property
- Admin API: Varies by endpoint
- Measurement Protocol: 1M hits/day for free tier

## Relevant Skills

- analytics
- ab-testing
- seo-audit
- cro

## Paging standard reports from the CLI

`reports run` returns one page per invocation. Use `--limit` and `--offset` to
read subsequent rows and `--order-bys` to keep their ordering explicit. The CLI
sends these pagination integers as decimal strings, as required by the Data API,
without rounding offsets through JavaScript's floating-point Number type.
`--offset 0` starts at the first row. The API defaults to 10,000 rows when limit
is omitted, and returns at most 250,000 rows per request even if you ask for more.

```bash
node tools/clis/ga4.js reports run --property 123 \
  --start-date 2026-09-01 --end-date 2026-09-30 \
  --dimensions date,country --metrics activeUsers --limit 1000 --offset 0 \
  --order-bys '[{"dimension":{"dimensionName":"date"}},{"dimension":{"dimensionName":"country"}}]'
# Repeat with --offset 1000, keeping every other report option unchanged.
```

For an export, order by the complete set of requested dimensions so ties in a
metric do not leave page order ambiguous. If metric ordering is useful, put it
first and retain dimension ordering as tie-breakers. Keep the same property,
fixed date boundaries, dimensions, metrics, page size and order on every page.
The CLI passes ordering objects unchanged; Google validates referenced fields
and ordering types. Relative dates or mutable recent analytics data can change
between requests, so pagination does not guarantee a snapshot of live data.

Read the response's `rowCount`, headers and metadata together with its rows.
Advance the offset by the number of rows actually returned and stop when all
reported rows have been consumed or a page is empty. Do not advance by a limit
larger than the API's 250,000-row cap. These flags affect `reports run`; they do
not add offset pagination to realtime reports or Measurement Protocol events.
`--dry-run` previews the same body with OAuth authorization masked.

See the official [runReport request contract](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport),
[report pagination guide](https://developers.google.com/analytics/devguides/reporting/data/v1/basics#pagination)
and [OrderBy schema](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/OrderBy).
