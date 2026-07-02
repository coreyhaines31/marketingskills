# Marketing Loop Catalog

A library of repeatable marketing loops. Each is a complete, adaptable spec. Pick the closest match, then tune the cadence, thresholds, and human checkpoints to the user's product, stage, and tooling.

Every loop lists: **Cadence · Trigger · Purpose · Skills used · Loop body · Self-check · Stop / bail-out · Output**. See `SKILL.md` for the anatomy and the cadence rule.

Loops are grouped by AARRR funnel stage, then ongoing ops. Format and naming follow the "The X loop" convention.

---

## Acquisition

### The keyword-gap loop
- **Cadence**: Weekly (Mon 9am)
- **Trigger**: Time-based
- **Purpose**: Surface new ranking opportunities before competitors take them.
- **Skills used**: `seo-audit`, `programmatic-seo`, `content-strategy`
- **Loop body**:
  1. Pull ranking + impression data (Search Console / rank tracker).
  2. Diff against last run: new keywords in positions 5–20 (striking distance), pages that dropped, rising queries with no matching page.
  3. Classify each gap: quick on-page win / net-new page / programmatic template candidate.
  4. Draft the top 3 opportunities as briefs.
- **Self-check**: Is the movement real or seasonal/noise? Compare to same period last month, not just last week.
- **Stop / bail-out**: If no gaps clear a minimum impression threshold, skip and log "no action this week."
- **Output**: 3 content briefs staged for human review; a one-line summary of movement.

### The ad-fatigue loop
- **Cadence**: Every 2–3 days
- **Trigger**: Event-based — CTR drops >X% or frequency crosses a cap
- **Purpose**: Keep paid creative fresh so CPA doesn't drift up as ads fatigue.
- **Skills used**: `ads`, `ad-creative`, `analytics`
- **Loop body**:
  1. Pull per-ad metrics: CTR, frequency, CPA, spend, trend vs. baseline.
  2. Flag fatiguing ads (rising frequency + falling CTR) and clear winners.
  3. Generate 3–5 fresh creative variants off the winning angle.
  4. Stage variants for upload; recommend budget shift from fatigued → winning.
- **Self-check**: Enough spend/conversions for the CPA read to be significant? Don't act on <1 conversion's worth of data.
- **Stop / bail-out**: Never auto-shift budget or publish without a human checkpoint unless caps + allowlist are explicitly authorized.
- **Output**: Staged creative drafts + a recommended budget move.

### The content-repurposing loop
- **Cadence**: Weekly
- **Trigger**: New long-form content published, or time-based
- **Purpose**: Turn every long-form asset into a week of channel-native content.
- **Skills used**: `social`, `content-strategy`, `copywriting`
- **Loop body**:
  1. Find the newest blog post / video / podcast not yet repurposed.
  2. Extract the 3–5 strongest ideas.
  3. Draft channel-native versions (LinkedIn post, X thread, short-form script).
  4. Stage in the scheduling queue.
- **Self-check**: Does each piece stand alone, or does it read like a link-dump? Rewrite anything that only makes sense with the original open.
- **Stop / bail-out**: If nothing new was published, skip.
- **Output**: Drafts in the social queue for approval.

### The competitor-watch loop
- **Cadence**: Weekly
- **Trigger**: Time-based
- **Purpose**: Catch competitor pricing, positioning, and launch changes early.
- **Skills used**: `competitor-profiling`, `competitors`, `product-marketing`
- **Loop body**:
  1. Fetch competitor pricing pages, homepages, changelogs, and recent posts.
  2. Diff against last snapshot.
  3. Summarize meaningful changes (new feature, price change, new positioning line).
  4. Flag anything that warrants a response (comparison page update, counter-messaging).
- **Self-check**: Is the change substantive or cosmetic? Don't raise a copy tweak as a strategic shift.
- **Stop / bail-out**: No meaningful diffs → log "no change."
- **Output**: A change digest + recommended responses.

### The newsjacking loop
- **Cadence**: Daily
- **Trigger**: Event-based — trending story matches the brand's topic space
- **Purpose**: Ride relevant news with a timely angle before the window closes.
- **Skills used**: `public-relations`, `social`
- **Loop body**:
  1. Scan news/HN/Reddit/X for stories intersecting the product's space.
  2. Score newsworthiness + fit + reach.
  3. For the top story, draft an angle (post, pitch, or commentary).
- **Self-check**: Is the angle genuinely additive, or forced? Kill forced takes — they cost credibility.
- **Stop / bail-out**: No story clears the fit threshold → skip. Most days will skip; that's correct.
- **Output**: A staged post/pitch, or nothing.

---

## Activation

### The onboarding drop-off loop
- **Cadence**: Weekly
- **Trigger**: Time-based
- **Purpose**: Find and fix the biggest leak between signup and first value.
- **Skills used**: `onboarding`, `analytics`, `cro`
- **Loop body**:
  1. Pull the activation funnel step-by-step (signup → key action → aha).
  2. Identify the step with the largest drop vs. benchmark and vs. last period.
  3. Diagnose likely cause (friction, unclear value, technical).
  4. Propose one focused fix + how to measure it.
- **Self-check**: Enough new users through the funnel for the step rates to be significant?
- **Stop / bail-out**: Sample too small → widen the window or skip.
- **Output**: One prioritized activation fix with a measurement plan.

### The signup-funnel-leak loop
- **Cadence**: Weekly
- **Trigger**: Time-based
- **Purpose**: Keep the signup/checkout path converting as the site changes.
- **Skills used**: `signup`, `cro`, `analytics`, `ab-testing`
- **Loop body**:
  1. Pull conversion by step across the signup/checkout flow.
  2. Compare to baseline; flag regressions (a deploy or copy change may have hurt it).
  3. Draft a hypothesis + test for the worst step.
- **Self-check**: Rule out tracking breakage before declaring a real drop.
- **Stop / bail-out**: No regression and no test-worthy idea → skip.
- **Output**: A prioritized experiment brief for `ab-testing`.

---

## Retention

### The churn-signal loop
- **Cadence**: Daily or on-trigger
- **Trigger**: Event-based — usage drop, failed payment, support escalation
- **Purpose**: Intervene inside the short window before an at-risk account leaves.
- **Skills used**: `churn-prevention`, `analytics`, `emails`
- **Loop body**:
  1. Score accounts on churn-risk signals (usage decline, seat drop, dunning).
  2. Segment newly at-risk accounts.
  3. Match each to the right intervention (re-engagement email, CS outreach, offer).
  4. Stage the intervention.
- **Self-check**: Is the "drop" a real trend or a weekend/holiday dip? Compare to the account's own baseline.
- **Stop / bail-out**: Don't re-trigger on an account already in an active intervention.
- **Output**: A prioritized at-risk list with staged interventions.

### The lifecycle-email-refresh loop
- **Cadence**: Monthly
- **Trigger**: Time-based
- **Purpose**: Keep automated sequences performing as the product and audience evolve.
- **Skills used**: `emails`, `analytics`, `copy-editing`
- **Loop body**:
  1. Pull open/click/conversion per email in each active sequence.
  2. Flag the weakest performers and any stale references (old features, dates, pricing).
  3. Draft rewrites or subject-line tests for the bottom performers.
- **Self-check**: Enough sends per email for the rates to be meaningful?
- **Stop / bail-out**: All sequences healthy → log and skip.
- **Output**: Staged email rewrites + subject-line tests.

### The re-engagement loop
- **Cadence**: Weekly
- **Trigger**: Event-based — subscriber/user goes inactive past a threshold
- **Purpose**: Win back dormant users before they're gone for good.
- **Skills used**: `emails`, `sms`, `offers`
- **Loop body**:
  1. Identify users newly crossing the inactivity threshold.
  2. Pick the win-back angle (new feature, offer, "we miss you," sunset warning).
  3. Draft the message; set a suppression so they don't get re-hit next week.
- **Self-check**: Are these truly dormant, or just low-frequency-by-design users? Don't nag healthy accounts.
- **Stop / bail-out**: After N unsuccessful win-back attempts, move to sunset, not another email.
- **Output**: A staged win-back message + updated suppression list.

---

## Revenue

### The pricing-page-experiment loop
- **Cadence**: Monthly (tests run longer)
- **Trigger**: Time-based
- **Purpose**: Continuously improve pricing-page conversion and expansion.
- **Skills used**: `pricing`, `ab-testing`, `cro`
- **Loop body**:
  1. Review current pricing-page conversion + plan mix.
  2. Generate one pricing/packaging/copy hypothesis.
  3. Design the test; if the prior test concluded, read the result and promote the winner.
- **Self-check**: Is the running test statistically done before you call it? Don't peek-and-stop early.
- **Stop / bail-out**: A test is still running → don't start a conflicting one on the same page.
- **Output**: A test result + next hypothesis.

### The paywall-optimization loop
- **Cadence**: Monthly
- **Trigger**: Time-based
- **Purpose**: Improve upgrade conversion at the in-app paywall.
- **Skills used**: `paywalls`, `ab-testing`, `analytics`
- **Loop body**:
  1. Pull paywall view → upgrade conversion and where users bounce.
  2. Form one hypothesis (trigger timing, framing, plan anchor).
  3. Design or conclude a test.
- **Self-check**: Segment by plan/cohort — an aggregate number can hide a segment that's tanking.
- **Stop / bail-out**: Test in flight → hold.
- **Output**: A test result + next hypothesis.

---

## Referral

### The referral-nudge loop
- **Cadence**: Weekly
- **Trigger**: Event-based — user hits a "happy moment" (milestone, positive NPS)
- **Purpose**: Ask for referrals at the moment users are most delighted.
- **Skills used**: `referrals`, `emails`
- **Loop body**:
  1. Identify users who just hit a happy moment and haven't been asked recently.
  2. Match to the right referral ask (share link, incentive, review request).
  3. Stage the ask.
- **Self-check**: Is this genuinely a happy moment, or just any event? A bad-timing ask erodes goodwill.
- **Stop / bail-out**: Respect a cooldown — never ask the same user twice in the window.
- **Output**: A staged, well-timed referral ask.

### The review-harvest loop
- **Cadence**: Weekly
- **Trigger**: Time-based
- **Purpose**: Keep a steady flow of fresh reviews/testimonials and route them into marketing.
- **Skills used**: `cro`, `referrals`, `social`
- **Loop body**:
  1. Collect new reviews/testimonials/social mentions since last run.
  2. Sort by strength and relevance.
  3. Draft where each should go (site proof section, ad, social post).
  4. Flag any negative reviews for a human response.
- **Self-check**: Verify consent before using a testimonial publicly.
- **Stop / bail-out**: Negative/sensitive review → escalate to a human, don't auto-use.
- **Output**: New proof assets routed to their destinations.

---

## Ongoing Ops

### The weekly marketing review loop
- **Cadence**: Weekly (Mon 9am)
- **Trigger**: Time-based
- **Purpose**: One standing pulse across the whole funnel so nothing drifts unnoticed.
- **Skills used**: `analytics`, `marketing-plan`, `marketing-ideas`
- **Loop body**:
  1. Pull top-line AARRR metrics vs. last week and vs. plan.
  2. Flag the biggest mover (good and bad) in each stage.
  3. Tie each flag to the loop or skill that should act on it.
  4. Surface 1–2 experiment ideas from the week's learnings.
- **Self-check**: Distinguish trend from noise before raising an alarm.
- **Stop / bail-out**: n/a — always runs; this is the heartbeat loop.
- **Output**: A one-page weekly digest with owners/next actions.

### The ranking-drop watch loop
- **Cadence**: Weekly
- **Trigger**: Event-based — a priority keyword or page drops >N positions
- **Purpose**: Catch and diagnose SEO regressions before they compound.
- **Skills used**: `seo-audit`, `analytics`
- **Loop body**:
  1. Track positions for priority keywords/pages.
  2. Flag material drops; diff what changed (content, links, SERP layout, algo update timing).
  3. Diagnose likely cause + propose a fix.
- **Self-check**: Rule out a SERP-feature change or one-off volatility before declaring a real loss.
- **Stop / bail-out**: No material drops → log "stable."
- **Output**: A regression report with a recommended fix.

### The experiment-backlog loop
- **Cadence**: Weekly
- **Trigger**: Time-based
- **Purpose**: Keep a prioritized, always-full experiment pipeline so testing never stalls.
- **Skills used**: `ab-testing`, `cro`, `analytics`
- **Loop body**:
  1. Harvest new hypotheses from the week (data, research, competitors, support).
  2. Score with ICE; re-rank the backlog.
  3. If a test slot is free, tee up the top idea; if a test concluded, log the learning.
- **Self-check**: Is the top idea actually testable with current traffic, or ICE-inflated?
- **Stop / bail-out**: Backlog full and a test running → just log new ideas.
- **Output**: An updated, ranked experiment backlog.

### The social-listening loop
- **Cadence**: Daily
- **Trigger**: Time-based
- **Purpose**: Surface the highest-value conversations to engage in, instead of scrolling feeds.
- **Skills used**: `social` (see its `references/listening.md`)
- **Loop body**:
  1. Pull mentions and relevant threads across configured sources.
  2. Score by ICP fit, intent, reach, and comment opportunity.
  3. Draft comments/replies for the top handful.
- **Self-check**: Would a human recognize this reply as genuinely useful, not promotional?
- **Stop / bail-out**: Nothing clears the score threshold → skip.
- **Output**: A short list of threads with drafted, on-brand replies.

### The content-decay loop
- **Cadence**: Monthly
- **Trigger**: Time-based
- **Purpose**: Refresh decaying content before it slides out of rankings.
- **Skills used**: `copy-editing`, `seo-audit`, `content-strategy`
- **Loop body**:
  1. Find pages with declining traffic/rankings over the trailing 90 days.
  2. Pick the highest-value decayers.
  3. Draft a refresh plan (update stats, expand thin sections, fix intent match, re-link).
- **Self-check**: Is decay from the page itself or from a SERP/seasonality shift? Refresh only what a refresh can fix.
- **Stop / bail-out**: No meaningful decayers → skip.
- **Output**: A prioritized refresh list with per-page plans.

---

## Adapting and authoring loops

To adapt a loop: keep the eight anatomy parts, swap the skills/thresholds for the user's stack, and re-tune cadence to signal speed. To author a new one: start from the closest catalog entry, and do not ship it until every part is filled — especially **Self-check** and **Stop / bail-out**. A loop without those two isn't a system; it's a way to do the wrong thing on a schedule.
