# Close

Sales CRM for SMBs with built-in calling, email, and pipeline management designed for high-velocity sales teams.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Leads, Contacts, Opportunities, Activities, Tasks |
| MCP | ✓ | Official remote server at `https://mcp.close.com/mcp` (OAuth) with read, safe-write, and destructive-write scopes ([docs](https://developer.close.com/mcp)) |
| CLI | ✓ | [close.js](../clis/close.js) |
| SDK | - | REST API only |

## Authentication

- **Type**: Basic Auth
- **Header**: `Authorization: Basic {base64(api_key + ':')}`
- **Get key**: Settings > API Keys at https://app.close.com

## Common Agent Operations

### List Leads

```bash
GET https://api.close.com/api/v1/lead/

Authorization: Basic {base64(api_key + ':')}
```

### Search Leads

```bash
GET https://api.close.com/api/v1/lead/?query=company_name

Authorization: Basic {base64(api_key + ':')}
```

### Create Lead

```bash
POST https://api.close.com/api/v1/lead/

{
  "name": "Acme Corp",
  "url": "https://acme.com",
  "description": "Enterprise prospect"
}
```

### Get Contact

```bash
GET https://api.close.com/api/v1/contact/{contact_id}/

Authorization: Basic {base64(api_key + ':')}
```

### Create Contact

```bash
POST https://api.close.com/api/v1/contact/

{
  "lead_id": "lead_xxx",
  "name": "Jane Smith",
  "emails": [{ "email": "jane@acme.com", "type": "office" }],
  "phones": [{ "phone": "+15551234567", "type": "office" }]
}
```

### Create Opportunity

```bash
POST https://api.close.com/api/v1/opportunity/

{
  "lead_id": "lead_xxx",
  "value": 50000,
  "status_id": "stat_xxx"
}
```

To select a stage when creating an opportunity, retrieve an ID from
`GET https://api.close.com/api/v1/status/opportunity/` and pass
`--status-id stat_xxx` to the CLI. `--status` is accepted as an ID alias.
The `active`, `won`, and `lost` types describe statuses; they cannot select a
specific stage when creating an opportunity. Omitting both flags uses the
organization default status. See the official
[create opportunity](https://developer.close.com/api/resources/opportunities/create)
and [list opportunity statuses](https://developer.close.com/api/resources/opportunity-statuses/list) contracts.

### List Activities

```bash
GET https://api.close.com/api/v1/activity/?lead_id=lead_xxx

Authorization: Basic {base64(api_key + ':')}
```

### Create Task

```bash
POST https://api.close.com/api/v1/task/

{
  "lead_id": "lead_xxx",
  "text": "Follow up on demo request",
  "_type": "lead",
  "date": "2026-03-10"
}
```

## Key Metrics

### Lead Data
- `id` - Lead ID
- `display_name` - Lead name
- `url` - Website URL
- `description` - Lead description
- `status_id` - Pipeline status
- `contacts` - Associated contacts
- `opportunities` - Associated opportunities
- `tasks` - Associated tasks

### Contact Data
- `id` - Contact ID
- `lead_id` - Parent lead
- `name` - Full name
- `title` - Job title
- `emails` - Email addresses array
- `phones` - Phone numbers array

### Opportunity Data
- `id` - Opportunity ID
- `lead_id` - Parent lead
- `value` - Value in cents
- `status_type` - active, won, or lost
- `confidence` - Win probability (0-100)
- `date_won` - Close date

### Task Data
- `id` - Task ID
- `lead_id` - Parent lead
- `text` - Task description
- `assigned_to` - Assigned user ID
- `date` - Due date
- `is_complete` - Completion status

## Parameters

### Leads
- `query` - Search query string
- `_skip` - Number of results to skip (pagination)
- `_limit` - Max results to return (default: 100)
- `_fields` - Comma-separated fields to return

### Contacts
- `lead_id` - Filter by parent lead
- `_skip` - Pagination offset
- `_limit` - Max results

### Opportunities
- `lead_id` - Filter by parent lead
- `status` - Filter by status type (active, won, lost)
- `_skip` - Pagination offset
- `_limit` - Max results

### Activities
- `lead_id` - Filter by lead
- `_type__type` - Filter by type (Email, Call, Note, SMS, Meeting)
- `date_created__gt` - After date
- `date_created__lt` - Before date

### Tasks
- `assigned_to` - Filter by user ID
- `is_complete` - Filter by completion (true/false)
- `lead_id` - Filter by lead
- `_type` - Task type (lead)

## When to Use

- Managing SMB sales pipelines with high-touch outreach
- Tracking sales activities (calls, emails, meetings) per lead
- Creating and managing tasks for sales follow-ups
- Opportunity tracking and revenue forecasting
- Building automated outreach workflows
- Sales team performance reporting

## Rate Limits

- Rate limits based on organization plan
- Standard: ~100 requests/minute
- Responses include `ratelimit-limit` and `ratelimit-remaining` headers
- 429 responses include `Retry-After` header

## Relevant Skills

- revops
- sales-enablement
- cold-email

## Paging bundled CLI CRM collections

All five list commands (`leads`, `contacts`, `opportunities`, `activities`, `tasks`) accept `--page <positive_integer>` or `--skip <nonnegative_offset>` and optional `--limit <1-100>`. Page offsets use the selected limit, so page 2 at limit 25 starts at offset 25, not 100. Omitted flags preserve provider defaults; legacy `--page` without a limit uses 100 records per page.

```bash
node tools/clis/close.js contacts list --lead-id lead_example --page 2 --limit 25 --dry-run
```

Read `has_more` and request subsequent pages manually; the CLI preserves raw responses and never fetches extra pages silently. The CLI conservatively supports limits up to 100; provider resource-specific limits still apply. [Close pagination](https://developer.close.com/api/overview/pagination) documents `_skip` and `_limit`. Contract tests use fixtures, not real CRM records.
