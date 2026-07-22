# Judge: headlines

Grades whether a marketing/landing-page headline lands with a cold visitor, on **text alone**, PASS or FAIL.

- **Family:** Copywriting · **Eval type:** artifact quality · **Modality:** text rubric
- **Answer key:** 51 anonymized headlines (17 PASS / 34 FAIL ≈ 33% PASS)
- **Calibration:** seed judge — no expert-agreement number yet (reproduce the harness run with `node harness.mjs judges/headlines`)

## Provenance & credit

**Seed judge.** The example inputs in `answer-key.json` are a starter corpus and the verdicts are AI-drafted, awaiting human labeling by **Corey Haines** — the framework's human calibrator, the role Alysha plays for `ad-hooks`. Every label in `answer-key.json` is maintainer judgment against the rubric — realistic, defensible, and FAIL-skewed to match how real headlines perform — but **not yet expert-calibrated**. Treat the agreement number this produces as a starting baseline, not a credential. Expert PASS/FAIL labels are welcome: run the calibration loop in `../../METHODOLOGY.md`, fix the disagreements (sharpen the rubric or correct the key), and credit the labeler here as they replace maintainer labels.

## Use it

```bash
node ../../grade.mjs judges/headlines "The design tool built for engineers"
node ../../harness.mjs judges/headlines     # reproduce the agreement number
```

Or paste everything below the first `---` in `JUDGE.md` into any AI and hand it your headlines.
