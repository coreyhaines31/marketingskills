# SavvyCal

Scheduling platform API for managing scheduling links, events, availability slots, and webhooks.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API v1 - scheduling links, events, webhooks |
| MCP | - | Not available |
| CLI | ✓ | [savvycal.js](../clis/savvycal.js) |
| SDK | - | No official SDK |

## Authentication

- **Type**: Bearer Token (Personal Access Token or OAuth 2.0)
- **Header**: `Authorization: Bearer {token}`
- **Get key**: Developer Settings in SavvyCal dashboard (create a Personal Access Token)

## Common Agent Operations

### Get current user

```bash
GET https://api.savvycal.com/v1/me
```

### List scheduling links

```bash
GET https://api.savvycal.com/v1/links
```

### Get a scheduling link

```bash
GET https://api.savvycal.com/v1/links/{id}
```

### Create a scheduling link

```bash
POST https://api.savvycal.com/v1/links

{
  "name": "Introductory Meeting"
}
```

The personal-link endpoint creates a link for the current authenticated user. These examples use the documented `name` field; configure meeting duration and URL details in SavvyCal rather than assuming undocumented request fields take effect.

### Update a scheduling link

```bash
PATCH https://api.savvycal.com/v1/links/{id}

{
  "name": "Updated Meeting Name"
}
```

### Delete a scheduling link

```bash
DELETE https://api.savvycal.com/v1/links/{id}
```

### Duplicate a scheduling link

```bash
POST https://api.savvycal.com/v1/links/{id}/duplicate
```

### Toggle link state (active/disabled)

```bash
POST https://api.savvycal.com/v1/links/{id}/toggle
```

### Get available time slots

```bash
GET https://api.savvycal.com/v1/links/{id}/slots
```

### List events

```bash
GET https://api.savvycal.com/v1/events
```

### Get an event

```bash
GET https://api.savvycal.com/v1/events/{id}
```

### Create an event

```bash
POST https://api.savvycal.com/v1/links/{link_id}/events

{
  "start_at": "2024-01-20T10:00:00Z",
  "end_at": "2024-01-20T10:30:00Z",
  "time_zone": "America/New_York",
  "display_name": "John Doe",
  "email": "john@example.com"
}
```

The CLI maps `--name` to `display_name` and requires the booking start, end, and
attendee time zone. Choose an available slot for the scheduling link:

```bash
node tools/clis/savvycal.js events create --link-id link_123 \
  --start-at 2024-01-20T10:00:00Z --end-at 2024-01-20T10:30:00Z \
  --time-zone America/New_York --name "John Doe" --email john@example.com
```

See the official [create event contract](https://developers.savvycal.com/api/create-event).

### Cancel an event

```bash
POST https://api.savvycal.com/v1/events/{id}/cancel
```

### List webhooks

```bash
GET https://api.savvycal.com/v1/webhooks
```

### Create a webhook

```bash
POST https://api.savvycal.com/v1/webhooks

{
  "url": "https://example.com/webhook",
  "events": ["event.created", "event.canceled"]
}
```

## Key Metrics

### Scheduling Link Data
- `id` - Unique link identifier
- `name` - Display name
- `slug` - URL slug
- `duration_minutes` - Meeting duration
- `state` - Active or disabled
- `url` - Full scheduling URL

### Event Data
- `id` - Unique event identifier
- `name` - Invitee name
- `email` - Invitee email
- `start_at` / `end_at` - Event timing
- `status` - Event status
- `scheduling_link` - Associated scheduling link

## Parameters

### List Events
- `before` / `after` - Pagination cursors
- `limit` - Results per page (default 20, max 100)

### List Scheduling Links
- `before` / `after` - Pagination cursors
- `limit` - Results per page

## When to Use

- Managing scheduling links programmatically
- Retrieving booked events for CRM or analytics sync
- Checking available time slots for custom booking UIs
- Automating scheduling link creation for campaigns
- Monitoring booking activity via webhooks

## Rate Limits

- Not officially documented
- Implement retry logic with exponential backoff
- Monitor for HTTP 429 responses

## Relevant Skills

- lead-generation
- sales-automation
- appointment-scheduling
- customer-onboarding

## API References

- [Scheduling-link endpoints](https://developers.savvycal.com/api/scheduling-links)
- [Create-link request fields](https://developers.savvycal.com/api/schemas/createlinkrequest)
- [Update-link request fields](https://developers.savvycal.com/api/schemas/updatelinkrequest)
