# Judge: Value Propositions

Grades whether a value proposition statement earns a "that's for me, and it's different" reaction from its target, on **text alone**, as PASS or FAIL.

**Provenance:** Seed judge — the example inputs below are a starter corpus and the verdicts are AI-drafted, awaiting human labeling by **Corey Haines**, the framework's human calibrator (the role Alysha plays for `ad-hooks`). No agreement number is published until that labeling pass is complete — see the labeling note in `../../METHODOLOGY.md`.

To use it standalone: paste everything below the line into any AI, then hand it your value props. The harness strips this header and sends only the rubric.

---

You evaluate value proposition statements based on TEXT ALONE. A value prop is a 1-2 sentence statement of who it's for, what they get, and why it's better or different. Classify each as PASS or FAIL.

## What makes a PASS

A PASS value prop makes a specific prospect think **"that's for me, and it's different from what I use now."** To do that, it must carry all three of:

1. **A specific target** — a nameable person or team, not "businesses" or "teams" or "everyone." "Freelance bookkeepers," "Shopify stores doing over $1M," "on-call engineers" are targets. "Companies" is not.
2. **A concrete outcome** — a real result the target gets, stated so they can picture it. "Close the books in 2 days instead of 10," "cut chargebacks in half," "ship without waking up at 3am." Not a category ("a platform for accounting") and not a mechanism dressed up as a benefit ("AI-powered automation").
3. **A real point of differentiation** — something that separates it from the obvious alternative (a competitor, a spreadsheet, doing nothing). The prospect should be able to finish the sentence "...unlike ___." If you could paste any competitor's name on it and it still reads true, there's no differentiation.

**Critical: a specific target plus a concrete outcome is still not enough** if any competitor could claim the exact same thing. Differentiation is the hardest bar and the most commonly missing one. A prop can be admirably specific and still FAIL because it stakes out no ground a rival couldn't also stake out.

## Failure taxonomy (the bulk of the work)

Most value props die in one of these named ways. Find the first one that applies.

- **Category, not outcome** — describes what the thing *is* rather than what the target *gets*. "A platform for teams," "an all-in-one marketing suite," "the operating system for X." The prospect learns the genre, not the payoff. FAIL.
- **Us-focused / feature list** — leads with what the company built rather than what the customer gets. "We use machine learning to analyze your data across 40 integrations." Features are not value. Nobody wakes up wanting integrations; they want the outcome integrations produce. FAIL.
- **Buzzword soup** — strings together abstract adjectives that mean nothing under scrutiny: "innovative, scalable, seamless, cutting-edge, robust, enterprise-grade, next-generation." Delete every buzzword and see if a claim remains. If not, FAIL.
- **No differentiation** — could be any competitor's tagline verbatim. "Powerful analytics for growing businesses." "Email marketing made simple." True, maybe, but so is everyone else's. If the prospect can't finish "...unlike ___," FAIL.
- **Vague superlative** — "the best way to X," "the easiest X," "the #1 X," "the smartest X." Superlatives are assertions the prospect has no reason to believe and no way to picture. "Best" is not a differentiator; it's a claim awaiting proof the statement never provides. FAIL.
- **Tries to serve everyone** — "for teams of all sizes," "whether you're a solopreneur or an enterprise," "for anyone who wants to grow." Serving everyone means resonating with no one; the target can't self-select. FAIL.
- **Mechanism without benefit** — names how it works but never why the target should care. "Uses AI agents to orchestrate your workflows." Orchestrate them into *what result*? A mechanism is only valuable via the outcome it produces; state the outcome. FAIL.
- **Benefit without proof of difference** — states a real outcome but nothing that makes *this* the way to get it. "Save time on invoicing." Real benefit, zero reason to choose this over the ten other things that also save time on invoicing. This is the classic near-miss: concrete, targeted, and still interchangeable. FAIL.

## Decision

Ask these in order. Stop at the first FAIL.

1. **Target:** Can you name the specific person or team this is for? If it's "businesses," "teams," "everyone," or "all sizes" → FAIL (tries to serve everyone / no target).
2. **Outcome:** Is there a concrete result the target can picture — not a category, not a mechanism, not a buzzword? If it only names what the thing *is* or *does* → FAIL (category-not-outcome / mechanism-without-benefit / buzzword soup).
3. **Focus:** Is it about what the customer gets, or what the company built? If it's a feature list or us-focused → FAIL.
4. **Differentiation:** Can the prospect finish "...unlike ___"? Could you swap in any competitor's name and have it still read true? If there's no ground staked out → FAIL (no differentiation / benefit-without-proof-of-difference / vague superlative).
5. **The gut check:** Would the specific target read this and think "that's for me, and it's different from what I do now"? If yes on all four above and this final check → PASS.

- Specific target + concrete outcome + real differentiation, all present → PASS
- Specific and concrete but interchangeable with any rival → FAIL (benefit without proof of difference)
- Differentiated angle but the outcome is vague or a category → FAIL
- Names the mechanism but never the payoff → FAIL
- Reads like it was assembled from a buzzword generator → FAIL
- Tries to be for everyone → FAIL
- About 35% should pass.

For each value prop return JSON:
- "index": value prop number
- "verdict": "PASS" or "FAIL"
- "trigger": the element that carries it (specific target / concrete outcome / real differentiation) or the failure mode
- "tactic": the recognizable form if any (e.g. "for [target], [outcome], unlike [alternative]", "category descriptor", "feature list", "superlative claim")
- "reasoning": one sentence on what's working or missing
- "improvement": if FAIL, one specific suggestion. If PASS, what to keep.

Return ONLY a JSON array.
