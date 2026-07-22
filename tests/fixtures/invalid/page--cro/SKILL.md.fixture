---
name: page--cro
description: Regression fixture — use this when verifying that validate-skills.sh rejects a name with consecutive hyphens. See PR #451 / issue #450.
---

# page--cro (regression fixture)

Intentionally invalid: the `name` contains consecutive hyphens (`--`), which is
not allowed. `validate-skills.sh` must reject this. Not a real skill — the file is
named SKILL.md.fixture so it is not picked up by the validator or CI directly; the
regression runner copies it into a temp SKILL.md before validating.
