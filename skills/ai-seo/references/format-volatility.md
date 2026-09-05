# Format Volatility — Which Content Formats AI Cites (and How Fast That Changes)

Citation-*source* volatility (Reddit wiped overnight, Gemini favoring owned sites) is covered in [agent-readiness.md](agent-readiness.md). This reference covers the second volatility axis: citation-*format* — which page types AI engines retrieve and cite, and the August 2026 evidence that heavily-exploited formats get demoted.

Read this before recommending comparison pages, listicles, or "best X" content for AI visibility. The advice changed materially with ChatGPT 5.6.

## The ChatGPT 5.6 format shift (August 2026)

Data from Peec AI (shared by Tomek Rudzki via Lily Ray, Aug 2026), comparing ChatGPT retrieval behavior before and after the 5.6 launch:

**Fan-out queries** — the modifiers that declined most as a share of ChatGPT's background searches:

- "vs"
- "comparison"
- "top"
- "best"
- "reviews"

At the same time: a surge in `site:` searches and modifiers like **"official"**.

**Citations by page type** — share of total ChatGPT citations:

| Page type | Pre-5.6 | Post-5.6 | Change |
|---|---:|---:|---:|
| Listicles ("Top 10 X," "8 best Y") | 15.77% | 7.80% | **−50.5%** |
| Comparison pages ("X vs Y," alternatives) | 9.08% | 6.17% | **−32.1%** |

The interpretation (Lily Ray's, and it fits the fan-out data): these are exactly the two formats companies scaled for GEO over the prior 18 months, and ChatGPT adjusted retrieval to mitigate the spam. The `site:`/"official" surge points the same direction — **toward primary sources and owned domains, away from aggregator formats**.

## What this changes (and what it doesn't)

**It does NOT mean "stop making comparison pages."** Comparison and best-of content still:

- Converts human buyers (its original job)
- Gets cited by Google AI Overviews (which follow core rankings, not ChatGPT's retrieval)
- Feeds Gemini and Perplexity, which haven't shown the same demotion
- Answers real mid-funnel queries on your own site

**It DOES mean:**

1. **Stop justifying scaled listicle/comparison production with "it wins AI citations."** On ChatGPT — the largest AI answer surface — that rationale lost half its force in one release.
2. **The "official"/primary-source shift favors your owned pages.** Product pages, docs, pricing pages, original research — the pages only you can publish — are rising as the citable class. This compounds the Gemini finding (business-owned sites ≈ 60% of citations).
3. **Format strategy is now per-platform.** Check which engines matter for your category before choosing formats:

| Format | ChatGPT (post-5.6) | Google AIO | Gemini | Perplexity |
|---|---|---|---|---|
| Listicles / best-of | Demoted | Rankings-dependent | OK | OK |
| Comparison / vs pages | Demoted | Rankings-dependent | OK | OK |
| Original research + data | Strong | Strong | Strong | Strong |
| Product/docs/pricing (owned, "official") | **Rising** | Strong | **Dominant** | Strong |
| How-to / guides | Steady | Strong | OK | Strong |

*(Table caveat: the demotion was measured on ChatGPT only. "OK" for Gemini/Perplexity means no demotion has been reported there — not that stability was measured. Any engine can ship its own 5.6-style shift.)*

4. **Treat every number above as a dated snapshot.** Same doctrine as source volatility: these are Aug 2026 measurements of a moving system. Verify against your own citation monitoring before betting budget.

## LinkedIn as a citation surface (from LinkedIn's own AEO guide)

LinkedIn quietly published its own AEO/AI-search guidance (surfaced by Chris Long, Sep 2026). The platform-reported numbers:

- LinkedIn is the **most-cited outlet for professional-topic searches**
- **~60% of LinkedIn citations come from Articles**, ~40% from Posts
- Post URLs use the **first words of the post as the slug**

**Tactics:**

- For professional/B2B topics, LinkedIn Articles are a first-class Presence-pillar surface — treat long-form Articles (not just feed posts) as citable assets with the same extractable structure as blog content.
- **Front-load the target phrase in a post's opening words** — they become the URL slug, which is retrieval surface.
- This is platform-reported data (LinkedIn grading its own homework); weight accordingly, but the Articles > Posts split matches the general pattern that long-form structured content out-cites feed content.

## DIY diagnostic: extract ChatGPT's real fan-out queries

You don't need a tool to see what ChatGPT actually searches for in your niche (method circulating publicly, Aug 2026):

1. Run an important query for your category in ChatGPT (with search).
2. Open DevTools → Network tab, refresh the conversation (URL id after `/c/`).
3. Find the conversation response payload and search it for `queries`.
4. You'll see the literal background searches ChatGPT fanned out to.

**Use it for:** building your query-test list from *real* fan-out behavior instead of guesses; checking whether your category's fan-outs still use "best/vs" modifiers or have shifted to `site:`/"official" patterns; finding sub-topics your content doesn't cover.

**Do not use it for:** auto-generating and mass-publishing an article per fan-out query. That's the exact scaled-content pattern 5.6 demoted (and Google's scaled content abuse policy names). The diagnostic is for coverage planning, not content spam.

## Measurement rigor: AI answers are non-deterministic

A single ChatGPT answer is an anecdote, not a measurement — the same prompt returns different sources run-to-run. (The statistical-rigor framing here is popularized by Initial Commit's AEO audit skill, Josh Pigford, Aug 2026; the practice stands on its own.)

When auditing or monitoring:

- **Run each query 3–5 times per platform**, fresh session each time.
- **Track mention/citation *rate*** ("cited in 3 of 5 runs"), never a yes/no from one run.
- **Report the sample size** with every number ("40% mention rate, n=5") so future-you knows how much to trust it.
- **Compare rates over time, not runs.** A drop from 4/5 to 3/5 is noise; a drop from 4/5 to 0/5 sustained across a month is signal.
- Before diagnosing *why* you're not cited, split causes the way an audit should: **technical** (can't be crawled/parsed — see agent-readiness.md), **comprehension** (AI describes you inaccurately or vaguely), or **trust** (understood but not selected — see citations-vs-recommendations.md).

---

*Sources, all labeled and dated: Peec AI pre/post-5.6 citation data via Tomek Rudzki and Lily Ray (Aug 2026); LinkedIn's AEO guide numbers via Chris Long (Sep 2026, platform-reported); fan-out extraction method as publicly circulated (Aug 2026); measurement-rigor framing credited to Initial Commit's AEO audit skill (Josh Pigford, Aug 2026). All snapshots of a volatile system — verify against your own monitoring.*
