# Resend

Developer-friendly transactional email service with modern API.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Simple REST API for sending emails |
| MCP | ✓ | Available via Resend MCP server |
| CLI | ✓ | Official Resend CLI |
| SDK | ✓ | Official SDKs for Node.js, Python, Go, etc. |

## Authentication

- **Type**: API Key
- **Header**: `Authorization: Bearer {api_key}`
- **Get key**: API Keys section in Resend dashboard

## CLI

### Install

```bash
npm install -g resend-cli
```

### Setup

```bash
resend login
# or set env var: RESEND_API_KEY=re_xxx
```

### Common commands

```bash
# Send a test email
resend emails send --from hello@example.com --to user@example.com --subject "Test" --text "Hello"

# List recent emails
resend emails list

# Get email status
resend emails get <email_id>

# List domains
resend domains list

# Add a domain
resend domains create --name example.com

# Verify a domain
resend domains verify <domain_id>

# List API keys
resend api-keys list

# Create an API key
resend api-keys create --name "Production"
```

## Common Agent Operations

### Send email

```bash
POST https://api.resend.com/emails

{
  "from": "hello@example.com",
  "to": ["user@example.com"],
  "subject": "Welcome!",
  "html": "<h1>Welcome to our app!</h1>"
}
```

### Send with React template

```bash
POST https://api.resend.com/emails

{
  "from": "hello@example.com",
  "to": ["user@example.com"],
  "subject": "Welcome!",
  "react": "WelcomeEmail",
  "props": {
    "name": "John"
  }
}
```

### Get email status

```bash
GET https://api.resend.com/emails/{email_id}
```

### List emails

```bash
GET https://api.resend.com/emails
```

### Send batch emails

```bash
POST https://api.resend.com/emails/batch

[
  {
    "from": "hello@example.com",
    "to": ["user1@example.com"],
    "subject": "Welcome User 1"
  },
  {
    "from": "hello@example.com",
    "to": ["user2@example.com"],
    "subject": "Welcome User 2"
  }
]
```

### List domains

```bash
GET https://api.resend.com/domains
```

### Verify domain

```bash
POST https://api.resend.com/domains/{domain_id}/verify
```

## Node.js SDK

### Install

```bash
npm install resend
```

### Usage

```typescript
import { Resend } from 'resend';

const resend = new Resend('re_xxx');

await resend.emails.send({
  from: 'hello@example.com',
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<h1>Welcome!</h1>'
});
```

### With React Email

```typescript
import { WelcomeEmail } from './emails/welcome';

await resend.emails.send({
  from: 'hello@example.com',
  to: 'user@example.com',
  subject: 'Welcome!',
  react: WelcomeEmail({ name: 'John' })
});
```

## Email Statuses

- `queued` - Email queued for delivery
- `sent` - Email sent to recipient server
- `delivered` - Email delivered
- `opened` - Email opened (if tracking enabled)
- `clicked` - Link clicked (if tracking enabled)
- `bounced` - Email bounced
- `complained` - Marked as spam

## Webhook Events

| Event | When |
|-------|------|
| `email.sent` | Email sent |
| `email.delivered` | Email delivered |
| `email.opened` | Email opened |
| `email.clicked` | Link clicked |
| `email.bounced` | Email bounced |
| `email.complained` | Spam complaint |

## When to Use

- Sending transactional emails
- Welcome emails, password resets
- Receipt and notification emails
- Developer-friendly email integration
- React-based email templates
- Quick CLI testing of email flows without writing code

## Rate Limits

- Free: 100 emails/day, 3,000/month
- Pro: 100 emails/second
- Higher limits on scale plans

## Relevant Skills

- emails
- onboarding

## Retry identity in the bundled CLI

For single `send` and whole `batch` operations, pass `--idempotency-key <stable_key>` to send the `Idempotency-Key` header. Use one key per logical send and retain the same payload/key when retrying; use a new key for a different send. The CLI accepts 1–256 printable ASCII characters, forwards the caller's key, and never generates a new key or retries automatically.

```bash
node tools/clis/resend.js send --from sender@example.org --to user@example.org --subject Welcome --text Hello --idempotency-key welcome/user-123 --dry-run
```

Resend retains keys for 24 hours. Reusing a key with a different payload returns a conflict; once retention expires it cannot prevent duplicates. This is a provider feature, not permanent exactly-once delivery. See [Resend idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys). Dry runs show the key with authentication redacted; contract tests use fixtures and send no email.

## Paging bundled CLI collections

The `emails list`, `domains list`, `broadcasts list`, `segments list`, `api-keys list` and `templates list` commands accept `--limit <1-100>` and either `--after <id>` or `--before <id>`. Inspect the provider's `has_more` and returned object IDs, then request the next page manually. The CLI preserves raw responses and does not silently aggregate or issue more calls.

```bash
node tools/clis/resend.js emails list --limit 100 --after <last_email_id> --dry-run
```

No flags retains provider defaults, including unpaginated legacy lists where the provider returns all items unless a limit is supplied. Supplying both directions, an empty cursor or an invalid limit fails before fetch. See [Resend pagination](https://resend.com/docs/api-reference/pagination); fixtures verify request construction without live account calls.
