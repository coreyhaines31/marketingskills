# Mailchimp

Email marketing platform for campaigns, automation, and audience management.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Marketing API for campaigns, audiences, automation |
| MCP | ✓ | Available via Mailchimp MCP server |
| CLI | - | Not available |
| SDK | ✓ | Official SDKs for multiple languages |

## Authentication

- **Type**: API Key or OAuth 2.0
- **Header**: `Authorization: Bearer {api_key}` or `Authorization: apikey {api_key}`
- **Base URL**: `https://{dc}.api.mailchimp.com/3.0/` (dc = datacenter from API key)

## Updating member tags

`members update <subscriber_hash> --list-id <list_id> --tags newsletter,trial` activates named tags through Mailchimp's member-tags endpoint. This adds the requested tags and does not replace or remove existing tags. Member creation still accepts its supported string-array `--tags` field.

Tag changes and member profile/status changes use separate API endpoints. Run them as separate commands; combining `--tags` with `--status`, `--first-name` or `--last-name` is rejected before either write. A tag-only preview shows the POST `/lists/{list_id}/members/{subscriber_hash}/tags` request with `{tags: [{name, status: "active"}]}`. Its successful response is HTTP 204 with no JSON body.

## Common Agent Operations

### List audiences (lists)

```bash
GET https://{dc}.api.mailchimp.com/3.0/lists
```

### Get audience members

```bash
GET https://{dc}.api.mailchimp.com/3.0/lists/{list_id}/members?count=100
```

### Add subscriber

```bash
POST https://{dc}.api.mailchimp.com/3.0/lists/{list_id}/members

{
  "email_address": "user@example.com",
  "status": "subscribed",
  "merge_fields": {
    "FNAME": "John",
    "LNAME": "Doe"
  }
}
```

### Update subscriber

```bash
PATCH https://{dc}.api.mailchimp.com/3.0/lists/{list_id}/members/{subscriber_hash}

{
  "merge_fields": {
    "FNAME": "Jane"
  },
  "tags": ["customer", "premium"]
}
```

### Get campaigns

```bash
GET https://{dc}.api.mailchimp.com/3.0/campaigns?count=20
```

### Get campaign report

```bash
GET https://{dc}.api.mailchimp.com/3.0/reports/{campaign_id}
```

### Create campaign

```bash
POST https://{dc}.api.mailchimp.com/3.0/campaigns

{
  "type": "regular",
  "recipients": {
    "list_id": "{list_id}"
  },
  "settings": {
    "subject_line": "Your Subject",
    "from_name": "Your Name",
    "reply_to": "reply@example.com"
  }
}
```

### Send campaign

```bash
POST https://{dc}.api.mailchimp.com/3.0/campaigns/{campaign_id}/actions/send
```

### List automations

```bash
GET https://{dc}.api.mailchimp.com/3.0/automations
```

## Key Metrics

### Campaign Report Fields
- `emails_sent` - Total sent
- `opens` - Open count
- `unique_opens` - Unique opens
- `open_rate` - Open rate
- `clicks` - Click count
- `click_rate` - Click rate
- `unsubscribes` - Unsubscribe count
- `bounces` - Bounce count

### Subscriber Hash

Calculate subscriber hash for updates:
```javascript
const hash = md5(email.toLowerCase());
```

## Subscriber Statuses

- `subscribed` - Active subscriber
- `unsubscribed` - Unsubscribed
- `cleaned` - Hard bounce
- `pending` - Awaiting confirmation
- `transactional` - Transactional only

## When to Use

- Managing email lists and subscribers
- Creating and sending email campaigns
- Setting up email automation
- Analyzing campaign performance
- Segmenting audiences
- A/B testing emails

## Rate Limits

- 10 concurrent connections
- 10 requests per second
- Batch endpoints for bulk operations

## Relevant Skills

- emails
- analytics
- referrals
