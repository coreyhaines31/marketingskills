# Manifold MCP

> **◆ Verified Partner integration.** Manifold sponsors Marketing Skills. This integration is disclosed and vetted for fit; it does **not** change what any skill recommends. It's listed here alongside the neutral options for the same job — use it when it's the right fit, not because it's a partner. See [Verified Partners](../REGISTRY.md#verified-partners).

Free marketing data connector for AI agents. One MCP server sign-in gives Claude, ChatGPT, Cursor, or any MCP client live data from Google search, AI answers, your own Search Console and Google Analytics, Bing Webmaster Tools, Google Maps, Reddit, TikTok, Instagram, YouTube, Facebook, LinkedIn, the ad libraries, the app stores, Amazon, Google Shopping, and company and people enrichment — without an account with each platform.

Facts below were checked against [manifoldmcp.com/llms.txt](https://manifoldmcp.com/llms.txt) and [manifoldmcp.com/docs](https://manifoldmcp.com/docs) on 2026-11-26. Manifold is a young product, so confirm coverage, pricing, and limits before relying on it.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for all tool operations |
| MCP | ✓ | Hosted MCP server exposes the same operations |
| CLI | - | No dedicated CLI; use MCP or REST |

## Authentication

- **Type**: OAuth or API Key (Bearer)
- **Setup (Claude Code)**: `claude mcp add --transport http manifold https://mcp.manifoldmcp.com/mcp`, then sign in with OAuth
- **Setup (ChatGPT/Claude Desktop)**: Add as a custom connector with server URL `https://mcp.manifoldmcp.com/mcp`
- **Setup (Cursor/Codex/Gemini CLI)**: Add as a remote HTTP server; clients without OAuth use a Manifold API key as Bearer token
- **API Key** (CI / scheduled runs): Created in the Manifold dashboard, passed as `Authorization: Bearer <key>`

Manifold hosts the accounts — no signup, plan, or key at any platform beyond your own Search Console, Analytics, and Bing Webmaster Tools (which you connect optionally, for your own sites' data). Every call from the free plan or a paid plan is billed to one balance at a price shown before the call.

## When to Use Manifold vs. Native Tools

Manifold is an **alternative integration method** for platforms you don't already pay for or connect to directly. Follow the user's explicit tool choice first. Otherwise, prefer an existing key, integration, or free tool that meets the task's requirements. Use this decision guide:

| Scenario | Use |
|----------|-----|
| Keyword volumes, SERP snapshots, or rankings for an audit, no Ahrefs or Semrush subscription | Manifold SEO tools |
| What ChatGPT, Claude, Gemini, Perplexity, or Google AI Overviews say about your brand or category | Manifold AEO tools |
| Your own site's Search Console, Bing Webmaster Tools, or GA4 data via MCP, no local server setup | Manifold (connect your accounts once) |
| Reddit posts, comments, or community search; no Reddit API app | Manifold Reddit tools |
| Public TikTok, Instagram, YouTube, Facebook, or LinkedIn data for research; no developer accounts | Manifold social tools |
| Google Maps local business listings, reviews, and competitors | Manifold Google Maps tools |
| Public ad creatives from Meta, Google, TikTok, LinkedIn ad libraries | Manifold ad library tools |
| App Store or Google Play app listings, reviews, and rankings | Manifold app store tools |
| Amazon or Google Shopping product listings and reviews | Manifold shopping tools |
| Company firmographics, tech stack, and work email finding | Manifold people & company tools |
| You already hold an Ahrefs, Semrush, Exa, or Apollo account | That vendor's native guide |
| Your own site's ad accounts, CRM, or inbox | Native MCP server or API guide (Manifold is read-only) |
| Vendor not covered by Manifold | Native API guide |

## Setup

### 1. Connect to your MCP client

**Claude Code:**

```bash
claude mcp add --transport http manifold https://mcp.manifoldmcp.com/mcp
```

**Claude Desktop / ChatGPT:**
Add as a custom connector with server URL: `https://mcp.manifoldmcp.com/mcp`

**Cursor / Codex / Gemini CLI:**
Add as a remote HTTP server in your MCP configuration. For clients without OAuth, create a Manifold API key in the dashboard and pass it as a Bearer token.

### 2. Sign in

Your client opens a browser. Sign in with Google or email and approve Manifold. This creates your account and a workspace on the free plan with 250 credits per month. No card required.

### 3. Verify installation

In Claude Code, run `/mcp` to confirm `manifold` is connected. In Claude Desktop or ChatGPT, check your connector settings.

### 4. Test with a real query

Ask for something specific rather than naming tools:

- "What does Google show for crm for startups, and who ranks?"
- "Audit example.com for technical SEO and AI readiness."
- "Find the head of marketing at Acme Corp and their work email."

## Coverage by Marketing Need

One key covers every row. Manifold aggregates data sources so your agent sees a unified interface.

| Need | What you get |
|------|--------------|
| **SEO** | Google organic search: keywords, search volume, rankings, results pages (SERPs), domains, backlinks, and site health |
| **Search Console** | Your own sites' clicks, rankings, sitemaps, indexing, crawl issues from Google Search Console and Bing Webmaster Tools; sitemap and URL submission (free) |
| **Google Analytics** | Your own sites' sessions, users, conversions, revenue by channel, page, campaign, or date from GA4 (free) |
| **AEO (AI answers)** | What ChatGPT, Claude, Gemini, Perplexity, and Google AI Overviews say and cite about your brand or category; whether a site is ready for them |
| **Google Maps** | Local businesses: who ranks for a search in an area, filtered lists for prospecting, full Business Profiles |
| **Ad Libraries** | Public ad creatives from Meta, Google, TikTok, and LinkedIn ad libraries by keyword, brand, or advertiser |
| **Reddit** | Posts, comments, communities: search across Reddit or watch what appears in a subreddit |
| **TikTok** | Accounts, videos, comments, transcripts, and audience data |
| **Instagram** | Accounts, posts, reels, comments, and transcripts |
| **Facebook** | Pages, posts, groups, comments, and transcripts |
| **YouTube** | Channels, videos, comments, and transcripts |
| **LinkedIn** | People, companies, posts, and job listings (read-only) |
| **App Stores** | App Store and Google Play: app listings, reviews, rankings, and metadata |
| **Shopping** | Amazon and Google Shopping: product listings, reviews, and pricing |
| **People & Companies** | Company firmographics, hiring signals, tech stack, work email finding and verification (per-reveal charges) |
| **Monitoring** | Scheduled checks of AI answers, rankings, and reviews (free tool, credit spent on each check) |

### Alternative to Existing Tools

These vendors **already have API or MCP guides** in this repo. Manifold provides an alternative path:

| Tool | Native Integration | Direct access | Via Manifold |
|------|-------------------|---------------|-------------|
| [Ahrefs](ahrefs.md) | API ✓, MCP ✓, CLI ✓ | API from a paid plan | Per call, no plan |
| [Semrush](semrush.md) | API ✓, MCP ✓, CLI ✓ | API from a paid plan plus API units | Per call, no plan |
| [Exa](exa.md) | API ✓, MCP ✓, CLI ✓, SDK ✓ | Pay per use, free starter tier | Per call — prefer native (MCP, SDKs) |
| [Apollo](apollo.md) | API ✓, MCP ✓, CLI ✓ | Free tier includes API credits | Per call, no account |
| [Google Search Console](google-search-console.md) | API ✓, CLI ✓ | Free, requires Google Cloud project setup | Free via Manifold, hosted OAuth |
| Google Analytics 4 | API ✓, MCP ✓, CLI ✓ | Free, requires Google Cloud project setup | Free via Manifold, hosted OAuth |

Coverage evolves — check [manifoldmcp.com/docs](https://manifoldmcp.com/docs) for the current tool catalog.

## Common Agent Operations

**Note**: Manifold tools are designed to be called naturally through your AI agent's conversation. The agent will discover and use the right tools based on your request. All paid tools support a `dry_run: true` parameter that returns the credit cost without executing the call.

### Keyword research

```
> "Get monthly search volume for 'espresso machine' in the US"
```

Agent uses Manifold's SEO tools.

### Check AI visibility

```
> "What does ChatGPT say when someone asks for the best CRM for startups? Do we get mentioned?"
```

Agent uses Manifold's AEO tools.

### Pull your own Search Console data

```
> "Show me which pages got clicks from Google last week"
```

Agent uses your connected Search Console via Manifold (free).

### Local business research

```
> "Find coffee shops in Austin, TX with 4+ stars and at least 100 reviews"
```

Agent uses Manifold's Google Maps tools.

### Social listening

```
> "What are people saying about project management tools on Reddit this month?"
```

Agent uses Manifold's Reddit tools.

### Competitor ad research

```
> "Show me active Meta ads from Slack and Asana"
```

Agent uses Manifold's ad library tools.

### Find contact info

```
> "Find the VP of Marketing at Acme Corp and their work email"
```

Agent uses Manifold's people & company tools (per-reveal charges apply).

## Pricing

Pay per call in credits, no subscription required. Each tool shows its credit cost before running (call with `dry_run: true` to preview cost without execution).

| Plan | Price | Credits | Notes |
|------|-------|---------|-------|
| Free | $0 | 250/month | No rollover, no card required |
| Starter | $29/mo | TBD | (TODO: verify credit amount) |
| Pro | TBD | TBD | (TODO: verify tiers and pricing) |

**Free tools** (cost nothing on every plan):
- All Search Console tools
- All Google Analytics tools
- All Monitoring tools (credit spent on each scheduled check, not setup)
- `seo_get_page` and `aeo_get_site_readiness`

**Provider errors** and timeouts are never charged. Failed calls that return no useful data may be credited back (verify current refund policy).

Current pricing for every tool: [manifoldmcp.com/pricing](https://manifoldmcp.com/pricing.md)

## Limitations

- **Read-only** — Manifold looks things up. It does not post, comment, message, send email, buy anything, or manage ad campaigns. The only write operation is submitting sitemaps or URLs to your own Search Console or Bing Webmaster Tools.
- **Public data + your own accounts** — Reads public data and your own Search Console, Bing Webmaster Tools, and Google Analytics once you connect them. It does not connect ad accounts, CRMs, or inboxes.
- **Credit metering** — Apart from the free tools, every call spends credits from your monthly balance.
- **Coverage depth varies** — Some categories have many tools (SEO, social), others just a few (shopping, app stores). Check the docs for specific tool availability.
- **Vendor dependency** — If Manifold's servers are down, all data sources are unavailable through this path.
- **Young product** — Launched recently, so expect features and pricing to evolve. Confirm current capabilities before building production workflows.

## How it fits the skills

Manifold is one integration path for the data these skills need:

- **seo-audit** — Keyword volumes, rankings, backlinks, technical site health, your own Search Console data
- **ai-seo** — What AI engines say and cite about your brand, citation tracking, AEO readiness checks
- **content-strategy** — Keyword research, search volume, ranking difficulty, SERP analysis
- **competitor-profiling** — Competitor rankings, their AI mentions, backlink analysis, ad creatives
- **prospecting** — Company data, work email finding, local business lists from Google Maps
- **social** — Reddit, TikTok, Instagram, YouTube, Facebook, LinkedIn data for social listening and research
- **ads** — Public ad creative from Meta, Google, TikTok, LinkedIn ad libraries for inspiration and competitive analysis

The skills remain neutral and tool-agnostic. Manifold is listed alongside the native options; use it when it fits the task's data needs and your account setup.

## Links

- Site: https://manifoldmcp.com
- Docs: https://manifoldmcp.com/docs
- Setup guide: https://manifoldmcp.com/setup.md
- LLM context: https://manifoldmcp.com/llms.txt
- Pricing: https://manifoldmcp.com/pricing.md
- X/Twitter: [@manifoldmcp](https://x.com/manifoldmcp)

## Relevant Skills

- seo-audit (keyword research, rankings, backlinks, technical SEO via Manifold)
- ai-seo (AI answer tracking, citation analysis via Manifold)
- content-strategy (keyword research, SERP analysis via Manifold)
- competitor-profiling (competitor rankings, AI mentions, ad creatives via Manifold)
- prospecting (company data, email finding, local businesses via Manifold)
- social (Reddit, TikTok, Instagram, YouTube, Facebook, LinkedIn data via Manifold)
- ads (ad library research via Manifold)
- customer-research (social listening, review mining via Manifold)

## TODO: Items Requiring Live Testing

The following items need verification once Corey's Manifold account is active:

1. **Paid plan pricing** — Starter and Pro tier prices and credit amounts (marked TBD above)
2. **Exact tool names** — MCP tool catalog with exact function names and parameters
3. **Credit costs** — Specific credit cost per tool category (marked TBD above)
4. **Rate limits** — Per-workspace and per-tool request limits
5. **Search Console / GA4 connection** — OAuth flow and data refresh rates
6. **Monitoring setup** — How scheduled checks are configured and charged
7. **Email finding charges** — Per-reveal costs for people & company tools
8. **Error handling** — Exact refund policy for failed or empty-result calls
9. **API key creation** — Dashboard location and scoping for headless access

Once live testing is complete, update this guide with verified details and remove this TODO section.
