# Segment

Customer data platform for collecting, routing, and activating user data.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Tracking API, Profile API, Config API |
| MCP | - | Not available |
| CLI | - | Not available |
| SDK | ✓ | analytics.js, iOS, Android, server libraries |

## Authentication

- **Tracking**: Write Key (per source)
- **API**: Access Token (OAuth 2.0)
- **Header**: `Authorization: Bearer {access_token}`

## Common Agent Operations

### Track event

```bash
POST https://api.segment.io/v1/track

Authorization: Basic {base64(write_key:)}

{
  "userId": "user_123",
  "event": "signup_completed",
  "properties": {
    "plan": "pro",
    "method": "email"
  }
}
```

### Identify user

```bash
POST https://api.segment.io/v1/identify

Authorization: Basic {base64(write_key:)}

{
  "userId": "user_123",
  "traits": {
    "email": "user@example.com",
    "name": "John Doe",
    "plan": "pro"
  }
}
```

### Track page view

```bash
POST https://api.segment.io/v1/page

Authorization: Basic {base64(write_key:)}

{
  "userId": "user_123",
  "name": "Pricing",
  "properties": {
    "title": "Pricing - Example",
    "url": "https://example.com/pricing"
  }
}
```

### Batch events

```bash
POST https://api.segment.io/v1/batch

Authorization: Basic {base64(write_key:)}

{
  "batch": [
    {"type": "identify", "userId": "user_1", "traits": {"plan": "free"}},
    {"type": "track", "userId": "user_1", "event": "signup"}
  ]
}
```

### Get user profile (Profile API)

```bash
GET https://profiles.segment.com/v1/spaces/{space_id}/collections/users/profiles/user_id:{user_id}/traits

Authorization: Basic {base64(access_token:)}
```

### Get user events

```bash
GET https://profiles.segment.com/v1/spaces/{space_id}/collections/users/profiles/user_id:{user_id}/events

Authorization: Basic {base64(access_token:)}
```

## JavaScript SDK

```javascript
// Initialize
analytics.load('WRITE_KEY');

// Identify user
analytics.identify('user_123', {
  email: 'user@example.com',
  plan: 'pro'
});

// Track event
analytics.track('Feature Used', {
  feature_name: 'export'
});

// Page view
analytics.page('Pricing');
```

## Key Concepts

- **Sources** - Where data comes from (website, app, server)
- **Destinations** - Where data goes (analytics, CRM, ads)
- **Tracking Plan** - Schema for events and properties
- **Protocols** - Data governance and validation
- **Personas** - Unified user profiles
- **Audiences** - Computed user segments

## Common Destinations

- Analytics: GA4, Mixpanel, Amplitude
- CRM: HubSpot, Salesforce
- Email: Customer.io, Mailchimp
- Ads: Google Ads, Meta
- Data Warehouse: BigQuery, Snowflake

## When to Use

- Centralizing event tracking
- Routing data to multiple tools
- Maintaining consistent tracking
- Building unified user profiles
- Syncing audiences across platforms

## Rate Limits

- 500 requests/second per source
- Batch up to 500KB or 32KB per event

## Relevant Skills

- analytics
- emails
- ads

### Profile identifiers in the CLI

Pass the raw user ID to `profiles traits` or `profiles events`. The CLI URL-encodes
the value so characters such as `/`, `+`, `?`, and `#` remain part of the user ID.
Do not pre-encode it. See [Profile API identifiers](https://www.twilio.com/docs/segment/unify/profile-api).

## CLI anonymous and known identities

The `track event`, `page view`, and `identify user` commands accept either
`--user-id`, `--anonymous-id`, or both. Use an existing anonymous identifier
for pre-signup activity rather than inventing a known customer ID:

```bash
node tools/clis/segment.js track event --anonymous-id anon-owned \
  --event 'Pricing Viewed' --properties '{"plan":"pro"}' --dry-run

# When this same visitor becomes a known user
node tools/clis/segment.js identify user --user-id user-owned \
  --anonymous-id anon-owned --traits '{"plan":"paid"}' --dry-run
```

The CLI passes the IDs through unchanged; it does not generate an anonymous
ID, store identity state, or infer that two people are the same. Reuse the
actual identifier associated with that visitor and supply both only when the
association is known. Destination identity handling varies: acceptance by
Segment does not prove every destination merged the history. An anonymous ID
is an identifier, not a guarantee of anonymity or permission to collect data.
Send events only when the collection is already authorized.

At least one ID is required before sending these single-event requests.
Existing `--user-id` calls and raw batch payloads are unchanged. Profile
lookups continue to require a known `--user-id`; `--anonymous-id` does not
change their resource path. Previews mask the write key and make no request.

Official [common identity fields](https://www.twilio.com/docs/segment/connections/spec/common)
and [Identify semantics](https://www.twilio.com/docs/segment/connections/spec/identify).

## Importing and retrying individual events

Single `track event`, `identify user`, and `page view` calls accept
`--timestamp` and `--message-id`. Use an ISO datetime with a timezone to retain
when a historical event occurred, and reuse the source event's ID when retrying:

```bash
node tools/clis/segment.js track event --user-id customer-1 --event "Order Completed" \
  --timestamp 2024-04-12T10:15:30Z --message-id order-123 --dry-run
```

Both fields are omitted when flags are absent, leaving Segment's defaults
intact. Message IDs must contain 1–100 characters. For `batch send`, place the
metadata on each event in `--events`; these individual-call flags do not rewrite
batches. See [common fields](https://www.twilio.com/docs/segment/connections/spec/common)
and [duplicate handling](https://www.twilio.com/docs/segment/guides/duplicate-data).
Downstream destinations can handle these fields differently.
