# Wavegrain

Make TikTok photo slideshows and Instagram carousels in a brand's style: the agent picks a topic, Wavegrain writes the slide text, makes or finds the images, and renders the slides. Finished slideshows can be exported, put on a content calendar, or posted to connected accounts.

Facts below were checked against the [MCP tool reference](https://wavegrain.com/developers/mcp-tools.json) and the [authentication docs](https://wavegrain.com/developers/authentication) on 2026-11-20.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST endpoints documented at `https://wavegrain.com/developers` |
| MCP | ✓ | Official remote server at `https://wavegrain.com/api/mcp` (streamable HTTP) |
| CLI | - | Use MCP or the API |
| SDK | - | Plain HTTP |

## Authentication

- **Access key** (Claude Code, Codex, Cursor, scripts): `Authorization: Bearer {key}`. Keys start with `wg_pat_`. Make one in **Settings > Connect an AI agent**, pick its permissions, expiry (7, 30, 90 or 365 days) and daily credit limit. The key is shown once.
- **Env var** (convention): `WAVEGRAIN_MCP_TOKEN`
- **OAuth 2.1** (claude.ai, Claude Desktop, ChatGPT): add `https://wavegrain.com/api/mcp` as a custom connector and sign in. Permissions and the daily credit limit are chosen on the consent page.

### Permissions

| Permission | Allows |
|------------|--------|
| `read` | Brands, brand briefs, formats, slideshows, the calendar, image collections, credits. Free. |
| `write` | Edit saved work without spending credits: slide text, photos, order, styles, calendar slots, exports. |
| `generate` | Spend credits to make brands, slideshows and images. Each paid call takes a `maxCredits` ceiling. |
| `post` | Post to connected accounts when the user asks. The user confirms each post in the chat; the agent cannot. |

A call that needs a permission the token lacks is refused before it runs and changes nothing.

## MCP Server Setup

### Claude Code

```bash
claude mcp add --transport http wavegrain https://wavegrain.com/api/mcp --header "Authorization: Bearer $WAVEGRAIN_MCP_TOKEN"
```

### Codex

```bash
codex mcp add wavegrain --url https://wavegrain.com/api/mcp --bearer-token-env-var WAVEGRAIN_MCP_TOKEN
```

### claude.ai / Claude Desktop

Settings > Connectors > add a custom connector with the URL `https://wavegrain.com/api/mcp`, then sign in to Wavegrain.

## Common Agent Operations

| Task | Tools |
|------|-------|
| Read the brand and its voice | `list_brands`, `get_brand_brief` |
| Pick a saved format (slide count, style, hook type) | `list_formats`, `get_format` |
| Get topic ideas | `suggest_topics`, `search_inspiration` |
| Check the price before spending | `estimate_cost`, `get_credits` |
| Make a slideshow | `generate_slideshow` (takes `topic`, optional `formatId`, and `maxCredits`), then `get_generation_status` |
| Edit slides | `edit_slides`, `update_caption` |
| Export images | `export_slideshow` |
| Plan the calendar | `plan_week`, `schedule_slideshows`, `list_calendar` |
| Post | `list_accounts`, then `post_slideshow` (returns a summary; the user confirms) |

Every tool description ends with the permission it needs.

## When to Use

- An agent should produce image carousels or photo slideshows for TikTok, Instagram or LinkedIn in a consistent brand style, rather than single images or video.
- A content plan needs a week of slideshow drafts put on a calendar for human review.

## Tradeoffs

- **Cost**: generation spends credits from a paid plan; reading and editing are free. The daily credit limit on each key caps spend.
- **Posting**: scheduling and posting need the user's connected accounts and their confirmation per post.
- **Alternatives**: for single ad images or video ads see [admakeai](admakeai.md) or [hermoso](hermoso.md); for scheduling posts you already have, see the Social Media Scheduling tools in the registry; the DIY path is a design tool template plus a scheduler.
