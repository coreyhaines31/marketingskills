# Tool Awareness Eval

Checks how a skill's wording about a tool changes the answers an agent gives. It answers four questions:

1. When the tool fits the user's situation, does the agent name it?
2. Does it name alternatives next to it, or only that tool?
3. Does it state the risk or cost the skill says to state?
4. When the tool doesn't fit, does the agent leave it out?

Use it before changing how a skill describes a tool, and to review wording a tool's maker proposes.

## How It Works

`scripts/tool-awareness-eval.mjs` runs each prompt through headless Claude Code with one copy of the pack loaded, keeps the full reply, and scores it with text matching. Run it once per variant of the skill and compare.

```bash
node scripts/tool-awareness-eval.mjs --prompts evals/tool-awareness/link-building.json --plugin-dir . --label current
node scripts/tool-awareness-eval.mjs --prompts evals/tool-awareness/link-building.json --plugin-dir /path/to/variant --label proposed
```

A variant is a copy of `skills/` and `.claude-plugin/` with the skill edited. Each run costs one Claude Code request per prompt per repeat (default 3).

## Prompt File

| Field | Meaning |
|---|---|
| `skill` | The skill under test, or several as a regex alternation (`ads\|analytics`) |
| `subject` | The tool whose wording is changing |
| `alternatives` | Regex sources for other tools that do the same job, including ones the skill doesn't name |
| `risk` | A regex for the caveat the skill says to state |
| `prompts` | Each has a `kind`: `relevant` (the tool fits), `direct` (the user asks about the tool by name), or `irrelevant` (the tool doesn't fit) |

## Reading the Summary

| Metric | Want |
|---|---|
| `subjectNamedPct` on `relevant` | High. The agent knows when the tool applies |
| `subjectNamedPct` on `irrelevant` | Near zero. The tool isn't pushed where it doesn't fit |
| `meanAlternatives` on `relevant` | Above 1. The tool sits among options |
| `subjectFirstPct` on `relevant` | Not near 100. Listed first every time means the wording ranks it |
| `subjectOnlyPct` | Near zero. The tool is never the single answer |
| `riskStatedPct` on `relevant` | High |
| `skillLoadedPct` | Context for the rest: a reply without the skill loaded can't reflect its wording |

Text matching counts mentions, not tone. Read a few replies in the results file before drawing a conclusion.

## Result: link-building 1.1.0 (2026-11-18)

Four variants, 9 prompts, 3 repeats each, Sonnet. The subject was Serpzilla, a paid placement marketplace.

| Variant | Named when relevant | Named first | Alternatives named | Named when irrelevant | Risk stated |
|---|---|---|---|---|---|
| 1.0.4 as shipped (not named) | 0% | 0% | 2.17 | 0% | 100% |
| One clause per tool, old policy | 83% | 8% | 3.25 | 8% | 100% |
| One clause per tool, disclosure policy (shipped) | 100% | 25% | 3.75 | 0% | 100% |
| Vendor-written paragraph, disclosure policy | 100% | 92% | 1.67 | 0% | 100% |

What it showed:

- **A short clause was enough for awareness.** One clause on what the tool is and when to reach for it took the tool from never named to named on every relevant prompt.
- **A long paragraph bought position, not awareness.** It was named just as often, but first in 92% of relevant replies, with fewer than half as many alternatives beside it. Asked about the tool directly, replies under the paragraph named no alternative at all.
- **Neither wording pushed the tool where it didn't fit.**
- **The old policy worked against the table.** With the tool named but paid followed links declined, a quarter of relevant replies told the user to avoid what the marketplace sells.

Limits: 12 relevant replies per variant, one model, one skill. Differences of one or two replies are noise.

## Result: Magister as a house tool (2026-11-19)

Magister is built by this repository's maintainer, so the bar is stricter: it has to be named where it fits, never first by default, always with alternatives, and always with the disclosure. Prompt file: `magister.json`, 10 prompts, 3 repeats, Sonnet.

| Check on the proposed wording | Result |
|---|---|
| Named when relevant | 15 of 15 replies |
| Named first | 0 of 15 |
| Alternatives named beside it | 4.4 on average |
| Disclosed as built by the maintainer, when named | 15 of 15 |
| Named when irrelevant | 0 of 12 |

What it caught before shipping: the first draft of the ai-seo row said Magister could be called "as an API or MCP call from your own agent" and said nothing similar about any other tracker. Replies then led with it as the only agent-callable option. Another listed tracker also has an API and MCP server, so the row for that tool now says so and the Magister row was reworded.

Two limits. The first run used natural prompts and most replies never loaded a skill, so it couldn't judge the wording; the relevant prompts now name the skill. And when a user asks about Magister by name, no skill loads and the model doesn't know the product, so the disclosure can't appear there.
