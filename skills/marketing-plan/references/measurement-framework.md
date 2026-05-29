# Measurement Framework — KPIs, North Stars, Cadence

Every plan needs a measurement section that tells the team how to know if the plan is working. This doc is the source for Section 13's measurement subsection.

## The north-star principle

A north star is one metric that captures the business-model thesis at the highest level. It should:
- Be derivable from the funnel + revenue model
- Move slowly enough to be a strategic compass (not whipsawed by weekly noise)
- Trade off correctly against other metrics — improving the north star should generally improve the business

Don't default to "ARR" or "MRR" alone. Those are outcomes, not norths. Pick something that captures the business model.

## North-star patterns by business model

### B2B SaaS (subscription)
- **Net Revenue Retention (NRR)** — keeps existing customers + expansion in focus
- Alternative: "Logo retention × expansion ARR"
- Why: ARR alone hides churn / lets gross-add growth mask product fit problems

### D2C consumer app (subscription)
- **Blended LTV / blended CAC** — keeps unit economics honest as paid layer scales
- Alternative: "Day-35 paid users from cohort × LTV"
- Why: monthly subscription metrics are volatile; cohort × LTV smooths it

### Hybrid hardware + software (e.g., Quietude)
- **Blended LTV / blended CAC across hardware + software** — captures the wedge thesis
- Alternative: "Hardware-buyers-to-subscriber conversion × blended margin"
- Why: hardware revenue isn't free (cost to make); subscription revenue isn't expensive to acquire if hardware funds it

### Marketplace (two-sided)
- **Liquidity ratio × take-rate** — captures both sides + monetization
- Alternative: "Monthly transacting users × take-rate × repeat frequency"
- Why: GMV alone doesn't capture whether the marketplace is becoming a habit

### Developer tool / open source
- **Weekly active developers × paid-conversion** — captures both adoption and monetization
- Alternative: "Weekly active orgs × seats per org × ARPU"

### Content / media business
- **Daily active readers / listeners × ad revenue per session** — captures both reach and monetization
- Alternative: "Subscriber count × retention × ARPU"

### Commerce (DTC, non-subscription)
- **Repeat purchase rate × AOV × frequency** — captures monetization layered on quality of customer
- Alternative: "Customer LTV / CAC × payback period"

## Leading indicators by AARRR stage

After the north star, every plan needs leading indicators per AARRR stage. These move faster than the north star and trigger investigations.

### Acquisition leading indicators
- Organic visits/month, total + per pillar (SEO health)
- App Store / Play Store visit-to-install rate (ASO health)
- Founder-led social channel growth → email subscriber conversion (LinkedIn / X / Substack funnels)
- Event-to-app conversion rate (event ROI)
- Ambassador-attributed visits (referral funnel)
- Paid CAC by channel (when paid is firing)

### Activation leading indicators
- Day 1 / Day 7 / Day 35 → paid conversion rate
- Onboarding session-completion rate
- First key-action completion (post-signup activation event)
- App Store conversion rate (install → trial → paid)
- Trial → paid conversion rate

### Retention leading indicators
- Day 30 / Day 60 / Day 90 retention
- Monthly churn rate (gross + net)
- Lifecycle email engagement (open / click / unsubscribe by flow)
- Hardware → app activation rate (for hybrid businesses)
- Win-back / reactivation rate

### Referral leading indicators
- Ambassador-attributed new subs (via Dub or similar)
- Share-after-value moment rate (% of users sharing)
- Two-sided referral completion rate
- Guides program referrals (when live)
- NPS score (if surveyed)

### Revenue leading indicators
- ARPU by cohort
- Annual plan adoption %
- Cohort LTV by source
- Plan mix shifts
- Eye-mask / hardware attach rate (for hybrid)
- Expansion revenue (B2B)

## Review cadence

The plan should specify three rhythms:

### Weekly (operational sync)
- **Who:** fCMO ↔ founder (CEO usually)
- **Duration:** 30 min
- **Format:** AARRR scoreboard (current vs. last week numbers across the leading indicators) + this week's ships + blockers
- **Output:** Action items, decisions made

### Monthly (metrics review)
- **Who:** fCMO + founder + extended team (CXO, product lead, designer if applicable)
- **Duration:** 60–90 min
- **Format:** Full metrics review + comparison against quarterly KPI targets + qualitative learnings + idea bank reprioritization
- **Output:** Possible plan adjustments, hire decisions

### Quarterly (plan recalibration)
- **Who:** fCMO + founders + key advisors
- **Duration:** 2–3 hours
- **Format:** Full plan review against 90-day and 12-month outcomes, channel-level analysis, funding-stage transition check, recalibration of next 90 days
- **Output:** Updated plan (could be v2 / v3 document iteration)

## KPI target setting

For each quarter in Section 10, the plan must include 3–5 specific KPI targets. These should be:
- **Specific** — not "improve retention," but "Day 30 retention from 22% → 30%"
- **Measurable** — pull from a wired data source
- **Stretch but plausible** — based on funnel state + historical patterns
- **Decision-triggering** — if missed, what does that mean? (Adjust strategy, kill a channel, etc.)

### KPI target patterns by quarter

**Q1 (foundation quarter):**
- Mostly *bedrock* metrics — fixing leaks. "Headphones-gate conversion drop reverses." "Day 1 → paid +25–50%."
- Some *foundation* metrics — laying tracks. "4 SEO pillars staked." "App Store rewrite shipped."
- Avoid bold growth targets — the foundations aren't in yet

**Q2 (validation quarter):**
- Mostly *validation* metrics — does what we built work? "Paid CAC < $X blended." "Organic traffic 1,500–3,500/mo."
- Some *cohort* metrics — do new cohorts behave better? "Day 7 retention for Q2 cohort vs. Q1."

**Q3 (scaling quarter):**
- Mostly *scaling* metrics — how far does it go? "Paid scaling to $20–30K/mo with CAC steady." "First B2B install reference case live."
- Some *capability* metrics — what new things are live? "First Guides pilot launched."

**Q4 (compound quarter):**
- Mostly *compound* metrics — is the flywheel turning? "50%+ of new subs from non-paid channels." "Ambassador-driven 15–25% of new subs."
- Some *narrative* metrics — does the Series A story write itself? "Blended LTV/CAC > 3."

## Kill criteria

For every channel or initiative, the plan should specify when to stop. Often missing from plans, kill criteria force discipline.

Examples:
- "If a paid channel has CAC > 2× target after 30 days at meaningful spend, pause."
- "If onboarding Variant 3 doesn't show statistically meaningful lift (or directional lift + congruent qualitative signal) after 4 weeks, move to Variant 1."
- "If lifecycle Flow 4 has open rate < 12% after 6 weeks, redo subject lines + audience segmentation."

## Guardrail metrics

Some metrics get a hard guardrail (cannot drop below threshold). Useful for protecting brand or unit economics during aggressive growth.

Examples:
- "Brand voice complaint rate > 1% of customer feedback triggers content review."
- "Paid CAC > $X for two consecutive months pauses paid scaling pending audit."
- "App Store rating drops below 4.5 triggers product review."

## Data sources mapping

The plan should name where each metric comes from. This makes it auditable.

| Metric | Source |
|---|---|
| Organic traffic | GA4 / Ahrefs |
| App Store conversion | App Store Connect |
| Funnel conversion (Day N → paid) | Internal analytics (Mixpanel / Amplitude) or App Store Connect cohort export |
| Retention | Customer.io segments + product analytics |
| MRR / ARR | Stripe (via MCP if wired) |
| Plan mix | Stripe |
| Lifecycle email metrics | Customer.io |
| Ambassador attribution | Dub.co |
| Hardware → app activation | Shopify + App Store + internal join |
| NPS | Survey tool (Customer.io / Typeform / SurveyMonkey) |

## When data isn't wired

If a metric can't currently be measured, flag it in Section 13's open decisions. Example:

> "Hardware → app activation rate not currently visible in the App Store dashboard. Requires Shopify ↔ App Store Connect join. Q1 work item."

A plan with un-measurable goals is a plan that can't be validated. Surface the instrumentation work explicitly.

## Reporting cadence + automation

Where possible, auto-generate the metrics review rather than building it manually each time. Stripe MCP + GA4 MCP + Customer.io MCP can pull most of what's needed.

For Tier 1 clients, a simple weekly metrics email to the team (Markdown table, generated via skills + MCPs) costs nothing and creates discipline.

For Tier 2+ clients, consider a real dashboard (Hex, Metabase, Looker, or internal tool).
