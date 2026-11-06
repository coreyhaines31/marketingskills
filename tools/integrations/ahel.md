# Ahel

Pay-per-call data for agents over MCP and HTTP: official EU company registers, EU public tenders, sanctions lists, SEO and social data, from one prepaid balance.

> **Disclosure:** this guide was contributed by the Ahel team. Ahel went public in October 2026, so confirm coverage, prices and each source's terms before relying on it.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | `GET /api/v1/call/{id}` with a team key in `X-Ahel-Token` |
| MCP | ✓ | `https://mcp.ahel.ai`, streamable HTTP, OAuth 2.1 |
| CLI | - | Use the API or MCP |
| SDK | - | n8n community node: `n8n-nodes-ahel` |

## When it fits

| Scenario | Option |
|----------|--------|
| You already hold a key for a data vendor | That vendor's own guide |
| One EU company check, by hand | The national register's free site |
| EU company checks across countries from an agent | Ahel `companies.register.search`, or each register's own API where it has one |
| EU tenders | TED's free API; Ahel `procurement.tenders.search` returns the same notices as agent-ready rows |
| Sanctions lists | The official lists are free to download; Ahel `sanctions.screen.company` checks a name against OFAC and EU lists and names its sources |
| Large recurring lists with a table UI | Clay or a similar waterfall tool |

## Cost

Prepaid, no subscription. The price is quoted before each run. On 4 Nov 2026 register search and tender search were $0.004 per successful call, and a sanctions check was $0.02 per successful call, with no charge when nothing is found. Provider-backed calls carry a 10% margin over the provider's rate. Coverage varies by country, so check before relying on it. A sanctions name match is not identity proof and not a legal verdict.

## Links

- Docs: https://ahel.ai/docs?ref=marketingskills
- OpenAPI: https://ahel.ai/openapi.json
