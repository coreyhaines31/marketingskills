# Amplitude

Product analytics platform for user behavior, retention, and experimentation.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | HTTP API for events, User Profile API, Export API |
| MCP | - | Not available |
| CLI | - | Not available |
| SDK | ✓ | JavaScript, iOS, Android, Python, etc. |

## Authentication

- **HTTP API**: API Key (public for events)
- **Export/Dashboard API**: API Key + Secret Key

## Common Agent Operations

### Track event

```bash
POST https://api2.amplitude.com/2/httpapi

{
  "api_key": "{api_key}",
  "events": [{
    "user_id": "user_123",
    "event_type": "signup_completed",
    "event_properties": {
      "plan": "pro"
    },
    "user_properties": {
      "email": "user@example.com"
    }
  }]
}
```

### Batch events

```bash
POST https://api2.amplitude.com/batch

{
  "api_key": "{api_key}",
  "events": [
    {"user_id": "user_1", "event_type": "pageview"},
    {"user_id": "user_2", "event_type": "signup"}
  ]
}
```

### Get user activity

The activity endpoint requires an internal Amplitude ID, distinct from the
external `user_id` used to track events. The CLI resolves `users activity
--user-id <external-user-id>` through User Search and selects an exact user ID
match before requesting activity. Use `--amplitude-id <internal-id>` for a
direct lookup. A dry run with `--user-id` previews the initial search request;
it cannot determine an internal ID without contacting the API.

```bash
GET https://amplitude.com/api/2/useractivity?user={amplitude_id}

Authorization: Basic {base64(api_key:secret_key)}
```

### Export events

```bash
GET https://amplitude.com/api/2/export?start=20240101T00&end=20240131T23

Authorization: Basic {base64(api_key:secret_key)}
```

The Export API returns a ZIP archive. To keep stdout valid JSON without decoding
binary bytes as text, `node tools/clis/amplitude.js export events` returns
`{ "status": 200, "contentType": "application/zip", "encoding": "base64", "body": "..." }`.
After saving that JSON as `export.json`, restore the archive with:

```javascript
const fs = require('node:fs')
const result = JSON.parse(fs.readFileSync('export.json', 'utf8'))
fs.writeFileSync('events.zip', Buffer.from(result.body, 'base64'))
```

### Get retention data

```bash
GET https://amplitude.com/api/2/retention?se={"event_type":"signup_completed"}&re={"event_type":"purchase"}&start=20240101&end=20240131

Authorization: Basic {base64(api_key:secret_key)}
```

The [Dashboard REST API](https://amplitude.com/docs/apis/analytics/dashboard-rest#retention-analysis)
requires two event objects: `se` for the starting action and `re` for the returning action.
The CLI defaults to new users (`_new`) returning with an active event (`_active`).
`--event` is a compatibility alias for `--return-event`; an explicit `--return-event` wins.

```bash
node tools/clis/amplitude.js retention get --start 20240101 --end 20240131 \
  --start-event signup_completed --return-event purchase --dry-run
```

### Query with SQL (Snowflake)

For Amplitude customers with SQL access:
```sql
SELECT event_type, COUNT(*) as count
FROM events
WHERE event_time > '2024-01-01'
GROUP BY event_type
```

## JavaScript SDK

```javascript
// Initialize
amplitude.init('API_KEY');

// Identify user
amplitude.setUserId('user_123');

// Set user properties
const identify = new amplitude.Identify();
identify.set('plan', 'pro');
amplitude.identify(identify);

// Track event
amplitude.track('Feature Used', {
  feature_name: 'export'
});
```

## Key Concepts

- **Events** - User actions with properties
- **User Properties** - Persistent user attributes
- **Cohorts** - Behavioral segments
- **Funnels** - Multi-step conversion analysis
- **Retention** - User return patterns
- **Journeys** - User path analysis

## When to Use

- Tracking product analytics
- Analyzing user funnels
- Cohort analysis and retention
- Experimentation and A/B testing
- User journey mapping

## Rate Limits

- HTTP API: 1000 events/second
- Export API: 360 requests/hour

## Relevant Skills

- analytics
- ab-testing
- onboarding

## Tracking before signup

`track event` accepts `--device-id` without `--user-id` for events before an
account exists. At least one identity is required; when both are known, include
both to send them together. Device IDs are identifiers, not a privacy guarantee.

```bash
node tools/clis/amplitude.js track event --device-id visitor-device-123 \
  --event-type "Viewed Pricing" --properties '{"experiment":"pricing-b"}' --dry-run
```

The CLI leaves existing user-only payloads intact and masks the API key in
previews. Amplitude's default minimum identifier length is five characters;
provider-side identity and project ingestion rules still apply. See the
[HTTP V2 API](https://amplitude.com/docs/apis/analytics/http-v2).
