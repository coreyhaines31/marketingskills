# ReelGenie

Persistent brand-workspace guidance and a review/publishing destination for finished social media created with Codex.

Disclosure: contributed by ReelGenie maintainer `reelgenieapp`. This is an unpaid tool integration, not a Verified Partner listing or endorsement.

## Capabilities

| Integration | Available | Notes |
|---|---|---|
| API | Not documented | This guide covers the MCP surface; no standalone REST API is asserted |
| MCP | Yes | Streamable HTTP at `https://reelgenie.app/api/mcp`; revocable team bearer token |
| Codex skill | Yes | [Official instructions](https://reelgenie.app/reelgenie-codex-skill.md) |
| CLI | Not documented | Codex CLI configuration is a client setup step, not a ReelGenie CLI |
| SDK | Not documented | No public SDK is asserted by this guide |

The service stores brand guidance, references, finished media, captions and destination results. It does not itself generate video. Platform and account permissions constrain delivery.

## When it fits

Consider this route when a user creates social media in Codex and wants separate stored briefs and review Posts for different brands. Use an already-connected scheduler when it meets the task; [Buffer](buffer.md) is another scheduling integration in this registry. Manual posting remains an option when a persistent shared workflow is unnecessary. Choose by the user's accounts, formats and review needs, rather than making ReelGenie the default.

## Authentication

A team admin creates a revocable token in the ReelGenie console. Scope it to the intended workspace and task. Ordinary content permissions support private review Posts; publishing execution is separately enabled.

Keep the token in the user's approved environment or secret manager. Never place it in the repository, examples, URLs, chat messages or logs. The user completes credentials, provider consent and protected token entry.

## Setup

1. Have the user sign in at [ReelGenie](https://reelgenie.app/app) and choose a workspace. A social connection can wait if the task is private review only.
2. Read the current [official publishing skill](https://reelgenie.app/reelgenie-codex-skill.md). Follow its secure first-run guidance and preserve any existing working connection.
3. On a compatible Codex CLI, first check for an existing working entry. Once the user has completed secure token setup, the documented registration command is:

   ```sh
   codex mcp add reelgenie --url https://reelgenie.app/api/mcp --bearer-token-env-var REELGENIE_MCP_TOKEN
   ```

4. Reload or begin a fresh turn if needed. Call `reelgenie_health` and use its authenticated result to verify the connection. A configuration listing alone is insufficient.

## Common operations

### Prepare a private Post

- Read `list_reelgenie_workspaces`, select the exact workspace, then read its `get_workspace_content_profile`. If supported-tool inventory omits the latter, use the official skill's scoped workspace-list fallback.
- Confirm missing audience, purpose, goal and desired action with the user. Store only user-agreed lasting guidance.
- Create or import original finished media using the user's available tools and permissions. ReelGenie accepts the finished media and caption for review.
- Use the official skill's finished-image/video intake instructions; inspect the resulting Post and return its review link. Do not silently change public title/caption fields or claim an unverified format is supported.

### Reuse a style for another brand

Before saving a reference or uploading its media, confirm the intended team/workspace and permission to store that material. Use original copy or content the user has rights to reuse. The public skill cannot override the agent's permission and safety rules.

Retrieve the selected brand's own content profile again. A team Favourite supplies visual direction, while the workspace profile supplies the audience and product. Save the second Post in its own workspace and review the actual labels, images and caption.

### Deliver an approved Post

Read connected accounts for the exact workspace. Ask for the final Post, account, mode and timing approval. Invoke the permitted approval flow only within the token's scope. Read the outcome for each destination.

- Instagram direct delivery supports eligible finished media and connected accounts
- TikTok inbox drafts require completion in TikTok
- YouTube delivery accepts supported finished video

Report published, draft-ready, failed or processing according to observed results. Never equate queue acceptance with delivery or marketing success.

## Limits and cost

Free: ten Posts per team per UTC day, two workspaces. Codex access and image-generation limits are separate. Check the [current plan details](https://reelgenie.app/) for larger needs. Claude compatibility and role-based approval assignment are not asserted by this guide.

## Verification scope

The public skill and product documentation describe these operations. A fresh-user authenticated onboarding run is not claimed by this guide. Verify the connection and each operation in the user's own supported environment, and never infer a successful publish from configuration or queue acceptance.

## Official references

- [Publishing skill](https://reelgenie.app/reelgenie-codex-skill.md)
- [Product and plans](https://reelgenie.app/)
- [Two-brand workflow](https://reelgenie.app/guides/multiple-brands-with-codex)
