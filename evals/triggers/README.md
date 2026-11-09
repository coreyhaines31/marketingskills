# Skill Trigger Eval

Checks whether Claude Code picks the right skill for a prompt when the whole pack is installed. Each prompt runs through headless Claude Code (`claude -p`) with this repo loaded as a plugin, user and local settings off, and only the Skill tool available. The first skill the model invokes is scored against the expected skills.

## Files

- `prompts.json`: 3 prompts per skill (direct, indirect, near-miss) plus 12 non-marketing prompts. Written from each skill's scope.
- `heldout.json`: 2 prompts per skill plus 8 non-marketing prompts, written from the skill bodies only, without reading descriptions.
- `heldout2.json`: 2 advice-style prompts per skill ("give me 5 ways", "is this enough"), written the same way.
- `heldout3.json` and `heldout4.json`: 2 judgement-style prompts per skill each ("should we", "which of these", "is it okay to"), written the same way. Keep one set unread while tuning descriptions, and judge the change on it. heldout4 was the unread set for 2.14.9; write a new one before the next round.
- `results/`: run output (git-ignored). Missed rows include the model's reply, so you can tell a skipped skill from a fair clarifying question.

Every prompt must include the material it refers to. A prompt that mentions "the URLs below" without them makes the model ask for them, which scores as a miss.

## Run

```bash
node scripts/trigger-eval.mjs --label current                      # pack alone, prompts.json
node scripts/trigger-eval.mjs --prompts evals/triggers/heldout3.json --label current-judgement
node scripts/trigger-eval.mjs --plugin-dir ../variant --label variant   # a copy with edited descriptions
node scripts/trigger-eval.mjs --extra-plugin-dir ../other-skills --repeat 2 --label crowded
```

`--extra-plugin-dir` loads more skills next to the pack (a plugin folder with `.claude-plugin/plugin.json` and `skills/`), which is closer to a real install where the pack competes with other skills. Each prompt is one request on your logged-in Claude Code, about $0.05 on Sonnet.

Outcomes: `pass`, `wrong-skill` (another skill from this pack), `other-skill` (a skill from outside the pack), `no-trigger` (no skill invoked), `false-trigger` (a pack skill fired on a non-marketing prompt), and `error` (the run failed; left out of the scores).

**Noise:** identical crowded runs of one 106-prompt set scored 80.2%, 84.0%, and 87.7%. Use `--repeat 2` or more for crowded runs, and don't read a change of a few points from one run.

## Why description length matters

Claude Code caps the skill listing it sends the model at about 30,000 characters. Skills past the cap appear as a bare name with no description. Checked on 2026-11-09 with Claude Code 2.1.319 by reading the `skill_listing` the session recorded:

| Pack | Description chars | Our skills shown name-only (pack alone) | With 90 other skills installed |
|---|---|---|---|
| Before 2.14.3 | 42,105 | 26 of 53 | 29 of 53 |
| 2.14.3 | 19,259 | 0 of 53 | 2 of 53 (the cap is shared) |
| 2.14.8 | 18,676 | 0 of 53 | 0 of 53 |
| 2.14.9 | 18,662 | 0 of 53 | 0 of 53 |

Keep each description at 500 characters or fewer: what the skill does, the questions it answers, the distinct situations it covers, any operative rule, and which neighbouring skill to use instead.

## Why descriptions name the questions they answer

Descriptions that only say what a skill makes ("write", "plan", "create") lose advice and judgement questions: asked "should we say PaperTrail lacks SSO?" or "where would you look for buyers?", the model answers from general knowledge without loading the skill, most of all when many other skills are installed. From 2.14.8 each description opens with what the user wants to do, then the questions it answers ("or asks whether a result is real, when to stop a test, or which version won"). From 2.14.9 those questions cover the usual judgement calls in each area: choosing between two options, whether something is okay or fair, and whether it's enough.

## Results (Sonnet, 2026-11-09)

| Prompt set | Condition | Before 2.14.3 | 2.14.3 | 2.14.8 | 2.14.9 |
|---|---|---|---|---|---|
| prompts.json (159) | pack alone | 96.2% | 98.7% | 100% | |
| prompts.json | +90 other skills | 94.3% | 96.9% | 98.7% | 98.7% |
| heldout.json (106) | +90 other skills | 81.1% (old prompts) | 94.3% | 97.2% | |
| heldout2.json, advice (106) | +90 other skills | | 80.2 / 84.0 / 87.7% | 93.4 / 94.3% | 98.1% |
| heldout3.json, judgement (106) | pack alone | | 73.6% | 87.7% | |
| heldout3.json, judgement | +90 other skills | | 58.5 / 62.3% | 73.6 / 73.6% | 96.2 / 97.2% |
| heldout4.json, judgement (106) | pack alone | | | 85.8% | 95.3% |
| heldout4.json, judgement | +90 other skills | | | 67.0 / 66.0% | 92.5 / 92.5%, 89.6% after review fixes |

heldout.json scores from 2.14.3 on use the corrected prompts (seven no longer point at missing material). Each wording change was written after reading misses on one set and judged on a set nobody had read: heldout3 for 2.14.8, heldout4 for 2.14.9 (2.14.9 was tuned on heldout3, so its heldout3 score is not a fair test). After review, nine trigger terms the trim had dropped (Core Web Vitals, self-reported attribution, AlternativeTo, talk tracks, and others) were restored and a few low-value phrases cut; one crowded rerun of the shipped wording scored 89.6%, within run-to-run noise. No false triggers on non-marketing prompts in any run, including 16 non-marketing judgement prompts.

What's left: with 90 other skills installed, about 7% of judgement prompts still get answered without a skill (marketing-ideas, marketing-plan, pricing, prospecting, sales-enablement), and a few go to a neighbour (marketing-ideas to marketing-plan, free-tools to lead-magnets).
