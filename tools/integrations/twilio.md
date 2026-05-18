# Twilio

Programmable communications platform: SMS, MMS, WhatsApp, voice, email (via SendGrid). The default low-level API for custom SMS builds, transactional messaging, and B2B SaaS embedding SMS into products.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API, well-documented, mature |
| MCP | - | Not available natively (community wrappers exist) |
| CLI | ✓ | Official `twilio` CLI |
| SDK | ✓ | Node, Python, Ruby, PHP, Java, Go, C#, .NET |

## Authentication

- **Type**: Basic auth with Account SID + Auth Token (or API Key SID + Secret)
- **Header**: `Authorization: Basic base64(AccountSID:AuthToken)`
- **Get credentials**: https://console.twilio.com → Account Info
- **Recommendation**: Use API Keys (revocable, scoped) for production rather than the master Auth Token

## Common Agent Operations

### Send SMS

```bash
POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json

To=+15551234567
From=+15559876543
Body=Hello from Twilio
```

### Send MMS

```bash
POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json

To=+15551234567
From=+15559876543
Body=Check this out
MediaUrl=https://example.com/image.jpg
```

### List messages

```bash
GET https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json?PageSize=50
```

### Get message status

```bash
GET https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages/{MessageSid}.json
```

Status values: `queued`, `sending`, `sent`, `delivered`, `undelivered`, `failed`.

### List phone numbers

```bash
GET https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/IncomingPhoneNumbers.json
```

### Buy a phone number

```bash
POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/IncomingPhoneNumbers.json

PhoneNumber=+15559876543
```

### Configure webhook for inbound messages

```bash
POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/IncomingPhoneNumbers/{Sid}.json

SmsUrl=https://your-app.com/sms-webhook
SmsMethod=POST
```

Inbound SMS POSTs to the webhook with: `From`, `To`, `Body`, `MessageSid`, `NumMedia`, etc.

### A2P 10DLC registration (US)

```bash
# Create brand
POST https://messaging.twilio.com/v1/a2p/BrandRegistrations

CustomerProfileBundleSid=...
A2PProfileBundleSid=...

# Create campaign
POST https://messaging.twilio.com/v1/Services/{ServiceSid}/Compliance/Usa2p

BrandRegistrationSid=...
Description=...
MessageSamples[]=Sample text 1
MessageFlow=Opt-in flow description
UseCase=MARKETING
```

Most workflows are clearer in the Console UI. Programmatic registration is for high-scale platforms managing many brands.

## API Pattern

REST + form-encoded request bodies (not JSON for most endpoints). Resources nested under Account: `/Accounts/{AccountSid}/...`. Pagination via `Page`, `PageSize`, `NextPageUri`.

## Key Concepts

- **Messaging Service**: virtual sender container; load-balances across multiple numbers, handles A2P registration grouping
- **Sticky Sender**: same recipient always receives from the same number within a service
- **Geo-Match**: route to a number matching the recipient's country/region
- **Status Callback**: webhook fired on every delivery state change
- **Carrier Lookup**: pre-send check for line type (mobile, landline, VoIP) — costs ~$0.005

## Pricing

- US 10DLC SMS: $0.0079/msg
- US toll-free SMS: $0.0079/msg
- US short code SMS: $0.0079/msg + $1,000/mo lease
- MMS: ~$0.02
- Carrier surcharges (~$0.005 US 10DLC)
- A2P 10DLC: ~$15 brand + $10/mo per campaign
- Phone number rental: $1.15/mo (10DLC) to $2/mo (toll-free)

## Rate Limits

- Default: 1 msg/sec on long codes (10DLC trust score raises this to 4–100+)
- Short code: 100+ msg/sec
- Messaging Services throttle automatically
- Carrier filtering applies above contracted throughput

## When to Use

- Building custom SMS flows into a product (B2B SaaS, mobile apps)
- Transactional and auth SMS (OTPs, alerts, notifications)
- Multi-channel orchestration (SMS + voice + WhatsApp)
- High-volume programmable messaging
- When you need full control and minimal abstraction
- Backing store for Customer.io / Segment / other orchestration layers

## When NOT to Use

- DTC ecom marketing flows — use Klaviyo, Postscript, or Attentive (better tooling for cart recovery, segments, A/B tests)
- If you don't want to handle compliance plumbing — Twilio gives you primitives, not policy
- Marketing UI for non-technical users — there isn't one

## Relevant Skills

- sms
- emails (transactional sister product via SendGrid)
- onboarding (post-signup SMS milestones)
