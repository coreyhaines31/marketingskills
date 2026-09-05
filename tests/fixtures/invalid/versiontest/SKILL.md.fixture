---
name: versiontest
description: Regression fixture — use this when verifying that validate-skills.sh rejects a top-level version field with no metadata block. See PR #451 / issue #450.
version: 1.0.0
---

# versiontest (regression fixture)

Intentionally invalid: `version:` is declared at the top level with no `metadata:`
block. `validate-skills.sh` must reject this. Not a real skill — the file is named
SKILL.md.fixture so it is not picked up by the validator or CI directly; the
regression runner copies it into a temp SKILL.md before validating.
