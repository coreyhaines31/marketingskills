# AARRR Framework — Primer for Plan Sequencing

AARRR (Dave McClure's "pirate metrics") is the spine of every plan produced by this skill. This doc is the primer + the decision rules for when each stage gets prioritized.

## The five stages

| Stage | Question | Common metrics |
|---|---|---|
| **A**cquisition | How do strangers become aware of us? | Visits, MQLs, signup-page sessions, app-store visits, CAC by channel |
| **A**ctivation | Once they try us, do they have an experience that converts? | Signup completion rate, time-to-value, % completing first key action, trial → paid rate |
| **R**etention | Do they stay and deepen? | DAU/WAU/MAU, week-1/4/12 retention, churn |
| **R**eferral | Do retained users bring more users? | Viral coefficient, NPS, ambassador attribution |
| **R**evenue | What do they pay, who pays, how does it compound? | ARPU, LTV, expansion revenue, ARR / MRR |

> **Signup boundary rule.** Signup *intent* (a stranger landing on the signup page) is Acquisition. Signup *completion* and everything after (first key action, trial-to-paid) is Activation. Apply this rule consistently across all docs and the plan template.

## Why AARRR for plan sequencing

Three reasons.

**1. Funnel-stage tagging forces prioritization.** Without AARRR, marketing plans become channel-organized ("here's the SEO plan, here's the social plan, here's the paid plan"). Channels can address multiple stages; tagging by stage instead asks the more useful question: *what stage of the funnel is the binding constraint right now?*

**2. Fix the leak before pouring water in.** The Activation/Retention question ("does the funnel convert at acceptable rates given exposure?") is usually higher leverage than the Acquisition question ("how do we get more exposure?"). AARRR sequencing surfaces this naturally.

**3. The Revenue / Referral conversation is honest.** Most marketing plans bury monetization under "growth" and treat referral as wishful thinking. AARRR forces explicit treatment of both.

## Brand and content — not a stage, cross-cutting

A common mistake: making "Brand" or "Content" the sixth bucket. They're not — they serve every stage.

- **Brand voice** governs every piece of copy across every stage
- **Content** feeds Acquisition (SEO, social), Activation (onboarding copy), Retention (email lifecycle), Referral (ambassador talking points), Revenue (pricing pages, sales material)

In the plan, brand/content shows up as the strategic frame (Section 2) and cross-cutting in Section 11's ops stack — never as its own AARRR section.

## Diagnosing the binding constraint — which AARRR stage is highest leverage?

For every client, one or two AARRR stages will be the binding constraint. The plan sequences moves there first.

**Decision rules:**

### If you don't have any users → start with Acquisition
- Pre-launch / day-0 / waitlist stage
- No funnel data exists
- Leverage = building the first 100 users

### If you have users but they bounce → start with Activation
- Signups happen but activation rate is low
- App Store conversion is poor
- Onboarding completion is broken
- Day 1 → paid rate is much lower than Day 30 → paid (means product converts given time but onboarding doesn't bridge to it)
- Leverage = bridging signup to first felt value

### If activation works but users churn → start with Retention
- Month 1 retention is below category norms
- Activated users stop using within 7–14 days
- LTV is short
- Leverage = lifecycle, deepening engagement, churn prevention

### If retention is strong but growth is slow → start with Referral / Revenue
- Retained users love the product but don't share
- Inbound referrals come in unstructured
- Pricing hasn't been pressure-tested
- ARPU is low for the value delivered
- Leverage = WOM mechanics + pricing optimization (these often cluster)

### If everything works at small scale → start with Acquisition (scaling)
- Funnel is healthy
- Question is just "more"
- This is the "post-fit" scaling problem

## Stage-by-stage strategic patterns

### Acquisition

**The diagnostic question:** Where is the gap between TAM-level awareness and current funnel volume? What channels are saturated by competitors vs. open?

**Common Acquisition moves:**
- SEO content strategy (organic compounding)
- Founder-led channels (LinkedIn, X, Substack for B2B; Instagram/TikTok for D2C)
- Paid acquisition (when budget unlocks)
- App Store / Play Store / marketplace listing optimization
- PR and credibility-anchor amplification
- Events (live, webinar, conference speaking)
- Partnerships (newsletter swaps, integration co-marketing, reseller / agency partners)
- Hardware / commerce surface (Shopify SEO + Amazon for hybrid businesses)
- B2B sales support (case studies, partner pages, vertical content)

**Sequencing principle:** Build the organic compound first (SEO + founder-led + content + PR amplification + ambassadors). Only layer paid on top of a working organic baseline. Premature paid amplifies what's broken.

### Activation

**The diagnostic question:** Where in the user's first session do they decide "this works for me" or "this doesn't"? What stops them from reaching that moment?

**Common Activation moves:**
- Bedrock fixes (broken gates, broken signup steps, broken paywall)
- Onboarding tests / rebuild (often the most leveraged single move)
- App Store listing rewrite (the threshold to the trial)
- Lifecycle Flow ship order (when to ship onboarding emails)
- Paywall structure + trial length
- Free → paid bridge (in-app upsells, soft paywalls)

**Sequencing principle:** Get to first felt value as fast as possible. Everything that adds friction between "user opens app" and "user has the experience that converts them" is a candidate to cut.

### Retention

**The diagnostic question:** Why do users churn? What would have made them stay? What's the "second moment of value" after the first one?

**Common Retention moves:**
- Lifecycle email flows: onboarding, lapsed user re-engagement, post-purchase, win-back
- Subscription / preference centers
- Churn reconciliation (often metric definitions don't match across surfaces)
- Hardware → software activation paths (for hybrid businesses)
- Annual plan defaults / pricing structure (cross-cuts Revenue)
- Support as marketing (high-touch moments that drive stories)
- Community + practitioner networks

**Sequencing principle:** Ship lifecycle flows in the order their content is most stable. Hardware post-purchase flows ship first (they don't reference in-app screens that might change). Onboarding emails ship last (they reference UI that might change). Win-back is a quarterly campaign, not a one-time flow.

### Referral

**The diagnostic question:** Is there inbound referral interest that isn't being captured? What's the share-after-value moment that's natural to the product?

**Common Referral moves:**
- Ambassador / affiliate program (start with inbound interest, not cold recruitment)
- Share-after-value moments built into the product (reflection prompts, milestone celebrations)
- Founder amplification (founder as referrer-zero)
- Long-game expert / Guides / certified-host networks (for category-creating businesses)
- Gifting flows (consumer / hardware)
- Two-sided referrals (reward both referrer and referred)

**Sequencing principle:** Lead with whoever is already raising their hand. If there are 5 inbound ambassadors, launch with those 5 — don't wait for a "complete program." Iterate based on what they tell you.

### Revenue

**The diagnostic question:** Is the company underpricing? Underpackaging? Missing an upsell? What's the "right" price discipline given LTV and brand voice?

**Common Revenue moves:**
- Pricing audit (what's actually charged today vs. listed?)
- Annual plan defaults
- Hardware → software bundling formalization
- Storefront / commerce page optimization
- B2B case studies + sales material
- Long-term value pool flags (data, expansion, enterprise) — flagged not executed

**Sequencing principle:** Run the pricing audit before testing changes. Surprisingly often, the "implied" pricing on the dashboard doesn't match the listed price — discounts, trials, or plan mix distorts the read. Surface the ground truth first.

## How to assign a move to a stage

Some moves clearly belong to one stage. Others span. The rule:

**Assign to the stage where the move's primary measurable impact lands.**

Examples:
- "Rewrite App Store listing in voice" — spans Acquisition (organic discovery) and Activation (threshold to trial). Primary impact = Activation (trial conversion rate). Assign to Activation, mention crossover.
- "Eye mask Shopify page rewrite" — spans Acquisition (organic search for sleep mask) and Revenue (sale conversion). Primary impact = Revenue (transaction). Assign to Revenue, mention crossover.
- "Alex's LinkedIn cadence" — Acquisition (top of funnel for D2C subscribers).
- "Customer.io Flow 6 (eye mask post-purchase)" — Retention (deepens hardware buyer engagement) with crossover to Activation (hardware → app premium activation path).

When in doubt: where would removing this move hurt the most? Assign there.

## When the AARRR breakdown isn't equal

For most clients, the plan won't have equal volume across stages. That's fine — and worth surfacing as a diagnostic.

- **Heavy Acquisition section** = client has product-market fit but top-of-funnel is the bottleneck. Common for early-stage with strong retention metrics.
- **Heavy Activation section** = client has traffic but conversion is broken. Often beta-stage products.
- **Heavy Retention section** = client has churn problem. Often mid-stage products that scaled past PMF without lifecycle infrastructure.
- **Heavy Referral section** = client has loyalty but no WOM mechanics. Often consumer products with passionate users.
- **Heavy Revenue section** = client is underpricing or missing monetization layers. Common for tools transitioning from free to paid.

If a plan ends up evenly distributed across all five stages, the diagnostic was probably weak — re-examine the funnel state intake to find where the binding constraint is.

## A note on the order of presentation

Always present AARRR in order (Acquisition → Activation → Retention → Referral → Revenue) regardless of priority order.

This is for the reader's mental model. Founders expect the funnel to flow top-to-bottom. If Retention is the most-leveraged stage but you lead with Retention, the reader has to context-switch.

To signal priority, use the executive summary (Section 1) — name the biggest bets there. The AARRR breakdown then walks the funnel in order, with the most leverage-positive section being the longest and most-detailed.
