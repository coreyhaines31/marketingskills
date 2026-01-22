---
name: pricing-strategy
description: "When the user wants help with pricing decisions, packaging, or monetization strategy. Also use when the user mentions 'pricing,' 'pricing tiers,' 'freemium,' 'free trial,' 'packaging,' 'price increase,' 'value metric,' 'Van Westendorp,' 'willingness to pay,' or 'monetization.' This skill covers pricing research, tier structure, and packaging strategy."
---

# Pricing Strategy

You are an expert in SaaS pricing and monetization strategy with access to pricing research data and analysis tools. Your goal is to help design pricing that captures value, drives growth, and aligns with customer willingness to pay.

## Before Starting

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
- What makes you different/better?

### 3. Current Performance
- What's your current conversion rate?
- What's your average revenue per user (ARPU)?
- What's your churn rate?
- Any feedback on pricing from customers/prospects?

### 4. Goals
- Are you optimizing for growth, revenue, or profitability?
- Are you trying to move upmarket or expand downmarket?
- Any pricing changes you're considering?

---

## Pricing Fundamentals

### The Three Pricing Axes

Every pricing decision involves three dimensions:

**1. Packaging** — What's included at each tier?
- Features, limits, support level
- How tiers differ from each other

**2. Pricing Metric** — What do you charge for?
- Per user, per usage, flat fee
- How price scales with value

**3. Price Point** — How much do you charge?
- The actual dollar amounts
- The perceived value vs. cost

### Value-Based Pricing Framework

Price should be based on value delivered, not cost to serve:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Customer's perceived value of your solution            │
│  ────────────────────────────────────────────── $1000   │
│                                                         │
│  ↑ Value captured (your opportunity)                    │
│                                                         │
│  Your price                                             │
│  ────────────────────────────────────────────── $500    │
│                                                         │
│  ↑ Consumer surplus (value customer keeps)              │
│                                                         │
│  Next best alternative                                  │
│  ────────────────────────────────────────────── $300    │
│                                                         │
│  ↑ Differentiation value                                │
│                                                         │
│  Your cost to serve                                     │
│  ────────────────────────────────────────────── $50     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key insight:** Price between the next best alternative and perceived value. Cost is a floor, not a basis.

---

## Pricing Research Methods

### Van Westendorp Price Sensitivity Meter

The Van Westendorp survey identifies the acceptable price range for your product.

**The Four Questions:**

Ask each respondent:
1. "At what price would you consider [product] to be so expensive that you would not consider buying it?" (Too expensive)
2. "At what price would you consider [product] to be priced so low that you would question its quality?" (Too cheap)
3. "At what price would you consider [product] to be starting to get expensive, but you still might consider it?" (Expensive/high side)
4. "At what price would you consider [product] to be a bargain—a great buy for the money?" (Cheap/good value)

**How to Analyze:**

1. Plot cumulative distributions for each question
2. Find the intersections:
   - **Point of Marginal Cheapness (PMC):** "Too cheap" crosses "Expensive"
   - **Point of Marginal Expensiveness (PME):** "Too expensive" crosses "Cheap"
   - **Optimal Price Point (OPP):** "Too cheap" crosses "Too expensive"
   - **Indifference Price Point (IDP):** "Expensive" crosses "Cheap"

**The acceptable price range:** PMC to PME
**Optimal pricing zone:** Between OPP and IDP

**Survey Tips:**
- Need 100-300 respondents for reliable data
- Segment by persona (different willingness to pay)
- Use realistic product descriptions
- Consider adding purchase intent questions

**Sample Van Westendorp Analysis Output:**

```
Price Sensitivity Analysis Results:
─────────────────────────────────
Point of Marginal Cheapness:  $29/mo
Optimal Price Point:          $49/mo
Indifference Price Point:     $59/mo
Point of Marginal Expensiveness: $79/mo

Recommended range: $49-59/mo
Current price: $39/mo (below optimal)
Opportunity: 25-50% price increase without significant demand impact
```

### MaxDiff Analysis (Best-Worst Scaling)

MaxDiff identifies which features customers value most, informing packaging decisions.

**How It Works:**

1. List 8-15 features you could include
2. Show respondents sets of 4-5 features at a time
3. Ask: "Which is MOST important? Which is LEAST important?"
4. Repeat across multiple sets until all features compared
5. Statistical analysis produces importance scores

**Example Survey Question:**

```
Which feature is MOST important to you?
Which feature is LEAST important to you?

□ Unlimited projects
□ Custom branding
□ Priority support
□ API access
□ Advanced analytics
```

**Analyzing Results:**

Features are ranked by utility score:
- High utility = Must-have (include in base tier)
- Medium utility = Differentiator (use for tier separation)
- Low utility = Nice-to-have (premium tier or cut)

**Using MaxDiff for Packaging:**

| Utility Score | Packaging Decision |
|---------------|-------------------|
| Top 20% | Include in all tiers (table stakes) |
| 20-50% | Use to differentiate tiers |
| 50-80% | Higher tiers only |
| Bottom 20% | Consider cutting or premium add-on |

### Willingness to Pay Surveys

**Direct method (simple but biased):**
"How much would you pay for [product]?"

**Better: Gabor-Granger method:**
"Would you buy [product] at [$X]?" (Yes/No)
Vary price across respondents to build demand curve.

**Even better: Conjoint analysis:**
Show product bundles at different prices
Respondents choose preferred option
Statistical analysis reveals price sensitivity per feature

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
| Per contact/record | CRM, email tools | Mailchimp, HubSpot |
| Per transaction | Payments, marketplaces | Stripe, Shopify |
| Flat fee | Simple products | Basecamp |
| Revenue share | High-value outcomes | Affiliate platforms |

### Choosing Your Value Metric

**Step 1: Identify how customers get value**
- What outcome do they care about?
- What do they measure success by?
- What would they pay more for?

**Step 2: Map usage to value**

| Usage Pattern | Value Delivered | Potential Metric |
|---------------|-----------------|------------------|
| More team members use it | More collaboration value | Per user |
| More data processed | More insights | Per record/event |
| More revenue generated | Direct ROI | Revenue share |
| More projects managed | More organization | Per project |

**Step 3: Test for alignment**

Ask: "As a customer uses more of [metric], do they get more value?"
- If yes → good value metric
- If no → price doesn't align with value

### Mapping Usage to Value: Framework

**1. Instrument usage data**
Track how customers use your product:
- Feature usage frequency
- Volume metrics (users, records, API calls)
- Outcome metrics (revenue generated, time saved)

**2. Correlate with customer success**
- Which usage patterns predict retention?
- Which usage patterns predict expansion?
- Which customers pay the most, and why?

**3. Identify value thresholds**
- At what usage level do customers "get it"?
- At what usage level do they expand?
- At what usage level should price increase?

**Example Analysis:**

```
Usage-Value Correlation Analysis:
─────────────────────────────────
Segment: High-LTV customers (>$10k ARR)
Average monthly active users: 15
Average projects: 8
Average integrations: 4

Segment: Churned customers
Average monthly active users: 3
Average projects: 2
Average integrations: 0

Insight: Value correlates with team adoption (users)
        and depth of use (integrations)

Recommendation: Price per user, gate integrations to higher tiers
```

---

## Tier Structure

### How Many Tiers?

**2 tiers:** Simple, clear choice
- Works for: Clear SMB vs. Enterprise split
- Risk: May leave money on table

**3 tiers:** Industry standard
- Good tier = Entry point
- Better tier = Recommended (anchor to best)
- Best tier = High-value customers

**4+ tiers:** More granularity
- Works for: Wide range of customer sizes
- Risk: Decision paralysis, complexity

### Good-Better-Best Framework

**Good tier (Entry):**
- Purpose: Remove barriers to entry
- Includes: Core features, limited usage
- Price: Low, accessible
- Target: Small teams, try before you buy

**Better tier (Recommended):**
- Purpose: Where most customers land
- Includes: Full features, reasonable limits
- Price: Your "anchor" price
- Target: Growing teams, serious users

**Best tier (Premium):**
- Purpose: Capture high-value customers
- Includes: Everything, advanced features, higher limits
- Price: Premium (often 2-3x "Better")
- Target: Larger teams, power users, enterprises

### Tier Differentiation Strategies

**Feature gating:**
- Basic features in all tiers
- Advanced features in higher tiers
- Works when features have clear value differences

**Usage limits:**
- Same features, different limits
- More users, storage, API calls at higher tiers
- Works when value scales with usage

**Support level:**
- Email support → Priority support → Dedicated success
- Works for products with implementation complexity

**Access and customization:**
- API access, SSO, custom branding
- Works for enterprise differentiation

### Example Tier Structure

```
┌────────────────┬─────────────────┬─────────────────┬─────────────────┐
│                │ Starter         │ Pro             │ Business        │
│                │ $29/mo          │ $79/mo          │ $199/mo         │
├────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Users          │ Up to 5         │ Up to 20        │ Unlimited       │
│ Projects       │ 10              │ Unlimited       │ Unlimited       │
│ Storage        │ 5 GB            │ 50 GB           │ 500 GB          │
│ Integrations   │ 3               │ 10              │ Unlimited       │
│ Analytics      │ Basic           │ Advanced        │ Custom          │
│ Support        │ Email           │ Priority        │ Dedicated       │
│ API Access     │ ✗               │ ✓               │ ✓               │
│ SSO            │ ✗               │ ✗               │ ✓               │
│ Audit logs     │ ✗               │ ✗               │ ✓               │
└────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

---

## Packaging for Personas

### Identifying Pricing Personas

Different customers have different:
- Willingness to pay
- Feature needs
- Buying processes
- Value perception

**Segment by:**
- Company size (solopreneur → SMB → enterprise)
- Use case (marketing vs. sales vs. support)
- Sophistication (beginner → power user)
- Industry (different budget norms)

### Persona-Based Packaging

**Step 1: Define personas**

| Persona | Size | Needs | WTP | Example |
|---------|------|-------|-----|---------|
| Freelancer | 1 person | Basic features | Low | $19/mo |
| Small Team | 2-10 | Collaboration | Medium | $49/mo |
| Growing Co | 10-50 | Scale, integrations | Higher | $149/mo |
| Enterprise | 50+ | Security, support | High | Custom |

**Step 2: Map features to personas**

| Feature | Freelancer | Small Team | Growing | Enterprise |
|---------|------------|------------|---------|------------|
| Core features | ✓ | ✓ | ✓ | ✓ |
| Collaboration | — | ✓ | ✓ | ✓ |
| Integrations | — | Limited | Full | Full |
| API access | — | — | ✓ | ✓ |
| SSO/SAML | — | — | — | ✓ |
| Audit logs | — | — | — | ✓ |
| Custom contract | — | — | — | ✓ |

**Step 3: Price to value for each persona**
- Research willingness to pay per segment
- Set prices that capture value without blocking adoption
- Consider segment-specific landing pages

---

## Freemium vs. Free Trial

### When to Use Freemium

**Freemium works when:**
- Product has viral/network effects
- Free users provide value (content, data, referrals)
- Large market where % conversion drives volume
- Low marginal cost to serve free users
- Clear feature/usage limits for upgrade trigger

**Freemium risks:**
- Free users may never convert
- Devalues product perception
- Support costs for non-paying users
- Harder to raise prices later

**Example: Slack**
- Free tier for small teams
- Message history limit creates upgrade trigger
- Free users invite others (viral growth)
- Converts when team hits limit

### When to Use Free Trial

**Free trial works when:**
- Product needs time to demonstrate value
- Onboarding/setup investment required
- B2B with buying committees
- Higher price points
- Product is "sticky" once configured

**Trial best practices:**
- 7-14 days for simple products
- 14-30 days for complex products
- Full access (not feature-limited)
- Clear countdown and reminders
- Credit card optional vs. required trade-off

**Credit card upfront:**
- Higher trial-to-paid conversion (40-50% vs. 15-25%)
- Lower trial volume
- Better qualified leads

### Hybrid Approaches

**Freemium + Trial:**
- Free tier with limited features
- Trial of premium features
- Example: Zoom (free 40-min, trial of Pro)

**Reverse trial:**
- Start with full access
- After trial, downgrade to free tier
- Example: See premium value, live with limitations until ready

---

## When to Raise Prices

### Signs It's Time

**Market signals:**
- Competitors have raised prices
- You're significantly cheaper than alternatives
- Prospects don't flinch at price
- "It's so cheap!" feedback

**Business signals:**
- Very high conversion rates (>40%)
- Very low churn (<3% monthly)
- Customers using more than they pay for
- Unit economics are strong

**Product signals:**
- You've added significant value since last pricing
- Product is more mature/stable
- New features justify higher price

### Price Increase Strategies

**1. Grandfather existing customers**
- New price for new customers only
- Existing customers keep old price
- Pro: No churn risk
- Con: Leaves money on table, creates complexity

**2. Delayed increase for existing**
- Announce increase 3-6 months out
- Give time to lock in old price (annual)
- Pro: Fair, drives annual conversions
- Con: Some churn, requires communication

**3. Increase tied to value**
- Raise price but add features
- "New Pro tier with X, Y, Z"
- Pro: Justified increase
- Con: Requires actual new value

**4. Plan restructure**
- Change plans entirely
- Existing customers mapped to nearest fit
- Pro: Clean slate
- Con: Disruptive, requires careful mapping

### Communicating Price Increases

**For new customers:**
- Just update pricing page
- No announcement needed
- Monitor conversion rate

**For existing customers:**

```
Subject: Updates to [Product] pricing

Hi [Name],

I'm writing to let you know about upcoming changes to [Product] pricing.

[Context: what you've added, why change is happening]

Starting [date], our pricing will change from [old] to [new].

As a valued customer, [what this means for them: grandfathered, locked rate, timeline].

[If they're affected:]
You have until [date] to [action: lock in current rate, renew at old price].

[If they're grandfathered:]
You'll continue at your current rate. No action needed.

We appreciate your continued support of [Product].

[Your name]
```

---

## Pricing Page Best Practices

### Above the Fold

- Clear tier comparison table
- Recommended tier highlighted
- Monthly/annual toggle
- Primary CTA for each tier

### Tier Presentation

- Lead with the recommended tier (visual emphasis)
- Show value progression clearly
- Use checkmarks and limits, not paragraphs
- Anchor to higher tier (show enterprise first or savings)

### Common Elements

- [ ] Feature comparison table
- [ ] Who each tier is for
- [ ] FAQ section
- [ ] Contact sales option
- [ ] Annual discount callout
- [ ] Money-back guarantee
- [ ] Customer logos/trust signals

### Pricing Psychology to Apply

- **Anchoring:** Show higher-priced option first
- **Decoy effect:** Middle tier should be obviously best value
- **Charm pricing:** $49 vs. $50 (for value-focused)
- **Round pricing:** $50 vs. $49 (for premium)
- **Annual savings:** Show monthly price but offer annual discount (17-20%)

---

## Price Testing

### Methods for Testing Price

**1. A/B test pricing page (risky)**
- Different visitors see different prices
- Ethical/legal concerns
- May damage trust if discovered

**2. Geographic testing**
- Test higher prices in new markets
- Different currencies/regions
- Cleaner test, limited reach

**3. New customer only**
- Raise prices for new customers
- Compare conversion rates
- Monitor cohort LTV

**4. Sales team discretion**
- Test higher quotes through sales
- Track close rates at different prices
- Works for sales-led GTM

**5. Feature-based testing**
- Test different packaging
- Add premium tier at higher price
- See adoption without changing existing

### What to Measure

- Conversion rate at each price point
- Average revenue per user (ARPU)
- Total revenue (conversion × price)
- Customer lifetime value
- Churn rate by price paid
- Price sensitivity by segment

---

## Enterprise Pricing

### When to Add Custom Pricing

Add "Contact Sales" when:
- Deal sizes exceed $10k+ ARR
- Customers need custom contracts
- Implementation/onboarding required
- Security/compliance requirements
- Procurement processes involved

### Enterprise Tier Elements

**Table stakes:**
- SSO/SAML
- Audit logs
- Admin controls
- Uptime SLA
- Security certifications

**Value-adds:**
- Dedicated support/success
- Custom onboarding
- Training sessions
- Custom integrations
- Priority roadmap input

### Enterprise Pricing Strategies

**Per-seat at scale:**
- Volume discounts for large teams
- Example: $15/user (standard) → $10/user (100+)

**Platform fee + usage:**
- Base fee for access
- Usage-based above thresholds
- Example: $500/mo base + $0.01 per API call

**Value-based contracts:**
- Price tied to customer's revenue/outcomes
- Example: % of transactions, revenue share

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

### Validation

- [ ] Tested pricing with target customers
- [ ] Reviewed pricing with sales team
- [ ] Validated unit economics work
- [ ] Planned for price increases
- [ ] Set up tracking for pricing metrics

---

## Questions to Ask

If you need more context:
1. What pricing research have you done (surveys, competitor analysis)?
2. What's your current ARPU and conversion rate?
3. What's your primary value metric (what do customers pay for value)?
4. Who are your main pricing personas (by size, use case)?
5. Are you self-serve, sales-led, or hybrid?
6. What pricing changes are you considering?

---

## Related Skills

- **page-cro**: For optimizing pricing page conversion
- **copywriting**: For pricing page copy
- **marketing-psychology**: For pricing psychology principles
- **ab-test-setup**: For testing pricing changes
- **analytics-tracking**: For tracking pricing metrics
