# Sanity

Headless CMS with real-time collaboration, GROQ query language, and schema-as-code.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | GROQ queries, Mutations API, Assets API |
| MCP | - | No official MCP server |
| CLI | ✓ | `sanity` CLI for studio, datasets, deployment |
| SDK | ✓ | `@sanity/client`, `next-sanity`, `@sanity/image-url` |

## Authentication

- **Type**: API Token (Bearer)
- **Header**: `Authorization: Bearer skXXXXXX`
- **Tokens**: Create in Sanity Manage → API → Tokens
- **Permissions**: Read-only or Read+Write per token

## Common Agent Operations

### Query documents (GROQ)

URL-encode the `query` parameter value in practice.

```bash
GET https://{projectId}.api.sanity.io/v2024-01-01/data/query/{dataset}?query=*[_type == "post"]{title, slug, publishedAt}
```

### Query with parameters

```bash
GET https://{projectId}.api.sanity.io/v2024-01-01/data/query/{dataset}?query=*[_type == "post" && slug.current == $slug][0]&$slug="my-post"
```

### Get document by ID

```bash
GET https://{projectId}.api.sanity.io/v2024-01-01/data/doc/{dataset}/{documentId}
```

### Create document (Mutations API)

```bash
POST https://{projectId}.api.sanity.io/v2024-01-01/data/mutate/{dataset}

{
  "mutations": [
    {
      "create": {
        "_type": "post",
        "title": "New Post",
        "slug": {"_type": "slug", "current": "new-post"},
        "body": [{"_type": "block", "children": [{"_type": "span", "text": "Hello"}]}]
      }
    }
  ]
}
```

Use `createOrReplace` instead if you want to upsert (requires `_id` field).

### Delete document

```bash
POST https://{projectId}.api.sanity.io/v2024-01-01/data/mutate/{dataset}

{
  "mutations": [
    {"delete": {"id": "document-id"}}
  ]
}
```

### Patch document

```bash
POST https://{projectId}.api.sanity.io/v2024-01-01/data/mutate/{dataset}

{
  "mutations": [
    {
      "patch": {
        "id": "document-id",
        "set": {"title": "Updated Title"}
      }
    }
  ]
}
```

## CLI Commands

```bash
# Create a new Sanity project
sanity init

# Start the studio locally
sanity dev

# Deploy studio to Sanity hosting
sanity deploy

# Export dataset
sanity dataset export production ./backup.tar.gz

# Import dataset
sanity dataset import ./data.ndjson production

# List datasets
sanity dataset list

# Run a GROQ query
sanity documents query '*[_type == "post"][0..9]{title, slug}'
```

## Key Objects

- **Document** — Top-level content item with `_id`, `_type`, `_rev`
- **Asset** — Images and files stored in Sanity CDN
- **Reference** — Link between documents (`{_type: "reference", _ref: "doc-id"}`)
- **Portable Text** — Rich text as structured array of blocks
- **Dataset** — Isolated content database (e.g., `production`, `staging`)
- **Slug** — URL-friendly identifier (`{_type: "slug", current: "my-slug"}`)

## When to Use

- Structured content for marketing sites and blogs
- Multi-channel content delivery (web, mobile, email)
- Real-time collaborative editing workflows
- Content-heavy sites with complex models
- Next.js or React-based frontends

## Rate Limits

Rate limits vary by plan. Documented defaults:

- CDN API (queries): High throughput, globally distributed (no hard per-second cap published)
- API (without CDN): Rate-limited per project (varies by plan)
- Mutations: Rate-limited per project (varies by plan)
- See [Sanity technical limits](https://www.sanity.io/docs/technical-limits) for current values

## Relevant Skills

- content-strategy (CMS selection, content modeling)
- programmatic-seo (CMS as data source for generated pages)
- site-architecture (URL structure from CMS slugs)
