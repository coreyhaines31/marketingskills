# Measurement Paradigms — MTA vs. MMM vs. Incrementality

Attribution *models* (see `attribution-models.md`) split credit *within* your tracked data. They can't tell you what would have happened anyway. That's what these three paradigms are for — increasingly rigorous, increasingly expensive ways to get closer to causality. Use this reference to help a user pick, and to explain how a test *reads* (not how to run the statistics).

## The three, compared

| | **MTA** (multi-touch) | **MMM** (media mix modeling) | **Incrementality** (experiments) |
|---|---|---|---|
| **Approach** | Bottom-up: stitch user-level touches, apply a model | Top-down: regress outcomes vs. spend/factors over time | Controlled: withhold exposure from a group, measure the difference |
| **Answers** | "Which touchpoints are on converting journeys?" | "What's each channel's aggregate contribution?" | "Did this channel *cause* lift I wouldn't have gotten?" |
| **Granularity** | Per user, per touch | Per channel, per week | Per test (one channel/tactic at a time) |
| **Data needed** | Clean cross-device user-level tracking | 2–3 yrs weekly data + spend variation | Ability to withhold + enough volume for significance |
| **Reacts** | Real-time | Slowly (weeks/quarters) | Per test cycle |
| **Handles offline/brand** | No | Yes | Yes (if you can split exposure) |
| **Privacy-durable** | Weak (cookie/ID loss) | Strong (aggregate) | Strong (aggregate) |
| **Cost/effort** | Low–medium | High | Medium–high |

## MTA — multi-touch attribution

**What it is:** the user-level approach most marketers mean by "attribution" — join a person's touches, apply first/linear/position/data-driven credit.

**Where it shines:** day-to-day, tactical decisions. "Is this campaign showing up on converting journeys?" Fast, granular, cheap if your tracking exists.

**Why it's structurally weakening:** MTA depends on tracking one person across touches and devices, and that data keeps eroding — Safari/Firefox ITP-style cookie limits, iOS ATT, browser consent gating, ad blockers, and ordinary cross-device behavior (research on mobile, buy on desktop). (Chrome's third-party-cookie deprecation was announced, then walked back, so "cookies are going away" is no longer the clean story — but everything else on that list already limits user-level tracking today.) MTA doesn't announce the gap: it silently under-measures anything it can't follow (dumping it into direct) and over-measures what it *can* see. So treat MTA as **incomplete and directionally biased** — not a clean lower bound (its retargeting/branded numbers are often *over*-stated) — and never the sole basis for a big reallocation.

**Use it for:** ongoing optimization and trend-watching — never as the sole basis for a big budget reallocation.

## MMM — media/marketing mix modeling

**What it is:** a top-down statistical model (historically regression; modern open-source options like Meta's Robyn or Google's Meridian) that explains an outcome (revenue, signups) as a function of spend per channel plus controls (seasonality, promotions, price, macro). It never looks at individuals — it's all aggregate time-series, which is exactly why privacy changes don't touch it.

**What it uniquely gives you:**
- **Offline + brand + hard-to-track channels** — TV, podcasts, OOH, PR, organic — because it works on aggregate spend and outcomes, not clicks.
- **Diminishing returns / saturation curves** — where the next dollar in a channel stops paying off.
- **A portfolio view** — how the whole mix drives the outcome, not credit for one journey.

**What it costs and where it's weak:**
- Needs **2–3 years of weekly data** and **real variation in spend** — if you always spend the same on Meta, the model can't learn Meta's effect. You sometimes have to deliberately vary budgets to feed it.
- **Correlational and slow** — it sees what moved together historically; it reacts in quarters, not days. It can't tell you what to do with tomorrow's campaign.
- **Sensitive to specification** — garbage controls, garbage coefficients. It's a real modeling exercise, not a dashboard toggle.

**Use it for:** annual/quarterly budget allocation across a material, multi-channel (esp. offline-inclusive) spend. Validate its coefficients with incrementality tests — MMM says "Meta contributed X"; a holdout proves whether that's causal.

## Incrementality — the experiments

**What it is:** the only paradigm that measures *causality* directly. Split your audience into an **exposed** group and a **withheld/control** group; the difference in outcomes is the **incremental lift** — conversions you got *because of* the channel, not ones that would have happened anyway.

**Common designs:**
- **Geo holdout / geo-lift** — run the channel in some regions, hold it out of comparable ones; compare outcomes. The workhorse for channels you can't split at the user level. *(Meta's GeoLift, Google's geo experiments.)*
- **PSA tests** — the control group is shown a *public-service ad* in your ad's place, so both groups are equally targeted and "ad-exposed"; the only difference is whether they saw *your* ad. Isolates ad effect from audience-quality bias (the exposed group isn't just "people the algorithm judged likely to convert").
- **Ghost ads** — the control group is *held out of the auction* but the platform logs the ad that *would* have served them (no placeholder is shown); you compare converters among the would-have-been-exposed vs. actually-exposed. Cleaner and cheaper than PSAs (no wasted PSA spend), and the modern default where the platform supports it.
- **Intent-to-treat / on-off (pulse) tests** — turn a channel fully off for a defined window, watch what happens to total conversions. Crude but revealing, especially for "is branded search paid cannibalizing organic?"
- **Holdout audiences** — withhold a random % from a retargeting or email program; the delta is the program's true lift.

### How to *read* a test (not run the stats)

You don't need to compute significance by hand, but you must read a result honestly:

1. **Lift = exposed rate − control rate.** If exposed geos converted at 4.2% and control at 3.6%, incremental lift is ~0.6pp — the rest of that 4.2% would have converted anyway. This is why last-click ROAS is almost always *overstated*: it counts the whole 4.2%.
2. **Check the confidence interval / significance.** "5% lift, but the interval spans −2% to +12%" means you learned nothing — the test was underpowered. Insist on enough volume/duration before believing a point estimate.
3. **Watch for contamination.** Control users who were reached anyway (cross-device, spillover between geos) shrink the measured gap. A "no lift" result can be a leaky test, not a dead channel.
4. **Translate to a decision.** Incremental CPA = spend ÷ *incremental* conversions (not total). This is the number that should drive budget — and it's usually worse than the platform's reported CPA, which is the point.

**Use it for:** the highest-stakes questions and the tiebreakers — "does retargeting actually do anything?", "is branded-search paid just buying clicks we'd get free?", "which of our two biggest channels is really driving growth?" You can only test a few things at a time, so spend those tests on the decisions that matter most.

## Putting them together (the mature stack)

They're layers, not competitors:

- **MTA** for daily/weekly tactical optimization and trend-watching — cheap, granular, directional.
- **MMM** for quarterly/annual portfolio allocation across the full mix including offline — durable, holistic.
- **Incrementality** as the **calibration and tiebreaker** — the ground-truth that keeps MTA and MMM honest, run on your biggest bets.

**Scale to the user:** most SMBs need good UTMs + last-non-direct + a self-reported survey + the occasional on/off test — not an MMM. Bring MMM in when offline/brand spend is material and MTA visibly can't see it. Bring in formal incrementality when a single channel's budget is big enough that being wrong about it is expensive. Match the rigor to the size of the decision.
