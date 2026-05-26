# Sequenzy

Email marketing platform for lifecycle campaigns, automation sequences, subscriber management, transactional email, and analytics.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for subscribers, tags, events, campaigns, sequences, templates, transactional email, analytics, and webhooks |
| MCP | ✓ | `@sequenzy/mcp` stdio server for agent clients |
| CLI | ✓ | `@sequenzy/cli` for subscriber operations, transactional sends, and stats |
| SDK | - | Use the REST API directly |

## Authentication

- **Type**: API Key
- **Header**: `Authorization: Bearer ***`
- **Base URL**: `https://api.sequenzy.com/api/v1`
- **Legacy base URL**: `https://api.sequenzy.com/v1`
- **Environment variable**: `SEQUENZY_API_KEY`

## MCP

### Quick setup

```bash
npx @sequenzy/setup
```

The setup wizard logs in, creates a personal API key, and configures supported MCP clients when possible.

### Manual MCP server config

```json
{
  "mcpServers": {
    "sequenzy": {
      "command": "npx",
      "args": ["-y", "@sequenzy/mcp"],
      "env": {
        "SEQUENZY_API_KEY": "seq_user_your_key_here"
      }
    }
  }
}
```

## CLI

### Install

```bash
# Using npx
npx sequenzy --help

# Or install globally
npm install -g @sequenzy/cli
```

### Login

```bash
sequenzy login
sequenzy whoami
```

### Common commands

```bash
# Subscribers
sequenzy subscribers list
sequenzy subscribers list --tag vip
sequenzy subscribers add user@example.com --tag premium --attr plan=pro
sequenzy subscribers get user@example.com
sequenzy subscribers remove user@example.com

# Transactional email
sequenzy send user@example.com --template welcome --var name=John
sequenzy send user@example.com --subject "Hello" --html "<h1>Hi!</h1>"

# Analytics
sequenzy stats
sequenzy stats --period 30d
sequenzy stats --campaign camp_abc123
sequenzy stats --sequence seq_xyz789
```

## Common Agent Operations

### Get account

```bash
GET https://api.sequenzy.com/api/v1/account

Authorization: Bearer ***
```

### List subscribers

```bash
GET https://api.sequenzy.com/api/v1/subscribers?page=1&limit=20&status=active&query=john&tags=customer,vip

Authorization: Bearer ***
```

### Create or update subscriber

```bash
POST https://api.sequenzy.com/api/v1/subscribers

Authorization: Bearer ***
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "tags": ["customer", "newsletter"],
  "customAttributes": {
    "plan": "pro"
  }
}
```

### Add tag to subscriber

```bash
POST https://api.sequenzy.com/api/v1/subscribers/tags

Authorization: Bearer ***
Content-Type: application/json

{
  "email": "user@example.com",
  "tag": "vip"
}
```

### Trigger event for subscriber

```bash
POST https://api.sequenzy.com/api/v1/subscribers/events

Authorization: Bearer ***
Content-Type: application/json

{
  "email": "user@example.com",
  "event": "trial_started",
  "properties": {
    "plan": "pro"
  }
}
```

### List campaigns

```bash
GET https://api.sequenzy.com/api/v1/campaigns

Authorization: Bearer ***
```

### Create draft campaign

Create a draft campaign and linked email. A sender profile must already be configured.

```bash
POST https://api.sequenzy.com/api/v1/campaigns

Authorization: Bearer ***
Content-Type: application/json

{
  "name": "April Launch",
  "subject": "A quick update",
  "labels": ["launch"],
  "html": "<p>Hello there!</p>"
}
```

### Send campaign test

```bash
POST https://api.sequenzy.com/api/v1/campaigns/{campaignId}/test

Authorization: Bearer ***
Content-Type: application/json

{
  "to": "reviewer@example.com"
}
```

### Schedule campaign

```bash
POST https://api.sequenzy.com/api/v1/campaigns/{campaignId}/schedule

Authorization: Bearer ***
Content-Type: application/json

{
  "scheduledAt": "2026-05-20T15:00:00Z"
}
```

### List sequences

```bash
GET https://api.sequenzy.com/api/v1/sequences

Authorization: Bearer ***
```

### Enable or disable sequence

```bash
POST https://api.sequenzy.com/api/v1/sequences/{sequenceId}/enable
POST https://api.sequenzy.com/api/v1/sequences/{sequenceId}/disable

Authorization: Bearer ***
```

### Send transactional email

Send via a saved template slug or by passing direct subject/body content.

```bash
POST https://api.sequenzy.com/api/v1/transactional/send

Authorization: Bearer ***
Content-Type: application/json

{
  "to": "user@example.com",
  "slug": "welcome",
  "variables": {
    "name": "John"
  },
  "subscriberExternalId": "user_123"
}
```

### Get metrics

```bash
GET https://api.sequenzy.com/api/v1/metrics
GET https://api.sequenzy.com/api/v1/metrics/campaigns/{campaignId}
GET https://api.sequenzy.com/api/v1/metrics/sequences/{sequenceId}
GET https://api.sequenzy.com/api/v1/metrics/recipients

Authorization: Bearer ***
```

### Webhooks

```bash
GET https://api.sequenzy.com/api/v1/webhooks
POST https://api.sequenzy.com/api/v1/webhooks
PATCH https://api.sequenzy.com/api/v1/webhooks/{id}
DELETE https://api.sequenzy.com/api/v1/webhooks/{id}
POST https://api.sequenzy.com/api/v1/webhooks/{id}/test

Authorization: Bearer ***
```

## Key Concepts

- **Subscribers** - Contacts with email, status, tags, custom attributes, and optional external IDs
- **Tags** - Lightweight labels used for targeting and segmentation
- **Segments** - Dynamic subscriber groups based on attributes or engagement
- **Campaigns** - Draftable and schedulable one-time marketing sends
- **Sequences** - Automated lifecycle flows that can be enabled, disabled, and measured
- **Templates** - Reusable email content for transactional and marketing workflows
- **Transactional emails** - Single-recipient or small batch sends triggered by product events
- **Engagement metrics** - Sent, delivered, bounced, opened, clicked, unsubscribed, and derived rates

## Safety Notes

- Inspect account, sender profile, audience, and target objects before mutating anything.
- Prefer creating drafts and sending tests before scheduling or enabling live delivery.
- Do not schedule a campaign, enable a sequence, or send a live transactional email without explicit approval.
- Use recipient status, bounce, complaint, and unsubscribe data to avoid sending to suppressed contacts.
- Use direct API calls for high-volume or scripted operations; use MCP or CLI for agent-driven interactive workflows.

## When to Use

- Managing subscribers, tags, lists, and segments
- Drafting and scheduling lifecycle campaigns
- Building onboarding, activation, retention, or winback sequences
- Sending product-triggered transactional emails
- Reviewing campaign, sequence, and recipient engagement metrics
- Connecting AI agents to email marketing operations through MCP

## Rate Limits

- Check the latest Sequenzy API documentation for plan-specific limits.
- Use pagination for list endpoints; subscriber lists support `page` and `limit` with a maximum limit of 100.

## Relevant Skills

- emails
- onboarding
- analytics
- launch
