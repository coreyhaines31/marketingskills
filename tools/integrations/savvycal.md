# SavvyCal

Scheduling platform with a REST API for scheduling links, available time slots, events, webhooks, and workflows, plus a hosted MCP server.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API v1 - scheduling links, slots, events, webhooks, workflows, time zones |
| MCP | ✓ | Official remote server at `https://savvycal.com/mcp` (OAuth with dynamic client registration, no API key) ([docs](https://docs.savvycal.com/integrating-with-ai-assistants)), checked 2026-10-28 |
| CLI | ✓ | [savvycal.js](../clis/savvycal.js) |
| SDK | - | No official SDK |

## Authentication

- **Type**: Bearer Token (Personal Access Token or OAuth 2.0)
- **Header**: `Authorization: Bearer {token}`
- **Get key**: [Developer Settings](https://savvycal.com/developers) in SavvyCal (create a Personal Access Token). OAuth access tokens expire after 2 hours and are refreshed with the refresh token. See [Authentication](https://docs.savvycal.com/developers/authentication).

## MCP

The MCP server acts as the signed-in user and covers more than the REST API, including schedules and availability overrides, contacts, meeting polls, teams, and writing workflows. Tools include `list_events`, `list_links`, `list_link_slots`, `create_booking`, `reschedule_booking`, `cancel_booking`, `create_link`, `update_link`, `create_schedule_override`, and `list_people`. The [help article](https://docs.savvycal.com/integrating-with-ai-assistants#tools) lists every tool. Tools for actions that are hard to undo, like canceling a meeting or deleting a link, return a summary and a `confirmation_token`, and run only when called again with the token after the user confirms.

```bash
claude mcp add --transport http savvycal https://savvycal.com/mcp
```

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
GET https://api.savvycal.com/v1/links/{link_id}
```

The response includes the link's `fields` (custom questions), which you need to answer when creating an event.

### Create a scheduling link

```bash
POST https://api.savvycal.com/v1/links

{
  "name": "Introductory Meeting",
  "slug": "intro",
  "description": "A quick call to get to know each other",
  "type": "recurring"
}
```

Creates the link in the current user's personal scope. Only `name` is required. `type` is `recurring` (Multi-Use) or `single` (Single-Use). Durations and availability aren't API fields; set them in SavvyCal or through the MCP server.

To create a link in a team scope, pass the team's slug (or `personal`):

```bash
POST https://api.savvycal.com/v1/scopes/{scope_slug}/links
```

### Update a scheduling link

```bash
PATCH https://api.savvycal.com/v1/links/{link_id}

{
  "name": "Updated Meeting Name"
}
```

Accepts the same fields as create: `name`, `slug`, `description`, `private_name`, and `type`.

### Delete a scheduling link

```bash
DELETE https://api.savvycal.com/v1/links/{link_id}
```

Returns the link with state `deleted`.

### Duplicate a scheduling link

```bash
POST https://api.savvycal.com/v1/links/{link_id}/duplicate
```

### Toggle link state

```bash
POST https://api.savvycal.com/v1/links/{link_id}/toggle
```

Disables an active or pending link, or enables a disabled or archived link. An enabled link that can't take bookings yet becomes `pending`.

### Get available time slots

```bash
GET https://api.savvycal.com/v1/links/{link_id}/slots?from=2026-11-02T00:00:00Z&until=2026-11-09T00:00:00Z
```

Returns an array of slots with `start_at`, `end_at`, `duration`, and `rank`.

### List events

```bash
GET https://api.savvycal.com/v1/events?period=upcoming&state=confirmed
```

### Get an event

```bash
GET https://api.savvycal.com/v1/events/{event_id}
```

`event_id` can be the event's `id` or `uuid`.

### Create an event

```bash
POST https://api.savvycal.com/v1/links/{link_id}/events

{
  "start_at": "2026-11-03T15:00:00Z",
  "end_at": "2026-11-03T15:30:00Z",
  "time_zone": "America/New_York",
  "display_name": "John Doe",
  "email": "john@example.com"
}
```

`start_at` and `end_at` must match an available slot from the slots endpoint. The link must be active and editable by the current user, or the request returns `404`. Optional fields:

- `phone_number` - E.164 format, like `+15555555555` (required if the link always gathers a phone number)
- `fields` - Answers to the link's custom fields, each with the field's `id`, `type`, and `label`, plus `value` (text fields) or `options` (choice fields)
- `metadata` - Arbitrary key/value data, returned on the event and in webhooks

For Zoom and some other conferencing providers, meeting details may be missing from the response and attached to the event later.

The CLI maps `--name` to `display_name`:

```bash
node tools/clis/savvycal.js events create --link-id link_123 \
  --start-at 2026-11-03T15:00:00Z --end-at 2026-11-03T15:30:00Z \
  --time-zone America/New_York --name "John Doe" --email john@example.com
```

### Cancel an event

```bash
POST https://api.savvycal.com/v1/events/{event_id}/cancel

{
  "cancel_reason": "Something came up"
}
```

`cancel_reason` is optional (up to 1,500 characters). Returns `404` if the event is already canceled or can't be canceled.

### List webhooks

```bash
GET https://api.savvycal.com/v1/webhooks
```

### Create a webhook

```bash
POST https://api.savvycal.com/v1/webhooks

{
  "url": "https://example.com/webhook"
}
```

A webhook receives every event type; there's no per-webhook filter. Types include `event.created`, `event.requested`, `event.approved`, `event.declined`, `event.rescheduled`, `event.changed`, `event.canceled`, `event.checkout.*`, `event.attendee.*`, `poll.response.*`, and `workflow.action.triggered`. Each delivery has an `x-savvycal-signature` header of `sha256=` followed by the uppercase hex HMAC-SHA256 of the raw body, keyed with the webhook's `secret`. See [Webhooks](https://docs.savvycal.com/developers/webhooks).

### Get or delete a webhook

```bash
GET https://api.savvycal.com/v1/webhooks/{webhook_id}
DELETE https://api.savvycal.com/v1/webhooks/{webhook_id}
```

### List workflows and their rules

```bash
GET https://api.savvycal.com/v1/workflows
GET https://api.savvycal.com/v1/workflows/{workflow_id}/rules
```

## Key Metrics

### Scheduling Link Data
- `id` - Unique link identifier
- `name` / `private_name` - Public and internal names
- `slug` - URL slug; the booking URL is `https://savvycal.com/{scope.slug}/{slug}` unless the scope uses a custom domain
- `scope` - The personal or team scope (`id`, `name`, `slug`)
- `durations` / `default_duration` - Meeting lengths in minutes
- `state` - `active`, `pending`, `disabled`, or `archived`
- `fields` - Custom questions asked at booking

### Event Data
- `id` - Unique event identifier
- `summary` - Event title
- `start_at` / `end_at` - Event timing
- `state` - `confirmed`, `canceled`, `awaiting_approval`, `declined`, `awaiting_checkout`, and others
- `scheduler` - The person who booked (`display_name`, `email`, `time_zone`, `fields`); `null` for group sessions and poll bookings
- `attendees` - Everyone on the event
- `link` - The scheduling link it was booked on
- `metadata` - Data passed in at booking
- `payment` - Payment details for paid events
- `created_at` / `canceled_at` / `rescheduled_at` - Lifecycle timestamps

## Parameters

### Pagination (links, events, webhooks)
- `limit` - Results per page (default 20, max 100)
- `before` / `after` - Cursors from `metadata.before` / `metadata.after` in the previous response; results are in `entries`

### List Events

If any filter value is invalid, such as an unparseable date, every filter falls back to its default.

- `period` - `upcoming` (default), `past`, `fixed`, or `all`
- `from` / `until` - Date range (`YYYY-MM-DD`) when `period` is `fixed`
- `time_zone` - Time zone for `from` and `until` (defaults to the user's)
- `state` - `confirmed`, `canceled`, `tentative`, `all`, and others; defaults to `awaiting_approval` when events await the user's approval, otherwise `confirmed`
- `link` - Only events on this link ID
- `attendance` - `attending` (default) or `any`
- `q` - Search text (summary, description, link, attendee names and emails)
- `direction` - `asc` (default) or `desc` by start time

### List Scheduling Links
- `state` - `active`, `pending`, `disabled`, or `archived` (defaults to all but archived)
- `scope` - A scope ID
- `q` - Search text (name, private name, description, slug, scope slug)

### Get Available Time Slots
- `from` - Start of the range (defaults to now)
- `until` - End of the range (defaults to 7 days after `from`, max 31 days)

## When to Use

- Managing scheduling links programmatically
- Retrieving booked events for CRM or analytics sync
- Checking available time slots for custom booking UIs
- Booking meetings for prospects from an outbound or inbound flow
- Monitoring booking activity via webhooks
- Passing attribution data through a booking with `metadata`

## Rate Limits

- Creating events: 10 requests per minute per scheduling link, including failed requests. Over the limit returns HTTP 429.
- Other limits aren't documented. Retry 429 responses with exponential backoff.

## Relevant Skills

- cold-email
- revops
- attribution

## API References

- [API reference](https://docs.savvycal.com/developers/v1/api)
- [Authentication](https://docs.savvycal.com/developers/authentication)
- [Webhooks](https://docs.savvycal.com/developers/webhooks)
- [Create event](https://docs.savvycal.com/developers/v1/api/create-event)
- [MCP server](https://docs.savvycal.com/integrating-with-ai-assistants)
