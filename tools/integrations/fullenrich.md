# FullEnrich

Waterfall contact enrichment: queries many data providers in sequence to find work emails, personal emails, and mobile numbers for a person, then verifies the emails it returns. Also offers people and company search, single lookups, and reverse email lookup.

Facts below were checked against [docs.fullenrich.com](https://docs.fullenrich.com/api/v2/general/introduction) (API v2 spec) and the [MCP help article](https://help.fullenrich.com/en/articles/14190120-mcp-server) on 2026-10-07.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API v2: bulk enrich, reverse email, people/company search and lookup, credits |
| MCP | ✓ | Official hosted server at `https://mcp.fullenrich.com/mcp`, OAuth sign-in (search, enrich, export) |
| CLI | - | Use the API |
| SDK | - | Native Zapier, Make, Clay, and n8n integrations |

## Authentication

- **Type**: Bearer token, `Authorization: Bearer <key>`
- **Env var** (convention): `FULLENRICH_API_KEY`
- **Get key**: [app.fullenrich.com/app/api](https://app.fullenrich.com/app/api)
- **MCP**: OAuth browser sign-in, so it suits interactive sessions. Scheduled jobs should use the API key.

## Common Agent Operations

Base URL: `https://app.fullenrich.com/api/v2`

### Enrich contacts (asynchronous, up to 100 per request)

```bash
POST https://app.fullenrich.com/api/v2/contact/enrich/bulk
Authorization: Bearer $FULLENRICH_API_KEY

{
  "name": "Q4 CRO targets",
  "webhook_url": "https://example.com/fullenrich-done",
  "data": [
    {
      "first_name": "Jane",
      "last_name": "Doe",
      "domain": "acme.com",
      "company_name": "Acme",
      "professional_network_url": "https://www.linkedin.com/in/janedoe/",
      "enrich_fields": ["contact.work_emails"],
      "custom": { "crm_id": "12584" }
    }
  ]
}
```

- The response returns an enrichment ID right away; results arrive later by webhook (recommended) or `GET /contact/enrich/bulk/{enrichment_id}`.
- `webhook_events.contact_finished` posts each contact as it completes, instead of waiting for the whole batch.
- Ask only for the fields you need. Phones cost 10 credits each, so request `contact.phones` only for top-tier accounts.

### Other endpoints

```bash
POST /contact/reverse/email/bulk   # who is behind an email (person + company)
POST /people/search                # find people by role, company, industry, location, size
POST /company/search
POST /people/lookup                # one person by profile URL, or name + company
POST /company/lookup               # one company by domain or profile URL
GET  /account/credits
```

## Email Statuses

| Status | Meaning (FullEnrich's stated bounce rates) | Outbound action |
|--------|--------------------------------------------|-----------------|
| `DELIVERABLE` | About 2% bounce | Send after your own pre-send verification |
| `HIGH_PROBABILITY` | Catch-all, likely valid; about 9% bounce | Resolve with a catch-all verifier before sending |
| `CATCH_ALL` | Catch-all, higher bounce risk | Resolve first; send only for high-value accounts |
| `INVALID` | Very likely to bounce | Don't send |

`most_probable_work_email` returns the lowest-bounce-risk work email it found. A 9% bounce rate alone would exceed the under-2% target for cold email, so verify FullEnrich output with a dedicated verifier (see [truelist.md](truelist.md)) before it reaches a sequencer.

## Credits

Credits are charged only when a result is found:
- Work email (deliverable, high probability, or catch-all): 1 credit
- Personal email: 3 credits
- Mobile phone: 10 credits
- Search results: 0.25 credit per person or company returned (re-exports are free)

Source: [credits docs](https://docs.fullenrich.com/api/v2/general/credit). Plans: [fullenrich.com/pricing](https://fullenrich.com/pricing).

## Rate Limits

- 60 API calls per minute across all endpoints; up to 100 contacts per bulk request (about 6,000 contacts a minute)
- 100 concurrent enrichments and 100 concurrent reverse lookups per workspace
- Source: [rate limit docs](https://docs.fullenrich.com/api/v2/general/ratelimit)

## When to Use

- Filling gaps after a primary database (Apollo, ZoomInfo) returns no email
- Finding mobile numbers for tier-1 accounts before calling
- Before committing, run a 200-contact test on your own ICP against one or two alternatives (LeadMagic, Prospeo, Findymail). Public benchmarks are vendor-run and disagree.

## Relevant Skills

- prospecting
- cold-email
- revops
