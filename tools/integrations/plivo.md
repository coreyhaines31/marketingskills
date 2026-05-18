# Plivo

Cloud communications API platform — SMS, MMS, voice, WhatsApp. Direct Twilio competitor with similar pricing and developer-first positioning.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API |
| MCP | - | Not available |
| CLI | - | None official |
| SDK | ✓ | Node, Python, Ruby, PHP, Java, Go, .NET |

## Authentication

- **Type**: Basic auth with Auth ID + Auth Token
- **Header**: `Authorization: Basic base64(AuthID:AuthToken)`
- **Get credentials**: https://console.plivo.com → Account → Account Settings
- **Note**: Subaccounts available for isolating environments or customers

## Common Agent Operations

### Send SMS

```bash
POST https://api.plivo.com/v1/Account/{AuthID}/Message/

{
  "src": "+15559876543",
  "dst": "+15551234567",
  "text": "Hello from Plivo"
}
```

### Send MMS

```bash
POST https://api.plivo.com/v1/Account/{AuthID}/Message/

{
  "src": "+15559876543",
  "dst": "+15551234567",
  "text": "Check this out",
  "type": "mms",
  "media_urls": ["https://example.com/image.jpg"]
}
```

### Bulk send (powerpack)

Use Plivo's Powerpack feature to send from a pool of numbers with sticky sender + automatic A2P registration. Configured in console; messages then sent with `powerpack_uuid` instead of `src`.

```bash
POST https://api.plivo.com/v1/Account/{AuthID}/Message/

{
  "powerpack_uuid": "...",
  "dst": "+15551234567",
  "text": "Hello"
}
```

### Get message details

```bash
GET https://api.plivo.com/v1/Account/{AuthID}/Message/{MessageUUID}/
```

### List messages

```bash
GET https://api.plivo.com/v1/Account/{AuthID}/Message/?limit=20&offset=0
```

### Rent a phone number

```bash
# Search available
GET https://api.plivo.com/v1/Account/{AuthID}/PhoneNumber/?country_iso=US&type=local

# Rent
POST https://api.plivo.com/v1/Account/{AuthID}/PhoneNumber/{NumberID}/
```

### Configure inbound message webhook on an Application

```bash
POST https://api.plivo.com/v1/Account/{AuthID}/Application/

{
  "app_name": "SMS Receiver",
  "message_url": "https://your-app.com/sms-webhook",
  "message_method": "POST"
}
```

Then assign the application to the phone number.

### A2P 10DLC registration (US)

Configured through console UI under Compliance. Programmatic registration available for high-volume customers via dedicated API endpoints (request access).

## API Pattern

REST + JSON. Pagination via `limit` + `offset`. Webhook callbacks for inbound messages and delivery status (configured per-application).

## Pricing

- US 10DLC SMS: $0.0055/msg (typically lower than Twilio)
- US toll-free SMS: $0.0055/msg
- US short code SMS: similar + monthly lease
- MMS: ~$0.02
- Carrier surcharges layered on top
- Phone number rental: ~$0.80/mo local, ~$1/mo toll-free

Plivo typically prices 5–20% under Twilio at the per-send level. Less of an ecosystem advantage but real cost savings at high volume.

## Rate Limits

- Default: 1 msg/sec
- Powerpacks scale throughput based on number pool size and A2P trust
- Short codes: 100+ msg/sec

## When to Use

- Custom SMS build, want a Twilio-like API with lower cost
- High-volume sending where the per-message delta matters
- Want bulk sending with sticky sender via Powerpack
- B2B SaaS embedding SMS or transactional/auth at scale

## When NOT to Use

- DTC ecom marketing flows — Klaviyo, Postscript, Attentive
- Ecosystem matters more than price — Twilio's broader product surface (Voice, Studio, SendGrid, Segment, etc.) wins
- Need mature WhatsApp Business — Twilio has deeper WhatsApp tooling

## Relevant Skills

- sms
- onboarding (post-signup notifications)
