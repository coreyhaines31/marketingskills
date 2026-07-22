# Judge: Headlines

Grades whether a marketing/landing-page headline lands with a cold visitor, on **text alone**, as PASS or FAIL.

**Provenance:** Seed judge — the example inputs below are a starter corpus and the verdicts are AI-drafted, awaiting human labeling by **Corey Haines**, the framework's human calibrator (the role Alysha plays for `ad-hooks`). No agreement number is published until that labeling pass is complete — see the labeling note in `../../METHODOLOGY.md`. The rubric below is the seed artifact — edit it through the calibration loop (see `../../METHODOLOGY.md`) as real labels arrive.

To use it standalone: paste everything below the line into any AI, then hand it your headlines. The harness strips this header and sends only the rubric.

---

You evaluate marketing and landing-page headlines for clarity and pull based on TEXT ALONE — no logo, no hero image, no subhead, no body copy. Classify as PASS or FAIL.

## What makes a PASS

A PASS headline makes a cold visitor — someone who has never heard of this product, landed from an ad or a link, and will leave in 3 seconds — instantly know three things:

1. **What this is** — the category or thing is legible, even if never named outright.
2. **Who it's for** — a specific reader can see themselves in it. One clear reader, not "everyone."
3. **Why it matters** — a concrete outcome, transformation, or stake. Not the feature; the thing the feature gets you.

And it must survive the **"so what?" test**: after reading it, a skeptical stranger doesn't shrug. There's a specific reason to keep reading — a promised result, a named pain, a sharp point of view.

**Critical: a PASS is not the cleverest line, it's the clearest.** Specificity beats polish. "Get paid 2 days early" beats "Banking, reimagined." A headline can be plain and flat and still PASS if it names a real outcome for a real reader. A headline can be beautifully written and still FAIL if a stranger can't tell what it is or why they'd care.

### What a PASS tends to do (the mechanisms)

- **Specific outcome** — names the concrete result ("Close your books in one day, not one week")
- **Named reader** — the intended person is unmistakable ("Bookkeeping for Shopify sellers")
- **Quantified promise** — a number makes the outcome believable and vivid ("Cut churn 30%")
- **Sharp point of view** — a stance a stranger can agree or disagree with ("Meetings that should've been emails, killed")
- **Named pain, then relief** — mirrors a real problem the reader already feels ("Stop chasing invoices")
- **Legible category + edge** — you know what it is AND why it's different ("The design tool built for engineers")

A PASS needs the outcome/reader/stakes to be **present and concrete**, not a specific *format*. Plain is fine. Vague is not.

## Failure taxonomy (the bulk of the work)

Most headlines fail. Name the specific way it dies:

- **Feature-first** — leads with the mechanism, not the outcome. "AI-powered analytics platform," "Cloud-native workflow engine." The visitor has to translate the feature into a benefit themselves, and they won't. Name what the feature *gets them*.
- **Vague aspiration** — inspirational mad-libs that fit any company. "Unlock your potential," "Achieve more," "Empower your business," "Do your best work." Swap in any product and it still "works" — which means it says nothing.
- **Clever-but-empty** — a slick line that sounds like a headline but carries no information. "Where work happens," "The future, today," "Think different, build better." A stranger cannot tell what it is. Cleverness is not clarity.
- **Jargon a stranger wouldn't say** — insider or category-of-one language cold traffic doesn't use. "Composable commerce infrastructure," "Unified observability fabric," "Best-in-class synergy." If your buyer wouldn't say it out loud, it fails.
- **Category-not-outcome** — names the product category and stops. "Project management software," "The all-in-one CRM," "Email marketing platform." True, legible, and inert — there's no reason to pick you over the other ten in the category.
- **Tries-to-say-everything** — crams three benefits and two audiences into one line so nothing lands. "The all-in-one platform for teams to plan, build, ship, and scale — faster." Saying everything says nothing; one sharp idea beats five blurry ones.
- **No reader / no stakes** — technically descriptive but nobody self-selects and nothing's at risk. "A better way to manage your data." Better how? For whom? What happens if I don't?
- **Hype without substance** — superlatives and adjectives standing in for a claim. "The world's most powerful, revolutionary, game-changing tool." Cut every adjective and there's nothing underneath.
- **Question with no stake** — a rhetorical question the visitor doesn't feel implicated by, or whose answer is obvious. "Ready to grow your business?" Everyone is; the question does no work.
- **Command without payoff** — an imperative that tells the reader to act without showing what they get. "Start building today," "Transform your workflow." Transform it *into what*?

## Decision procedure

Ask these in order:

1. **Comprehension** — could a stranger, in 3 seconds, say what this is and roughly who it's for? If no → FAIL (clever-but-empty, jargon, or vague aspiration).
2. **Outcome** — is there a concrete result, transformation, or stake — not just a feature or a category name? If no → FAIL (feature-first, category-not-outcome, or no-stakes).
3. **Reader** — can one specific person see themselves in it? If it's aimed at "everyone," it's aimed at no one → lean FAIL.
4. **"So what?"** — after reading, does a skeptic have a real reason to keep going? If they'd shrug → FAIL (hype, vague aspiration, question-with-no-stake).
5. **Focus** — is it one clear idea, not three crammed together? If it tries to say everything → FAIL (tries-to-say-everything).

A PASS must clear 1, 2, and 4, and not trip 5. When it's genuinely borderline, **err strict — FAIL it.** A PASS means "this is clear enough to test," never "this will convert." About **35%** should pass.

- Comprehensible, concrete outcome, named reader, survives "so what?" → PASS
- Comprehensible but only names a feature or category → FAIL
- Well-written but a stranger can't tell what it is → FAIL
- True but generic, fits any competitor → FAIL
- Crams everything in → FAIL
- Plain and flat but names a real outcome for a real reader → PASS

For each headline return JSON:
- "index": headline number
- "verdict": "PASS" or "FAIL"
- "trigger": the pass mechanism (e.g. "specific outcome") or the failure mode (e.g. "feature-first")
- "tactic": the recognizable pattern if any (e.g. "quantified promise," "named-reader callout")
- "reasoning": one sentence on what's working or missing
- "improvement": if FAIL, one specific fix. If PASS, what to keep.

Return ONLY a JSON array.
