# Attentive

Full-service SMS marketing platform for mid-market and enterprise direct-to-consumer brands. Combines tooling with dedicated success teams.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API |
| MCP | - | Not available |
| CLI | - | None |
| SDK | - | Use API directly |

## Authentication

- **Type**: OAuth 2.0 or API Key (depending on integration type)
- **Header**: `Authorization: Bearer {access_token}`
- **Get credentials**: Account-level provisioning through Attentive integrations team
- **Note**: API access requires partnership or eligible plan

## Common Agent Operations

### Subscribe a user

```bash
POST https://api.attentivemobile.com/v1/subscriptions

{
  "user": {
    "phone": "+15551234567",
    "email": "user@example.com"
  },
  "signUpSourceId": "...",
  "subscriptionType": "MARKETING"
}
```

Sign-up source ID determines opt-in attribution and compliance disclosure shown.

### Unsubscribe

```bash
POST https://api.attentivemobile.com/v1/subscriptions/unsubscribe

{
  "user": { "phone": "+15551234567" },
  "subscriptionType": "MARKETING"
}
```

### Custom event tracking

```bash
POST https://api.attentivemobile.com/v1/events/custom

{
  "user": { "phone": "+15551234567" },
  "type": "abandoned_cart",
  "properties": {
    "cart_value": 89.99,
    "items": ["Product A"]
  }
}
```

### E-commerce events (purchase, add-to-cart, product view)

```bash
POST https://api.attentivemobile.com/v1/events/ecommerce/purchase

{
  "user": { "phone": "+15551234567" },
  "items": [{
    "productId": "SKU-123",
    "name": "Product A",
    "price": { "value": 4999, "currency": "USD" },
    "quantity": 1
  }],
  "occurredAt": "2026-05-15T10:00:00Z"
}
```

Similar endpoints for `/add_to_cart`, `/product_view`, `/checkout`.

### Send transactional message

```bash
POST https://api.attentivemobile.com/v1/messages/transactional

{
  "user": { "phone": "+15551234567" },
  "messageBody": "Your order #1234 shipped. Track: https://...",
  "type": "ORDER_SHIPPING"
}
```

### List campaigns

```bash
GET https://api.attentivemobile.com/v1/campaigns
```

### Webhooks

Subscribe to: `subscriber.created`, `subscriber.unsubscribed`, `message.sent`, `message.delivered`, `message.failed`, `conversion.attributed`.

## API Pattern

REST + JSON. Bearer auth. Webhook signature verification via HMAC-SHA256.

## Key Features

- Concierge sales (live agents responding via SMS)
- Identity resolution (matching anonymous site visitors to phone numbers for retargeting)
- Strong analytics + attribution (multi-touch, conversion path)
- AI Journey AI / Pro AI (AI-generated send timing and copy)
- Custom Audience Manager (advanced segmentation)
- A/B testing built into campaign builder
- Two-way SMS at scale
- A2P 10DLC fully managed
- Short code provisioning included on most plans
- Dedicated CSM, copy support, strategy consults

## Pricing

- Custom contracts; typically $1K–$10K+/mo platform fee + per-send fees
- Annual contracts standard
- Pricing rarely makes sense for <50K active SMS subscribers
- Negotiable based on volume and tier

## When to Use

- Mid-market+ DTC brand (50K+ active SMS subscribers, $5M+/yr revenue)
- Want dedicated CSM and copy support, not just tooling
- Need concierge two-way SMS at scale
- Multi-channel ecom team that wants single-pane SMS-first platform
- Want short code included rather than separately leased
- Identity resolution / cross-device matching matters

## When NOT to Use

- Smaller brands — too expensive, overkill
- Already on Klaviyo and SMS is secondary — Klaviyo SMS is simpler
- Shopify-only and want depth — Postscript is more Shopify-native
- Custom platform / B2B SaaS — Twilio

## Relevant Skills

- sms
- emails (run alongside)
- churn-prevention
- customer-research (identity resolution data)
