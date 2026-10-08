# TheirStack

Job postings and technographics data. Finds companies by what they're hiring for and what technology they use, inferred from job postings across many job boards, with webhooks for new postings. Useful for hiring signals ("hiring a lifecycle marketer") and tech-stack targeting ("uses HubSpot and Webflow").

Facts below were checked against [theirstack.com/en/docs](https://theirstack.com/en/docs/api-reference), its [OpenAPI spec](https://api.theirstack.com/openapi.json), and the [MCP docs](https://theirstack.com/en/docs/mcp) on 2026-10-07.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Job search, company search, technographics, webhooks, credit balance |
| MCP | ✓ | Official hosted server at `https://api.theirstack.com/mcp`. OAuth by default, or an API key in the `Authorization` header |
| CLI | - | Use the API |
| SDK | - | Datasets also available as Parquet or CSV |

## Authentication

- **Type**: Bearer token, `Authorization: Bearer <key>`
- **Env var** (convention): `THEIRSTACK_API_KEY`
- **Get key**: [app.theirstack.com → API Keys](https://app.theirstack.com/settings/api-key)
- **MCP**: use OAuth for interactive sessions, or pass the API key as a header so scheduled agent runs work without a browser:

```bash
claude mcp add TheirStack --transport http https://api.theirstack.com/mcp \
  --header "Authorization: Bearer $THEIRSTACK_API_KEY"
```

## Common Agent Operations

Base URL: `https://api.theirstack.com`

### Companies hiring for a role (hiring signal)

```bash
POST https://api.theirstack.com/v1/jobs/search
Authorization: Bearer $THEIRSTACK_API_KEY

{
  "job_title_or": ["growth marketing", "lifecycle marketing", "CRO"],
  "posted_at_max_age_days": 30,
  "job_country_code_or": ["US"],
  "min_employee_count": 20,
  "max_employee_count": 500,
  "limit": 25
}
```

Use `company_technology_slug_or` / `_and` / `_not` to add a tech-stack filter, and `company_domain_or` to check a named account list.

### Companies by technology

```bash
POST /v1/companies/search        # companies matching technology, firmographic, and hiring filters
POST /v1/companies/technologies  # one company's full inferred tech stack
```

### Webhooks (alerts instead of polling)

`POST /v0/webhooks` on a saved search sends `job.new`, `job.closed`, or `company.new` events when matches appear, for example when a target account posts a relevant role or adopts a technology.

### Credits

`GET /v0/billing/credit-balance`

## Credits

API credits are charged per record returned (or sent by webhook):
- 1 credit per job
- 3 credits per company from company search
- 3 credits per company for its full technographics

Keep `limit` small while testing, and use the count feature before large pulls. App "company credits" for revealing companies in the UI are separate. Source: [credits docs](https://theirstack.com/en/docs/pricing/credits); plans at [theirstack.com/en/pricing](https://theirstack.com/en/pricing).

## Rate Limits

- Paid: 4 requests per second across job search, company search, and technographics
- Free: 4 per second, 10 per minute, 50 per hour, 400 per day
- Responses include IETF `RateLimit` headers. Source: [rate limit docs](https://theirstack.com/en/docs/api-reference/rate-limit)

## Signal Ideas

- **Agency (CRO, landing pages)**: companies hiring a growth, CRO, or demand gen marketer in the last 30 days; companies adopting a new site builder or A/B testing tool
- **Email tooling**: companies hiring lifecycle, email, or RevOps roles; companies whose postings mention a cold email or sales engagement stack
- **Competitor customers**: companies whose postings mention a competitor's product
- Treat tech stack inferred from job postings as a signal, not proof. Small companies post few jobs, so coverage is thinner at the low end.

## Relevant Skills

- prospecting
- cold-email
- competitor-profiling
- marketing-loops (signal sweep loops)
