# Crisis Statement Templates

Ready-to-adapt structures for the most common crisis communication moments. Every template needs real specifics filled in — none of these should ship with placeholder brackets still in them.

## Contents
- Holding Statement (buy time without overcommitting)
- Full Incident Statement (general structure)
- Data Breach / Security Incident Notification
- Product Outage Statement
- Customer Harm / Apology Statement
- Billing or Pricing Error Statement
- Public Postmortem (post-resolution)

## Holding Statement

Use within the first 30-60 minutes, before all facts are confirmed. Buys time without making claims you can't back up yet.

```
We're aware of [specific issue — outage / reports of X / the incident described in Y].

We're actively investigating and will share a full update by [specific time].

[If applicable: In the meantime, here's what we recommend — e.g., status page link, workaround.]
```

Do not speculate on cause, scope, or who's affected in a holding statement — that's what the full statement is for, once confirmed.

## Full Incident Statement (General Structure)

```
[1. What happened — one or two sentences, plain language, no jargon]

[2. Who is affected — be specific: "customers on the X plan," "users who signed up before [date]," "all users in [region]"]

[3. What we know is confirmed, and what is still being investigated]

[4. What we're doing about it right now]

[5. What affected parties should do, if anything]

[6. When we'll share the next update]

[7. A direct contact or channel for questions]
```

## Data Breach / Security Incident Notification

```
Subject: Important security update regarding your [Company] account

We're writing to let you know about a security incident that [affected/may have affected] your account.

What happened: [Plain-language description — how it was discovered, when, by whom (internal team / external researcher / reported by a customer)]

What information was involved: [Be exact. If still confirming scope, say: "We have confirmed [X] was affected. We are still investigating whether [Y] was also affected and will update you by [time/date] either way."]

What we've done: [Immediate containment steps — e.g., "We've patched the vulnerability, rotated affected credentials, and engaged a third-party security firm to audit the fix."]

What you should do: [Specific actions — reset password, enable 2FA, monitor statements, etc. Don't just say "be vigilant" — give concrete steps.]

What we're doing going forward: [Process/system change that prevents recurrence]

We take full responsibility for this and are sorry for the disruption and concern this has caused. If you have questions, reach us directly at [contact] — we will respond within [timeframe].
```

**Note:** Check breach-notification laws in every relevant jurisdiction before sending — many (e.g., GDPR, US state laws) have mandatory disclosure windows (commonly 72 hours) and required content elements. This template is a communications starting point, not a substitute for legal review.

## Product Outage Statement

**Initial (status page or pinned post):**
```
We're currently experiencing [specific symptom — e.g., "elevated error rates on [feature]" or "a full service outage"] affecting [scope — all users / users in region X / users on plan Y].

We're investigating and will post an update by [time].
```

**Resolution:**
```
This incident is resolved as of [time]. 

Root cause: [Plain-language summary — save the full technical postmortem for a separate doc if needed]

Duration: [start] to [end], affecting [scope]

What's changing: [Specific prevention step]

We're sorry for the disruption. [If applicable: credits/compensation details and how they'll be applied automatically — don't make affected customers request it.]
```

## Customer Harm / Apology Statement

For a specific customer's negative experience that's gone public (viral complaint, news story).

```
We saw [customer]'s experience with [specific situation], and we're sorry. [State plainly what went wrong — no hedging, no "if" language.]

[What you're doing to make it right for this specific customer — be concrete]

[What you're changing so this doesn't happen to others — be concrete, not "we're reviewing our processes"]

We've reached out to [customer] directly and will keep working with them until this is resolved.
```

**Sequence matters:** reach out to the customer privately before posting anything public. A public apology that the customer hasn't seen yet, or that contradicts what you told them privately, makes things worse.

## Billing or Pricing Error Statement

```
We identified an error that [specific issue — e.g., "overcharged customers on the annual plan between [dates]"], affecting [number/percentage] of customers.

We've already [issued refunds / applied credits / fixed the billing logic] — you don't need to do anything; [refunds/credits] will appear by [date]. If you don't see it by then, contact us at [channel].

This happened because [brief, honest root cause — e.g., "a bug in our billing migration"]. We've fixed it and added [specific safeguard] to catch this before it reaches customers in the future.

We're sorry for the inconvenience and appreciate your patience.
```

Lead with the fix already being underway/done, not with a request for affected customers to come forward — proactive correction reads far better than reactive correction under pressure.

## Public Postmortem (Post-Resolution)

For Tier 3-4 incidents, published once the immediate crisis is resolved and root cause is confirmed.

```
# [Incident name] — Postmortem

**Summary:** [2-3 sentences: what happened, impact, duration]

**Timeline:**
- [Time] — [Event, e.g., "issue introduced," "first reports received," "internal escalation," "fix deployed," "fully resolved"]

**Root cause:** [Specific technical or process cause — avoid vague language like "a configuration issue"]

**Impact:** [Who/what was affected, scope, duration]

**What we're changing:**
1. [Specific, verifiable change — e.g., "added automated rollback on deploy failures"]
2. [Specific, verifiable change]

**What we got right:** [Optional but builds credibility — e.g., fast detection, clear internal communication]

**What we'd do differently:** [Honest reflection on response gaps, not just the technical cause]
```

Specificity is what makes a postmortem rebuild trust rather than read as PR theater — vague commitments ("we'll do better") are forgettable; specific, checkable commitments are not.
