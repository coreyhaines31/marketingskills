# Parallel

Web search with source URLs and passages, plus content extraction for known URLs through the Unified MCP server.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | Search and Extract APIs |
| MCP | ✓ | Unified server at `https://mcp.parallel.ai/mcp` |
| CLI | ✓ | [parallel.js](../clis/parallel.js), standalone Node 18+ |
| SDK | ✓ | Official Python and TypeScript SDKs |

## Authentication

The CLI uses anonymous access when `PARALLEL_API_KEY` is unset. Anonymous access is rate limited. To use an account, load `PARALLEL_API_KEY` privately into the environment; the CLI sends it as a Bearer token. An explicitly empty or malformed token fails locally. HTTP, authentication, rate-limit and tool errors never trigger retries, anonymous fallback or a provider switch.

This is an optional tool alongside [Exa](exa.md) and [Firecrawl](firecrawl.md). Running it does not change existing providers or skill defaults. For a known page, manual browser reading is also an option.

## Setup and common operations

No install or dependencies are required beyond Node 18+. No arguments prints JSON help without credentials or network access.

```bash
node tools/clis/parallel.js
node tools/clis/parallel.js search --query 'B2B SaaS onboarding examples'
node tools/clis/parallel.js search --query 'newsletter platform pricing' --objective 'Find current pricing from vendor pages' --dry-run
node tools/clis/parallel.js extract --urls https://contentsnare.com/b2b-saas-onboarding/ --objective 'Find onboarding recommendations'
```

Search discovers and calls `web_search` with an objective and keyword query. The server defaults to Fast mode. Extract discovers and calls `web_fetch`; default output is relevant excerpts. Use `--full-content` only when you need the entire page, as it can return much more text. `--cached-only` sets `allow_live_fetch` to false for extraction; cached pages can be older. Pass `--session-id <returned ID>` to connect related searches and extractions. The CLI preserves the MCP tool result, including text, structured sources, warnings and provider request IDs. Check original sources before relying on claims.

`--dry-run` previews the tool call and setup sequence with no network and masked credentials. `--timeout-ms <1-600000>` defaults to 120000 and bounds the whole network operation, including initialization, discovery, body reading and session teardown. The CLI exits unsuccessfully on errors. Aborting locally does not cancel server work already accepted.

Set `PARALLEL_DISABLED=1` or pass `--offline` to block network calls. Help and dry runs remain available. Requests use `marketingskills/parallel-cli` as their HTTP User-Agent. Redirects are refused. There is no background GET stream; each SSE response is cancelled as soon as its matching RPC result or error arrives. Sessions are deleted when issued by the server and time remains. Extract asks Parallel to retrieve pages; it does not fetch source URLs directly from your machine.

## Limits and links

Anonymous limits and server tool schemas can change. Supplying an account key may consume credits. The CLI validates its supported inputs against live discovery and fails if they no longer fit. It does not implement research jobs, feedback submission or other MCP tools.

- [Unified MCP documentation and authentication](https://docs.parallel.ai/integrations/mcp)
- [Search API](https://docs.parallel.ai/api-reference/search-beta/search)
- [Parallel platform](https://platform.parallel.ai)

Contributor disclosure: George Pickett works at Parallel.
