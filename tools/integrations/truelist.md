# Truelist

Email verification and deliverability validation. Validates single emails synchronously or bulk lists asynchronously. Returns an `email_state` + `email_sub_state` plus rich metadata (domain, MX record, suggested correction, disposable/role classification).

Spec source: [Truelist-Labs/truelist-openapi](https://github.com/Truelist-Labs/truelist-openapi) (OpenAPI 3.1).

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API, OpenAPI 3.1 spec |
| MCP | ✓ | Official [truelist-mcp](https://github.com/Truelist-Labs/truelist-mcp) server (Claude, Cursor, VS Code) |
| CLI | ✓ | Official Go [truelist-cli](https://github.com/Truelist-Labs/truelist-cli) |
| SDK | ✓ | Official: Node/TypeScript, Python, Ruby, PHP, Go, Java, C#/.NET. Framework integrations: Django, Laravel, Next.js, Rails, React, Svelte, Vue, WordPress |

## Authentication

- **Type**: Bearer token (API key)
- **Header**: `Authorization: Bearer YOUR_API_KEY`
- **Get key**: https://truelist.io/settings/api-keys
- **Base URL**: `https://api.truelist.io`

## Common Agent Operations

### Verify a single email (synchronous)

```bash
POST https://api.truelist.io/api/v1/verify_inline?email=user@example.com
Authorization: Bearer YOUR_API_KEY
```

No request body — the email is a query parameter. Returns a single-element `emails` array with verification fields:

```json
{
  "emails": [
    {
      "address": "user@example.com",
      "domain": "example.com",
      "canonical": "user@example.com",
      "mx_record": null,
      "first_name": null,
      "last_name": null,
      "email_state": "ok",
      "email_sub_state": "email_ok",
      "verified_at": "2026-02-21T10:39:12.570Z",
      "did_you_mean": null
    }
  ]
}
```

### Bulk verification (asynchronous)

```bash
POST https://api.truelist.io/api/v1/verify
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "emails": [
    "user1@example.com",
    "user2@example.com"
  ]
}
```

Processes the list in the background. The response acknowledges submission; results are available via the dashboard, the Truelist UI's CSV download, or via integrations (Mailchimp, Klaviyo, HubSpot, Zapier, Make, n8n, etc.).

For large lists, the dashboard's CSV upload + download flow is typically the lowest-friction path.

### Get account information

```bash
GET https://api.truelist.io/me
Authorization: Bearer YOUR_API_KEY
```

Returns email, name, UUID, time zone, admin role, API keys, and account plan info.

## Response Fields (per email)

| Field | Type | Description |
|-------|------|-------------|
| `address` | string | The email address validated |
| `domain` | string | The domain part of the address |
| `canonical` | string | Canonical form of the address |
| `mx_record` | string \| null | MX record for the domain |
| `first_name` | string \| null | First name if detected |
| `last_name` | string \| null | Last name if detected |
| `email_state` | enum | Overall validation verdict (see below) |
| `email_sub_state` | enum | More specific reason (see below) |
| `verified_at` | datetime (ISO 8601) | When verification ran |
| `did_you_mean` | string \| null | Suggested correction for typos |

## `email_state` values

| State | Meaning | What to do |
|-------|---------|-----------|
| `ok` | The email address is deliverable. | Include in outreach |
| `email_invalid` | The email address is not deliverable. | Exclude — would bounce |
| `risky` | May be deliverable but carries risk (role address, disposable, etc.) | Include cautiously, lower priority |
| `unknown` | Deliverability could not be determined (timeout/connection). | Skip or re-verify with Thorough strategy |
| `accept_all` | The mail server accepts all addresses (catch-all domain) | Include cautiously — can't confirm specific mailbox |

## `email_sub_state` values

| Sub-state | Meaning |
|-----------|---------|
| `email_ok` | Passed all checks |
| `is_disposable` | Disposable / temporary provider (e.g., 10minutemail) |
| `is_role` | Role-based address (info@, sales@, admin@) |
| `unknown_error` | Sub-state could not be determined |
| `failed_smtp_check` | SMTP check failed |

Pair the two: `email_state: ok` + `email_sub_state: is_role` means "deliverable but a role inbox," whereas `email_state: email_invalid` + `email_sub_state: failed_smtp_check` means "doesn't exist."

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `/api/v1/verify_inline` | 10 requests/second |
| `/api/v1/verify` | 10 requests/second |
| `/me` | 10 requests/second |

A 429 is returned on rate-limit exceed. Note: the per-email validation rate is separate and depends on your plan.

## Error Responses

| Code | Meaning |
|------|---------|
| 401 | Unauthorized — API key missing, invalid, or expired |
| 429 | Rate limit exceeded |
| 500 | Server error |

All error bodies follow `{"error": "<human-readable message>"}`.

## When to Use

- **Before adding contacts to any cold outreach list** — non-negotiable safety step. Apollo/ZoomInfo/Hunter data accuracy is typically 60–80%; Truelist catches the rest.
- **Real-time form validation** — block disposable / typo'd emails at signup. Use the inline endpoint (or the [form validation widget](https://truelist.io/docs/form-validation-widget)).
- **Periodic list hygiene** — re-verify your active list quarterly to remove bounces before they hurt sender reputation.
- **Pre-import validation** on email platform imports (Mailchimp, Klaviyo, HubSpot, etc.) — direct integrations exist for most.
- **AI agent workflows** via the official MCP server for Claude, Cursor, and VS Code.

## Why This Step is Non-Negotiable

Cold email reputation is built over months and destroyed in days. ISPs (Gmail, Outlook, etc.) track sender reputation through:

- **Bounce rate** — bounces over 2% trigger throttling
- **Spam complaints** — spam traps in unvalidated lists generate complaints
- **Engagement** — sending to dead mailboxes hurts engagement metrics

A single unvalidated send to a bought or scraped list can damage a domain's sending reputation for months.

## Workflow Integration

Typical prospecting flow:

1. Build initial prospect list (Apollo, Clay, ZoomInfo, Hunter, GitHub stargazers, etc.)
2. **For agent-driven workflows**: use the Truelist MCP server to validate inline as the agent builds the list
3. **For programmatic workflows**: POST emails to `/api/v1/verify` for async bulk OR `/api/v1/verify_inline` for sync single
4. **For one-offs**: CSV upload via dashboard, download annotated CSV
5. Filter: keep `email_state: ok`, include `risky`/`accept_all` cautiously with a strategy, exclude `email_invalid`, re-verify `unknown`
6. Hand cleaned list to outreach platform (Instantly, Lemlist, Outreach, etc.) — see [outreach.md](outreach.md), [instantly.md](instantly.md), [lemlist.md](lemlist.md)

## Native Integrations (no API code required)

For non-developer workflows, Truelist has direct integrations:

- **Email platforms**: Mailchimp, Klaviyo, HubSpot, ActiveCampaign, Brevo, Constant Contact, ConvertKit, Drip
- **Automation**: Zapier, Make.com, n8n
- **CRM / sales**: Salesforce, Go High Level, Clay.com
- **Ecom**: BigCommerce
- **AI / agents**: MCP server (Claude, Cursor, VS Code)

See https://truelist.io/integrations for the current list.

## Relevant Skills

- prospecting (primary use case — validate before adding to outreach lists)
- cold-email (downstream outreach against the validated list)
- emails (transactional senders + subscriber list hygiene)
- popups (real-time form validation on opt-in capture)
