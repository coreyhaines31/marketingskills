# Add competitor-profiling skill

Adds a new `competitor-profiling` skill for researching and profiling competitors from a list of URLs. The skill combines live site scraping (Firecrawl) with SEO and market intelligence (DataForSEO) to produce structured, comparable competitor profile documents.

## What it does

Given competitor URLs, the skill:

1. Maps each competitor's site and scrapes key pages (homepage, pricing, features, about, customers, integrations, changelog)
2. Pulls SEO and market data — domain authority, backlinks, ranked keywords, organic traffic, top pages, and adjacent competitors
3. Optionally mines review sites (G2, Capterra, Product Hunt, TrustRadius) for sentiment and themes
4. Synthesizes everything into a consistent profile template, plus a cross-competitor summary doc

Supports both **quick scan** (homepage + pricing + basic SEO) and **deep profile** (full scrape + backlink analysis + review mining) modes.

## Files

- `skills/competitor-profiling/SKILL.md` — main skill instructions
- `skills/competitor-profiling/references/templates.md` — full profile + summary templates
- `skills/competitor-profiling/references/tool-reference.md` — Firecrawl + DataForSEO MCP tool reference with example calls

## Why it's useful

Fills the gap between raw competitive research and downstream skills. The structured output is designed to feed directly into:

- `competitor-alternatives` — comparison/alternative pages
- `sales-enablement` — battle cards
- `content-strategy` — content gap analysis
- `pricing-strategy` — pricing teardown
- `seo-audit` — relative SEO benchmarking
