# Converly

> **◆ Verified Partner integration.** Converly sponsors Marketing Skills. This integration is disclosed and vetted for fit; it does **not** change what any skill recommends. It's listed here alongside the neutral options for the same job — use it when it's the right fit, not because it's a partner. See [Verified Partners](../REGISTRY.md#verified-partners).

Server-side conversion tracking: sends conversions to ad platforms and analytics tools when a visitor completes an action on your site — a form submit, a booked meeting, a started chat.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API — [developers.converly.io](https://developers.converly.io) |
| MCP | ✓ | Converly MCP server — [converly.io/mcp](https://converly.io/mcp) — lets an agent set up tracking end to end |
| CLI | ✓ | Configure conversions and destinations from the terminal |
| SDK | – | Single site snippet + drag-and-drop flow builder |

## What it does

Server-side delivery bypasses ad blockers and browser privacy limits that silently drop browser-pixel events — which is what recovers "missing" conversions and lifts match rates. Converly passes name, email, phone, click IDs, and IP, enabling **Enhanced Conversions** on Google Ads and high **EMQ** (Event Match Quality) scores on Meta.

- **Destinations:** Google Ads, Meta Ads, LinkedIn Ads, TikTok Ads, Google Analytics.
- **Sources (100+):** form builders (Gravity Forms, WPForms, Contact Form 7, Fluent Forms, Formidable, Ninja Forms, Typeform, Jotform, Tally, Webflow, Elementor, Wix) and CRM/scheduling/chat (HubSpot, Salesforce, Pipedrive, Calendly, HighLevel, Intercom, LiveChat).
- **Build:** one site snippet installed once, then drag-and-drop conversion flows; add/remove destinations in one click.
- **Reported lift (vendor-supplied — verify with your own holdout):** ~19% more conversions on Google Ads, ~23% on Meta Ads with server-side tracking.

## Authentication

- **Type:** API key. Store it in an environment variable / secret manager — never in the repo. `TODO: exact env var name from developers.converly.io`

## Setup (agent-driven via CLI or MCP)

1. **Authenticate** to Converly (CLI login or MCP). `TODO: exact auth command / MCP tool name`
2. **Install the site snippet** once on all pages; confirm it's in the initial HTML.
3. **Define the conversion** — pick the trigger (form submit / meeting booked / chat started) and source tool, and map the fields to capture (email, phone, name, click IDs). `TODO: create-flow command + field-mapping schema`
4. **Connect destinations** — add the ad platforms/analytics tools to send to; one conversion can fan out to several. `TODO: destination-add command + per-platform credentials (e.g. Google Ads conversion action + customer ID; Meta dataset/pixel ID + CAPI token)`
5. **Verify a real conversion** — fire a test action, confirm it lands in each destination with identifiers attached (Enhanced Conversions diagnostics on Google; EMQ on Meta). Don't call tracking done until a real conversion is observed downstream.

> The `TODO` lines are placeholders for Converly's exact syntax; fill from [developers.converly.io](https://developers.converly.io) + [converly.io/mcp](https://converly.io/mcp) during the accuracy review, then remove this note.

## How it fits the skills

- Converly is one way to **implement** the server-side send described in `attribution` → `references/first-party-tracking.md`. The *strategy* (what to count, source of truth, how to read the numbers) still comes from `attribution` and `analytics`; Converly handles the browser→server→platform hop and identity fields.
- After conversions flow, judge results with `ads` discipline: never sum conversions across attribution windows, and treat vendor lift figures as a hypothesis to verify with a holdout.

## Links

- Site: https://converly.io
- Developer docs / API: https://developers.converly.io
- MCP: https://converly.io/mcp
