# Google Ads Audit Checklist (Ecommerce)

An itemized, ecommerce-oriented audit of a live Google Ads + Merchant Center account: 32 checks across 11 categories, built to find wasted spend, uncover prospecting opportunities, and surface incremental revenue before scaling.

**Load [audit-guardrails.md](audit-guardrails.md) first — it governs how every item below is scored.** Each check resolves to exactly one of **pass / fail / unknown / not applicable**. An *unknown* (evidence unavailable) reduces coverage, never health. *Not applicable* (e.g. Shopping checks on a lead-gen account) affects neither. Do not grade what you couldn't see, don't invent negative keywords, and draft every change before touching a live account.

Work top to bottom. For each item, record the result, the evidence you saw (or the missing source), and — on a fail — a draft fix, not an applied one.

---

## Tracking

1. **Conversion tracking configuration** — Confirm a single source of truth for purchases. Two systems counting the same order (GA4 import + native tag, or a duplicate gtag) inflates conversions and makes the bidder optimize toward phantom volume. *Fail if double-counting or missing purchase value; pass on a verified test conversion with the right value + currency.* Deep dive: [conversion-tracking.md](conversion-tracking.md).

## Targeting

2. **Customer list for audience targeting** — Check that a hashed customer email list is uploaded and *actively used* — as a signal/lookalike source for prospecting and as an exclusion where it should be (existing buyers on non-upsell campaigns). Uploaded-but-unused is a fail. Deep dive: Customer Match in [audience-targeting.md](audience-targeting.md).
3. **Negative keyword lists** *(Search, Shopping)* — Review shared and campaign-level negatives for irrelevant, out-of-market, or unprofitable queries draining budget. **No search-terms report → unknown, not fail.** Never name candidate negatives from imagination; request the report and run the overblocking review (see audit-guardrails).

## Campaign Structure

4. **Branded vs. non-branded split** — Isolate brand traffic into its own campaign. Brand terms buried inside "generic" or catch-all campaigns inflate blended ROAS and hide non-brand inefficiency. Fail if brand and non-brand share a campaign with no way to read them apart.

## Merchant Center (GMC)

5. **Shipping settings** — Confirm configured shipping speeds/costs match real fulfillment. Understated speed loses the auction; overstated speed risks disapproval. Free-shipping thresholds should be reflected.
6. **Promotions** — Check that live sales, discounts, and evergreen offers are set up as GMC promotions so they render as promotion links on Shopping ads. Missing = leaving CTR on the table.
7. **Product feed titles** — The title's first ~70 characters do the ranking and the clicking. Verify the highest-intent keyword, then key feature/benefit, sit *before* truncation — brand-first titles waste that space unless the brand is the query.
8. **Product images** — Assess whether images stand out in the Shopping carousel (clean, on-white where required, but distinct from competitors). Weak imagery caps CTR no matter the bid.
9. **Store quality overview** — Read the Merchant Center diagnostics: disapprovals, missing/invalid attributes (GTIN, availability, price mismatches), and feed warnings. Disapproved products = silent zero-impression revenue leak.
10. **Product ratings** — Verify individual product ratings sync from the review source and render as star annotations. A configured feed that isn't showing stars is a fail worth chasing.
11. **Impressions on eligible products** — Check the full catalog is actually getting served, not a head of hero SKUs soaking all impressions. Zero-impression eligible products are untested inventory.

## Shopping

12. **Campaign segmentation** — Confirm each Shopping/PMax segment has enough conversion volume (~30–50+/month) to let the bidder learn. Over-segmentation starves every bucket; consolidate before adding structure.
13. **Budget allocation across products** — Trace whether spend flows to positive-ROI SKUs. If losers eat budget while winners are capped, that's a reallocation fail (draft the shift; don't restructure a learning campaign as a reflex).

## Bidding & Budget

14. **Bidding strategy — branded** *(Search)* — On brand, high-intent clicks are cheap and near-certain; basic tROAS/Max-conversion-value can let Google overpay for volume you'd win anyway. Prefer manual/portfolio control or a tight target on brand.
15. **Campaign bidding targets** — Sanity-check every Target ROAS/CPA against campaign type (brand vs. non-brand, hero vs. long-tail). A single blanket target across mismatched economics is a fail — and per audit-guardrails, one budget-to-CPA ratio doesn't fit all objectives.
16. **Non-branded terms in brand campaigns** — Read the brand campaign's search terms for generic, non-branded queries that leaked in. Move them to non-brand so brand ROAS isn't propped up by prospecting spend.
17. **Bidding strategy — non-branded** *(Search, PMax, Shopping, Demand Gen)* — Match strategy to volume and goal: value-based bidding needs conversion data; thin campaigns may need manual/tCPA first. Mismatched strategy on low volume never exits learning.

## Search

18. **New search terms for expansion** — Mine the search-terms report for converting queries not yet directly targeted; expand into keywords, and feed the language back into product titles and content. (Same report gates item 3 — pull once, use for both.)
19. **Ad copy performance** — Check CTR relative to impressions, ad strength, and whether underperformers are being refreshed. Weak copy raises CPC via Quality Score before it ever costs a conversion.
20. **Brand keyword match types** — Brand-protection keywords should run exact or phrase only. Broad on brand invites Google to spend brand budget on loosely related, lower-intent queries.
21. **Brand ad copy quality** — Verify brand ads use consistent formatting, lead with USPs, and track the promotional calendar. Brand is your highest-intent surface; generic brand copy underconverts a captive audience.
22. **Quality Score** — Low QS means higher CPC and lower rank for the same bid. Read it as a diagnostic (expected CTR / ad relevance / landing-page experience components), not a metric to game.

## Performance Max

23. **PMax signals** — Check asset groups actually carry audience signals — search themes plus the customer list — rather than empty signal fields. Signals are advisory, not deterministic, but empty ones forfeit a real optimization lever.
24. **PMax budget on Shopping** — Shopping is usually the money placement inside PMax. Confirm a meaningful share of PMax spend lands there (via the account report or product-level data) rather than bleeding into low-intent display/video.

## Landing Page

25. **Comparison page funnel** — Look for a listicle-style review page on an independent domain that positions the brand as #1 — a proven cold-traffic funnel Shopping/PMax can point to.
26. **Head-to-head competitor pages** — "Us vs. them" pages that capture comparison-stage demand. Absence is an opportunity, not a defect.
27. **Advertorials** — Check whether cold Google traffic is met with advertorial (story-led, editorial-feel) landers, not just a raw PDP.
28. **Landing page optimization** — Confirm the ad's promise (offer, price, hero product) appears clearly above the fold on the lander. Ad-to-page scent mismatch wastes the click regardless of bid — the highest-leverage post-click fix.

## Demand Gen

29. **Performance by format** — Segment Demand Gen results by network (Shorts, In-Stream, In-Feed + Discovery, Gmail, Display) to find which format actually drives efficient conversions; a blended DG number hides the winner and the drain.
30. **Quiz funnel for cold traffic** *(Landing Page)* — A quiz funnel warms and segments cold Google/Demand-Gen traffic through a personalized path. Its absence is a prospecting-funnel gap to flag.
31. **Demand Gen demographics** — Analyze performance by age, gender, parental status, and household-income bands to catch mis-serving and inform exclusions/bid adjustments.
32. **Top-of-funnel campaign** *(Search)* — Confirm something is reaching cold audiences who don't yet know the product — with a conversion goal, not a bare awareness objective. All-bottom-funnel accounts cap out at existing demand.

---

## Rolling it up

- Score only verified items. Present **health** (pass/fail ratio on verified checks) and **evidence coverage** (share of applicable checks you could verify) as two separate numbers — never blend them.
- Below 60% coverage, report findings and unknowns instead of a single health score (see audit-guardrails coverage bands).
- List every unknown with the exact evidence you'd need to resolve it (usually: search-terms report, Merchant Center access, conversion-action settings, or account-level PMax/DG reports).
- Deliver fails as draft fixes — current state → proposed change → expected effect → rollback — and apply only with explicit approval.

---

*Adapted into this skill's framing from ECHELONN's public Google Ads Audit Checklist (Jackson Blackledge, ECHELONN.IO). Item structure credited; descriptions and scoring are rewritten to this skill's voice and paired with the four-state audit model in [audit-guardrails.md](audit-guardrails.md).*
