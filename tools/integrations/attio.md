# Attio

CRM built around flexible objects and lists: people, companies, deals, and custom objects, with lists for pipelines, notes, tasks, and call recordings. Common with startups and agencies that want a CRM an agent can read and write.

Facts below were checked against [docs.attio.com](https://docs.attio.com/rest-api/guides/authentication) on 2026-10-07.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API v2 (records, lists and entries, notes, tasks, webhooks); SQL query endpoint on Enterprise |
| MCP | ✓ | Official hosted server at `https://mcp.attio.com/mcp`, OAuth as your Attio user ([docs](https://docs.attio.com/mcp/overview)) |
| CLI | - | Use the API |
| SDK | ✓ | App SDK for building Attio apps (GraphQL inside apps) |

## Authentication

- **API**: Bearer token in `Authorization: Bearer <token>`. For a single workspace, generate an API key in developer settings and grant only the scopes you need (records, lists, notes). Use OAuth 2.0 only when building an app for many workspaces.
- **Env var** (convention): `ATTIO_API_KEY`
- **MCP**: OAuth sign-in, no key. Reads are auto-approved and writes ask for confirmation in the client, which suits human-in-the-loop CRM updates. For unattended agent runs, use an API key with the REST API.

## Common Agent Operations

Base URL: `https://api.attio.com`

### Upsert a person (create or update by email)

```bash
PUT https://api.attio.com/v2/objects/people/records?matching_attribute=email_addresses
Authorization: Bearer $ATTIO_API_KEY

{
  "data": {
    "values": {
      "email_addresses": ["jane@acme.com"],
      "name": [{ "first_name": "Jane", "last_name": "Doe", "full_name": "Jane Doe" }],
      "job_title": "VP Marketing"
    }
  }
}
```

Use upsert rather than create for anything an agent writes repeatedly; create throws on duplicate unique values. Companies upsert on `domains`.

### Query records

```bash
POST https://api.attio.com/v2/objects/companies/records/query

{ "filter": { "domains": "acme.com" }, "limit": 25 }
```

Fuzzy search across objects: `POST /v2/objects/records/search`.

### Add a record to a list (pipeline stage)

```bash
POST https://api.attio.com/v2/lists/{list}/entries
```

Lists are how Attio models pipelines (for example an "Outbound" list with a status attribute for contacted, replied, meeting booked). Read the list's attributes first with `GET /v2/lists/{list}/attributes`.

### Log a note

```bash
POST https://api.attio.com/v2/notes

{
  "data": {
    "parent_object": "people",
    "parent_record_id": "<record-id>",
    "title": "Positive reply: wants a teardown call",
    "format": "plaintext",
    "content": "Replied to email 2 (pricing page angle). Proposed Tue/Wed."
  }
}
```

Tasks: `POST /v2/tasks` for follow-ups with a deadline and assignee.

### Webhooks

Subscribe to record, list-entry, note, and task events to trigger agent work when a deal moves stage ([guide](https://docs.attio.com/rest-api/guides/webhooks)).

## Rate Limits

- 100 read requests per second and 25 write requests per second across the API; some data-heavy endpoints are lower. Over the limit returns `429` with a retry time.
- Source: [rate limiting guide](https://docs.attio.com/rest-api/guides/rate-limiting)

## Pricing

Per-seat plans with a free tier; API and webhooks on all plans, SQL query on Enterprise. Current pricing: [attio.com/pricing](https://attio.com/pricing).

## Outbound Use

- Upsert every contacted prospect with its source, signal, sequence, and channel, so meetings can be attributed (see `revops`)
- Model the outbound pipeline as a list with stages: contacted → replied → positive → meeting booked → meeting held
- Log positive replies as notes and create follow-up tasks with deadlines
- Before adding a prospect to a sequence, query Attio to exclude customers and open deals

## Relevant Skills

- revops
- prospecting
- cold-email
- sales-enablement
