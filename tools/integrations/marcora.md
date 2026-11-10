# Marcora

Context layer for go-to-market teams: positioning, brand voice, and product facts in one source of truth that AI tools read from. Agents reach it over a read-only REST API or a hosted MCP server.

Facts below were checked against the [API docs](https://marcora.ai/docs/api) and [MCP docs](https://marcora.ai/docs/mcp-overview) on 2026-11-10.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Read-only REST at `https://api.marcora.ai/v1`: context search and Brand Foundation |
| MCP | ✓ | Hosted at `https://mcp.marcora.ai` (Streamable HTTP, OAuth or API key); reads and saves |
| CLI | - | Not available |
| SDK | - | Plain HTTP |

## Authentication

- **REST API**: read-only API key in `Authorization: Bearer <key>`
  - **Env var** (convention): `MARCORA_API_KEY`
  - **Get key**: Integrations → API Keys (`https://app.marcora.ai/integration-settings?tab=api-keys`). It's shown once and expires after the period you choose, up to one year.
  - It works only on `/v1`, and the MCP server refuses it.
- **MCP**: OAuth with dynamic client registration, so there's no app to set up. Non-interactive clients can instead send an MCP API key from Integrations Settings (`https://app.marcora.ai/integration-settings`) as the bearer.

## MCP Server Setup

### Claude Code

```bash
claude mcp add --transport http marcora https://mcp.marcora.ai
```

Run `/mcp` to sign in. In other MCP clients, add `https://mcp.marcora.ai` as a remote server.

## Common Agent Operations

### Read the Brand Foundation before writing

The Brand Foundation is the team's company overview, brand voice, writing style, and writing examples.

```bash
curl "https://api.marcora.ai/v1/brand-foundation?elements=company_overview,brand_voice,writing_style" \
  -H "Authorization: Bearer $MARCORA_API_KEY"
```

```json
{
  "company_overview": "…",
  "brand_voice": "…",
  "writing_style": "…",
  "link_url": "…"
}
```

Leave out `elements` to get all four. An element the team hasn't set comes back as an empty string.

### Search the team's context for a topic

Returns the passages from the team's Reference Library (product docs, personas, competitive analysis, messaging) closest to a prompt.

```bash
curl -X POST "https://api.marcora.ai/v1/context/search" \
  -H "Authorization: Bearer $MARCORA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Positioning and proof points for a VP of Marketing", "include_brand_foundation": true}'
```

```json
{
  "relevant_context": "…ranked passages, with document boundaries…",
  "brand_foundation": {
    "included": true,
    "elements": {
      "company_overview": "…",
      "brand_voice": "…",
      "writing_style": "…",
      "writing_examples": "…"
    },
    "link_url": "…"
  },
  "context_rag_ids": ["…"],
  "sources": [
    {
      "context_item_id": "…",
      "context_item_name": "Positioning",
      "context_rag_ids": ["…"],
      "link_url": "…",
      "audience": "team"
    }
  ]
}
```

- `prompt` is required, up to 25,000 characters. Optional: `collection_ids`, `dimension_option_ids` (leans results toward an audience, persona, or industry), `project_id`, and `context_rag_ids` (passages to leave out, such as ones already used). Unknown fields are rejected.
- Search returns the closest passages the key can see even when none is a good match, so check `sources` before quoting a fact.
- There are no list endpoints. Collection, audience, and project IDs come from the MCP tools `list_context_collections`, `list_targeting_dimensions`, and `list_projects`.

Over MCP, the same two reads are `get_brand_foundation` and `get_relevant_context`.

### Save and share work (MCP only)

The REST API doesn't write, so these run over MCP:

| Task | MCP tool | Main arguments |
|------|----------|----------------|
| Save reference material, such as a call insight or a competitor page | `add_context` | `name`, plus one of `content`, `import_url`, or `connected_webpage_url` |
| Save a draft the agent wrote | `create_content` | `content`, starting with `# <Title>` |
| Have Marcora write a draft from the team's context | `create_content` | `instructions` (uses Studio Credits) |
| List reusable content templates | `list_blueprints` | none |
| Publish a finished piece as a share page | `create_external_share` | `content_id`, optional `expires_at` |
| Export a document to Word | `convert_markdown_to_word_doc` | `markdown_content`, optional `filename` (uses Studio Credits) |

Run `learn_marcora_tools` for the full tool guide.

## Rate Limits and Errors

- REST API: 60 requests per minute per key, paced at one per second and shared by both endpoints. Over the limit returns `429` with `Retry-After: 1`.
- Errors are JSON with `code` and `message`. `401` means a missing, expired, or revoked key; `403` means the key's owner lacks access.
- REST calls don't currently use Marcora credits. Plans are at [marcora.ai/pricing](https://marcora.ai/pricing).

## How It Differs from `.agents/product-marketing.md`

This repo's `product-marketing` skill writes a team's positioning, ICP, competitors, customer language, and brand voice to `.agents/product-marketing.md` (formerly `product-marketing-context.md`), and the other marketing skills read it first. Marcora holds the same kind of context outside the repo.

- **Use the file** when one person or one repo's agents need the context and it fits in a document an agent reads whole. It's free and needs no account.
- **Use Marcora** when the same context has to reach several people or AI tools (Claude, ChatGPT, Cursor, other MCP clients) and stay current in one place, or when the material is more than one file holds, such as product docs, personas, competitive analysis, and call notes, and the agent should pull only the passages that fit the task.
- **If a team uses both,** update positioning in Marcora and refresh the file from it (product overview and brand voice from `GET /v1/brand-foundation`), so the repo's other skills read the same version.

## When to Use

- An agent is writing marketing copy and needs the team's actual positioning, brand voice, and product facts.
- Several people or AI tools need to draw on the same facts, kept current in one place.

## When It's Not Needed

- One-off copy with no team context: a plain prompt is enough.
- One person or one repo, with context that fits in `.agents/product-marketing.md`: use the file.

## Relevant Skills

- **product-marketing**: the context file an agent can refresh from Marcora
- **copywriting**: pages and emails in the team's voice
- **sales-enablement**: battlecards and one-pagers from the team's product facts
- **launch**: launch messaging that matches current positioning

## Links

- API docs: https://marcora.ai/docs/api
- MCP docs: https://marcora.ai/docs/mcp-overview
