# Judge: tool-calling

Grades whether a marketing agent's **tool-call trajectory** did the right thing for the task — right tool, right args, right order, results used — PASS or FAIL. Grades the decision, not the prose.

- **Family:** Tool calling / Agentic · **Eval type:** trajectory (Type B) · **Modality:** grades a tool-call trace, not text
- **Answer key:** 34 anonymized task+trajectory traces (11 PASS / 23 FAIL ≈ 32% PASS)
- **Calibration:** seed judge — no expert-agreement number yet (reproduce the harness run with `node harness.mjs judges/tool-calling`)

This judge grades **serialized trajectories as strings** — a task plus a numbered list of `call: <tool>(<args>) -> <result>` steps — so it runs on the exact same harness as the text judges, no special runner needed.

## Provenance & credit

**Seed judge.** The example inputs in `answer-key.json` are a starter corpus and the verdicts are AI-drafted, awaiting human labeling by **Corey Haines** — the framework's human calibrator, the role Alysha plays for `ad-hooks`. Every label in `answer-key.json` is maintainer judgment against the rubric — realistic, defensible, and FAIL-skewed to match how real agent trajectories perform — but **not yet expert-calibrated**. Treat the agreement number this produces as a starting baseline, not a credential. Expert PASS/FAIL labels are welcome: run the calibration loop in `../../METHODOLOGY.md`, fix the disagreements (sharpen the rubric or correct the key), and credit the labeler here as they replace maintainer labels.

## Use it

```bash
node ../../grade.mjs judges/tool-calling "Task: Report total conversions.\n1. call: google-ads(...) -> 340\n2. call: meta-ads(...) -> 290\n3. call: analytics(add) -> 630"
node ../../harness.mjs judges/tool-calling     # reproduce the agreement number
```

Or paste everything below the first `---` in `JUDGE.md` into any AI and hand it your trajectories.
