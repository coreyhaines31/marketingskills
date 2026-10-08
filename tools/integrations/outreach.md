# Outreach

Sales engagement platform for managing prospects, sequences, and outbound campaigns at scale.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Prospects, Sequences, Mailings, Accounts, Tasks |
| MCP | ✓ | Official remote server at `https://api.outreach.io/mcp/` (OAuth); requires a licensed seat and the Amplify add-on; no update tools yet ([docs](https://developers.outreach.io/mcp-server)) |
| CLI | ✓ | [outreach.js](../clis/outreach.js) |
| SDK | - | REST API only (JSON:API format) |

## Authentication

- **Type**: OAuth2 Bearer Token
- **Header**: `Authorization: Bearer {access_token}`
- **Content-Type**: `application/vnd.api+json`
- **Get token**: Settings > API at https://app.outreach.io or via OAuth2 flow

## Common Agent Operations

### List Prospects

```bash
curl -s https://api.outreach.io/api/v2/prospects \
  -H "Authorization: Bearer $OUTREACH_ACCESS_TOKEN" \
  -H "Content-Type: application/vnd.api+json"
```

### Get a Prospect

```bash
curl -s https://api.outreach.io/api/v2/prospects/42 \
  -H "Authorization: Bearer $OUTREACH_ACCESS_TOKEN" \
  -H "Content-Type: application/vnd.api+json"
```

### Create a Prospect

```bash
curl -s -X POST https://api.outreach.io/api/v2/prospects \
  -H "Authorization: Bearer $OUTREACH_ACCESS_TOKEN" \
  -H "Content-Type: application/vnd.api+json" \
  -d '{
    "data": {
      "type": "prospect",
      "attributes": {
        "emails": ["jane@example.com"],
        "firstName": "Jane",
        "lastName": "Doe"
      }
    }
  }'
```

### List Sequences

```bash
curl -s https://api.outreach.io/api/v2/sequences \
  -H "Authorization: Bearer $OUTREACH_ACCESS_TOKEN" \
  -H "Content-Type: application/vnd.api+json"
```

### Add Prospect to Sequence

```bash
curl -s -X POST https://api.outreach.io/api/v2/sequenceStates \
  -H "Authorization: Bearer $OUTREACH_ACCESS_TOKEN" \
  -H "Content-Type: application/vnd.api+json" \
  -d '{
    "data": {
      "type": "sequenceState",
      "relationships": {
        "prospect": { "data": { "type": "prospect", "id": 42 } },
        "sequence": { "data": { "type": "sequence", "id": 7 } },
        "mailbox": { "data": { "type": "mailbox", "id": 9 } }
      }
    }
  }'
```

For sequences with mailing steps, pass `--mailbox-id` to `sequence-states create`
to select the sending mailbox. It is included as the `mailbox` relationship.
Non-mail sequences can omit it. See
[add prospects to sequences](https://developers.outreach.io/api/common-patterns).


### List Mailings for a Sequence

```bash
curl -s "https://api.outreach.io/api/v2/mailings?filter[sequence][id]=7" \
  -H "Authorization: Bearer $OUTREACH_ACCESS_TOKEN" \
  -H "Content-Type: application/vnd.api+json"
```

### List Accounts

```bash
curl -s https://api.outreach.io/api/v2/accounts \
  -H "Authorization: Bearer $OUTREACH_ACCESS_TOKEN" \
  -H "Content-Type: application/vnd.api+json"
```

### List Tasks

```bash
curl -s "https://api.outreach.io/api/v2/tasks?filter[state]=incomplete" \
  -H "Authorization: Bearer $OUTREACH_ACCESS_TOKEN" \
  -H "Content-Type: application/vnd.api+json"
```

## Key Metrics

### Prospect Data
- `firstName`, `lastName` - Name
- `emails` - Email addresses
- `title` - Job title
- `company` - Company name
- `tags` - Prospect tags
- `engagedAt` - Last engagement timestamp

### Sequence Data
- `name` - Sequence name
- `enabled` - Whether sequence is active
- `sequenceType` - Type (e.g., interval, date-based)
- `stepCount` - Number of steps
- `openCount`, `clickCount`, `replyCount` - Engagement metrics

### Mailing Data
- `mailingType` - Type of mailing
- `state` - Delivery state
- `openCount`, `clickCount` - Engagement
- `deliveredAt`, `openedAt`, `clickedAt` - Timestamps

## Parameters

### Collection pagination

All CLI list commands support `--after <cursor>` or `--before <cursor>` plus `--per-page <n>` (maximum 1000). Take the opaque token from the API's `links.next` or `links.prev` URL; the CLI encodes it as `page[after]` or `page[before]` and preserves existing resource filters.

```bash
node tools/clis/outreach.js tasks list --state pending --after '<next-cursor>' --per-page 50
node tools/clis/outreach.js mailings list --sequence-id 123 --after '<next-cursor>'
```

The existing `--page <n>` spelling remains a compatibility option: it translates to the documented `page[offset]` and `page[limit]` using the requested size (default 50). Outreach deprecates offset pagination and caps the offset at 10,000; prefer cursor pagination for large collections. Cursor directions and `--page` cannot be combined. Default unfiltered requests remain unchanged. The CLI performs one request per invocation.

Source: [Outreach request and pagination contracts](https://developers.outreach.io/api/making-requests#pagination).

### Prospects
- `filter[emails]` - Filter by email
- `filter[firstName]` - Filter by first name
- `filter[lastName]` - Filter by last name
- `sort` - Sort field (e.g., `createdAt`, `-updatedAt`)

### Sequences
- `filter[name]` - Filter by sequence name
- `filter[enabled]` - Filter by active status

### Mailings
- `filter[sequence][id]` - Filter by sequence ID
- `filter[prospect][id]` - Filter by prospect ID

### Tasks
- `filter[state]` - Filter by state (e.g., `pending`, `incomplete`, `complete`)
- `filter[taskType]` - Filter by type (e.g., `call`, `email`, `action_item`)

## When to Use

- Managing outbound sales sequences and cadences
- Adding prospects to automated email sequences
- Tracking prospect engagement across touchpoints
- Managing sales tasks and follow-ups
- Coordinating multi-channel outreach campaigns
- Monitoring sequence performance and reply rates

## Rate Limits

- 10,000 requests per hour per user
- Burst limit: 100 requests per 10 seconds
- Rate limit headers returned: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- 429 responses when limits exceeded

## Relevant Skills

- cold-email
- revops
- sales-enablement
- emails

The task filter is `state` (`pending`, `incomplete`, or `complete`). Use
`tasks list --state incomplete`; the CLI retains `--status` as an alias.
See [discover open tasks](https://developers.outreach.io/api/common-patterns).

Without pagination flags the CLI leaves provider defaults untouched. The legacy
`--page` option explicitly uses a default limit of 50 when `--per-page` is absent;
cursor pagination uses `page[size]`, while legacy offsets use `page[limit]`.
