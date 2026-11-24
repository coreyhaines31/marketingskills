# Reading Small Campaigns

Most real outbound starts with 20 to 100 leads per campaign. At that size, people either call a winner after a handful of sends or never decide at all. This reference covers what a small campaign can and can't tell you, when to read it, and the default rules for keeping, extending, or killing a source.

Contents: [expected positives](#start-with-expected-positives) · [what a test can detect](#what-a-test-can-detect) · [wait for step 2](#wait-for-step-2) · [classify every reply](#classify-every-reply) · [decision rules](#decision-rules) · [cohorts](#cohorts) · [inconclusive](#inconclusive-is-a-result) · [cadence](#readout-cadence) · [the weekly readout](#the-weekly-readout)

Campaign structure, the four variant slots, and the ledger are in [experiment-design.md](experiment-design.md). The figures below come from three projects run that way.

## Start with expected positives

Before reading any campaign, work out how many positives it should produce if nothing special is going on:

**Expected positives = contacted × your positive rate**

In the one project with enough volume to measure it, the rate was about 0.4 positives per 100 contacted. At that rate:

| Contacted | Expected positives | Chance of zero positives from a source that is merely average |
|-----------|--------------------|---------------------------------------------------------------|
| 20 (one variant slot) | 0.08 | 92% |
| 80 (one campaign) | 0.32 | 73% |
| 300 | 1.2 | 30% |
| 1,000 | 4 | 2% |

Use your own rate once you have a few hundred contacted. Until then, 0.4 per 100 is a cautious starting assumption, not a benchmark.

## What a test can detect

Comparing two variants needs enough positives in the control to see a difference. To catch a real lift about 80% of the time, the control arm needs to expect about:

| Lift you want to detect | Positives expected in the control arm | Contacted per arm at 0.4 per 100 | At 2 per 100 |
|-------------------------|---------------------------------------|----------------------------------|--------------|
| 3× | about 7 | about 1,750 | about 350 |
| 2× | about 20 | about 5,000 | about 1,000 |

(One-sided test at 5% significance, comparing two arms of equal size. Smaller lifts need far more.)

What this means in practice:

- **A single 80-lead campaign can't compare variants at all.** Each slot gets 20 leads and expects well under one positive. Read slots only pooled across campaigns (see [experiment-design.md](experiment-design.md)).
- **A single campaign can only screen a source**, telling apart "nothing here" from "clearly alive." That is what the decision rules below do.
- **Lifts under about 3× are noise at these volumes.** When the gap between two variants is small, stop tuning and test a bigger change: a different source, offer, or ask.
- **Report counts next to every rate.** "1 positive of 80" is honest. "1.25% positive rate" sounds like a measurement.

## Wait for step 2

Follow-ups carry the replies. In the largest project, 15 of 27 human replies came after step 1, and one positive came on step 4. Another campaign's only reply came on step 2.

- **Don't read a campaign before step 2 has gone out** to the whole cohort.
- **The final read waits for the last step** plus a few days for late replies.

## Classify every reply

Most replies are not good news. In one quarter, about 15 of 22 human replies were no, unsubscribe, or wrong person. Classify every reply with the types in [reply-handling.md](reply-handling.md), then count positives and calls. Raw reply rate goes up when more people say no.

One more data point worth knowing: a one-character reply ("1") to a numbered breakup email was a positive. One case, but the menu costs nothing to include.

## Decision rules

Defaults to start from and tune once you have your own rates. Each assumes a cohort of about 80 leads that has finished at least step 2:

| Decision | Default rule |
|----------|--------------|
| **Keep and refill** a source | 2+ positives, or 1 booked call, per ~80 leads |
| **Extend** | 1 positive: run one more cohort of the same size from the same source |
| **Kill** | 0 positives after the cohort finishes step 2 |
| **Promote a variant slot** to the new default | 3+ positives and at least 2 more than every other slot, pooled across campaigns |
| **Cross-brand insight** | Runs as a test in the other brand first; becomes a default there only after it wins twice |

**Know what the kill rule does.** At 0.4 positives per 100, an average source produces zero positives in an 80-lead cohort about 73% of the time, and a source three times better than average still does about 38% of the time. So "kill" means "not clearly better than average," not "proven dead." That trade is deliberate: the rule hunts for sources several times better than your baseline, and spends little on the rest. The extend rule is the hedge for the borderline case. If good sources are scarce, extend instead of killing for a source you have a strong reason to believe in, and say so in the ledger.

The keep rule of 2 positives per 80 leads is about 2.5 per 100, more than six times the 0.4 baseline. A source clearing it is worth refilling even though one cohort can't say exactly how good it is.

## Cohorts

- **About 80 leads per campaign**, loaded once, run through every step, then read. That's 20 per variant slot.
- **Don't trickle leads into a campaign you are reading.** New leads reset the clock and blur the read. Refill with a new cohort (see refills in [sending-ops.md](sending-ops.md)).
- **Size the wave to the inboxes you have**, not the leads you have. The capacity math is in [sending-ops.md](sending-ops.md).

## Inconclusive is a result

Write **inconclusive** in the ledger when a cohort finishes without enough positives to decide, and move on. Don't change copy because of fewer than about 3 positives.

Things that looked like signals in these projects and weren't:

- Generic signal openers: 1 reply out of 27 contacted, and it was an unsubscribe
- Two offer variants tested on 13 leads in total
- AI-personalized sequences: 0 replies from 30 contacted

None of these proves the idea is bad. Each is too small to say anything, which is the point of the inconclusive status.

## Readout cadence

- **First read:** 10 business days after the first send. Usually only enough to catch plumbing problems and early positives.
- **Final read:** about 4 weeks after the first send, once the last step and a few days of late replies are in.
- **Deadline:** no campaign runs past 6 weeks without a keep, extend, kill, or inconclusive decision.

## The weekly readout

Keep the same shape every week, in this order:

```
1. Calls booked and positives this week, by name or account
   (count of each, with the campaign and slot that produced them)

2. Plumbing flags
   Campaigns not sending, leads stuck pending, inboxes paused or
   disconnected, bounce rate, warmup scores, days of lead runway
   (the daily check in sending-ops.md)

3. Per source: campaign | contacted | step reached | replies | positives | calls | status
4. Per variant slot, pooled: slot | contacted | positives | calls

5. Decisions: keep, extend, kill, inconclusive, and what refills next
```

Calls and positives come first because they are the result. Plumbing comes second because, in practice, a stalled campaign or a disconnected inbox costs more than any copy change will win.
