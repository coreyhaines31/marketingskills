# RACO Marketing Artifacts

This folder holds RACO's own marketing material. Everything else in this repo comes from the upstream [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) project.

## Contents

| Path | What it is |
|------|------------|
| [raco-monitoring-center/product-marketing.md](raco-monitoring-center/product-marketing.md) | Product marketing context for RACO Monitoring Center (RMC), the cloud monitoring and alarm software |
| [verbatim-gen2/product-marketing.md](verbatim-gen2/product-marketing.md) | Product marketing context for the Verbatim Gen2 RTU hardware, with a draft spec sheet |
| [claims-and-evidence.md](claims-and-evidence.md) | Sources, verified claims, claims we must not make yet, and open questions |

Put new artifacts for a product (messaging, battlecards, one-pagers, email copy, launch plans) in that product's folder. Put material that covers both products at this level.

## Using these files with the marketing skills

Every skill in `skills/` looks for its context at `.agents/product-marketing.md`. The upstream `.gitignore` ignores all `.agents/` folders, so a file there is never committed. For that reason the committed source of truth lives here, and you have two options:

1. **Point the skill at the file.** For example: "Use `raco/verbatim-gen2/product-marketing.md` as the product marketing context, then run the copywriting skill for a Gen2 landing page." `raco/CLAUDE.md` also tells Claude Code to do this when it works in this folder.
2. **Copy it to the default path for a session:**
   ```bash
   mkdir -p .agents && cp raco/raco-monitoring-center/product-marketing.md .agents/product-marketing.md
   ```
   The copy is local only. If you edit it, copy your changes back into `raco/` before you commit.

When you update a context file, follow the product-marketing skill rules: bump the **Document version**, set **Last updated**, and add a line at the top of the **Changelog**.

## Keeping upstream skills up to date

This repo is a fork. To pull new and updated skills from upstream:

```bash
# one time
git remote add upstream https://github.com/coreyhaines31/marketingskills.git

# each update
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

Rules that keep this merge clean:

- Keep all RACO content inside `raco/`. Upstream never touches this folder.
- Do not edit upstream files (`skills/`, `tools/`, `README.md`, `AGENTS.md`, `CLAUDE.md`, `VERSIONS.md`, `.claude-plugin/`, `.gitignore`). If a skill needs a RACO change, copy it into `raco/skills/<name>/` and edit the copy.
- Use `git merge`, not `git rebase`, so RACO history stays intact.
