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

- email-sequence
- onboarding-cro
