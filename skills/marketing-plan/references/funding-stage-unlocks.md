# Funding-Stage Capability Unlocks

Every marketing plan must include explicit "what changes when funding closes / when budget unlocks" reasoning. This makes the plan investor-friendly and operationally honest.

This doc defines the standard tiers. Use them as anchors, adjust for client category and unit economics.

## Why funding stage matters in a marketing plan

Most marketing plans are written as if budget is unconstrained. That's a failure mode for early-stage clients — it produces aspirational lists rather than executable roadmaps.

The fix: tie every recommendation to a budget tier. The plan stays honest about what's executable today, and the team / investors see explicitly what each round of capital unlocks.

This also helps the founder mid-raise: showing what the round buys is investor-narrative material.

## Standard tiers

### Tier 1 — Pre-seed / bootstrapped

**Budget profile:**
- Paid acquisition: $0
- Tooling stack: ~$500–2,000/mo (Customer.io / similar, GA4 free, Stripe fees, Notion, GitHub, basic SaaS)
- Retainers / fCMO: variable (fractional only)
- Headcount: founders + maybe 1–2 multipurpose hires

**Marketing capability:**
- Organic only — SEO, content, App Store organic, founder-led social, events, WOM, ambassador (if inbound exists)
- Limited PR (founder-led pitches, HARO responses)
- No paid layer

**Channels live:** Organic SEO, content, App Store, LinkedIn / X / founder-led social, events, WOM, ambassador

**What a fCMO does:** Strategy + lifecycle + content + SEO + onboarding + community + ambassador. Hands-on with skill library + MCPs doing the operational lift.

**Hires unlocked:** None. The plan must execute with current team + agentic stack.

### Tier 2 — Seed close

**Budget profile:**
- Paid acquisition: $5–15K/mo test budget
- Tooling stack: $1,000–3,000/mo (paid ad accounts, Mixpanel / Amplitude if needed, additional SaaS)
- Retainers / fCMO: continued
- Headcount: + first dedicated marketing hire

**Marketing capability:**
- Above + paid acquisition pilot (Apple Search Ads, Meta, LinkedIn)
- Begin PR push with the funding announcement
- First Product Hunt / GA-style launch

**Channels live:** All Tier 1 + paid acquisition (small) + active PR

**Hires unlocked:**
- Lifecycle + content marketing manager (one person doing both, or split)
- OR dedicated growth / performance marketing manager (if heavy paid focus)

**fCMO shifts:** From hands-on to strategy + ops oversight. Hires the dedicated marketer. Sets up the channel playbooks before paid scales.

### Tier 3 — Seed deployment

**Budget profile:**
- Paid acquisition: $20–50K/mo
- Tooling stack: $2,000–5,000/mo
- Retainers / fCMO: continued
- Headcount: + designer (potentially fractional)

**Marketing capability:**
- Paid scaling across 2–3 channels
- Brand-aligned creative production (designer enables velocity)
- Lifecycle programs fully live across all flows
- First true content production cadence (weekly cadence sustainable)

**Channels live:** All previous + paid scaling + structured launch motion

**Hires unlocked:**
- Designer (brand, creative, web)
- Second marketing manager (if first was lifecycle, second is content; or vice versa)
- Potentially fractional PR if budget allows

**fCMO shifts:** Hands off lifecycle to dedicated owner. Moves to GTM strategy + channel mix optimization + growth analytics.

### Tier 4 — Series A

**Budget profile:**
- Paid acquisition: $50–150K/mo
- Tooling stack: $5,000–10,000/mo
- Retainers / fCMO: may transition to permanent CMO
- Headcount: full marketing team forming

**Marketing capability:**
- Paid scales aggressively across all proven channels
- Brand campaigns become possible
- International consideration begins
- B2B vertical expansion (if applicable)
- Sophisticated CAC/LTV math + attribution

**Channels live:** Full marketing surface area

**Hires unlocked:**
- Performance marketing lead
- Content lead
- Designer (permanent)
- Potentially: PR firm, paid agency, international growth manager
- Series A often the moment the fCMO transitions out or transitions to advisor

**fCMO shifts:** Often the moment of transition — to permanent CMO hire, fCMO becomes advisor.

### Tier 5 — Series B+

**Budget profile:**
- Paid acquisition: $150K+/mo
- Tooling stack: $10,000–25,000/mo
- Headcount: 10+ marketing org

**Marketing capability:**
- Brand campaigns at industry scale
- PR firm partnerships
- Acquisitions as marketing (acquiring newsletters / podcasts in space)
- Conference sponsorship at category level
- Sponsorships at brand level

**Channels live:** Everything available

**Hires unlocked:**
- VP Marketing or CMO
- Brand director
- Growth / performance team (3–5 people)
- Content team (3–5 people)
- Designers (2–3)
- PR director or agency partnership
- International marketing leads (region-specific)

**fCMO involvement:** Typically out of the company by this point — the original fCMO might still be an advisor.

## How to apply tier logic in a plan

### Section 3 (Current state)
- State the client's current tier explicitly: "Current tier: pre-seed / bootstrapped per Tier 1."

### Section 4–8 (AARRR sections)
- Note tier-dependent moves: "Paid layer (Tier 2 unlock — held until seed close)"
- For Tier 1 plans: every move must be executable at current budget tier OR explicitly flagged as future
- For Tier 2+ plans: moves can assume the tier's capability

### Section 10 (12-month outlook)
- Each quarter names the tier that's active: "Q2 — Months 4–6 (post seed close). Funding state: Tier 2."
- Tier transitions trigger plan recalibration moments

### Section 11 (Marketing operations stack)
- Use the table in `references/ops-stack-mapping.md` capability-unlocks section
- Make it client-specific: "Today (Tier 1): {client's current capability}. After seed close (Tier 2): + {what changes}."

## Adjustments by client category

The standard tiers assume a typical software / SaaS / consumer app. Adjust for category:

### Consumer apps (D2C)
- Higher paid acquisition floor — apps need to test CAC against download cost benchmarks (~$2-10 install + 5-15% trial conversion benchmark)
- Tier 2 starts effectively at $10–20K/mo paid (otherwise can't get statistically meaningful reads at app-install CPMs)

### B2B SaaS
- Lower paid acquisition floor — LinkedIn / Google Ads can produce signal at $3–5K/mo
- More weight on content + sales enablement budget
- Often add a sales hire before a content hire

### Hybrid hardware + software
- Hardware revenue can self-fund some marketing (the eye-mask wedge pattern)
- Paid budget should track blended CAC across hardware sales + app subs
- Shopify-side optimization is a Tier 1 priority (cheap leverage)

### Deep-tech / scientific / clinical
- PR + investor marketing carries more weight than paid
- Conference speaking + academic publishing > Meta ads
- Tier 1 can produce significant traction without paid

### Marketplace / two-sided
- Each side has its own AARRR funnel — budget splits accordingly
- Supply-side acquisition often dominates early; demand-side dominates after liquidity

### Open source / developer tools
- DevRel + community + content > paid
- GitHub stars / npm installs are the activation event
- Paid layer often delayed until Series A

## Tier 1 budget detail (most common starting point)

For Tier 1 clients, the marketing budget breakdown typically looks like:

| Line | Typical monthly |
|---|---|
| Customer.io / lifecycle ESP | $100–500 |
| App Store Connect / Google Play | $25 + 30% rev share (Apple/Google take) |
| Stripe | 2.9% + 30¢ per transaction |
| GA4 | Free |
| Notion | $0–100 |
| GitHub | $0–50 |
| Shopify (if hardware) | $39–100 |
| Ahrefs (or similar SEO tool) | $129–399 |
| Typefully (if social cadence) | $13–39 |
| Dub.co (if ambassador tracking) | $0–39 |
| Misc SaaS | $200–500 |
| **Tooling total** | **~$500–1,700/mo** |
| Paid acquisition | $0 |
| fCMO retainer | Variable |

For the plan, this becomes: "Current monthly marketing budget: $X (tooling only, no paid)."

## When to surface tier limits to the founder

If a founder asks for moves that require a future tier:
- Name the requirement: "This is a Tier 2 move (requires $10K+/mo paid budget). Will unlock after seed close per the 12-month outlook in §10."
- Don't refuse — frame the timing

If a founder underestimates what's needed:
- Be honest: "To scale paid acquisition meaningfully, expect Tier 2 budget. Tier 1 can validate organic; Tier 2 validates paid."

If a founder is over-funded for their stage:
- Don't pad budget to match. Recommend the right work for the funnel state, return excess capacity, suggest investment in compounding rather than scaling.

## Tier-skip cases (worth flagging)

Some companies skip tiers:
- **Notable founder** raising larger-than-typical rounds — can jump from Tier 1 to Tier 3 directly
- **Hardware company** with PR moment — can deploy at Tier 3 levels with the right product moment (e.g., a high-profile longevity-influencer endorsement)
- **B2B SaaS post-LOI** with named enterprise contracts — can fund pilot deployment from contract value

If the client is in a tier-skip situation, name it explicitly in the plan rather than forcing them into the standard ladder.
