# SpecStream

Live web data engine: a Search API, an Extract API, and drop-in compatibility for major search providers.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Web Search, Extract |
| MCP | ✓ | Remote server at `https://api.specstream.ai/mcp` |
| CLI | - | |
| SDK | - | |

## Drop-in Compatibility

The `https://api.specstream.ai` endpoint accepts requests formatted for Tavily, Exa, Brave, Serper, and SearXNG unchanged.

## Authentication

- **Type**: API Key
- **Header**: `x-api-key: {key}`
- **Get key**: https://specstream.ai

## Endpoints

Base URL: `https://api.specstream.ai`

| Endpoint | Purpose |
|----------|---------|
| `GET /v1/web-search` | Search the web (fast: $1/1k, default: $5/1k) |
| `POST /v1/extract` | Extract content ($0.80/1k pages) |

## When to Use

- **Agent Search** - Drop-in replacement for existing providers
- **Content Extraction** - Scalable page extraction

## Relevant Skills

- ai-seo
- content-strategy
- competitor-profiling
- customer-research
