# Citations vs. Recommendations: The AI Visibility Ladder

Being cited by an AI engine and being recommended by it are **two different outcomes governed by two different systems**. A citation means your page was useful enough to pull information from. A recommendation means the model put your brand on the buyer's shortlist. Optimizing for the first does not automatically earn the second — and for smaller brands, conflating them leads to content strategies that can actively help competitors.

Source note: the analysis and data in this reference draw on Lily Ray's (Amsive) 2026 study of B2B "best [category] software" queries, behavioral studies by Scrunch and SimilarWeb, and commentary by John-Henry Scherck (Growth Plays).

---

## The Visibility Ladder

AI visibility is a ladder, not a binary. Each rung has different selection criteria and different measurement:

| Rung | What it means | What governs it | How to see it |
|---|---|---|---|
| **1. Retrieved** | The model read your content while building its answer, without citing it | Crawlability, parseable structure, query relevance | Mostly invisible; bot logs hint at it |
| **2. Cited** | Your page appears as a source in the answer | Content usefulness: structure, statistics, clarity, freshness | Prompt-tracking tools, AI Overview source lists |
| **3. Mentioned** | Your brand is named in the answer text | Entity recognition + how the web talks about you | Prompt-tracking tools |
| **4. Recommended** | Your product is on the shortlist the buyer actually considers | **Aggregate web consensus** — reviews, forums, analysts, press, video — largely independent of your own content | Prompt tracking + the framing around the mention |

Rungs 1–3 are legitimate signals your content is working, and most prompt-tracking tools report them. But rung 4 is where buying behavior changes, and it's earned differently: **citation is about whether your content is useful to consult; recommendation is mostly a reflection of what the broader web says about you** — whether you published a guide on the topic or not.

There is also a shadow rung: **recommended against**. On detailed, requirements-heavy prompts, models increasingly name products a buyer should *avoid* for their use case, with sources. The downside of weak third-party consensus is no longer just absence from the shortlist — it can be an explicit rule-out. This makes monitoring the *framing* around your mentions (favorable / neutral / hedged / negative), not just counting them, part of the job.

---

## The Self-Promotional Listicle Risk

The common tactic — publish a "best [category] software" guide, rank yourself #1, and let it shape both organic search and AI answers — now has a stage-dependent payoff.

**The data:** Lily Ray (Amsive) analyzed 100 B2B "best [category] software" queries across three dates in spring 2026. Across the dataset, self-promotional listicles earned 323 citations in AI Overviews — and in 224 of them (**69% of the citations**), the answer left the publishing brand out of the recommendations, pointing buyers to competitors instead.

**The mechanism:** the model treats your guide as a source about the *category*. It happily extracts the competitor names, comparisons, and evaluation criteria you compiled — then makes its recommendation from web-wide consensus, where the established players dominate. For an emerging brand, a self-promotional buyer's guide can function as **a vote for your competitors**: you did the research that helps the model describe them.

**The split by stage:**

- **Established category leaders** get both outcomes. Their guides earn citations *and* their brands get recommended — because analysts, review sites, and forum discussions already validate them. For leaders, a definitive buyer's guide is highly advantageous: it shapes how the whole category (competitors included) gets described.
- **Emerging brands** may win the citation and even shape the category's framing, but miss the recommendation. That's not a wasted outcome — influencing how an LLM defines the category and its evaluation criteria is real positioning work — but it is not the shortlist placement the tactic promises.

**What this changes (and doesn't):** genuinely useful buyer's guides still belong in a B2B content strategy at any stage. What changes is the expectation and the investment split. If you're not yet the consensus pick, weight effort toward the offsite signals that actually govern recommendations (below) rather than publishing a plethora of self-ranked listicles.

---

## What Earns Recommendations

Recommendation is a consensus signal. The inputs the models weigh live mostly off your site:

| Channel | Why it moves recommendations | Related skill |
|---|---|---|
| **Review platforms** (G2, Capterra, TrustRadius, app stores) | Third-party validation models treat as evidence of legitimacy | customer-research (review generation loops) |
| **Analyst coverage** (Gartner, Forrester, industry reports) | High-authority category framing; models echo analyst shortlists | public-relations |
| **Communities and forums** (Reddit, HN, Slack/Discord, niche forums) | Unprompted practitioner discussion is heavily retrieved and hard to fake | community-marketing |
| **Earned media and PR** | Independent sources repeating your positioning beyond your own site | public-relations |
| **Video and podcasts** | Increasingly retrieved; transcripts carry brand + category associations | video, social |

The test to apply before investing in another self-ranked guide: *if a model ignored everything on our domain, would the rest of the web still put us on the shortlist?* If not, that gap is the priority. AEO discourse often stops at "are we in the answer?" — the better question is "are we credible enough to be recommended?"

The encouraging flip side: earning an AI recommendation is harder to game than a top search ranking ever was. The durable strategy is the same at every stage — be the best fit for a clear set of buyers, and give those buyers reasons to talk about you in public, where the models can retrieve it.

---

## What a Recommendation Is Worth

Two behavioral studies quantified the gap between rungs:

- **Scrunch** (opt-in panel linking AI conversations to subsequent web behavior, compared against each user's own baseline — observational, not a controlled experiment): a genuine recommendation ("a great option is X") was associated with people searching for, visiting, and evaluating a brand **about twice as often** as a passing mention. For users with no recent observed engagement with the brand, a recommendation was followed within a week by **+182% branded searches, +117% site visits, and +185% product views**.
- **SimilarWeb** (thousands of real user journeys, seven days post-answer): when ChatGPT recommended a brand, it received **roughly 2.5× more new visitors** the following week than the competitors left off the list.

**The attribution blind spot:** in the SimilarWeb data, only about **9%** of those post-recommendation visits arrived as visible AI referral traffic; the largest share arrived via branded search, with direct and other channels making up the rest — indistinguishable from ordinary organic visitors. AI recommendations are already sending real, engaged buyers, but standard attribution underreports the AI touch.

**Measurement triad** (no single signal is complete; together they give a reliable read):

1. **AI prompt tracking** — whether and how you're mentioned/recommended in LLM answers, even when no click ever lands (tools in SKILL.md's Monitoring section). Track the framing around mentions — recommended, neutral, hedged, or recommended-against — not just the count.
2. **Self-reported attribution** — a "how did you hear about us?" field catches buyers whose journey started in an AI chat but arrived via branded search or direct.
3. **Sales call recordings** — buyers' own language often reveals an AI conversation shaped the shortlist long before any form fill.

Also watch **branded search volume** as a proxy: sustained lifts without a matching campaign are increasingly AI-influence showing up under another name.

---

## Applying This

- **Auditing an established brand:** buyer's guides and comparison content are high-leverage — publish the definitive version and shape the category's evaluation criteria.
- **Auditing an emerging brand:** publish the genuinely useful guides your ICP needs, but set expectations (citation and framing, not near-term recommendation) and rebalance investment toward reviews, communities, analysts, and earned media.
- **Reporting:** report the ladder, not a single "AI visibility" number — retrieved/cited/mentioned/recommended plus mention framing. A rising citation count with a flat recommendation rate is a specific, diagnosable gap: the web doesn't yet corroborate your content.
- **Risk check:** for requirements-heavy queries in your category, check whether models recommend *against* you, and trace the sources they cite when they do.
