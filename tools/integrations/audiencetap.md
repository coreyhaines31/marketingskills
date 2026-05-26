# AudienceTap

SMS and email marketing platform built for direct-to-consumer brands. Newer entrant positioning as a more flexible, AI-forward alternative to Klaviyo / Postscript / Attentive with emphasis on creative automation and on-pack QR opt-in.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API (confirm with vendor; access tied to plan tier) |
| MCP | - | Not available |
| CLI | - | None |
| SDK | - | Use API directly |

> Verify current API surface and capabilities at https://audiencetap.com before building against this guide — newer platform, surface evolves quickly.

## Authentication

- **Type**: API Key (Bearer)
- **Header**: `Authorization: Bearer {api_key}`
- **Get key**: AudienceTap dashboard → Settings → API
- **Note**: API access generally requires Growth or Pro tier

## Common Agent Operations

### Subscribe a user

```bash
POST https://api.audiencetap.com/v1/subscribers

{
  "phone_number": "+15551234567",
  "email": "user@example.com",
  "first_name": "Jane",
  "opt_in_source": "checkout",
  "list_id": "..."
}
```

### Unsubscribe

```bash
POST https://api.audiencetap.com/v1/subscribers/unsubscribe

{
  "phone_number": "+15551234567",
  "channel": "sms"
}
```

### Track event

```bash
POST https://api.audiencetap.com/v1/events

{
  "subscriber": { "phone_number": "+15551234567" },
  "event_name": "abandoned_cart",
  "properties": {
    "cart_value": 89.99,
    "items": ["Product A"]
  }
}
```

### Send transactional message

```bash
POST https://api.audiencetap.com/v1/messages/transactional

{
  "phone_number": "+15551234567",
  "body": "Your order #1234 shipped. Track: https://...",
  "category": "shipping"
}
```

### List flows / automations

```bash
GET https://api.audiencetap.com/v1/flows
```

### Webhooks

Subscribe to: subscriber events, message delivery events, conversion attribution. Configured in dashboard.

## API Pattern

REST + JSON. Bearer auth. Pagination conventions vary by endpoint — confirm in current docs.

## Key Features

- SMS + email on one platform (positioned similarly to Klaviyo's combined product)
- AI creative generation (subject lines, SMS copy, image variants)
- On-pack QR code opt-in (insert-card based opt-in for ecom shipments)
- Shopify, BigCommerce, and headless commerce integrations
- A2P 10DLC handled in-platform
- Automation builder for cart, post-purchase, win-back, etc.
- Identity resolution (matching anonymous visitors to known subscribers)

## Pricing

- Plans typically tiered by subscriber count + send volume
- Per-send pricing comparable to other DTC SMS platforms (~$0.015 SMS, ~$0.04 MMS)
- Confirm current pricing at https://audiencetap.com — newer platform with evolving plans

## When to Use

- Mid-market DTC brand willing to try a newer platform for better AI tooling or pricing leverage
- Brand wanting on-pack QR opt-in as a primary acquisition channel (printed insert cards driving SMS opt-in)
- Want SMS + email under one roof with stronger AI features than incumbents currently offer
- Evaluating alternatives during a contract negotiation with Klaviyo / Postscript / Attentive

## When NOT to Use

- Need a fully battle-tested platform with deep ecosystem — incumbents have more integrations and case studies
- Compliance tooling at enterprise scale — verify A2P / TCPA depth before committing for large lists
- B2B SaaS, transactional, or developer-first use — Twilio or Plivo

## Relevant Skills

- sms
- emails
- referrals (on-pack QR opt-in is a referral-adjacent acquisition channel)
- directory-submissions (on-pack insert cards as an offline channel)
