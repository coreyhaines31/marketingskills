# Sample Size Guide

Reference for calculating sample sizes and test duration.

## Contents
- Sample Size Fundamentals (required inputs, what these mean)
- Sample Size Quick Reference Tables
- Duration Calculator (formula, examples, minimum duration rules, maximum duration guidelines)
- Online Calculators
- Adjusting for Multiple Variants
- Common Sample Size Mistakes
- When Sample Size Requirements Are Too High
- Sequential Testing
- Quick Decision Framework

## Sample Size Fundamentals

### Required Inputs

1. **Baseline conversion rate**: Your current rate
2. **Minimum detectable effect (MDE)**: Smallest change worth detecting
3. **Statistical significance level**: Usually α = 0.05 (5%)
4. **Statistical power**: Usually 80% (β = 0.20)

### What These Mean

**Baseline conversion rate**: If your page converts at 5%, that's your baseline.

**MDE (Minimum Detectable Effect)**: The smallest improvement you care about detecting. Set this based on:
- Business impact (is a 5% lift meaningful?)
- Implementation cost (worth the effort?)
- Realistic expectations (what have past tests shown?)

**Significance level (α = 0.05)**: For the planned test and its assumptions, limits the long-run probability of rejecting a true null hypothesis to 5%. It is not the probability that an observed difference is “due to chance.” Repeated unadjusted looks or multiple comparisons do not retain that error rate. See the [ASA's interpretation guidance](https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf).

**Statistical power (80%)**: Means if there's a real effect of size MDE, you have 80% chance of detecting it.

---

## Sample Size Quick Reference Tables

All tables assume α = 0.05 (two-sided) and 80% power, two-proportion test, rounded to two significant figures. Use a calculator for your exact numbers.

### Conversion Rate: 1%

| Lift to Detect | Sample per Variant | Total Sample |
|----------------|-------------------|--------------|
| 5% (1% → 1.05%) | 640,000 | 1,280,000 |
| 10% (1% → 1.1%) | 160,000 | 320,000 |
| 20% (1% → 1.2%) | 43,000 | 86,000 |
| 50% (1% → 1.5%) | 7,700 | 15,400 |
| 100% (1% → 2%) | 2,300 | 4,600 |

### Conversion Rate: 3%

| Lift to Detect | Sample per Variant | Total Sample |
|----------------|-------------------|--------------|
| 5% (3% → 3.15%) | 210,000 | 420,000 |
| 10% (3% → 3.3%) | 53,000 | 106,000 |
| 20% (3% → 3.6%) | 14,000 | 28,000 |
| 50% (3% → 4.5%) | 2,500 | 5,000 |
| 100% (3% → 6%) | 750 | 1,500 |

### Conversion Rate: 5%

| Lift to Detect | Sample per Variant | Total Sample |
|----------------|-------------------|--------------|
| 5% (5% → 5.25%) | 120,000 | 240,000 |
| 10% (5% → 5.5%) | 31,000 | 62,000 |
| 20% (5% → 6%) | 8,200 | 16,400 |
| 50% (5% → 7.5%) | 1,500 | 3,000 |
| 100% (5% → 10%) | 430 | 860 |

### Conversion Rate: 10%

| Lift to Detect | Sample per Variant | Total Sample |
|----------------|-------------------|--------------|
| 5% (10% → 10.5%) | 58,000 | 116,000 |
| 10% (10% → 11%) | 15,000 | 30,000 |
| 20% (10% → 12%) | 3,800 | 7,600 |
| 50% (10% → 15%) | 690 | 1,380 |
| 100% (10% → 20%) | 200 | 400 |

### Conversion Rate: 20%

| Lift to Detect | Sample per Variant | Total Sample |
|----------------|-------------------|--------------|
| 5% (20% → 21%) | 26,000 | 52,000 |
| 10% (20% → 22%) | 6,500 | 13,000 |
| 20% (20% → 24%) | 1,700 | 3,400 |
| 50% (20% → 30%) | 290 | 580 |
| 100% (20% → 40%) | 81 | 162 |

---

## Duration Calculator

### Formula

```
Duration (days) = (Sample per variant × Number of variants) / (Daily traffic × % exposed)

For unequal allocation, calculate each arm separately:
Days per arm = Required sample for that arm / (Daily eligible traffic × Exposure fraction × Arm allocation fraction)
Total collection time = longest arm duration
```

Use fractions for exposure and allocation (50% = 0.5). Count eligible randomized units consistently with the sample-size calculation; repeat pageviews are not additional participants. The balanced formula assumes equal sample requirements and equal allocation.

### Examples

**Scenario 1: High-traffic page**
- Need: 10,000 per variant (2 variants = 20,000 total)
- Daily traffic: 5,000 visitors
- 100% exposed to test
- Duration: 20,000 / 5,000 = **4 days**

**Scenario 2: Medium-traffic page**
- Need: 30,000 per variant (60,000 total)
- Daily traffic: 2,000 visitors
- 100% exposed
- Duration: 60,000 / 2,000 = **30 days**

**Scenario 3: Low-traffic with partial exposure**
- Need: 15,000 per variant (30,000 total)
- Daily traffic: 500 visitors
- 50% exposed to test
- Effective daily: 250
- Duration: 30,000 / 250 = **120 days** (too long!)

### Minimum Duration Rules

Even with sufficient sample size, run tests for at least:
- **1 full week**: To capture day-of-week variation
- **2 business cycles**: If B2B (weekday vs. weekend patterns)
- **Through paydays**: If e-commerce (beginning/end of month)

### Maximum Duration Guidelines

Avoid running tests longer than 4-8 weeks:
- Novelty effects wear off
- External factors intervene
- Opportunity cost of other tests

---

## Online Calculators

### Recommended Tools

**Evan Miller's Calculator**
https://www.evanmiller.org/ab-testing/sample-size.html
- Simple interface
- Bookmark-worthy

**Optimizely's Calculator**
https://www.optimizely.com/sample-size-calculator/
- Business-friendly language
- Duration estimates

**AB Test Guide Calculator**
https://www.abtestguide.com/calc/
- Includes Bayesian option
- Multiple test types

**VWO Duration Calculator**
https://vwo.com/tools/ab-test-duration-calculator/
- Duration-focused
- Good for planning

---

## Adjusting for Multiple Variants

With more than 2 variants (A/B/n tests), you need more sample:

| Variants | Multiplier |
|----------|------------|
| 2 (A/B) | 1x |
| 3 (A/B/C) | ~1.5x |
| 4 (A/B/C/D) | ~2x |
| 5+ | Consider reducing variants |

**Why?** More comparisons increase chance of false positives. You're comparing:
- A vs B
- A vs C
- B vs C (sometimes)

Apply Bonferroni correction or use tools that handle this automatically.

---

## Common Sample Size Mistakes

### 1. Underpowered tests
**Problem**: Not enough sample to detect realistic effects
**Fix**: Be realistic about MDE, get more traffic, or don't test

### 2. Overpowered tests
**Problem**: Waiting for sample size when you already have significance
**Fix**: This is actually fine—you committed to sample size, honor it

### 3. Wrong baseline rate
**Problem**: Using wrong conversion rate for calculation
**Fix**: Use the specific metric and page, not site-wide averages

### 4. Ignoring segments
**Problem**: Calculating for full traffic, then analyzing segments
**Fix**: If you plan segment analysis, calculate sample for smallest segment

### 5. Testing too many things
**Problem**: Dividing traffic too many ways
**Fix**: Prioritize ruthlessly, run fewer concurrent tests

---

## When Sample Size Requirements Are Too High

Options when you can't get enough traffic:

1. **Increase MDE**: Accept only detecting larger effects (20%+ lift)
2. **Lower confidence**: Use 90% instead of 95% (risky, document it)
3. **Reduce variants**: Test only the most promising variant
4. **Combine traffic**: Test across multiple similar pages
5. **Test upstream**: Test earlier in funnel where traffic is higher
6. **Don't test**: Make decision based on qualitative data instead
7. **Longer test**: Accept longer duration (weeks/months)

---

## Sequential Testing

If you must check results before reaching sample size:

### What is it?
Statistical method that adjusts for multiple looks at data.

### When to use
- High-risk changes
- Need to stop bad variants early
- Time-sensitive decisions

### Tools that support it
- Optimizely (Stats Accelerator)
- VWO (SmartStats)
- PostHog (Bayesian approach)

### Tradeoff
- More flexibility to stop early
- Slightly larger sample size requirement
- More complex analysis

---

## Quick Decision Framework

### Can I run this test?

```
Daily eligible traffic (randomization units): _____
Fraction exposed to the experiment: _____
Number of arms (including control): _____
Allocation fraction for each arm: _____
Baseline conversion rate: _____
MDE I care about: _____

Sample needed per variant: _____ (from tables above)
Balanced allocation: Days = Sample per arm × Number of arms / (Daily eligible traffic × Exposure fraction)
Unequal allocation: Days = max across arms of [Sample required for arm / (Daily eligible traffic × Exposure fraction × Arm allocation)]
Round collection time up, then apply the minimum-duration rules above.

If days > 60: Consider alternatives
If days > 30: Acceptable for high-impact tests
If days < 14: Likely feasible
If days < 7: Easy to run, consider running longer anyway
```

**Duration check (illustrative):** with 2,000 participants required per arm and 1,000 eligible participants/day, two arms at 50/50 with full exposure require four days, not two. At 50% exposure they require eight days. With full exposure and 90/10 allocation, the smaller arm needs 20 days to reach 2,000. These are collection estimates; honor planned business cycles and the analysis stopping rule.
