# Attribution Models — The Math, Worked

Six standard models, one journey scored six ways, and data-driven attribution explained without the black box. Use this when the user wants to understand *why* two models disagree, or needs to pick one defensibly.

## The worked journey

A single B2B buyer's path to a $12,000 annual deal, five touches over 38 days:

| # | Day | Touch | Role in the story |
|---|---|---|---|
| T1 | 0 | LinkedIn ad (paid social) | First discovered you — created awareness |
| T2 | 5 | Organic blog post (organic search) | Came back to learn — built interest |
| T3 | 12 | Retargeting ad (paid social) | Nudged back mid-consideration |
| T4 | 30 | Branded search (paid search, branded) | Ready to act — searched your name |
| T5 | 38 | Direct → demo request (direct) | Converted |

The whole point: **the touch that gets credit depends entirely on the model, and each model tells a different story about where your $12k came from.**

## The six models, applied

Credit for the $12,000 deal under each model:

| Touch | Channel | First-touch | Last-touch | Last non-direct | Linear | Time-decay | Position (U) |
|---|---|---|---|---|---|---|---|
| T1 | Paid social | **$12,000** | $0 | $0 | $2,400 | $175 | **$4,800** |
| T2 | Organic | $0 | $0 | $0 | $2,400 | $290 | $800 |
| T3 | Paid social | $0 | $0 | $0 | $2,400 | $575 | $800 |
| T4 | Paid search (branded) | $0 | $0 | **$12,000** | $2,400 | $3,415 | $800 |
| T5 | Direct | $0 | **$12,000** | $0 | $2,400 | **$7,545** | **$4,800** |

*(Time-decay uses a 7-day half-life — weight = 0.5^(days-before-conversion / 7), normalized: shares of ~1.5% / 2.4% / 4.8% / 28.5% / 62.9% (dollars rounded to sum to $12,000). With a 38-day journey the credit concentrates hard on the last two touches — which is exactly why time-decay behaves almost like last-touch on long cycles. Position-based is 40/40/20, the 20% split evenly across T2–T4.)*

**Read the disagreement:**
- **First-touch** hands everything to the **LinkedIn ad** — great for arguing paid social's demand-gen value, blind to what closed it.
- **Last-touch** hands everything to **Direct** — which is really "we don't know," the junk-drawer channel (see SKILL.md §6). This is how top-of-funnel gets defunded.
- **Last non-direct** hands it to **branded search** — but branded search only happened *because* the LinkedIn ad and blog created the demand. Crediting the closing branded click is crediting your own brand for demand someone else's channel created.
- **Linear** spreads it evenly — honest that all five mattered, useless for deciding what to cut (everything looks equally important).
- **Time-decay** favors the recent — reasonable for short cycles, but here it under-credits the LinkedIn ad that started everything.
- **Position-based** credits the **bookends** (discovered + closed) — usually the most defensible single model for B2B, because "what created this deal" and "what closed it" are the two decisions you actually make.

**The takeaway to give the user:** report **first-touch and last-touch side by side**. The LinkedIn-vs-Direct gap *is* the insight — it tells you paid social creates demand that later shows up as direct/branded. No single number captures that; the spread does.

## Data-driven / algorithmic attribution (Shapley), plainly

Data-driven attribution (Google's DDA, most MTA tools) doesn't use a fixed rule. It asks a counterfactual: **how much does each touch actually change the probability of conversion?** The formal engine is the **Shapley value** from cooperative game theory.

The plain-English version:

- Treat each touch as a "player" on a team that produced the conversion.
- Look across *all* your journeys — converting and non-converting.
- For a given touch, compare conversion rates of journeys that had it vs. otherwise-similar journeys that didn't, across every possible combination of the other touches.
- A touch's credit = its **average marginal lift** to conversion probability across all those combinations.

So if journeys with a retargeting touch convert meaningfully more often than identical journeys without it, retargeting earns real credit. If adding a channel changes nothing, it earns ~zero — even if it appears on every path.

**When it's worth it:**
- You have **volume** — the counterfactuals need enough conversions to be stable. (Google Ads historically gated data-driven attribution behind ~3,000 ad interactions and ~300 conversions in 30 days; it has since relaxed the hard minimums and made data-driven the default model, but the underlying reality is unchanged: below real volume, DDA is noise dressed as science.) Use position-based instead when you're thin.
- Your journeys are **mostly digital and tracked** — Shapley can only weigh touches it was fed. Offline events, dark social, and cookie-lost touches are invisible to it, so a high-word-of-mouth B2B motion will get a confidently-wrong DDA. Pair it with self-reported (SKILL.md §4).

**Its honest limitations:**
- **Black box** — you can't easily explain to a CFO why LinkedIn got 23%. "The model says so" is a weak budget argument on its own.
- **Correlation, not causation** — it models what *co-occurs* with conversion, not what *causes* it. That's why incrementality testing (see `measurement-paradigms.md`) exists: to validate what DDA claims.
- **Garbage in** — inherits every blind spot in your tracking. If half your journeys are "direct," DDA is confidently splitting credit on half-blind data.

## Choosing — a short decision guide

- **Short cycle, few touches, small volume** → last non-direct, plus a self-reported survey. Don't over-model.
- **Long B2B cycle, clear created/closed moments** → position-based as the primary, first-touch + last-touch shown alongside.
- **High volume, mostly-digital, need day-to-day allocation** → data-driven, validated periodically by incrementality.
- **Offline + brand-heavy, real budget** → don't rely on any user-level model; go MMM + incrementality (see `measurement-paradigms.md`).

In every case: **pick one model, stay consistent, and pair it with an out-of-model check.** Model-switching to make a channel look good is the fastest way to lose trust in the whole attribution program.
