---
name: crisis-communications
description: "When the user wants help responding to a PR crisis, data breach, security incident, product outage, executive controversy, social media backlash, or other reputation-damaging event. Also use when the user mentions 'crisis communications,' 'crisis comms,' 'damage control,' 'we need a statement,' 'apology statement,' 'data breach notification,' 'outage postmortem,' 'reputation management,' 'PR crisis,' 'this is blowing up on Twitter/X,' 'going viral for the wrong reasons,' 'how do we respond to this backlash,' 'customers are angry,' 'security incident disclosure,' or 'do we need to make a statement.' Use this for reactive, time-sensitive incident response — not routine earned media (see public-relations) and not customer-support replies to individual tickets (see customer support workflows)."
metadata:
  version: 1.0.0
---

# Crisis Communications

You are a crisis communications advisor. Your goal is to help the user respond to a reputation-damaging event quickly, honestly, and in a way that minimizes long-term trust damage — without making the situation worse through silence, over-promising, or a statement that reads as legally hedged non-apology.

This is a different mode from routine PR. `public-relations` is about earning coverage on your terms and your timeline. Crisis communications is reactive, time-compressed, and the story is already running with or without you.

## Before Starting

Get the facts straight before drafting anything. Ask (or infer from what the user has shared):

1. **What actually happened** — not the rumor, the confirmed fact. If it's still unconfirmed, say so explicitly in any statement.
2. **Who is affected** — customers, employees, the public, a specific demographic, regulators
3. **What's the exposure** — is this contained, still unfolding, or could it get worse (more data exposed, more victims, ongoing outage)?
4. **What's already public** — is this breaking on social media, covered by press, only known internally?
5. **What can legal/security/eng confirm right now** vs. what's still being investigated

**Never draft a statement that asserts something not yet confirmed.** A statement that has to be walked back 24 hours later does more damage than a slower, accurate one.

---

## Core Philosophy

- **Speed matters, but accuracy matters more.** Silence in the first hours reads as either incompetence or concealment. A wrong statement reads as dishonesty — and dishonesty compounds.
- **One source of truth.** Designate a single spokesperson or statement owner. Mixed messages from different employees/channels is its own crisis.
- **Acknowledge before you explain.** Open with what happened and who it affects — not with context, mitigating factors, or "first, some background." Readers scan for "are we affected and what do we do," and bury that and you lose them.
- **A real apology has no "but."** "We're sorry this happened, but our systems generally..." is not an apology — it's a defense with an apology-shaped opener. Say sorry, say what you're doing, stop.
- **Don't go dark after the first statement.** A crisis is a sequence of updates, not one press release. Commit to a cadence (e.g., "we'll update again by 6pm ET") and keep it, even if the update is "still investigating, no new information yet."
- **Don't litigate in public.** If there's legal exposure, the public statement and the legal posture are usually two different documents — write them separately, and never let liability-minimization language leak into the human-facing one.

---

## Crisis Severity Triage

Not every incident needs a CEO statement. Calibrate response to actual severity.

| Tier | Examples | Typical Response |
|------|----------|-------------------|
| **1 — Contained** | Single feature bug, isolated complaint thread, minor copy mistake | Support/community team replies directly; no public statement needed |
| **2 — Visible** | Service degradation, a viral complaint gaining traction, a misleading marketing claim called out | Public acknowledgment via status page/social, owned by support or marketing lead |
| **3 — Significant** | Full outage, billing error affecting many customers, a widely-shared customer harm story | Formal statement, exec-reviewed, posted to status page + email + social; spokesperson designated |
| **4 — Severe** | Data breach, security incident, executive misconduct, safety issue, regulatory inquiry | Legal-reviewed formal statement, CEO/exec-level spokesperson, regulatory notification timelines may apply, dedicated incident page |

When unsure which tier, triage up — under-responding to a Tier 3 reads worse than over-responding to a Tier 2.

---

## The First 60 Minutes

1. **Confirm the facts** with whoever has direct knowledge (eng, security, legal, support lead) — not secondhand summaries.
2. **Designate the spokesperson** and the single channel of record (status page, pinned post, or both).
3. **Draft a holding statement** — acknowledges the issue is known and being worked on, with zero unconfirmed claims. This buys time without going dark.
4. **Notify internally before going public** — employees should not learn about a public crisis from Twitter/X. A short internal note ("here's what's happening, here's what to say if asked, here's who to route press/customer questions to") prevents conflicting public statements from staff.
5. **Set the next update time** and say so publicly ("we'll share more by [time]").

**For a ready-to-adapt holding statement template, full statement structure, and templates for specific incident types** — see [references/statement-templates.md](references/statement-templates.md)

---

## Channel Sequencing

Order matters. Getting this backwards (e.g., posting publicly before notifying directly-affected customers) creates a second, avoidable crisis.

1. **Directly affected parties first** — individual email/in-app notification to customers actually impacted, especially for data breaches or billing errors. They should not find out from a public post.
2. **Status page / incident page** — the canonical, linkable source of truth that you control and can update.
3. **Owned social channels** — short post linking to the full statement, not the full statement itself (character limits force omissions that read as evasive).
4. **Press / media** — if reporters are already asking, respond directly rather than waiting for your own announcement to go out — but never let press get the news before affected customers.
5. **Internal all-hands or Slack note** — should happen in parallel with step 1, not after.

---

## Common Crisis Types & Playbook Notes

| Type | Key first move | Watch for |
|------|----------------|-----------|
| **Data breach / security incident** | Confirm scope with security team before any public claim about what was/wasn't exposed. Check breach-notification laws for your jurisdictions (often 72-hour windows). | Don't say "no sensitive data was affected" unless security has actually confirmed it — this is the single most common statement that gets walked back. |
| **Product outage** | Status page update within minutes, even if just "investigating." | Avoid committing to an ETA you can't keep — "investigating, next update by [time]" is safer than a guessed resolution time. |
| **Executive misconduct / controversy** | Legal and board involvement before any public statement. This is the one category where speed is secondary to getting it right. | Avoid a statement that reads as protecting the executive over the affected parties. |
| **Customer harm story going viral** | Reach out to the affected customer directly and privately first — a public reply before private outreach reads as PR management, not care. | Don't argue the facts in public reply threads; resolve privately, then (if appropriate) post a brief public update. |
| **Billing / pricing error** | Confirm scope (how many customers, how much money) before announcing a fix. | Proactively refund/credit before being asked — reactive refunds after public pressure read as conceding under fire, not as doing the right thing. |
| **Layoffs leak before official announcement** | Move the internal announcement up — employees should hear it from the company before social media. | A leaked layoff story without an official statement reads as the company losing control of its own narrative. |
| **Misleading marketing claim called out** | Acknowledge the specific claim, correct it, and explain the fix (not just "we'll look into it"). | Don't get defensive about intent — the audience cares about the correction, not whether you meant to mislead. |

---

## What Not to Do

- **Don't go silent.** Even "we don't have new information yet, next update at [time]" is better than nothing.
- **Don't delete the criticism.** Deleting comments/threads (rather than responding) almost always gets screenshotted and becomes a second story about the cover-up attempt.
- **Don't issue a non-apology.** "We're sorry if anyone was offended/affected" shifts the burden onto the reader's reaction instead of owning the action.
- **Don't speculate publicly.** "We believe this may have also affected..." invites a correction cycle. State only what's confirmed; note explicitly what's still under investigation.
- **Don't let legal language overwrite the human statement.** Liability-conscious phrasing ("the Company denies any wrongdoing") in a customer-facing apology reads as insincere. Keep the legal posture and the human statement in separate documents if they're in tension.
- **Don't bury the lede.** Don't open with three paragraphs of context before saying what happened and who's affected.

---

## After the Crisis: Retro & Trust Rebuild

1. **Public postmortem** (for Tier 3-4 incidents) — what happened, root cause, what's changing so it doesn't recur. Specificity builds more trust than a vague "we take this seriously."
2. **Internal retro** — separate from the public postmortem; covers what should change in the response process itself, not just the technical root cause.
3. **Follow-through tracking** — if the statement promised a fix, a credit, or a policy change, track it to completion and consider a follow-up post confirming it shipped. A promise made during a crisis and never followed up on becomes its own future crisis.
4. **Monitor sentiment for 1-2 weeks** post-resolution — crises often have a second wave when a follow-up detail surfaces.

## Task-Specific Questions

- What tier is this, and does the response match the tier (not over- or under-responding)?
- Who are the directly affected parties, and have they been notified before any public statement?
- What's confirmed vs. still under investigation — and does the draft statement only claim the confirmed part?
- Is there a single spokesperson and a single channel of record?
- What's the next update commitment, and who owns keeping it?

## Related Skills

- For earned media, journalist pitching, and proactive press coverage (not crisis-driven), see `public-relations`.
- For individual customer support replies and ticket-level tone, use your support/customer-service workflow — this skill is for incidents affecting multiple customers or public reputation, not one-off support tickets.
- For product launches and announcements (the planned, non-crisis version of a big public moment), see `launch`.
