# Judge: value-props

Grades whether a value proposition statement earns a "that's for me, and it's different" reaction from its target, on **text alone**, PASS or FAIL.

- **Family:** Copywriting / Positioning · **Eval type:** artifact quality · **Modality:** text rubric
- **Answer key:** 52 anonymized value props (18 PASS / 34 FAIL)

## Provenance & credit

**Seed judge.** The example inputs in `answer-key.json` are a starter corpus and the verdicts are AI-drafted, awaiting human labeling by **Corey Haines** — the framework's human calibrator, the role Alysha plays for `ad-hooks`. The examples are generic and anonymized (or clearly fictional) across B2B SaaS, DTC, services, dev tools, and marketplaces. The rubric in `JUDGE.md` is the seed rubric. Once Corey's labels land, run the calibration loop (see `../../METHODOLOGY.md`), fix the disagreements, and publish the agreement number.

## Use it

```bash
node ../../grade.mjs judges/value-props "For on-call engineers who get paged at 3am: we group duplicate alerts into one incident so you fix the root cause once instead of acking forty pings."
node ../../harness.mjs judges/value-props     # reproduce the agreement number
```

Or paste everything below the first `---` in `JUDGE.md` into any AI and hand it your value props.
