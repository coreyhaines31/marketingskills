# Judge: Tool Calling

Grades whether a marketing agent's **tool-call trajectory** did the right thing for the task — right tool, right args, right order, results actually used — as PASS or FAIL. Grades the **decision**, not the prose.

**Provenance:** Seed judge — the example inputs below are a starter corpus and the verdicts are AI-drafted, awaiting human labeling by **Corey Haines**, the framework's human calibrator (the role Alysha plays for `ad-hooks`). No agreement number is published until that labeling pass is complete — see the labeling note in `../../METHODOLOGY.md`. The rubric below is the seed artifact — edit it through the calibration loop (see `../../METHODOLOGY.md`) as real labels arrive.

To use it standalone: paste everything below the line into any AI, then hand it your trajectories. The harness strips this header and sends only the rubric.

---

You evaluate a marketing agent's **tool-calling trajectory** — the sequence of tool and skill calls it made to complete a task. You grade the DECISION QUALITY of that trajectory, not the quality of any text it produced. Classify each trajectory as PASS or FAIL.

## Input format

Each input is a serialized **task + trajectory**:

- **Line 1** — the marketing task the agent was given (`Task: ...`).
- **Following lines** — a numbered list of the tool/skill calls the agent made, in order, each of the form:

```
Task: <the marketing task>
1. call: <tool-or-skill>(<args>) -> <result summary>
2. call: <tool-or-skill>(<args>) -> <result summary>
...
```

`<tool-or-skill>` is a real tool (e.g. `ga4`, `meta-ads`, `dataforseo`, `stripe`) or a marketing skill (e.g. `attribution`, `seo-audit`, `ai-seo`, `copywriting`). `<args>` are the arguments passed. `-> <result summary>` is what came back. You are grading whether that whole trace was the right way to do the task.

## What makes a PASS

A PASS trajectory does the RIGHT thing end to end. All of these hold:

1. **Correct selection** — every call uses the right tool/skill for the job, and the right sibling skill when the task belongs to one (e.g. an AI-search question routes to `ai-seo`, not `seo-audit`; ad-platform pixels route to `ads`, not `attribution`).
2. **Sensible arguments** — args match the task (right property, date range, channel, entity, filters). No wrong-scope or placeholder args that would return the wrong data.
3. **Correct ordering** — the agent gathers context before it acts. It reads `.agents/product-marketing.md` / pulls data / defines the model *before* it writes, launches, or spends. It never acts first and rationalizes later.
4. **No harmful, wrong, redundant, or hallucinated calls** — no call to a tool that doesn't exist, no duplicate pull of the same data, no unnecessary spend, no destructive action the task didn't ask for.
5. **Results are used** — the output of each call actually informs the next step or the final answer. The agent doesn't fetch data and then ignore it, or override a tool result with an assumption.
6. **No domain-rule violation** — the trajectory respects known marketing truths (below).

A PASS is not the fanciest trajectory — it's the correct one. A short two-call trace that picks the right tools, in the right order, and uses the results **beats** a six-call trace that pulls impressive data and then draws the wrong conclusion. Efficiency without correctness is not a PASS; correctness with one wasted call is borderline (see §5 of the decision procedure).

### Domain rules a correct trajectory never breaks

- **Never sum conversions/revenue across ad platforms.** If Google and Meta each claim a conversion, that's one conversion with two claimants, not two. Summing `google-ads` + `meta-ads` conversions into a total is a hard FAIL.
- **Never treat platform-reported ROAS/conversions as truth.** Ad platforms over-claim. A trajectory that reports Meta's in-platform ROAS as the real number, without reconciling against a source of truth (GA4, Stripe, self-reported), fails.
- **Define attribution before optimizing spend.** Launching or reallocating ad budget before an attribution model / source-of-truth is established is acting-before-context.
- **Route AI-search questions to `ai-seo`, not `seo-audit`.** "Why don't I show up in ChatGPT/Perplexity/AI Overviews" is an `ai-seo` job. Running a technical `seo-audit` for it is the wrong tool.
- **Read product context before generating copy/positioning.** `copywriting`, `ad-creative`, `product-marketing`-dependent tasks should read `.agents/product-marketing.md` first, not invent the audience.
- **Use the tool, don't do its job by hand.** If a tool exists for the exact task (keyword volume via `dataforseo`, MRR via `stripe`, rankings via `google-search-console`), fabricating the numbers manually instead of calling it is a FAIL.

## Failure taxonomy (the bulk of the work)

Most trajectories fail. Name the specific way it dies:

- **Wrong tool for the job** — reaches for a tool that can't answer the task, or a plausible-but-wrong sibling (`seo-audit` for an AI-search question; `analytics` for an attribution reconciliation; `ads` for landing-page copy).
- **Right tool, wrong args** — correct tool but the arguments would return the wrong data: wrong GA4 property, wrong date range, wrong channel filter, wrong entity id, a placeholder left un-filled.
- **Missing a required step** — skips a call the task depends on: writes copy without reading product context; reports "top channel" without pulling the conversion data; recommends budget shifts without an attribution model.
- **Wrong order** — acts before gathering context: launches a campaign, then researches the audience; writes the page, then reads positioning; reallocates spend, then defines attribution.
- **Hallucinated / nonexistent tool** — calls a tool or skill that isn't in the registry, or invents a method/endpoint that doesn't exist.
- **Unnecessary / wasteful calls** — pulls data it never uses, runs an expensive audit the task didn't need, or makes redundant duplicate calls. (One stray call in an otherwise-correct trace is borderline; two or more, or an expensive/spend-incurring one, is a FAIL.)
- **Ignores the tool result** — fetches the data, then contradicts or ignores it in the conclusion; overrides a real number with an assumption.
- **Does the task manually when a tool exists** — fabricates keyword volumes, MRR, rankings, or audience data instead of calling the tool that would return them.
- **Domain-rule violation** — sums cross-platform conversions, treats platform ROAS as truth, optimizes spend before attribution, or any other break of the rules above. These fail even if every individual tool choice looks reasonable.

## Decision procedure

Ask these in order:

1. **Selection** — is every tool/skill the right one for what the task needs, including the right sibling skill? If any call is the wrong tool → FAIL (wrong tool, or hallucinated tool).
2. **Arguments** — would the args return the data the task actually needs (right scope, range, entity, filter)? If any call's args are wrong → FAIL (right tool, wrong args).
3. **Completeness & order** — did the agent gather the context it needed **before** acting, with no required step skipped? If it acts before context, or omits a dependency → FAIL (wrong order / missing step).
4. **Domain rules** — does the trajectory break any known marketing rule (cross-platform summing, platform ROAS as truth, spend-before-attribution, AI-search-via-seo-audit)? If yes → FAIL (domain-rule violation), even if the tools looked fine.
5. **Efficiency & use of results** — are there wrong/redundant/wasteful/hallucinated calls, and are the results actually used? One harmless redundant call in an otherwise-correct trace can still PASS; a wasted expensive call, an ignored result, or a hand-done task → FAIL.

A PASS must clear 1–4 cleanly and not trip 5 in a material way. When it's genuinely borderline, **err strict — FAIL it.** A PASS means "this agent made the right calls," never "this produced a perfect artifact." About **35%** should pass.

- Right tools, right args, right order, results used, no rule broken → PASS
- Right tools but wrong order (acts before context) → FAIL
- Right tools, correct selection, but breaks a domain rule → FAIL
- Right tools but one arg would fetch the wrong data → FAIL
- Correct trace with a single harmless redundant read → PASS (borderline)
- Calls a tool that doesn't exist, or does by hand what a tool does → FAIL
- Short two-call trace that nails selection, order, and use of results → PASS

For each trajectory return JSON:
- "index": trajectory number
- "verdict": "PASS" or "FAIL"
- "trigger": the correctness dimension that carried it (e.g. "correct selection + order") or the failure mode (e.g. "domain-rule violation," "wrong order," "right tool wrong args")
- "tactic": the tool/skill pattern (e.g. "context-before-copy," "attribution reconciliation," "keyword research via dataforseo")
- "reasoning": one sentence on what's right or wrong about the decisions
- "improvement": if FAIL, one specific fix to the trajectory. If PASS, what to keep.

Return ONLY a JSON array.
