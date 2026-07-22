# Methodology

How to build a judge you can trust — and reproduce the number that proves it.

## The shape of an eval

Every judge has two parts:

- **A judge** — a rubric (`JUDGE.md`) that takes an input and returns a grade + reason.
- **An answer key** — inputs a human already graded (`answer-key.json`), so you can measure the judge against reality.

The judge is only as good as its agreement with the answer key. Everything below is about making that agreement honest.

## The answer key

- **40–150 real, anonymized examples**, each labeled by a credible human — and name them (the `ad-hooks` key is Alysha's, credited).
- **Match the real distribution.** Most marketing artifacts fail the bar; if your key is 50/50 when reality is 30/70, the judge learns the wrong prior. (`ad-hooks` is 43 PASS / 73 FAIL on purpose.)
- Store as `[{ "input": "...", "verdict": "PASS" | "FAIL" }, ...]`.

## The judge

Most of a good rubric is a **failure taxonomy** — the specific, nameable ways the artifact dies. That's on purpose: the reliable signal in quality is *negative*. It's far easier to say why something won't work than to promise one will. Grade on the hardest honest signal (e.g. ad hooks on text alone, no visuals).

## The calibration loop

The rubric is not written from a chair — it's tuned:

1. Run the judge over the answer key: `node harness.mjs judges/<name>`
2. Read every disagreement it prints.
3. For each: is the *judge* wrong (sharpen the rubric) or is your *label* wrong (fix the key)?
4. Edit, re-run, repeat until agreement plateaus.

Publish the agreement number. The `ad-hooks` judge agrees with its human ~74% with a Sonnet-class model — that number is its credibility badge.

## Read the confusion, not just the percentage

The harness reports **false PASS** (too lenient) and **false FAIL** (too harsh) separately. For a bad-X detector, you *want* the errors skewed toward too-harsh — it means a PASS is trustworthy. Decide your intended error bias and calibrate toward it. A PASS means "cleared the bar, now go test it," never "guaranteed winner."

## Blind, two-judge consensus (high stakes / model benchmarks)

Run **two different models** as judges (e.g. one per lab), hide the source of every input, and only count a verdict when both agree. Essential when judging *models* (see #480): a contestant model must never grade its own category — self-preference bias. Two independent judges reaching the same call rule out "you picked a model that likes its own outputs."

## Cost and time

The harness captures tokens + latency per run. Track them: the metric that decides routing is quality **per accepted output** — a cheap model that fails half the time isn't cheap, you regenerate. Standardize measurement conditions (prompt, max tokens, sampling, region, caching) or cost/latency aren't comparable.

## Build your own

The pattern transfers to anything you can grade: write a rubric, hand-label a few dozen examples, measure agreement, sharpen, repeat. Swap hooks for headlines, subject lines, long-form, or a tool-call trajectory — the machinery is identical.
