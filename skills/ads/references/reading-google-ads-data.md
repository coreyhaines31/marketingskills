# Reading Google Ads Data Without False Conclusions

Load this before analyzing, auditing, or reporting on a Google Ads account, or before deciding whether to pause, keep, or scale anything in one. [audit-guardrails.md](audit-guardrails.md) covers how to *grade* what you find. This file covers how the data *misleads* you before you get that far.

Google Ads reports are partial by design and plausible by accident. Default views omit data without saying so, resource names suggest contents they don't have, and small accounts produce numbers that look like findings. Most wrong conclusions come from not knowing that, not from bad reasoning.

Query patterns and API gotchas live in [google-ads.md](../../../tools/integrations/google-ads.md).

## What the data hides

### Search terms are a sample, not the total

Google withholds any query searched by too few people. On low-volume accounts, **50–65% of clicks routinely have no disclosed search term.** The visible terms are a non-random sample skewed toward common searches.

- Any claim about "what this campaign is buying" carries the ratio: *of the 13 clicks Google discloses, out of 33 total.*
- Pull the report **unfiltered first**. Filtering by `clicks > 0` also drops every impression-only term, and combined with a low `LIMIT` it hides most of the picture.
- **Nothing recovers the withheld queries.** The query is never passed to the site, so GA4, PostHog, or a CRM can show what every session *did* (joined on gclid), never what was *typed*.

```
disclosed clicks = SUM(clicks in the search terms report)
total clicks     = campaign clicks for the same window
withheld         = total - disclosed
```

### Names describe intentions, not contents

An ad group called "Competitor - Commercial" can hold entirely informational keywords. A campaign named for one theme can target another. Read the keyword list and the search terms; treat every name as a label someone typed once.

### "Conversions" is several things in one column

`metrics.conversions` counts actions marked primary, plus any secondary action a campaign's custom goal pulls in. `metrics.all_conversions` adds the rest. Check campaign goals as well as action settings. One campaign's conversions might mix a page-view proxy, a trial signup, and a booked demo.

- Segment by conversion action before calling anything a lead or a demo.
- Check each action's attribution model and click window while you're there.
- Data-driven attribution runs on low volume too, but with few conversions its individual credit assignments are soft. Don't read much into one campaign's share.

### One ad group can send traffic to several pages

Ads carry their own final URLs, and stale pages linger in rotation long after a new landing page ships. Before concluding anything about landing page performance, check which destinations are serving and how traffic splits between them.

### Dates are click dates

Conversions are attributed back to the originating click. A conversion recorded today can appear dated a week earlier. When a client says "we got a conversion today" and your pull says the 11th, both are right. Say "clicked on the 11th."

### Identical campaign names are usually experiment arms

Expired experiment arms inherit the base campaign's name and can keep an ENABLED status while serving nothing. Check `campaign.experiment_type` and `campaign.serving_status` before believing a duplicate exists.

### Change history is short: 30 days with detail, 90 without

`change_event` (field-level before and after) covers 30 days. `change_status` covers 90 days but only says which resource changed, not what. Past that, the API has nothing. A performance shift four months ago may have no recoverable explanation, so say that instead of guessing one.

### Other people are changing the account

Client staff, automated rules, scripts, and agents all leave changes. In `change_event`, `client_type` says which client made the change: `GOOGLE_ADS_WEB_CLIENT` (the UI), `GOOGLE_ADS_API`, `GOOGLE_ADS_SCRIPTS`, `GOOGLE_ADS_AUTOMATED_RULE`, `GOOGLE_ADS_BULK_UPLOAD`, `GOOGLE_ADS_RECOMMENDATIONS`, `INTERNAL_TOOL` (Google-side tooling), and others in the enum. Report the client, not a guess at who or why: an API change could be an agency tool or a script. Google Ads Editor changes aren't returned at all, so a missing edit doesn't mean nobody made one. A repeating weekday-and-time pattern under one user is a scheduled job, not a person.

## The window is not the picture

A 30-day pull on a campaign that has run since spring is a slice of a longer series. Recent CPA can differ sharply from lifetime CPA.

- **Establish how long something has run** before quoting any efficiency number. Quote both recent and lifetime when they diverge.
- **Don't pool across configuration changes.** If bids, keywords, budget, ads, or targeting changed mid-window, the period is several experiments averaged together.
- **Bid-only changes are a special case.** They invalidate cost and volume comparisons but leave intent and audience questions readable.
- **Bid strategies in learning are unreadable.** `primary_status = LEARNING` means don't judge performance or optimize on it. Fixing a verified break (tracking down, wrong URL) still comes first; see [audit-guardrails.md](audit-guardrails.md).

## Small numbers

Most false findings in small accounts are sample-size errors that look like insight. Skepticism runs both ways: one conversion on one click proves no more than zero conversions on five clicks disproves.

Zero conversions in N clicks only rules out conversion rates at or above (95% confidence):

| Clicks | Rules out CVR ≥ | What you can say |
|---|---|---|
| 5 | 45% | Nothing. Zero is the expected outcome |
| 10 | 26% | Still nothing useful |
| 30 | 10% | Can begin doubting a strong CVR |
| 50 | 6% | Meaningful for high-intent search |
| 100 | 3% | Underperforming if break-even CVR is above 3% |

Before calling spend wasted, work out what it would have to convert at to be worth keeping:

```
break-even CVR = CPC ÷ target CPA
```

If break-even CVR is below the plausible range for that traffic, the term isn't failing, it's unmeasured. Then estimate how long a readable sample takes at current click volume. "Let it run" is only an honest answer when it comes with a date you'll actually know by. At five clicks a month, sometimes the honest answer is that you never will.

## Documents describe a day; accounts move

Audits, status docs, and proposals were true when written. Every performance number in them is stale until re-pulled. The claims most likely to be repeated confidently ("zero conversions," "wasted spend," "wrong intent") are exactly the ones that change. Carry the date with the claim: *as of the audit on the 2nd*.

## Stating findings

Know which of these each claim is:

- **Verified**: pulled live this session, unfiltered, and reconciled against a total
- **Inferred**: reasoned from verified data, could be wrong
- **Stale**: from a document, an earlier session, or the client, with its date attached

Keep stale claims out of client-facing sentences unless they're labeled as such.

**The test before anything reaches a client: can they disprove this in a minute with their own account access?** They have the same reports. Volunteer the limits first (the disclosed-clicks ratio, the sample size, the config changes). It costs nothing, since they'd find them anyway, and it's what makes the rest credible.

If a claim touches a landing page, open it. Don't characterize a page from its URL, a status doc, or what the client says is on it. Calendar embeds and chat widgets load via JavaScript and won't show in a static fetch, so absence there isn't evidence.

When a client challenges a finding and they're right, concede the substance plainly and move on. Stacked retractions cost more credibility than the original error.

## Conclusions that sound right

| Sounds like | Usually |
|---|---|
| "This campaign has zero conversions" | True on the day the doc was written |
| "The search terms are junk" | You're seeing ~40% of the clicks |
| "That ad group is wrong-intent" | It's *named* that; the keywords say otherwise |
| "$X wasted on those terms" | Below any readable sample size |
| "It converted, so the term works" | One conversion on one click is noise |
| "Performance declined in August" | Bids changed three times that month |
| "Traffic lands on the new page" | Two ads serve; one points at the old page |
| "It got a demo" | It got a conversion; check which action |
| "There are duplicate campaigns" | Expired experiment arms with the base name |
| "Nobody touched it last quarter" | Change history only covers 30 days |
