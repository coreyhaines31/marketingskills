# Skill Trigger Eval

Checks whether Claude Code picks the right skill for a prompt when the whole pack is installed. Each prompt runs through headless Claude Code (`claude -p`) with this repo loaded as a plugin, user and local settings off, and only the Skill tool available. The first skill the model invokes is scored against the expected skills.

## Files

- `prompts.json`: 3 prompts per skill (direct, indirect, near-miss) plus 12 non-marketing prompts. Written from each skill's scope.
- `heldout.json`: 2 prompts per skill plus 8 non-marketing prompts, written from the skill bodies only, without reading descriptions. Use it to check that a description change helps on prompts nobody tuned it against.
- `results/`: run output (git-ignored).

## Run

```bash
node scripts/trigger-eval.mjs --label current                      # pack alone, prompts.json
node scripts/trigger-eval.mjs --prompts evals/triggers/heldout.json --label current-heldout
node scripts/trigger-eval.mjs --plugin-dir ../variant --label variant   # a copy with edited descriptions
node scripts/trigger-eval.mjs --extra-plugin-dir ../other-skills --label crowded
```

`--extra-plugin-dir` loads more skills next to the pack (a plugin folder with `.claude-plugin/plugin.json` and `skills/`), which is closer to a real install where the pack competes with other skills. Each prompt is one request on your logged-in Claude Code, about $0.05 on Sonnet.

Outcomes: `pass`, `wrong-skill` (another skill from this pack), `other-skill` (a skill from outside the pack), `no-trigger` (no skill invoked), and `false-trigger` (a pack skill fired on a non-marketing prompt).

## Why description length matters

Claude Code caps the skill listing it sends the model at about 30,000 characters. Skills past the cap appear as a bare name with no description. Checked on 2026-11-09 with Claude Code 2.1.319 by reading the `skill_listing` the session recorded:

| Pack | Description chars | Our skills shown name-only (pack alone) | With 90 other skills installed |
|---|---|---|---|
| Descriptions before 2.14.3 | 42,105 | 26 of 53 | 29 of 53 |
| Descriptions from 2.14.3 | 18,526 | 0 of 53 | 0 of 53 |

Keep each description at 500 characters or fewer: what the skill does, the distinct situations it covers, any operative rule, and which neighbouring skill to use instead.

## Results (Sonnet, one run each, 2026-11-09)

| Prompt set | Condition | Before 2.14.3 | From 2.14.3 |
|---|---|---|---|
| prompts.json (159 marketing) | pack alone | 96.2% | 99.4% |
| prompts.json | +90 other skills | 94.3% | 98.7% |
| heldout.json (106 marketing) | pack alone | 87.7% | 92.5% |
| heldout.json | +90 other skills | 79.2% | 87.7% |

No false triggers on non-marketing prompts in any run. Most remaining held-out misses are `no-trigger`: the model answers directly without loading a skill (competitor-profiling, customer-research, marketing-council, and reverse-engineer-marketing prompts). One run per cell, so differences of a point or two are noise; the crowded held-out gain (+8.5) and the listing change are not.
