# Google Search Playbook (B2B)

Intent-first operating rules for Google Ads: where to spend first, how to structure the account, when to loosen match types, and how to keep smart bidding pointed at revenue instead of junk form-fills. For RSA generation mechanics, see [rsa-output-spec.md](rsa-output-spec.md).

## Contents

- The intent ladder
- Brand bidding (and the pause test)
- Capture before you create
- Account structure
- Keywords and match types
- Negative keywords
- The weekly search-terms ritual
- Bidding by conversion volume
- Offline conversions
- Quality Score and landing pages
- PMax for B2B
- Benchmarks and the weekly scorecard

## The intent ladder

Spend opens rung by rung — each tier unlocks only after the one below proves it converts to *pipeline*:

1. **Brand** — "they want you" (brand name, brand + pricing/login). Cheapest clicks, highest conversion. Always on.
2. **High-intent non-brand** — ready to buy ("cold email software," "best CRM for agencies"). The profit center; most budget lives here.
3. **Competitor** — evaluating alternatives ("[competitor] alternative/vs"). Higher CPC, lower CVR; run selectively with dedicated comparison pages.
4. **Problem-aware** — has the problem, isn't shopping ("how to scale outbound"). Longer payback; only after tiers 1–2 work.
5. **Demand-gen/awareness** — broad, Display, YouTube. Last, with spare budget only.

**Don't skip rungs.** Broad spend before high-intent proof is how B2B accounts burn budgets with nothing in the CRM.

## Brand bidding (and the pause test)

Bid on brand by default — if you don't, competitors will, and you pay in lost deals rather than clicks. The exception: if you're the only bidder and organic owns the whole SERP, test pausing brand and watch **total brand conversions (paid + organic)**, not just paid. If total holds, you were cannibalizing yourself; if it drops, turn it back on. Cap brand budget — it rarely needs much, and shared budgets let brand eat everything (see below).

## Capture before you create

Search **harvests existing demand**; it cannot create demand. If your category has near-zero search volume, say so and put the budget upstream (LinkedIn/Meta/YouTube) instead of forcing keywords nobody types. Demand creation happens on social; Search is where you catch it landing.

## Account structure

Minimum viable split — each with an **independent budget**:

- **Brand** (own budget — never shared)
- **Non-brand high-intent** (one campaign, themed ad groups by solution)
- **Competitor** (own budget and messaging — its CPC/CVR economics are different)
- **Remarketing** (separate from Search)

Why independent budgets: in a shared budget the cheapest, highest-converting campaign (always brand) starves the ones you actually need data from. The account looks profitable on paper and is blind everywhere that matters.

- **Themed ad groups, not SKAGs:** 5–15 closely related keywords sharing one intent, answerable by one promise. If two keywords need different landing pages or value props, split the group. 2–3 RSAs per ad group.
- **Consolidation rule:** a campaign that can't reach ~15–30 conversions/month can't feed smart bidding — merge it. Fewer, better-fed campaigns beat elaborate structures in low-volume B2B.
- **Default settings to flip on every new Search campaign:** turn OFF Search Partners and Display Network until proven; set location targeting to **"Presence"** (people physically in the target geo — the default "presence or interest" serves people merely interested in it); remember language targeting keys off the user's Google interface language, not the query language.
- **Don't compete with yourself:** the same keyword at the same match type in multiple ad groups splits your data and bids against your own account. Use negatives to route each query to exactly one home.

## Keywords and match types

Source keywords from how **buyers describe the problem** (sales-call language, your own search-terms report, competitor ad copy) — not how you describe the product. A keyword with 50 searches/month and clear intent beats one with 5,000 and mixed intent. Tag every keyword by intent tier.

**Match-type progression — in this order:**

1. Start high-intent terms on **Phrase + Exact** (Exact still matches close variants; Phrase is the B2B workhorse), manual CPC or Max Conversions while volume is low.
2. Mine the search-terms report weekly (ritual below).
3. Introduce **Broad only after**: 30+ conversions/month in the campaign, AND smart bidding live, AND a tight negative list. Broad without all three is a donation to Google.

## Negative keywords

Starter lists to apply at build time:

- **Universal junk:** free, cheap, jobs, salary, hiring, career, intern, student, course, tutorial, training, certification, pdf, template, reddit, wiki, login (except in brand campaigns)
- **Research intent:** "what is," "how to," "examples," "meaning," "definition"
- **Category collisions:** terms your category shares with an unrelated one (selling sales-engagement? negative "employee engagement")
- **Your brand as a negative in non-brand campaigns** — routes brand traffic to the brand campaign where it belongs

**Match-type mechanics gotcha:** negative broad requires ALL its words present (any order) — negative broad "free trial" does **not** block "free" alone. Negative phrase blocks in-order phrases; negative exact blocks only that exact query. Most accidental over-blocking and under-blocking traces to this.

**Don't over-negative:** every negative narrows reach, and it compounds fast at B2B volumes. Negative the clearly wrong, not the merely uncertain — an ambiguous term deserves more data before it's cut.

## The weekly search-terms ritual

Once a week per campaign, three passes:

1. **Waste:** terms with spend (3+ clicks) and zero conversions → negative the irrelevant ones.
2. **Winners:** converting search terms that aren't keywords yet → add as Exact/Phrase in the right ad group.
3. **Drift:** broad/phrase matches pulling adjacent-but-wrong meanings → tighten the match type or negative the drift.

## Bidding by conversion volume

| Conversions/month (campaign) | Strategy |
|---|---|
| 0–15 | Manual CPC or Maximize Conversions (no target) |
| 15–30 | Maximize Conversions |
| 30+ stable | Target CPA — set at or slightly above your trailing 30-day actual |
| Real revenue values flowing back | Target ROAS |

Rules of thumb: smart bidding needs ~30 conversions in 30 days per campaign to learn. Set tCPA near actuals — an aggressively low target chokes delivery (Google just stops bidding). Move targets in **±10–15% steps and wait 1–2 weeks**; every change restarts learning, so don't panic-edit inside the learning window. Budget mechanics: campaigns can spend up to **2× daily budget** in a day (Google balances monthly — single-day overspend is normal); a budget-capped campaign that's converting often *lowers* its CPA when you raise the budget, because constrained smart bidding underperforms.

## Offline conversions

The single highest-impact move in a B2B Google account: **import CRM outcomes** (SQL, opportunity, closed-won) back into Google via GCLID + offline conversion import or a native CRM integration, with real deal values. Until then, smart bidding optimizes to form-fills and buys you junk (see the optimize-to-quality trap in [b2b-paid-playbook.md](b2b-paid-playbook.md)). B2B clicks close in 60–180 days — in-platform conversion counts will never tell the truth on their own. Reconcile against the CRM monthly; the CRM wins.

## Quality Score and landing pages

QS (1–10, per keyword) = expected CTR + ad relevance + landing page experience. Low QS means paying more for the same position — **fix the weak component before raising the bid.** Landing page rules that move it: message match (page headline echoes the ad's promise and the query — not a generic homepage); one job and one CTA per page; speed; proof above the fold. **Form length is an intent gate:** short forms buy volume at lower quality, longer qualified forms buy fewer/better — match it to what you're feeding back as the conversion event.

## PMax for B2B

Value ranking: **brand Search > high-intent non-brand Search > remarketing > PMax > broad demand-gen.** PMax earns budget only after the cheaper, clearer wins are maxed. Never run it as the first campaign, on weak tracking, or on tiny budgets.

Guardrails when you do run it: account-level **brand exclusions** (or it cannibalizes brand Search and claims the credit); audience signals from first-party data; negative keywords from day one; offline conversions imported *before* scaling it; check the CRM quality of PMax leads by campaign — if they convert to pipeline at half the rate of Search leads, PMax is cheap-looking and expensive-in-reality. Google auto-generates a bad video if you don't supply one.

## Benchmarks and the weekly scorecard

B2B SaaS Search ranges (wide on purpose — anchor to your own first 30 days): brand CTR 8–20%, CVR 15–40%; non-brand high-intent CTR 2–6%, CVR 3–10%, CPC $8–40+, CPL $80–400+; competitor terms run higher CPC and lower CVR than non-brand.

Weekly scorecard — exactly eight numbers: spend · leads · CPL · lead→SQL rate (from CRM) · SQLs · cost per SQL · Search impression share · top wasted search terms. Diagnostic: **Search Lost IS (budget)** vs **Lost IS (rank)** tells you whether you're capped by money or by Ad Rank — different problems, different fixes. If the eight are healthy and trending right, the account is healthy.

---

*Framework lineage: adapted (re-expressed and restructured) from practitioner playbooks, notably Ivan Falco's ads-skills. Benchmarks are practitioner-reported starting points — recalibrate against your own account.*
