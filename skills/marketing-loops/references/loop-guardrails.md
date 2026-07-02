# Loop Guardrails & Compliance

Loops act on a schedule, often on customer data, sometimes with money or a public voice. This reference consolidates the safety rules that keep autonomous loops from doing harm. Apply it to every loop that sends, spends, publishes, or touches personal data.

## The two-tier action model

Classify every action a loop can take:

**Tier 1 — Autonomous-safe** (a loop may do these unattended):
read data, analyze, diff, score, **draft**, and **stage** work for review.

**Tier 2 — Gated** (require a human checkpoint by default):
**spend** money, **shift budget**, **send** messages, **publish** anything public, **delete/suppress** records, **change** live account settings.

A Tier-2 action may run without a per-action human check only if the user has **explicitly authorized** it *and* it's bounded by caps + an allowlist (below). Absent that, the loop stages a draft and a human approves.

## Spend guardrails (ad-fatigue, paid-search, retargeting, expansion)

- **Hard caps**: a daily/weekly spend ceiling the loop can never exceed; halt and alert if approached.
- **Per-run change limit**: cap how much budget can move in one run (e.g., ≤20%), so a bad read can't reallocate everything.
- **Allowlist**: only specified accounts/campaigns are eligible for autonomous changes; everything else is staged.
- **Directional guardrails**: judge paid changes on revenue/ROAS, not just CTR/CPA — never optimize a proxy metric into a revenue loss.

## Publish & send guardrails (email, social, PR, community, reviews)

- **Default to a staging queue** + human approval for anything public or outbound. Auto-*drafting* is fine; auto-*publishing* is not, unless explicitly authorized.
- **Volume caps**: per-run and per-recipient limits so a loop can't blast a list or over-post a channel.
- **Suppression first**: always check suppression/unsubscribe/do-not-contact lists before sending.
- **No auto-posting where detection/ToS bites**: owned social, press pitches, and community replies are staged for a human (bot detection + brand risk).

## Compliance

Match each rule to the loops it governs:

- **CAN-SPAM / CASL (email/SMS loops — lifecycle, re-engagement, churn, trial, dunning, referral)**: honor unsubscribes immediately and permanently; include a working unsubscribe + physical address; identify the sender; don't email/text without a lawful basis or consent; scrub against suppression every send.
- **GDPR / CCPA (any loop touching personal data)**: process on a lawful basis; get consent for EU marketing; honor deletion and opt-out requests; minimize data pulled and retained; don't repurpose data beyond its collected purpose.
- **FTC (review-and-UGC-harvest, referral, social)**: disclose material connections and incentives (#ad, "I was compensated"); only use testimonials with permission; no fabricated or cherry-picked-to-mislead claims.
- **Platform ToS (social-listening, community-engagement, review-site-management, scraping-based loops)**: respect rate limits and automation rules; follow review-platform response policies; don't scrape or auto-act where prohibited.

When a loop can't confirm consent, permission, or ToS-compatibility, its stop condition is **don't act** — stage for a human instead.

## PII handling

- Don't log raw PII in loop **state** or **run logs** — use internal IDs or hashes.
- Pull the minimum personal data needed to make the decision; don't hoard it in state.
- Keep exports and drafts out of shared/synced locations unless intended.

## Always-escalate list

These never run fully autonomously — route to a human regardless of authorization:

- Negative or crisis brand mentions; responses to complaints or legal/medical/financial-sensitive issues.
- Newsjacking angles (see the veto list in the catalog) — human approval before any pitch/post.
- High-value or strategic accounts (enterprise, at-risk logos).
- Anomalies in **revenue** or **ad spend** — flag immediately, don't self-correct.
- Anything that would delete data or contact a large audience at once.

## Kill switch

Every scheduled loop needs a manual off switch, and you should know how to stop **all** loops fast (disable the schedule / cron, or a global flag the loop bodies check). Document it where the loops are scheduled. A loop you can't stop quickly is a liability.

## Pre-launch guardrail checklist

Before scheduling any loop that sends, spends, publishes, or touches personal data:

- [ ] Every action is classified Tier 1 (auto) or Tier 2 (gated).
- [ ] Tier-2 actions are staged for approval — or bounded by explicit authorization + caps + allowlist.
- [ ] Spend loops have a hard cap and a per-run change limit.
- [ ] Send loops check suppression/unsubscribe and have volume caps.
- [ ] Applicable compliance rules (CAN-SPAM/GDPR/FTC/ToS) are satisfied, with "don't act" as the fallback.
- [ ] No raw PII in state or logs.
- [ ] The always-escalate cases route to a human.
- [ ] There's a documented kill switch.
