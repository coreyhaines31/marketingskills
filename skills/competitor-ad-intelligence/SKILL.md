---
name: competitor-ad-intelligence
description: "When the user wants to see, analyze, or reverse-engineer the ads a competitor is running. Also use when the user mentions 'competitor ads,' 'Meta Ad Library,' 'Google Ads Transparency,' 'ad teardown,' 'ad intelligence,' 'what ads are they running,' 'competitor ad strategy,' 'paid funnel teardown,' 'ad angles,' or 'competitive ad analysis.' Input is one or more competitor names or domains. Output is a strategic teardown report covering creative patterns, funnel maps, budget estimates, creative gaps, vulnerabilities, and counter-plays. Uses only free public sources (Meta Ad Library, Google Ads Transparency Center) — no API keys required. For positioning-level competitor research, see competitor-profiling. For turning insights into new creative, see ad-creative."
license: MIT
metadata:
  version: 1.0.0
  author: GooseWorks
  source: https://github.com/gooseworks-ai/goose-skills
---

# Competitor Ad Intelligence

Scrape competitor ads from Meta and Google, analyze creative patterns, reverse-engineer landing page funnels, and produce a full strategic teardown — hooks, formats, positioning bets, vulnerabilities, and counter-plays.

**Core principle:** A competitor's ad portfolio is a window into their growth strategy. Long-running ads reveal what converts. New ads reveal what they're testing. Landing pages reveal their positioning bets. The best ad creative teams start with evidence from what's already working, then differentiate.

## When to Use

- "What ads are my competitors running?"
- "Tear down [competitor]'s ad strategy"
- "Find new creative angles for our paid campaigns"
- "Reverse-engineer [competitor]'s paid funnel"
- "What hooks are working in [our space]?"
- "Audit the ad landscape before we launch"
- "Find weaknesses in [competitor]'s ad strategy"
- "What format — video, image, carousel — is dominant in our category?"

## Phase 0: Intake

**Check for product marketing context first:** If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`), read it before asking questions and only ask for what it doesn't cover.

Gather from the user:

1. **Competitor names + domains** (e.g., `apollo.io`, `clay.run`)
2. **Your product/domain** — for comparison framing
3. **Channels:** Meta only, Google only, or both? (default: both)
4. **Depth level:**
   - **Standard:** Ad scrape + creative analysis + landing page analysis
   - **Deep:** Standard + historical comparison + funnel reconstruction + counter-plays
5. **Product category** — helps frame analysis
6. **Known competitor landing pages?** — any URLs already spotted in their ads

## Phase 1: Scrape Meta Ads

For each competitor domain, scrape ads from Meta Ad Library.

Use `web_search` to find competitor ads in the Meta Ad Library (publicly accessible, no API key needed):

```
web_search: site:facebook.com/ads/library "[competitor_name]"
web_search: "[competitor_name]" Meta Ad Library active ads
web_search: "[competitor_name]" facebook ads examples
```

You can also visit the Meta Ad Library directly: `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=<competitor_name>`

Use `fetch_webpage` on the Ad Library URL to extract ad details if your agent supports it.

> **Note:** Apify actors for Meta Ad Library scraping exist but are unreliable as of April 2026 due to Meta's anti-scraping measures. Use `web_search` as the primary method.

**Collect per ad:**
- Ad copy (headline + primary text)
- Visual type (image / video / carousel)
- CTA button text
- Landing page URL
- Active duration (first seen, still running or stopped)
- Platforms (Facebook, Instagram, Audience Network)
- Ad variations (A/B tests — same landing page, different creative)

## Phase 2: Scrape Google Ads

For each competitor domain, scrape ads from Google Ads Transparency Center.

Use `web_search` to find competitor ads in Google Ads Transparency Center (publicly accessible):

```
web_search: site:adstransparency.google.com "[competitor_name]"
web_search: "[competitor_name]" Google Ads transparency
web_search: "[competitor_name]" google search ads examples
```

You can also visit directly: `https://adstransparency.google.com/?search_text=<competitor_name>`

Use `fetch_webpage` on the Transparency Center URL to extract ad details if your agent supports it.

**Collect per ad:**
- Headline variants (up to 3)
- Description lines
- Ad type (Search / Display / YouTube / Shopping)
- Landing page URL
- Geographic targeting (if visible)

## Phase 3: Analyze Creative Patterns

After collecting all ads, perform structured analysis.

### Hook Pattern Clustering

Group all ad headlines/openers by hook type:

| Hook Type | Pattern | Example |
|-----------|---------|---------|
| **Fear/Loss** | Risk of missing out or falling behind | "Your competitors are already using AI SDRs" |
| **Outcome** | Direct result promise | "10x your pipeline in 30 days" |
| **Question** | Challenges current assumption | "Still doing outbound manually?" |
| **Social proof** | Names customers or numbers | "Join 500+ B2B teams using [product]" |
| **Contrarian** | Challenges conventional wisdom | "Cold email isn't dead. Your copy is." |
| **Empathy** | Validates their pain | "We know SDR ramp time is brutal" |
| **Product-led** | Feature as hook | "[Feature] is live — see what's new" |

Count how many ads per competitor use each hook type. This reveals their primary messaging strategy.

### Format Distribution

| Format | Meta | Google |
|--------|------|--------|
| Static image | [N] | N/A |
| Video | [N] | [N] |
| Carousel | [N] | N/A |
| Search text | N/A | [N] |
| Display banner | N/A | [N] |

### CTA Taxonomy

List all unique CTAs found. Common patterns:
- **Urgency:** "Start free", "Try now", "Get started today"
- **Low-friction:** "See how it works", "Watch demo", "Learn more"
- **Outcome:** "Book a demo", "Get your free audit", "Calculate your ROI"

## Phase 4: Landing Page & Funnel Analysis

For each unique landing page URL found in ads, fetch and analyze:

```
fetch_webpage: [landing_page_url]
```

Or use `curl` if `fetch_webpage` is unavailable.

**Extract per landing page:**
- **Hero headline** — Does it match the ad promise?
- **Subheadline** — Value prop expansion
- **Primary CTA** — What action are they driving? (Demo / Free trial / Sign up / Download)
- **Social proof** — Logos, testimonials, case study metrics
- **Pricing visibility** — Is pricing shown or hidden?
- **Form fields** — How much info do they ask for?
- **Page type** — General homepage / dedicated LP / feature page / use-case page
- **Message match score** — How well does the LP deliver on the ad's promise? (1-10)

### Campaign Clustering

Group all ads into logical campaigns by:
- **Landing page destination** — Ads pointing to the same URL = same campaign
- **Messaging theme** — Similar copy angles = same strategic bet
- **Audience signal** — Different copy for different personas

### Per-Campaign Funnel Analysis

For each campaign cluster:

| Dimension | Analysis |
|-----------|----------|
| **Strategic intent** | What is this campaign trying to achieve? (Awareness / Lead gen / Free trial / Competitive displacement) |
| **Target persona** | Who is this ad speaking to? (Role, pain, stage) |
| **Positioning bet** | What market position are they claiming? |
| **Hook strategy** | Fear / Outcome / Social proof / Contrarian / Product-led |
| **Conversion path** | Ad → LP → CTA → [Demo call / Free trial / Content download] |
| **Longevity signal** | How long has this been running? (Longer = likely working) |
| **A/B tests detected** | Multiple creatives to same LP = active testing |

### Budget Allocation Inference

Based on ad volume and platform distribution, estimate where they're concentrating spend:

| Platform | Ad Count | % of Total | Estimated Focus |
|----------|----------|-----------|-----------------|
| Meta (Facebook) | [N] | [X%] | [Awareness / Retargeting] |
| Meta (Instagram) | [N] | [X%] | [Visual / younger audience] |
| Google Search | [N] | [X%] | [Bottom-funnel capture] |
| Google Display | [N] | [X%] | [Awareness / retargeting] |
| YouTube | [N] | [X%] | [Education / awareness] |

## Phase 5: Strategic Analysis

### Creative Gap Analysis

Identify across all competitors:

1. **Angles nobody is running** — Hook types absent from competitor ads = white space
2. **Overcrowded angles** — If everyone leads with "save time", avoid it or be more specific
3. **Format opportunities** — If no one is running video in your space, it may stand out
4. **Underutilized proof** — Are competitors avoiding specific proof points you could own?
5. **CTA patterns to test** — What CTAs do the longest-running ads use?

### Vulnerability Analysis

Identify weaknesses in each competitor's ad strategy:

| Vulnerability Type | Description |
|-------------------|-------------|
| **Message-LP mismatch** | Ad promises one thing, LP delivers another |
| **Single-persona dependency** | All ads target the same persona — missing segments |
| **Platform concentration** | Heavy on one platform, absent from others |
| **No social proof** | Ads or LPs lack credibility markers |
| **Weak CTA** | Asking for too much too soon (demo before value) |
| **Generic positioning** | Claims anyone could make — not differentiated |
| **Stale creative** | Same ads running unchanged for months — fatigue risk |

### Historical Comparison (Deep Mode)

If Web Archive data exists for their landing pages:
- Has their positioning changed in the last 6-12 months?
- What campaigns did they retire? (Possible losers)
- What campaigns have they scaled up? (Possible winners)

## Phase 6: Output

```markdown
# Competitor Ad Intelligence Report — [DATE]

## Coverage
- Competitors analyzed: [list]
- Meta ads collected: [N]
- Google ads collected: [N]
- Unique landing pages analyzed: [N]
- Estimated active campaigns: [N]

---

## Executive Summary

[3-5 sentence summary: What is the competitive ad landscape? What's working? Where are the gaps and vulnerabilities?]

---

## Meta Ad Analysis

### Hook Distribution
| Hook Type | [Comp1] | [Comp2] | [Comp3] |
|-----------|---------|---------|---------|
| Fear/Loss | 40% | 10% | 0% |
| Outcome | 30% | 50% | 60% |
...

### Top Performing Ads (Longest Running)
**[Competitor] — [Ad Title/Hook]**
> [Ad copy excerpt]
- Format: [type]
- CTA: [text]
- Running since: [date]
- Why it likely works: [analysis]

---

## Google Ad Analysis

### Headline Patterns
[Top headline structures with examples]

### Most Common CTAs
[ranked list]

---

## Campaign Breakdown

### Campaign 1: [Inferred Campaign Name]
- **Competitor:** [name]
- **Ads in cluster:** [N]
- **Platform(s):** [Meta / Google / Both]
- **Strategic intent:** [Awareness / Lead gen / Competitive displacement / etc.]
- **Target persona:** [Description]
- **Hook strategy:** [Type]
- **Landing page:** [URL]
  - Hero: "[Headline text]"
  - CTA: "[Button text]"
  - Message match: [Score/10]
- **Longevity:** [First seen date → status]
- **A/B tests detected:** [Yes/No — what they're testing]

**Sample ad:**
> **Headline:** [text]
> **Body:** [text]
> **CTA:** [button]
> **Format:** [Image/Video/Carousel]

**Assessment:** [1-2 sentences — is this working? Why/why not?]

### Campaign 2: ...

---

## Funnel Map

```
[Ad: Hook/Angle] → [LP: /landing-page-url] → [CTA: Book Demo]
                                               ↓
[Ad: Different angle] → [LP: /same-or-different] → [CTA: Free Trial]
```

---

## Budget Allocation Estimate

| Platform | Share | Focus Area |
|----------|-------|-----------|
| [Platform] | [X%] | [Intent] |

---

## Creative Gap Analysis

### Angles Nobody Is Running
1. [Angle] — Why it could work for you: [reasoning]
2. [Angle] — ...

### Overcrowded Angles (Avoid or Differentiate)
- [Angle] — [N] of [N] competitors use this

### Format White Space
- [Format] is not being used by competitors on [platform]

---

## Vulnerability Report

### 1. [Vulnerability]
**Competitor:** [name]
**Evidence:** [What we observed]
**Your opportunity:** [How to exploit this gap]

### 2. ...

---

## Recommended Counter-Plays

### Counter-Play 1: [Name]
- **Target their weakness:** [Which vulnerability]
- **Your ad angle:** [Hook]
- **Platform:** [Where to run]
- **Proposed headline:** "[headline]"
- **Proposed body:** "[copy]"
- **LP strategy:** [What your landing page should emphasize]
- **Why test this:** [rationale]

### Counter-Play 2: ...
```

## Cost

| Component | Cost |
|-----------|------|
| Ad library research (web_search) | Free |
| Landing page fetching | Free |
| Web Archive lookup (deep mode) | Free |
| Analysis | Free (LLM reasoning) |
| **Total** | **Free** |

## Environment Variables

- No API keys required. This skill uses publicly accessible ad libraries and web search.

## Tools Used

- **`web_search`** — query Meta Ad Library and Google Ads Transparency Center
- **`fetch_webpage`** or **`curl`** — fetch and analyze landing pages

## Trigger Phrases

- "What ads are [competitor] running?"
- "Tear down [competitor]'s ad strategy"
- "Audit the ad landscape for [product category]"
- "Run ad intelligence for [competitors]"
- "Find new paid ad angles we haven't tried"
- "Reverse-engineer [competitor]'s paid funnel"
- "Find weaknesses in [competitor]'s ad strategy"
- "Deep competitive ad analysis on [competitor]"

## Related Skills

- **competitor-profiling**: For positioning-level competitor research from their websites (this skill covers the paid-ads layer specifically)
- **ad-creative**: For turning the creative gaps and counter-plays found here into new ad creative
- **ads**: For planning the campaigns that act on this intelligence
- **sales-enablement**: For feeding competitor weaknesses into battle cards
