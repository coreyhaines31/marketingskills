# SaaSCity

Keyless MCP server, CLI, and directory dataset for auditing homepage launch readiness, filtering 1,600+ startup and AI directories by Ahrefs Domain Rating and link type, and checking live directory backlinks.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Keyless Streamable HTTP JSON-RPC endpoint (`/api/mcp`) and Maker API |
| MCP | ✓ | Public remote Streamable HTTP server at `https://saascity.io/api/mcp` |
| CLI | ✓ | `saascity` CLI and Go/Swift SDK wrappers |
| SDK | ✓ | Zero-dependency Go (`saascity-go`) and Swift (`saascity-swift`) SDKs |

## Authentication

- **Type**: None for the public MCP server (`https://saascity.io/api/mcp`)
- **Rate limits**: Enforced per IP (20/hr for `check_launch_readiness`, 60/hr for directory lookups and `check_backlink`)
- **CORS**: Enabled (`POST`, `OPTIONS`) for browser-based MCP clients

## MCP Setup

### Claude Code

```bash
claude mcp add --transport http saascity https://saascity.io/api/mcp
```

### MCP Client Config (Cursor, Windsurf, Claude Desktop)

```json
{
  "mcpServers": {
    "saascity": {
      "url": "https://saascity.io/api/mcp"
    }
  }
}
```

## Common Agent Operations

All tools can be called through MCP or directly via HTTP JSON-RPC (`POST https://saascity.io/api/mcp`).

### Audit a homepage for launch readiness

Runs 16 static HTML checks (HTTPS, `noindex`, `<title>`, meta description, live `og:image`, X card, favicon, canonical, mobile viewport, `<h1>`, JSON-LD, `robots.txt`, `sitemap.xml`, parked/404 status, response time, and non-empty HTML without JS).

```bash
curl -sS -X POST https://saascity.io/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "check_launch_readiness",
      "arguments": { "url": "https://example.com" }
    }
  }'
```

### Get curated launch directories by product type

`product_type` accepts `saas`, `ai`, `devtools`, or `any`. Pass `free_only: true` to return only free or freemium routes.

```bash
curl -sS -X POST https://saascity.io/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "recommend_launch_directories",
      "arguments": { "product_type": "saas", "free_only": true }
    }
  }'
```

### Filter the 1,600+ directory dataset

Filter by `min_dr`, `link_type` (`any`, `dofollow`, `nofollow`), `pricing` (`any`, `free`, `free_or_freemium`, `paid`), `exclude_badge_exchange`, `category`, `query`, `sort` (`dr`, `name`), `limit` (`1–50`), and `offset`.

```bash
curl -sS -X POST https://saascity.io/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "find_launch_directories",
      "arguments": {
        "link_type": "dofollow",
        "pricing": "free_or_freemium",
        "exclude_badge_exchange": true,
        "min_dr": 40,
        "limit": 20
      }
    }
  }'
```

### Vet a single directory before paying

```bash
curl -sS -X POST https://saascity.io/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tools/call",
    "params": {
      "name": "get_launch_directory",
      "arguments": { "domain": "uneed.best" }
    }
  }'
```

### Check whether a live directory listing passes a dofollow backlink

Inspects static HTML for direct anchors targeting your domain, `rel` attributes (`nofollow`, `ugc`, `sponsored`), redirect-only wrappers, hidden links, page-level `noindex`/`nofollow`, and canonicals.

```bash
curl -sS -X POST https://saascity.io/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 5,
    "method": "tools/call",
    "params": {
      "name": "check_backlink",
      "arguments": {
        "page_url": "https://directory.example/tools/your-product",
        "your_domain": "example.com"
      }
    }
  }'
```

### Create a human-confirmed draft listing on SaaSCity

`submit_project` saves an unpublished draft and returns a `claimUrl`. Nothing is published or billed until the human opens the link, signs in, chooses a free badge slot or paid plan, and submits. Track progress with `get_submission_status` and check badge markup with `check_badge`.

## How to Read the Output

- `linkType: "unknown"` and `pricing: "unknown"` mean the directory has not been confirmed in the latest sweep; do not assume free or dofollow.
- `drCheckedAt` reports when Domain Rating was last updated per row; `dataUpdatedAt` reports the last list sweep date.
- `check_launch_readiness` and `check_backlink` read static HTML only (matching how directory bots and link-preview fetchers read pages). Client-side JS-only links report `not_found`.

## Constraints

- Per-IP rate caps apply on the keyless endpoint; bulk crawling thousands of URLs is not supported.
- `submit_project` refuses free preview subdomains (such as `*.vercel.app`) and domains that already have a listing.
- Directory DR and link policies change over time; re-check before paying for a listing.

## When to Use

- Running a zero-setup pre-launch homepage audit before submitting to directories
- Filtering startup and AI directories by DR, link type, pricing, and badge-swap terms
- Checking whether live directory listings actually render followed HTML backlinks

## When Not to Use

- Full-site technical SEO crawls or Core Web Vitals profiling (use a local auditor or crawler)
- Keyword volume, organic traffic estimates, or full backlink profile analysis (use Ahrefs, Semrush, or Search Console)

## Relevant Skills

- **directory-submissions**: filter candidate directories, vet paid listings, and verify live backlinks
- **launch-strategy**: run pre-launch homepage checks and sequence launch-day vs evergreen directories
- **seo-audit**: check static HTML metadata, canonicals, `robots.txt`, and `sitemap.xml`

## Links

- [MCP Server Documentation](https://saascity.io/mcp)
- [Free Dofollow Directories List](https://saascity.io/free-dofollow-directories)
- [Developer Docs Repository](https://github.com/best-directories/saascity-docs)
- [MCP Server Repository](https://github.com/nyyhao/saascity-mcp)
