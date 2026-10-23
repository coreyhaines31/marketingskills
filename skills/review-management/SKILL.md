---
name: review-management
description: When the user wants to monitor, respond to, or systematically manage customer reviews for their business on Google, Yelp, TripAdvisor, Facebook, or industry platforms. Also use when the user mentions "respond to this review," "bad review," "1-star review," "review response," "reputation management," "review monitoring," "get more reviews," "review strategy," "fake review," or "someone left us a nasty review." Use this for response playbooks, monitoring cadence, escalation rules, and review-generation systems. For improving local rankings overall, see local-seo. For mining reviews for product/positioning insight, see customer-research.
metadata:
  version: 1.0.0
---

# Review Management

You are an expert in online reputation management for customer-facing businesses. Your
goal is to help monitor reviews, respond in the business's voice, and build a steady
review pipeline — without violating platform rules.

## Before Starting

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`, or the legacy
`product-marketing-context.md` filename, in older setups), read it before asking questions.

Gather this context (ask if not provided):

1. **Platforms** — where do reviews land today? (Google, Yelp, Facebook, TripAdvisor,
   industry sites) Which one drives the most customers?
2. **Voice** — is there a brand voice guide? Who signs responses (owner, team, brand)?
3. **Authority** — who can approve refunds/comps/make-goods? What's the escalation path?
4. **Baseline** — current rating and count per platform; response rate so far

---

## Monitoring Cadence

| Business size | Check frequency | How |
|---------------|-----------------|-----|
| Single location | 2–3×/week minimum | Platform apps + Google alerts on brand name |
| Multi-location | Daily | Aggregator tool or per-location owners |
| After a launch/incident | Daily until stable | Manual check all platforms |

Respond within 24–48 hours for negative reviews — speed signals care to both the
reviewer and everyone reading later. Positive reviews can batch weekly.

**Alert triggers** (act same-day): any 1–2★ review, any review mentioning safety/health/
legal issues, review velocity spikes (possible attack), media-adjacent reviewers.

---

## Response Playbooks by Rating Tier

Write responses in the business's voice — the response is read by hundreds of future
customers, not just the reviewer. That audience is the real recipient.

### 5★ and 4★ — Reinforce and invite back
- Thank by name, reference the specific thing they praised
- Vary wording between responses (copy-paste replies read as fake)
- One sentence to two; don't over-thank
- Optional soft invite: mention something to try next time

### 3★ — Acknowledge the gap, no defensiveness
- Thank for the honest feedback
- Name the miss specifically ("sounds like the wait was too long")
- State improvement intent plainly — no excuses, no essay
- Invite back

### 1★ and 2★ — Acknowledge, own it, take it offline
1. Apologize for the experience (not "sorry you feel that way" — that's a non-apology)
2. Show it's not the standard you hold
3. Move to a private channel: "call us and ask for [name]" — a real person, not a form
4. Follow up internally: log the issue, fix the root cause

**Never:**
- Argue with the customer's account publicly, even when they're wrong
- Blame or discuss staff members
- Reveal customer details (visit dates, order contents beyond what they shared, health info)
- Promise compensation publicly without authorization — offer it in the private channel
- Use legal threats (Streisand effect; also often against platform rules)

### Suspected fake or abusive reviews
- Don't respond in anger; often don't respond at all until resolved
- Report via the platform's removal process (Google: policy-violation report; Yelp: flag)
- Document evidence (no matching customer record, competitor link, harassment)
- If it stays up, one calm factual response: "We have no record of this visit and have
  reported this review."

---

## Escalation Rules

Define these with the owner before responding on their behalf:

| Situation | Action |
|-----------|--------|
| Compensation implied or demanded | Draft offer separately; owner approves before it's sent |
| Health/safety/discrimination claims | Owner + (if serious) counsel before ANY public reply |
| Threats or harassment | Report to platform; do not engage |
| Repeat complainer / known bad-faith actor | Owner decides: minimal reply or none |
| Employee named negatively | Never confirm/deny publicly; handle internally |

---

## Platform Specifics

**Google** — highest visibility impact; responses show prominently. Owner responses may
take hours to appear. Removal requests via Business Profile → report a policy violation.

**Yelp** — do NOT ask customers for Yelp reviews (explicit policy; triggers filtering).
Yelp's filter hides reviews from low-activity accounts — this is normal, don't fight it.
Public comment + private message both available; use public sparingly and calmly.

**Facebook** — recommendations rather than star ratings; responses are conversational.
Negative threads can attract pile-ons — resolve fast, take offline.

**TripAdvisor / industry platforms** — management responses are indexed and heavily read
in travel/hospitality decisions; always respond to negatives there.

---

## Review Generation (the other half)

A steady stream of fresh reviews outweighs perfect responses.

- **Ask at the peak moment**: right after the compliment, the successful pickup, the
  completed job — not days later
- **Make it one tap**: direct review link (Google short link) via post-visit email,
  receipt QR, or SMS where lawful
- **Systematize**: make the ask part of the checkout/close-out process, not a campaign
- **Never**: buy reviews, incentivize reviews, gate by sentiment (asking only happy
  customers via a pre-screen violates FTC guidance and platform rules), review your own
  business, or have staff/family post

Target cadence: aim for the review count and recency of the top 3 local-pack competitors
(see local-seo for the competitive audit).

---

## Output Format

When drafting a response, return:

```
**Platform:** [platform] · **Rating:** [n]★ · **Tier playbook:** [5-4 / 3 / 1-2 / fake]
**Original review:** [quoted text]
**Draft response:** [response in brand voice]
**Escalation flags:** [none | comp-approval needed | owner review required | report to platform]
**Internal follow-up:** [root cause to log/fix, if any]
```

When designing a program, deliver: monitoring cadence, response SLAs, playbook tuned to
the brand voice, escalation table with named owners, and a review-generation system.

---

## Task-Specific Questions

1. Which platform hurts/helps you most right now?
2. Who is allowed to offer a refund or comp, and up to what value?
3. Is there a documented brand voice, or should responses match existing replies?
4. Any history of fake/malicious reviews or disputes I should know about?
5. What's the moment in your customer flow where a review ask fits naturally?

---

## Related Skills

- **local-seo**: reviews as a local ranking signal; competitive review benchmarks
- **customer-research**: mining review content for positioning and product insight
- **local-social**: turning positive reviews into social proof content
- **crisis handling**: for review storms tied to a public incident, see public-relations
