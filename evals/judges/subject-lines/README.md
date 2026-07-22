# Judge: subject-lines

Grades whether an email subject line earns the open — without being clickbait or spam — on **text alone**, PASS or FAIL.

- **Family:** Copywriting / Email · **Eval type:** artifact quality · **Modality:** text rubric
- **Answer key:** 52 anonymized subject lines (18 PASS / 34 FAIL)
- **Calibration:** not yet expert-calibrated — labels are maintainer seed judgment. Reproduce the agreement number with `node harness.mjs judges/subject-lines`.

## Provenance & credit

**Seed judge.** The example inputs in `answer-key.json` are a starter corpus and the verdicts are AI-drafted, awaiting human labeling by **Corey Haines** — the framework's human calibrator, the role Alysha plays for `ad-hooks`. The `answer-key.json` labels are maintainer PASS/FAIL judgment across a diverse spread (B2B SaaS, DTC, newsletters, transactional-adjacent, and cold outreach), not yet calibrated against a named domain expert. The rubric in `JUDGE.md` encodes the maintainer's failure taxonomy for subject lines.

**Expert labels welcome.** If you grade email for a living, relabel the key (or add examples) and open a PR — that's how a seed judge becomes a calibrated one. See `../../METHODOLOGY.md` for the calibration loop.

## Use it

```bash
node ../../grade.mjs judges/subject-lines "the mistake that cost us 40% of signups"
node ../../harness.mjs judges/subject-lines     # reproduce the agreement number
```

Or paste everything below the first `---` in `JUDGE.md` into any AI and hand it your subject lines.
