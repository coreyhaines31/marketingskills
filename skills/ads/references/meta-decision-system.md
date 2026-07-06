# Meta Decision System (B2B)

A quantified kill/keep/scale engine for Meta ads. Every threshold derives from one anchor number, so decisions become arithmetic instead of vibes. Pairs with the strategy-level Meta playbook in SKILL.md (creative-as-targeting, creative volume) — this file is the *operating* layer.

## Contents

- TCPL: the anchor variable
- The ad-count ceiling
- Two-campaign structure (Scaling / Testing)
- Stage 1: delivery check (day 7)
- Stage 2: quality evaluation (weekly)
- Graduation criteria
- Fatigue detection
- Swap rules
- Creative production math
- Scaling protocol
- Weekly cadence
- Lead forms and social amnesia
- Advantage+ transition
- Benchmarks and seasonality

## TCPL: the anchor variable

TCPL = **Target Cost Per Qualified Lead** (qualified = meets your ICP bar, not just a form-fill). Set it one of three ways:

1. **From deal math (best):** TCPL = target cost per demo × qualified-lead-to-demo rate. ($2,000/demo × 0.28 = $560.)
2. **From history:** TCPL = trailing 30-day CPL(qualified) × 0.80 — a 20% improvement is achievable through operational cleanup alone (killing zero-QL ads, graduating winners). Once you have both, use whichever is tighter.
3. **New account:** target CAC × qualified-lead-to-customer rate, or a placeholder from your ACV tier; replace with method 2 after 30 days.

Every rule below is expressed in multiples of TCPL. Review TCPL monthly.

## The ad-count ceiling

More active ads than your budget can feed = every ad starves and nothing gets a fair read.

**Ceiling = (daily budget × 14) / (2 × TCPL)** — i.e., over a 14-day evaluation window, each ad needs at least 2× TCPL of spend to be judged.

$1,000/day at $500 TCPL → ceiling of 14 ads; run **6–10** (winners + 2–3 test slots). At the ceiling, launching a new test requires killing something first.

## Two-campaign structure (Scaling / Testing)

Run two CBO campaigns over the **same audience**:

- **Scaling campaign (~80% of budget)** — holds only graduated, proven ads.
- **Testing campaign (~20%)** — holds new concepts and iterations, with its own protected budget.

Why: inside a single CBO, proven ads always starve new ads — tests never get enough spend to be judged. Why not ABO for testing: equal forced distribution keeps spending on ads Meta has already deprioritized. The separation is *budget protection*, not audience segmentation.

**Image-first validation:** launch new concepts as statics first; only produce the video/carousel/UGC version after the image passes the checks below. Exception: concepts that are inherently video (testimonial, demo, UGC).

## Stage 1: delivery check (day 7)

CBO's spend allocation is itself a signal — Meta pre-screens your ads. At day 7 for each test ad:

- **Fair share test:** minimum expected spend = (campaign daily budget ÷ active ads) × 7 × 0.5. Below that → **kill** (Meta actively deprioritized it). Zero spend → kill immediately.
- **Ongoing:** if an ad has spent ≥ 1× TCPL lifetime AND averaged under ~$10/day over the last 7 days → kill. (The lifetime-spend gate stops you from killing ads CBO simply hasn't explored yet.)

When iterating on a delivery-killed ad, change the **hook/visual/format only** — the audience never got far enough for copy or CTA to matter.

## Stage 2: quality evaluation (weekly, rolling 14-day data)

Run in order; stop at the first triggered action:

1. **Data gate:** spend < 3× TCPL → **wait** (not enough signal). At true cost-per-QL = target, 3× TCPL of spend should produce ~3 qualified leads; zero QLs at that spend is ~5% probability — so judging at 3× gives ~95% confidence without wasting budget (2× has a 13% false-negative rate; 5× overpays for certainty).
2. **Zero pixel leads** at ≥3× TCPL → **swap and abandon the concept** (don't iterate a dead concept).
3. **Quality check** (the layer Meta can't see — requires your CRM):
   - Pixel leads but zero qualified → swap; keep the format, change the angle.
   - Qualified rate <40% → swap; the ad attracts the wrong people. Add ICP-filtering language. (At 40% QL rate, true cost per QL is 2.5× the pixel CPL you see in Ads Manager — two ads identical in-platform can differ 60%+ in real cost.)
   - 40–60% → monitor one more week. ≥60% → proceed.
4. **Cost check:** cost per QL ≤ TCPL → candidate winner. 1–1.5× TCPL → monitor (normal variance). >1.5× TCPL → swap (structural underperformance, not noise).

## Graduation criteria (Testing → Scaling)

Graduate only when **all** are true: ≥5 qualified leads · qualified rate ≥60% · cost per QL ≤ TCPL · running ≥14 days · ≥1 QL in the last 7 days.

## Fatigue detection

Frequency bands by campaign type (safe / warning / critical):

| Campaign type | Safe | Warning | Critical |
|---|---|---|---|
| Cold prospecting | 1.0–2.5 | 2.5–4.0 | >4.0 |
| Retargeting | 2.0–4.0 | 4.0–6.0 | >6.0 |
| ABM (small audiences) | 2.0–5.0 | 5.0–8.0 | >8.0 |

Other signals, in urgency order: CTR down 20%+ from baseline over 7 days; CPM up 30%+ over 2 weeks (leading indicator — moves before CTR); ad relevance rankings "below average"; CPA up with stable targeting.

For **scaling-campaign ads**, apply a deliberately stricter bar than the general bands — these ads carry ~80% of spend, so fatigue there costs the most: warning at frequency 3.0–3.5 or cost +20% → start 2 iterations now (they take ~14 days to be ready); swap at >3.5, cost +40%, or >1.5× TCPL for 2 weeks.

**Lifespan expectations (B2B):** statics 14–28 days; short video and carousels 21–35; UGC/testimonial 28–42. Small B2B audiences build frequency fast — plan refresh every 14–21 days.

**Retire (don't iterate)** when CTR drops 30%+ from peak or frequency crosses the campaign type's critical band above — the concept is exhausted, not the execution.

**Rotation without resetting learning:** never edit creative inside a performing ad — that resets the learning phase. Launch new ads alongside existing ones, or spin up a new ad set with the same targeting. Pausing doesn't reset; editing does.

## Swap rules

**Never pause without a replacement.** Keep 2–3 iterations staged; replacement live within 7 days, immediately for critical fatigue. If the pipeline is empty, redirect the budget to proven ads rather than leaving a zombie running. What to change depends on why it died: delivery kill → hook/visual; quality kill → angle and ICP language; cost kill → offer and audience; fatigue → fresh execution of the same proven concept.

## Creative production math

- **Test throughput** ≈ (monthly budget × 0.20) ÷ (3 × TCPL), per month. Delivery kills free budget early, so actual throughput runs ~1.5–2× the base rate.
- **Win rates:** iterations on winners ~25%; brand-new concepts ~10%; blended ~1 in 6. To get N winners, plan ~6× N tests.
- **Minimum proven-ad inventory** ≈ monthly budget ÷ $5,000 — each proven B2B ad absorbs roughly $5K/month before fatiguing. **You cannot scale budget ahead of creative supply**; if proven ads < minimum, fix the creative deficit before raising budget.
- **Iteration priority** when refreshing a winner (ranked by impact): 1. hook (changes who stops) → 2. visual treatment → 3. format → 4. body copy/CTA.

## Scaling protocol

Scale only when all: proven-ad count meets the next budget level's minimum; account frequency <3.0; cost per QL ≤ TCPL for 2+ consecutive weeks; 3+ replacements staged.

- **Rate:** +20% every 5 days. Never +30% or more in one move — that resets learning.
- **Rollback trigger:** cost per QL >1.5× TCPL after a scale step → cut budget 20–30% immediately, stabilize 2 weeks, resume at +10% per week.
- **Hitting the wall** (account-wide average frequency >3.5 — an account-level *scale* guardrail, distinct from the per-ad fatigue bands above): expand lookalikes 1% → 2–3%, add new seed audiences, test broad, activate cross-channel UTM audiences (see [ABM playbook](abm-playbook.md)), re-open remarketing.

## Weekly cadence

- **Monday — decision day:** pull rolling 14-day data; run Stage 2 on every test ad; run the fatigue check on every scaling ad.
- **Wednesday — launch day:** launch new tests into freed slots; run Stage 1 on ads that hit day 7.
- **Friday — scaling day:** apply scale steps or rollbacks.
- **Monthly:** creative library audit + TCPL review.

## Lead forms and social amnesia

The #1 B2B Meta lead-quality problem: frictionless auto-filled forms produce leads who don't remember converting ("social amnesia"). **Intentional friction = awareness = quality:**

- Use **Higher Intent** form type (adds a review step), not More Volume.
- **Require work email** — it can't auto-fill from the Facebook profile, forcing a conscious act. This is the single biggest quality lever.
- Add 1–3 multiple-choice qualification questions (4+ spikes abandonment), ordered easiest → hardest.
- Confirmation message sets expectations for what happens next (combats amnesia at the follow-up stage).

Lead form vs. landing page: LP converting ≥5% → use the LP; LP under ~2% → lead form; demo/trial offers → LP; content/webinar → form.

## Advantage+ transition

Manual is where you learn; Advantage+ is where you earn. Transition a campaign to Advantage+ only after: a proven offer, a validated audience, and **~50 conversions/week** on the optimization event (the learning-phase exit bar — budget needed ≈ target CPA × 50 ÷ 7 per day). If you can't hit 50/week on the target event, optimize a higher-volume event up-funnel and retarget converters. Advantage+ conflicts with strict ABM (you can't lock it to a list) — see the [ABM playbook](abm-playbook.md). Watch Campaign Score directionally (70+ healthy, <50 = fighting the algorithm) but never trade lead quality for score.

## Benchmarks and seasonality

B2B SaaS Meta ranges (practitioner-reported; recalibrate on your own first 30 days): CTR 1.0–1.5% (red flag <0.8%); CPM $10–20 (red flag >$25); CPL (form) $20–50 (red flag >$75); landing page CVR 8–12%. Seasonality: Q1 CPMs are the year's lowest (scale aggressively); Q4 runs +60–80% (consider reducing B2B spend and banking budget for January).

---

*Framework lineage: this decision system is adapted (re-expressed, reconciled, and restructured) from practitioner operating systems, notably Ivan Falco's ads-skills. All thresholds are starting points — recalibrate against your own account.*
