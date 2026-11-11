# Agent Registry Files

If the product ships an MCP server, a coding-agent plugin, or an agent skill, a few files in its public repo decide where agents and their users can find it. Some registries list a repo as soon as the file exists; most still need a claim or submit step. Add the files first, then do the manual steps from Tier 4 in `directory-list.md`.

Checked against each registry's own docs on 2026-11-11. These change often, so recheck the linked docs before relying on a detail.

| File | Registry | Listing | What to do |
|---|---|---|---|
| `server.json` | Official MCP Registry | Manual publish | `mcp-publisher publish` (steps in `directory-list.md`, Tier 4A). `description` must be 1–100 characters; use `summary_100` from the listing kit. |
| `glama.json` | Glama | Claim by hand | Root file with `"$schema": "https://glama.ai/mcp/schemas/server.json"` and `"maintainers": ["your-github-username"]`. Required for org-owned repos; personal repos can claim by signing in with GitHub. Re-run the claim after changing it. |
| `gemini-extension.json` | Gemini CLI extensions gallery | Automatic | Public repo, the file at the repo root (or release archive root), and the GitHub topic `gemini-cli-extension`. The gallery crawls tagged repos daily. |
| `.cursor-plugin/plugin.json` | Cursor Marketplace | Submit + review | Submit at cursor.com/marketplace/publish; every plugin is reviewed by hand. |
| `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` | Claude Code | Self-hosted, directory by review | Committing `marketplace.json` lets anyone install with `/plugin marketplace add owner/repo`. Anthropic's plugin directory is a separate, reviewed submission. |
| `SKILL.md` | skills.sh | Automatic, from installs | Skills appear on the leaderboard through anonymous install telemetry when people run `npx skills add owner/repo`. There's no submit step and no file that lists you. |
| `SKILL.md` | ClawHub | Manual publish | `clawhub skill publish <path>`. Read the security caveat in `directory-list.md` first. |
| repo URL | MCP Market | Submit + review | Submit the GitHub repo; free queue is weeks, paid fast track is faster. |

## What the Official MCP Registry Seeds

The registry's docs say aggregators pull from its API, so publishing there first can save separate submissions. Check each one rather than assuming:

- **PulseMCP** says it picks up registry servers automatically, but its directory was paused when this was checked.
- **GitHub's MCP Registry** (github.com/mcp) was announced as showing registry servers automatically. Confirm your server appears before skipping any other step.

## Checks Before Publishing

- Every manifest uses the same display name, description, and URL as the listing kit. Registry identifiers are separate: `server.json` `name` must be a namespaced ID such as `io.github.yourname/your-server`, not the brand name.
- Descriptions fit each limit exactly. Registries reject an over-length field at publish time.
- For registries that index a GitHub repo (Glama, the Gemini gallery, MCP Market, plugin marketplaces), the repo is public and has a license file and a README that says what it does and how to install it. A closed-source remote MCP server can still publish to the Official MCP Registry with endpoint metadata only.
- Versions match across manifests (`package.json`, `server.json`, plugin manifests) for the release you're publishing. Official MCP Registry versions can't be changed once published.

## Sources

- [Official MCP Registry server.json schema](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/server-json/draft/server.schema.json) and [registry overview](https://modelcontextprotocol.io/registry/about.md)
- [What is glama.json](https://glama.ai/blog/2025-07-08-what-is-glamajson)
- [Releasing Gemini CLI extensions](https://geminicli.com/docs/extensions/releasing/)
- [Cursor plugins](https://cursor.com/docs/plugins)
- [Publishing Claude Code plugins](https://code.claude.com/docs/en/plugins/publish.md)
- [skills.sh FAQ](https://skills.sh/docs/faq)
- [ClawHub](https://github.com/openclaw/clawhub) and [MCP Market submit](https://mcpmarket.com/submit)
