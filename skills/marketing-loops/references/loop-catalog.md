# Marketing Loop Catalog

A library of repeatable marketing loops with thorough coverage across the funnel. Each is a complete, adaptable spec. Pick the closest match, then tune the cadence, thresholds, state handling, and human checkpoints to the user's product, stage, and tooling.

Every loop lists nine parts: **Check cadence · Acts when · Purpose · Skills used · Loop body · Self-check · State / idempotency · Stop / bail-out · Output**. See `SKILL.md` for the anatomy, the cadence rule, and when not to loop.

Two rules that apply to every entry:
- **Most runs should do nothing.** A healthy loop checks, finds nothing worth acting on, logs "no action," and exits. Loops that act every run are usually acting on noise.
- **State prevents harm.** Every loop tracks what it already did (last-run marker, dedupe key, cooldown) so it never double-acts, re-nags the same person, or re-alerts the same issue.

Loops are grouped by function. Naming follows the "The X loop" convention.

---

## SEO & Content

### The keyword-gap loop
- **Check cadence**: Weekly
- **Acts when**: A striking-distance keyword (positions 5–20) or a rising query has no adequate page.
- **Purpose**: Surface new ranking opportunities before competitors take them.
- **Skills used**: `seo-audit`, `programmatic-seo`, `content-strategy`
- **Loop body**:
  1. Pull ranking + impression data (Search Console / rank tracker).
  2. Diff vs. last run: new striking-distance keywords, rising queries with no matching page.
  3. Classify each gap: quick on-page win / net-new page / programmatic template candidate.
  4. Draft briefs for the top 3.
- **Self-check**: Movement real vs. seasonal? Compare to the same period last month, not just last week.
- **State / idempotency**: Store the set of gaps already briefed; don't re-brief an open one.
- **Stop / bail-out**: No gap clears a minimum impression threshold → log "no action." Halt on data-source outage rather than acting on partial data.
- **Output**: Up to 3 content briefs staged for review + a one-line movement summary.

### The ranking-drop watch loop
- **Check cadence**: Weekly
- **Acts when**: A priority keyword or page drops more than N positions vs. baseline.
- **Purpose**: Catch and diagnose SEO regressions before they compound.
- **Skills used**: `seo-audit`, `analytics`
- **Loop body**:
  1. Track positions for priority keywords/pages.
  2. Flag material drops; diff what changed (content, links, SERP layout, algo-update timing).
  3. Diagnose likely cause + propose a fix.
- **Self-check**: Rule out a SERP-feature change or one-off volatility before declaring a real loss.
- **State / idempotency**: Remember which drops are already open as issues; update rather than re-file.
- **Stop / bail-out**: No material drop → log "stable." Escalate suspected algo hits to a human rather than mass-editing.
- **Output**: A regression report with a recommended fix.

### The content-decay loop
- **Check cadence**: Monthly
- **Acts when**: A page's traffic/rankings declined materially over the trailing 90 days.
- **Purpose**: Refresh decaying content before it slides out of rankings.
- **Skills used**: `copy-editing`, `seo-audit`, `content-strategy`
- **Loop body**:
  1. Find pages with declining trailing-90-day traffic/rankings.
  2. Pick the highest-value decayers.
  3. Draft a refresh plan (update stats, expand thin sections, fix intent match, re-link).
- **Self-check**: Decay from the page itself, or from a SERP/seasonality shift? Refresh only what a refresh can fix.
- **State / idempotency**: Track last-refresh date per page; don't re-queue a page refreshed within the cooldown.
- **Stop / bail-out**: No meaningful decayers → skip.
- **Output**: A prioritized refresh list with per-page plans.

### The internal-linking loop
- **Check cadence**: On new/updated content, or weekly
- **Acts when**: A published page has fewer relevant internal links (in or out) than it should.
- **Purpose**: Distribute link equity and help new content get discovered and rank.
- **Skills used**: `seo-audit`, `site-architecture`, `content-strategy`
- **Loop body**:
  1. Identify recently published/updated pages.
  2. Find relevant existing pages that should link to them (and vice versa).
  3. Draft the specific link insertions with anchor text.
- **Self-check**: Is each link contextually relevant, or link-stuffing? Skip forced links.
- **State / idempotency**: Track which page pairs are already linked; never suggest a duplicate.
- **Stop / bail-out**: No relevant link targets → skip. Stage edits for review; don't mass-edit live pages autonomously.
- **Output**: A list of specific internal-link edits.

### The programmatic-SEO quality loop
- **Check cadence**: Monthly
- **Acts when**: Template pages show indexation gaps, thin content, duplication, or cannibalization.
- **Purpose**: Keep large templated page sets healthy so they don't drag the whole domain.
- **Skills used**: `programmatic-seo`, `seo-audit`
- **Loop body**:
  1. Sample the template page set; check indexation, word/data uniqueness, and query overlap.
  2. Flag thin, duplicate, cannibalizing, or deindexed pages.
  3. Recommend fix, consolidate, noindex, or prune.
- **Self-check**: Is low traffic a quality problem or just low demand? Don't prune pages that serve real long-tail intent.
- **State / idempotency**: Track pages already flagged/actioned; re-check only on the next cycle.
- **Stop / bail-out**: Set healthy → log and skip. Escalate mass-noindex/prune decisions to a human.
- **Output**: A quality report with per-bucket actions.

### The content-repurposing loop
- **Check cadence**: Weekly
- **Acts when**: A long-form asset (post/video/podcast) hasn't been repurposed yet.
- **Purpose**: Turn every long-form asset into a week of channel-native content.
- **Skills used**: `social`, `content-strategy`, `copywriting`
- **Loop body**:
  1. Find the newest un-repurposed asset.
  2. Extract the 3–5 strongest ideas.
  3. Draft channel-native versions (LinkedIn post, X thread, short-form script).
  4. Stage in the scheduling queue.
- **Self-check**: Does each piece stand alone, or read like a link-dump? Rewrite anything that only works with the original open.
- **State / idempotency**: Mark assets as repurposed; never re-process one.
- **Stop / bail-out**: Nothing new published → skip.
- **Output**: Drafts in the social queue for approval.

### The content-calendar refill loop
- **Check cadence**: Weekly
- **Acts when**: The editorial pipeline has fewer than N weeks of planned content queued.
- **Purpose**: Keep the content pipeline from running dry.
- **Skills used**: `content-strategy`, `marketing-ideas`, `seo-audit`
- **Loop body**:
  1. Count planned/drafted pieces remaining in the calendar.
  2. If below the buffer, generate new topic ideas from the keyword-gap output, customer questions, and pillar plan.
  3. Prioritize and slot them.
- **Self-check**: Do new topics map to real search demand or audience questions, not just "content for content's sake"?
- **State / idempotency**: Dedupe proposed topics against the existing calendar and published archive.
- **Stop / bail-out**: Pipeline above buffer → skip.
- **Output**: New prioritized topics added to the calendar.

---

## Paid

### The ad-fatigue loop
- **Check cadence**: Every 2–3 days
- **Acts when**: An ad shows rising frequency + declining CTR/CVR past a real significance bar.
- **Purpose**: Refresh creative before CPA drifts up as ads fatigue.
- **Skills used**: `ads`, `ad-creative`, `analytics`
- **Loop body**:
  1. Pull per-ad metrics: CTR, frequency, CPA, spend, trend vs. baseline.
  2. Flag fatiguing ads and clear winners.
  3. Generate 3–5 fresh variants off the winning angle.
  4. Stage variants; recommend budget shift fatigued → winning.
- **Self-check**: Enough spend, impressions, and conversions to read CPA past the attribution window, and the ad is out of the learning phase. Rising frequency alone with thin conversion data is not fatigue evidence — wait.
- **State / idempotency**: Track per-ad last-refresh date; don't regenerate variants for an ad refreshed within the cooldown.
- **Stop / bail-out**: Never auto-shift budget or publish without a human checkpoint unless spend caps + an allowlist are explicitly authorized. Halt if daily spend exceeds its cap.
- **Output**: Staged creative drafts + a recommended budget move.

### The paid-search query-mining loop
- **Check cadence**: Weekly
- **Acts when**: Search-term reports reveal wasted spend or new intent.
- **Purpose**: Continuously refine keywords, negatives, and landing-page mapping.
- **Skills used**: `ads`, `analytics`
- **Loop body**:
  1. Pull the search-terms report.
  2. Identify irrelevant terms (→ negatives), high-performing terms (→ new exact-match), and terms whose landing page is a poor match.
  3. Stage keyword/negative changes and landing-page notes.
- **Self-check**: Enough clicks/conversions per term to justify a change? Don't negate on a single click.
- **State / idempotency**: Track already-added negatives/keywords; never re-add.
- **Stop / bail-out**: No terms clear thresholds → skip. Stage changes for review before pushing to the account.
- **Output**: A staged list of negatives, new keywords, and LP mismatches.

### The retargeting-hygiene loop
- **Check cadence**: Weekly
- **Acts when**: Audiences are stale, too small, over-frequent, or missing exclusions.
- **Purpose**: Keep retargeting efficient and non-annoying.
- **Skills used**: `ads`, `analytics`
- **Loop body**:
  1. Review retargeting audiences: size, recency, frequency, exclusions, creative sequencing.
  2. Flag issues (converters not excluded, audiences too small to serve, frequency too high).
  3. Recommend fixes.
- **Self-check**: Is the audience actually underperforming, or just small-but-valuable? Don't kill high-intent segments for size.
- **State / idempotency**: Track which audiences were already fixed this cycle.
- **Stop / bail-out**: All healthy → skip. Human-approve audience deletions.
- **Output**: A hygiene report with recommended audience changes.

### The landing-page regression loop
- **Check cadence**: Weekly (or on deploy)
- **Acts when**: A top acquisition page regresses on conversion, speed, tracking, or form function.
- **Purpose**: Catch silent breakage on the pages that receive paid/organic traffic.
- **Skills used**: `cro`, `analytics`
- **Loop body**:
  1. Monitor top acquisition pages: conversion rate, load speed, form submits, tracking fires.
  2. Flag regressions vs. baseline; correlate with recent deploys/changes.
  3. Diagnose and propose a fix.
- **Self-check**: Rule out tracking breakage vs. a real conversion drop before raising an alarm — and vice versa.
- **State / idempotency**: Track open regressions; update rather than re-file.
- **Stop / bail-out**: No regression → log "stable." Escalate a live-revenue-page break immediately, don't wait for the next run.
- **Output**: A regression alert with cause + fix.

---

## Earned, Social & Partnerships

### The newsjacking loop
- **Check cadence**: Daily
- **Acts when**: A trending story matches the brand's space, clears newsworthiness + fit, **and** passes the veto list.
- **Purpose**: Ride relevant news with a timely angle before the window closes.
- **Skills used**: `public-relations`, `social`
- **Loop body**:
  1. Scan news/HN/Reddit/X for stories intersecting the product's space.
  2. Score newsworthiness + fit + reach.
  3. Run the veto list. For a surviving top story, draft an angle (post, pitch, or commentary).
- **Self-check**: Is the angle genuinely additive, or forced? Kill forced takes — they cost credibility.
- **Veto list (skip immediately)**: tragedies, deaths, disasters, active crises; politically or socially charged stories unless the brand explicitly takes such stances; legal/medical/financial-sensitive topics; anything sourced from an unverified/single unreliable source.
- **State / idempotency**: Dedupe on story ID; one angle per story; never re-pitch a covered story.
- **Stop / bail-out**: Any veto trip → skip. Always require human approval before pitching/posting. Most days will skip — that's correct.
- **Output**: A staged post/pitch for human approval, or nothing.

### The social-listening loop
- **Check cadence**: Daily
- **Acts when**: A thread/mention clears the ICP-fit + intent + reach score.
- **Purpose**: Surface the highest-value conversations to engage in, instead of scrolling feeds.
- **Skills used**: `social` (see its `references/listening.md`), `community-marketing`
- **Loop body**:
  1. Pull mentions and relevant threads across configured sources.
  2. Score by ICP fit, intent, reach, and comment opportunity.
  3. Draft comments/replies for the top handful.
- **Self-check**: Would a human recognize each reply as genuinely useful, not promotional?
- **State / idempotency**: Track already-engaged threads; never double-reply. Respect a per-account interaction cooldown.
- **Stop / bail-out**: Nothing clears the threshold → skip. Stage replies for human post (don't auto-post — bot-detection + brand risk).
- **Output**: A short list of threads with drafted, on-brand replies.

### The community-engagement loop
- **Check cadence**: Daily
- **Acts when**: A target community (subreddit/Slack/Discord/forum) has a relevant thread where a helpful, non-promotional reply fits.
- **Purpose**: Build durable presence and trust in the communities where the ICP lives.
- **Skills used**: `community-marketing`, `social`
- **Loop body**:
  1. Scan configured communities for relevant threads/questions.
  2. Score for genuine help opportunity (not just keyword match).
  3. Draft value-first replies; note any that warrant a longer resource.
- **Self-check**: Does the reply lead with help and respect community norms? Self-promo ratio stays low.
- **State / idempotency**: Track engaged threads + per-community posting cadence to avoid over-posting.
- **Stop / bail-out**: No genuine-help opportunity → skip. Stage for human review where communities are strict about vendors.
- **Output**: Drafted community replies + resource ideas.

### The competitor-watch loop
- **Check cadence**: Weekly
- **Acts when**: A competitor makes a substantive pricing, positioning, product, or messaging change.
- **Purpose**: Catch competitor moves early enough to respond.
- **Skills used**: `competitor-profiling`, `competitors`, `product-marketing`
- **Loop body**:
  1. Fetch competitor pricing pages, homepages, changelogs, recent posts.
  2. Diff vs. last snapshot.
  3. Summarize meaningful changes; flag anything needing a response (comparison-page update, counter-messaging).
- **Self-check**: Substantive vs. cosmetic? Don't raise a copy tweak as a strategic shift.
- **State / idempotency**: Store per-competitor snapshots; diff against the last, and don't re-flag a known change.
- **Stop / bail-out**: No meaningful diffs → log "no change."
- **Output**: A change digest + recommended responses.

### The backlink-prospecting loop
- **Check cadence**: Weekly
- **Acts when**: New relevant link/guest-post/mention targets appear (or the pipeline is thin).
- **Purpose**: Keep a steady flow of link-building and earned-mention opportunities.
- **Skills used**: `public-relations`, `seo-audit`
- **Loop body**:
  1. Find new prospects: sites linking to competitors, relevant roundups, unlinked brand mentions, resource pages.
  2. Qualify by relevance + authority.
  3. Draft outreach angles for the top targets.
- **Self-check**: Is the target genuinely relevant, or a low-quality link that could hurt? Skip spammy sites.
- **State / idempotency**: Track already-contacted targets + outcomes; respect a follow-up cadence, don't re-pitch cold.
- **Stop / bail-out**: No qualified new targets → skip. Human-approve outreach sends.
- **Output**: A qualified prospect list with drafted outreach.

### The directory-submission loop
- **Check cadence**: Monthly
- **Acts when**: A relevant new directory/launch platform/marketplace exists that the product isn't listed on.
- **Purpose**: Steadily expand distribution and referral/SEO footprint via directories.
- **Skills used**: `directory-submissions`
- **Loop body**:
  1. Check for new/relevant directories, launch sites, and marketplaces.
  2. Qualify by relevance, authority, and audience fit.
  3. Prepare listing copy/assets for the top ones.
- **Self-check**: Real audience/SEO value, or a link farm? Skip low-quality directories.
- **State / idempotency**: Maintain a submitted-directories list; never resubmit.
- **Stop / bail-out**: No worthwhile new directories → skip.
- **Output**: Prepared listings staged for submission.

### The partner-pipeline loop
- **Check cadence**: Monthly
- **Acts when**: A viable co-marketing, integration, affiliate, or newsletter-swap opportunity surfaces (or the pipeline is thin).
- **Purpose**: Keep a fresh pipeline of partnership and co-marketing opportunities.
- **Skills used**: `co-marketing`, `referrals`
- **Loop body**:
  1. Scan for potential partners (complementary tools, aligned audiences, active newsletters, integration targets).
  2. Qualify by audience overlap + reach + fit.
  3. Draft partnership/swap outreach for the top prospects.
- **Self-check**: Real audience overlap and mutual value, or a one-sided ask? Skip mismatches.
- **State / idempotency**: Track contacted partners + status; respect follow-up cadence.
- **Stop / bail-out**: No qualified opportunities → skip. Human-approve outreach.
- **Output**: A qualified partner list with drafted outreach.

---

## Activation

### The onboarding drop-off loop
- **Check cadence**: Weekly
- **Acts when**: An onboarding step's drop exceeds benchmark or regresses vs. last period.
- **Purpose**: Find and fix the biggest leak between signup and first value.
- **Skills used**: `onboarding`, `analytics`, `cro`
- **Loop body**:
  1. Pull the activation funnel step-by-step (signup → key action → aha).
  2. Identify the worst-dropping step vs. benchmark and last period.
  3. Diagnose likely cause; propose one focused fix + how to measure it.
- **Self-check**: Enough new users through the funnel for step rates to be significant?
- **State / idempotency**: Track which fixes were already proposed/shipped; measure their effect before re-touching.
- **Stop / bail-out**: Sample too small → widen window or skip.
- **Output**: One prioritized activation fix with a measurement plan.

### The signup-funnel-leak loop
- **Check cadence**: Weekly
- **Acts when**: A signup/checkout step regresses vs. baseline.
- **Purpose**: Keep the signup/checkout path converting as the site changes.
- **Skills used**: `signup`, `cro`, `analytics`, `ab-testing`
- **Loop body**:
  1. Pull conversion by step across the signup/checkout flow.
  2. Compare to baseline; flag regressions (a deploy or copy change may have hurt it).
  3. Draft a hypothesis + test for the worst step (hand test execution to `ab-testing`).
- **Self-check**: Rule out tracking breakage before declaring a real drop.
- **State / idempotency**: Track open regressions + running tests; don't start a conflicting test.
- **Stop / bail-out**: No regression and no test-worthy idea → skip.
- **Output**: A prioritized experiment brief for `ab-testing`.

### The lead-capture-asset loop
- **Check cadence**: Monthly
- **Acts when**: A lead magnet, free tool, or opt-in underperforms on capture rate.
- **Purpose**: Keep top-of-funnel capture assets (lead magnets + free tools) converting visitors to leads.
- **Skills used**: `lead-magnets`, `free-tools`, `cro`, `popups`
- **Loop body**:
  1. Pull view → capture conversion for each lead magnet, free tool, and opt-in.
  2. Flag underperformers vs. benchmark; diagnose (offer, placement, form friction, targeting).
  3. Propose a fix or refresh (new angle, better placement, reduced friction).
- **Self-check**: Enough traffic per asset for the capture rate to be meaningful?
- **State / idempotency**: Track last-optimized date per asset; cooldown before re-touching.
- **Stop / bail-out**: All assets healthy → skip.
- **Output**: A prioritized fix per underperforming asset.

### The feature-adoption loop
- **Check cadence**: Weekly
- **Acts when**: A sticky/valuable feature is underused by a segment that would benefit.
- **Purpose**: Drive adoption of the features that correlate with retention.
- **Skills used**: `onboarding`, `emails`, `analytics`
- **Loop body**:
  1. Identify high-retention-correlated features and the segments not using them.
  2. Pick the highest-leverage feature × segment.
  3. Draft an in-app nudge or email to drive adoption.
- **Self-check**: Is the feature genuinely valuable to that segment, or would the nudge be noise? Don't push features people rationally skip.
- **State / idempotency**: Track who's already been nudged for which feature; enforce a cooldown; suppress adopters.
- **Stop / bail-out**: No clear feature × segment gap → skip.
- **Output**: A staged adoption nudge.

---

## Retention

### The churn-signal loop
- **Check cadence**: Daily (or on-trigger)
- **Acts when**: An account newly crosses a churn-risk threshold and isn't already in an intervention.
- **Purpose**: Intervene inside the short window before an at-risk account leaves.
- **Skills used**: `churn-prevention`, `analytics`, `emails`
- **Loop body**:
  1. Score accounts on churn-risk signals (usage decline, seat drop, dunning, support escalations).
  2. Segment newly at-risk accounts.
  3. Match each to the right intervention (re-engagement email, CS outreach, offer); stage it.
- **Self-check**: Is the "drop" a real trend or a weekend/holiday dip? Compare to the account's own baseline.
- **State / idempotency**: Never re-trigger on an account already in an active intervention; enforce a cooldown between attempts.
- **Stop / bail-out**: No newly at-risk accounts → skip. Escalate high-value accounts to a human rather than auto-emailing.
- **Output**: A prioritized at-risk list with staged interventions.

### The lifecycle-email-refresh loop
- **Check cadence**: Monthly
- **Acts when**: A sequence email underperforms on real engagement or contains stale content.
- **Purpose**: Keep automated sequences performing as the product and audience evolve.
- **Skills used**: `emails`, `analytics`, `copy-editing`
- **Loop body**:
  1. Pull per-email performance — clicks, conversions, replies, unsubscribes, spam complaints, bounces (**not opens** — open tracking is unreliable post-privacy-changes).
  2. Flag weak performers and stale references (old features, dates, pricing).
  3. Draft rewrites or subject-line tests for the bottom performers.
- **Self-check**: Enough sends per email for rates to be meaningful?
- **State / idempotency**: Track last-revised date per email; cooldown before re-testing.
- **Stop / bail-out**: All sequences healthy → skip. **Pause and escalate any sequence with rising complaint/bounce rates — that's a deliverability emergency, not a copy tweak.**
- **Output**: Staged email rewrites + subject-line tests.

### The re-engagement loop
- **Check cadence**: Weekly
- **Acts when**: A user newly crosses the inactivity threshold.
- **Purpose**: Win back dormant users before they're gone for good.
- **Skills used**: `emails`, `sms`, `offers`
- **Loop body**:
  1. Identify users newly crossing the inactivity threshold.
  2. Pick the win-back angle (new feature, offer, "we miss you," sunset warning).
  3. Draft the message; set suppression so they aren't re-hit next week.
- **Self-check**: Truly dormant, or just low-frequency-by-design users? Don't nag healthy accounts.
- **State / idempotency**: Track win-back attempts per user; suppress after each send for the cooldown.
- **Stop / bail-out**: After N unsuccessful attempts, move to sunset — not another email.
- **Output**: A staged win-back message + updated suppression list.

### The email-deliverability loop
- **Check cadence**: Weekly
- **Acts when**: Bounce, complaint, or unsubscribe rates rise, or list-hygiene decays.
- **Purpose**: Protect sender reputation and inbox placement.
- **Skills used**: `emails`, `analytics`
- **Loop body**:
  1. Monitor bounces, spam complaints, unsubscribes, domain/DKIM/SPF/DMARC health, and inbox-placement signals.
  2. Flag rising problem rates or authentication issues.
  3. Recommend actions: suppress hard bounces, sunset chronically unengaged, fix auth, throttle.
- **Self-check**: Is a spike a one-off send or a trend? Correlate with recent campaigns.
- **State / idempotency**: Track already-suppressed addresses + last hygiene sweep date.
- **Stop / bail-out**: All metrics healthy → log and skip. **Escalate a complaint-rate spike immediately** — reputation damage compounds fast.
- **Output**: A deliverability report + a suppression/hygiene action list.

### The voice-of-customer loop
- **Check cadence**: Weekly
- **Acts when**: New feedback (NPS, surveys, support tickets, reviews, calls) has arrived.
- **Purpose**: Route feedback to the right action **and** mine it for marketing inputs.
- **Skills used**: `customer-research`, `churn-prevention`, `referrals`, `copywriting`
- **Loop body**:
  1. Collect new feedback across sources.
  2. Route: detractors/at-risk → save motion (`churn-prevention`); promoters → referral/review ask (`referrals`); recurring pain/desire → experiment + copy inputs.
  3. Extract verbatim customer language for copy, FAQ, and objection-handling.
- **Self-check**: Is a theme a real pattern or one loud voice? Require a minimum count before acting on it.
- **State / idempotency**: Track processed feedback IDs; never double-route the same item.
- **Stop / bail-out**: No new feedback → skip. Escalate sensitive/legal complaints to a human.
- **Output**: Routed actions + a language/insight digest for marketing.

---

## Revenue

### The trial-conversion loop
- **Check cadence**: Daily
- **Acts when**: A trial user reaches a conversion-relevant moment (mid-trial, near-expiry, activated-but-not-paid).
- **Purpose**: Move more trials to paid with well-timed nudges.
- **Skills used**: `emails`, `paywalls`, `analytics`, `offers`
- **Loop body**:
  1. Segment active trials by stage and activation level.
  2. Match each to the right nudge (value recap, use-case tip, near-expiry push, offer).
  3. Stage the nudge.
- **Self-check**: Is the user activated enough for a paid push to land, or do they need more value first?
- **State / idempotency**: Track nudges sent per trial; enforce cadence; suppress converters.
- **Stop / bail-out**: No trials at an actionable stage → skip. Don't over-message a single trial.
- **Output**: Staged, stage-appropriate trial nudges.

### The PQL / upgrade-intent loop
- **Check cadence**: Daily
- **Acts when**: A free/trial user shows product-qualified buying intent (usage limits, key-feature use, team invites).
- **Purpose**: Catch high-intent users and stage upgrade outreach at the right moment.
- **Skills used**: `analytics`, `sales-enablement`, `revops`
- **Loop body**:
  1. Score free/trial users on PQL signals.
  2. Surface newly qualified users.
  3. Stage the right motion (in-app upgrade prompt, sales-assist for high-value, targeted email).
- **Self-check**: Is the signal genuine buying intent or incidental usage? Calibrate the threshold to avoid false positives.
- **State / idempotency**: Track already-actioned PQLs; don't re-route within the cooldown.
- **Stop / bail-out**: No newly qualified users → skip. Route high-value accounts to a human, don't auto-close.
- **Output**: A prioritized PQL list with staged motions.

### The pricing-page-experiment loop
- **Check cadence**: Monthly (tests run longer)
- **Acts when**: No test is running on the page and there's a worthwhile hypothesis — or a running test has concluded.
- **Purpose**: Improve pricing-page conversion **and revenue quality**, continuously.
- **Skills used**: `pricing`, `ab-testing`, `cro`
- **Loop body**:
  1. Review pricing-page conversion, plan mix, and revenue-per-visitor.
  2. Generate one pricing/packaging/copy hypothesis, or read a concluded test.
  3. Hand design/analysis to `ab-testing`; promote a clean winner.
- **Self-check**: Judge winners on **revenue per visitor, plan mix, refunds, downgrades, churn, and support load — not conversion rate alone.** Is the running test statistically done before you call it?
- **State / idempotency**: Track the running test + concluded-test log; never start a conflicting test on the same page.
- **Stop / bail-out**: A test is in flight → hold. **Do not promote a variant that lifts conversion but lowers revenue-per-visitor or raises refunds/churn.**
- **Output**: A test result + next hypothesis.

### The paywall-optimization loop
- **Check cadence**: Monthly
- **Acts when**: No paywall test is running and there's a hypothesis — or one has concluded.
- **Purpose**: Improve in-app upgrade conversion without degrading revenue quality.
- **Skills used**: `paywalls`, `ab-testing`, `analytics`
- **Loop body**:
  1. Pull paywall view → upgrade conversion and bounce points.
  2. Form one hypothesis (trigger timing, framing, plan anchor), or read a concluded test.
  3. Hand execution to `ab-testing`.
- **Self-check**: Segment by plan/cohort — an aggregate number can hide a segment that's tanking. Watch refunds/downgrades alongside conversion.
- **State / idempotency**: Track running/concluded tests; no conflicting tests.
- **Stop / bail-out**: Test in flight → hold. Don't promote a conversion win that raises refunds or churn.
- **Output**: A test result + next hypothesis.

### The expansion / upsell loop
- **Check cadence**: Weekly
- **Acts when**: An existing paid account hits an expansion signal (usage near limits, added seats, new use case).
- **Purpose**: Grow revenue from existing customers via well-timed upsell/cross-sell.
- **Skills used**: `revops`, `sales-enablement`, `emails`
- **Loop body**:
  1. Score paid accounts on expansion signals.
  2. Surface newly expansion-ready accounts.
  3. Stage the right motion (usage-based upgrade prompt, CSM outreach, cross-sell offer).
- **Self-check**: Is the account healthy enough that an upsell won't sour the relationship? Don't upsell an at-risk account — that's a churn loop's job.
- **State / idempotency**: Track upsell touches per account; enforce cadence.
- **Stop / bail-out**: No expansion-ready accounts → skip. Route strategic accounts to a human.
- **Output**: A prioritized expansion list with staged motions.

### The failed-payment / dunning loop
- **Check cadence**: Daily
- **Acts when**: A payment fails or a card is about to expire.
- **Purpose**: Recover involuntary churn — often the highest-ROI retention work.
- **Skills used**: `revops`, `emails`
- **Loop body**:
  1. Detect failed payments and upcoming card expirations.
  2. Trigger the dunning sequence (retry schedule + escalating update-card messaging).
  3. Route persistent failures to a human/CS.
- **Self-check**: Is the failure involuntary (card issue) vs. an intentional cancel? Don't dun someone who chose to leave.
- **State / idempotency**: Track dunning stage per account; follow the retry schedule; stop on recovery.
- **Stop / bail-out**: After the final retry, escalate/deactivate per policy — don't loop forever.
- **Output**: An active dunning queue + recovery status.

---

## Referral & Advocacy

### The referral-nudge loop
- **Check cadence**: Weekly
- **Acts when**: A user hits a "happy moment" (milestone, positive NPS) and hasn't been asked recently.
- **Purpose**: Ask for referrals when users are most delighted.
- **Skills used**: `referrals`, `emails`
- **Loop body**:
  1. Identify users who just hit a happy moment and aren't in the ask-cooldown.
  2. Match to the right ask (share link, incentive, review request).
  3. Stage the ask.
- **Self-check**: Genuinely a happy moment, or just any event? A bad-timing ask erodes goodwill.
- **State / idempotency**: Enforce a cooldown — never ask the same user twice in the window.
- **Stop / bail-out**: No one at a happy moment → skip.
- **Output**: A staged, well-timed referral ask.

### The review-and-UGC-harvest loop
- **Check cadence**: Weekly
- **Acts when**: New reviews, testimonials, or user-generated content have appeared.
- **Purpose**: Keep a steady flow of social proof and route it into marketing.
- **Skills used**: `social`, `referrals`, `sales-enablement`, `cro`
- **Loop body**:
  1. Collect new reviews/testimonials/UGC/mentions since last run.
  2. Sort by strength and relevance.
  3. Draft where each should go (site proof section, ad, social post, sales deck).
  4. Flag anything negative for a human response.
- **Self-check**: Is it genuinely strong and on-message? Don't force weak proof into prime placement.
- **State / idempotency**: Track already-harvested items; never re-use the same one twice.
- **Stop / bail-out**: **Verify consent and platform ToS before public reuse; add FTC-required disclosure for incentivized content.** No verifiable consent, or platform prohibits reuse → don't use. Negative/sensitive → escalate to a human, don't auto-publish.
- **Output**: New proof assets routed to their destinations.

### The review-site-management loop
- **Check cadence**: Weekly
- **Acts when**: New reviews land on G2/Capterra/app stores, or listings drift out of date.
- **Purpose**: Maintain reputation and conversion on third-party review platforms.
- **Skills used**: `sales-enablement`, `social`, `cro`
- **Loop body**:
  1. Track new reviews across review sites/app stores.
  2. Draft responses (thank promoters, address detractors constructively).
  3. Flag listing updates needed (screenshots, features, pricing).
- **Self-check**: Is the response specific and non-defensive? Never argue publicly with a reviewer.
- **State / idempotency**: Track responded reviews; never double-respond.
- **Stop / bail-out**: No new reviews/updates → skip. Human-approve responses to negative/legal-sensitive reviews.
- **Output**: Drafted responses + a listing-update checklist.

### The case-study-sourcing loop
- **Check cadence**: Monthly
- **Acts when**: A customer hits case-study-worthy success (strong results, milestone, enthusiastic feedback).
- **Purpose**: Keep a pipeline of case studies and customer stories.
- **Skills used**: `sales-enablement`, `customer-research`, `referrals`
- **Loop body**:
  1. Identify customers with standout results/engagement.
  2. Qualify for a case study (results, willingness, logo value).
  3. Draft the outreach + interview questions.
- **Self-check**: Are the results real and attributable, or coincidental? Verify before pitching a story.
- **State / idempotency**: Track approached customers + status; respect a no-repeat cooldown.
- **Stop / bail-out**: No qualified candidates → skip. Human-approve customer outreach.
- **Output**: A candidate list with drafted outreach.

---

## Ongoing Ops / Meta

### The weekly-marketing-review loop
- **Check cadence**: Weekly (Mon 9am)
- **Acts when**: Always runs — this is the heartbeat. It "acts" by flagging the week's notable movers.
- **Purpose**: One standing full-funnel pulse so nothing drifts unnoticed.
- **Skills used**: `analytics`, `marketing-plan`, `marketing-ideas`
- **Loop body**:
  1. Pull top-line AARRR metrics vs. last week and vs. plan.
  2. Flag the biggest mover (good and bad) per stage.
  3. Tie each flag to the loop or skill that should act on it; surface 1–2 experiment ideas.
- **Self-check**: Distinguish trend from noise before raising an alarm.
- **State / idempotency**: Store each week's snapshot for accurate week-over-week deltas.
- **Stop / bail-out**: Manual disable + error-halt. On a data-source outage, report "stale data," never fabricated movement. (Not "n/a" — even the heartbeat needs an off switch and an error path.)
- **Output**: A one-page weekly digest with owners/next actions.

### The experiment-backlog loop
- **Check cadence**: Weekly
- **Acts when**: New hypotheses exist to log, the backlog needs re-ranking, or a test slot is free.
- **Purpose**: Keep the experiment pipeline full and prioritized. **Thin wrapper — defer all test design, statistical analysis, and velocity management to `ab-testing`.**
- **Skills used**: `ab-testing` (owner), `cro`, `analytics`
- **Loop body**:
  1. Harvest new hypotheses from the week (data, research, competitors, support, other loops).
  2. Re-rank the backlog with ICE.
  3. If a slot is free, hand the top idea to `ab-testing`; if a test concluded there, log the learning.
- **Self-check**: Is the top idea actually testable with current traffic, or ICE-inflated?
- **State / idempotency**: Dedupe incoming hypotheses against the backlog; track which tests are live.
- **Stop / bail-out**: Backlog full and a test running → just log new ideas. Don't duplicate `ab-testing`'s job.
- **Output**: An updated, ranked backlog (the source of record lives with `ab-testing`).

### The analytics-anomaly loop
- **Check cadence**: Daily
- **Acts when**: A tracked metric breaks its expected band (spike or drop beyond normal variance).
- **Purpose**: Catch anything breaking — good or bad — before it runs for days unnoticed.
- **Skills used**: `analytics`
- **Loop body**:
  1. Check key metrics (traffic, signups, conversion, revenue, spend) against their normal range.
  2. Flag anomalies; separate "real event" from "tracking artifact."
  3. Route each to the responsible loop/owner for diagnosis.
- **Self-check**: Is the anomaly real or a tracking/seasonality artifact? Check for known causes (holiday, launch, deploy) before alarming.
- **State / idempotency**: Track already-alerted anomalies; don't re-alert the same ongoing one daily.
- **Stop / bail-out**: All metrics in-band → silent (no alert = good). Escalate a revenue/spend anomaly immediately.
- **Output**: An anomaly alert routed to an owner, or nothing.

### The brand-mention / reputation loop
- **Check cadence**: Daily
- **Acts when**: A meaningful brand mention appears anywhere (not just where you're listening for engagement).
- **Purpose**: Monitor and protect reputation; respond where it matters.
- **Skills used**: `social`, `public-relations`
- **Loop body**:
  1. Scan the open web/social/forums for brand mentions.
  2. Classify sentiment + reach + risk.
  3. Route: positive → amplify/thank; negative/risky → drafted response for human review; unlinked mention → backlink-prospecting.
- **Self-check**: Does a negative mention need a response, or would engaging amplify it? Judge reach + legitimacy.
- **State / idempotency**: Dedupe on mention ID; track handled mentions.
- **Stop / bail-out**: No meaningful mentions → skip. **Always human-approve responses to negative/crisis mentions** — never auto-reply to a complaint.
- **Output**: A mention digest with routed actions.

### The tracking-QA loop
- **Check cadence**: Weekly (and on deploy / campaign launch)
- **Acts when**: Analytics, pixels, UTMs, or conversion events are missing, misfiring, or misconfigured.
- **Purpose**: Keep the measurement layer trustworthy — every other loop depends on it.
- **Skills used**: `analytics`
- **Loop body**:
  1. Verify key events fire correctly, pixels are present, UTMs are consistent, and conversions attribute.
  2. Flag broken/missing/duplicate tracking, especially after deploys or new campaigns.
  3. Recommend fixes.
- **Self-check**: Is it truly broken, or an expected change? Confirm against a known-good baseline.
- **State / idempotency**: Track open tracking issues; update rather than re-file.
- **Stop / bail-out**: All tracking healthy → log "clean." **Escalate a broken revenue/conversion event immediately** — every downstream loop is blind until it's fixed.
- **Output**: A tracking-QA report with prioritized fixes.

### The campaign-postmortem loop
- **Check cadence**: On campaign end (event-based)
- **Acts when**: A campaign (launch, promo, seasonal push) concludes.
- **Purpose**: Capture results, lessons, and reusable assets so each campaign compounds.
- **Skills used**: `analytics`, `marketing-plan`
- **Loop body**:
  1. Pull final campaign results vs. goals.
  2. Capture what worked, what didn't, and why; save reusable assets (copy, creative, workflows).
  3. Feed learnings into the experiment backlog and the next plan; log follow-ups.
- **Self-check**: Are conclusions supported by the data, or hindsight narrative? Separate correlation from cause.
- **State / idempotency**: One postmortem per campaign; don't re-run on an already-documented campaign.
- **Stop / bail-out**: No concluded campaign → skip.
- **Output**: A postmortem doc + backlog/plan inputs.

---

## Adapting and authoring loops

To adapt a loop: keep all nine anatomy parts, swap skills/thresholds for the user's stack, and re-tune cadence to signal speed. To author a brand-new one: use `loop-template.md` (copy-paste template + fill-in prompts + worked example + ship checklist). Either way, do not ship a loop until every part is filled — especially **State / idempotency**, **Self-check**, and **Stop / bail-out**. A loop without those isn't a system; it's a way to do the wrong thing on a schedule, repeatedly, to the same people.
