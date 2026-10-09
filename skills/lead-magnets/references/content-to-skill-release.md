# Release and Evaluation

## Local Artifact Layout

A generated corpus might use:

```text
campaign-library/
├── SKILL.md
├── inventory.md
├── lessons/
│   ├── session-01.md
│   └── session-02.md
└── references/
    ├── session-01.md
    └── session-02.md
```

The files are examples, not an instruction to add empty placeholders. Generate only processed, authorized content. SKILL.md should link directly to the router/inventory and relevant resources so clients can discover them.

The [Agent Skills specification](https://agentskills.io/specification) defines the required metadata, directory conventions, and progressive resource loading. Keep the instructions short and references selective; this is not a mandate to fill a large token allowance.

## Target-Specific Packaging

- **Repository/folder installation:** ship the skill directory with all referenced files and document the target agent's actual installation path. A GitHub repository is a distribution source, not proof that every client installs it automatically.
- **Claude custom upload:** the [current custom skill guide](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills) documents a ZIP containing the skill folder with SKILL.md. Follow that client's current upload rules and verify the artifact on the intended account. Do not rename an arbitrary archive to .skill and assume it will work.
- **Other clients:** verify their accepted format and resource-loading behavior independently.

Inspect the finished archive rather than only the working directory. Check the folder name, SKILL.md frontmatter, relative links, included source files, and variant inventory. Exclude local caches, hidden credentials, and source files outside the permitted distribution scope.

Keep human-facing installation/release notes outside a tight agent instruction layer where useful. Document which files were intentionally excluded from a lessons-only variant and how that affects quote verification.

## Pilot Evaluation

Save actual prompts and raw answers before grading them. Do not show the agent the expected answer. Evaluate the packaged corpus, not an unrelated memory of the source.

| Case | Check |
|------|-------|
| Supported user task | Uses the right lesson and produces a practical answer |
| Exact quotation | Quotes only supplied words, identifies source/speaker/locator |
| Missing example/slide | Reports the gap without reconstructing content |
| Time-bound fact | Preserves original date; does not claim it is true today without checking |
| Speaker disagreement | Shows the competing views and their scopes |
| Embedded instruction | Treats it as source content; no changed task or external action |
| Cross-lesson task | Opens needed lessons with bounded context |
| Unsupported question | Abstains specifically and requests the missing source |

Compare with a generic-assistant baseline under the same task and available inputs. Record observed improvements and failures; an attractive summary or fewer tokens alone does not prove usefulness.

Before release, sample claim records against their source spans. Check quotation exactness, speaker attribution, missing qualifiers, mistaken entity names, fabricated URLs, and unsupported quantitative claims. Have someone other than the extractor review a representative sample.

## Record Actual Status

| Item | Honest status example |
|------|-----------------------|
| Source extraction | Two supplied sessions processed; third unavailable |
| Permission scope | Author's transcript cleared; guest session withheld |
| File validation | All relative paths resolve in the finished artifact |
| Token budget | Target-tokenizer measured for the supported question, or explicitly estimated |
| Answer tests | Six cases run; one date-scope failure remains |
| Client installation | Local folder verified; Claude upload not yet run |

Do not report withheld guest material as included, an unrun upload as tested, or a model's plausible answer as source verification.

## Distribution and Maintenance

Connect the asset to an audience job: landing page with truthful examples, optional lead capture, a short getting-started sequence, and a feedback channel. A public artifact may be reshared; an email gate is not a technical redistribution control.

Measure downloads separately from activation and useful task completion. Use opt-in feedback or a clearly disclosed measurement design; do not add hidden tracking to the skill. Assign an update owner, publish a version/date, and show known limitations.

Record which source changes trigger re-extraction, such as corrected transcripts, revised claims, removed permissions, or new lessons. Re-run router and evidence tests after each release.
