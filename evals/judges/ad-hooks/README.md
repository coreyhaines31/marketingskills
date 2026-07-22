# Judge: ad-hooks

Grades whether a paid-social video ad hook stops the scroll, on **text alone**, PASS or FAIL.

- **Family:** Copywriting / Ad creative · **Eval type:** artifact quality · **Modality:** text rubric
- **Answer key:** 116 real ad hooks (43 PASS / 73 FAIL)
- **Calibration:** ~74% agreement with the human labeler using a Sonnet-class judge (reproduce with `node harness.mjs judges/ad-hooks`)

## Provenance & credit

Seeded from the open-source [**hook-grader**](https://github.com/runneth-tools/hook-grader) (MIT), built by the team behind [Runneth](https://runneth.com). Every label in `answer-key.json` is a real PASS/FAIL call by **Alysha** ([@alyshaboehmm](https://x.com/alyshaboehmm) · [github](https://github.com/alyshafrommotion)), a world-class creative strategist. The rubric in `JUDGE.md` is hook-grader's calibrated rubric. Reused with credit under MIT.

## Use it

```bash
node ../../grade.mjs judges/ad-hooks "Your dad's wallet is the reason your back hurts."
node ../../harness.mjs judges/ad-hooks     # reproduce the agreement number
```

Or paste everything below the first `---` in `JUDGE.md` into any AI and hand it your hooks.
