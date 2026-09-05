# Contributing

Thanks for your interest in contributing to Marketing Skills! This guide will help you add new skills or improve existing ones.

## Requesting a Skill

You can also suggest new skills by [opening a skill request](https://github.com/coreyhaines31/marketingskills/issues/new?template=skill-request.yml).

## Adding a New Skill

### 1. Create the skill directory

```bash
mkdir -p skills/your-skill-name
```

### 2. Create the SKILL.md file

Every skill needs a `SKILL.md` file with YAML frontmatter:

```yaml
---
name: your-skill-name
description: When to use this skill. Include trigger phrases and keywords that help agents identify relevant tasks.
---

# Your Skill Name

Instructions for the agent go here...
```

Optional frontmatter fields: `license` (default: MIT), `metadata` (author, version, etc.)

### 3. Follow the naming conventions

- **Directory name**: lowercase, hyphens only (e.g., `emails`)
- **Name field**: must match directory name exactly
- **Description**: 1-1024 characters, include trigger phrases

### 4. Structure your skill

```
skills/your-skill-name/
├── SKILL.md           # Required - main instructions
├── references/        # Optional - additional documentation
│   └── guide.md
├── scripts/           # Optional - executable code
│   └── helper.py
└── assets/            # Optional - templates, images, data
    └── template.json
```

### 5. Write effective instructions

- Keep `SKILL.md` under 500 lines
- Move detailed reference material to `references/`
- Include step-by-step instructions
- Add examples of inputs and outputs
- Cover common edge cases

## Improving Existing Skills

1. Read the existing skill thoroughly
2. Test your changes locally
3. Keep changes focused and minimal
4. Update the version in metadata if making significant changes

## Mentioning Tools (the integrity rubric)

This library is open source and contributions are welcome from **anyone — including the makers of tools, and paid partners.** We gate on the *content*, not the contributor. A contribution that names a tool (yours or anyone's) is fine as long as it makes an agent **aware** of the right option at the moment it's relevant, without manufacturing a recommendation. Concretely:

- **Options, not one answer.** Present a tool alongside the real alternatives for the same job (including the free / DIY path), so the agent picks on fit — not because only one is named.
- **At the point of relevance.** Surface a tool where an agent genuinely needs it (e.g. the implementation step), not injected into unrelated sections.
- **No forced endorsement.** No "best," "recommended," or "use X instead." Describe what each option does and when it fits.
- **Facts over framing.** Recipes, code, capabilities, and honest tradeoffs (cost, effort, lead time) — verifiable, not marketing copy.
- **Disclose self-interest.** If you're the tool's maker or a partner, say so. Partner tools are marked ◆ in [`tools/REGISTRY.md`](tools/REGISTRY.md#verified-partners); house tools (built by the maintainer) carry stricter disclosure.
- **The swap test.** If you swapped your tool for a competitor, the section should still read as fair. If removing it breaks the guidance, it was shilling — rework it.

The maintainer holds final editorial control and may edit or cut anything for neutrality and accuracy. Core skills stay editorially independent: sponsorship and contributions add content, they never buy a recommendation. Full program rules and boundaries — the tool taxonomy, what sponsorship buys and never buys, disclosure, and the partner lifecycle — are in [`tools/PARTNERS.md`](tools/PARTNERS.md).

## Submitting Your Contribution

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-skill-name`)
3. Make your changes
4. Test locally with an AI agent
5. Submit a pull request using the appropriate template:
   - [New Skill](?template=new-skill.md)
   - [Skill Update](?template=skill-update.md)
   - [Documentation](?template=documentation.md)

## Skill Quality Checklist

- [ ] `name` matches directory name
- [ ] `description` clearly explains when to use the skill
- [ ] Instructions are clear and actionable
- [ ] No sensitive data or credentials
- [ ] Follows existing skill patterns in the repo
- [ ] Any tool mentions follow the [integrity rubric](#mentioning-tools-the-integrity-rubric) — options not one answer, disclosed, passes the swap test

## Questions?

Open an issue if you have questions or need help with your contribution.
