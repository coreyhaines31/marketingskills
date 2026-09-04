# MCP Tool Reference for Competitor Profiling

Quick reference for the Firecrawl and DataForSEO MCP tools used in competitor profiling.

## Contents
- Firecrawl Tools (site scraping)
- DataForSEO Tools (SEO & market data)
- Recommended Execution Order
- Error Handling

---

## Firecrawl Tools

### firecrawl_map
**Purpose**: Discover all URLs on a competitor's site to identify key pages.
**When to use**: First step for every competitor — before scraping individual pages.
**Key output**: List of URLs with their page types/paths.
**Tip**: Look for paths containing `/pricing`, `/features`, `/about`, `/customers`, `/integrations`, `/blog`, `/changelog`.

### firecrawl_scrape
**Purpose**: Extract content from a single page as clean markdown.
**When to use**: After mapping, scrape each key page individually.
**Key output**: Page content in markdown format — headlines, body text, structured data.
**Tip**: Scrape homepage first — it reveals positioning, audience, and social proof in one shot.

### firecrawl_search
**Purpose**: Search the web for specific content about a competitor.
**When to use**: Finding review pages, press coverage, or competitor mentions not on their own site.
**Example queries**:
- `"[Competitor Name]" site:g2.com`
- `"[Competitor Name]" review`
- `"[Competitor Name]" funding OR raised`

### firecrawl_crawl
**Purpose**: Crawl multiple pages from a site in one operation.
**When to use**: Deep profiles where you want to analyze many pages (e.g., all feature pages, all blog posts). More expensive — use selectively.
**Tip**: Set page limits to avoid crawling entire sites. Target specific URL patterns.

### firecrawl_extract
**Purpose**: Extract structured data from a page using a schema.
**When to use**: When you need specific data points in a consistent format (e.g., pricing tier details, feature lists).
**Tip**: Define a clear schema for what you want extracted — more reliable than parsing raw markdown.

---

## DataForSEO MCP Tools

### Domain-Level Intelligence

#### backlinks_summary
**Purpose**: Get domain authority, total backlinks, referring domains, spam score.
**Input**: Target domain (e.g., `competitor.com`)
**Key metrics**: `domain_rank`, `total_backlinks`, `referring_domains`, `backlinks_spam_score`

#### backlinks_referring_domains
**Purpose**: List top referring domains — shows where their link equity comes from.
**Input**: Target domain + limit
**Key metrics**: Per-domain: `rank`, `backlinks`, `domain` name

#### dataforseo_labs_google_domain_rank_overview
**Purpose**: Organic search overview — traffic, keywords, traffic value.
**Input**: Target domain
**Key metrics**: `organic_count` (keywords), `organic_traffic` (estimated monthly), `organic_cost` (traffic value in $)

#### dataforseo_labs_google_ranked_keywords
**Purpose**: What keywords a domain ranks for, with positions.
**Input**: Target domain
**Key metrics**: Per-keyword: `keyword`, `position`, `search_volume`, `url` (ranking page)
**Tip**: Sort by traffic to find their highest-value keywords.

#### dataforseo_labs_google_keywords_for_site
**Purpose**: Keywords relevant to a domain — broader than ranked keywords, includes opportunities.
**Input**: Target domain
**Key metrics**: `keyword`, `search_volume`, `competition`, `cpc`

### Competitive Analysis

#### dataforseo_labs_google_competitors_domain
**Purpose**: Find a domain's closest organic competitors by keyword overlap.
**Input**: Target domain
**Key metrics**: `domain`, `avg_position`, `intersections` (shared keywords), `full_domain_rank`
**Tip**: May reveal competitors the user hasn't considered.

#### dataforseo_labs_google_domain_intersection
**Purpose**: Find keywords where two domains both rank — shows direct competition.
**Input**: Two target domains
**Key metrics**: `keyword`, position for each domain, `search_volume`
**Tip**: Use this to compare the user's domain vs. each competitor.

#### dataforseo_labs_google_relevant_pages
**Purpose**: Find a domain's most important pages by organic traffic.
**Input**: Target domain
**Key metrics**: `page`, `metrics` (traffic, keywords per page)
**Tip**: Reveals their content strategy — which pages drive the most value.

### Technology Detection

#### domain_analytics_technologies_domain_technologies
**Purpose**: Detect the technology stack a domain uses.
**Input**: Target domain
**Key metrics**: Technologies grouped by category (CMS, analytics, marketing, payments, etc.)

### Backlink Deep Dive

#### backlinks_backlinks
**Purpose**: List individual backlinks to a domain.
**Input**: Target domain + limit
**Key metrics**: `url_from`, `url_to`, `anchor`, `domain_from_rank`, `is_new`

#### backlinks_bulk_ranks
**Purpose**: Compare domain ranks across multiple domains at once.
**Input**: Array of target domains
**Key metrics**: `domain_rank` per domain
**Tip**: Use this for the summary comparison table.

---

## Recommended Execution Order

### Quick Scan (per competitor)

```
1. firecrawl_map → get site URLs
2. In parallel:
   a. firecrawl_scrape → homepage
   b. firecrawl_scrape → pricing page
   c. dataforseo_labs_google_domain_rank_overview → organic metrics
   d. backlinks_summary → domain authority
3. Synthesize into abbreviated profile
```

### Deep Profile (per competitor)

```
1. firecrawl_map → get site URLs
2. In parallel (batch 1 — scraping):
   a. firecrawl_scrape → homepage
   b. firecrawl_scrape → pricing page
   c. firecrawl_scrape → features page(s)
   d. firecrawl_scrape → about page
   e. firecrawl_scrape → customers/case studies page
   f. firecrawl_scrape → integrations page
3. In parallel (batch 2 — SEO data):
   a. dataforseo_labs_google_domain_rank_overview
   b. dataforseo_labs_google_ranked_keywords
   c. backlinks_summary
   d. backlinks_referring_domains
   e. dataforseo_labs_google_relevant_pages
   f. dataforseo_labs_google_competitors_domain
4. In parallel (batch 3 — optional extras):
   a. domain_analytics_technologies_domain_technologies
   b. firecrawl_search → G2/Capterra reviews
   c. dataforseo_labs_google_domain_intersection (vs. user's domain)
5. Synthesize into full profile
```

### Multi-Competitor (3+ competitors)

```
1. Map all competitor sites in parallel
2. Scrape all homepages in parallel, then pricing pages in parallel
3. Pull domain_rank_overview for all in parallel
4. Pull backlinks_bulk_ranks for all at once
5. Build profiles in sequence (synthesis requires focus)
6. Build summary comparison last
```

---

## Error Handling

| Issue | Action |
|-------|--------|
| Firecrawl scrape returns empty/blocked | Try with `firecrawl_browser_create` for JS-heavy sites |
| Pricing page not found in map | Search for `/pricing`, `/plans`, `/packages` — some sites use different paths |
| DataForSEO returns no data for domain | Domain may be too new or too small — note "insufficient data" in profile |
| Rate limits hit | Space out requests; prioritize highest-value data first |
| Review page scraping blocked | Use `firecrawl_search` to find cached or alternative review sources |

---

## Alternative Stack: Ubersuggest MCP + WebFetch

If Firecrawl or DataForSEO are not available, use **Ubersuggest MCP** (for SEO and market data) and **WebFetch** (for page scraping). Coverage is slightly less comprehensive — no site mapping, no structured extraction, no technology detection — but sufficient for quick scans and most competitive profiling needs.

### When to use each stack

| Capability | Primary (preferred) | Alternative |
|---|---|---|
| Page scraping | Firecrawl MCP | WebFetch (built into Claude Code) |
| Site URL discovery | `firecrawl_map` | Manually probe common paths |
| SEO metrics | DataForSEO MCP | Ubersuggest MCP |
| Backlink data | DataForSEO backlinks tools | Ubersuggest `backlinks_overview` + `linking_domains` |
| Technology detection | `domain_analytics_technologies_domain_technologies` | Not available in alternative stack |
| Review mining | `firecrawl_search` → G2/Capterra | WebFetch G2/Capterra URLs directly |

Check which MCPs are available at the start of each session and select the stack accordingly. If both are available, prefer the primary stack.

---

### WebFetch (alternative to Firecrawl)

**Purpose**: Fetch and read any public web page as text.
**Built into**: Claude Code — no MCP required.
**Limitation vs. Firecrawl**: No site mapping (URL discovery); no structured extraction; may not render JavaScript-heavy pages well.

Since WebFetch does not map a site's URLs, probe common paths manually for each competitor:

| Page type | Paths to try |
|---|---|
| Homepage | `https://[domain]/` |
| Pricing | `/pricing`, `/plans`, `/packages`, `/pricing-plans` |
| About | `/about`, `/about-us`, `/company`, `/team` |
| Features / Product | `/features`, `/product`, `/platform`, `/solutions` |
| Customers | `/customers`, `/case-studies`, `/clients`, `/success-stories` |
| Integrations | `/integrations`, `/apps`, `/connect` |
| Blog | `/blog`, `/resources`, `/insights` |

Fetch the homepage first. Its nav links often reveal the actual paths for pricing, features, and about pages — use those instead of guessing.

---

### Ubersuggest MCP Tools (alternative to DataForSEO)

Mapping from DataForSEO equivalents:

#### domain_overview
**DataForSEO equivalent**: `dataforseo_labs_google_domain_rank_overview`
**Purpose**: Domain-level organic traffic estimate, keyword count, domain score, and backlink summary in one call.
**Input**: `root_domain` (e.g. `competitor.com`), `country` (default: `us`)
**Key metrics**: `domain_score`, `organic_monthly_traffic`, `organic_keywords`, `paid_keywords`

#### backlinks_overview
**DataForSEO equivalent**: `backlinks_summary`
**Purpose**: Domain authority, total backlinks, referring domains count.
**Input**: `root_domain`
**Key metrics**: `domain_authority`, `total_backlinks`, `referring_domains`

#### linking_domains
**DataForSEO equivalent**: `backlinks_referring_domains`
**Purpose**: List of top domains linking to the target — shows where link equity comes from.
**Input**: `root_domain`

#### domain_keywords
**DataForSEO equivalent**: `dataforseo_labs_google_ranked_keywords`
**Purpose**: Keywords the domain ranks for, with position and estimated search volume.
**Input**: `root_domain`, `country`
**Tip**: Sort by traffic to find their highest-value keywords.

#### domain_top_pages
**DataForSEO equivalent**: `dataforseo_labs_google_relevant_pages`
**Purpose**: Pages driving the most organic traffic — reveals content strategy.
**Input**: `root_domain`, `country`

#### competitors (Ubersuggest)
**DataForSEO equivalent**: `dataforseo_labs_google_competitors_domain`
**Purpose**: Find organic competitors by keyword overlap — may surface rivals the user hasn't considered.
**Input**: `root_domain`, `country`

---

### Recommended Execution Order (Ubersuggest + WebFetch)

#### Quick Scan (per competitor)

```
1. WebFetch competitor homepage → extract nav links to find real page paths
2. In parallel:
   a. WebFetch pricing page (from nav or probe /pricing)
   b. domain_overview → traffic + keyword count + domain score
   c. backlinks_overview → domain authority
3. Synthesize into abbreviated profile
```

#### Deep Profile (per competitor)

```
1. WebFetch homepage → extract nav links
2. In parallel (scraping):
   a. WebFetch pricing page
   b. WebFetch features/product page
   c. WebFetch about page
   d. WebFetch customers/case studies page
   e. WebFetch blog index (content strategy signals)
3. In parallel (SEO data):
   a. domain_overview
   b. backlinks_overview
   c. domain_keywords
   d. domain_top_pages
   e. linking_domains
   f. competitors
4. Synthesize into full profile
```

#### Multi-Competitor (3+ competitors, alternative stack)

```
1. WebFetch all homepages in parallel
2. WebFetch pricing pages in parallel (use paths from homepage navs)
3. Pull domain_overview for all in parallel
4. Pull backlinks_overview for all in parallel
5. Build profiles in sequence; build summary last
```

### Error Handling (alternative stack)

| Issue | Action |
|---|---|
| WebFetch returns empty or an error page | Try `https://www.[domain]/` variant; note if site is JS-rendered and flag in profile |
| Pricing page not found at common paths | Check homepage nav HTML for pricing link before giving up |
| Dynamic content shows as "0" or blank | JavaScript-rendered counters (headcount, client counts, live stats) return placeholder values via WebFetch — note the gap and flag as "JS-rendered, value unconfirmed" in the profile. Use Firecrawl browser mode if the value is critical. |
| Ubersuggest returns no data for domain | Domain may be too new or too small — note "insufficient data" in profile |
| Ubersuggest tool not available | Check MCP connection; fall back to WebFetch of competitor's SEO/press pages for qualitative signals only |
