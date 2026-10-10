# Lead Scoring Models

Detailed scoring templates, example models by business type, and calibration guidance.

## Explicit Scoring Template (Fit)

### Company Attributes

| Attribute | Criteria | Points |
|-----------|----------|--------|
| **Company size** | 1-10 employees | +5 |
| | 11-50 employees | +10 |
| | 51-200 employees | +15 |
| | 201-1000 employees | +20 |
| | 1000+ employees | +15 (unless enterprise-focused, then +25) |
| **Industry** | Primary target industry | +20 |
| | Secondary target industry | +10 |
| | Non-target industry | 0 |
| **Revenue** | Under $1M | +5 |
| | $1M-$10M | +10 |
| | $10M-$100M | +15 |
| | $100M+ | +20 |
| **Geography** | Primary market | +10 |
| | Secondary market | +5 |
| | Non-target market | 0 |

### Contact Attributes

| Attribute | Criteria | Points |
|-----------|----------|--------|
| **Job title** | C-suite (CEO, CTO, CMO) | +25 |
| | VP level | +20 |
| | Director level | +15 |
| | Manager level | +10 |
| | Individual contributor | +5 |
| **Department** | Primary buying department | +15 |
| | Adjacent department | +5 |
| | Unrelated department | 0 |
| **Seniority** | Decision maker | +20 |
| | Influencer | +10 |
| | End user | +5 |

### Technology Attributes

| Attribute | Criteria | Points |
|-----------|----------|--------|
| **Tech stack** | Uses complementary tool | +15 |
| | Uses competitor | +10 (they understand the category) |
| | Uses tool you replace | +20 |
| **Tech maturity** | Modern stack (cloud, SaaS-forward) | +10 |
| | Legacy stack | +5 |

---

## Implicit Scoring Template (Engagement)

### High-Intent Signals

| Signal | Points | Decay |
|--------|--------|-------|
| **Demo request** | +30 | None |
| **Pricing page visit** | +20 | -5 per week |
| **Free trial signup** | +25 | None |
| **Contact sales form** | +30 | None |
| **Case study page (2+)** | +15 | -5 per 2 weeks |
| **Comparison page visit** | +15 | -5 per week |
| **ROI calculator used** | +20 | -5 per 2 weeks |

### Medium-Intent Signals

| Signal | Points | Decay |
|--------|--------|-------|
| **Webinar registration** | +10 | -5 per month |
| **Webinar attendance** | +15 | -5 per month |
| **Whitepaper download** | +10 | -5 per month |
| **Blog visit (3+ in a week)** | +10 | -5 per 2 weeks |
| **Email click** | +5 per click | -2 per month |
| **Email open (3+)** | +5 | -2 per month |
| **Social media engagement** | +5 | -2 per month |

### Low-Intent Signals

| Signal | Points | Decay |
|--------|--------|-------|
| **Single blog visit** | +2 | -2 per month |
| **Newsletter open** | +2 | -1 per month |
| **Single email open** | +1 | -1 per month |
| **Visited homepage only** | +1 | -1 per week |

### Product Usage Signals (PLG)

| Signal | Points | Decay |
|--------|--------|-------|
| **Created account** | +15 | None |
| **Completed onboarding** | +20 | None |
| **Used core feature (3+ times)** | +25 | -5 per month inactive |
| **Invited team member** | +25 | None |
| **Hit usage limit** | +20 | -10 per month |
| **Exported data** | +10 | -5 per month |
| **Connected integration** | +15 | None |
| **Daily active for 5+ days** | +20 | -10 per 2 weeks inactive |

---

## Negative Scoring Signals

| Signal | Points | Notes |
|--------|--------|-------|
| **Competitor email domain** | -50 | Auto-flag for review |
| **Student email (.edu)** | -30 | May still be valid in some cases |
| **Personal email (gmail, yahoo)** | -10 | Less relevant for B2B; adjust for SMB |
| **Unsubscribe from emails** | -20 | Reduce engagement score |
| **Bounce (hard)** | -50 | Remove from scoring |
| **Spam complaint** | -100 | Remove from all sequences |
| **Job title: Student/Intern** | -25 | Low buying authority |
| **Job title: Consultant** | -10 | May be evaluating for client |
| **No website visit in 90 days** | -15 | Score decay |
| **Invalid phone number** | -10 | Data quality signal |
| **Careers page visitor only** | -30 | Likely a job seeker |

---

## Example Scoring Models

### Model 1: PLG SaaS (ACV $500-$5K)

**Weight: 30% fit / 70% engagement (heavily favor product usage)**

**Fit criteria:**
- Company size 10-500: +15
- Target industry: +10
- Manager+ role: +10
- Uses complementary tool: +10

**Engagement criteria:**
- Created free account: +15
- Completed onboarding: +20
- Used core feature 3+ times: +25
- Invited team member: +25
- Hit usage limit: +20
- Pricing page visit: +15

**Negative:**
- Personal email: -10
- No login in 14 days: -15
- Competitor domain: -50

**MQL threshold: 60 points**
**Recalibration: Monthly** (fast feedback loop with high volume)

---

### Model 2: Enterprise Sales-Led (ACV $50K+)

**Weight: 60% fit / 40% engagement (fit is critical at this ACV)**

**Fit criteria:**
- Company size 500+: +20
- Revenue $50M+: +15
- Target industry: +15
- VP+ title: +20
- Decision maker confirmed: +15
- Uses competitor: +10

**Engagement criteria:**
- Demo request: +30
- Multiple stakeholders engaged: +20
- Attended executive webinar: +15
- Downloaded ROI guide: +10
- Visited pricing page 2+: +15

**Negative:**
- Company too small (<100): -30
- Individual contributor only: -15
- Competitor domain: -50

**MQL threshold: 75 points**
**Recalibration: Quarterly** (longer sales cycles, smaller sample size)

---

### Model 3: Mid-Market Hybrid (ACV $5K-$25K)

**Weight: 50% fit / 50% engagement (balanced approach)**

**Fit criteria:**
- Company size 50-1000: +15
- Target industry: +10
- Manager-VP title: +15
- Target geography: +10
- Uses complementary tool: +10

**Engagement criteria:**
- Demo request or trial signup: +25
- Pricing page visit: +15
- Case study download: +10
- Webinar attendance: +10
- Email engagement (3+ clicks): +10
- Blog visits (5+ pages): +10

**Negative:**
- Personal email: -10
- No engagement in 30 days: -10
- Competitor domain: -50
- Student/intern title: -25

**MQL threshold: 65 points**
**Recalibration: Quarterly**

---

## Threshold Calibration

### Setting the Initial Threshold

1. **Define the decision and outcome first.** For example, score an eligible lead at its first qualification review and predict a win within the next 90 days. Use a horizon appropriate to your sales cycle. Select the full eligible lead cohort, including leads never promoted to MQL; retain won and lost outcomes, and keep unresolved leads separate until their observation window matures.
2. **Reconstruct features as of that decision time.** Use only attributes and events available then, including the time the CRM actually received them. Current CRM values and a lead's lifetime activity are not historical snapshots. Exclude later stage changes, close status, onboarding, and teammate invitations when they occurred after the scoring cutoff. Product events before the cutoff remain valid PLG signals. If history is missing, collect snapshots prospectively and label the retrospective evaluation incomplete.
3. **Split before tuning.** Use earlier cohorts to develop weights and choose a threshold, and reserve a later, fully observed cohort as an untouched holdout. Development outcome labels must have matured and been available before the first holdout qualification decision; exclude or delay cohorts whose outcome windows cross that training cutoff. Keep related contacts/deals from the same account from leaking across partitions. Freeze feature rules, weights, and threshold before evaluating the holdout; never tune them on its outcomes. See [data-leakage guidance](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage) and [time-ordered validation](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html).
4. **Choose a threshold using costs and sales capacity.** On development data, compare precision (wins among flagged leads), recall (flagged wins among all wins), false positives, missed wins, and workload with the current routing rule. Capturing 80% of wins alone does not establish a useful threshold: it says nothing about how many non-winners sales must work.
5. **Evaluate the frozen rule on the holdout.** Report cohort dates, cutoff and outcome horizon, eligible and resolved counts, precision/recall, false-positive/negative counts, and expected review cost or contribution under labeled assumptions. Compare the same population with the existing rule. Small or incomplete cohorts are inconclusive; a retrospective score is not proof of incremental revenue. Pilot with monitoring and a rollback before broad promotion.

**Leakage example (illustrative):** a lead has 20 points at qualification, then earns 20 for onboarding and 25 for inviting a teammate after becoming a customer. Scoring today's record yields 65 and seems to clear a 60-point threshold. The historical qualification score was 20; the later 45 points cannot be used to claim the rule would have identified that win.

[HubSpot's scoring documentation](https://knowledge.hubspot.com/scoring/understand-the-lead-scoring-tool) describes scoring current record properties and events with time-frame filters. Those product capabilities do not by themselves reconstruct what was known at a past qualification decision.

### Calibration Cadence

| Business Type | Recalibration Frequency | Why |
|---------------|------------------------|-----|
| PLG / High volume | Monthly | Fast feedback loop, lots of data |
| Mid-market | Quarterly | Moderate cycle length |
| Enterprise | Quarterly to semi-annually | Long cycles, small sample size |

### Calibration Steps

1. **Rebuild the eligible cohort with decision-time snapshots** and mature outcomes, including leads below the threshold; MQL-only data cannot measure missed wins among excluded leads.
2. **Compare the frozen model with actual outcomes and the current routing baseline** on the same population. Report precision, recall, false positives/negatives, and sales workload with sample sizes.
3. **Propose weight and threshold changes on development data only.** Separate market drift from missing history, changed definitions, and delayed outcome labels.
4. **Validate the candidate on a new later holdout** before promotion. A holdout used to choose a change becomes development data; retain another untouched cohort for the next decision.
5. **Version the model and preserve the decision record:** feature cutoff rules, cohort dates, weights, threshold, results, owner, and rollback. Communicate changes to sales and monitor the pilot.

### Warning Signs Your Model Needs Recalibration

- MQL-to-SQL acceptance rate drops below 30%
- Sales consistently rejects MQLs as "not ready"
- High-scoring leads don't convert; low-scoring leads do
- MQL volume spikes without corresponding revenue
- New product/market changes since last calibration
