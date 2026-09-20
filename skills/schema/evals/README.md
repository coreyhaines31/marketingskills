# schema evals

`evals.json` lists the prompts this skill is tested against and, for each one, what a good
answer contains — in prose (`expected_output`, `assertions`). Prose is readable, but nothing
can run it, so a drifting answer is only noticed if someone reads it closely.

`check.py` is a runnable subset of eval id 1 (the TaskFlow homepage prompt). It does not
replace the prose — it covers the part of it that can be decided mechanically.

## Usage

```bash
# an agent's reply
python3 skills/schema/evals/check.py reply.md --expect-name TaskFlow

# the workspace the agent worked in, for agents that write index.html instead of answering inline
python3 skills/schema/evals/check.py /path/to/workspace --expect-name TaskFlow

# confirm the checker still accepts good answers and rejects bad ones
python3 skills/schema/evals/check.py --selftest
```

Exit `0` = pass, `1` = fail, `2` = usage error. Add `--json` for machine-readable output.
Python 3.8+, standard library only.

## What it checks, and where each check comes from

| Check | Source |
|---|---|
| `json_ld_parses` | SKILL.md — "Use JSON-LD" |
| `organization_present` | eval id 1 — "Implement Organization schema" |
| `organization_required_properties` (`name`, `url`) | SKILL.md — Common Schema Types table |
| `organization_recommended_properties` (`logo`, `description`, `sameAs`) | eval id 1 — "required and recommended properties" |
| `business_name_matches_prompt` | eval id 1 — the prompt names TaskFlow; SKILL.md — "Don't markup content that doesn't exist" |
| `additional_relevant_types` (`WebSite` / `SoftwareApplication` / `Product`) | eval id 1 — "additional schema types for a SaaS homepage" |
| `graph_used_for_multiple_types` | eval id 1 — "Should use @graph for multiple types" |
| `no_placeholder_values` | SKILL.md — "Accuracy First" |
| `validation_tools_recommended` | eval id 1 — "recommend validation with Google's Rich Results Test and Schema.org validator" |

## What it deliberately does not check

- The behavioural assertions — "checks for product-marketing.md first", "addresses CMS
  integration for dynamic fields", "recommends additional schema types" as *advice*. Those need
  a reader, and a guess dressed up as a check is worse than no check.
- Whether the markup matches the real page (the checker has no page to compare against).
- Style: key order, block shape, wording, which of the legal serialisations was chosen.

## Accepted answer shapes

All of these are read, because all of them are legal:

- `<script type="application/ld+json"> … </script>`
- a fenced ```json / ```jsonld block
- a bare `.json` file
- either the reply file itself, or the whole workspace directory (agents differ on where they
  put the answer, and that difference is not a quality difference)

Harness bookkeeping is skipped when a directory is given: run logs (`*.jsonl`), harness config
(`opencode.json`, `package.json`), `.opencode/`, and `.git/`. A run log replays the prompt — and
therefore the skill's own reference examples — into the workspace; counting that as the agent's
output would let an agent pass by doing nothing.

The one check that encodes a documented preference rather than a correctness fact is
`graph_used_for_multiple_types`: eval id 1 asks for `@graph`, while several separate `<script>`
blocks are equally valid in practice. The failure message says so, so a writer who reads it
knows they are being asked for the author's preferred packaging, not told their markup is broken.

## Fixtures

| Fixture | Expected | What it represents |
|---|---|---|
| `fixtures/good-1.md` | pass | `<script>` tag, `@graph`, `sameAs` as an array, `logo` as a URL string |
| `fixtures/good-2.md` | pass | fenced JSON, per-node `@context`, `sameAs` as a single string, `logo` as an `ImageObject` |
| `fixtures/bad-1.md` | fail | valid JSON, but one type only, no `@graph`, recommended properties missing, placeholder values |
| `fixtures/bad-2.md` | fail | complete-looking markup that does not parse |

Two good fixtures are on purpose. A single accepted example makes the checker equivalent to
"does the answer look like that one example", which is a different — and much weaker — claim
than "the answer is correct".

## Out-of-sample check

Two agents were given the prompt in eval id 1:

- **deepseek-flash** answered inline → **passes all nine checks**.
- **qwen3-coder-plus** wrote `index.html` in the workspace → **fails only
  `graph_used_for_multiple_types`** (four separate `<script>` blocks instead of one `@graph`).

The second one is the reason directory support exists: pointed at that agent's reply alone, the
checker reported *every* check as failed — the answer was in a file, and the reply was a
description of it.

## Coverage

Only eval id 1. The other five evals in `evals.json` are still prose-only; adding checks for
them is the same exercise, one eval at a time, and each new check should come with the fixture
pair that proves it accepts the legal variants and rejects the broken ones.
