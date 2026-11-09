# The Operating Check: Weekly Account Review That Ends in a Decision

A recurring account check is only useful if it ends in a call someone can act on. A list of metrics with no decision is reporting theater: everyone reads it, nothing changes, and the problem it hinted at keeps costing money.

Run this check weekly on every account, and daily on accounts with active tests, recent launches, or large daily spend. It takes about 15 minutes once the inputs are pulled. Pair it with [audit-guardrails.md](audit-guardrails.md), which governs what counts as evidence.

## Inputs

Pull the same inputs every time, for the same comparison window (this period vs the prior comparable period, or today vs the trailing 7 days on a daily check). Also pull the same metrics for the **trailing 6–8 periods** (weeks on a weekly check, days-of-week on a daily check). That range is the account's normal variance, and the HOLD call below depends on it:

- Spend, budget, and pacing by campaign
- Impressions, clicks, CPC, CTR, CPM, and impression share lost to budget and to rank
- Conversions, CVR, CPA or ROAS, and conversion value, each with its attribution window named
- Lead quality or downstream outcome from the CRM, if the account is lead gen
- Frequency and CTR trend for the top-spending ads
- Landing page conversion rate by device, from analytics
- Change history for the period (who changed what, when)

If an input is unavailable, mark it **MISSING** and keep going. Do not estimate it.

## The check, in order

Work top to bottom. The order matters: a problem higher in the list explains symptoms lower down, so stop at the first real cause instead of chasing its effects.

| # | Question | What to look at | Typical cause when it moved |
|---|---|---|---|
| 1 | **Did spend move?** | Pacing vs budget, daily caps hit, delivery limits, impression share lost to budget | Budget change, cap hit, campaign limited, billing issue |
| 2 | **Did traffic change?** | Clicks, CPC, CTR, CPM, new search terms or placements | Auction pressure, a new competitor, match-type drift, a placement spike |
| 3 | **Did conversions change?** | CVR, CPA or ROAS, conversion value, lead quality | Offer change, seasonality, lead quality drop, attribution lag on recent days |
| 4 | **Did creative fatigue?** | Frequency, CTR vs the ad's own peak, spend concentrated on a few aging ads | Audience saturation, no new concepts in rotation |
| 5 | **Did the landing page break?** | Page speed, form or checkout errors, mobile vs desktop CVR gap | A deploy, a broken form, a tracking script blocking render |
| 6 | **Did tracking break?** | Conversion counts vs analytics and CRM, event match quality, consent rate, offline imports | Tag removed, duplicate firing, consent banner change, import job failed |

Check the change history against every movement. A metric that moved the day after a budget edit, a bid strategy switch, or a new ad launch probably moved because of it.

Recent days undercount conversions on any account with conversion lag. Read the last few days as incomplete, and never call a trend from them alone.

**One period against one period is not a trend.** A week that looks bad against last week is often just last week having been unusually good. Before calling anything other than HOLD on a performance metric, check where this period sits against the trailing 6–8 periods: inside that range is normal variance; outside it, or three or more periods moving the same way, is a movement worth a FIX, TEST or INVESTIGATE. Spend, tracking, and broken-page problems are exceptions: those are facts, not trends, and don't need a baseline. So are explicit stop thresholds measured against a target, such as cost per qualified lead above 1.5× TCPL in the [Meta decision system](meta-decision-system.md): they fire against the target even when the metric sits inside its own 6–8 period range, because a persistently bad ad is normal for itself. The Meta decision system's creative-fatigue bands (frequency, cost, and CTR against their own windows) and its rolling-reach guardrail are exempt for the same reason: they already measure over weeks, not one period.

## The decision

Every check ends in **exactly one** call for the account (and optionally one per campaign that moved):

| Call | Meaning | When to use it |
|---|---|---|
| **HOLD** | Change nothing; check again in 24 hours or at the next scheduled check | Movement is inside the trailing 6–8 period range (normal variance) and not a three-period run or an exempt threshold, the sample is too small, the campaign is in learning, or the cause is lag |
| **FIX** | A known, named problem with a known fix | A broken form, a capped budget on a winning campaign, a disapproved ad, a tracking tag that stopped firing |
| **TEST** | A hypothesis worth spending money to answer | Creative fatigue with a new concept to try, a bid strategy change with enough volume, a landing page variant |
| **INVESTIGATE** | The data can't be trusted yet, so no decision on performance is possible | Conversions disagree across platform, analytics, and CRM; counts jumped with no business explanation; a source is MISSING |

Rules for the call:

- **INVESTIGATE beats everything.** If tracking is in doubt, no performance call is valid until it's resolved.
- **FIX names the problem and the fix.** "Performance is down" is not a FIX.
- **TEST names the hypothesis, the metric, and the stopping rule.** A test without a stopping rule turns into a permanent change nobody chose.
- **HOLD still needs a reason.** Say why you're holding and what would change the call.
- **No call moves money on its own.** Budget, bid, status, and tracking changes go to a human as a draft (current state → change → expected effect → rollback) for approval.

Every call ends with three short lists: **facts** (in the data), **hypotheses** (inferred), and **missing data** (what would change the decision).

## The Friday readout

Close the week with a readout a stakeholder can read in a minute. Keep it under 200 words.

1. **Results vs target.** One line per account or program, marked green, amber, or red against the target CPA, ROAS, or pipeline goal.
2. **What moved and why.** The top two or three movers, each with a likely cause and a confidence level (high, medium, low).
3. **Decisions for next week.** Each one labeled HOLD, FIX, TEST, or INVESTIGATE, with one line on why.

Leave out metrics nobody will act on. If a number appears in the readout, it should support a result, a cause, or a decision. Name any missing data that limits a conclusion, and make clear that any change that moves money is waiting for approval.

## Making it a habit

Run the check by hand for two weeks before automating any part of it. Manual runs show which inputs are hard to get and which calls you keep making, and that's what the automation needs to handle. When you do schedule it, the **marketing-loops** skill covers running recurring checks with state between runs.

---

*Framework lineage: the ordered check, the four-call decision, and the stakeholder readout are re-expressed from Marek Dąbrowski's "The Paid Ads Operator's Guide to Claude" (Adlume, 2026-07-16), adapted to this skill's guardrails.*
