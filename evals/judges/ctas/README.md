# Judge: ctas

Grades whether a call-to-action — a button label or a CTA line — makes the next step clear, valuable, and low-friction, on **text alone**, PASS or FAIL.

- **Family:** Copywriting / CRO · **Eval type:** artifact quality · **Modality:** text rubric
- **Answer key:** 50 anonymized CTAs (18 PASS / 32 FAIL)
- **Calibration:** seed labels, not yet expert-calibrated (reproduce with `node harness.mjs judges/ctas`)

## Provenance & credit

**Seed judge.** The example inputs in `answer-key.json` are a starter corpus and the verdicts are AI-drafted, awaiting human labeling by **Corey Haines** — the framework's human calibrator, the role Alysha plays for `ad-hooks`. Every label in `answer-key.json` is the maintainer's PASS/FAIL judgment, not yet validated against an outside expert. Expert calibration is welcome — run the calibration loop in `../../METHODOLOGY.md`, read every disagreement, and decide per case whether the judge or the label should change.

## Use it

```bash
node ../../grade.mjs judges/ctas "Get my free SEO audit"
node ../../harness.mjs judges/ctas     # reproduce the agreement number
```

Or paste everything below the first `---` in `JUDGE.md` into any AI and hand it your CTAs.
