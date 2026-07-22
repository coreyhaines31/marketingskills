# Judge: ad-concepts

Grades whether a paid-social ad **concept** — the written idea/angle behind the creative, not the finished ad — is strong enough to be worth producing, PASS or FAIL.

- **Family:** Ad creative · **Eval type:** artifact quality · **Modality:** text rubric + concept
- **Answer key:** 41 anonymized ad concepts (15 PASS / 26 FAIL ≈ 37% PASS)
- **Calibration:** seed judge — no expert-agreement number yet (reproduce the harness run with `node harness.mjs judges/ad-concepts`)

Distinct from `ad-hooks`, which grades the literal opening line of a video ad. This judge grades the underlying CONCEPT/ANGLE — the idea on paper, before a single frame is shot.

## Provenance & credit

**Seed judge.** The example inputs in `answer-key.json` are a starter corpus and the verdicts are AI-drafted, awaiting human labeling by **Corey Haines** — the framework's human calibrator, the role Alysha plays for `ad-hooks`. Every label in `answer-key.json` is maintainer judgment against the rubric — realistic, defensible, and FAIL-skewed to match how real ad concepts perform — but **not yet expert-calibrated**. Treat the agreement number this produces as a starting baseline, not a credential. Expert PASS/FAIL labels are welcome: run the calibration loop in `../../METHODOLOGY.md`, fix the disagreements (sharpen the rubric or correct the key), and credit the labeler here as they replace maintainer labels.

## Use it

```bash
node ../../grade.mjs judges/ad-concepts "Founder-to-camera: she admits she nearly shut the company down because she couldn't read her own P&L, then shows the tool flagging a subscription bleeding $4k/month."
node ../../harness.mjs judges/ad-concepts     # reproduce the agreement number
```

Or paste everything below the first `---` in `JUDGE.md` into any AI and hand it your concepts.
