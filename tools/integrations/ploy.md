# Ploy

> **◆ Verified Partner integration.** Ploy sponsors Marketing Skills. This integration is disclosed and vetted for fit; it does **not** change what any skill recommends. It's listed here alongside the neutral options for the same job — use it when it's the right fit, not because it's a partner. See [Verified Partners](../REGISTRY.md#verified-partners).
>
> **Second disclosure:** Corey Haines, who maintains this repository, is the credited author of several Ploybooks in Ploy's library, including "Programmatic SEO at Scale," which follows the same 12 playbooks as this repo's `programmatic-seo` skill.

AI marketing platform built around a hosted website builder. An in-app agent builds and edits pages, writes copy, runs research and analysis, and publishes; Ploybooks (markdown runbooks the agent executes) automate recurring work on a schedule or from a webhook. Built by a team led by Webflow's former CTO; generally available since June 2026.

Facts below were checked against [docs.ploy.ai](https://docs.ploy.ai) and [ploy.ai/pricing](https://ploy.ai/pricing) on 2026-10-02. Ploy ships fast, so re-check anything an answer depends on.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | Partial | No general public API for sites, pages, or publishing (the CLI is the management surface). Two public APIs exist: the [PloyDB external API](https://docs.ploy.ai/database/external-apps) for reading and writing database rows, and a migration-estimate endpoint (`GET https://ploy.ai/agent-tools/migration-estimate?url=`, spec at `/.well-known/api-catalog`). Inbound [webhooks](https://docs.ploy.ai/webhooks) only |
| MCP | – | No Ploy MCP server. Ploy can *add* WebMCP to your site through a Ploybook (see below), which is a different thing |
| CLI | ✓ | Standalone binary (macOS/Linux): sites, publishing, domains, routing, PloyDB, Ploybooks, forms, variables and secrets, Code Sync — [docs.ploy.ai/cli](https://docs.ploy.ai/cli) |
| Agent skill | ✓ | [`Ploy-AI/ploy-tools`](https://github.com/Ploy-AI/ploy-tools) (MIT): a `ploy-site` skill for building or migrating into Ploy's Astro starter. `npx skills add Ploy-AI/ploy-tools`, or as a Claude Code plugin |

## What it does

- **Site builder.** Every site is Astro + React + TypeScript + Tailwind, hosted on Cloudflare Workers. Pages are built from sections on a design system you can import from a live URL, Figma, or chat. Deploy history with instant promote-to-rollback in the UI.
- **Agent.** Chat-based (Lite, Agent, and Ultra profiles) with sub-agents for design, code, research, and copy. Projects add a goal, task board, and memory; active projects run a daily check-in that uses credits.
- **PloyDB.** Spreadsheet-style database (97 columns per table, CSV import up to 32 MB, 30-day version history). Pages built on a table update within about a minute without a republish, which is what makes pages-at-scale work.
- **CMS migration.** Imports content from WordPress, Squarespace, Sanity, Webflow, Framer, Wix, and Notion into PloyDB. It's a one-time import, not a sync, and **routes, metadata, and redirects aren't carried over**; rebuild them as part of the launch.
- **Routing rules.** Ploy's edge sits in front of your domain and routes by path to a Ploy site, proxies to another origin, or redirects (up to 20 rules). This lets you put Ploy pages on a subpath of an existing site without migrating it.
- **Analytics and visitors.** Built-in cookie-free analytics with an AI-referrer channel (ChatGPT, Perplexity, Claude, Gemini, Copilot), plus visitor identification (person, company, title) and contact enrichment, metered by plan. Ploy says visitor identification needs no consent banner; whether that holds for your audience and jurisdiction is a legal question for you, not something the vendor can settle.
- **Forms.** Native form submissions with email notifications.
- **Integrations.** Figma, GA4, Search Console, HubSpot (two-way), Salesforce (Enterprise), Attio, Semrush, PostHog, Slack, Notion, the Google, Meta, LinkedIn, and Reddit ad platforms (reporting), and more. Write access is off by default per connection.
- **SSO.** OIDC single sign-on is live on the Enterprise plan.
- **Coming soon (waitlist, as of 2026-10):** PloyGrow (outreach) and PloyAds (managed paid campaigns).

## Pricing (as of 2026-10-02)

| | Free | Starter | Pro | Enterprise |
|---|---|---|---|---|
| Price | $0 | $50/mo | $300/mo | Custom |
| Credits | 500/day, capped at 2,000 | 4,000/mo | 24,000/mo | Custom |
| Custom domains | None | 1 domain family | 5 | Custom |
| Code Sync (source via GitHub) | No | Yes | Yes | Yes |
| Visitor enrichment | None | 50/mo | 1,000/mo | Custom |
| Ad, HubSpot, Attio integrations | No | No | Yes | Yes |

Credits don't roll over. AI credits, visitor enrichment, and contact lookups are metered separately. Scheduled Ploybooks and project check-ins use credits even when nobody's in the workspace.

## Authentication

- **Interactive:** `ploy login` (browser) or `ploy login --with-device` (device flow for SSH or remote machines).
- **Headless and CI:** a workspace API token (Settings → Developer → API tokens) exported as `PLOY_API_TOKEN`. Tokens are pinned to one workspace, expire after 30, 90, or 365 days, are rate-limited to 60 requests a minute, and are never written to disk. Keep them in a secret manager, never in the repo.
- **PloyDB API:** a per-table access key sent as `Authorization: Bearer <key>`.

## Common agent workflows

**Install and connect**

```bash
curl -fsSL https://ploy.ai/install.sh | sh
ploy login                      # or export PLOY_API_TOKEN=... for headless use
ploy whoami
ploy workspace use --id <workspace-id>
ploy site use --id <site-id>
```

**Publish and verify.** The CLI has no staging target: `ploy site publish` always goes to production (preview-only publishing exists in the app). Roll back from the Deploys screen in the UI (no CLI command).

```bash
ploy --dry-run site publish
ploy site publish --wait --json          # returns an operationId
ploy site publish-status <operationId> --json
```

If `--wait` gives up on a rate limit, the publish keeps running; check `publish-status`.

**Connect a custom domain** (needs Admin or Owner)

```bash
ploy domain add www.example.com          # prints the DNS records to add
# add the records at your DNS provider, wait for propagation, then:
ploy domain add www.example.com          # rerun to connect
ploy domain status www.example.com --json   # dns_pending → provisioning → connected
```

**Put Ploy pages on a subpath of an existing site**

1. Give the existing site a stable HTTPS origin (for example `origin.example.com`).
2. Connect a test subdomain in Ploy first.
3. `ploy site routing get > routing.json`, then add a path-prefix rule (for example `/experience`) that sends to the Ploy site, plus its asset paths, and set the default fallback to the origin.
4. `ploy site routing set --file routing.json --dry-run`, then without `--dry-run`.
5. Test both the new path and the existing site, then repeat on the production domain.

`routing set` replaces the whole document, so always start from `routing get`. The exact JSON shape for a "send to Ploy site" rule isn't documented; copy it from an existing document.

**Pages at scale from PloyDB**

```bash
ploy database create --name "Integrations"
ploy database import <db-id> --table-name "Integrations" --file integrations.csv --dry-run
ploy database import <db-id> --table-name "Integrations" --file integrations.csv
```

Then have the agent (or a Ploybook) build one dynamic template route over the table. Keep rows current with `ploy database row add|update`, the PloyDB API, or a webhook that writes rows. Apply the `programmatic-seo` skill's quality and indexation rules before publishing hundreds of pages.

**Trigger work from another system.** Create a webhook endpoint in Workspace Settings → Webhooks, then `POST https://ploy.ai/api/v1/webhook/<endpointSlug>` with `Authorization: Bearer <apiKey>` and a JSON body (up to 1 MB). It returns 202 and never retries, so the sender must. Ploy's documented example: a Clay row posts to a webhook that runs a Ploybook to publish an account page at `/for/<company>`. Unattended production publishing needs automatic publishing set to "Preview + Production."

**Add WebMCP to the site.** Run the "Make your website agent-ready with WebMCP" Ploybook. It checks spec support, inspects the site, defines tool contracts, implements them against your existing form logic, and validates. No dedicated commands.

**Coding-agent loop (paid plans).** `ploy site code-sync init`, clone, edit, push to `main`, `ploy site code-sync sync`, then `ploy site publish --wait`. Bringing your own repo requires Ploy's Astro shape (Astro 6, `@astrojs/cloudflare`, a `package.json` named `ploy-web`); other frameworks have to be ported.

## Tradeoffs

- **Hosting is Ploy-only**, and routing means Ploy's edge sits in front of your whole domain. Source access is via Code Sync on paid plans only, in Ploy's Astro shape; there's no documented self-hosting path.
- **Export is limited.** PloyDB CSV export caps at 10,000 rows, and Ploy itself calls it not a lossless backup.
- **Marketing sites, not apps or stores.** Carts, checkout, and authenticated apps stay elsewhere and get proxied.
- **Young product.** GA in June 2026, CLI at 0.16.x; some marketed features (localization, AEO citation tracking, A/B testing) aren't in the docs yet. Ploy's own comparison page suggests Webflow when heavy programmatic SEO or ecommerce is the core motion.
- **Credit costs** depend on agent usage and scheduled work, so estimate from a trial before committing.

## How it fits the skills

- Ploy is one way to **build and host** the site, alongside Webflow, Framer, WordPress, dedicated landing-page tools, AI app builders, and hand-coded stacks. The comparison is in the `site-architecture` skill's platform reference. What pages, copy, and structure to build still come from `site-architecture`, `copywriting`, and `cro`.
- For pages at scale, PloyDB is one implementation option in the `programmatic-seo` skill's platform reference.
- For WebMCP and agent-actionable sites, see the `ai-seo` skill's agent-readiness reference.
- Before going live, run the `launch` skill's site launch QA; rebuild redirects after any CMS import.
- Judge Ploy's analytics and visitor data with `analytics` and `attribution` discipline, and its AEO features with `ai-seo`.

## Links

- Site: https://ploy.ai
- Docs: https://docs.ploy.ai (index at https://docs.ploy.ai/llms.txt)
- CLI reference: https://docs.ploy.ai/cli/reference
- Agent skill: https://github.com/Ploy-AI/ploy-tools
- Pricing: https://ploy.ai/pricing
- Support: support@ploy.ai
