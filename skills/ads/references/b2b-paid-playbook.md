# B2B Paid Playbook

Cross-platform operating rules for B2B paid acquisition — where sales cycles run 2–24 months, in-platform conversions mislead, and lead *quality* matters more than lead cost. Use this alongside the platform playbooks ([Meta decision system](meta-decision-system.md), [LinkedIn](linkedin-b2b-playbook.md), [Google Search](google-search-playbook.md), [ABM](abm-playbook.md)).

## Contents

- The Demand Lifecycle (5 stages, past the funnel)
- Budget by stage
- Leading vs. lagging signals
- Unit economics: breakeven CPL and CPC
- Kill rules
- The optimize-to-quality trap (and the offline conversion loop)
- Lead quality scoring (Urgency / Budget / Fit)
- The scaling quadrant
- Measurement maturity check
- Channel selection

## The Demand Lifecycle (5 stages, past the funnel)

TOFU/MOFU/BOFU stops at conversion. B2B revenue doesn't — closed-lost deals, open pipeline, and existing customers are all addressable with ads. Plan across five stages:

| Stage | Outcome | Buyer awareness | Typical offers | KPIs |
|-------|---------|-----------------|----------------|------|
| **Create** | Build affinity & trust | Unaware / Problem-aware | Educational content, POV | Cost per consumption, blended cost/opp |
| **Capture** | Convert in-market buyers | Solution / Product-aware | Demos, trials | Pipe-to-spend, direct cost/opp |
| **Accelerate** (sales-led) / **Activate** (product-led) | Close open deals faster / convert free users | Product / Offer-aware | Case studies, webinars, events | Pipeline velocity, paid signups |
| **Revive** | Restart closed-lost | Offer-aware | Incentivized demos, guided trials | SQOs created, cost/SQO |
| **Expand** | Grow existing accounts | Most aware | Referral programs, new-feature content | Expansion revenue, influenced SQOs |

**Build bottom-up for fastest ROI**: Expand → Revive → Accelerate/Activate → Capture → Create. The bottom stages are cheap, small-audience, and quick to pay back; Create is the biggest and slowest investment. Most teams build top-down and burn months waiting for ROI.

## Budget by stage

| Stage | Budget size | Time to ROI | Difficulty |
|-------|------------|-------------|------------|
| Create | High | 90+ days | High (needs strong content + POV) |
| Capture | Moderate | <45 days | High (expensive, competitive) |
| Accelerate/Activate | Low | Tracks sales cycle | Low |
| Revive | Low | <45 days | Low |
| Expand | Low | <60 days | Medium (small audiences) |

Weight by motion: product-led skews budget to Create + Capture; sales-led with a small TAM skews to Create + Accelerate. The stage with the most *pipeline* isn't automatically the stage that deserves the most *budget* — fund where pipeline share exceeds budget share and the audience is under-penetrated.

## Leading vs. lagging signals

You can't optimize on closed-won when deals close in 6 months. Split every stage's metrics:

- **Leading** (moves in <1 month — optimize on these): CTR, engagement, CPL, cost per qualified lead, accounts reached
- **Lagging** (moves in >1 month — the truth, reviewed monthly/quarterly): pipe-to-spend, influenced revenue, time-to-close, expansion revenue

The leading metric must demonstrably correlate with the lagging one — a proxy metric worth optimizing is measurable, moveable, not an average, and hard to game. If CPL falls while pipeline doesn't move, the proxy broke; fix the proxy, not the ads.

## Unit economics: breakeven CPL and CPC

Derive targets from deal math, not platform benchmarks:

- **Breakeven CPL** = average deal size × lead-to-close rate. ($3,000 ACV × 10% close = $300 CPL.)
- **Breakeven CPC** = target CPL × landing page conversion rate. ($300 CPL × 5% LP conversion = $15 CPC.)

Set the actual target below breakeven by your required margin. Every kill rule and scaling decision keys off this number.

## Kill rules

Two hard rules that remove emotion from pausing decisions:

- **Non-performer rule** (new ads, any time): pause once an ad has spent **2–3× target CPL with zero conversions**. Target CPL $300 → kill at $600–900 spent, no conversions.
- **Maintenance rule** (ads past ~7–14 days): pause when an ad's CPL runs **1.5–2× over target**. Target $300 → kill at $450–600 CPL.

These aren't statistically rigorous — they're repeatable, cheap to apply, and better than deciding by mood. Never pause a producer without a replacement staged (see the swap rules in the [Meta decision system](meta-decision-system.md)).

## The optimize-to-quality trap (and the offline conversion loop)

Smart bidding optimizes toward whatever you call a "conversion." Feed it raw form-fills and it will buy you cheap junk form-fills — CPL improves while pipeline dies. The fix, in order:

1. **Close the offline conversion loop.** Push CRM stage changes (MQL → SQL → opportunity → closed-won) back to the ad platforms — GCLID + offline import on Google, CAPI lifecycle events on Meta, conversion API on LinkedIn. This is the single highest-impact move in a B2B ad account: the algorithm starts buying pipeline instead of form-fills.
2. **Value conversions differently.** A demo request is not an ebook download.
3. **Until offline data flows, keep a human reading lead quality weekly** — job titles and companies, not just CPL.

Reconcile platform-reported conversions against the CRM monthly. When they disagree, **the CRM wins**.

## Lead quality scoring (Urgency / Budget / Fit)

The platform can't see lead quality — score it yourself and rank ads by it:

- **Urgency** (0–3): 0 browsing → 3 burning need with timeline
- **Budget** (0–3): 0 none/no authority → 3 approved and ready
- **Fit** (0–3): 0 not ICP → 3 perfect ICP

Whoever runs the sales calls scores each lead (max 9) and logs it against the originating ad. After ~20 scored calls, **rank ads by average quality score, not CPL or CTR** — the ad with the best CPL is regularly the one producing 3/9 leads. Scale the high-score ads; kill variations whose average drops below ~5.

## The scaling quadrant

Route scaling tactics by your actual constraint:

| | Low effort | High effort |
|---|---|---|
| **High budget** | **Audiences** — bigger audiences, more segments, more frequency | **Geography** — new countries/regions (localization work) |
| **Low budget** | **Ads** — new creative, angles, formats | **Objectives & bids** — change objective or bid strategy to buy cheaper |

- Have budget but no time → work the top row (audiences, then geo).
- Need scale but capped on budget → work the bottom row (better creative and cheaper bidding free up money).

## Measurement maturity check

Before scaling spend, score yourself 1–3 on each: blended pipeline dashboard; per-channel dashboard; conversion tracking (1 = none, 2 = pixel only, 3 = offline conversions flowing); web analytics; a documented, agreed attribution process. Under ~6/15, fix visibility before adding budget — you're flying blind and every optimization is a guess. Fix the lowest score first.

## Channel selection

Five channel families: paid social, paid search, **paid review listings** (G2, Capterra, Software Advice — often skipped, high intent), programmatic (display, audio, CTV, native), and sponsorships (newsletters, podcasts, events, creators). Evaluate on four axes: can you actually target your ICP; media cost (CPC/CPM); reach at your targeting; platform policy for your industry.

Before committing to a new channel, **run a ~$100 test campaign** to learn its real CPC/CPM for your targeting — platform estimates and published benchmarks are consistently wrong for specific ICPs.

---

*Framework lineage: several operating rules in this file are adapted (re-expressed, restructured, and extended) from practitioner playbooks, notably Ivan Falco's ads-skills. Benchmarks and thresholds are practitioner-reported starting points — always recalibrate against your own account's first 30 days.*
