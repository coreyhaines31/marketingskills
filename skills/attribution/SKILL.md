---
name: attribution
description: When the user wants to figure out which marketing actually drives conversions and revenue, choose or interpret an attribution model, or reconcile conflicting numbers across tools. Also use when the user mentions "attribution," "attribution model," "first-touch vs last-touch," "multi-touch," "which channel drives revenue," "what's my real CAC," "my dashboards disagree," "Google/Meta says X but GA says Y," "media mix model," "MMM," "incrementality," "geo lift," "holdout test," "how did you hear about us," "self-reported attribution," "dark social," or wants to instrument attribution themselves — "stitch my bookings to their source," "SavvyCal/Calendly attribution," "close the identify gap," "track conversions on a third-party domain," "first-party / self-hosted attribution." For event tracking setup and UTMs, see analytics. For ad-platform pixels/CAPI, see ads. For pipeline and CRM revenue reporting, see revops. For the AI-search attribution blind spot, see ai-seo.
metadata:
  version: 1.0.0
---

# Attribution

You help users answer the hardest question in marketing: **which of my efforts actually caused this conversion and this revenue?** Attribution is where marketers lose the most money — to channels that look good in one dashboard and terrible in another, to "direct" and "branded search" that hide the real source, and to models that quietly encode an opinion as if it were fact.

This skill has two pillars. Know which one the user needs before you dive in:

- **(A) Interpretation** — choosing an attribution model, picking a measurement approach, and *reconciling the conflicting numbers* your tools report. This applies to everyone, even with zero engineering.
- **(B) Own your attribution (first-party)** — instrumenting and stitching attribution *yourself* when you control the site/app. This is the build track. Use it when the user says "I want to track this myself" or is hitting a conversion that lives on a domain they don't own.

Most requests start with (A). Reach for (B) only when they control the surface and want to build.

Product context: check for `.agents/product-marketing.md` and read it if present — business type, sales cycle, and primary conversion drive almost every recommendation here.

## Boundaries — what this skill does NOT own

State these up front so you don't rebuild neighboring skills:

- **General event tracking, tracking plans, UTM setup, GA4/GTM** → **analytics**. Attribution *assumes tracking exists*. The line: analytics = "what events and how to fire them"; attribution = "how touches join to conversions and survive to revenue."
- **Ad-platform pixels, CAPI, server-side conversion tracking** → **ads** (`references/conversion-tracking.md`). Attribution consumes platform-reported numbers and corrects for their bias; it doesn't set up the pixels.
- **Pipeline stages, lead lifecycle, CRM revenue dashboards** → **revops**. Attribution feeds pipeline data; it doesn't define stages.
- **Showing up in / measuring AI search** → **ai-seo**. Attribution names AI traffic as a blind spot only.

---

## Pillar A — Interpretation

### 1. What attribution can and can't tell you

Set expectations before touching a number:

- **Attribution is directional, not truth.** It's a model of causality built from incomplete data (cookies expire, sessions fragment, offline touches vanish, people research on one device and buy on another). Treat it as a strong hint, never a verdict.
- **Every model is an opinion.** "First-touch" says the first ad gets all the credit; "last-touch" says the closing click does. Both are wrong in opposite directions. Choosing a model is choosing whose story to believe — say so out loud.
- **The attribution gap is normal.** The sum of channel-reported conversions almost always exceeds real conversions, because every platform claims credit for the same sale. Your job is to shrink and explain the gap, not to make the numbers tie out perfectly. They won't.

When a user demands one true number, reframe: "We can get you a *defensible, consistent* number and a read on which channels are trending up. A single objective truth doesn't exist — here's why, and here's what we use to make decisions anyway."

### 2. Attribution models

The six standard models and when each one lies:

| Model | Credit rule | Best for | How it lies |
|---|---|---|---|
| **First-touch** | 100% to the first known touch | Top-of-funnel / demand-gen valuation; short cycles | Ignores everything that closed the deal; over-credits awareness channels |
| **Last-touch** | 100% to the last touch before conversion | Direct-response, quick e-comm | Over-credits bottom-funnel + branded search/direct; ignores what created demand |
| **Last non-direct** | 100% to last touch, skipping "direct" | A cheap fix for direct pollution | Still single-touch; just moves the blind spot |
| **Linear** | Equal credit to every touch | Long, multi-touch journeys where every step matters | Treats a throwaway visit like a demo; flatters high-frequency channels |
| **Time-decay** | More credit to touches nearer conversion | Longer cycles where recency matters | Under-credits the top of funnel; still an assumption, not a measurement |
| **Position-based (U-shaped)** | 40% first, 40% last, 20% middle | B2B with clear "created" + "closed" moments | The 40/40/20 split is arbitrary; middle touches get shortchanged |
| **Data-driven (algorithmic/Shapley)** | Credit from modeled marginal contribution | High-volume accounts with enough conversions | A black box; needs volume; can't see offline/dark touches it was never fed |

**Rules of thumb:**
- Never report a single model in isolation for a long sales cycle. Show **first-touch and last-touch side by side** — the truth lives between them, and the gap between them *is* the insight.
- Data-driven attribution needs volume (Google Ads historically gated it behind ~3,000 ad interactions and ~300 conversions in 30 days; it has since relaxed the minimums and made DDA the default, but low volume still makes it noise dressed as science). Use position-based instead when you're thin.
- The model matters far less than being **consistent** and pairing it with an out-of-model sanity check (Pillar A §4, self-reported).

For the model math, worked examples of one journey scored six ways, and Shapley explained plainly, see `references/attribution-models.md`.

### 3. The three measurement paradigms

Models split credit *within* your tracked data. Paradigms are how you get at *causality* — increasingly rigorous, increasingly expensive:

| Paradigm | What it is | Answers | Needs | Watch out |
|---|---|---|---|---|
| **MTA** (multi-touch attribution) | Stitch user-level touches, apply a model | "Which touchpoints appear on converting journeys?" | Clean cross-device user-level tracking | Cookie loss + privacy have gutted user-level data; it silently under-measures |
| **MMM** (media/marketing mix modeling) | Top-down regression of spend vs. outcomes over time | "What's each channel's aggregate contribution, including offline/brand?" | 2–3 yrs of weekly data, spend variation | Correlational; slow to react; needs real budget swings to learn |
| **Incrementality** (geo holdout, PSA, ghost ads, on/off) | Controlled experiment: exposed vs. withheld | "Did this channel *cause* lift I wouldn't have gotten anyway?" | Ability to withhold; enough volume for significance | The gold standard, but you can only test a few things at a time |

**How to choose:** small budget / short cycle → good UTM + last-non-direct + a self-reported survey beats a fancy model. Mid budget, several channels → MTA for day-to-day + periodic incrementality tests on your biggest line items. Large budget, offline + brand spend → MMM for the portfolio + incrementality to validate MMM's coefficients. Incrementality is the tiebreaker whenever two channels both claim the same conversions.

Decision table by budget × sales cycle × channel count, and how to *read* a geo-holdout / PSA test (not a stats tutorial), in `references/measurement-paradigms.md`.

### 4. Self-reported attribution

The most underused signal, and often the most honest for long cycles and dark social. A post-conversion "How did you hear about us?" survey catches what tracking structurally cannot: podcasts, word of mouth, Slack communities, a founder's tweet, "a friend told me."

- **When it beats tracking:** long consideration cycles, high word-of-mouth, brand/community-led, or heavy dark-social (see §5). If a big slice of your journeys are "direct," you have a self-reported-shaped hole.
- **Ask at the moment of conversion** (signup, first purchase, demo request) — highest recall, before memory fades.
- **Wording:** open-ended ("How did you first hear about us?") captures dark social; a short pick-list is easier to quantify but pre-biases the answer. Best practice: pick-list of your known channels **plus a free-text "other/tell us more."**
- **Treat it as a triangulation input, not gospel** — recall is fuzzy and people credit the *memorable* touch, not the first. It's the out-of-model check that keeps your tracked models honest.
- On the build side, this is a form field written to your CRM/analytics as a person property — see Pillar B and `references/first-party-tracking.md`.

### 5. Reconciling conflicting sources

The request behind most attribution work: **"Google says 50, Meta says 40, GA says 60, my CRM says 35 — who's right?"** Nobody is. Here's the framework.

**Why each source systematically lies:**

| Source | Biased toward | Because |
|---|---|---|
| **Ad platforms** (Google/Meta/LinkedIn) | Over-counts *itself* | Claims view-through + click conversions in its own window; every platform counts the same sale; motivated to look good |
| **GA / web analytics** | Last non-direct click | Loses cross-device, loses cookie-blocked users, dumps the unknown into direct |
| **CRM** | Whatever the rep typed / the form captured | Human entry, lead-source overwrites, offline deals with no digital trail |
| **Self-reported survey** | The *memorable* touch | Recall bias; under-counts boring-but-real touches like retargeting |

**How to triangulate:**
1. **Pick one source of truth for the conversion count** — usually your CRM or backend (the system where money is real). Everything else explains *where those came from*, they don't get to redefine *how many*.
2. **Never sum across platforms.** If Google and Meta both claim a conversion, you have one conversion with two claimants, not two conversions. De-dupe against the source-of-truth total.
3. **Read directional agreement, not absolute match.** If every source says paid search is up and organic is down this quarter, that trend is trustworthy even though no two numbers match.
4. **Use self-reported as the tiebreaker** when platforms fight over the same conversions, and **incrementality** when the stakes justify a test.
5. **Expect and budget for the gap.** Report "platforms claim N; we can verify M; the delta is over-claiming + view-through + untracked — here's our best allocation."

The output is an honest allocation with confidence levels, not a false reconciliation to the decimal.

### 6. The blind spots

Where conversions hide, making real channels look weak:

- **Direct** — the junk drawer. Bookmarks and typed URLs, yes, but also stripped referrers, app-to-web, dark social, and any touch your tracking dropped. A large direct share is a *measurement* problem, not a channel.
- **Branded search** — people who discovered you elsewhere and Googled your name. Last-touch hands the credit to paid/organic *branded* search; the real driver was whatever made them search. Segment branded vs. non-branded or you'll defund the top of funnel.
- **Dark social** — sharing that carries no referrer: DMs, Slack/Discord, podcasts, newsletters, screenshots. Structurally invisible to tracking; self-reported is the only way to see it (§4).
- **AI traffic** — assistants and AI search increasingly influence buyers, then send them via branded search or direct, so the AI touch is invisible in analytics. Name it and hand deeper work to **ai-seo**.

The through-line: **when "direct" and "branded search" dominate, your top of funnel is working and your attribution is hiding it.** Say that explicitly — it's the single most common misread in marketing.

### 7. Business-type fork

Defaults differ sharply. Summary here; full playbooks in `references/by-business-type.md`.

- **B2B SaaS (long cycle, sales-assisted):** journeys span weeks–months and multiple people, so single-touch models mislead badly. Anchor on the **CRM as source of truth**, use **first-touch + position-based** side by side, lean hard on **self-reported at demo/signup**, and treat **pipeline/revenue** attribution (→ revops) as the real scoreboard. Offline touches (events, sales convos) make MTA weakest and self-reported strongest here.
- **Ecommerce / DTC (short cycle, self-serve):** fast journeys, high volume, spend concentrated in paid social + search. Anchor on **platform ROAS but distrust it** (iOS/CAPI inflation), validate with **MMM once spend is material** and **incrementality/geo-holdouts** on your biggest channels, and use a **post-purchase survey** to catch what pixels miss. Last-touch is defensible for quick-turn SKUs; MMM+incrementality is how you allocate the real budget.

---

## Pillar B — Own your attribution (first-party)

Use this when the user **controls the site/app** and wants to instrument attribution themselves — especially for a conversion that happens on a **domain they don't own** (a SavvyCal/Calendly/Cal.com booking, a Stripe Checkout page). This pillar is grounded in real production builds; the full runbook with code patterns is in `references/first-party-tracking.md`. The essentials:

### The identity graph

First-party attribution is one idea: **join anonymous browsing to the eventual conversion.**

1. A visitor arrives anonymously; your analytics tool assigns an **anonymous `distinct_id`** and stamps **first-touch properties** (`$initial_referrer`, `$initial_utm_*`) on their events.
2. At conversion (signup, booking, purchase) you call **`identify()`** with a stable id (email or user UUID). This **merges** the anonymous history into a known person — first-touch now survives all the way to the conversion.
3. Every conversion event can now be broken down by first-touch channel. That's the whole game.

### Closing the `identify()` gap

The most common first-party failure: **nothing ever calls `identify()`**, so conversions never join to browsing history and every customer looks like they appeared from nowhere. (Framing adapted from Tessa Kriesel's PostHog approach.) The fix is to call identify at each real conversion. **Audit first** — many SaaS apps already identify at signup; don't rebuild what works. Find the *specific* un-instrumented conversions and close only those.

### Stitching conversions on a third-party domain

The one case that needs real machinery: a conversion that completes on a domain you don't control (a booking tool, a hosted checkout). You can't run your analytics there, so:

1. **At click time**, a capture-phase link decorator appends the visitor's anonymous `distinct_id` to the outbound URL via the tool's **metadata passthrough** (e.g. `?metadata[ph_distinct_id]=<id>`). One document-level listener covers every CTA — no per-link edits.
2. The third-party tool stores that metadata and returns it in its **webhook**.
3. Your **webhook handler** fires an **identity merge** (`$identify` with the booking email as `distinct_id` and the smuggled anonymous id as `$anon_distinct_id`) plus a **conversion event** — joining the booking back onto the marketing journey.

### Guardrails (do not skip)

- **Anonymity guard — fail closed.** Only ever smuggle the *anonymous* id. After `identify()`, the current id becomes the user's email/UUID; leaking that into a third-party URL or merging on it corrupts profiles (person A's email folds into whoever books). Reject ids that look like PII (contain `@`), cap length, and when identity is ambiguous, **send nothing**. If the app identifies by UUID, test `distinct_id === device_id` rather than an `@` check.
- **First-touch data quality.** Redirects overwrite the true first touch. Exclude OAuth/checkout referrers (`accounts.google.com`, `checkout.stripe.com`, `login.*`), your own subdomains (self-referrals), and dev hosts (`localhost`) from referrer classification. This is usually a settings change, not code, and it's the highest-trust-per-effort fix.
- **Cross-subdomain stitching.** Marketing site → app on a subdomain must share one analytics project + a cross-subdomain cookie, or the journey breaks at the handoff. Expect **near-zero numbers until the stitch is verified in prod** — don't panic at empty data; use a campaign-window heuristic fallback and backfill the pre-stitch cohort in the meantime (details in the reference).

### Reporting and the last mile

The first payoff is one insight: your **conversion event broken down by first-touch channel** (`$initial_utm_source` / `$initial_referring_domain`), and — joined to revenue — **channel → conversion → revenue**. Confirm first-touch vs. last-touch config in the tool (many default to last-touch; first-party attribution wants `$initial_*`).

But first-touch alone can't run the multi-touch models from §2. **Store the full ordered touch path** (not just `$initial_*`) and the build track feeds the interpretation track — you can score your own journeys position-based / linear / time-decay instead of only reading about them.

**The last mile — get it into the CRM** (production refinement from Tessa Kriesel). A breakdown in an analytics tool is a report; sales and lifecycle act on attribution *written onto the record*. Sync a **`source` field with `confidence` and `basis`** (journey-linked vs self-reported vs campaign-window fallback) plus a **Paid-vs-Organic read** off the medium, **rolled up to the account** (not just the contact — one B2B org is several people with mixed work/personal emails). How pipeline/lifecycle then *use* it is **revops**' job.

The pattern is tool-agnostic: identify + merge exists in PostHog, Segment, Amplitude, and via user-id in GA4; the third-party stitch works with any tool that has a metadata passthrough + webhook. PostHog + SavvyCal are the worked example in `references/first-party-tracking.md`.

---

## Output format

Deliver an **attribution readout**, not a data dump:

```markdown
# Attribution Readout — [date]

## The question
[What decision this informs — e.g. "where should next quarter's budget go?"]

## Source of truth
[Which system defines the conversion count, and why]

## What each source says
| Channel | Platform-reported | GA | CRM | Self-reported | Our read |
|---------|------------------|----|----|--------------|----------|
[De-duped against source of truth; not summed]

## Model comparison (for long cycles)
[First-touch vs last-touch side by side; the gap is the insight]

## Confidence & gaps
[The attribution gap, the blind spots, what we can't see]

## Recommendation
[Allocation call with confidence levels; the tiebreaker test worth running]
```

## Tool Integrations

For implementation, see the [tools registry](../../tools/REGISTRY.md). Key tools:

| Tool | Best For | MCP | Guide |
|------|----------|:---:|-------|
| **PostHog** | First-party attribution, identify/merge, funnels | - | [posthog.md](../../tools/integrations/posthog.md) |
| **GA4** | Web analytics, model comparison, user-id stitching | ✓ | [ga4.md](../../tools/integrations/ga4.md) |
| **Dub** | Short-link + click attribution | ✓ | [dub-co.md](../../tools/integrations/dub-co.md) |
| **Segment** | CDP — route identify/track to every destination | - | [segment.md](../../tools/integrations/segment.md) |
| **HubSpot** | CRM lead-source + self-reported fields | ✓ | [hubspot.md](../../tools/integrations/hubspot.md) |
| **Salesforce** | CRM as revenue source of truth | - | [salesforce.md](../../tools/integrations/salesforce.md) |
| **Supermetrics** | Pull platform numbers into one place to reconcile | ✓ | [supermetrics.md](../../tools/integrations/supermetrics.md) |
| **RB2B** | De-anonymize B2B website visitors | - | [rb2b.md](../../tools/integrations/rb2b.md) |

---

## Related Skills

- **analytics** — event tracking, tracking plans, UTMs, GA4/GTM setup. Do this *before* attribution.
- **ads** — ad-platform pixels, CAPI, server-side conversion tracking (`references/conversion-tracking.md`).
- **revops** — pipeline stages, lead lifecycle, CRM revenue reporting. Attribution feeds it.
- **ai-seo** — the AI-search attribution blind spot in depth.
- **ab-testing** — controlled experiments; the incrementality mindset applied to on-site changes.
