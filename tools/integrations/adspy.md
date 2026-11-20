# Adspy

Competitor ad research for AI agents: search public Meta and Google ads by brand, phrase or AI tag, read the stored creative analysis of an ad (hook, message, visuals, transcript), and read a brand's organic TikTok, YouTube and Instagram posts, including the posts it later ran as ads. Answers come with counts and dates. Spend, conversions and ROAS are not public ad data and are not returned.

Facts below were checked against the [connect page](https://www.adspy.sh/connect), [llms.txt](https://www.adspy.sh/llms.txt), the [MCP tool list](https://www.adspy.sh/features/mcp) and the [MCP server card](https://www.adspy.sh/.well-known/mcp/server-card.json) on 2026-11-13.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST at `https://www.adspy.sh/api/v1`, OpenAPI 3.1 at `https://www.adspy.sh/openapi.json`; Enterprise plan only; Instagram is not in the API |
| MCP | ✓ | Hosted server at `https://www.adspy.sh/mcp` (Streamable HTTP, OAuth 2.1 or API key); works on every paid plan |
| CLI | - | Not available |
| SDK | - | Not available |

## Authentication

- **Type**: OAuth 2.1 in the browser (PKCE S256, client ID metadata documents or dynamic client registration). Clients without OAuth send an API key as `Authorization: Bearer <key>`
- **Env var** (convention): `ADSPY_API_KEY`
- **Get key**: Settings in the Adspy web app
- **Spending limit**: each connection gets a monthly limit for paid results when it is approved; it can be changed or revoked in Settings
- **Account needed**: a paid Adspy plan; there is no free plan. Adspy never connects your own ad or social accounts

## MCP Server Setup

### Claude Code

```bash
claude mcp add --transport http --scope user adspy 'https://www.adspy.sh/mcp' && claude mcp login adspy
```

### Codex

```bash
codex mcp add adspy --url 'https://www.adspy.sh/mcp' && codex mcp login adspy
```

### Claude (claude.ai, desktop, mobile)

Customize → Connectors → Add custom connector, name it Adspy, paste `https://www.adspy.sh/mcp`, then sign in to Adspy and approve.

ChatGPT and Cursor are listed as "coming soon" on the connect page (not yet tested end to end). Any other client that supports remote MCP over Streamable HTTP can use the same URL.

Check the connection with the free `get_context` tool before any paid call: it returns the workspace, the credit balance and the connection's spending limits.

## Common Agent Operations

Tools are called by the assistant from plain-language requests. Most brand tools need the `brandKey` that `search_brands` returns.

| Job | Tools | Cost |
|-----|-------|------|
| Find a brand | `search_brands`, `find_brand_by_domain`; `search_advertisers` looks a missing brand up live in Meta Ad Library and Google Ads Transparency | Free |
| Search ads | `search_creatives` (phrase, filters, AI tags, sort order), `search_creatives_by_meaning` (an idea in your own words, matched on transcripts) | Included |
| Count ads | `count_creatives`, `list_creative_tags` (the tag vocabulary for exact filters) | Free |
| Read one ad | `get_creatives` (copy, media, dates, source ads, transcript), `get_creative_analysis` (stored AI reading: hook, message, visuals, CTA) | Included |
| Find related ads | `find_similar_creatives` (other brands' ads sharing AI tags) is included; `find_same_media` (brands running the exact same image or video) is free | Included / Free |
| Organic posts | `search_social_accounts` (free), `list_social_posts`, `get_social_posts`, `find_posts_run_as_ads` | Included |
| Watch brands | `follow_brand`, `list_followed_brands` (free); `get_followed_brands_report` (Unlimited and Enterprise plans only) | Free / plan |
| Keep research | `save_creatives`, `update_note`, `list_collections` (free), `get_collection` (included) | Free / Included |
| Files | `export_research` (CSV, Excel, JSON or a ZIP of media; ads also Markdown or HTML; reports PDF, Excel, JSON or CSV), `get_job`, `list_exports` (last 7 days) | Included |
| Reports | `get_brand_full_analysis` (ads plus organic posts, each finding with its sample size and 95% interval, 90 credits), `get_brand_xray` (60), `get_brand_social` (60), `compare_brands` and `compare_social` (up to 60 per brand) | Credits |
| Add a missing brand or account | `request_brand_fetch`, `request_social_fetch`; ask `quote_operation` for the price first | 400 credits (0 for a social account Adspy already collects) |

Example, a brand's long-running video ads:

```
Using Adspy, find Ritual in the library, then show its video ads that have been running for at least 30 days, longest first, and break down how each one opens.
```

Example, posts that became ads:

```
Using Adspy, list the organic TikTok, YouTube or Instagram posts AG1 later ran as ads, with the delay between each post and its ad.
```

## Rate Limits and Pricing

- MCP needs a paid plan: Starter ($19 a month, one source chosen among Meta, Google or TikTok), Pro ($39, every source), Unlimited ($99, no credit count, fair use) or Enterprise on contract. The first subscription has a 3-day trial with 100 credits; a card is required.
- Browsing (searching and opening ads, analyses, posts, collections and most exports) costs no credits within fair use. On Starter and Pro, reading past fair use costs 1 credit per new item until the limit resets.
- Credits pay for the reports and fetches in the table above; reports are free to reopen for 24 hours. Paid tools state their price before they run.
- Check [adspy.sh/pricing](https://www.adspy.sh/pricing) for current prices.

## Tradeoffs

- Public ad data only: no spend, conversions, ROAS, reach or targeting. Running time and AI tags are observations, not proof that an ad works.
- Ad sources are Meta (Facebook and Instagram ads) and Google (Google and YouTube ads, through Ads Transparency). TikTok ads and other ad networks are not covered; on TikTok only organic posts are.
- No access to your own ad or social accounts; for those use [Meta Ads](meta-ads.md) and [Google Ads](google-ads.md).
- For other routes to the same jobs: Meta's free [Ad Library](https://www.facebook.com/ads/library/) for single lookups, and [ScrapeCreators](scrapecreators.md) for raw public posts and ad library data across more networks.

## Relevant Skills

- **competitor-profiling**: a competitor's ads and organic posts read together
- **reverse-engineer-marketing**: what a brand runs, keeps running and repeats
- **ad-creative**: hooks and formats from real ads before writing a brief

## Resources

- Connect: https://www.adspy.sh/connect
- Tools and credit costs: https://www.adspy.sh/features/mcp
- llms.txt: https://www.adspy.sh/llms.txt
- MCP server card: https://www.adspy.sh/.well-known/mcp/server-card.json
