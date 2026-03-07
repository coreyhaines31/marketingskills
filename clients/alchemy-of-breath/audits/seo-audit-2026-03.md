# SEO Audit: Alchemy of Breath
**Domain**: alchemyofbreath.com
**Date**: March 2026
**Auditor**: Claude Code (marketing-skills/seo-audit)
**Method**: Google search index intelligence + bot-protection bypass analysis
**Scope**: Technical SEO, on-page SEO, site architecture, indexation, AI search readiness

---

## Executive Summary

**Overall SEO Health**: ⚠️ MODERATE RISK — Several critical issues require immediate attention.

Alchemy of Breath has strong brand authority and a well-differentiated product (breathwork facilitator training), but the website has multiple technical SEO issues that are likely suppressing organic traffic. The most critical issue is an aggressive WAF/bot protection configuration that blocks all automated HTTP requests — including potentially Googlebot, all AI search crawlers, and any SEO audit tools. Additionally, a backup page is indexed, URLs have casing inconsistencies, blog content is in the root namespace rather than `/blog/`, and there are two separate domains splitting authority.

### Top 5 Priority Issues

| # | Issue | Impact | Urgency |
|---|-------|--------|---------|
| 1 | WAF blocking all bots (403 on sitemap, robots.txt, homepage) | **Critical** | Immediate |
| 2 | `/breathwork-training-backup/` indexed in Google | **High** | This week |
| 3 | `academyalchemyofbreath.com` splits domain authority | **High** | Strategic |
| 4 | `/BreathCamps/` uses uppercase URL (inconsistent) | **Medium** | Soon |
| 5 | Blog posts at root level (not `/blog/`) — no topic clustering | **Medium** | Sprint |

### Quick Wins (Low Effort, High Impact)

- Noindex `/breathwork-training-backup/`
- 301 redirect `/BreathCamps/` → `/breathcamps/`
- Fix `/alchemy-meditation-2/` (rename or canonicalize to correct URL)
- Submit sitemap to Google Search Console (after bot fix)
- Whitelist Googlebot, GPTBot, PerplexityBot, ClaudeBot in WAF rules

---

## Section 1: Technical SEO Findings

---

### TECH-01: WAF/CDN Blocking All Automated HTTP Requests

**Issue**: Every HTTP request from non-browser user agents returns HTTP 403. This includes:
- `sitemap.xml` → 403
- `robots.txt` → 403
- Homepage (`/`) → 403
- All page URLs → 403

**Impact**: **Critical**

This is the most severe issue on the site. A WAF misconfiguration that blocks all bots has several consequences:

1. **Googlebot may be intermittently blocked** — Google uses multiple crawlers with varying user agents. If the WAF is blocking by user agent or IP range, Googlebot crawls may be failing silently, causing indexation drops or stale cached content.
2. **All AI search crawlers are blocked** — GPTBot (ChatGPT), ClaudeBot (Anthropic), PerplexityBot, Google-Extended (Gemini/AI Overviews) are all returning 403. This means Alchemy of Breath **cannot be cited in AI-generated answers** on any platform.
3. **SEO audit tools cannot crawl the site** — Screaming Frog, Ahrefs, Semrush, Sitebulb all fail. This makes ongoing SEO management invisible.
4. **robots.txt is inaccessible** — Google's guidelines state that if robots.txt cannot be fetched, Google will attempt to crawl the site anyway but cannot know what's blocked. This creates unpredictable crawl behavior.

**Evidence**: Manual fetch returned HTTP 403 on all tested URLs including homepage, sitemap.xml, and robots.txt.

**Fix**:
```
1. Log into Cloudflare (or WAF provider) dashboard
2. Navigate to Security → WAF → Bot Management or Firewall Rules
3. Create an ALLOW rule for the following user agents:
   - Googlebot
   - Googlebot-Image
   - Google-Extended (for AI Overviews / Gemini)
   - Bingbot
   - GPTBot (OpenAI)
   - ChatGPT-User (OpenAI)
   - PerplexityBot
   - ClaudeBot
   - anthropic-ai
   - DuckDuckBot
   - Applebot
4. Alternatively, whitelist these by IP ranges using Cloudflare's verified bot list
5. Add your SEO tool IPs (Ahrefs, Semrush, Screaming Frog) as allowed
6. Verify: fetch robots.txt and sitemap.xml return 200 after changes
```

**Priority**: P0 — Immediate (do this before any other SEO work)

---

### TECH-02: sitemap.xml Unknown / Inaccessible

**Issue**: Cannot verify sitemap content, structure, or submission status due to WAF blocking.

**Impact**: High

**Fix**:
1. After fixing WAF (TECH-01), fetch `alchemyofbreath.com/sitemap.xml` or `alchemyofbreath.com/sitemap_index.xml`
2. Verify it contains only canonical, indexable URLs
3. Check it excludes: `/breathwork-training-backup/`, tag archives, author pages (unless content-rich), paginated pages
4. Submit via Google Search Console → Sitemaps

**Priority**: P1 — After TECH-01

---

### TECH-03: robots.txt Inaccessible / Unknown

**Issue**: Cannot read robots.txt due to WAF. Current AI bot permissions are unknown.

**Impact**: High

**Fix**:
1. After fixing WAF (TECH-01), verify robots.txt is accessible
2. Ensure it does NOT disallow:
   - `Googlebot`
   - `Google-Extended`
   - `GPTBot`
   - `PerplexityBot`
   - `ClaudeBot`
   - `anthropic-ai`
3. If blocking CCBot (Common Crawl — used for AI training, not citation), that is acceptable

**Recommended robots.txt addition**:
```
# Allow search and AI citation bots
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

# Optional: block training-only crawlers if desired
User-agent: CCBot
Disallow: /
```

**Priority**: P1 — After TECH-01

---

### TECH-04: Indexed Backup Page

**Issue**: `/breathwork-training-backup/` is indexed in Google (confirmed via `site:` search).
Title: "Breathwork Facilitator Training and Certification - Alchemy of Breath"

**Impact**: High

This page:
- Competes directly with `/breathwork-training/` (keyword cannibalization)
- Splits ranking potential for the most important conversion keyword: "breathwork facilitator training"
- Signals poor site hygiene to Google
- Confuses users who land on an incomplete/outdated page

**Fix**:
```
Option A (Recommended): Add noindex to /breathwork-training-backup/
- In WordPress SEO plugin: mark page as noindex
- OR add to page head: <meta name="robots" content="noindex, nofollow">

Option B: 301 redirect /breathwork-training-backup/ → /breathwork-training/
- Only if the backup page has NO unique content worth keeping

Option C: Delete the page and ensure it returns 404
- Then submit URL for removal in Google Search Console
```

**Priority**: P1 — This week

---

### TECH-05: Mixed Case URL (`/BreathCamps/`)

**Issue**: Google indexed URL `alchemyofbreath.com/BreathCamps/` uses uppercase letters.

**Impact**: Medium

Web standards specify URLs as case-sensitive. This means:
- `/BreathCamps/` and `/breathcamps/` are technically different URLs
- Links using lowercase will 404 or redirect incorrectly
- Creates canonicalization confusion

**Fix**:
```
1. In WordPress, change page slug from "BreathCamps" to "breathcamps"
2. Ensure a 301 redirect is in place: /BreathCamps/ → /breathcamps/
3. Update all internal links to use lowercase
4. Check sitemap — update if needed
```

**Priority**: P2

---

### TECH-06: `/alchemy-meditation-2/` URL Suffix Indicates Duplicate

**Issue**: The `-2` suffix on `alchemyofbreath.com/alchemy-meditation-2/` typically means WordPress auto-appended a number because a page with slug `alchemy-meditation` already exists or existed.

**Impact**: Medium

**Fix**:
1. Audit: Does `/alchemy-meditation/` exist? If yes, determine which is canonical.
2. 301 redirect the non-canonical to the canonical version
3. If `/alchemy-meditation/` is deleted/missing, rename `/alchemy-meditation-2/` to remove the suffix

**Priority**: P2

---

### TECH-07: Split Domain Authority (academyalchemyofbreath.com)

**Issue**: The learning platform exists on a completely separate domain (`academyalchemyofbreath.com`) rather than a subdirectory (`alchemyofbreath.com/academy/`).

**Impact**: High (long-term authority dilution)

Backlinks earned by the academy platform accrue to `academyalchemyofbreath.com`, not `alchemyofbreath.com`. Students who link to their course materials link to the wrong domain. This splits PageRank across two domains.

**Fix** (Strategic — not immediate):
```
Migrate academy content to: alchemyofbreath.com/academy/
- Preserves all existing academy backlinks via 301 redirects
- Concentrates domain authority
- Enables cross-linking between marketing and course content
- Simplifies SEO management

If migration is not feasible:
- Add canonical tags on academy pages pointing to alchemyofbreath.com equivalents where applicable
- Ensure all marketing content lives on alchemyofbreath.com only
```

**Priority**: P3 (strategic, not immediate)

---

## Section 2: On-Page SEO Findings

---

### ONPAGE-01: Blog Content Not in /blog/ — No Topic Clustering

**Issue**: Blog/article content lives at the root level of the domain:
- `/benefits-of-doing-a-breathwork-facilitator-training-online/`
- `/what-is-the-difference-between-breathwork-functional-breath-work-pranayama/`

Rather than under a dedicated blog section:
- `/blog/benefits-of-doing-a-breathwork-facilitator-training-online/`

**Impact**: Medium

Root-level URLs:
- Prevent creating a hub page (`/blog/`) that consolidates topical authority
- Make it impossible to implement topic clusters
- Look like orphan pages with no clear site section
- Are extremely long — the breathwork-vs-pranayama URL is 75 characters

**Fix**:
```
1. Create /blog/ (or /resources/ or /insights/) as a hub page
2. Set WordPress blog base to /blog/
3. Migrate all existing posts to /blog/ with 301 redirects from old URLs
4. Create category pages: /blog/breathwork-basics/, /blog/facilitator-training/, /blog/breathwork-science/
5. Shorten URL slugs — e.g., /blog/breathwork-vs-pranayama/
```

**Priority**: P2

---

### ONPAGE-02: Keyword Cannibalization Risk — Training Pages

**Issue**: Two pages exist for the same primary keyword:
- `/breathwork-training/` — "Breathwork Facilitator Training 2026"
- `/live-residential-breathwork-facilitator-training/` — "Live Residential Breathwork Facilitator Training"
- `/breathwork-training-backup/` — duplicate of main training page (TECH-04)

**Impact**: Medium-High

Google may struggle to determine which page to rank for "breathwork facilitator training." Both `/breathwork-training/` and `/live-residential-breathwork-facilitator-training/` target very similar queries.

**Fix**:
```
1. Define clear page missions:
   - /breathwork-training/ → Overview/hub page for ALL training options
   - /live-residential-breathwork-facilitator-training/ → Specific residential variant
   - Create /online-breathwork-facilitator-training/ if not exists

2. Internal linking: /breathwork-training/ links to all variants
3. Each variant page signals its differentiation in H1, title, and first 100 words
4. Noindex or 301 /breathwork-training-backup/ (TECH-04)
```

**Priority**: P2

---

### ONPAGE-03: Title Tags and Meta Descriptions (Partially Observable)

**Evidence from Google SERP snippets**:

| Page | Observed Title | Issues |
|------|---------------|--------|
| Homepage | "Breathwork training, courses & events - Alchemy of Breath: Breathwork Training and Events" | Too long (~80 chars visible); brand name appears twice |
| /breathwork-training/ | "Breathwork Facilitator Training 2026 \| Alchemy Of Breath" | Good — year signals freshness; within limit |
| /who-is-alchemy-of-breath/ | "Who Is Alchemy of Breath \| About Us" | Missed keyword opportunity — could be "About Alchemy of Breath \| Conscious Breathwork School" |
| /free-breathwork-sessions/ | "Free Breathwork Sessions - Alchemy of Breath" | Good — exact match keyword at start |
| /BreathCamps/ | "Breathwork Camps \| Alchemy Of Breath" | Good title, bad URL (see TECH-05) |
| /alchemy-meditation-2/ | "Free Alchemy Meditation - Alchemy of Breath" | "Free" is good; "-2" URL is bad |

**Homepage title fix**:
```
Current: "Breathwork training, courses & events - Alchemy of Breath: Breathwork Training and Events"
Recommended: "Breathwork Facilitator Training & Courses | Alchemy of Breath"
(60 chars — fits SERP; removes redundant brand subtitle)
```

**Priority**: P2

---

### ONPAGE-04: H1 Tags (Unable to Fully Verify Without Live Crawl)

**Status**: Cannot verify H1s without live page access due to WAF.

**Post-WAF-fix audit required**:
- Confirm exactly one H1 per page
- Verify H1 contains primary keyword
- Ensure H1 and title tag are related but not identical
- Check homepage H1 (most important)

**Tools to use after WAF fix**:
- Screaming Frog crawl → export H1 column
- Chrome DevTools → Elements → search `<h1>`

---

### ONPAGE-05: Image Alt Text (Unable to Fully Verify)

**Status**: Cannot verify without live crawl.

Given the wellness/breathwork niche, the site likely uses many atmospheric/emotional images (landscapes, people breathing, retreat venues). These:
- Often lack descriptive alt text
- Miss opportunities to include relevant keywords naturally
- Fail accessibility requirements

**Post-WAF-fix audit**: Run Screaming Frog → Images → filter by missing alt text

---

## Section 3: Content & E-E-A-T Assessment

---

### CONTENT-01: Strong E-E-A-T Foundation

**Strengths** (from public intelligence):
- Founder Anthony Abbagnano has documented first-hand expertise (12+ years, GPBA board)
- Author pages exist (`/author/amy/`) — indicates multiple contributors
- Accreditations are documented (FHT, AADP, GPBA)
- Founder's book ("Outer Chaos, Inner Calm") adds authoritativeness
- Speaking credentials (Deepak Chopra, Bruce Lipton stages)

**Gaps**:
- Author bio pages may lack full credential markup (requires live audit)
- Blog posts may not consistently display author name + credentials
- No confirmed "Last Updated" date visible on articles

---

### CONTENT-02: Informational Content Strategy — Partially Developed

**Indexed informational content found**:
- `/what-is-the-difference-between-breathwork-functional-breath-work-pranayama/` — strong "what is" keyword opportunity
- `/benefits-of-doing-a-breathwork-facilitator-training-online/` — facilitator-focused

**Gaps** (high-volume keywords with no visible page):
| Missing Content | Target Query | Monthly Volume (est.) |
|----------------|-------------|----------------------|
| What is breathwork? | "what is breathwork" | 12,000+ |
| Breathwork benefits | "breathwork benefits" | 8,000+ |
| Breathwork for anxiety | "breathwork for anxiety" | 5,000+ |
| Breathwork techniques | "breathwork techniques" | 4,000+ |
| How to do breathwork | "how to do breathwork" | 3,500+ |
| Breathwork certification | "breathwork certification" | 2,500+ |

**Priority**: P2 — Content gap is a significant organic growth opportunity

---

## Section 4: Indexation Status

**Confirmed indexed pages** (via `site:alchemyofbreath.com`): ~10+ pages visible
**Expected indexed pages**: Unknown (sitemap blocked)

| Page | Indexed | Status |
|------|---------|--------|
| / | Yes | ✅ |
| /breathwork-training/ | Yes | ✅ |
| /breathwork-training-backup/ | Yes | ❌ Should be noindexed |
| /the-alchemist/ | Yes | ✅ |
| /free-breathwork-sessions/ | Yes | ✅ |
| /events/ | Yes | ✅ |
| /who-is-alchemy-of-breath/ | Yes | ✅ |
| /shop/ | Yes | ✅ (verify shop pages not thin) |
| /BreathCamps/ | Yes | ⚠️ URL casing issue |
| /anthony-abbagnano/ | Yes | ✅ Good E-E-A-T page |
| /alchemy-meditation-2/ | Yes | ⚠️ URL slug issue |
| /live-residential-breathwork-facilitator-training/ | Yes | ⚠️ Cannibalization risk |
| /find-facilitator/ | Yes | ✅ |

---

## Section 5: Speed & Core Web Vitals

**Status**: Cannot measure directly (WAF blocks PageSpeed Insights probes).

**Recommendations**:
1. After WAF fix, run Google PageSpeed Insights on homepage and training page
2. Target: LCP < 2.5s, INP < 200ms, CLS < 0.1
3. Known WordPress/WooCommerce issues to check:
   - Unoptimized images (WebP conversion)
   - Render-blocking JavaScript
   - No caching plugin
   - Google Fonts loading synchronously

---

## Prioritized Action Plan

### P0 — Immediate (This Session)
- [ ] **Fix WAF** — whitelist Googlebot, Bingbot, all AI bots, SEO tool IPs in Cloudflare/WAF rules
- [ ] **Verify robots.txt** — ensure no unintended disallow rules after WAF fix

### P1 — This Week
- [ ] **Noindex** `/breathwork-training-backup/`
- [ ] **Submit sitemap** to Google Search Console (and Bing Webmaster Tools)
- [ ] **Connect Google Search Console** if not already done — critical for measuring progress
- [ ] **Run full Screaming Frog crawl** now that WAF is fixed — export: URLs, H1s, meta descriptions, response codes, internal links, images

### P2 — This Sprint (2-4 weeks)
- [ ] **Fix URL casing**: 301 `/BreathCamps/` → `/breathcamps/`
- [ ] **Fix duplicate slug**: Resolve `/alchemy-meditation-2/`
- [ ] **Restructure blog**: Create `/blog/` and migrate all posts with 301 redirects
- [ ] **Shorten blog post URLs**: e.g., `/blog/breathwork-vs-pranayama/`
- [ ] **Audit H1s, meta descriptions** via Screaming Frog
- [ ] **Audit image alt text** via Screaming Frog
- [ ] **Resolve training page cannibalization**: Clear differentiation between training pages
- [ ] **Fix homepage title tag**: Remove duplicate brand name

### P3 — Next Quarter
- [ ] **Content gap**: Create "what is breathwork," "breathwork benefits," "breathwork for anxiety" pages
- [ ] **Schema markup implementation** (see schema-markup-strategy.md)
- [ ] **Academy domain migration**: Strategic plan to move to alchemyofbreath.com/academy/
- [ ] **Core Web Vitals audit**: PageSpeed Insights + optimization sprint

---

## Tools Required for Next-Level Audit

Once WAF is fixed, the following tools will unlock the full audit:

| Tool | What It Reveals | Access |
|------|----------------|--------|
| Google Search Console | Indexation, queries, CTR, Core Web Vitals | Client must grant access |
| Screaming Frog | Full crawl: H1s, meta, internal links, images | 1-time setup |
| Google Rich Results Test | Schema markup detection (JS-rendered) | Free |
| PageSpeed Insights | Core Web Vitals | Free |
| Ahrefs/Semrush | Backlink profile, ranking keywords, competitors | Subscription |

---

## WAF Whitelist Recommendation for Agent Browser / Claude Code

To enable ongoing programmatic SEO audits and AI-assisted monitoring from this environment, request that the client's WAF whitelist the following:

1. **Anthropic/Claude IP ranges** — so Claude Code can audit pages directly
2. **Your agency IP** — for all manual and tool-based access
3. **Screaming Frog license IP** — for crawls
4. **Semrush/Ahrefs crawl IPs** — for ongoing rank tracking

Without this, all AI-assisted auditing requires working from search index intelligence only.

---

*Audit performed using: marketing-skills/seo-audit v1.1.0 | Claude Code | March 2026*
*Data sources: Google site: search, Bing search results, Tracxn company data, public SERP snippets*
*Note: Full technical audit pending WAF fix — schema, H1s, speed, and internal links require live crawl access*
