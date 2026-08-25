# rowbound

Open-source **CLI + MCP server** that turns a Google Sheet into a GTM enrichment pipeline — sources create rows, actions enrich them, with native **waterfalls**. The self-hosted, bring-your-own-key alternative to Clay: your data lives in your Sheet, you supply the provider API keys, and an agent can drive it over MCP.

- **Repo**: [github.com/eliasstravik/rowbound](https://github.com/eliasstravik/rowbound) (MIT)
- **Runtime**: Node 22+ CLI over the Google Workspace CLI (`gws`); ships an MCP server (`rowbound mcp`, stdio).
- Credit: by Elias Stråvik. This is an integration guide for an external open-source tool, not an affiliation.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | - | No hosted REST API — it's a local CLI + MCP over your Google Sheet |
| MCP | ✓ | `rowbound mcp` (stdio) exposes ~20 tools to Claude Desktop / any MCP client |
| CLI | ✓ | Node 22+; drives Sheets via `gws` |
| SDK | - | Use the CLI or MCP |
| License | MIT | Open source, self-hosted |

## Setup

1. Install the CLI (Node 22+) and authenticate Google via the Workspace CLI (`gws`) it builds on.
2. Point it at a Google Sheet; pipeline config lives in the Sheet's **Developer Metadata** (an Apps Script sidebar can edit it in-sheet).
3. Supply provider API keys as environment variables (BYOK — Clearbit/Apollo/Hunter/etc. keys are yours).
4. Register the MCP server (`rowbound mcp`) with your agent to drive it conversationally.

See the repo README for exact install commands and flags (they evolve; don't hard-code them).

## Model: sources → actions

- **Sources** create rows: `http`, `exec`, `webhook`, `script`.
- **Actions** enrich rows. Action types include:
  - **`waterfall`** — try providers in fallback order (e.g. Clearbit → Apollo → Hunter) until one returns. The headline feature.
  - **`http`** — call any HTTP API per row.
  - **`ai`** — run a per-row prompt via a headless agent (Claude/Codex).
  - **`formula`**, **`lookup`**, **`write`**, **`exec`**, **`script`**.
- **`when`** conditions gate each action; smart-skip, rate limiting, retry/backoff, run history, dry-run, and SSRF protection are built in.

## Common Agent Operations (MCP)

The `rowbound mcp` server exposes tools an agent calls directly — representative ones:

- `run_pipeline` — execute the Sheet's configured pipeline (respecting `when` gates and skips).
- `add_action` — append an enrichment action (e.g. a waterfall) to the pipeline.
- `preview_rows` — inspect current rows / a dry-run before spending credits.

(~20 tools total; see the repo for the full list and arguments.)

## When to Use

- You want **Clay-style waterfall enrichment** but **self-hosted, BYOK, and version-controllable** — no per-seat SaaS, your data in your own Sheet.
- An agent needs to **drive enrichment over MCP** (build a list, add a waterfall, run it, read results) rather than clicking a no-code tool.
- Cost-sensitive enrichment where you want direct control of provider keys and fallback order.

## vs. the paid options in this category

- **Clay** — hosted, no-code, 75+ providers, MCP connector. Pick when you want the managed platform and breadth.
- **rowbound** — open-source, local, BYOK, native waterfalls, MCP. Pick when you want ownership, cost control, and an agent-drivable pipeline.

## Relevant Skills

- prospecting
- cold-email
- revops
- sales-enablement
