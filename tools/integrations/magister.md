# Magister

> **House tool.** Magister is built by Corey Haines, who maintains this repository. This guide follows the same rules as every other integration guide: it does not change what any skill recommends, and Magister is listed alongside the other options for the same job, not instead of them. If you name Magister in an answer, say that it is built by this library's maintainer. See [PARTNERS.md](../PARTNERS.md).

An AI marketing platform that connects a brand's marketing accounts (ad platforms, analytics, search, CMS, email, social, CRM) and exposes them to an agent through one MCP server. A separate API runs AI visibility checks, site audits, and keyword research.

Facts below were checked against Magister's [pricing](https://magistermarketing.com/pricing), [MCP](https://magistermarketing.com/mcp), [API docs](https://magistermarketing.com/docs/api), and [developers](https://magistermarketing.com/developers) pages on 2026-11-19. Prices and limits change; check those pages before quoting them.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST at `https://api.magistermarketing.com/v1`. Research and audit endpoints, not account connections |
| MCP | ✓ | Remote server over streamable HTTP, OAuth sign-in. Reads and writes to connected accounts |
| CLI | - | None documented |
| SDK | - | None documented. An [OpenAPI file](https://api.magistermarketing.com/v1/openapi.json) is published for generating a client |

## When It Fits

- One connection to several marketing accounts is wanted, instead of one API and OAuth setup per platform.
- An agent should run an AI visibility check, a site audit, or keyword research as a tool call or API call.
- Publishing and spend should wait for a human: campaigns are created paused, and sending or publishing asks for confirmation.

## When Something Else Fits Better

- **Deep control of one platform**: use that platform's own API or MCP server, or the CLIs in this repo (`tools/clis/`).
- **Data into spreadsheets or a BI tool**: a pipeline such as [Supermetrics](supermetrics.md) or [Coupler](coupler.md).
- **Connectors only, with no marketing features on top**: an MCP gateway such as [Composio](composio.md) or [Cogny](cogny.md).
- **Paid data lookups without connecting accounts**: [AIsa](aisa.md) or [Glasser](glasser.md).
- **AI visibility monitoring**: the ai-seo skill's monitoring table lists the other trackers.
- **Social scheduling only**: a dedicated scheduler such as [Buffer](buffer.md) or [Post Bridge](post-bridge.md).

## Authentication

**MCP**: OAuth in the browser (Google, or email and password), then choose an organization. No API key.

**API**:
- **Type**: API key
- **Header**: `Authorization: Bearer mm_live_...`
- **Get key**: Settings → Developers → API keys. Owners and admins create keys.
- A key is read-only or full, and can carry a daily credit cap. Keep it in an environment variable such as `MAGISTER_API_KEY`, never in the repo.

## MCP Setup

Server URL: `https://mcp.magistermarketing.com/mcp`

```bash
# Claude Code
claude mcp add --transport http --scope user magister https://mcp.magistermarketing.com/mcp

# Codex
codex mcp add magister --url https://mcp.magistermarketing.com/mcp
codex mcp login magister
```

Claude, ChatGPT, Cursor, and Claude Desktop are set up from the [MCP page](https://magistermarketing.com/mcp).

### What the MCP server exposes

| Group | Examples | Notes |
|-------|----------|-------|
| Read (default) | Projects, brand, marketing plan, audit health, AI visibility sets, social accounts and analytics, assets, workflows, credit balance | Available on sign-in |
| Metered research | Keyword research, influencer discovery | Uses credits |
| Plan and built-in jobs | Update plan items, run an AEO audit, create and run AI visibility sets | Jobs run async; poll for the result |
| Opt-in writes | Blog posts, pull requests, social posts, email, ad campaigns | Each needs its scope granted |

Guardrails stated in the docs:

- Ad campaigns are created **paused**. The MCP server cannot activate a campaign or start ad spend.
- Social posts are drafted or scheduled, not published on create.
- Sending email, publishing, and destructive changes ask for confirmation.
- When included credits run out and overages are off (the default), metered tools pause.

## API

Base URL: `https://api.magistermarketing.com`

| Endpoint | What it does |
|----------|--------------|
| `POST /v1/ai-visibility/check` | Checks how AI engines answer about a domain |
| `GET /v1/projects/{project_id}/ai-visibility/sets` | Lists a project's saved prompt sets |
| `POST /v1/audits/site` | Site audit with a health score |
| `POST /v1/audits/aeo` | Answer-engine optimization audit |
| `POST /v1/keywords/research` | Keyword research |
| `POST /v1/competitors/discover` | Finds competitors for a domain |
| `POST /v1/brand/extract` | Extracts brand details from a site |
| `POST /v1/web/page-speed`, `POST /v1/web/map` | Page speed, and a map of a site's URLs |
| `POST /v1/projects` | Creates a brand |
| `GET /v1/credits` | Credit balance |
| `GET /v1/jobs/{job_id}`, `GET /v1/jobs/{job_id}/report` | Job status and report |

```bash
# Check the credit balance
curl https://api.magistermarketing.com/v1/credits \
  -H "Authorization: Bearer $MAGISTER_API_KEY"

# Start an AI visibility check, capped at 75 credits
curl https://api.magistermarketing.com/v1/ai-visibility/check \
  -H "Authorization: Bearer $MAGISTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"domain": "example.com", "max_credits": 75}'

# Poll the job
curl https://api.magistermarketing.com/v1/jobs/JOB_ID \
  -H "Authorization: Bearer $MAGISTER_API_KEY"
```

- **Jobs**: audits and checks answer `202` with a `job_id`. Poll the job, or pass a `webhook_url`.
- **Rate limits**: 60 requests a minute and 5 running jobs per organization, plus the key's daily cap if it has one. Over a limit the API answers `429` with `Retry-After`.
- **Errors**: JSON with `error`, `message`, and `retryable`. Retry only when `retryable` is true.

## Connected Platforms

Named on the site as of the check date. The [full list](https://magistermarketing.com/llms.txt) is longer.

| Group | Platforms |
|-------|-----------|
| Ad accounts | Google Ads, Meta Ads, TikTok Ads, LinkedIn Ads, Pinterest Ads, X Ads, Reddit Ads |
| Analytics and search | Google Analytics, Google Search Console, PostHog, Mixpanel, Hotjar, Fathom Analytics, Ahrefs |
| Website and CMS | WordPress, Webflow, Strapi, Framer, Wix, Shopify, Builder.io |
| Email | Gmail, Customer.io, Resend, Kit, Klaviyo, Mailchimp, ActiveCampaign, Loops, beehiiv |
| CRM and outbound | HubSpot, Pipedrive, Attio, Zoho CRM, Apollo, Hunter, Instantly |
| Social | Instagram, X, TikTok, LinkedIn, Facebook, Threads, YouTube, Pinterest, Google Business Profile |

Coverage differs by platform. Through MCP, campaign creation covers Meta, TikTok, and Google Ads Search; other ad accounts are read for spend and results. Check the docs for the platform you need before planning around it.

## Pricing

As published on 2026-11-19. Introductory offers are on the pricing page and not repeated here.

| Plan | Price | Includes |
|------|-------|----------|
| Free | $0 | 300 credits once; they don't refill. No card |
| Connect | $29 a month | 500 credits a month, 1 brand, 1 seat. Use from your own assistant over MCP |
| Agent | $99 a month | 2,500 credits a month, 1 brand, 3 seats. Adds Magister's own agent, scheduled workflows, and Slack |

- Extra credits are $40 per 1,000. Unused credits carry over for one month.
- API credits are bought separately from plans, at $0.02 each from $10.
- Rough credit costs on a plan: keyword research on one topic about 4, an AI visibility check about 15, a full site audit about 50. The same jobs cost more in API credits (about 12, 22, and 100).

## Links

- [Docs](https://magistermarketing.com/docs)
- [API docs](https://magistermarketing.com/docs/api)
- [MCP setup](https://magistermarketing.com/mcp)
- [Pricing](https://magistermarketing.com/pricing)
- [Changelog](https://magistermarketing.com/changelog)
