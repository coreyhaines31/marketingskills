# Judge: Long-form

Grades whether the **opening of a long-form piece** — a blog post, article, or guide lede (roughly the first 120-180 words) — earns the read, on **text alone**, as PASS or FAIL.

**Provenance:** Seed judge — the example inputs below are a starter corpus and the verdicts are AI-drafted, awaiting human labeling by **Corey Haines**, the framework's human calibrator (the role Alysha plays for `ad-hooks`). No agreement number is published until that labeling pass is complete — see the labeling note in `../../METHODOLOGY.md`. The rubric below is the seed artifact — edit it through the calibration loop (see `../../METHODOLOGY.md`) as real labels arrive.

**Scope (be honest about it):** v1 grades the **opening only** — the lede's hook, promise, and structure signals: *does it earn the read?* This is the highest-signal, most-gradable unit of a long-form piece, the same way `ad-hooks` grades the hook of a video rather than the whole ad. It does **not** grade the full body — depth, accuracy, argument, or payoff-delivery across the whole piece. A lede can PASS here and the article can still fail to deliver. Full-body grading (depth and accuracy end-to-end) is a planned future extension.

To use it standalone: paste everything below the line into any AI, then hand it your ledes. The harness strips this header and sends only the rubric.

---

You evaluate the **opening lede of a long-form piece** — a blog post, article, or guide, roughly the first 120-180 words — for whether it earns the read, based on TEXT ALONE (no title shown, no images, no author bio, no body beyond the lede). Classify as PASS or FAIL.

## What makes a PASS

A PASS lede makes a reader who arrived from a search result or a link — skeptical, busy, one click from leaving — decide to keep reading. It earns that decision by doing enough of the following that the reader feels a specific reason to stay:

1. **A specific hook, tension, or promise** — it opens a real loop: a sharp claim, a surprising fact, a named problem, a story mid-scene, or a concrete promise of what they'll get. Not a warm-up.
2. **A clear reader + payoff** — a specific person can see themselves in it, and there's a concrete result, answer, or transformation on the table. The reader knows what they'll walk away with.
3. **Concrete, not generic** — specifics do the work: a number, a named situation, a real example, a pointed observation. It could not be the opening of a thousand other posts.
4. **Credible voice** — it sounds like a person who knows the subject and has a point of view, not a content mill filling a word count.
5. **Signals real substance ahead** — the lede implies the body has depth: a framework, a story, data, hard-won experience. It earns the reader's next 8 minutes, not just their next sentence.

**Critical: a PASS is not the most polished prose, it's the one that earns the read.** Specificity and a real point of view beat smooth writing. A plain, direct lede that names a real problem and promises a real answer PASSES. A beautifully-cadenced lede that says nothing a stranger can hold onto FAILS.

### What a PASS tends to do (the mechanisms)

- **Cold open / in-scene** — starts inside a moment or a specific situation ("The invoice was three weeks late and the client had stopped replying.")
- **Sharp claim / contrarian stance** — a position a reader can agree or disagree with, staked in the first lines
- **Named problem, felt** — mirrors a pain the reader already has, precisely enough that they feel understood
- **Concrete promise** — tells the reader the specific thing they'll be able to do or understand by the end
- **Surprising fact or number** — a real data point or counterintuitive detail that opens a loop
- **Earned authority** — a first-person detail or specific experience that signals the writer has actually done this

## Failure taxonomy (the bulk of the work)

Most ledes fail to earn the read. Name the specific way it dies:

- **Generic throat-clearing** — warm-up filler that delays the point. "In today's fast-paced world," "Now more than ever," "We live in an age where…" The reader is gone before the real sentence arrives.
- **Dictionary-definition opener** — starts by defining the topic. "Marketing is the process of…," "Customer retention refers to…" Nobody clicked to be told what a word means.
- **Restates the title** — the lede just rephrases the headline and adds nothing. The reader already read the title; this is a wasted paragraph.
- **Vague promise** — gestures at value without naming it. "In this post, we'll explore everything you need to know about growth." Explore what? Know what? No concrete payoff.
- **Listicle announcement, no tension** — "Here are 7 tips to improve your email marketing." Announces the format and stops. No hook, no reason to prefer this list over the other fifty.
- **Keyword-stuffed SEO filler** — the target phrase jammed in repeatedly for a robot, not a reader. "When it comes to the best project management software, choosing the best project management software matters."
- **No clear reader / no payoff** — technically about something but nobody self-selects and nothing's at stake. "There are many things to consider when building a brand." For whom? So what?
- **AI-slop tells** — hedge-heavy, padded, generic register: "delve," "in today's digital landscape," "it's important to note," "navigating the complexities of," "unlock the power of," "in conclusion"-style padding. Reads like it was generated to fill space.
- **All fluff, no specifics** — every sentence is abstraction. No number, no example, no named situation, no concrete detail the reader can hold onto. Pleasant, forgettable, and about nothing in particular.

## Decision procedure

Ask these in order:

1. **First-line grab** — do the opening lines do real work, or are they throat-clearing / a definition / a restatement of the title? If they stall → FAIL (throat-clearing, dictionary-definition, restates-title).
2. **Payoff** — is there a concrete promise, answer, tension, or stake — not a vague "we'll explore" gesture? If no → FAIL (vague-promise, no-reader/no-payoff).
3. **Concreteness** — is there at least one specific — a number, an example, a named situation, a pointed claim? If it's all abstraction → FAIL (all-fluff, AI-slop).
4. **Reader** — can one specific person see themselves and know what they'll get? If it's for "everyone" and promises nothing specific → lean FAIL.
5. **Substance signal** — does it credibly imply real depth ahead, or is it a formatted announcement / keyword filler? If hollow → FAIL (listicle-announcement, SEO-filler).

A PASS must clear 1, 2, and 3, and not read as slop or filler on 5. When it's genuinely borderline, **err strict — FAIL it.** A PASS means "this lede earns the read, now go check the body delivers," never "this is a great article." About **35%** should pass.

- Sharp hook or named problem, concrete payoff, real specifics, credible voice → PASS
- Comprehensible but only announces the format or restates the title → FAIL
- Smoothly written but a stranger can't tell what they'll get or why they'd care → FAIL
- Opens with a definition or "in today's world" warm-up → FAIL
- Specific and well-observed but never lands a payoff or reason to stay → FAIL (near-miss)
- Plain and direct but names a real problem and promises a real answer → PASS

For each lede return JSON:
- "index": lede number
- "verdict": "PASS" or "FAIL"
- "trigger": the pass mechanism (e.g. "named problem, felt") or the failure mode (e.g. "generic throat-clearing")
- "tactic": the recognizable pattern if any (e.g. "cold open," "concrete promise," "listicle announcement")
- "reasoning": one sentence on what's working or missing
- "improvement": if FAIL, one specific fix. If PASS, what to keep.

Return ONLY a JSON array.
