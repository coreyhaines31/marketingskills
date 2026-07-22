# Judge: long-form

Grades whether the **opening lede of a long-form piece** — a blog post, article, or guide (roughly the first 120-180 words) — earns the read, on **text alone**, PASS or FAIL.

- **Family:** Long-form / Content · **Eval type:** artifact quality · **Modality:** text rubric
- **Answer key:** 34 anonymized ledes (12 PASS / 22 FAIL ≈ 35% PASS)
- **Calibration:** seed judge — no expert-agreement number yet (reproduce the harness run with `node harness.mjs judges/long-form`)

## Scope: opening lede, not the full body

v1 grades the **opening only** — the lede's hook, promise, and structure signals: *does it earn the read?* Grading the opening is the highest-signal, most-gradable unit of a long-form piece, the same way `ad-hooks` grades the hook of a video rather than the entire ad. A lede that earns the click is a necessary condition for a good article, and it's the part a cold reader actually decides on.

This judge does **not** grade the full body — depth, accuracy, argument quality, or whether the piece delivers on its promise end-to-end. A lede can PASS here and the article can still fail to deliver. **Full-body grading (depth and accuracy across the whole piece) is a planned future extension.**

## Provenance & credit

**Seed judge.** The example inputs in `answer-key.json` are a starter corpus and the verdicts are AI-drafted, awaiting human labeling by **Corey Haines** — the framework's human calibrator, the role Alysha plays for `ad-hooks`. Every label in `answer-key.json` is maintainer judgment against the rubric — realistic, defensible, and FAIL-skewed to match how real ledes perform — but **not yet expert-calibrated**. Treat the agreement number this produces as a starting baseline, not a credential. Expert PASS/FAIL labels are welcome: run the calibration loop in `../../METHODOLOGY.md`, fix the disagreements (sharpen the rubric or correct the key), and credit the labeler here as they replace maintainer labels.

## Use it

```bash
node ../../grade.mjs judges/long-form "Last quarter we lost our three biggest accounts in the same week..."
node ../../harness.mjs judges/long-form     # reproduce the agreement number
```

Or paste everything below the first `---` in `JUDGE.md` into any AI and hand it your ledes.
