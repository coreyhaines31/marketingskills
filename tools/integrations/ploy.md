# Ploy

> **◆ Verified Partner integration.** Ploy sponsors Marketing Skills. This integration is disclosed and vetted for fit; it does **not** change what any skill recommends. It's listed here alongside the neutral options for the same job — use it when it's the right fit, not because it's a partner. See [Verified Partners](../REGISTRY.md#verified-partners).

AI marketing platform built around a website builder: one system for building the site, optimizing it (SEO/AEO, CRO), identifying and engaging visitors, and generating ad creative with attribution. An in-app agent builds pages, writes copy, analyzes performance, and manages deploys through conversation.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Workspace-scoped API tokens for CI/headless use; inbound [webhooks](https://docs.ploy.ai/webhooks) trigger Ploybooks; OpenAPI spec published at `/.well-known/api-catalog` |
| MCP | ✓ | **WebMCP** — exposes selected website actions to compatible AI assistants while preserving the site's existing interface, permissions, and application logic |
| CLI | ✓ | Standalone binary (macOS/Linux) — workspaces, sites, domains, publishing, PloyDB, Ploybooks, variables/secrets, Code Sync — [docs.ploy.ai/cli](https://docs.ploy.ai/cli) |
| SDK | – | Agent-first instead: the CLI ships [agent skills + site inspection](https://docs.ploy.ai/cli/local-development) for coding agents working in a checked-out site |

## What it does

- **Site builder** — pages, sections, components on a design system; publish, deploy history, rollback, custom domains. Can serve alongside an existing site via [routing rules](https://docs.ploy.ai/routing-rules).
- **Analytics & visitors** — traffic tracking, visitor identification, GA4 and Google Search Console connections.
- **PloyDB** — structured content database; [CMS migration](https://docs.ploy.ai/database/cms-migration) imports existing CMS content and builds pages from the imported tables.
- **Ploybooks** — scheduled/triggered marketing playbooks; fire them from external systems via webhooks.
- **WebMCP** — expose chosen site actions (forms, booking, etc.) to AI assistants via the Model Context Protocol without rebuilding the interface.
- **Integrations** — GitHub, Figma, Google Analytics, Search Console, Notion, Slack, HubSpot, and more.

## Authentication

- **Type:** sign-in via Ploy for interactive use; **workspace-scoped API token** for CI and headless environments ([docs](https://docs.ploy.ai/cli/authentication)). Store tokens in an environment variable / secret manager — never in the repo.

## Setup (agent-driven via CLI)

1. **Install the CLI** — macOS/Linux binary ([install docs](https://docs.ploy.ai/cli/install)).
2. **Authenticate** — interactive sign-in, or set a workspace API token for [remote agents & CI](https://docs.ploy.ai/cli/remote-development) (non-interactive commands, explicit IDs, safe secret handling).
3. **Select context** — workspace and site.
4. **Build or migrate** — create pages via the agent/builder, or import existing CMS content into PloyDB and generate pages from it.
5. **Publish** — push production, connect a custom domain, verify the deploy; roll back if needed.
6. **Optionally enable WebMCP** — choose which site actions to expose to AI assistants.

## How it fits the skills

- Ploy is one way to **implement** the site itself — an alternative to a Webflow/Framer or hand-coded stack. The strategy layer (what pages, what copy, what structure) still comes from `site-architecture`, `copywriting`, and `cro`.
- Its SEO/AEO surface pairs with `seo-audit`, `ai-seo`, and `schema`; judge its analytics, visitor-identification, and attribution output with `analytics` / `attribution` discipline.

## Links

- Site: https://ploy.ai
- Docs: https://docs.ploy.ai
- CLI reference: https://docs.ploy.ai/cli/reference
- Support: support@ploy.ai
