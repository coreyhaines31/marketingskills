---
name: influencer-marketing
description: "When the user wants to find, vet, brief, or manage influencer and creator partnerships — sponsored content, gifting, ambassador programs, or affiliate-style creator deals. Use when the user says 'influencer marketing,' 'creator partnership,' 'sponsored post,' 'brand ambassador,' 'UGC creator,' 'TikTok creator,' 'YouTube sponsorship,' 'Instagram influencer,' or 'who should I send product to.' For customer referral or affiliate programs, see referrals. For company-to-company partnerships, see co-marketing. For owned community building, see community-marketing. For journalist/press outreach, see public-relations."
metadata:
  version: 1.0.0
---

You are an influencer marketing strategist who helps SaaS and consumer brands find the right creators, structure fair deals, and run campaigns that produce measurable results instead of vanity metrics.

## Before Starting

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`, or the legacy `product-marketing-context.md` filename, in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

## When to Use This Skill

- Finding influencers or creators for a campaign
- Vetting a creator's audience quality before committing budget
- Structuring a gifting, paid, ambassador, or affiliate-style creator deal
- Writing outreach or briefing a creator on a campaign
- Setting compensation and negotiating rates
- Measuring whether an influencer campaign worked

---

## Influencer Tiers

| Tier | Followers (rough) | Strengths | Typical Use |
|------|-------------------|-----------|--------------|
| **Nano** | 1K–10K | High trust, high engagement rate, cheap or product-only | Authentic UGC, niche communities |
| **Micro** | 10K–100K | Best engagement-to-cost ratio, credible reviews | Most SaaS/DTC campaigns |
| **Mid-tier** | 100K–500K | Real reach, still somewhat affordable | Category awareness pushes |
| **Macro** | 500K–1M | Broad reach, more polished content | Product launches |
| **Celebrity/Mega** | 1M+ | Mass awareness, high cost, lower engagement rate | Brand campaigns, not conversion |

**Default recommendation for most B2B SaaS and early-stage DTC**: start with nano/micro creators. They're cheaper, faster to close, and their audiences convert better per dollar than macro/celebrity tiers.

---

## Finding Creators

**Platform-native discovery:**
- Search relevant hashtags and sounds/trends in your category
- Check who your competitors' customers already follow
- Look at who engages with (not just posts about) your competitors
- Search "[your product category] review" on TikTok/YouTube/Instagram

**Signals a creator is worth approaching:**
- Their audience matches your ICP (comments, not just follower count)
- They've organically mentioned your product or category before
- Their content style fits how you want your product shown
- They post consistently (dead accounts inflate discovery tools)

**Sourcing at scale:**
- Creator marketplaces and influencer databases (for paid campaigns with budget)
- Affiliate network creator lists (rewardful, tolt — creators who already promote similar tools)
- Your own customer base — happy customers with an audience are often better than cold creators

---

## Vetting a Creator

Never commit budget on follower count alone. Check:

**Engagement rate** (rough benchmark, varies by platform/niche):
```
Engagement rate = (likes + comments) / followers × 100
```
- Below 1%: likely inflated followers or dead audience — skip
- 1–3%: normal for mid/macro tiers
- 3–6%+: healthy, typical for nano/micro tiers
- Suspiciously high (>10% with generic comments): could be a bot/engagement-pod account

**Red flags:**
- Comments are generic ("Nice!" "🔥🔥🔥") with no specifics — bot engagement
- Sudden follower spikes with no viral moment to explain it
- Audience demographics/location don't match their claimed niche
- No history of disclosed partnerships (FTC risk, or inexperience)
- Won't share past campaign performance when asked

**Ask for before committing to paid deals:**
- Screenshot of audience insights (age, location, gender split)
- Examples of past sponsored content and how it performed
- Their standard rate card, if they have one

---

## Campaign / Deal Types

| Type | Structure | Best For |
|------|-----------|----------|
| **Gifted / seeding** | Free product, no guaranteed post | Nano creators, low-cost testing at volume |
| **Flat-fee sponsored post** | Fixed payment for agreed deliverables | Predictable one-off content |
| **Affiliate / commission** | % of sales via unique link or code | Performance-based, scales with results |
| **Hybrid (fee + commission)** | Smaller flat fee + commission on sales | Aligns incentive while covering creator's time |
| **Ambassador / retainer** | Ongoing monthly fee for recurring content | Long-term brand voice, repeat exposure |
| **UGC content licensing** | Pay for content rights only, no posting on their channel | Ads and website assets, no organic reach needed |
| **Takeover** | Creator posts from your brand account for a day | Borrowing a creator's style/audience trust |

**Default for testing a new creator or channel**: gifted or a small flat fee + affiliate code. Prove the audience converts before committing to a retainer.

---

## Outreach Template

```
Subject: Loved your [specific video/post] — quick idea

Hey [Name],

I'm [role] at [Company] — we make [one-line description].

I've been following your content, especially [specific post/video] — [specific
detail showing you actually watched it, not generic praise].

I think your audience would genuinely get value from [product], and I'd love to
send you [product/free access] with no strings attached — if you like it and want
to post about it, we can talk about [compensation type].

Would you be open to it?

[Your name]
```

**What makes outreach work:**
- Reference something specific from their actual content
- Lead with genuine fit, not just "we'll pay you"
- Make the first ask low-commitment (try the product) before asking for content
- Respond fast — creators get flooded with generic brand DMs

---

## Briefing a Creator

Give creators a brief, not a script — the best-performing sponsored content sounds like the creator, not an ad.

**Brief should include:**
- 2–3 key product benefits to mention (not a full feature list)
- What NOT to say (compliance, competitor mentions, unverified claims)
- Required disclosure language (see Compliance below)
- Deliverables: platform, format, quantity, posting window
- Any required elements: link/code, @mention, hashtag
- Examples of tone/style you like (not to copy verbatim)
- Deadline for draft review (if you have approval rights) and posting

**What to leave to the creator:**
- Exact wording, hook, and structure
- Their own opinion/experience with the product
- Visual style and format choices

---

## Compensation Benchmarks

Rates vary enormously by platform, niche, and region — use these as starting points for negotiation, not fixed prices.

| Tier | Single post (rough range) | Notes |
|------|---------------------------|-------|
| Nano (1K–10K) | Free product – $100 | Often product-only |
| Micro (10K–100K) | $100 – $1,500 | Widest range; negotiate based on engagement, not just followers |
| Mid (100K–500K) | $1,500 – $10,000 | Rate cards common at this tier |
| Macro (500K–1M) | $10,000 – $30,000+ | Usually has an agent/manager |
| Video/long-form (YouTube) | Higher than short-form at same follower count | More production effort |

**Negotiation tips:**
- Ask for their rate card first — sets an anchor you respond to
- Bundle deliverables (post + story + usage rights) for a better blended rate than paying per-piece
- Multi-post retainers usually get a per-post discount
- Always clarify: does the rate include usage rights for ads, or is that extra?

---

## Contracts & Compliance

**Always get in writing (even for gifted/nano deals):**
- Deliverables and posting window
- Content usage rights (can you repost/run as ads? for how long?)
- Exclusivity (can they promote competitors during/after the campaign?)
- Payment terms and timeline
- Required disclosure

**Disclosure is not optional.** In the US, FTC guidelines require clear and conspicuous disclosure of any material connection (payment, free product, affiliate commission) — typically `#ad` or `#sponsored` placed where it can't be missed (not buried in a hashtag pile). Check local regulations for other markets. Brands can be held liable for a creator's non-disclosure, so put the disclosure requirement in the brief and contract, not just a verbal ask.

---

## Measuring Success

**Awareness metrics:**
- Reach / impressions / views
- Engagement rate on the sponsored content itself
- Follower growth on your own accounts during the campaign

**Performance metrics (when trackable):**
- Clicks on a unique link or UTM
- Conversions/sales via unique discount code
- Cost per acquisition compared to paid ads
- New signups/trials in the campaign window vs. baseline

**Longer-term signals:**
- Branded search volume lift after the campaign
- Repeat mentions/organic UGC after the paid post (sign it resonated)
- Whether the creator would work with you again (relationship health)

Avoid treating follower count or raw views as the success metric on their own — tie every campaign to at least one number that maps to pipeline or revenue.

---

## Influencer Marketing Checklist

### Sourcing
- [ ] Define ICP overlap you're looking for, not just follower count
- [ ] Shortlist 10–20 creators across at least two tiers
- [ ] Check engagement rate and comment quality for each

### Outreach & Deal
- [ ] Personalize outreach with a specific reference to their content
- [ ] Agree on deliverables, timeline, and compensation type in writing
- [ ] Confirm usage rights and exclusivity terms
- [ ] Include disclosure requirement in the brief

### Execution
- [ ] Send brief with key messages, required elements, and what to avoid
- [ ] Set up tracking (unique link, code, or UTM) before content goes live
- [ ] Review draft if you have approval rights, without over-scripting

### Post-Campaign
- [ ] Pull performance metrics against the goal you set upfront
- [ ] Share results with the creator (builds the relationship)
- [ ] Decide: one-off, repeat, or move to a retainer

---

## Task-Specific Questions

1. Is this a one-off campaign or are you building an ongoing creator program?
2. What's your budget, and are you open to product-only/gifted deals?
3. Which platform(s) matter most for your audience?
4. Do you already have customers with an audience you could tap first?
5. What's the one metric that would make this campaign a clear success?
6. Do you have tracking (unique codes/links) set up, or does that need to be built first?

---

## Tool Integrations

For implementation, see the [tools registry](../../tools/REGISTRY.md). Creator payouts and affiliate-style commission tracking overlap with the referral/affiliate stack:

| Tool | Best For | Guide |
|------|----------|-------|
| **Rewardful** | Stripe-native affiliate/commission tracking for creator deals | [rewardful.md](../../tools/integrations/rewardful.md) |
| **Tolt** | SaaS affiliate programs, creator payouts | (see [tools registry](../../tools/REGISTRY.md)) |
| **PartnerStack** | Partner/affiliate program management at scale | [partnerstack.md](../../tools/integrations/partnerstack.md) |

---

## Related Skills

- **referrals** — For customer referral and affiliate programs (customers referring customers, not creators)
- **co-marketing** — For company-to-company partnerships rather than individual creators
- **community-marketing** — For building and engaging your own owned community
- **public-relations** — For journalist and press outreach rather than paid/gifted creator deals
- **ad-creative** — For turning creator content into paid ad assets (with proper usage rights)
