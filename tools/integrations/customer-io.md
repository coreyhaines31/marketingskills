# Customer.io

Behavior-based messaging platform for email, push, SMS, and in-app.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Track API, App API, Journeys API |
| MCP | - | Not available |
| CLI | - | Not available |
| SDK | ✓ | JavaScript, iOS, Android, Ruby, Python |

## Authentication

- **Track API**: Site ID + API Key (Basic auth)
- **App API**: Bearer token
- **Header**: `Authorization: Basic {base64(site_id:api_key)}`

## Common Agent Operations

### Identify customer

```bash
PUT https://track.customer.io/api/v1/customers/{customer_id}

Authorization: Basic {base64(site_id:api_key)}

{
  "email": "user@example.com",
  "created_at": 1705312800,
  "first_name": "John",
  "plan": "pro"
}
```

### Track event

```bash
POST https://track.customer.io/api/v1/customers/{customer_id}/events

Authorization: Basic {base64(site_id:api_key)}

{
  "name": "purchase",
  "data": {
    "product": "Pro Plan",
    "amount": 99
  }
}
```

### Track anonymous event

```bash
POST https://track.customer.io/api/v1/events

Authorization: Basic {base64(site_id:api_key)}

{
  "name": "page_viewed",
  "data": {
    "page": "/pricing"
  },
  "anonymous_id": "anon_123"
}
```

### Delete customer

```bash
DELETE https://track.customer.io/api/v1/customers/{customer_id}

Authorization: Basic {base64(site_id:api_key)}
```

### Get customer (App API)

```bash
GET https://api.customer.io/v1/customers/{customer_id}/attributes

Authorization: Bearer {app_api_key}
```

### List campaigns

```bash
GET https://api.customer.io/v1/campaigns

Authorization: Bearer {app_api_key}
```

### Get campaign metrics

```bash
GET https://api.customer.io/v1/campaigns/{campaign_id}/metrics

Authorization: Bearer {app_api_key}
```

### Trigger broadcast

```bash
POST https://api.customer.io/v1/campaigns/{campaign_id}/triggers

Authorization: Bearer {app_api_key}

{
  "emails": ["user@example.com"],
  "data": {
    "coupon_code": "SAVE20"
  }
}
```

### Send transactional email

```bash
POST https://api.customer.io/v1/send/email

Authorization: Bearer {app_api_key}

{
  "transactional_message_id": "1",
  "to": "user@example.com",
  "identifiers": {
    "id": "user_123"
  },
  "message_data": {
    "order_id": "ORD-456"
  }
}
```

## JavaScript SDK

```javascript
// Initialize
_cio.identify({
  id: 'user_123',
  email: 'user@example.com',
  created_at: 1705312800,
  plan: 'pro'
});

// Track event
_cio.track('purchase', {
  product: 'Pro Plan',
  amount: 99
});

// Track page view
_cio.page();
```

## Key Concepts

- **People** - Customers and leads
- **Segments** - Dynamic groups based on attributes/behavior
- **Campaigns** - Automated message sequences
- **Broadcasts** - One-time sends
- **Transactional** - Triggered messages

## Attribute Types

- Standard: `email`, `created_at`, `unsubscribed`
- Custom: Any key you define
- Computed: Aggregations from events

## When to Use

- Behavior-based email automation
- Multi-channel messaging (email, push, SMS)
- Onboarding sequences
- Re-engagement campaigns
- Transactional messages

## Rate Limits

- Track API: 100 requests/second
- App API: 10 requests/second

## Relevant Skills

- emails
- onboarding
- analytics

## CLI account region

Set `CUSTOMERIO_REGION=eu` for a workspace hosted in Customer.io's EU region.
The CLI then uses `track-eu.customer.io` for Track operations and
`api-eu.customer.io` for App operations. Both request previews and actual
requests use the selected region, retaining their existing Basic/Bearer
authentication and request bodies.

```bash
export CUSTOMERIO_REGION=eu
node tools/clis/customer-io.js customers get --id owned-customer-id --dry-run
```

The default is `us`; `CUSTOMERIO_REGION=us` explicitly retains the existing
US hosts. Other values are rejected before requests. Check the workspace's
region rather than guessing it from an email address or the user's location.
This selects documented provider endpoints; it does not migrate a workspace
or guarantee how the provider stores/processes data. Select scoped credentials
for that workspace, and perform writes only when already authorized.

Customer.io notes that sending EU Track requests to its US host can redirect
but still pass through US servers. Use the regional host directly.
See the official [Track server regions](https://docs.customer.io/integrations/api/track/#server-addresses-us-and-eu)
and [App server regions](https://docs.customer.io/integrations/api/app/#server-addresses-us-and-eu).

## Suppression lifecycle

For an explicit erasure/suppression request, `customers suppress` invokes the
Track API operation that permanently deletes the profile and blocks its
identifier from being re-added. This is different from the existing
`customers delete` operation. Preview the request first:

```bash
node tools/clis/customer-io.js customers suppress --id customer-123 --dry-run
node tools/clis/customer-io.js customers unsuppress --id customer-123 --dry-run
```

Both commands require the Track API Site ID and API key. Unsuppressing only
releases the identifier; it does not recreate the deleted profile or restore
history. For ordinary message preferences while keeping a profile, update its
`unsubscribed` attribute instead. Use the operation appropriate to the person's
request and your workspace identifier configuration. See the official
[suppress](https://docs.customer.io/integrations/api/track/tag/track-customers/suppress/)
and [unsuppress](https://docs.customer.io/integrations/api/track/tag/track-customers/unsuppress/)
contracts. Neither operation is a substitute for handling data in other systems.
