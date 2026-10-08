# Multichannel Cadence

Most buyers need to see a name a few times, in more than one place, before they respond. A cadence coordinates email, LinkedIn, phone, and the occasional video or package so each touch builds on the last and nobody gets hit on four channels in one afternoon.

## Which channels for which tier

| Tier | Channels |
|------|----------|
| Tier 1 (1:1) | Email, LinkedIn, phone, personalized video; direct mail after engagement |
| Tier 2 (1:few) | Email and LinkedIn; phone for the best-fit accounts |
| Tier 3 (1:many) | Email; LinkedIn only if it can be done without automation risk |

Tiers are defined in the prospecting skill's signal plays reference.

## A 21-day Tier 1 cadence

| Day | Touch |
|-----|-------|
| 1 | View their LinkedIn profile and engage with a recent post. Send email 1 (short, no link) |
| 3 | LinkedIn connection request |
| 4 | Email 2, as a reply in the same thread |
| 6 | Call 1. If no answer, leave a short voicemail and send an email recapping it |
| 8 | LinkedIn message if connected; otherwise a short personalized video by email |
| 11 | Email 3: new angle or a case study |
| 13 | Call 2 |
| 15 | LinkedIn voice note or a comment on a new post |
| 18 | Email 4: breakup or referral ask |
| 21 | Call 3. Then move the contact to nurture and ad retargeting |

Shorten it for Tier 2 (email and LinkedIn over about 14 days). Tier 3 is the email sequence alone; see [follow-up-sequences.md](follow-up-sequences.md).

## Rules that hold any cadence together

1. **A reply on any channel stops every channel.** Someone who answered on LinkedIn mustn't get email 3 the next morning. This needs one shared record of who has replied, checked before each touch.
2. **An opt-out on one channel is an opt-out on all of them.** Key the suppression list on email, LinkedIn URL, and phone together. See the prospecting skill's sourcing and enrichment reference.
3. **One sender per account at a time.** Two reps, or a rep and an agent, sequencing the same company looks disorganized and doubles the annoyance.
4. **Each touch references the last** when it helps ("Following up on the voicemail I left Tuesday"), but must also make sense on its own.
5. **Keep it to 4–7 emails and at most 3 LinkedIn messages.** More touches don't rescue the wrong offer.
6. **Space touches across days.** Never two channels on the same day except a voicemail and its recap email.

Most sequencing tools only coordinate their own channels. When email, LinkedIn, and calls run in different tools, connect them with a shared state (the CRM or a simple table keyed on the contact) and webhooks that pause every sequence when any reply arrives.

## Calls

Calls are the slowest channel and the fastest to a conversation. Vendor and agency datasets from 2025 put the dial-to-conversation rate around 10% and roughly one meeting per several hundred dials. Mobile numbers connect far better than office lines.

- **Best times:** mid-week, mid-to-late afternoon in the prospect's time zone. Test your own.
- **Attempts:** 3 calls per contact across the cadence, on different days and times.
- **Openers:** say who you are and why you're calling, then ask permission to continue. Avoid "Did I catch you at a bad time?", which call-analysis data ranks among the worst openers.
- **Voicemail:** 20–30 seconds, your name, one specific reason, and "I'll send you a note too." Then send it.
- **Rules:** scrub against Do Not Call lists, and never use AI voice on US mobile numbers without consent. See the prospecting skill's compliance reference.

Scripts for openers, voicemails, and common pushback are in the sales-enablement skill's cold call scripts reference.

## Video

A short video recorded for one person stands out in a text inbox, and it's the natural format for value-first plays (see [outbound-plays.md](outbound-plays.md)).
- **60–120 seconds** for a pure outreach video; **2–4 minutes** for a teardown or audit.
- Show their thing (their site, their product, their dashboard) on screen in the first few seconds.
- Send a thumbnail or GIF that shows their page, linked to the video. Don't attach the file.
- For Tier 1 only, or after a reply. Video doesn't scale like text, and that's the point.

Tools: Loom, Tella, Sendspark, Vidyard.

## Direct mail and gifts

Useful for Tier 1 accounts that have engaged but stalled. Something relevant to the conversation (a book you referenced, a printed teardown) beats a generic gift. Sendoso and Reachdesk handle sending and address confirmation. Check company gift policies, which often cap or ban gifts in regulated industries and government.

## Ads to target accounts

Upload your target account and contact lists to LinkedIn Matched Audiences (or other ad platforms) and run light awareness ads during the cadence. When the email arrives, the name is already familiar. See the ads skill's ABM playbook.

## SMS and WhatsApp

Not for cold outreach. US SMS to mobile numbers needs consent and 10DLC registration; WhatsApp business messaging needs an opt-in. Use them only after a prospect has engaged and agreed, for scheduling and reminders.

## Measure by channel

Track, per channel and per step: touches sent, replies, positive replies, meetings. Attribute the meeting to the touch that produced the reply, and keep the full sequence on the record so you can see which combinations work. A channel that never produces a positive reply after a few hundred touches is costing more than it returns.
