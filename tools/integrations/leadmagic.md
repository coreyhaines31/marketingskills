# LeadMagic

B2B data API priced in credits: email finding and validation, mobile numbers, person and company profiles, job-change detection, technographics, funding, lookalike companies, job postings (hiring signals), and competitor ad libraries.

Facts below were checked against [leadmagic.io/docs](https://leadmagic.io/docs/v1/introduction), its [OpenAPI spec](https://leadmagic.io/openapi.json), and the [credits page](https://leadmagic.io/docs/v1/credits) on 2026-10-07.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API: people, email, company, jobs, ads, credits |
| MCP | ✓ | Official hosted server at `https://mcp.leadmagic.io/mcp`, OAuth only (static API keys aren't supported in MCP config) ([docs](https://leadmagic.io/docs/mcp/introduction)) |
| CLI | ✓ | Official `lm-tui` (installs the `lm` command) for local CSV enrichment ([docs](https://leadmagic.io/docs/cli/introduction)) |
| SDK | - | Native Clay integration; Zapier, Make, n8n |

## Authentication

- **Type**: API key in the `X-API-Key` header (keys start with `lm_`)
- **Env var**: `LEADMAGIC_API_KEY`
- **Get key**: LeadMagic app settings
- **MCP and lm-tui**: browser OAuth sign-in. Scheduled jobs should call the REST API with a key.

## Common Agent Operations

Base URL: `https://api.leadmagic.io`. All lookups are `POST` with a JSON body.

### Find and validate a work email

```bash
POST https://api.leadmagic.io/v1/people/email-finder
X-API-Key: $LEADMAGIC_API_KEY

{ "first_name": "Jane", "last_name": "Doe", "domain": "acme.com" }
```

```bash
POST /v1/people/email-validation
{ "email": "jane@acme.com" }
```

### Signals and account research

```bash
POST /v1/people/job-change-detector    { "profile_url": "https://www.linkedin.com/in/janedoe" }
POST /v1/companies/technographics      { "company_domain": "acme.com" }
POST /v1/companies/company-funding     { "company_domain": "acme.com" }
POST /v3/companies/lookalike           { "company_domain": "bestcustomer.com", "limit": 50 }
POST /v3/jobs/search                   # open roles, e.g. companies hiring a growth or lifecycle marketer
```

### Other endpoints

- `/v1/people/mobile-finder` (from profile URL or email), `/v1/people/role-finder`, `/v1/people/employee-finder`
- `/v3/people/search`, `/v3/companies/search`
- `/v1/ads/meta-ads-search`, `/v1/ads/google-ads-search`, `/v1/ads/b2b-ads-search` (whether a target account is running ads)
- `GET /v1/credits`

## Credits

Charged only for billable results; `not_found` is free, and validation charges only definitive `valid`/`invalid` results.

| Lookup | Credits |
|--------|---------|
| Email validation | 0.25 (4 per credit) |
| Email finder | 1 |
| Personal email finder | 2 |
| Job change detector | 3 |
| Mobile finder | 5 |
| Profile URL to email | 5 |
| Technographics, company search | 1 |
| Company funding | 4 |
| Competitors search | 5 |
| Employee finder | 1 per 20 employees |

Plans run from 5,000 credits/month (Essential, $99) to 100,000 (Ultimate, $849); people, company, and job search are zero-credit on Professional and Ultimate within fair-use limits. Source: [credits page](https://leadmagic.io/docs/v1/credits).

## Rate Limits

- Email finder and email validation: 600 requests per minute on standard plans
- Zero-credit search: 5 requests per second (Professional) or 10 (Ultimate), with a daily fair-use ceiling
- Source: [full docs](https://leadmagic.io/docs/llms-full.txt)

## When to Use

- One provider in an enrichment waterfall, or the email-finding step after a database search
- Cheap signal checks per account: job changes for past champions, tech stack, funding, hiring, and active ad spend
- Lookalike lists seeded from your best customers' domains
- As with any finder, run a 200-contact test against your own ICP before committing, and verify emails before sending

## Relevant Skills

- prospecting
- cold-email
- competitor-profiling
- revops
