# Calibration Notes — for the human labeling pass

The seed judges' verdicts are AI-drafted. When **Corey** does the labeling pass (label *by exception* — skim, flip what you disagree with), start with the items below. They came out of an adversarial QC audit as the most-suspect labels — the fastest place to improve each judge before running the calibration loop (`METHODOLOGY.md`).

Rubrics themselves audited as strong across all judges — the work is in the keys, not the rubrics.

## Start here — the ~10 most-suspect labels

| # | Judge | Item | Current | Note |
|---|-------|------|---------|------|
| — | headlines | "Meetings that should've been emails, killed" | ~~FAIL~~ → **PASS** | **Already fixed** — it's the rubric's own PASS exemplar; was a literal self-contradiction. |
| 1 | ad-concepts | protein "blind mixability test" concept | FAIL | Names a specific insight + demonstrated differentiation (clumps vs dissolves) — reads as PASS. Top priority. |
| 2 | ad-concepts | water-bottle night-nurse testimonial | FAIL | Named audience + specific 3pm-crash moment — matches the PASS profile. |
| 3 | headlines | "Coffee roasted the day before it ships" | FAIL | Concrete freshness outcome/differentiator; parallel to the PASS "Fresh dog food, delivered…". |
| 4 | headlines | "Your rent, reported to the credit bureaus" | FAIL | Specific outcome for a nameable reader (renters building credit) + real differentiation. |
| 5 | ctas | "Add to cart" (PASS) vs "Complete order" (FAIL) | — | Inconsistent: a high-commitment action passes while a lower-ambiguity standard step fails. Reconcile. |
| 6 | ctas | "Get instant access" | FAIL | Vague-outcome call (access to *what*) — confirm against "Get the free checklist" (PASS). |
| 7 | long-form | "Last Tuesday I… read all 47 case studies" | FAIL | Specific scene, no payoff — hardest call; most likely to flip. |
| 8 | subject-lines | "Read this before your next standup" | FAIL | Has moment-specific relevance; borderline command-with-no-why. |

## Structural notes (not single labels)

- **value-props** and **long-form**: every PASS is structurally uniform (value-props all "For [X]…, unlike [Y]"; long-form all first-person war stories). Risk: the judge learns a *format proxy* instead of the real test. Add a few **short-but-differentiated** PASSes and **long-but-undifferentiated** FAILs to break the correlation.
- **Cross-judge consistency**: "You're using X wrong" is a FAIL pattern in `ad-hooks` but rescued to PASS in `subject-lines` when specificity is added. Reconcile the stance when these graduate from seed to calibrated.

## Then, per judge

Run the loop until agreement plateaus, publish the number, and move the judge's README from "seed" to "calibrated":

```bash
node harness.mjs judges/<name>      # prints agreement + every disagreement
```
