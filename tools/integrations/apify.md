# Apify

Web scraping and automation platform with a marketplace of ready-made scrapers ("Actors"): website crawlers, directories and marketplaces, app stores, review sites, job boards, and many site-specific scrapers. Actors run in Apify's cloud and write results to datasets you can download as JSON or CSV.

Facts below were checked against [docs.apify.com](https://docs.apify.com/api/v2) and the [MCP docs](https://docs.apify.com/platform/integrations/mcp) on 2026-10-07.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API v2: run Actors, read datasets, schedules, webhooks |
| MCP | ✓ | Official hosted server at `https://mcp.apify.com` (OAuth, or Bearer API token); also runs locally over stdio. Searches and runs Actors as tools |
| CLI | ✓ | Official [Apify CLI](https://docs.apify.com/cli/docs) (mainly for building and running Actors) |
| SDK | ✓ | Official JavaScript and Python API clients |

## Authentication

- **Type**: Bearer token, `Authorization: Bearer <token>` (preferred over the `?token=` URL parameter, which ends up in logs)
- **Env var** (convention): `APIFY_TOKEN`
- **Get token**: Apify Console > Settings > [Integrations](https://console.apify.com/settings/integrations)
- **MCP**: OAuth browser sign-in by default; use the API token as a Bearer header for unattended runs. The MCP server excludes full-permission and rental Actors.

## Common Agent Operations

### Run an Actor and get its results in one call

```bash
# Crawl a directory or partner page and return clean page content
POST https://api.apify.com/v2/actors/apify~website-content-crawler/run-sync-get-dataset-items
Authorization: Bearer $APIFY_TOKEN
Content-Type: application/json

{ "startUrls": [{ "url": "https://www.example-directory.com/agencies" }], "maxCrawlPages": 50, "respectRobotsTxtFile": true }
```

- The Actor ID is either its ID or `owner~actor-name`.
- Synchronous runs time out after 300 seconds (HTTP 408). For bigger jobs, start the run asynchronously (`POST /v2/actors/{actorId}/runs`), then read the dataset when it finishes, or attach a webhook.
- Each Actor defines its own input; read its input schema on the Actor's Apify Store page before calling it.

### Read a dataset

```bash
GET https://api.apify.com/v2/datasets/{datasetId}/items?format=json&clean=true
```

## Rate Limits

- 250,000 requests per minute globally per user, and 60 requests per second per resource (one Actor, run, or dataset) by default; `429` when exceeded
- Source: [API docs](https://docs.apify.com/api/v2)

## Pricing

Usage-based: platform compute plus each Actor's own pricing (per result, per run, or rental). Check an Actor's price on its Store page before running it at volume. Plans: [apify.com/pricing](https://apify.com/pricing).

## Sourcing Rules for Outbound

- **Good sources**: public directories and marketplaces (app stores, agency directories, partner and integration pages), job boards, review sites, and companies' own websites.
- **Google Maps**: Maps scrapers are among the most popular Actors, but automated scraping of Google Maps breaks Google's terms. For local business data, use the official Google Places API instead (see the `prospecting` skill's local prospecting guidance).
- **Don't** run Actors that log in to LinkedIn or use session cookies or fake accounts. LinkedIn sues data vendors that do this, and the data can carry GDPR risk. Use Sales Navigator to define the audience and licensed databases for contacts (see the `prospecting` skill).
- Directories and listings give companies, not people. Enrich decision makers and verify emails before any outreach.
- Respect each site's terms and robots rules, and keep a record of where every contact came from.

## Relevant Skills

- prospecting
- competitor-profiling
- customer-research
- programmatic-seo (collecting structured data for page sets)
