# Contentful

Enterprise headless CMS with multi-locale support, two-API architecture, and composable content.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Content Delivery API (read), Content Management API (write) |
| MCP | - | No official MCP server |
| CLI | ✓ | `contentful-cli` for spaces, content types, migrations |
| SDK | ✓ | `contentful` (delivery), `contentful-management` (management) |

## Authentication

- **Delivery API (CDA)**: `Authorization: Bearer {delivery_token}`
  - Base URL: `https://cdn.contentful.com`
  - Read-only, CDN-cached
- **Preview API (CPA)**: `Authorization: Bearer {preview_token}`
  - Base URL: `https://preview.contentful.com`
  - Read-only, returns draft content
- **Management API (CMA)**: `Authorization: Bearer {management_token}`
  - Base URL: `https://api.contentful.com`
  - Read/write, not cached
- **Tokens**: Create in Settings → API keys (delivery) or Settings → CMA tokens (management)

## Common Agent Operations

### Get entries (Delivery API)

```bash
GET https://cdn.contentful.com/spaces/{space_id}/environments/{environment}/entries?content_type=blogPost&limit=10

Authorization: Bearer {delivery_token}
```

### Get single entry

```bash
GET https://cdn.contentful.com/spaces/{space_id}/environments/{environment}/entries/{entry_id}

Authorization: Bearer {delivery_token}
```

### Search and filter

```bash
# By field value
GET https://cdn.contentful.com/spaces/{space_id}/environments/{environment}/entries?content_type=blogPost&fields.slug=my-post

# Full-text search
GET https://cdn.contentful.com/spaces/{space_id}/environments/{environment}/entries?query=marketing+strategy

# By date range
GET https://cdn.contentful.com/spaces/{space_id}/environments/{environment}/entries?content_type=blogPost&fields.publishDate[gte]=2024-01-01
```

### Create entry (Management API)

CMA uses PUT with a client-generated `entry_id`. To auto-generate, use POST without an ID in the path.

```bash
PUT https://api.contentful.com/spaces/{space_id}/environments/{environment}/entries/{entry_id}
Content-Type: application/vnd.contentful.management.v1+json
X-Contentful-Content-Type: blogPost
Authorization: Bearer {management_token}

{
  "fields": {
    "title": {"en-US": "New Post"},
    "slug": {"en-US": "new-post"},
    "body": {"en-US": "Post content here"}
  }
}
```

### Update entry

```bash
PUT https://api.contentful.com/spaces/{space_id}/environments/{environment}/entries/{entry_id}
Content-Type: application/vnd.contentful.management.v1+json
X-Contentful-Version: {current_version}
Authorization: Bearer {management_token}

{
  "fields": {
    "title": {"en-US": "Updated Title"}
  }
}
```

### Publish entry

```bash
PUT https://api.contentful.com/spaces/{space_id}/environments/{environment}/entries/{entry_id}/published
X-Contentful-Version: {current_version}
Authorization: Bearer {management_token}
```

### Unpublish entry

```bash
DELETE https://api.contentful.com/spaces/{space_id}/environments/{environment}/entries/{entry_id}/published
X-Contentful-Version: {current_version}
Authorization: Bearer {management_token}
```

## CLI Commands

```bash
# Login
contentful login

# List spaces
contentful space list

# Export space content
contentful space export --space-id {space_id}

# Import content
contentful space import --space-id {space_id} --content-file export.json

# Create migration
contentful space migration --space-id {space_id} migration.js

# List content types
contentful content-type list --space-id {space_id}
```

## Key Objects

- **Space** — Top-level container for content (one per project)
- **Environment** — Isolated content branch (`master`, `staging`, etc.)
- **Content Type** — Schema definition with fields and validations
- **Entry** — Content item of a specific content type
- **Asset** — Media file (image, video, document)
- **Locale** — Language/region variant (e.g., `en-US`, `de-DE`)

## When to Use

- Multi-locale marketing content (global sites)
- Enterprise content operations with approval workflows
- Composable content architecture
- Teams needing established vendor support and SLAs
- Content reuse across multiple channels

## Rate Limits

Rate limits are plan-dependent. Check `X-Contentful-RateLimit-Second-Limit` response header for your actual limits.

- Delivery API (CDA): Varies by plan (typically high throughput)
- Preview API (CPA): Lower than CDA (varies by plan)
- Management API (CMA): ~10 requests per second (default)
- See [Contentful technical limits](https://www.contentful.com/developers/docs/technical-limits/) for current values

## Relevant Skills

- content-strategy (CMS selection, content modeling)
- programmatic-seo (CMS as data source for generated pages)
- site-architecture (multi-locale URL structure)
