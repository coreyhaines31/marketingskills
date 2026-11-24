# Running Outbound as Experiments

A pile of campaigns that each had a different list, angle, and offer tells you nothing, because you can't compare any two of them. This reference sets up campaigns so their results can be compared and pooled: one source per campaign, fixed copy slots, one naming scheme, and one ledger.

Contents: [one source per campaign](#one-campaign-per-source-or-signal) · [the four step-1 slots](#the-four-step-1-slots) · [naming](#naming) · [the ledger](#the-ledger) · [metric definitions](#metric-definitions) · [what counts as success](#what-counts-as-success) · [adding a new project](#adding-a-new-project)

The structure here comes from running outbound across three projects at once. Writing copy for each segment is covered in the main skill; this file is about campaign structure and measurement. How to read the results is in [readout-and-sample-size.md](readout-and-sample-size.md).

## One campaign per source or signal

Every campaign holds leads from exactly one source or signal: one directory, one job-post search, one funding list, one product-usage trigger. Then a difference between campaigns points to the source, not to a mix you can't untangle.

- **A list that mixes signals gets split** into one campaign per signal before upload, even when that leaves small campaigns. A blended list produces a blended result.
- **Keep the persona constant inside a campaign** too. If one source yields both founders and ops leads, that is two campaigns.
- **Segment sharpness shows up here.** In one project, human replies per contacted lead were 5.9% (11 of 186) for a narrow segment with a specific pain, 2.1% (9 of 422) for a broad agency list, and 1.25% (5 of 400) for a legacy enterprise list. One project, small counts, but you only see a split like that when sources are kept apart.

Where the sources and signals come from is the **prospecting** skill's job (see its signal plays and sourcing references).

## The four step-1 slots

Step 1 of every campaign carries the same four variants, and each slot means the same thing everywhere:

| Slot | Opener and body | Offer | Ask | What it tests |
|------|-----------------|-------|-----|---------------|
| **V1** (control) | The segment's problem | The default offer | Interest CTA ("Worth a look?") | Baseline |
| **V2** | The signal that put them on the list | A soft done-for-you offer: a sample they can say yes to without a call | "Want me to send it?" | Whether giving work first beats asking |
| **V3** | One true proof point from a similar customer | The call | A short call with two proposed times | Whether asking for the call directly books more |
| **V4** | Two lines | All of them | A 1/2/3 numbered reply menu | Whether a near-zero-effort reply moves more people |

Templates for each ask are in the main skill's "Which ask goes where" section.

Because the slots mean the same thing in every campaign, a slot's results pool across campaigns and across brands. That pooling is the only way small campaigns ever add up to a readable sample.

**Rules**
- **Keep steps 2 onward identical across the four slots** within a campaign, so a difference traces back to step 1. Follow-ups still carry many of the replies; credit a reply to the step-1 slot the lead received.
- **Turn off the sending tool's auto-optimize or winner selection** on step 1. It picks a "winner" from a handful of replies, which is noise at this volume, and it starves the other slots of the sample they need.
- **Split leads evenly** across the four slots at random. Don't hand-assign the best-looking leads to the slot you like.
- **Every proof point in V3 must be true** and approved. If you don't have one for a segment, leave V3 out of that campaign rather than invent one.

## Naming

- **Campaigns:** `{PROJECT}-SRC-{nn} {signal}`, for example `ACME-SRC-07 hiring-revops`.
- **Variants:** `{campaign}-V{n}`, for example `ACME-SRC-07-V3`.
- **Replaced copy takes a letter, never a new number.** If you rewrite the V2 copy, the new version is `V2b`. The slot keeps its meaning (signal opener plus soft offer), and `V2` and `V2b` can be read apart or together.

A name that carries the source and slot lets anyone, including an agent, pool results without opening each campaign.

## The ledger

Keep one shared ledger for every project, one row per campaign per variant. A spreadsheet is enough.

| Column | Example |
|--------|---------|
| Campaign | ACME-SRC-07 hiring-revops |
| Variant | V3 |
| Source / signal | Job posts for a RevOps hire, last 30 days |
| Persona | Head of Sales, 50–200 employees |
| Angle | New RevOps hire means the stack gets rebuilt |
| Offer | 15-minute call |
| Leads | 20 |
| Contacted | 20 |
| Sent | 68 |
| Replies | 2 |
| Positives | 1 |
| Calls | 1 |
| Bounces | 0 |
| First send / last send | 2026-11-02 / 2026-11-27 |
| Status | running · inconclusive · keep · extend · kill |

The statuses and the rules for moving between them are in [readout-and-sample-size.md](readout-and-sample-size.md). The CRM still holds each contact's reply type and outcome (see [reply-handling.md](reply-handling.md)); the ledger is the roll-up you decide from.

## Metric definitions

Define these before the first send, and use the same definitions in every project, or the pooled numbers mean nothing:

| Metric | Definition |
|--------|------------|
| **Leads** | Loaded into the campaign |
| **Contacted** | Received step 1 |
| **Sent** | All emails sent, every step |
| **Replies** | Unique humans who replied. Auto-replies and out-of-office excluded |
| **Positive** | Replied interested, asked about price or details, accepted the offer, or asked for a call. Nothing else counts: "no," "remove me," "wrong person," and "not now" are not positives |
| **Calls** | Calls booked |
| **Bounces** | Hard bounces |

Report every rate with its count next to it ("1 positive of 80 contacted," not "1.25%").

## What counts as success

- **The goal metric is booked calls.**
- **The leading indicator is positives**, because calls are too rare to steer by week to week.
- **Raw reply rate is not a success metric.** Most replies are "no," and an opt-out line that asks for a reply ("reply 'no' and I won't follow up") invites them. In one quarter, about 15 of 22 human replies were no, unsubscribe, or wrong person. A campaign can raise its reply rate by annoying more people.

## Adding a new project

Before a new brand or product sends anything:

- [ ] Workspace and access set up in the sending tool, with the owner named
- [ ] Sending domains and mailboxes for **this brand only** (see [sending-ops.md](sending-ops.md) for brand separation)
- [ ] Footer address taken from the brand's own published privacy policy or terms
- [ ] Signer chosen: the brand's owner, not whoever runs the outreach
- [ ] ICP and exclusions written down (customers, open deals, competitors, suppression list)
- [ ] The four offers written: default, soft done-for-you, proof point plus call, numbered menu
- [ ] Source matrix: which sources or signals become which campaigns (from the **prospecting** skill)
- [ ] Validation route chosen for every list before upload
- [ ] Ledger created, with the metric definitions above
- [ ] First wave sized to the healthy inboxes available (see the capacity math in [sending-ops.md](sending-ops.md)), at about 80 leads per campaign
