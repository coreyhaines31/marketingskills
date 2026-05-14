# RB2B

Website visitor identification platform that de-anonymizes B2B website traffic, revealing the individual people visiting your site with LinkedIn profiles, emails, and company data.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | Limited | API Partner Program (separate from standard app) |
| MCP | - | Not available |
| CLI | - | Not available |
| SDK | - | Not available |

Most teams use RB2B via its native integrations (Slack, CRM push, Zapier, webhooks) rather than direct API access. A separate [API Partner Program](https://www.rb2b.com/apis) exists for programmatic access.

## Authentication

- **Type**: Native integrations (no API key needed for standard use)
- **API Partner Program**: Separate credentials via https://www.rb2b.com/apis
- **Free tier**: Limited credits/month with Slack alerts

## Pricing Tiers

Pricing changes frequently — verify at https://www.rb2b.com/pricing.

| Plan | Approx. Price | Key Features |
|------|--------------|-------------|
| Free | $0 | Limited credits, Slack alerts, LinkedIn profiles |
| Starter | ~$79/mo | Person-level ID, basic integrations |
| Pro | ~$129-349/mo | CSV export, CRM push, validated emails |
| Pro+ | ~$299+/mo | All integrations, higher credit volume |

## Key Integrations

RB2B pushes identified visitor data to 50+ tools:
- **CRM**: Salesforce, HubSpot
- **Outreach**: Instantly, HeyReach, Lemlist
- **Enrichment**: Clay, Apollo, Clearbit
- **Automation**: Zapier, Make
- **Alerts**: Slack (real-time notifications)

## What RB2B Reveals Per Visitor

- Full name and LinkedIn profile URL
- Job title and company
- Validated business email (Pro+)
- Pages visited and visit duration
- Number of visits and return frequency
- Company data (size, industry, location)

## Common Agent Operations

### Real-Time Visitor Alerts

Configure Slack alerts for high-intent visitors:
- Visitors who hit pricing page
- Visitors who return 3+ times
- Visitors from target account list
- Visitors matching ICP job titles

### Visitor-to-Outreach Pipeline

1. RB2B identifies visitor with LinkedIn + email
2. Filter by ICP criteria (title, company size, pages visited)
3. Route to outreach tool (Instantly, Lemlist) or CRM (HubSpot, Salesforce)
4. Trigger personalized cold email referencing pages they visited

### Intent Scoring

Score visitors by behavior signals:
- **High intent**: Pricing page, demo page, comparison pages, 3+ visits
- **Medium intent**: Feature pages, case studies, 2 visits
- **Low intent**: Blog only, single visit, bounced quickly

### Suppression Lists

Prevent outreach to:
- Existing customers (match against CRM)
- Active deals in pipeline
- Competitors and agencies
- Recently contacted prospects

## When to Use

- Identifying anonymous website visitors for sales outreach
- Building ABM (account-based marketing) target lists from site traffic
- Understanding which companies are researching your product
- Triggering personalized outreach based on page-level intent signals
- Feeding enrichment tools (Clay, Apollo) with warm visitor data

## Limitations

- Person-level identification works best for US B2B traffic
- Not all visitors can be identified (typical match rates: 15-30%)
- Requires sufficient website traffic to be cost-effective
- Privacy considerations — ensure compliance with applicable regulations
- Free tier limited to Slack alerts (no CRM push or email export)

## Relevant Skills

- cold-email
- revops
- customer-research
- ads

## Sources

- [RB2B pricing](https://www.rb2b.com/pricing)
- [RB2B plans comparison](https://support.rb2b.com/en/articles/9173659-rb2b-plans-side-by-side-comparisons)
- [RB2B API Partner Program](https://support.rb2b.com/en/articles/12579420-rb2b-apis-rb2b-s-api-partner-program)
