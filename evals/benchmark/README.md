# Model Benchmark

Rank models on a marketing task by **quality × cost × time** (issue #480). Each contestant model **generates** outputs for a task set; a fixed, blind **judge** grades them; results aggregate into a leaderboard.

```bash
node benchmark.mjs --dry-run          # validate config + keys, print the plan, no API calls
node benchmark.mjs                    # run it (uses benchmark/config.json)
node benchmark.mjs my-config.json     # a different config
```

## How it works

1. **Generate** — every contestant in `config.json` writes an output for each brief in the task set (`tasks/<name>.json` → a `generate` instruction + `briefs`). Tokens + latency are captured per call.
2. **Judge (blind)** — the outputs are graded by the judge in `config.json` (`judgeModels`). The judge sees only the text, so grading is blind by construction. List **two models from different labs** to grade by **consensus** (PASS only if both agree) — the credible setting for ranking models.
3. **Aggregate** — per contestant: pass-rate (quality), avg tokens, avg latency, generation cost, and **cost per accepted output** (gen cost ÷ passes) — the metric that should drive routing.

## The generator/judge split (don't break it)

A contestant model must **never judge its own category** — self-preference bias. Keep `judgeModels` distinct from the contestant you care about, or use consensus across labs. This is why the benchmark separates the two roles.

## Integrity notes

- **Held-out tasks** — the briefs here are a small public sample. For a real published benchmark, rotate a private task set so models can't be tuned to it.
- **Pinned judge** — the judge model + rubric version are frozen; changing them re-baselines every score.
- **Samples** — models are stochastic; raise `samplesPerTask` so a single lucky/unlucky output isn't the score.
- **Pricing** — `../pricing.json` is illustrative and dated; verify before publishing. Cost is computed from real token usage × that table.
- **Seed judges** — most judges are still seed (AI-drafted labels pending Corey's labeling). Benchmarks run on them are directional until the judge is calibrated (see `../METHODOLOGY.md`).

## Adding models / providers

Add contestants to `../pricing.json`. Anthropic and OpenAI work out of the box; any **OpenAI-compatible** endpoint (Moonshot/Kimi, Gemini's compat endpoint, Together, Fireworks…) works via `provider: "openai-compatible"` + `baseURL` + `keyEnv` (+ `apiModel` when the API id differs from the registry key).
