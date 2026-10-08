# Budget Planning — Scientific Methods for Setting the Marketing Budget

The problem with most SaaS marketing budgets is that they're pulled out of thin air — a number that hopefully doesn't constrain growth too much, but doesn't anchor in customer-acquisition economics either. The result: when someone asks "why this number?" there's no answer.

Two scientific methods solve this. Use one (not both) in Section 8 (Revenue) and Section 10 (12-month outlook) of every plan.

Excerpted and adapted from *Founding Marketing* by Corey Haines.

## Method 1 — Revenue-Based (5–40% of annual revenue)

**Direction:** budget → revenue goal.

You start with what the company can comfortably spend on marketing, then forecast what revenue that spend can plausibly generate.

### The ranges

| Posture | % of ARR | When to use |
|---|---|---|
| **Conservative (profit-preserving)** | 5% | Established business focused on profit distribution; bootstrapped; founder-paid customer base |
| **Standard growth** | 15–25% | Most healthy SaaS in the seed-to-Series-A range |
| **Aggressive growth (deploying raised capital)** | up to 40% | Recently funded round, mandate to deploy fast, board accepts burn |

For reference: public SaaS companies routinely report sales-and-marketing spend between 20% and 55% of revenue (Zoom historically ran between 20% and 55% across years).

### The math (Conservative example)

Business at $1M ARR, 5% allocation:

- Annual marketing budget: **$50,000**
- Blended CAC: $100 → can acquire **500 new customers**
- ARPC: $50/mo → adds **$300K** to ARR
- Assume 85% revenue retention for both the starting base and new acquisitions, with no expansion/reactivation. This is an illustrative assumption, not a measured forecast.
- Retained starting ARR: 85% × $1M = **$850K**
- Retained new-customer ARR: 85% × $300K = **$255K**
- Net change: $255K − $150K lost from the starting base = **+$105K ARR**
- End-of-year goal under these assumptions: **$1.105M ARR**

### The math (Aggressive example)

Business at $1M ARR, 40% allocation:

- Annual marketing budget: **$400,000**
- Blended CAC: $100 → can acquire **4,000 new customers**
- ARPC: $50/mo → adds **$2.4M** to ARR
- With the same illustrative 85% revenue-retention assumptions: $850K retained starting ARR + $2.04M retained new-customer ARR = **$2.89M year-end ARR**. The $3.4M figure would require no revenue loss in either cohort.

### Two keys to making this method work

1. **Know your blended CAC** (see "Calculating CAC" below)
2. **Match the allocation percentage to your actual ambition.** A founder running 5% allocation while telling the board they expect to triple revenue is showing two incompatible signals.

## Method 2 — Goal-Based (reverse-engineered from the revenue target)

**Direction:** revenue goal → budget.

You start with the revenue goal and work backward through the unit economics to derive the budget required to hit it. Best for:

- Companies just starting up (no historical CAC baseline yet, working from first principles)
- Companies anticipating outside capital (need to defend the ask)
- Companies using revenue-based financing (Pipe, Capchase, Founderpath)

### The formula

```
Required retained new-customer ARR = max(0, Target ending ARR − Retained starting-base ARR)
Retained starting-base ARR = Starting ARR × Existing-base net revenue retention
New customers = ceil(Required retained new-customer ARR / (ARPC × 12 × New-cohort retention))
Acquisition budget = New customers × CAC
```

Use revenue retention to bridge ARR, not logo retention unless equal customer values are explicitly assumed. Existing-base net revenue retention can include expansion/contraction; do not add them again. New-cohort retention must reflect acquisition timing and remaining exposure before year end, not automatically a full-year rate. If the retained base already meets the target, no additional acquisitions are required by this formula. [MRR/ARR movement definitions](https://help.chartmogul.com/article/158-chart-mrr-movements) separate new business from expansion, contraction and churn.

### Worked example: $1M ARR → $2M ARR

Assume $50 monthly ARPC, $100 CAC, 85% revenue retention on the existing base, and an illustrative 85% retention on new acquisitions. No expansion/reactivation is assumed.

Step 1 — Retain the starting base
$1,000,000 × 0.85 = **$850,000 retained starting ARR**

Step 2 — Required retained new-customer ARR
$2,000,000 − $850,000 = **$1,150,000** — acquisitions must replace the $150K lost from the base as well as deliver the $1M net increase.

Step 3 — Retained year-end ARR per acquired customer
$50 × 12 × 0.85 = **$510**

Step 4 — Customers and acquisition budget
ceil($1,150,000 / $510) = **2,255 new customers**
2,255 × $100 = **$225,500 acquisition budget** before the buffer below.

Check: $850,000 + 2,255 × $510 = **$2,000,050 year-end ARR**. Budgeting only for the $1M net increase would miss the target because it ignores losses from existing customers.

When someone asks how you got to the budget, walk them through the four steps. It's defensible.

### Why this formula and not something simpler

The four steps reconcile the target to the surviving base, then convert the remaining ARR gap into retained new customers and acquisition cost. Keep existing-base and new-cohort retention separate so replacement revenue is neither omitted nor counted twice.

### Required buffer

**Always add 10–20% as "experimental budget"** on top of the formula output. CAC is the main dependency; if CAC comes in 50% higher than estimated, the cascading effect is missing the revenue goal. It is much cheaper to overestimate CAC than to underestimate it.

The experimental budget also funds the experiments that find your next channel before your current one plateaus (see `growth-patterns.md` — channel S-curves).

## The VC growth path (3-3-2-2-2 rule)

Once a company has crossed $1M ARR and taken a Series A, the implicit benchmark VCs expect is:

| Year | ARR multiple | Cumulative ARR (from $1M start) |
|---|---|---|
| Year 0 | — | $1M |
| Year +1 | 3× | $3M |
| Year +2 | 3× | $9M |
| Year +3 | 2× | $18M |
| Year +4 | 2× | $36M |
| Year +5 | 2× | $72M |
| Year +6 | 2× | $144M |
| Year +7 | 2× | $288M |

That's the 3-3-2-2-2 rule. Useful when:

- The plan needs to map 12-month and 36-month milestones to VC expectations
- The founder is mid-raise and the board needs to see a plausible path to the next round
- Section 10 (12-month outlook) needs anchoring against an industry benchmark, not just internal ambition

Most companies miss it. That's fine. Knowing the benchmark gives the team a defensible reason to either match it or explicitly choose not to.

## Calculating CAC (blended, not paid-only)

If there's no historical CAC, use a baseline: **one year of revenue from the smallest paid plan.** Deploy the budget, capture actual CAC data, replace the baseline with the measured number for the next planning cycle.

For an established CAC calculation, **CAC must be blended.** Include:

- Marketing salaries (full loaded cost, not just base)
- Advertising spend
- Marketing tech stack costs
- Content production costs (writers, designers, video editors)
- Agency / contractor retainers
- SDR / BDR salaries if doing outbound
- Tools (CRM, marketing automation, analytics)

Then divide by the number of new customers acquired in the period. That blended number is the one to use in either budgeting method.

The mistake to avoid: calculating CAC from paid ad spend alone. A company that "doesn't run ads" still has a CAC — it's just hidden in the content team, the founder's time, the SEO contractor, the conference booth.

## The reality check on forecasting

This whole framework derives a budget and a revenue goal — not a 12-month month-by-month forecast accurate to the dollar.

**Unless the company is publicly traded, all forecasts are educated guesses.** No startup under $100M ARR reliably hits forecasts to the month. The honest framing for the plan:

- The annual goal is a defensible direction-of-travel
- The budget is the resource commitment that makes the goal plausible
- The 90-day roadmap (Section 9) is what's actionable now
- Month-to-month variance is expected; quarterly review is when the plan adjusts

What's actionable: how to deploy the budget, what concrete moves to execute, what to adjust when real data comes in.

What's not actionable: trying to forecast traffic, pipeline, retention curves, conversion rates, and channel mix all down to the decimal point and expecting that forecast to hold. Founders who over-engineer the forecast tend to spend the plan period explaining variance instead of executing.

**Rule for the plan:** the budget number is honest. The annual goal is honest. The month-by-month projection is illustrative.

## How this flows into the plan

| Section | What to include |
|---|---|
| **3 (Current state)** | Current monthly marketing spend broken down by line (paid, tools, content, headcount, retainers). Compute current %-of-ARR allocation. |
| **8 (Revenue)** | The unit-economics table (CAC, ARPC, churn) that feeds whichever budget method you're using. |
| **10 (12-month outlook)** | Apply Method 1 or Method 2 to derive the 12-month budget and the resulting revenue goal. Anchor against the 3-3-2-2-2 rule if Series A+ and VC-backed. |
| **11 (Ops stack)** | Show the budget allocation across the AARRR stages — what % to Acquisition, Activation, etc. The ops-stack mapping informs which line items grow when the next funding tier unlocks. |
| **13 (Open decisions)** | If CAC is unknown or contested, flag it as the highest-impact open decision — every other number depends on it. |

## When to choose which method

- **Method 1 (Revenue-Based)** when the company has historical CAC data, a profit/burn posture, and the question is "given our posture, what's a plausible goal."
- **Method 2 (Goal-Based)** when the company has a specific goal (board mandate, VC milestone, fundraise target) and the question is "what budget do we need to hit it."

For most plans in the seed-to-Series-A range, Method 2 is more useful — it forces the conversation about whether the goal is funded.
