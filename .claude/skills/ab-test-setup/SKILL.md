---
name: ab-test-setup
description: When the user wants to plan, design, or implement an A/B test or experiment. Also use when the user mentions "A/B test," "split test," "experiment," "test this change," "variant copy," "multivariate test," or "hypothesis." For tracking implementation, see analytics-tracking.
---

# A/B Test Setup

You are an expert in experimentation and A/B testing. Your goal is to help design tests that produce statistically valid, actionable results.

## Initial Assessment

Before designing a test, understand:

1. **Test Context**
   - What are you trying to improve?
   - What change are you considering?
   - What made you want to test this?

2. **Current State**
   - Baseline conversion rate?
   - Current traffic volume?
   - Any historical test data?

3. **Constraints**
   - Technical implementation complexity?
   - Timeline requirements?
   - Tools available?

---

## Core Principles

### 1. Start with a Hypothesis
- Not just "let's see what happens"
- Specific prediction of outcome
- Based on reasoning or data

### 2. Test One Thing
- Single variable per test
- Otherwise you don't know what worked
- Save MVT for later

### 3. Statistical Rigor
- Pre-determine sample size
- Don't peek and stop early
- Commit to the methodology

### 4. Measure What Matters
- Primary metric tied to business value
- Secondary metrics for context
- Guardrail metrics to prevent harm

---

## Hypothesis Framework

### Structure

```
Because [observation/data],
we believe [change]
will cause [expected outcome]
for [audience].
We'll know this is true when [metrics].
```

### Examples

**Weak hypothesis:**
"Changing the button color might increase clicks."

**Strong hypothesis:**
"Because users report difficulty finding the CTA (per heatmaps and feedback), we believe making the button larger and using contrasting color will increase CTA clicks by 15%+ for new visitors. We'll measure click-through rate from page view to signup start."

### Good Hypotheses Include

- **Observation**: What prompted this idea
- **Change**: Specific modification
- **Effect**: Expected outcome and direction
- **Audience**: Who this applies to
- **Metric**: How you'll measure success

---

## Test Types

### A/B Test (Split Test)
- Two versions: Control (A) vs. Variant (B)
- Single change between versions
- Most common, easiest to analyze

### A/B/n Test
- Multiple variants (A vs. B vs. C...)
- Requires more traffic
- Good for testing several options

### Multivariate Test (MVT)
- Multiple changes in combinations
- Tests interactions between changes
- Requires significantly more traffic
- Complex analysis

### Split URL Test
- Different URLs for variants
- Good for major page changes
- Easier implementation sometimes

---

## Sample Size Calculation

### Inputs Needed

1. **Baseline conversion rate**: Your current rate
2. **Minimum detectable effect (MDE)**: Smallest change worth detecting
3. **Statistical significance level**: Usually 95%
4. **Statistical power**: Usually 80%

### Quick Reference

| Baseline Rate | 10% Lift | 20% Lift | 50% Lift |
|---------------|----------|----------|----------|
| 1% | 150k/variant | 39k/variant | 6k/variant |
| 3% | 47k/variant | 12k/variant | 2k/variant |
| 5% | 27k/variant | 7k/variant | 1.2k/variant |
| 10% | 12k/variant | 3k/variant | 550/variant |

### Formula Resources
- Evan Miller's calculator: https://www.evanmiller.org/ab-testing/sample-size.html
- Optimizely's calculator: https://www.optimizely.com/sample-size-calculator/

### Test Duration

```
Duration = Sample size needed per variant × Number of variants
           ───────────────────────────────────────────────────
           Daily traffic to test page × Conversion rate
```

Minimum: 1-2 business cycles (usually 1-2 weeks)
Maximum: Avoid running too long (novelty effects, external factors)

---

## Metrics Selection

### Primary Metric
- Single metric that matters most
- Directly tied to hypothesis
- What you'll use to call the test

### Secondary Metrics
- Support primary metric interpretation
- Explain why/how the change worked
- Help understand user behavior

### Guardrail Metrics
- Things that shouldn't get worse
- Revenue, retention, satisfaction
- Stop test if significantly negative

### Metric Examples by Test Type

**Homepage CTA test:**
- Primary: CTA click-through rate
- Secondary: Time to click, scroll depth
- Guardrail: Bounce rate, downstream conversion

**Pricing page test:**
- Primary: Plan selection rate
- Secondary: Time on page, plan distribution
- Guardrail: Support tickets, refund rate

**Signup flow test:**
- Primary: Signup completion rate
- Secondary: Field-level completion, time to complete
- Guardrail: User activation rate (post-signup quality)

---

## Designing Variants

### Control (A)
- Current experience, unchanged
- Don't modify during test

### Variant (B+)

**Best practices:**
- Single, meaningful change
- Bold enough to make a difference
- True to the hypothesis

**What to vary:**

Headlines/Copy:
- Message angle
- Value proposition
- Specificity level
- Tone/voice

Visual Design:
- Layout structure
- Color and contrast
- Image selection
- Visual hierarchy

CTA:
- Button copy
- Size/prominence
- Placement
- Number of CTAs

Content:
- Information included
- Order of information
- Amount of content
- Social proof type

### Documenting Variants

```
Control (A):
- Screenshot
- Description of current state

Variant (B):
- Screenshot or mockup
- Specific changes made
- Hypothesis for why this will win
```

---

## Traffic Allocation

### Standard Split
- 50/50 for A/B test
- Equal split for multiple variants

### Conservative Rollout
- 90/10 or 80/20 initially
- Limits risk of bad variant
- Longer to reach significance

### Ramping
- Start small, increase over time
- Good for technical risk mitigation
- Most tools support this

### Considerations
- Consistency: Users see same variant on return
- Segment sizes: Ensure segments are large enough
- Time of day/week: Balanced exposure

---

## Implementation Approaches

### Client-Side Testing

**Tools**: PostHog, Optimizely, VWO, custom

**How it works**:
- JavaScript modifies page after load
- Quick to implement
- Can cause flicker

**Best for**:
- Marketing pages
- Copy/visual changes
- Quick iteration

### Server-Side Testing

**Tools**: PostHog, LaunchDarkly, Split, custom

**How it works**:
- Variant determined before page renders
- No flicker
- Requires development work

**Best for**:
- Product features
- Complex changes
- Performance-sensitive pages

### Feature Flags

- Binary on/off (not true A/B)
- Good for rollouts
- Can convert to A/B with percentage split

---

## Running the Test

### Pre-Launch Checklist

- [ ] Hypothesis documented
- [ ] Primary metric defined
- [ ] Sample size calculated
- [ ] Test duration estimated
- [ ] Variants implemented correctly
- [ ] Tracking verified
- [ ] QA completed on all variants
- [ ] Stakeholders informed

### During the Test

**DO:**
- Monitor for technical issues
- Check segment quality
- Document any external factors

**DON'T:**
- Peek at results and stop early
- Make changes to variants
- Add traffic from new sources
- End early because you "know" the answer

### Peeking Problem

Looking at results before reaching sample size and stopping when you see significance leads to:
- False positives
- Inflated effect sizes
- Wrong decisions

**Solutions:**
- Pre-commit to sample size and stick to it
- Use sequential testing if you must peek
- Trust the process

---

## Analyzing Results

### Statistical Significance

- 95% confidence = p-value < 0.05
- Means: <5% chance result is random
- Not a guarantee—just a threshold

### Practical Significance

Statistical ≠ Practical

- Is the effect size meaningful for business?
- Is it worth the implementation cost?
- Is it sustainable over time?

### What to Look At

1. **Did you reach sample size?**
   - If not, result is preliminary

2. **Is it statistically significant?**
   - Check confidence intervals
   - Check p-value

3. **Is the effect size meaningful?**
   - Compare to your MDE
   - Project business impact

4. **Are secondary metrics consistent?**
   - Do they support the primary?
   - Any unexpected effects?

5. **Any guardrail concerns?**
   - Did anything get worse?
   - Long-term risks?

6. **Segment differences?**
   - Mobile vs. desktop?
   - New vs. returning?
   - Traffic source?

### Interpreting Results

| Result | Conclusion |
|--------|------------|
| Significant winner | Implement variant |
| Significant loser | Keep control, learn why |
| No significant difference | Need more traffic or bolder test |
| Mixed signals | Dig deeper, maybe segment |

---

## Documenting and Learning

### Test Documentation

```
Test Name: [Name]
Test ID: [ID in testing tool]
Dates: [Start] - [End]
Owner: [Name]

Hypothesis:
[Full hypothesis statement]

Variants:
- Control: [Description + screenshot]
- Variant: [Description + screenshot]

Results:
- Sample size: [achieved vs. target]
- Primary metric: [control] vs. [variant] ([% change], [confidence])
- Secondary metrics: [summary]
- Segment insights: [notable differences]

Decision: [Winner/Loser/Inconclusive]
Action: [What we're doing]

Learnings:
[What we learned, what to test next]
```

### Building a Learning Repository

- Central location for all tests
- Searchable by page, element, outcome
- Prevents re-running failed tests
- Builds institutional knowledge

---

## Output Format

### Test Plan Document

```
# A/B Test: [Name]

## Hypothesis
[Full hypothesis using framework]

## Test Design
- Type: A/B / A/B/n / MVT
- Duration: X weeks
- Sample size: X per variant
- Traffic allocation: 50/50

## Variants
[Control and variant descriptions with visuals]

## Metrics
- Primary: [metric and definition]
- Secondary: [list]
- Guardrails: [list]

## Implementation
- Method: Client-side / Server-side
- Tool: [Tool name]
- Dev requirements: [If any]

## Analysis Plan
- Success criteria: [What constitutes a win]
- Segment analysis: [Planned segments]
```

### Results Summary
When test is complete

### Recommendations
Next steps based on results

---

## Common Mistakes

### Test Design
- Testing too small a change (undetectable)
- Testing too many things (can't isolate)
- No clear hypothesis
- Wrong audience

### Execution
- Stopping early
- Changing things mid-test
- Not checking implementation
- Uneven traffic allocation

### Analysis
- Ignoring confidence intervals
- Cherry-picking segments
- Over-interpreting inconclusive results
- Not considering practical significance

---

## Questions to Ask

If you need more context:
1. What's your current conversion rate?
2. How much traffic does this page get?
3. What change are you considering and why?
4. What's the smallest improvement worth detecting?
5. What tools do you have for testing?
6. Have you tested this area before?

---

## Related Skills

- **page-cro**: For generating test ideas based on CRO principles
- **analytics-tracking**: For setting up test measurement
- **copywriting**: For creating variant copy
