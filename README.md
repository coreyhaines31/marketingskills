# Marketing Skills for ChatGPT, Codex & AI Agents

A collection of reusable marketing workflows based on the open Agent Skills standard. This fork is organized **OpenAI-first** for ChatGPT and Codex while preserving compatibility with Claude Code, Cursor, Windsurf, and other compatible agents.

Original project by [Corey Haines](https://github.com/coreyhaines31/marketingskills). This fork keeps the original MIT license and attribution.

## OpenAI quick start

| Surface | Recommended setup |
|---|---|
| ChatGPT with Personal Skills | Upload individual skill packages from **Plugins → Skills → Create → Upload from your computer** |
| ChatGPT without Personal Skills | Use a Project or Custom GPT with selected `SKILL.md` files plus `chatgpt/INSTRUCTIONS.md` |
| Codex, current project | `npx skills add THEGACCI/marketingskills -a codex` |
| Codex, all projects | `npx skills add THEGACCI/marketingskills -a codex -g` |
| Other compatible agents | Install to `.agents/skills/` or use the agent-specific path supported by the Skills CLI |

See [OPENAI.md](OPENAI.md) for the detailed ChatGPT and Codex guide.

## Recommended starter pack for CRM and marketing operations

Install these first instead of loading the entire repository:

```bash
npx skills add THEGACCI/marketingskills -a codex \
  --skill product-marketing revops emails analytics cro \
  copywriting copy-editing customer-research social ads
```

This set covers:

- Product and audience context
- CRM lifecycle, lead scoring, routing, and handoff
- Email and lifecycle automation
- Analytics and experimentation
- Conversion optimization
- Marketing copy and editing
- Customer research
- Social content and paid media

## What are Skills?

Skills are folders containing a `SKILL.md` file and, optionally, references, scripts, templates, or assets. They teach an AI agent how to execute a repeatable workflow consistently.

The repository uses the open Agent Skills structure:

```text
skills/
└── skill-name/
    ├── SKILL.md
    ├── references/
    ├── scripts/
    └── assets/
```

The `product-marketing` skill is the foundation. Other skills should use the product, audience, positioning, and messaging context before producing recommendations or deliverables.

## Available skills

### Conversion optimization

- `cro`
- `signup`
- `onboarding`
- `popups`
- `paywalls`
- `ab-testing`

### Content and copy

- `copywriting`
- `copy-editing`
- `cold-email`
- `emails`
- `social`
- `sms`
- `video`
- `image`
- `content-strategy`

### SEO and discovery

- `seo-audit`
- `ai-seo`
- `programmatic-seo`
- `site-architecture`
- `competitors`
- `competitor-profiling`
- `schema`
- `aso`
- `directory-submissions`

### Paid media and measurement

- `ads`
- `ad-creative`
- `analytics`

### Growth and retention

- `churn-prevention`
- `co-marketing`
- `community-marketing`
- `free-tools`
- `lead-magnets`
- `marketing-loops`
- `referrals`

### Strategy and monetization

- `product-marketing`
- `marketing-plan`
- `marketing-council`
- `marketing-ideas`
- `marketing-psychology`
- `customer-research`
- `offers`
- `launch`
- `pricing`

### Sales and revenue operations

- `revops`
- `sales-enablement`
- `prospecting`
- `public-relations`

## Installation

### ChatGPT Web/Desktop

When Personal Skills are enabled for your account or workspace:

1. Open **Plugins** in ChatGPT.
2. Open the **Skills** tab.
3. Select **Create**.
4. Select **Upload from your computer**.
5. Upload one packaged skill at a time.

Generate ChatGPT-ready ZIP packages:

```bash
python tools/package_chatgpt_skills.py --skill emails
python tools/package_chatgpt_skills.py --skill revops analytics cro
python tools/package_chatgpt_skills.py --all
```

Packages are created in:

```text
dist/chatgpt/
```

When Personal Skills are not available, follow the Project or Custom GPT setup in [OPENAI.md](OPENAI.md).

### OpenAI Codex

Install all skills in the current project:

```bash
npx skills add THEGACCI/marketingskills -a codex
```

Install selected skills:

```bash
npx skills add THEGACCI/marketingskills -a codex \
  --skill product-marketing revops emails analytics cro
```

Install globally:

```bash
npx skills add THEGACCI/marketingskills -a codex -g
```

List available skills:

```bash
npx skills add THEGACCI/marketingskills --list
```

### Clone and copy

macOS, Linux, or Git Bash:

```bash
git clone https://github.com/THEGACCI/marketingskills.git
mkdir -p .agents/skills
cp -r marketingskills/skills/* .agents/skills/
```

Windows PowerShell:

```powershell
git clone https://github.com/THEGACCI/marketingskills.git
New-Item -ItemType Directory -Force ".agents\skills" | Out-Null
Copy-Item ".\marketingskills\skills\*" ".\.agents\skills\" -Recurse -Force
```

### Claude Code compatibility

The original Claude Code plugin files remain available in `.claude-plugin/`.

```bash
/plugin marketplace add THEGACCI/marketingskills
/plugin install marketing-skills
```

Claude-specific syntax must remain outside the shared `skills/` files so the same skills continue to work with ChatGPT, Codex, and other compatible agents.

## Usage

Ask naturally:

```text
Use the revops skill to design a lead lifecycle and scoring model.

Use the emails skill to create a five-email reactivation flow.

Use the cro and analytics skills to audit this landing page and define the events to track.
```

In ChatGPT, installed Skills may activate automatically or can be selected explicitly. In Codex, mention the skill name when you need deterministic routing.

## Product marketing context

Create a reusable product context document before running complex marketing tasks:

```text
.agents/product-marketing.md
```

For ChatGPT Projects or Custom GPTs, upload the same document as knowledge. Include:

- Company and brand
- Products or services
- Priority audiences and segments
- Problems, motivations, and objections
- Value proposition and positioning
- Differentiators
- Voice and tone
- Available channels
- Legal, commercial, and brand restrictions
- Metrics and business goals

## Repository structure

```text
marketingskills/
├── .claude-plugin/              # Optional Claude Code compatibility
├── chatgpt/
│   └── INSTRUCTIONS.md          # Orchestrator for Projects and Custom GPTs
├── skills/                      # Portable Agent Skills
├── tools/
│   └── package_chatgpt_skills.py
├── AGENTS.md                    # Codex/repository operating instructions
├── OPENAI.md                    # ChatGPT and Codex setup guide
├── CONTRIBUTING.md
└── README.md
```

## Validation

Validate and package one skill:

```bash
python tools/package_chatgpt_skills.py --skill emails
```

The script verifies:

- `SKILL.md` exists
- YAML frontmatter is present
- `name` exists and matches the directory
- `description` exists
- The archive contains `SKILL.md` at its root

## Syncing with the original repository

Add the original repository as an upstream remote:

```bash
git remote add upstream https://github.com/coreyhaines31/marketingskills.git
git fetch upstream
git merge upstream/main
```

Review conflicts carefully in `README.md`, `OPENAI.md`, `chatgpt/`, and `tools/package_chatgpt_skills.py`.

## Contributing

Keep shared skills portable:

- Do not add vendor-specific command syntax to `skills/*/SKILL.md`.
- Keep tool-specific integration instructions in dedicated platform documentation.
- Use `.agents/` as the cross-agent project context location.
- Preserve the original license and attribution.

## License

[MIT](LICENSE)
