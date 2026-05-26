# Postscript

SMS marketing platform built for Shopify direct-to-consumer brands. Deepest Shopify integration of any SMS platform.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API |
| MCP | - | Not available |
| CLI | - | None |
| SDK | - | Use API directly |

## Authentication

- **Type**: API Key
- **Header**: `Authorization: Bearer {api_key}` or `X-Postscript-Api-Key: {api_key}`
- **Get key**: Postscript dashboard → Settings → API
- **Note**: Keys are scoped per shop

## Common Agent Operations

### Search subscribers

```bash
GET https://api.postscript.io/api/v2/subscribers?phone_number=%2B15551234567
```

### Create subscriber (opt-in)

```bash
POST https://api.postscript.io/api/v2/subscribers

{
  "phone_number": "+15551234567",
  "email": "user@example.com",
  "first_name": "Jane",
  "subscribed_at": "2026-05-15T10:00:00Z",
  "opt_in_source": "checkout_keyword"
}
```

Must include valid opt-in metadata for TCPA compliance.

### Unsubscribe

```bash
DELETE https://api.postscript.io/api/v2/subscribers/{subscriberId}/subscription
```

### List keywords (e.g., JOIN, SAVE)

```bash
GET https://api.postscript.io/api/v2/keywords
```

### Send transactional message

```bash
POST https://api.postscript.io/api/v2/transactional/sms

{
  "phone_number": "+15551234567",
  "message": "Your order #1234 shipped. Track at https://..."
}
```

Transactional requires separate enablement; counts under transactional consent.

### List campaigns

```bash
GET https://api.postscript.io/api/v2/campaigns
```

### List automations (flows)

```bash
GET https://api.postscript.io/api/v2/automations
```

### Webhooks

Subscribe to events: `subscriber.created`, `subscriber.unsubscribed`, `message.delivered`, `message.failed`, `conversion.attributed`.

## API Pattern

REST + JSON. Standard `Bearer` auth. Pagination via `cursor` and `limit` (max 100).

## Key Features

- Native Shopify integration: purchases, abandoned carts, browse, product catalog auto-sync
- Strong abandoned cart and browse abandonment automation builders
- AI Reply (auto-reply trained on brand voice)
- Conversational SMS / live agent for two-way
- Opt-in tools: popups, keyword opt-in, checkout opt-in
- A2P 10DLC managed in-platform
- Reporting: revenue, click-through, conversion attribution, opt-out rate

## Pricing

- Plans: Starter (free, 1K msgs/mo), Growth ($100+/mo), Professional, Enterprise
- Per-send pricing on top: ~$0.015 SMS, ~$0.04 MMS
- Annual contracts standard at Growth+
- Pricing scales meaningfully past 50K subscribers

## When to Use

- Shopify DTC brand wanting SMS-specific tooling (vs combined email/SMS)
- Need deep abandoned cart, browse abandonment, post-purchase automation out of the box
- Want managed A2P 10DLC + compliance tools
- Mid-size DTC brand (10K–500K SMS subscribers)

## When NOT to Use

- Non-Shopify ecom — integration is shallow
- Already on Klaviyo for email and SMS is secondary — Klaviyo SMS is simpler
- Mid-market/enterprise needing concierge support — Attentive
- Custom platform or B2B SaaS — Twilio

## Relevant Skills

- sms
- emails (run alongside via Klaviyo or similar)
- churn-prevention (win-back flows)
- onboarding (post-purchase activation)
