# Sending Operations

[deliverability.md](deliverability.md) covers domains, warmup, and the mailbox providers' rules. This reference covers the operational side that starves campaigns once they're running: inbox capacity against lead counts, daily new-lead flow, leads that silently never send, refilling a running campaign, and the daily check that catches all of it.

Contents: [inbox admission](#inbox-admission) · [daily caps](#daily-caps) · [capacity math](#capacity-math) · [leads loaded but never sent](#leads-loaded-but-never-sent) · [refills](#refills) · [brand separation](#brand-separation) · [daily plumbing check](#daily-plumbing-check) · [stop-loss](#stop-loss)

Across three projects, lead flow and sending plumbing, not copy, were the binding constraint:
- One project contacted no new leads on 5 of 11 send days in two weeks.
- A campaign sat "active" but couldn't send, because its inboxes had been moved to another workspace.
- 70 validated leads uploaded to one campaign never got emailed. They were stuck in the sending tool's own pending-verification state, and the campaign reported "no leads ready." Re-adding them with the tool's verification off fixed it: contacted leads went from 18 to 30 the same afternoon. The list was fine; the tool's verification job was the stall.

The numbers below are the defaults those projects settled on. They sit at the cautious end of the ranges in [deliverability.md](deliverability.md), which suits small programs where one burned inbox is a large share of capacity.

## Inbox admission

An inbox joins a campaign only when all of these are true:
- Warmup score 98 or higher, and warmup reported healthy
- Status active and connected, in the same workspace as the campaign
- At least 3 weeks of warmup, or 4 for a brand-new domain

An inbox that fails any of them stays in warmup.

## Daily caps

- **Cold sends per inbox per day:** start at 5 to 10 and cap at 20, even if the tool's limit allows 30. Keep warmup running alongside.
- **Inbox set ceiling:** the sum of daily limits of every campaign sharing a set of inboxes stays at or under **inboxes × 10**, unless someone approves a ramp.
- **New leads per day:** set it explicitly on every campaign. Once follow-ups start, about half the campaign's daily limit. Left to the tool's default, follow-ups can crowd out new leads and new-lead flow stops without any error.

## Capacity math

Work out three numbers before loading a cohort:

- **Daily send budget** = inboxes × sends per inbox
- **Total sends** = leads × steps in the sequence (a little less in practice, since replies and bounces stop leads)
- **Runway** = uncontacted leads ÷ new leads per day, in send days

**Worked example.** 3 healthy inboxes at 10 a day is a budget of 30 sends a day. One 80-lead cohort on a 4-step sequence needs up to 320 sends. With new leads capped at 15 a day, the cohort is fully contacted in about 5 to 6 send days; follow-ups from day 3 onward fill the other 15 slots. After that the inboxes only carry follow-ups, so the next cohort has to be validated and ready by about day 4, or new-lead flow drops to zero. If the follow-ups of the first cohort already fill the budget, the fix is more inboxes, not a higher cap.

**Every campaign needs a refill plan on day one**, not after it runs dry: where the next cohort comes from, who validates it, and the day it must be loaded.

## Leads loaded but never sent

When a campaign shows leads but contacted isn't rising, check in this order:

1. **Lead verification status.** If leads sit in the tool's pending-verification state, the tool's own verification job has stalled. You already validated the list, so re-add those leads with the tool's verification turned off.
2. **The campaign's sending status or error code.** "Active" in the list view doesn't mean sending. Look for "no leads ready," schedule outside sending hours, or a daily limit already used up by follow-ups.
3. **Inbox attachment.** Confirm the campaign's inboxes are still attached, connected, and in the same workspace.
4. **New-lead cap.** Confirm it is set above zero and not left to a default that follow-ups consume.

**Upload with the sending tool's verification off**, since you validate before upload (see [deliverability.md](deliverability.md) and the **prospecting** skill), then check the verification status on a sample of leads right after every upload.

## Refills

Some sending tools only accept new leads on a campaign that is a draft or paused. Refilling a running campaign then means pause, add, resume, and resuming is often a human step. Put that step on someone's calendar, or the campaign stays paused.

Prefer loading a refill as a new cohort campaign, so the readout isn't blurred (see [readout-and-sample-size.md](readout-and-sample-size.md)).

| Path | How | Use it for |
|------|-----|------------|
| **Gated** | Pull leads, validate, then add | The default. Every lead passes your validator |
| **Ungated auto top-up** | The tool or data provider adds leads automatically when the campaign runs low | A volume backup only. These leads skip your validator, so watch bounces, and pause the top-up first if bounces climb |

## Brand separation

When several brands share a workspace or a founder:
- **One brand's inboxes only carry that brand's campaigns.**
- **Dedupe across brands** before upload, so one business never gets pitched by two of your brands.
- **No cross-brand mentions** in subjects, variables, bodies, or signatures. Check merge variables especially; a shared template is the usual leak.
- **Footer address** comes from that brand's own published privacy policy or terms, never a personal or home address.
- **Signer** is that brand's owner, not the person running the outreach.

## Daily plumbing check

Run it on every active campaign, every send day. An agent can run it and flag; a person fixes what needs access.

| Check | Healthy | Flag when |
|-------|---------|-----------|
| Sending status | Sending | Active but not sending, or an error code |
| New leads contacted today | Above zero | Zero on a send day with uncontacted leads left |
| Uncontacted leads and runway | More days of runway than the refill takes to prepare | Under 3 send days with no refill loaded |
| Leads stuck pending verification | None | Any |
| Inboxes | All connected and active | Any disconnected, paused, or moved to another workspace |
| Warmup score | 98+ | Under 98 (pull from new campaigns); under 90 (stop-loss) |
| Bounce rate | Under 2% | 2% or more |

## Stop-loss

Pause the campaign and tell the owner on any of:
- **Bounce rate over 2%**
- **Any spam complaint.** At small volume one complaint is already over the 0.1% line: one in 300 sends is 0.33%.
- **Warmup score under 90** on any inbox in the campaign

The full stop-loss table, including placement and blocklists, is in [deliverability.md](deliverability.md#stop-loss-rules).
