# Prospecting Data Sources

Tool selection guide for prospecting across all three branches.

---

## Tool selection by goal

| Goal | Primary tools | Notes |
|------|--------------|-------|
| **Build initial firmographic list (B2B / SaaS)** | Apollo, ZoomInfo, Clay | Apollo for breadth, ZoomInfo for enterprise + intent, Clay for custom workflows |
| **Decision-maker mapping** | LinkedIn Sales Navigator (manual), Apollo, ZoomInfo | Sales Nav is the gold standard. Never bulk scrape it. |
| **Tech stack qualification (SaaS)** | BuiltWith, Wappalyzer | BuiltWith has wider coverage + paid plans for bulk; Wappalyzer is lighter + free for small use |
| **Funding signals (SaaS)** | Crunchbase, Pitchbook | Crunchbase free tier sufficient for early signals; Pitchbook for deeper investor data |
| **Email pattern discovery** | Hunter, Snov, Apollo | Pattern guessing — followed by verification |
| **Email deliverability verification** | Truelist, Hunter, NeverBounce, ZeroBounce | Always verify before adding to outreach lists |
| **Visitor identification (warm intent)** | RB2B, Clearbit Reveal | Anonymous traffic → company identification |
| **Intent data** | ZoomInfo Intent, 6sense, Bombora | Pre-warmed signals; mid-market+ pricing |
| **Trigger event monitoring** | Google Alerts, Feedly, LinkedIn Sales Nav alerts | Free options are sufficient for most |
| **Local business discovery** | Google Maps (manual), Yelp, Facebook Pages | Browser-assisted, not bulk-extracted |

---

## Apollo

**Use for**: General B2B / SaaS firmographic + contact data. Best starting point if you don't already have a list.

**Strengths**:
- Large database (>200M contacts, >60M companies)
- Strong filtering UI (industry, size, technologies, signals)
- Integrated email + LinkedIn finder
- Pay-as-you-go and tiered plans

**Watch out for**:
- Data freshness varies — re-verify before scoring as "Hot"
- Email accuracy ~60–80% — always validate
- Bulk export limits apply

**Integration**: see [apollo.md](../../../tools/integrations/apollo.md)

---

## Clay

**Use for**: Multi-source enrichment, waterfall lookups, custom scoring logic. When list quality matters more than list size.

**Strengths**:
- Waterfall logic: try Apollo first → fallback to ZoomInfo → fallback to Clearbit
- 100+ data provider integrations
- AI-powered enrichment (LLM-driven extraction from URLs)
- Custom columns + scoring formulas
- Native MCP server

**Watch out for**:
- Per-credit pricing can spike on large lists
- Complexity overhead — easy to over-engineer workflows

**Integration**: see [clay.md](../../../tools/integrations/clay.md)

---

## ZoomInfo

**Use for**: Enterprise B2B + intent data. Mid-market+ buyer profiles.

**Strengths**:
- Enterprise-grade firmographic depth
- Intent signals (companies searching topics relevant to your offer)
- Best-in-class for >$50K ACV B2B sales
- Native MCP server

**Watch out for**:
- Expensive ($15K+/yr starter)
- Overkill for SMB prospecting
- Locked into multi-year contracts typically

**Integration**: see [zoominfo.md](../../../tools/integrations/zoominfo.md)

---

## Clearbit

**Use for**: Email → company enrichment, anonymous visitor identification (Clearbit Reveal).

**Strengths**:
- Strong company enrichment (industry, size, funding, tech stack)
- Email lookup by domain
- Reveal: identify anonymous site visitors at company level
- API-first

**Watch out for**:
- HubSpot acquisition (2023) — bundled into HubSpot Breeze Intelligence now
- Standalone API still available but pricing/access depends on tier

**Integration**: see [clearbit.md](../../../tools/integrations/clearbit.md)

---

## Hunter / Snov

**Use for**: Email pattern discovery + lightweight verification on small lists.

**Hunter strengths**:
- Domain-based email discovery
- Built-in deliverability verification
- Free tier reasonable for occasional use

**Snov strengths**:
- Email finder + drip campaigns (overlap with outreach tooling)
- Bulk verification
- Cheaper than Hunter at scale

**Watch out for**:
- Both are pattern-guessing tools — accuracy depends on the target company's email pattern being inferable
- Always run results through a dedicated validator (Truelist or similar) before outreach

**Integrations**: see [hunter.md](../../../tools/integrations/hunter.md), [snov.md](../../../tools/integrations/snov.md)

---

## Truelist

**Use for**: Email deliverability validation before adding contacts to outreach lists. Critical safety step.

**Strengths**:
- Single-email sync verification (`/api/v1/verify_inline`) + bulk async (`/api/v1/verify`)
- Returns `email_state` (ok / email_invalid / risky / unknown / accept_all) + `email_sub_state` (email_ok / is_disposable / is_role / unknown_error / failed_smtp_check) + did-you-mean typo suggestions
- Catches catch-all domains, role accounts, spam traps, disposable providers
- Official MCP server for agent-driven workflows (Claude, Cursor, VS Code)
- Official SDKs in 7 languages + framework integrations (Django, Laravel, Next.js, Rails, React, Svelte, Vue, WordPress)
- Native integrations with Mailchimp, Klaviyo, HubSpot, Zapier, Make, n8n, Clay, Salesforce, more
- Pay-per-email pricing

**Why this matters**: Cold email reputation craters when bounce rates exceed 2%. Validating before sending is non-negotiable. Apollo/ZoomInfo/Hunter data is often 60–80% accurate — Truelist catches the rest.

**Integration**: see [truelist.md](../../../tools/integrations/truelist.md)

---

## LinkedIn Sales Navigator

**Use for**: Manual decision-maker discovery. The gold standard for B2B / SaaS prospecting but only when used as a research tool.

**Strengths**:
- Most accurate decision-maker data in the industry
- Real-time job changes, posts, signals
- Lead lists, alerts, saved searches
- Inmail credits (separate channel from cold email)

**Hard rules**:
- **Never bulk scrape**. LinkedIn aggressively bans scrapers. Account ban risk is real and permanent.
- Use Sales Nav as a research interface — open profiles, read, take notes, capture key data manually.
- Apollo and other tools claim LinkedIn data via partnerships / public mirroring — verify the source legitimacy before assuming compliance.

**Integration**: no MCP or API access at consumer level. Manual research only.

---

## BuiltWith / Wappalyzer

**Use for**: Tech stack qualification (SaaS branch).

**BuiltWith**:
- ~50K+ technologies tracked
- API + bulk lookups (paid)
- Historical data (when stack changed)

**Wappalyzer**:
- Free browser extension; paid API
- Lighter coverage than BuiltWith
- Faster for one-off lookups

Cross-reference both for high-confidence tech stack signals.

---

## Crunchbase

**Use for**: Funding signals (SaaS branch).

**Strengths**:
- Free tier shows recent funding events
- Paid (Pro / Enterprise) unlocks alerts and deep history
- API access for paid users

**Watch out for**:
- Coverage is best for VC-backed companies; bootstrapped + small businesses underrepresented
- Self-reported data — verify funding amounts independently

---

## GitHub (stargazers / forks / watchers)

**Use for**: Developer-intent prospecting. Especially powerful for dev-tool SaaS — stargazers of competitor or category-defining repos are in-market signal.

**Strengths**:
- Public API, no scraping concerns
- High signal quality (a starred repo = explicit interest)
- Forks are an even stronger signal (intent to modify, not just bookmark)
- Bundled `github-prospects.js` CLI handles pagination + enrichment + CSV output
- Free with 5,000 req/hr authenticated rate limit

**Watch out for**:
- Only ~5–20% of users publish email — pair with Apollo/Clay/Hunter for enrichment
- Very-popular repos (100K+ stars) are mostly noise; smaller targeted repos (5K–25K) give better signal density
- Most prospects are individuals, not company contacts directly — need to figure out their company from `company` field or LinkedIn

**Integration**: see [github.md](../../../tools/integrations/github.md)

---

## Firecrawl / Browserbase (single-target site research)

**Use for**: Programmatically extracting content from a **prospect's own website** that you already found via discovery on platforms like Google Maps, Yelp, or LinkedIn. Not for scraping those platforms themselves.

### Firecrawl

- **Best for**: "Just give me the page as markdown" — Local SMB website status checks, B2B company about/team page extraction, structured field extraction
- **Strengths**: Low overhead, returns clean LLM-ready markdown, handles most JS-rendered sites, has an MCP server
- **API + MCP + SDKs**: Node, Python, Go, Rust

### Browserbase

- **Best for**: When you need real Chromium — JS-heavy pages, cookie consent dialogs, form submission to reach a contact page, session state
- **Strengths**: Full browser control via Playwright/Puppeteer; Stagehand provides AI-friendly natural-language extraction; session recordings for debugging
- **API + MCP (Stagehand) + SDKs**: Node, Python

### Critical compliance line

Both tools can technically point at any URL. The hard rule:

- ✓ **OK**: extracting content from a single business's own website (`joescoffeeshop.com`) that you found through manual discovery
- ✗ **NOT OK**: pointing them at `google.com/maps`, LinkedIn search results, Yelp listings, or any platform whose ToS prohibits bulk extraction

Discovery happens on platforms (manual browser-assisted research). Extraction happens on individual public business sites.

**Integrations**: see [firecrawl.md](../../../tools/integrations/firecrawl.md), [browserbase.md](../../../tools/integrations/browserbase.md)

---

## RB2B / Clearbit Reveal

**Use for**: Identifying anonymous site visitors as warm intent signals.

**Strengths**:
- Pixel-based visitor → company identification
- High-intent: they came to your site, they're already in research mode
- Slack / email alerts on key visits

**Watch out for**:
- Privacy/GDPR considerations — verify your privacy policy disclosures
- Person-level identification raises higher concerns than company-level

**Integration**: see [rb2b.md](../../../tools/integrations/rb2b.md)

---

## Free / browser-only fallbacks

When the user has no paid tools, lean on:

- **Google Search** — exact business name + city + role searches
- **LinkedIn** (manual, no scraping) — company pages, employee lookups
- **Crunchbase free tier** — funding events
- **Wappalyzer browser extension** — tech stack at a glance
- **Hunter.io free tier** — 25 lookups/month
- **Google Maps** — for Local SMB discovery
- **Business websites + About pages** — primary source for any claim
- **News sites + press releases** — trigger event monitoring via Google Alerts

Slower than tooled-up workflows, but produces high-quality smaller lists if the user is willing to do the work.

---

## Sequencing recommendations

A typical full-stack prospecting workflow:

1. **Define ICP** from product-marketing context (no tools needed)
2. **Initial list** from Apollo or ZoomInfo (firmographic filter)
3. **Enrich** with Clay (waterfall: tech stack, funding, trigger events)
4. **Decision-maker mapping** in LinkedIn Sales Nav (manual)
5. **Email pattern discovery** with Hunter or Apollo's built-in
6. **Email validation** with Truelist before final list
7. **Hand off** to cold-email skill for outreach copy

Adapt this sequence based on which tools the user actually has.
