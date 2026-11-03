# Marcora

Context layer for go-to-market teams: positioning, brand voice, and product facts in one source of truth that AI tools read from. Agents reach it over a hosted MCP server.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | - | No public REST API; use MCP |
| MCP | ✓ | Hosted at `https://mcp.marcora.ai` (Streamable HTTP) |
| CLI | - | Not available |
| SDK | - | Not available |

## Authentication

- **OAuth 2.0** (interactive clients): connect to `https://mcp.marcora.ai`. Dynamic client registration means there's no app to set up.
- **API token** (non-interactive): generate one at https://app.marcora.ai/integration-settings and send `Authorization: Bearer {api_key}` to the same URL.

## Connecting

Claude Code:

```bash
claude mcp add --transport http marcora https://mcp.marcora.ai
```

Other MCP clients: add `https://mcp.marcora.ai` as a remote server.

Optional companion skill, which teaches an agent the tool sequences:

```bash
npx skills add ccromp/marcora-mcp
```

## Common Agent Operations

| Task | MCP tool |
|------|----------|
| Read brand voice, company overview, writing style | `get_brand_foundation` |
| Search the team's context for a topic | `get_relevant_context` |
| Save new reference material | `add_context` |
| Save a draft, or have Marcora write one | `create_content` |
| List reusable content templates | `list_blueprints` |
| Publish a finished piece as a share page | `create_external_share` |
| Export a document to Word | `convert_markdown_to_word_doc` |

Run `learn_marcora_tools` for the full tool guide.

## When to Use

- An agent is writing marketing copy and needs the team's actual positioning and voice.
- Several people or AI tools need to draw on the same facts, kept current in one place.

## When It's Not Needed

- One-off copy with no team context: a plain prompt is enough.
- A small team already keeps positioning in a doc its agent can read: that may be sufficient, and it's free.

## Pricing

See https://marcora.ai/pricing.

## Links

- Docs: https://marcora.ai/docs/mcp-overview
- Repo: https://github.com/ccromp/marcora-mcp
