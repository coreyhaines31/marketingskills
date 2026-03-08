# Using marketingskills as a Cowork Plugin

This repo ships as both a **Claude Code marketplace plugin** and a **Claude Cowork plugin**. Both formats coexist — the same `skills/` directory powers both.

## Quick Start

### 1. Build the plugin file

```bash
bash scripts/build-cowork-plugin.sh
```

This produces `marketing-skills.plugin` (a zip archive) at the repo root.

### 2. Upload to Cowork

1. Open [Claude Cowork](https://cowork.claude.ai)
2. Go to **Plugins** → **Upload Plugin**
3. Select `marketing-skills.plugin`
4. All 32 marketing skills will be available immediately

## Dual Format: How It Works

| File | Used by |
|------|---------|
| `.claude-plugin/marketplace.json` | Claude Code plugin marketplace |
| `.claude-plugin/plugin.json` | Claude Cowork |
| `skills/*/SKILL.md` | Both — same files, one source of truth |

Claude Code reads `marketplace.json` to list and install skills via `/plugin`. Cowork reads `plugin.json` for standalone plugin identity and loads skills from the bundled `skills/` directory.

## What's Included in the Plugin

The `.plugin` archive contains:

```
.claude-plugin/
├── marketplace.json
└── plugin.json
skills/
├── ab-test-setup/
├── ad-creative/
├── ai-seo/
└── ... (32 skills total)
README.md
LICENSE
AGENTS.md
VERSIONS.md
```

**Excluded** (not needed at runtime): `.git/`, `.github/`, `tools/`, `scripts/`

## Keeping Skills Up to Date

### If you cloned directly

```bash
git pull
bash scripts/build-cowork-plugin.sh
```

Then re-upload `marketing-skills.plugin` to Cowork.

### If you forked or copied into a separate project

Use the sync script to pull the latest skills from upstream and rebuild the plugin in one step:

```bash
bash scripts/sync-upstream.sh
```

This:
1. Shallow-clones (or updates) the upstream repo into `.upstream-cache/`
2. Copies `skills/`, `.claude-plugin/`, and supporting docs into your local structure
3. Rebuilds `marketing-skills.plugin`

`.upstream-cache/` is gitignored — it's a local fetch cache only.

## Verifying the Build

After building, inspect the archive contents:

```bash
unzip -l marketing-skills.plugin
```

You should see `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, all `skills/*/SKILL.md` files, `README.md`, and `LICENSE`.
