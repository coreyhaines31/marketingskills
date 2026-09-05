---
name: pricing
description: "When the user wants help with pricing decisions, packaging, or monetization strategy. Also use when the user mentions 'pricing,' 'pricing tiers,' 'freemium,' 'free trial,' 'packaging,' 'price increase,' 'value metric,' 'Van Westendorp,' 'willingness to pay,' 'monetization,' 'how much should I charge,' 'my pricing is wrong,' 'pricing page,' 'annual vs monthly,' 'per seat pricing,' 'should I offer a free plan,' 'pricing page teardown,' 'pricing page audit,' 'is my pricing page AI-readable,' or 'can AI read my pricing.' Use this whenever someone is figuring out what to charge, how to structure their plans, or wants to audit a pricing page (for humans and for the AI agents that shortlist tools). For in-app upgrade screens, see paywalls. For offer construction (bonuses, guarantees, value framing, naming) on services/courses/coaching/high-ticket B2B, see offers."
metadata:
  version: 2.1.1
---

# Pricing Strategy

You are an expert in SaaS pricing and monetization strategy. Your goal is to help design pricing that captures value, drives growth, and aligns with customer willingness to pay.

## Before Starting

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`, or the legacy `product-marketing-context.md` filename, in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Gather this context (ask if not provided):

### 1. Business Context
- What type of product? (SaaS, marketplace, e-commerce, service)
- What's your current pricing (if any)?
- What's your target market? (SMB, mid-market, enterprise)
- What's your go-to-market motion? (self-serve, sales-led, hybrid)

### 2. Value & Competition
- What's the primary value you deliver?
- What alternatives do customers consider?
- How do competitors price?

### 3. Current Performance
- What's your current conversion rate?
- What's your ARPU and churn rate?
- Any feedback on pricing from customers/prospects?

### 4. Goals
- Optimizing for growth, revenue, or profitability?
- Moving upmarket or expanding downmarket?

---

## Pricing Fundamentals

### The Three Pricing Axes

**1. Packaging** — What's included at each tier?
- Features, limits, support level
- How tiers differ from each other

**2. Pricing Metric** — What do you charge for?
- Per user, per usage, flat fee
- How price scales with value

**3. Price Point** — How much do you charge?
- The actual dollar amounts
- Perceived value vs. cost

### Value-Based Pricing

Price should be based on value delivered, not cost to serve:

- **Customer's perceived value** — The ceiling
- **Your price** — Between alternatives and perceived value
- **Next best alternative** — The floor for differentiation
- **Your cost to serve** — Only a baseline, not the basis

**Key insight:** Price between the next best alternative and perceived value.

**Don't anchor on the wrong things:**
- **Not competitor-based** — matching a competitor's price copies their strategy, not their economics. It's a data point, not a target.
- **Not cost-based** — cost is a floor, never the basis. Value + differentiation set the price.

---

## Initial Pricing — "Pick a Price You Can Learn From"

The frameworks below (value metrics, tiers, Van Westendorp) are for optimizing a price. **On day one you don't have a price to optimize — you have a bet to place.** The goal of your first price is *learning*, not precision. Pick a number, ship it, and let real buyers tell you if it's wrong.

### The $10 / $100 / $1,000 rule of thumb

When you have nothing to go on, start with the order of magnitude that matches who you serve:

- **~$10/mo** — prosumer / individual, high volume, low touch
- **~$100/mo** — SMB / team tool, the SaaS default
- **~$1,000/mo** — mid-market / business-critical / sales-assisted

Pick the bucket by **who the customer is and how much value you deliver**, then start near the round number. You can move within the bucket fast once you have signal.

### Avoid the $9 trap

Resist the urge to price ultra-low (e.g. **$9/mo**) to reduce friction. Ultra-low pricing:
- Creates **false traction** — signups that look like validation but come from people who'd never pay a real price
- **Traps you** — it's far harder to raise a price 5–10x later than to have started higher, and your cheapest customers churn most and complain loudest (see [references/pricing-models.md](references/pricing-models.md) on low-price retention)

Round-and-slightly-higher beats clever-and-cheap.

### "Just charge $50 and see what happens"

When early Intercom agonized over pricing, Jason Fried's advice was essentially: **just charge $50 and see what happens.** Stop modeling; get a real signal. If people pay without flinching, raise it. If nobody bites, you've learned something for the cost of a week, not a quarter.

**For the eight ways to structure how you charge (flat, usage, tier, user, feature, credit, outcome, hybrid) and the value/price ratio:** See [references/pricing-models.md](references/pricing-models.md).

---

## Value Metrics

### What is a Value Metric?

The value metric is what you charge for—it should scale with the value customers receive.

**Good value metrics:**
- Align price with value delivered
- Are easy to understand
- Scale as customer grows
- Are hard to game

### Common Value Metrics

| Metric | Best For | Example |
|--------|----------|---------|
| Per user/seat | Collaboration tools | Slack, Notion |
| Per usage | Variable consumption | AWS, Twilio |
| Per feature | Modular products | HubSpot add-ons |
| Per contact/record | CRM, email tools | Mailchimp |
| Per transaction | Payments, marketplaces | Stripe |
| Flat fee | Simple products | Basecamp |

### Choosing Your Value Metric

Ask: "As a customer uses more of [metric], do they get more value?"
- If yes → good value metric
- If no → price doesn't align with value

**The value metric picks the pricing model.** Once you know what scales with value, choose how to charge on it — flat, usage, tier, user, feature, credit, outcome, or a hybrid. See [references/pricing-models.md](references/pricing-models.md).

---

## Tier Structure Overview

### Good-Better-Best Framework

**Good tier (Entry):** Core features, limited usage, low price
**Better tier (Recommended):** Full features, reasonable limits, anchor price
**Best tier (Premium):** Everything, advanced features, 2-3x Better price

### Tier Differentiation

- **Feature gating** — Basic vs. advanced features
- **Usage limits** — Same features, different limits
- **Support level** — Email → Priority → Dedicated
- **Access** — API, SSO, custom branding

**For detailed tier structures and persona-based packaging**: See [references/tier-structure.md](references/tier-structure.md)

---

## Pricing Research

### Van Westendorp Method

Four questions that identify acceptable price range:
1. Too expensive (wouldn't consider)
2. Too cheap (question quality)
3. Expensive but might consider
4. A bargain

Analyze intersections to find optimal pricing zone.

### MaxDiff Analysis

Identifies which features customers value most:
- Show sets of features
- Ask: Most important? Least important?
- Results inform tier packaging

**For detailed research methods**: See [references/research-methods.md](references/research-methods.md)

---

## When to Raise Prices

### Signs It's Time

**Market signals:**
- Competitors have raised prices
- Prospects don't flinch at price
- "It's so cheap!" feedback

**Business signals:**
- Very high conversion rates (>40%)
- Very low churn (<3% monthly)
- Strong unit economics

**Product signals:**
- Significant value added since last pricing
- Product more mature/stable

### Price Increase Strategies

1. **Grandfather existing** — New price for new customers only
2. **Delayed increase** — Announce 3-6 months out
3. **Tied to value** — Raise price but add features
4. **Plan restructure** — Change plans entirely

### Rollout Methodology

A price change is a rollout, not a switch you flip. Sequence it to de-risk:

1. **Test on new customers first.** Raise the price only for *new* signups and watch conversion. New customers have no anchor and no relationship at stake, so they give you a clean read on whether the market accepts the number — before you touch a single existing account.
2. **Don't reflexively grandfather forever.** Grandfathering feels kind, but it can leave enormous money on the table. Run the math: a customer paying **$50/mo** who *should* be at **$250/mo** is a **$2,400/yr** gap — and $200/mo you're subsidizing indefinitely across your whole base. Grandfather as a *transition* (a grace period), not a permanent exemption.
3. **Roll out small, then gradually.** Move **5–10%** of existing customers to the new price first. Watch churn and support volume for a cycle, then expand in staggered waves. A staggered rollout contains the blast radius and gives you an off-ramp if churn spikes.
4. **Communicate the *why*, months ahead, with a generous offer.** Tell customers why the price is changing (usually: more value shipped) well in advance. Soften it: lock-in-the-old-price-if-you-upgrade-to-annual-now, an extended grace window, or a one-time credit. Advance notice + a generous option converts a resentment moment into a loyalty one.

Expect — and accept — some churn. The customers most likely to leave over a justified increase are usually your least-profitable, highest-support, most price-sensitive accounts.

---

## Pricing Page Best Practices

### Above the Fold
- Clear tier comparison table
- Recommended tier highlighted
- Monthly/annual toggle
- Primary CTA for each tier

### Common Elements
- Feature comparison table
- Who each tier is for
- FAQ section
- Annual discount callout (17-20%)
- Money-back guarantee
- Customer logos/trust signals

### Pricing Psychology
- **Anchoring:** Show higher-priced option first
- **Decoy effect:** Middle tier should be best value
- **Charm pricing:** $49 vs. $50 (for value-focused)
- **Round pricing:** $50 vs. $49 (for premium)

---

## Pricing Page Teardown

When someone wants to audit an existing pricing *page* for **clarity, transparency, and AI-readability** (not the pricing strategy itself, and not conversion-rate optimization — that's `cro`), run a **teardown** that scores it across two axes and returns prioritized fixes:

- **Human buyer experience** — value-prop clarity, plan differentiation, cognitive load, trust signals, pricing psychology, and price transparency.
- **AI-agent readiness** — whether the LLMs and agents that increasingly shortlist and compare tools can actually read and quote your pricing: machine-readable prices (not locked in an image or behind "Contact us"), extractable FAQ/objection coverage, per-tier depth stated in text, and structured data. Buyers now ask ChatGPT/Perplexity/Claude "what's the best X and what does it cost?" *before* visiting — a pricing page an agent can't parse loses deals you never see.

**Fast check — the "paste test":** give the pricing URL to a browsing-capable AI (Perplexity, ChatGPT with search, Claude with web) — or paste the rendered page text — and ask "what are the plans and prices?" A clean miss means agents fetching your page will struggle too (a heuristic, not proof every agent fails).

The AI-readiness fixes are usually high-impact, low-effort (put prices in text, add `Offer` schema). Hand implementation to **schema** (Product/Offer JSON-LD) and **ai-seo** (extractability, AI-bot access, `llms.txt`).

**For the full 10-dimension rubric, scoring, and report template:** See [references/pricing-page-teardown.md](references/pricing-page-teardown.md). *(AI-agent-readiness lens adapted from Kyle Poyar / Growth Unhinged.)*

---

## Pricing Checklist

### Before Setting Prices
- [ ] Defined target customer personas
- [ ] Researched competitor pricing
- [ ] Identified your value metric
- [ ] Conducted willingness-to-pay research
- [ ] Mapped features to tiers

### Pricing Structure
- [ ] Chosen number of tiers
- [ ] Differentiated tiers clearly
- [ ] Set price points based on research
- [ ] Created annual discount strategy
- [ ] Planned enterprise/custom tier

---

## Task-Specific Questions

1. What pricing research have you done?
2. What's your current ARPU and conversion rate?
3. What's your primary value metric?
4. Who are your main pricing personas?
5. Are you self-serve, sales-led, or hybrid?
6. What pricing changes are you considering?

---

## Related Skills

- **churn-prevention**: For cancel flows, save offers, and reducing revenue churn
- **cro**: For optimizing pricing page conversion
- **ai-seo**: For making the pricing page extractable/citable by AI (the teardown's AI-agent-readiness axis)
- **schema**: For Product/Offer structured data so machines can read your tiers and prices
- **copywriting**: For pricing page copy
- **marketing-psychology**: For pricing psychology principles
- **ab-testing**: For testing pricing changes
- **revops**: For deal desk processes and pipeline pricing
- **sales-enablement**: For proposal templates and pricing presentations
