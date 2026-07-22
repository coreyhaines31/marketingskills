# Marketing Eval Framework

**Expert-calibrated judges that grade the quality of marketing work — copy, creative, long-form, images, video, and tool-calling — plus a shared harness to prove and run them.**

An eval is two things: a **judge** (a rubric that reads something and grades it) and an **answer key** (examples a human graded by hand, so you can check whether the judge is any good). A judge is only worth trusting if it agrees with the human. This framework is a growing library of such judges + one harness that measures, reproduces, and runs any of them.

Reverse-engineered from the open-source [hook-grader](https://github.com/runneth-tools/hook-grader) (MIT) and generalized across every major marketing task. The ad-hooks judge is seeded directly from it, with credit.

> **Two layers, don't conflate them.** This is the **output-quality / trajectory** layer. It is distinct from each skill's `skills/<name>/evals/evals.json`, which are **behavioral** evals (does the agent *behave* right — check context, apply the framework, defer to the right sibling). This framework asks a different question: **is the output good, and did the agent make the right call?**

## Quick start

```bash
# Grade your own inputs against a judge
node grade.mjs judges/ad-hooks "Your dad's wallet is the reason your back hurts."
node grade.mjs judges/ad-hooks --file my-hooks.txt

# Reproduce a judge's calibration number against its human-labeled answer key
node harness.mjs judges/ad-hooks
```

Set `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` (auto-detected). Override the model with `EVAL_MODEL`. Zero dependencies, Node 18+.

No API key? The judge is just a prompt — open any `judges/<name>/JUDGE.md`, copy everything below the first `---`, paste it into Claude/ChatGPT, and hand it your inputs. You just became the harness.

## Structure

```
evals/
├── README.md              # this file
├── METHODOLOGY.md         # how to build & calibrate a trustworthy judge
├── lib.mjs                # provider-agnostic model calls; loads judges; captures tokens + latency
├── harness.mjs            # run a judge over its answer key → agreement % + confusion + cost/time
├── grade.mjs              # grade new inputs against any judge (BYO key)
└── judges/
    └── ad-hooks/          # seeded from hook-grader (credit: Alysha / Runneth, MIT)
        ├── JUDGE.md        # the rubric (everything after the first `---` is the prompt)
        ├── answer-key.json # [{ input, verdict }, ...] hand-labeled by a human
        └── README.md
```

Adding a judge is deliberately boring: create `judges/<name>/` with a `JUDGE.md` + `answer-key.json`, run `node harness.mjs judges/<name>` until the agreement number is good, commit. The harness never changes.

## Eval types and task families

Marketing tasks have different shapes, so judges are typed by **eval type** and **modality**, and each **task family** has its own contestants and judge:

| Family | Eval type | Judge modality | Examples |
|---|---|---|---|
| Copywriting | artifact quality | text rubric | hooks, headlines, CTAs, subject lines, value props |
| Long-form | artifact quality | text rubric | blog posts, guides, thought-leadership |
| Ad creative | artifact quality | text rubric + concept | concepts, angles, UGC scripts, storyboards |
| Images | artifact quality | multimodal + human panel | ad images, social graphics, product shots |
| Video | artifact quality | multimodal + human panel | video ads, short-form |
| Tool calling | trajectory | trajectory grader | right tool, args, sequence, orchestration |

Phase 0 (this) ships the harness + the first text-rubric judge (`ad-hooks`). Long-form, media (multimodal), and tool-calling (trajectory) judges extend the same harness with pluggable input modalities and grader backends.

## What it powers

- **Agent self-check** — a skill grades its own output and only surfaces what clears the bar.
- **Human triage** — kill dead-on-arrival work before you spend on it.
- **Model benchmark** — rank models (Opus / Sonnet / GPT / Kimi / Gemini…) per task on quality × cost (tokens) × time. See issues #479 / #480.

## Credit & license

MIT. The `ad-hooks` judge and its answer key are seeded from [hook-grader](https://github.com/runneth-tools/hook-grader) (MIT), graded by **Alysha** ([@alyshaboehmm](https://x.com/alyshaboehmm)) of Runneth — reused with credit. New judges are ours.
