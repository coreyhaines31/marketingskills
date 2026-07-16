---
name: ad-campaign-analyzer
description: "When the user wants to analyze ad campaign performance data and decide what to cut, scale, or test. Also use when the user mentions 'analyze my ad campaigns,' 'ad performance,' 'wasted ad spend,' 'budget reallocation,' 'ROAS analysis,' 'which ads are working,' 'Meta Ads performance,' 'Google Ads performance,' or 'ad budget optimization.' Input is campaign performance data (CSV export, paste, or screenshot) from Google, Meta, or LinkedIn. Output is a diagnostic report with statistical significance checks, budget waste analysis, winners to scale, and a multi-channel budget reallocation plan with specific dollar-amount recommendations. Pure reasoning skill — no external tools or API keys required. For campaign planning, see ads. For test design, see ab-testing. For tracking setup, see analytics."
license: MIT
metadata:
  version: 1.0.0
  author: GooseWorks
  source: https://github.com/gooseworks-ai/goose-skills
---

# Ad Campaign Analyzer

Take raw campaign performance data and turn it into clear decisions. This skill doesn't just summarize metrics — it diagnoses problems, identifies winners, checks statistical significance, and tells you exactly what to cut, scale, and test next. Then it goes further: it compares channels on equal terms, finds where you're over-spending vs under-spending relative to results, and produces a concrete budget reallocation plan.

**Core principle:** Most startup founders check their ad dashboard, see a ROAS number, and either panic or celebrate. This skill gives you the nuanced analysis a paid media specialist would: what's actually significant, what's noise, and where your next dollar should go. It also solves the allocation problem — most startups either spread budget too thin across channels (no channel gets enough to learn) or dump everything into one channel (missing cheaper opportunities elsewhere).

## When to Use

- "Analyze my Google Ads performance"
- "Which ads should I kill?"
- "Is this campaign working?"
- "Where am I wasting ad spend?"
- "Optimize my Meta Ads"
- "How should I split my ad budget?"
- "Should I spend more on Google or Meta?"
- "Reallocate my ad spend across channels"
- "Where am I getting the best return?"
- "I have $X/month for ads — how should I distribute it?"

## Phase 0: Intake

**Check for product marketing context first:** If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`), read it before asking questions and only ask for what it doesn't cover.

1. **Campaign data** — One of:
   - CSV export from Google Ads / Meta Ads Manager / LinkedIn Campaign Manager
   - Pasted performance table
   - Screenshots of dashboard (we'll extract the data)
2. **Platform(s)** — Google / Meta / LinkedIn / All
3. **Time period** — What date range does this cover?
4. **Monthly budget** — Total ad spend in this period
5. **Primary goal** — What conversion are you optimizing for? (Demos / Trials / Purchases / Leads)
6. **Target metrics** — Do you have target CPA or ROAS? (If not, we'll benchmark)
7. **Any known changes?** — Did you change creative, budget, or targeting during this period?
8. **Channels currently running** — Google Ads, Meta Ads, LinkedIn Ads, Twitter/X Ads, TikTok Ads, other
9. **Funnel data** (if available):
   - Lead → MQL rate
   - MQL → SQL rate
   - SQL → Close rate
   - Average deal size
10. **Channels you're considering but haven't tried** — Want to test new channels?
11. **Constraints** — Minimum spend on any channel? Platform you must stay on?

## Phase 1: Data Ingestion & Normalization

### Accepted Data Formats

| Source | Key Columns Expected |
|--------|---------------------|
| **Google Ads** | Campaign, Ad Group, Keyword, Impressions, Clicks, CTR, CPC, Conversions, Conv Rate, Cost, Conv Value |
| **Meta Ads** | Campaign, Ad Set, Ad, Impressions, Reach, Clicks, CTR, CPC, Conversions, Cost Per Result, Amount Spent, ROAS |
| **LinkedIn Ads** | Campaign, Impressions, Clicks, CTR, CPC, Conversions, Cost, Leads |

Normalize all data into a standard analysis format:

| Dimension | Impressions | Clicks | CTR | CPC | Conversions | Conv Rate | CPA | Spend | Revenue/Value |
|-----------|------------|--------|-----|-----|-------------|----------|-----|-------|--------------|

### Multi-Channel Normalization

When data spans multiple channels, also produce a channel-level rollup:

| Channel | Monthly Spend | Impressions | Clicks | CTR | CPC | Conversions | Conv Rate | CPA | ROAS | CAC* |
|---------|-------------|------------|--------|-----|-----|-------------|----------|-----|------|------|
| Google Search | $[X] | [N] | [N] | [X%] | $[X] | [N] | [X%] | $[X] | [X] | $[X] |
| Google Display | ... | | | | | | | | | |
| Meta (FB/IG) | ... | | | | | | | | | |
| LinkedIn | ... | | | | | | | | | |
| [Other] | ... | | | | | | | | | |
| **Total** | $[X] | | | | | [N] | | $[X] avg | [X] avg | $[X] avg |

*CAC = Full customer acquisition cost if funnel data provided (CPA × close-rate adjustment)

### Funnel-Adjusted CAC (If Funnel Data Available)

```
Channel CAC = CPA ÷ (MQL rate × SQL rate × Close rate)
```

This reveals which channels produce leads that actually close, not just convert.

## Phase 2: Performance Diagnostics

### 2A: Campaign-Level Health Check

For each campaign:

| Metric | Value | Benchmark | Status |
|--------|-------|-----------|--------|
| CTR | [X%] | [Industry avg] | [Good/Okay/Poor] |
| CPC | $[X] | [Category avg] | [Good/Okay/Poor] |
| Conv Rate | [X%] | [Benchmark] | [Good/Okay/Poor] |
| CPA | $[X] | [Target or benchmark] | [Good/Okay/Poor] |
| ROAS | [X] | [Target or benchmark] | [Good/Okay/Poor] |
| Impression Share | [X%] | [>60% ideal] | [Good/Okay/Poor] |

### 2B: Budget Waste Detection

Identify spend that produced no or negative return:

| Waste Type | Signal | Action |
|-----------|--------|--------|
| **Zero-conversion keywords/ads** | Spend > $[X] with 0 conversions | Pause or add negatives |
| **High CPA outliers** | CPA > 3x target | Pause or restructure |
| **Low CTR ads** | CTR < 50% of campaign average | Replace creative |
| **Broad match bleed** | Search terms report showing irrelevant clicks | Add negative keywords |
| **Audience overlap** | Same users hit by multiple campaigns | Exclude audiences |
| **Dayparting waste** | Conversions cluster at certain hours; spend is 24/7 | Set ad schedule |

### 2C: Winner Identification

Find what's actually working:

| Winner Type | Signal | Action |
|------------|--------|--------|
| **Top-performing keywords** | Lowest CPA, highest conv rate | Increase bid, add variants |
| **Winning ads** | Highest CTR + conv rate combo | Scale spend, clone for other groups |
| **Best audiences** | Lowest CPA segment | Increase budget allocation |
| **Best times** | Peak conversion hours/days | Concentrate budget |

### 2D: Statistical Significance Check

For any A/B test (ad variants, audiences, landing pages):

```
Test: [Variant A] vs [Variant B]
Metric: [Conv Rate / CTR / CPA]
Variant A: [X%] (n=[sample_size])
Variant B: [Y%] (n=[sample_size])
Confidence level: [X%]
Verdict: [Statistically significant / Not enough data / Too close to call]
Recommended action: [Pick winner / Continue test / Increase budget to reach significance]
```

Minimum sample: 100 clicks per variant for CTR tests, 30 conversions per variant for CPA tests.

## Phase 3: Funnel Analysis

### Click → Conversion Path

```
Impressions: [N] (100%)
     ↓ CTR: [X%]
Clicks: [N] ([X%] of impressions)
     ↓ Landing page → Conversion: [X%]
Conversions: [N] ([X%] of clicks)
     ↓ Conversion → Revenue: $[X] avg
Revenue: $[N]
```

### Funnel Drop-Off Diagnosis

| Drop-Off Point | Rate | Benchmark | Likely Cause | Fix |
|----------------|------|-----------|-------------|-----|
| Impression → Click | [CTR%] | [Benchmark] | [Ad relevance / targeting] | [Copy/targeting change] |
| Click → Conversion | [Conv%] | [Benchmark] | [Landing page / offer / audience mismatch] | [LP optimization] |
| Conversion → Revenue | [Close%] | [Benchmark] | [Lead quality / sales process] | [Qualification criteria] |

## Phase 4: Budget Reallocation

When data spans multiple channels, perform cross-channel budget optimization.

### 4A: Channel Efficiency Ranking

| Rank | Channel | CPA | Funnel-Adj CAC | Share of Spend | Share of Conversions | Efficiency Index |
|------|---------|-----|---------------|----------------|---------------------|-----------------|
| 1 | [Channel] | $[X] | $[X] | [X%] | [X%] | [Conv share ÷ Spend share] |

**Efficiency Index:**
- **> 1.0** = Under-invested (getting more than its share of conversions)
- **= 1.0** = Proportional (fair share)
- **< 1.0** = Over-invested (getting less than its share)

### 4B: Marginal Return Analysis

For each channel, estimate if additional spend would yield proportional returns:

| Channel | Current CPA | Impression Share / Saturation Signal | Marginal Return Estimate |
|---------|-------------|-------------------------------------|------------------------|
| Google Search | $[X] | [X%] impression share — room to grow | Likely positive |
| Meta | $[X] | Frequency [X] — audience may be saturated | Diminishing |
| LinkedIn | $[X] | Low volume — limited targeting pool | Ceiling soon |

### 4C: Funnel Stage Coverage

| Funnel Stage | Channels Covering It | Current Spend | Gap? |
|-------------|---------------------|--------------|------|
| **Awareness** (top) | [Meta Display, YouTube] | $[X] | [Yes/No] |
| **Consideration** (mid) | [Google Search, Meta retargeting] | $[X] | [Yes/No] |
| **Decision** (bottom) | [Google Brand, Google Search] | $[X] | [Yes/No] |
| **Retargeting** | [Meta, Google Display] | $[X] | [Yes/No] |

### 4D: Budget Shift Recommendations

| Channel | Current Spend | Recommended Spend | Change | Reasoning |
|---------|-------------|------------------|--------|-----------|
| Google Search | $[X] | $[Y] | +$[Z] | [Lowest CPA, room to scale] |
| Meta | $[X] | $[Y] | -$[Z] | [Audience saturation, frequency too high] |
| LinkedIn | $[X] | $[Y] | $0 | [Maintain — niche but valuable] |
| [New channel] | $0 | $[Y] | +$[Y] | [Test budget — competitors succeeding here] |
| **Total** | $[X] | $[X] | $0 | Budget-neutral reallocation |

### 4E: Scenario Modeling

**Scenario 1: Conservative shift (+/- 20%)**
- Expected conversions: [N] (currently [N]) = [X%] improvement
- Expected blended CPA: $[X] (currently $[X])
- Risk: Low

**Scenario 2: Aggressive shift (+/- 40%)**
- Expected conversions: [N] = [X%] improvement
- Expected blended CPA: $[X]
- Risk: Medium — less data on scaled channels

**Scenario 3: Budget increase to $[Y]/mo**
- Recommended allocation: [table]
- Expected conversions: [N]
- New channels to test: [list]

## Phase 5: Output Format

```markdown
# Ad Campaign Analysis — [Product/Client] — [DATE]

Period: [Date range]
Total spend: $[X]
Platform(s): [Google / Meta / LinkedIn]
Primary goal: [Conversions / Revenue / Leads]

---

## Executive Summary

[3-5 sentences: Overall performance verdict, biggest win, biggest problem, top recommendation including any reallocation moves]

---

## Performance Dashboard

| Campaign | Spend | Impressions | Clicks | CTR | CPC | Conversions | CPA | ROAS | Verdict |
|----------|-------|------------|--------|-----|-----|-------------|-----|------|---------|
| [Name] | $[X] | [N] | [N] | [X%] | $[X] | [N] | $[X] | [X] | [Scale/Optimize/Pause] |

---

## Budget Waste Report

**Total estimated waste: $[X] ([X%] of total spend)**

### Wasted on zero-conversion items: $[X]
[List of keywords/ads/audiences with spend but no conversions]

### Wasted on high-CPA items: $[X]
[List of items with CPA > 3x target]

### Recommended saves: $[X]/month
[Specific items to pause]

---

## Winners to Scale

### Top Keywords/Audiences
| Item | CPA | Conv Rate | Current Spend | Recommended Spend |
|------|-----|----------|--------------|-------------------|

### Top Ads
| Ad | CTR | Conv Rate | Why It Works |
|----|-----|----------|-------------|

---

## A/B Test Results

### [Test Name]
- Variant A: [Metric] (n=[N])
- Variant B: [Metric] (n=[N])
- Confidence: [X%]
- **Verdict:** [Winner / Continue / Inconclusive]

---

## Budget Reallocation

### Current vs Recommended Allocation

| Channel | Current | Recommended | Change | Why |
|---------|---------|------------|--------|-----|
| [Channel] | $[X] | $[Y] | [+/-$Z] | [1-line reason] |

**Projected impact:**
- Conversions: [N] → [N] (+[X%])
- Blended CPA: $[X] → $[Y] (-[X%])

### Funnel Stage Coverage
[Coverage map with gaps identified]

### New Channel Recommendations

#### [Channel Name]
- **Why test:** [Reasoning]
- **Recommended test budget:** $[X]/mo for [X weeks]
- **Success criteria:** CPA < $[X]
- **Competitors using it:** [Yes/No — who]

---

## Action Plan

### Immediate (This Week)
- [ ] **Pause:** [Specific items — keywords, ads, audiences]
- [ ] **Scale:** [Specific items — increase budget/bids]
- [ ] **Add negatives:** [Specific keywords from search terms]
- [ ] **Reallocate:** [Specific dollar shifts between channels]

### This Month
- [ ] **Test:** [New ad angles / audiences / landing pages]
- [ ] **Restructure:** [Ad groups that need splitting or merging]
- [ ] **Optimize:** [Bid strategy changes]
- [ ] **Monitor reallocation:** Track CPA shifts on scaled channels, watch for diminishing returns

### Next Month
- [ ] **Expand:** [New campaigns / channels to test]
- [ ] **Re-evaluate:** [Run this analysis again with new data, adjust allocations based on actual results]
```

Save to `campaign-analysis-[YYYY-MM-DD].md` in the current working directory (or user-specified path).

## Cost

| Component | Cost |
|-----------|------|
| Data analysis | Free (LLM reasoning) |
| Statistical calculations | Free |
| **Total** | **Free** |

## Tools Required

- No external tools needed — pure reasoning skill
- User provides campaign data as CSV, paste, or screenshot

## Trigger Phrases

- "Analyze my ad campaign performance"
- "Which ads should I pause?"
- "Where am I wasting ad budget?"
- "Is my Google Ads campaign working?"
- "Optimize my Meta Ads spend"
- "How should I allocate my ad budget?"
- "Should I spend more on Google or Meta?"
- "Reallocate my ad spend"
- "Where am I getting the best ROAS?"
- "Optimize my multi-channel ad budget"

## Related Skills

- **ads**: For planning and structuring the campaigns this skill diagnoses
- **ab-testing**: For designing the tests this skill recommends
- **analytics**: For setting up the tracking that produces clean input data
- **cro**: For fixing the landing-page issues surfaced in funnel analysis
