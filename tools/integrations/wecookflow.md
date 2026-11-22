# WeCookFlow

Public guest post prices for the same websites across link-building marketplaces and open catalogs, plus search for sites that sell guest posts by niche, country, language, DR, traffic and price.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | - | No public REST API; the web page at https://wecookflow.com compares a pasted list or a CSV |
| MCP | ✓ | Remote server at `https://wecookflow.com/mcp` (Streamable HTTP), listed in the MCP Registry as `com.wecookflow/mcp` |
| CLI | - | Not available |
| SDK | - | Not available |

## Authentication

- **Type**: none within the free limits; OAuth (MCP authorization with dynamic client registration) to raise them
- **Sign-in**: when a call goes over the free limits the server answers `401` and the client opens the WeCookFlow sign-in page, which asks only for an email
- **Clients without OAuth**: a personal token from https://wecookflow.com/mcp-setup, sent as `Authorization: Bearer ss_...`; keep it in an environment variable or secret manager, not in the repo

## Setup

Claude Code:

```bash
claude mcp add --transport http --scope user wecookflow https://wecookflow.com/mcp
```

Claude Desktop and claude.ai: Settings > Connectors > Add custom connector, URL `https://wecookflow.com/mcp`.

Other MCP clients (Cursor, VS Code, Windsurf and others):

```json
{ "mcpServers": { "wecookflow": { "type": "http", "url": "https://wecookflow.com/mcp" } } }
```

## Common Agent Operations

### Compare prices for a list of sites

```
compare_prices(domains=["techbullion.com", "https://example.com/some-page"], niche="general")
```

Accepts domains or full URLs, for example a competitor's referring domains exported from Ahrefs or Semrush. For each site found it returns the price on each marketplace, the best price and where (`best.channel`, `best.price`), the most expensive offer (`max_price`), the gap between them (`spread_pct`), DR and traffic. Sites not sold on any marketplace come back in `not_found`. `niche` is `general` (default), `igaming`, `crypto`, `cbd` or `adult`, for marketplaces that price those niches separately.

### Find sites that sell guest posts

```
search_sites(topic="tech", country="us", language="en", min_dr=50, min_traffic=10000, max_price=200, sort="dr", limit=20)
```

Filters: `topic` (one or several, comma-separated), `niche`, `country` (ISO 3166), `language` (ISO 639-1), `min_dr`, `min_traffic`, `min_price` and `max_price` in USD. `sort` is `dr_traffic` (default), `dr`, `traffic` or `price`. For the next page pass `next_offset` from the response as `offset`. Each site has its prices per marketplace, the best price and where, and `link_type` (`dofollow` when the marketplace states it, otherwise `unknown`). Universities, government sites and large brands are left out. Country, language and topic are known only for part of the sites, so these filters return fewer sites than exist.

### List the marketplaces compared

```
list_channels()
```

### Get a token in a client that can't sign in

```
sign_up(email="user@example.com")
```

Ask the user for the address. Not needed in clients that support MCP OAuth.

## Limits

| | Without sign-in | Signed in (free) |
|---|---|---|
| `compare_prices` | 50 sites per call | 1,000 sites per call |
| `search_sites` | first 10 results of a search | 50 per call, 1,000 a day |

## Data notes

- Prices are public marketplace prices in USD for a guest post (article) and can be out of date; the final price and terms are confirmed with the seller on the marketplace. WeCookFlow does not sell placements.
- DR is Domain Rating by Ahrefs where `dr_source` is `ahrefs`, otherwise as reported by sellers. Traffic is as reported by sellers and catalogs, not verified.

## When to Use

- A prospect list or a competitor's referring domains is ready and the user plans to buy placements: check which sites sell guest posts and where each one costs less
- Building a list of paid guest post sites within a budget, by topic, country, language, DR and traffic

## Links

- MCP setup by client: https://wecookflow.com/mcp-setup
- Server listing and tool reference: https://github.com/WeCookFlow/mcp
- Privacy policy: https://wecookflow.com/privacy

## Relevant Skills

- link-building
- competitors
