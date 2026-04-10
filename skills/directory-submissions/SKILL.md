---
name: directory-submissions
description: When the user wants to submit their product to startup, SaaS, AI, agent, MCP, no-code, or review directories for backlinks, domain rating, and discovery. Also use when the user mentions "directory submissions," "submit to directories," "backlinks from directories," "list my product," "submit to Product Hunt," "BetaList," "TAAFT," "Futurepedia," "G2 listing," "Capterra listing," "AlternativeTo," "SaaSHub," "AI directories," "MCP registry," "agent directory," "dofollow backlinks," "launch directories," or "directory tracker." Use this whenever someone is planning the directory layer of a product launch or an ongoing backlink campaign. For the broader launch moment, see launch-strategy. For programmatic SEO pages that should live behind these backlinks, see programmatic-seo. For AI citation optimization, see ai-seo.
metadata:
  version: 1.0.0
---

# Directory Submissions

You are an expert in directory-driven distribution for software products. Your goal is to help the user build a compounding backlink + discovery foundation by submitting to the right directories, in the right order, with the right positioning — and to make sure that foundation actually produces leads instead of vanity backlinks.

## Before Starting

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or `.claude/product-marketing-context.md` in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

---

## Core Philosophy

Directory submissions are the **foundation layer** of distribution — never the whole strategy. They do three things well:

1. **Pass dofollow backlinks** from high domain-rating sites into your marketing pages. This raises your DR, which makes your entire site easier to rank for competitive keywords.
2. **Create discovery surface area** — people browsing AI/SaaS directories are in-market buyers, not random traffic.
3. **Get cited by AI engines** — ChatGPT, Claude, Perplexity, and Google AI Overviews all pull heavily from high-DR directories when answering "what's the best [category]?" queries. AI-referred traffic converts **6–27× higher** than traditional search traffic.

But directories alone will not generate meaningful leads. They exist to pass link equity into the pages that DO generate leads — template galleries, comparison pages, alternative pages, blog posts. **Build the destination pages first, then submit to directories so the link equity has somewhere useful to land.**

The full directory catalog lives in `references/directory-list.md`. The positioning variant library lives in `references/positioning-variations.md`. The submission tracker template lives in `references/submission-tracker-template.csv`.

---

## The Three Hard Rules

### Rule 1: Foundation before submission
Never submit to a directory until the landing page it will link to is live, indexed, and has:
- A single `<h1>` and sequential heading hierarchy — pages with clean hierarchy have **2.8× higher AI citation rates**, and 87% of ChatGPT-cited pages use a single H1.
- A real pricing page (even "free while in beta" counts — most Tier 1 directories require one).
- Privacy policy + terms.
- Logo assets in PNG + SVG + square 1024×1024 + favicon.
- 5–8 real product screenshots at 1920×1080 (not marketing mockups).
- A 60–90 second demo video — products with video on Product Hunt get **2.7× more upvotes**.
- FAQ schema markup (AI engines heavily weight `FAQPage` JSON-LD for answer extraction).
- Structured data: `Organization`, `Product`, `SoftwareApplication`.

### Rule 2: Destination pages before directories
Directories are the *source* of link equity. You need *destinations* that can convert the resulting traffic. Minimum destinations before submitting to anything:
- 3–5 competitor alternative pages (`/alternatives/[competitor]`) targeting "[competitor] alternative" keywords. Comparison/alternative pages convert at **5–15%** vs 0.5–2% for generic content.
- 3–5 use-case pages (`/for/[audience]` or `/use-cases/[use-case]`).
- Template gallery with 20+ entries (if applicable — this was Typeform's largest SEO growth driver, generating 30K non-branded signups and $3M/year LTV).
- 1 "best of" blog post you wrote yourself about your own category, including honest coverage of competitors.

### Rule 3: Positioning varies by directory type
Never copy-paste the same description everywhere. AI engines penalize duplicate content, and each directory audience responds to different framing. See `references/positioning-variations.md` for the full variant library. Short version:

| Surface | Lead with | Why |
|---|---|---|
| Startup directories | **Outcome** | Audience is other founders. They care what it does. |
| SaaS directories | **Alternative framing** | People search "[competitor] alternative" — meet them there. |
| AI directories | **AI-first architecture** | TAAFT/Futurepedia audiences explicitly want AI tools. |
| Agent/MCP directories | **Agent/MCP angle** | Niche but high-intent. A real moat. |
| No-code directories | **Ease + power** | Audience values speed-to-build over depth. |
| Dev directories | **Technical depth** | Dev audiences reward technical substance. |
| B2B review sites | **ROI + use case** | Buyers want outcomes and case studies. |

---

## Workflow

### Step 1: Readiness assessment (Phase 0)

Ask the user these 9 questions. If any are "no", they're not ready — help them build the missing piece first.

1. Is the product publicly accessible (no password wall)?
2. Is there a pricing page (even "free while in beta")?
3. Are privacy policy + terms live?
4. Logo assets in PNG + SVG + square + favicon?
5. 5–8 real screenshots + 60–90s demo video?
6. Landing pages GEO-ready (single H1, sequential hierarchy, FAQ schema, structured data)?
7. At least 3 alternative pages and 3 use-case pages live and indexed?
8. Template gallery or lead magnet asset (if applicable to category)?
9. At least 20 beta/early users who could leave a review on G2?

A "no" on any of 1–7 is a hard block. A "no" on 8–9 is a soft block: you can launch but will lose Tier 2 review value and Typeform-style compounding.

### Step 2: Choose the tiers

Full catalog in `references/directory-list.md`. Summary:

| Tier | When | Examples | Typical count |
|---|---|---|---|
| **Tier 1 — Flagship launch** | Launch week only | Product Hunt (anchor), BetaList, HN Show HN, Fazier, DevHunt | ~15 |
| **Tier 2 — Startup/SaaS** | Week 1 + rolling | AlternativeTo, SaaSHub, G2, Capterra, F6S, SourceForge, Slashdot | ~15 |
| **Tier 3 — AI directories** | Week 1–3 | TAAFT, Futurepedia, Toolify, Future Tools, aitools.inc, AIStage | ~25 |
| **Tier 4 — Agent/MCP registries** | Week 1–3 (if MCP) | Glama, APITracker, LF MCP Registry, AI Agents List | ~10 |
| **Tier 5 — No-code directories** | Week 1–3 (if no-code) | NoCodeFinder, No Code MBA, We Are No Code | ~6 |
| **Tier 6 — "Best of" listicles** | Rolling outreach | Cold outreach to DR 40+ blog posts | ~10 inclusions |
| **Tier 7 — Integration marketplaces** | When integrations ship | Zapier, HubSpot, Slack, Airtable, Notion | ~5 |

**Triage rule:** Only submit where the product is a genuine fit. Forcing a listing into the wrong category burns the first-submission advantage and gets rejected by moderators.

### Step 3: Prepare asset variations

For each tier, prep a distinct description variant (pulled from `references/positioning-variations.md`):
- **Tagline** under 10 words
- **Short description** at 60 chars
- **Long description** at 150 words
- **5–8 category tags**
- **Logo** assets
- **Screenshots** + demo video URL
- **Founder story** (2–3 sentences)

**Critical:** Don't copy-paste the same long description into every directory. Vary the opening sentence, the feature emphasis, and the audience framing per tier. AI engines cross-reference and down-weight duplicate content.

### Step 4: Batch submit

Set up the tracker spreadsheet (`references/submission-tracker-template.csv`). Work left-to-right through it. 2–3 hours per batch is realistic.

Per submission:
1. Copy the tier-appropriate positioning variant.
2. Fill in the form.
3. Upload assets.
4. Submit.
5. Log: date, URL, status, moderator notes.
6. Once live, verify the backlink exists and is dofollow: `curl -sIL https://directory.com/your-listing | grep -i rel=`. If absent, the link is dofollow.

---

## Product Hunt Deep Dive (The Anchor Event)

Product Hunt is the single highest-leverage submission but also the most easily wasted. The 2026 PH algorithm weights **comment quality** more than upvote count — a post with 50 upvotes + 30 genuine comments ranks above one with 200 upvotes + 5 comments. **80% of failed launches** fail because they launched without a warm audience OR asked for upvotes instead of feedback.

### 3-week prep timeline

- **Day -21 to -14:** Warm up hunter account. Upvote + thoughtfully comment on 3 launches/day. Follow 100+ active makers. Build history so your account looks real to the algorithm.
- **Day -14:** Create "Upcoming" page on PH. Drive traffic to it to collect "notify on launch" subscribers.
- **Day -10:** (Optional) book a hunter. Don't pay cash — trade a feature, shoutout, or intro. A known hunter adds ~15% to day-one momentum but isn't required.
- **Day -7:** Draft launch-day assets: gallery images (1270×760), tagline, 260-char description, first comment from you, first comment from a customer.
- **Day -3:** Email list warm-up. "We're launching Tuesday. Here's what to expect. Reply if you want a heads up."
- **Day -1:** Final check — product works in incognito, video autoplays, CTA goes to signup, PH listing preview looks right.

### Launch day execution

- **Launch at 12:01 AM Pacific Time.** Tuesday, Wednesday, or Thursday only — weekend launches get 60–70% less traffic. The 12:01 AM PT start maximizes your 24-hour window.
- **First 2 hours are everything.** Need 50+ supporters in the first 2 hours to trigger algorithmic distribution.
- **Post the first comment yourself** with the story: why you built it, what's different, what to try first.
- **Reply to every comment** in under 30 minutes. PH measures maker responsiveness.
- **Share the link to:** Twitter/X thread, LinkedIn long-form post, personal Slack/Discord communities, your email list, Indie Hackers, every power user via DM.
- **Never ask for upvotes.** Ask for **feedback**. "Would love your honest take on the positioning" converts 3× better than "support us!" and doesn't trigger the algorithm's anti-manipulation filters.
- **Don't message strangers.** The community flags this and moderators will hide your post.

### Post-launch

- Write a launch recap blog post with numbers + lessons. Honest, not bragging. Publish on day 2.
- Cross-post the recap to Indie Hackers and r/SaaS (where promotion is allowed).
- Only submit to Show HN if you have a *technical* angle to share (architecture, DSL, novel approach). A generic "we launched a SaaS" post will get flagged to death.

---

## Reviews Playbook (G2 / Capterra / TrustRadius)

G2 and Capterra (now owned by G2 as of Feb 2026) listings are **worthless without reviews**. 10 reviews is the magic threshold for Grid appearance. Run the 10-in-30 protocol during launch month.

### The 10-in-30 protocol

1. **Day 1 post-launch:** Identify 20 users who have completed a meaningful action with the product.
2. **Send each a personal email** with a direct review URL (reduces friction by ~70%). No forms, no landing pages — direct link.
3. **Offer a modest thank-you.** G2 and TrustRadius explicitly allow small incentives like a $25 Amazon gift card.
4. **Follow up once** after 5 days. Don't follow up twice — it becomes annoying and damages the relationship.
5. **Target:** 50% conversion → 10 reviews from 20 asks.

### Critical deadlines

- **G2 Summer reports:** cut off ~April 28. Plan review drives to land before this.
- **G2 Fall reports:** cut off ~July 28.
- Missing a cutoff means waiting 3 months for the next grid update.

### Badges and paid plans

- **"Users Love Us" badge** is still free: requires 20 reviews at 4.0+ average.
- **Grid, Momentum, Index, and Award badges** require a paid G2 plan ($2,999+/year starting Summer 2025).
- **Do not spend on paid G2 in year one.** The free listing + Users Love Us badge is sufficient.

### Cross-platform

- TrustRadius follows similar mechanics but smaller volume.
- Capterra auto-syncs from Gartner Digital Markets in some categories — may populate without direct action.

---

## Destination Pages Strategy (What the Backlinks Point At)

Directories are useless if the backlinks land on a generic homepage. Build these destination pages *before* submitting:

### 1. Alternative pages (highest ROI)

Competitor alternative pages convert at **5–15%**, often hitting 15–30% for bottom-of-funnel queries. One page per top competitor:

- `/alternatives/[competitor-1]`
- `/alternatives/[competitor-2]`
- `/alternatives/[competitor-3]`
- `/alternatives/[competitor-4]`

Each page needs: honest feature comparison table, "when to choose X over us," "when to choose us over X," pricing comparison, 3–5 use-case examples, strong FAQ with schema.

**Critical:** Be honest. AI engines cross-reference competitor feature claims and de-rank pages that lie.

### 2. Use-case / ICP pages

Every ICP gets a dedicated landing page:
- `/for/[audience]` — coaches, agencies, ecommerce, SaaS, consultants, etc.
- `/use-cases/[use-case]` — lead qualification, onboarding, product recommendations, etc.

### 3. Template / asset gallery (if applicable)

Typeform's template library generated **30,000 non-branded organic signups and $3M/year LTV**. The pattern:
- One indexable page per template at `/templates/[slug]`.
- H1 with the keyword, 150+ word description, screenshot, "when to use this," "use this template" CTA.
- Related templates at the bottom of each page (internal linking = SEO compounding).
- 100 templates by day 30, 300 by day 90 is the realistic target.

### 4. "Best of" listicles you wrote yourself

Write honest roundups of your own category: `/blog/best-[category]-tools-2026`. Include yourself + 10 competitors with real reviews. These rank for category queries AND serve as canonical references AI engines cite.

### 5. Integration pages (when integrations ship)

Every integration = one landing page at `/integrations/[partner]`. Follows the Zapier playbook: Zapier gets **~2.6M monthly organic visits** from programmatic integration pages (~15% of their total organic traffic).

---

## GEO (Generative Engine Optimization)

In 2026, 30–50% of "research a tool" queries happen inside ChatGPT, Claude, Perplexity, or Google AI Overviews without ever touching a traditional search page. Directories matter here too — AI engines pull heavily from high-DR directories when generating answers. But the *destination pages* also need to be GEO-optimized.

### Tactics that get pages cited

1. **One H1 per page, sequential heading hierarchy.** 2.8× higher citation rate. 87% of cited pages use a single H1.
2. **Dense, factual content with citable stats.** AI engines prefer specific numbers ("3× faster than X") over vague claims.
3. **FAQ schema on every landing page.** AI engines heavily weight `FAQPage` JSON-LD for answer extraction.
4. **Comparison tables.** Extractable, structured — exactly what an AI answer needs.
5. **Explicit "what it is" paragraph in the first 100 words.**
6. **Get cited on Reddit and Hacker News.** Claude and Perplexity index these heavily. Genuine mentions on r/SaaS and HN count as training fuel.
7. **Publish original research.** "We analyzed 10,000 [things] and found X" becomes the primary citation for anyone writing about that topic.
8. **Claim Crunchbase, LinkedIn company page, and Wikidata entries.** All three feed AI training corpora.
9. **If applicable, list on MCP registries with A/B grades** (Glama in particular). LLMs pull from these when answering MCP questions.

### Measurement

Manually check monthly: ask ChatGPT, Claude, and Perplexity "what are the best [category] tools?" and log where the product appears. Free GEO tracking tools (GeoTracker, llmrefs) automate this.

---

## Community & Ongoing Distribution

Directories are one-shot. Community is ongoing. Both feed the same funnel.

### Reddit (90/10 rule)

90% of activity must be genuinely helpful; only 10% promotional. Violating this gets shadowbanned.

**High-value subs (ranked):**
- **r/SideProject** (200K+) — friendly to promo, launch announcements welcome.
- **r/SaaS** (300K+) — "Share Your SaaS" threads are explicit promo windows.
- **r/startups** (1.7M) — Feedback Friday thread.
- **r/Entrepreneur** (3.5M) — weekly promo thread.
- **r/nocode**, **r/IndieHackers**, **r/alphaandbetausers** — friendly.
- **r/webdev**, **r/artificial**, **r/LocalLLaMA** — strict, technical only.

**What wins:** real numbers (MRR, signups, churn), screenshots, "what I tried / what happened / what I'd do differently" structure, mini case studies with a clear lesson. **What fails:** hype, vague claims, "check out my new tool" posts, asking for upvotes.

### LinkedIn (B2B primary channel)

80% of B2B social leads come from LinkedIn. Cadence: **3–5 posts/week** — fewer loses momentum, more causes fatigue.

Content types ranked by 2026 engagement:
1. Personal stories with business lessons (1.5–2× avg engagement)
2. Original data / research (1.3–1.5×)
3. Contrarian industry takes (1.2–1.5×)
4. Document carousels with 8–12 slides (1.3–1.8×)

### Twitter/X (indie hacker + dev channel)

Build-in-public threads on architecture, revenue, decisions. Technical deep-dives get indexed by Google + Claude + Perplexity → indirect GEO.

### Indie Hackers

- Launch a build-in-public thread on PH launch day.
- Post weekly updates: revenue, ships, lessons. Zero-revenue posts work if the lesson is honest.
- Comment 10× more than you post to build karma before your own links.

### Dev.to + Hashnode

Every substantial technical post = dofollow backlink + dev audience reach. Cross-post with canonical URL back to main blog.

---

## KPIs & Tracking

Track weekly. If a number isn't moving, investigate — don't just submit more directories.

| Metric | Day 0 | Day 30 target | Day 90 target |
|---|---|---|---|
| Domain Rating (DR) | 0 | 20 | 30+ |
| Referring domains | 0 | 30 | 80+ |
| Indexed pages | — | 50 | 200+ |
| Organic clicks/day | 0 | 30 | 200+ |
| Directory listings live | 0 | 50 | 70+ |
| G2 reviews | 0 | 10 | 25 |
| Capterra reviews | 0 | 5 | 15 |
| AI citations (manual check) | 0 | 3 | 15+ |
| Signups from directory referrals | 0 | 50 | 300 |
| Signups from alt/use-case pages | 0 | 20 | 300 |

---

## What NOT to Do

1. **Don't pay for directory submission services** ($60–$200 packages). The whole point is these are free. It's an afternoon of copy-paste.
2. **Don't submit to spam directories** (DR under 10, no traffic, no editorial quality). They dilute your backlink profile and Google's spam detection can penalize you.
3. **Don't submit with the wrong positioning.** Re-read the positioning table per tier. Generic descriptions waste the listing.
4. **Don't treat directories as your entire GTM.** They're the foundation. Content + community + reviews are what actually convert.
5. **Don't skip reviews on G2/Capterra.** Zero-review listings are dead. Run the 10-in-30 protocol or don't submit.
6. **Don't ask for upvotes on Product Hunt.** The 2026 algorithm penalizes it. Ask for **feedback**.
7. **Don't amend old directory listings every week.** Submit once, check quarterly.
8. **Don't submit before the destination page exists.** Link equity needs a destination.
9. **Don't duplicate descriptions across directories.** AI engines penalize duplicate content.
10. **Don't lie on comparison pages.** AI engines cross-reference and de-rank lies.
11. **Don't over-index on launch-day spike.** The flywheel is templates + alternatives + reviews + ongoing content — not one day of PH.
12. **Don't forget Crunchbase, LinkedIn company page, and Wikidata.** These feed AI training corpora and matter for GEO.

---

## Task-Specific Questions

1. **What are you launching?** (Category changes tier mix — AI vs traditional SaaS vs no-code vs dev tool.)
2. **When is launch day?** (Phase 0 assets need 7 days of prep.)
3. **Do you have destination pages built?** (Alternatives, use cases, templates — if not, build first.)
4. **Product Hunt hunter lined up?** (Optional but adds ~15% day-one lift. 3-week warm-up required regardless.)
5. **How many beta users can you ask for reviews?** (Need 20 to hit 10.)
6. **Do you have an MCP or agent angle?** (If yes, Tier 4 registries are a real moat.)
7. **Existing integrations?** (If yes, Tier 7 marketplaces are the highest-DR backlinks available.)
8. **Email list size?** (Needed for PH launch day warm traffic — 100+ is the minimum.)
9. **Current DR and referring domain count?** (Baseline for measuring the compounding effect.)

---

## Output Format

When the user asks for a directory plan, return:

1. **Readiness assessment** — which Phase 0 items are missing, which block submission
2. **Tier selection** — which tiers apply, which to skip, why
3. **Submission order** — week 1 / week 2 / week 3 batches
4. **Destination page list** — what to build first if missing
5. **Positioning variants** — the actual copy per tier (from `references/positioning-variations.md`)
6. **PH 3-week prep timeline** — mapped to calendar dates if launch day known
7. **Reviews 10-in-30 plan** — who to ask, when, how
8. **Weekly targets** — directories submitted, reviews, DR movement
9. **Tracker** — link to or include the CSV from `references/submission-tracker-template.csv`

Keep the plan actionable. Every item should be something the user can do today.

---

## Related Skills

- **launch-strategy** — broader launch moment, ORB framework, five-phase approach
- **programmatic-seo** — destination pages (alternatives, integrations, templates) that backlinks should flow into
- **competitor-alternatives** — `/alternatives/[tool]` page pattern
- **ai-seo** — GEO optimization for AI citation
- **content-strategy** — editorial content that attracts "best of" listicle inclusions
- **free-tool-strategy** — lead magnets for destination pages
- **community-marketing** — Reddit, Indie Hackers, Slack community mechanics
- **schema-markup** — FAQ + Product + Organization JSON-LD for GEO
