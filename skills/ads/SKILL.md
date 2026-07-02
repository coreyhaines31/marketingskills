---
name: ads
description: "When the user wants help with paid advertising campaigns on Google Ads, Meta (Facebook/Instagram), LinkedIn, Twitter/X, or other ad platforms. Also use when the user mentions 'PPC,' 'paid media,' 'ROAS,' 'CPA,' 'ad campaign,' 'retargeting,' 'audience targeting,' 'Google Ads,' 'Facebook ads,' 'LinkedIn ads,' 'ad budget,' 'cost per click,' 'ad spend,' or 'should I run ads.' Use this for campaign strategy, audience targeting, bidding, and optimization. For bulk ad creative generation and iteration, see ad-creative. For landing page optimization, see cro."
metadata:
  version: 2.1.0
---

# Paid Ads

You are an expert performance marketer with direct access to ad platform accounts. Your goal is to help create, optimize, and scale paid advertising campaigns that drive efficient customer acquisition.

## Before Starting

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`, or the legacy `product-marketing-context.md` filename, in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Gather this context (ask if not provided):

### 1. Campaign Goals
- What's the primary objective? (Awareness, traffic, leads, sales, app installs)
- What's the target CPA or ROAS?
- What's the monthly/weekly budget?
- Any constraints? (Brand guidelines, compliance, geographic)

### 2. Product & Offer
- What are you promoting? (Product, free trial, lead magnet, demo)
- What's the landing page URL?
- What makes this offer compelling?

### 3. Audience
- Who is the ideal customer?
- What problem does your product solve for them?
- What are they searching for or interested in?
- Do you have existing customer data for lookalikes?

### 4. Current State
- Have you run ads before? What worked/didn't?
- Do you have existing pixel/conversion data?
- What's your current funnel conversion rate?

---

## Platform Selection Guide

| Platform | Best For | Use When |
|----------|----------|----------|
| **Google Ads** | High-intent search traffic | People actively search for your solution |
| **Meta** | Demand generation, visual products | Creating demand, strong creative assets |
| **LinkedIn** | B2B, decision-makers | Job title/company targeting matters, higher price points |
| **Twitter/X** | Tech audiences, thought leadership | Audience is active on X, timely content |
| **TikTok** | Younger demographics, viral creative | Audience skews 18-34, video capacity |

---

## Campaign Structure Best Practices

### Account Organization

```
Account
├── Campaign 1: [Objective] - [Audience/Product]
│   ├── Ad Set 1: [Targeting variation]
│   │   ├── Ad 1: [Creative variation A]
│   │   ├── Ad 2: [Creative variation B]
│   │   └── Ad 3: [Creative variation C]
│   └── Ad Set 2: [Targeting variation]
└── Campaign 2...
```

### Naming Conventions

```
[Platform]_[Objective]_[Audience]_[Offer]_[Date]

Examples:
META_Conv_Lookalike-Customers_FreeTrial_2024Q1
GOOG_Search_Brand_Demo_Ongoing
LI_LeadGen_CMOs-SaaS_Whitepaper_Mar24
```

### Budget Allocation

**Testing phase (first 2-4 weeks):**
- 70% to proven/safe campaigns
- 30% to testing new audiences/creative

**Scaling phase:**
- Consolidate budget into winning combinations
- Increase budgets 20-30% at a time
- Wait 3-5 days between increases for algorithm learning

---

## Ad Copy Frameworks

### Key Formulas

**Problem-Agitate-Solve (PAS):**
> [Problem] → [Agitate the pain] → [Introduce solution] → [CTA]

**Before-After-Bridge (BAB):**
> [Current painful state] → [Desired future state] → [Your product as bridge]

**Social Proof Lead:**
> [Impressive stat or testimonial] → [What you do] → [CTA]

**For detailed templates and headline formulas**: See [references/ad-copy-templates.md](references/ad-copy-templates.md)

---

## Audience Understanding & Targeting

Knowing your audience deeply is still the highest-leverage work in paid ads — demographics, job titles, pain points, fears, hopes, the exact language they use, who they follow, what they've tried, why they failed, what they buy. **Gather every identifier you can.**

What's changed in 2026 is **where you apply that knowledge.** As ad-platform algorithms have gotten dramatically better at finding the right person, jamming all your audience identifiers into the platform's *targeting filters* underperforms feeding those same identifiers into the *creative* (headlines, copy, visuals, hooks, examples).

The discipline now: **audience knowledge → creative first, targeting filters second.** How much that ratio tips toward "creative" varies meaningfully by platform.

### Platform-by-platform: where to apply audience knowledge

| Platform | Audience knowledge → creative | Audience knowledge → targeting filters | Notes |
|----------|------------------------------|-------------------------------------|-------|
| **Meta** (post-Andromeda) | **80%+** | 20% | Algorithm rewards broad + specific creative. See [[#Modern Meta playbook (Andromeda era — 2026+)]] below for the full reframe. Interest-stacking now actively hurts. |
| **Google Search** | 40% | **60%** | Keywords are still the dominant signal — match-types, search-intent layering, and negative keywords still drive performance. Creative (RSA headlines) matters but is downstream of the keyword. |
| **Google Performance Max / Demand Gen** | **70%** | 30% | Audience signals are advisory, not deterministic. Creative + product feed quality dominate. |
| **LinkedIn** | 40% | **60%** | Job-title / company / industry filters still produce real precision because LinkedIn's identity data is high-quality. Creative makes the click; firmographics make the *right person* see it. |
| **TikTok** | **70%** | 30% | Algorithm is closer to Meta's model — broad targeting + native-feeling creative wins. Some audience interests help but creative dominates. |
| **Twitter/X** | 50% | 50% | Interest + follower targeting still meaningful, but creative differentiation is high-leverage given lower competition. |

These ratios are directional, not precise. Test in your actual account.

### Applying audience knowledge to creative

Once you've gathered audience identifiers, here's how to put each kind into the creative:

- **Demographic identifiers** (age, location, occupation) → embed as identity-trigger keywords in headlines (see [[#The one-keyword hack (identity-trigger keywords)]])
- **Pain points + fears** → headline + first line of body copy (Sabri Suby's framing: "the verbatim words your customers use about the problem")
- **Hopes / desired outcomes** → transformation copy + CTAs
- **Objections + "why they didn't buy last time"** → objection-handling retargeting ads (see [[#The 4-component retargeting framework]])
- **Their language / vocabulary** → the entire copy voice — never use industry jargon they don't
- **Existing customer base** → still feed it for lookalike audiences (see Key Concepts below)
- **Niche / segment they identify with** → identity-trigger keywords in headline ("for dentists" / "for B2B founders" / "for parents of toddlers")

### Key Concepts (still apply)

- **Lookalikes**: Base on best customers (by LTV), not all customers. Still high-value across platforms.
- **Retargeting**: Segment by funnel stage (visitors vs. cart abandoners). See [[#Retarget with DIFFERENT offers (not the same one)]] and [[#The 4-component retargeting framework]] for the modern playbook.
- **Exclusions**: Exclude existing customers and recent converters — showing ads to people who already bought wastes spend.

### Common failure mode

Trying to make up for weak creative with hyper-precise targeting. If your creative is generic but you stack 12 interests + 3 demographic filters + a custom audience, what you've built is a small audience that all see a bad ad. Better: gather the same audience identifiers, write 5 creative variants that each speak to a different segment, target broadly, let the algorithm match each creative to the right segment.

**For detailed targeting strategies by platform**: See [references/audience-targeting.md](references/audience-targeting.md)

---

## Modern Meta playbook (Andromeda era — 2026+)

Meta launched the **Andromeda** algorithm in 2025, which fundamentally changed Meta ads. The old playbook (interest stacking, polished video creative, single-winner scaling) underperforms. The new playbook:

### Creative volume is the constraint (statics > polished video)
- Andromeda is "a hungry panda" — it needs constant fresh creative or it fatigues
- **Statics often outperform video in 2026** because:
  - Meta's algorithm has a bias toward statics — it can show more statics per session per user, so they're cheaper to deliver
  - Static creative is 10x cheaper and faster to produce than video, enabling the volume Andromeda needs
  - Even top advertisers running 17+ VSLs report that down-and-dirty native statics often beat 2.5-month-production VSLs
- **Dedicate 1 hour per week** to producing fresh creatives for your winning offer. Volume > polish.

### Creative IS the targeting (broad audience + specific creative)
- The old playbook: stack interests, narrow the audience, hope to find the right buyer
- The new playbook: target broadly (just the country) and let the creative do the targeting
- **Long-form ad copy works better than short-form** in 2026 — gives Meta a wider context window to understand who to show the ad to
- Test it: take your best winning ad with interest-stacked targeting, duplicate it, remove all targeting (just pick the country), run side-by-side for 7 days. Check CPAs. Broad typically wins.

### The one-keyword hack (identity-trigger keywords)
- Take your winning ad
- Duplicate it with a niche/identity keyword inserted in the headline or body copy
- *"Here's how to get 462 leads per week on autopilot"* → *"Here's how to get 462 **dental** leads per week on autopilot"* / *"...**lawyer** leads..."* / *"...**property investment** leads..."*
- The keyword is an **identity trigger** for the viewer AND a targeting signal for Andromeda
- Dramatically drops CPL and opens audience pockets you couldn't reach with a generic ad

### AI variant farming (the 100-people test)
- Take your winning ad
- Feed to Claude/ChatGPT/Kong with the prompt:
  > *"I want you to read this ad and be the author. If I show the next ad I'm going to ask you to write to 100 people, not 1 in 100 would be able to tell you it's written by a different person. Now write this for [demographic/niche]."*
- The output should read essentially the same with subtle relevance shifts for the target
- Apply in sequence: body copy → headlines → creative
- Drop all variants in a CBO, let Meta's AI allocate spend

### Zombie campaigns
- After running a CBO, Meta will give 80% of variants no spend
- Take the dead variants you have **high conviction** about
- Launch them in a separate ad set ("zombie campaign")
- Typically resurrects 20% as winners that Meta's first allocation passed over

### Don't make ads look like ads
- Hundreds of millions of people have ad blockers — the polished-ad aesthetic kills performance
- Study what content **natively performs** in your niche on TikTok/Instagram/YouTube → produce ads that match that aesthetic
- **Burner account technique:** create a clean Instagram/TikTok account, follow all influencers and pages in your niche, like their content. Your feed becomes a curated view of what's natively winning. Produce ads that match.
- If you have an organic video with millions of views, **run that exact video as a paid ad** — proven content + paid distribution = the highest-leverage move

## Creative Best Practices

### Image Ads
- Clear product screenshots showing UI
- Before/after comparisons
- Stats and numbers as focal point
- Human faces (real, not stock)
- Bold, readable text overlay (keep under 20%)

### Video Ads Structure (15-30 sec)
1. Hook (0-3 sec): Pattern interrupt, question, or bold statement
2. Problem (3-8 sec): Relatable pain point
3. Solution (8-20 sec): Show product/benefit
4. CTA (20-30 sec): Clear next step

**Production tips:**
- Captions always (85% watch without sound)
- Vertical for Stories/Reels, square for feed
- Native feel outperforms polished
- First 3 seconds determine if they watch

### Creative Testing Hierarchy
1. Concept/angle (biggest impact)
2. Hook/headline
3. Visual style
4. Body copy
5. CTA

---

## Campaign Optimization

### Key Metrics by Objective

| Objective | Primary Metrics |
|-----------|-----------------|
| Awareness | CPM, Reach, Video view rate |
| Consideration | CTR, CPC, Time on site |
| Conversion | CPA, ROAS, Conversion rate |

### Optimization Levers

**If CPA is too high:**
1. Check landing page (is the problem post-click?)
2. Tighten audience targeting
3. Test new creative angles
4. Improve ad relevance/quality score
5. Adjust bid strategy

**If CTR is low:**
- Creative isn't resonating → test new hooks/angles
- Audience mismatch → refine targeting
- Ad fatigue → refresh creative

**If CPM is high:**
- Audience too narrow → expand targeting
- High competition → try different placements
- Low relevance score → improve creative fit

### Bid Strategy Progression
1. Start with manual or cost caps
2. Gather conversion data (50+ conversions)
3. Switch to automated with targets based on historical data
4. Monitor and adjust targets based on results

---

## Retargeting Strategies

### Funnel-Based Approach

| Funnel Stage | Audience | Message | Goal |
|--------------|----------|---------|------|
| Top | Blog readers, video viewers | Educational, social proof | Move to consideration |
| Middle | Pricing/feature page visitors | Case studies, demos | Move to decision |
| Bottom | Cart abandoners, trial users | Urgency, objection handling | Convert |

### Retargeting Windows

| Stage | Window | Frequency Cap |
|-------|--------|---------------|
| Hot (cart/trial) | 1-7 days | Higher OK |
| Warm (key pages) | 7-30 days | 3-5x/week |
| Cold (any visit) | 30-90 days | 1-2x/week |

### Exclusions to Set Up
- Existing customers (unless upsell)
- Recent converters (7-14 day window)
- Bounced visitors (<10 sec)
- Irrelevant pages (careers, support)

### Retarget with DIFFERENT offers (not the same one)

The conventional retargeting playbook re-shows the same product/offer to people who didn't buy. The Sabri Suby principle: **the #1 reason someone didn't buy is the offer wasn't right for them.** Re-showing the same thing harder doesn't help.

Instead, retarget with **different** products, services, or offers from your catalog:
- Visitor clicked on protein powder, didn't buy → retarget with creatine (totally different category)
- Visitor downloaded a lead magnet, didn't book a call → retarget with a different lead magnet on a related topic
- Visitor viewed pricing, didn't sign up → retarget with a free audit or assessment instead

The lift from this is often dramatic — a 2-3 ROAS audience on the original offer can hit 6+ ROAS on a different offer.

### The 4-component retargeting framework

Build out your retargeting layer with these 4 ad types running simultaneously:

1. **Objection-handling ad** — directly addresses the most common reasons people didn't buy. To find these, **outbound call every lead** who didn't convert and ask why. The verbatim objections become the headline of this ad.
2. **Proof testimonial carousel** — multi-image/multi-slide carousel of testimonials and proof that supports the claims of your original ad
3. **Other-offers CBO** — your other best-performing ads for other products/services in one CBO, retargeted to the same audience
4. **Value-first audit/assessment ad** — wraps your call in a free piece of value. Whether they buy or not, they leave with something useful. Lowers the friction to engage.

These four together, retargeting the same audience that didn't convert from the top-of-funnel ad, dramatically lift the ROAS of the entire funnel.

---

## Landing Page Alignment (the headline-mirror trick)

Ad-to-landing-page congruence is the single most underrated lever in paid ads. Most advertisers spend 90% of effort on ads and 10% on the landing page; flip that ratio.

### Headline mirroring

Meta is the best split-testing tool that exists — your ad headlines are exposed to ~1000x the audience that actually clicks through to your landing page. That means you get statistically-significant data on which headlines work *much faster* on Meta than on your landing page.

The play:

1. Run **20-40 different headlines** as ad variations
2. Identify the best-performing headline (by CTR + downstream conversion)
3. **Mirror that winning headline on your landing page** — exact wording in the H1, sub-headline, and lead-in copy of the body
4. Expect a **15-20% minimum lift** in landing-page conversion rate from this single change

This works because the viewer who clicked is expecting *that specific promise*. When the landing page restates the exact promise verbatim, scent matches and conversion follows. When the landing page pivots to a different angle, bounce rate spikes regardless of how good the page is.

### Three split tests minimum at all times

A standing discipline: **at any given moment, you should have at least 3 split tests running** somewhere in your funnel — ad creative, landing page, offer, or post-conversion flow. If you don't, you've capped your improvement curve.

The math: 3 simultaneous tests × ~10-20% lift each (compounding) = a fundamentally better funnel within a quarter.

## Reporting & Analysis

### Weekly Review
- Spend vs. budget pacing
- CPA/ROAS vs. targets
- Top and bottom performing ads
- Audience performance breakdown
- Frequency check (fatigue risk)
- Landing page conversion rate

### Attribution Considerations
- Platform attribution is inflated
- Use UTM parameters consistently
- Compare platform data to GA4
- Look at blended CAC, not just platform CPA

### Scaling discipline (net cash > ROAS percentage)

The most common scaling failure: a business at a 40 ROAS spending $5k/month, refusing to scale because "if I spend more, my ROAS will drop." This is the wrong frame.

**Net cash flow > ROAS percentage at the business level:**
- ROAS dropping from 10 → 5 sounds bad
- But if spend goes from $10k → $100k, you net dramatically more total profit
- The number to optimize is **blended ROAS at the business level**, not per-ad-set ROAS
- Even better: optimize **net free cash flow**, not ROAS at all

**Find your break-even ROAS:**
1. Calculate the absolute maximum you can pay to acquire a customer and still be profitable (factoring LTV)
2. That's your break-even ROAS / CPA ceiling
3. **Scale until you approach that ceiling**, not until your ad-account ROAS drops below an arbitrary preference

**The 3-hour founder review:**
- Block out **3 hours per month** in the calendar to physically review the numbers yourself
- Not what your data analyst says. Not what your media buyer says. You, going through the actual data
- The confidence this generates is irreplaceable — and confidence is what lets you scale with conviction
- "Data gives you confidence. Confidence gives you speed."

**Outbound-call your leads who didn't convert:**
- Every lead that downloaded a lead magnet or hit your funnel but didn't buy gets a call
- Ask why they didn't book, what was confusing, what the actual blocker was
- These verbatim answers become objection-handling ads (see Retargeting section)
- Massive insight-to-creative loop that most advertisers skip

---

## Platform Setup

Before launching campaigns, ensure proper tracking and account setup.

**For complete setup checklists by platform**: See [references/platform-setup-checklists.md](references/platform-setup-checklists.md)

**For conversion pixel installation and event setup**: See [references/conversion-tracking.md](references/conversion-tracking.md)

### Universal Pre-Launch Checklist
- [ ] Conversion tracking tested with real conversion
- [ ] Landing page loads fast (<3 sec)
- [ ] Landing page mobile-friendly
- [ ] UTM parameters working
- [ ] Budget set correctly
- [ ] Targeting matches intended audience

---

## Google RSA Output Spec (mandatory when generating RSAs)

When the user requests Google Ads RSAs (Responsive Search Ads), output MUST comply with these platform limits and structural requirements. Do not output any RSA that violates them.

### Hard limits per RSA (enforce before responding)

- **Headlines:** exactly **15** per RSA, each **≤ 30 characters** (count characters, including spaces). Render as `1. ... (NN chars)` so the reader can verify.
- **Descriptions:** exactly **4** per RSA, each **≤ 90 characters**.
- **Paths:** up to 2 path fields, each **≤ 15 characters**.
- **Final URL:** present, https.
- **Pinning:** state any pinned positions explicitly. Default = unpinned unless user asks.
- **Per-account guardrail:** Google enforces **3 RSAs max per ad group**. When the user asks for >3, group them by ad group.

### Required sidecar artifacts (always include with RSA request)

1. **Ad group structure**, labeled `Ad group structure:` — list each ad group with its theme, target keywords (match types), and which RSAs map to it.
2. **Negative keyword list**, labeled `Negative keywords:` — minimum **8** entries, group-level vs campaign-level called out.
3. **Sitelinks** (≥ 4), **Callouts** (≥ 4 ≤25 chars), **Structured snippets** if relevant.

### Medical / CFM compliance (when product context indicates pt-BR medical practice)

If `.agents/product-marketing.md` indicates a Brazilian medical practice (CFM-regulated), the following terms are **forbidden** in headlines, descriptions, sitelinks, and callouts:

- Superlatives: `#1`, `melhor`, `o melhor`, `melhor do brasil`, `top`, `referência`
- Outcome promises: `garantido`, `garantia`, `cura`, `cura definitiva`, `100%`, `resultado garantido`, `livre da dor`
- Comparative claims vs other doctors/clinics

Use neutral framing: `atendimento`, `consulta`, `avaliação`, `segunda opinião`, `agende sua consulta`, `tire suas dúvidas`. Geo modifier (`Porto Alegre`, `POA`, `Zona Sul POA`) required where the prompt specifies a region.

### Output ORDER (mandatory — emit in this order to avoid truncation)

1. **Ad group structure** (short)
2. **Negative keywords** (≥8, MANDATORY — emit BEFORE RSAs so it isn't dropped if output runs long)
3. **Sitelinks** (≥4)
4. **Callouts** (≥4)
5. **RSA1, RSA2, RSA3** (largest section, last — safe to truncate gracefully)

### Output template (mandatory shape)

```
Ad group structure:
- AG1 [theme]: keywords (match types) → RSA1, RSA2
- AG2 [theme]: ...

Negative keywords:
  Campaign-level:
    - <kw>
    - <kw>
    (≥4 here)
  Ad-group level:
    - AG1: <kw>, <kw>
    - AG2: <kw>, <kw>
    (≥4 more here — TOTAL ≥8 entries)

Sitelinks (≥4):
  - <title (≤25)> | <desc1 (≤35)> | <desc2 (≤35)> | URL

Callouts (≥4, each ≤25 chars):
  - <callout>

RSA1 — [ad group name]
  Final URL: https://...
  Path1: ...   Path2: ...
  Headlines (15, each ≤30 chars):
    1. <headline> (NN chars)
    ...
    15. <headline> (NN chars)
  Descriptions (4, each ≤90 chars):
    1. <description> (NN chars)
    ...
    4. <description> (NN chars)
  Pinning: H1=none; H2=none; ...   (or explicit pins)

RSA2 — ...
RSA3 — ...
```

### Self-check before responding

Before sending the output, run this checklist mentally:

- [ ] Each RSA has exactly 15 headlines, exactly 4 descriptions.
- [ ] Every headline is ≤30 chars; every description is ≤90 chars. Character counts printed.
- [ ] Negative keyword list labeled and ≥8 entries.
- [ ] Ad group structure labeled.
- [ ] If medical (CFM): no forbidden superlative/outcome words; geo modifier present where required; language is pt-BR.

If any check fails, rewrite before responding. Do not ship partial RSAs.

---

## Common Mistakes to Avoid

### Strategy
- Launching without conversion tracking
- Too many campaigns (fragmenting budget)
- Not giving algorithms enough learning time
- Optimizing for wrong metric

### Targeting
- Audiences too narrow or too broad
- Not excluding existing customers
- Overlapping audiences competing

### Creative
- Only one ad per ad set
- Not refreshing creative (fatigue)
- Mismatch between ad and landing page

### Budget
- Spreading too thin across campaigns
- Making big budget changes (disrupts learning)
- Stopping campaigns during learning phase

---

## Task-Specific Questions

1. What platform(s) are you currently running or want to start with?
2. What's your monthly ad budget?
3. What does a successful conversion look like (and what's it worth)?
4. Do you have existing creative assets or need to create them?
5. What landing page will ads point to?
6. Do you have pixel/conversion tracking set up?

---

## Tool Integrations

For implementation, see the [tools registry](../../tools/REGISTRY.md). Key advertising platforms:

| Platform | Best For | MCP | Guide |
|----------|----------|:---:|-------|
| **Google Ads** | Search intent, high-intent traffic | ✓ | [google-ads.md](../../tools/integrations/google-ads.md) |
| **Meta Ads** | Demand gen, visual products, B2C | - | [meta-ads.md](../../tools/integrations/meta-ads.md) |
| **LinkedIn Ads** | B2B, job title targeting | - | [linkedin-ads.md](../../tools/integrations/linkedin-ads.md) |
| **TikTok Ads** | Younger demographics, video | - | [tiktok-ads.md](../../tools/integrations/tiktok-ads.md) |

For tracking setup, see [references/conversion-tracking.md](references/conversion-tracking.md), [ga4.md](../../tools/integrations/ga4.md), [segment.md](../../tools/integrations/segment.md)

---

## Related Skills

- **ad-creative**: For generating and iterating ad headlines, descriptions, and creative at scale
- **copywriting**: For landing page copy that converts ad traffic
- **analytics**: For proper conversion tracking setup
- **ab-testing**: For landing page testing to improve ROAS
- **cro**: For optimizing post-click conversion rates
