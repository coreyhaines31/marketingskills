# Going Inside the Product

Stage 3 in full: signing up, watching the emails, testing the upgrade and cancel flows, booking a demo, and questioning the chat bot. It shows what public pages never do: how the company actually activates, converts, sells, and saves customers.

## Contents
- Rules
- Setup
- Sign-up and onboarding
- The email sequence
- Upgrade and paywall
- The cancel flow
- The sales process
- The chat and support probe
- Screenshots and logging

---

## Rules

Each of these is an outward-facing action. The agent confirms with the user before every sign-up, demo booking, chat conversation, and cancellation. Approval for one doesn't cover the next.

- **Real identity only.** Sign up and book under the user's real name, real company, and a real address on the user's domain. No invented personas, fake companies, or borrowed identities. The competitor will be able to see who signed up. Make sure the user is fine with that.
- **Read the terms first.** Some terms of service bar competitors from signing up or using the product for competitive research. If they do, tell the user and let them decide; don't work around it.
- **No payment without explicit approval.** Use free plans and trials. A paid plan needs the user's yes, with the amount, and a reminder to cancel.
- **Don't waste their sales team's time under a pretense.** Book a demo only if the user is willing to say who they are when asked. Never claim to be a buyer with a budget you don't have.
- **Don't extract what isn't yours.** No downloading other customers' data, no testing security, no scraping inside the app, no sharing login access.
- **Stop when asked.** If the company asks you to stop or closes the account, stop.

## Setup

- **Browser:** a real browser the agent can drive and screenshot: Claude in Chrome, agent-browser, or [Browserbase](../../../tools/integrations/browserbase.md). Use a clean profile, so retargeting and personalization start from zero.
- **Inbox:** a dedicated address on the user's domain (e.g. `research@usercompany.com`) or a labeled alias, used only for this teardown. Every email that arrives is evidence.
- **Folder:** `teardowns/<target>/inside/`, with `screens/`, `emails.csv`, and `notes.md`.

## Sign-Up and Onboarding

Screenshot every screen from the landing page to the first result, and record:

| What | Why it matters |
|---|---|
| Sign-up options (SSO, email, magic link) and fields asked | Friction, and what they use to qualify |
| Card required? Trial length and limits | The conversion model |
| Onboarding questions ("What's your role?", "Team size?") | How they segment, and likely what each segment sees next |
| Template, sample data, or blank start | How they get you to a first result |
| Steps and minutes to the first result | Time to value, the number to beat |
| Checklists, tooltips, empty states, nudges | The activation playbook |
| Invite prompts | When they push the team loop |
| Upgrade prompts in the first session | How early they ask for money |

Compare what you see with **onboarding** and **signup** best practice, and note anything they do that the user doesn't.

## The Email Sequence

Leave the account alone after sign-up and log every email for 30-60 days in `emails.csv`. Deliver the teardown on time with the sequence marked pending, and agree with the user how the rest gets collected: a rerun of this stage on a set date (a reminder or the watch loop), or the user forwarding the inbox export. Then update the playbook's Inside the Product section.

`received_at,day,from,subject,preview,type,cta,offer,link`

- **Types:** welcome, onboarding tip, feature, social proof, nudge (inactive), trial-ending, upgrade offer, win-back, newsletter, sales outreach.
- **Day** is days since sign-up. The pattern of days is the sequence design.
- Do something halfway (start but don't finish setup) for a second account if the user approves, to see the behavior-triggered branch.
- Note which emails come from a person ("Hey, it's Sam, the founder") and whether replies reach a human.

Hand the findings to **emails** to design the user's own sequence.

## Upgrade and Paywall

Without paying, push against the free limits: hit the usage cap, try a paid feature, open the upgrade screen. Screenshot:
- The paywall copy, the plan it pushes, and any discount
- Whether the price shown differs from the pricing page (a sign of a test or geo pricing)
- Annual vs monthly framing and the default selection

See **paywalls** and **pricing** for what to compare against.

## The Cancel Flow

On a trial or free plan, start a cancellation or downgrade, and screenshot every step: the survey, save offers (discounts, pauses, downgrades), and the confirmation. Stop before the final confirmation if the user wants to keep watching emails, then cancel at the end. Compare with **churn-prevention**.

## The Sales Process

If the user approves a demo under their own name:

| Record | Example |
|---|---|
| Booking tool and form questions | Chili Piper, 6 fields, asks budget and timeline |
| Routing | Instant calendar vs "we'll be in touch" |
| Speed to first response | 4 minutes, from an SDR |
| Pre-call emails and materials | Agenda, case study, a short video |
| What the demo covers | The order of features, the story, the proof shown |
| Pricing and discounting | Price shown, the end-of-quarter offer |
| Follow-up cadence | Day 1, 3, 7 emails and a LinkedIn request |

Never record a call without the other side's consent. Take notes instead. See **sales-enablement** for turning findings into the user's own demo and follow-up.

## The Chat and Support Probe

Ask the site's chat bot or support the questions buyers ask, in the user's real name:
- "How are you different from [the user's company]?" and from the other big competitor
- "Why would I pick you over [category alternative]?"
- "What's included on the free plan?" and "Do you offer discounts?"

Bots often repeat the positioning script and the sales objection handling word for word. Record the answers verbatim with screenshots, and mark them Observed.

## Screenshots and Logging

- Name screenshots `NN-stage-what.png` (`03-onboarding-role-question.png`) so they sort into a storyboard.
- Every finding in the playbook links its screenshot or email row.
- Blur or crop anything personal before sharing the playbook: names of their staff in emails, other customers' data that appears in shared templates.
