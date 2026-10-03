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
