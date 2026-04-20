---
name: analytics-sdk-setup
description: Use this skill whenever a user wants a coding agent to audit, install, reconcile, align, or fix TikTok Pixel and/or Meta Pixel code in a real repo — especially for duplicate init, tracking drift, event mapping, consent/CSP/LDU/privacy gating, or unclear analytics ownership.
---

# Analytics SDK Setup

Use this skill when the user wants a coding agent to inspect, install, compare, align, reconcile, or fix TikTok Pixel and Meta Pixel tracking in a real codebase.

Activate it even when the user does not name this skill directly, as long as the real job is repo-level Pixel debugging or alignment work such as duplicate init, broken page-view behavior, tracking drift, event mapping, consent/CSP review, or source-of-truth cleanup.

This skill is for repo-aware coding agents such as Claude Code, Cursor, and similar tools. The agent must inspect the repo, find the shared bootstrap location, avoid duplicate initialization, preserve valid existing integrations, and make privacy/compliance decisions explicit before enabling sensitive tracking.

## Companion prompt

If the environment does not load `SKILL.md` directly and instead expects a single prompt block, use:
- `agent-system-prompt.md`

Use `SKILL.md` as the canonical skill specification and `agent-system-prompt.md` as the compact runtime summary.

## Example usage

Use this skill for requests like:
- "Compare TikTok and Meta tracking in this repo and tell me where they drift."
- "Fix duplicate Pixel initialization and keep TikTok and Meta aligned."
- "Add Purchase tracking for TikTok and Meta using the same business moment and shared contract."
- "Audit ownership, consent gating, and source of truth for TikTok and Meta events."

Do not use this skill when the user only wants a conceptual explanation without repo analysis or implementation.

## Core objective

This skill is not only about installing or fixing a single Pixel.

Its core objective is to help the agent manage TikTok and Meta as a dual-platform tracking system:
- verify per-platform correctness
- evaluate cross-platform consistency
- identify ownership and source of truth
- decide what should be unified
- decide what should remain platform-specific

TikTok may appear first in examples or references, but the skill scope is not TikTok-only. Any implementation, audit, or repair should consider both platforms when they are in scope.

## REQUIRED FIRST STEP

Before doing anything, you MUST:
1. classify execution mode (`Mode A`, `Mode B`, or `Mode C`)
2. output the chosen mode explicitly
3. justify the choice in 1-2 lines

DO NOT write any code before this step.

## Quick fix mode

If the user request is clearly narrow, such as fixing duplicate initialization or adding one event:
- skip full governance analysis
- focus on local correctness first
- only check cross-platform alignment if the user explicitly mentions both platforms or if the local change would obviously create drift

Use quick-fix judgment only when the scope is genuinely narrow and privacy blockers are still resolved.

Quick fix mode does not bypass the output contract. Keep required sections for the chosen mode, but you may keep non-critical governance sections brief or mark them as not applicable.

## Thinking steps (MUST follow)

1. What is the user asking?
2. Is the repo available?
3. Are blockers present?
4. Choose execution mode.
5. Then proceed.

## When to activate

Activate when the user asks for any of the following:
- install or fix TikTok Pixel or Meta Pixel
- align, reconcile, or compare TikTok and Meta event tracking
- investigate duplicate Pixel initialization, broken page-view behavior, or tracking drift
- configure event mapping, parameter mapping, deduplication, or Advanced Matching
- review CSP, LDU, consent, or PII-related constraints
- audit whether the existing analytics integration is correct
- clean up analytics ownership or source of truth in a repo
- have a coding agent such as Cursor or Claude Code directly implement or debug Pixel integration
- produce a governance or reconciliation recommendation for TikTok and Meta tracking

This should still activate when the user never says "analytics-sdk-setup" but clearly needs repo-aware Pixel inspection, repair, or alignment.

## When not to activate

Do not activate the full execution flow when the user is only asking for:
- conceptual explanation, documentation help, or terminology clarification
- high-level theoretical differences between TikTok Pixel and Meta Pixel
- marketing strategy discussions that do not involve a codebase
- analytics analysis work rather than SDK or Pixel integration and repair

If the user only wants explanation, answer directly instead of running this full skill workflow.

## Cross-platform decision frame

When TikTok and Meta are both in scope, always evaluate the work through these four lenses:

1. `Per-platform correctness`
   - Is each platform installed correctly, initialized once, and emitting events at the right business moment?

2. `Cross-platform consistency`
   - Do both platforms represent the same business action with compatible timing and core semantics?

3. `Ownership and source of truth`
   - Which file, module, wrapper, provider, or tag manager owns bootstrap, event mapping, privacy gating, and parameter contracts?

4. `Governance over local fixes`
   - Will a local repair improve the overall dual-platform system, or will it increase drift between TikTok and Meta?

When a local fix would make dual-platform governance worse, prefer a plan or governance recommendation over a narrow patch.

## Execution mode decision

Before proposing code changes, choose exactly one execution mode.

### Mode A: Direct implementation

Use direct implementation only when all of the following are true:
- The repo is available and the target app or site is identifiable.
- A shared bootstrap location or existing analytics abstraction can be located.
- The platform scope is clear: TikTok, Meta, or both.
- Pixel ID(s) are already provided or a trustworthy config source already exists in the repo.
- The intended environment, domain, page scope, or route scope is clear enough to implement safely.
- The requested work is concrete, such as install bootstrap, fix duplicate init, or add a specific event.
- No unresolved privacy blocker would force the agent to guess consent, LDU, or PII behavior.

### Mode B: Plan first

Use plan-first when the codebase is available but the work is still design-heavy, such as:
- The shared render path is not obvious.
- The repo contains multiple apps, brands, domains, or possible integration points.
- The user wants broad TikTok/Meta event alignment rather than one specific fix.
- The agent first needs to map business actions to events before editing code.
- The current integration mixes wrappers, providers, inline snippets, or tag-manager ownership that needs review first.
- The main task is comparison, governance review, or reconciliation rather than a narrow implementation.

You MUST NOT modify code or propose patches in this mode.

### Mode C: Questions first

Ask the minimum number of high-impact questions first when any blocker is present, including:
- Pixel ID is missing and no reliable config source exists in the repo.
- Consent, LDU, or PII / Advanced Matching requirements are unknown and would change implementation behavior.
- The target app, environment, route scope, or rollout scope is not clear.
- Existing analytics provider or tag-manager ownership is unclear.
- The user asks to align events, but the underlying business semantics are still ambiguous.

You MUST NOT propose implementation or code in this mode.

When in doubt, prefer:
1. audit over implementation,
2. plan over broad refactor,
3. preserving existing privacy behavior over enabling new tracking,
4. minimal bootstrap fixes over speculative event expansion.

## Required inputs and blocking conditions

Collect or confirm these inputs before substantial changes.

### Required for direct implementation
- Which platforms are in scope: TikTok, Meta, or both
- Pixel ID(s) or an existing trusted config source
- Target app, domains, pages, or route groups
- Target environments: production only, staging too, or all environments
- Whether the Pixel loads globally or only on selected pages
- Which concrete business events need to be tracked, if the request includes event work

### Blocking conditions

Do not directly implement sensitive or ambiguous behavior if any of the following is unresolved:
- Whether CSP is enabled and whether tracking changes require CSP updates
- Whether consent gating exists or should gate load vs event dispatch
- Whether LDU rules apply, and whether they are pixel-wide or event-specific
- Whether Advanced Matching / PII is allowed
- Whether there is a single shared bootstrap location
- Whether an existing GTM / analytics provider / wrapper already owns the integration
- Whether TikTok and Meta should share one business-event contract or intentionally diverge for part of the flow

If a blocker exists, switch to plan-first or questions-first instead of guessing.

## Safe defaults and conservative behavior

When information is incomplete, use these defaults:
- Do not invent Pixel IDs, event semantics, consent rules, CSP allowlists, LDU policies, or PII sources.
- Do not enable Advanced Matching / PII by default.
- Do not enable LDU unless the rule is explicit.
- If event scope is unclear, limit the work to bootstrap placement, duplicate audit, or a plan.
- If environment scope is unclear, prefer existing env gating in the repo instead of inventing a new policy.
- If the repo already has analytics config, privacy utilities, or wrappers, reuse them instead of bypassing them.
- If page-view semantics are unclear in an SPA, do not add route-change tracking speculatively.
- Keep privacy-sensitive behavior disabled until explicitly approved.
- Do not force symmetry when a platform-specific difference is intentional or required.

## Repo inspection workflow

Always inspect the existing code before adding or moving SDK code.

Follow this order:
1. Identify the target app, site, or package the user actually wants tracked.
2. Determine how pages are produced: shared HTML template, SSR layout, SPA shell, Next.js layout, or existing analytics provider.
3. Locate the best shared bootstrap location.
4. Search for existing TikTok and Meta initialization.
5. Search for existing event dispatch, helper wrappers, route-change hooks, and tag-manager bridges.
6. Identify ownership and source of truth for:
   - bootstrap placement
   - event taxonomy
   - parameter contract
   - consent or privacy gating
   - tag-manager vs app-code boundaries
7. Classify the governance state as one of:
   - `single-platform only`
   - `dual-platform but ungoverned`
   - `platform-correct but cross-platform drifted`
   - `aligned with intentional platform-specific differences`
   - `privacy/governance blocked`
8. Record engineering tags where relevant, such as:
   - duplicate initialization
   - event-only mismatch
   - privacy / gating mismatch
   - wrapper conflict
   - CSP blocked
9. Choose the execution mode again if the repo evidence changes the initial judgment.

## Duplicate detection protocol

Before changing anything, inspect both direct calls and wrapped integrations.

### Search for direct init and page-view calls
- TikTok bootstrap: `ttq.load(`
- TikTok base page view: `ttq.page(`
- Meta bootstrap: `fbq('init'`
- Meta page view: `fbq('track', 'PageView'`

### Also inspect wrapper-level ownership
Check for:
- analytics provider components
- helper functions that wrap `ttq` or `fbq`
- tag-manager bridges
- root layout or app-shell script injection helpers
- route-change hooks that may duplicate page-view behavior

### Treat these as duplicate-risk scenarios
- The same platform is initialized from multiple layouts, templates, or app shells.
- Base page-view tracking is emitted both by bootstrap and SPA route hooks without clear intent.
- A component-level mount or click handler also initializes the SDK.
- Inline snippets coexist with a higher-level provider or GTM-managed integration.

### Consolidation rule
If duplicate initialization is found and ownership is clear:
1. Keep one initialization in the best shared location.
2. Remove the other init/load calls.
3. Preserve valid event tracking unless it is also incorrect.
4. Reuse or centralize existing config only when it reduces duplication without creating a broader refactor.

If ownership is not clear, do not auto-merge competing integrations. Switch to plan-first or questions-first.

## Implementation workflow

Use this workflow only in direct-implementation mode.

1. Keep or create exactly one shared bootstrap location per platform.
2. Prefer an existing global layout, base template, app shell, or analytics provider over scattered snippets.
3. Reuse existing config, environment flags, consent utilities, and privacy wrappers when available.
4. Fix duplicate initialization before expanding event code.
5. Define or preserve a shared business-event contract before mapping into TikTok and Meta specifics.
6. Add or normalize event calls only at the real business success point.
7. Align TikTok and Meta payloads only where the same business action is clearly intended on both platforms.
8. Keep changes minimal, localized, and related only to tracking.
9. Prefer fixing broken event calls over re-installing the SDK.

Do not:
- initialize inside UI components, click handlers, or repeated page scripts
- add a second init/load call just because tracking is broken elsewhere
- replace a compliant wrapper with a raw snippet unless clearly necessary
- do broad refactors unrelated to tracking
- claim that dual-platform governance is complete just because one platform is locally correct

For detailed bootstrap placement, event naming, mapping, payload examples, and verification guidance, consult `references/install-and-events.md` before implementing event-related changes.

## Plan-only workflow

Use this workflow when the repo is available but implementation should not start yet.

Produce a concise implementation-ready report with:
- confirmed platform scope
- likely shared bootstrap location(s)
- current state by platform
- governance state
- duplicate-init findings
- existing privacy / consent / CSP constraints
- draft event mapping by business action
- exact blockers and the recommended next step

Prefer a plan over direct edits when the main task is still architecture, scope selection, event design, or cross-platform governance.

## Ownership and source of truth

When TikTok and Meta are both in scope, identify and report:
- where bootstrap ownership lives
- where event taxonomy is defined
- where mapping rules are defined
- where privacy gates are enforced
- whether GTM, app code, wrappers, or backend logic own different parts of the system

If ownership is split, the plan or implementation report should say whether that split is intentional, temporary, or the source of current drift.

## Privacy and compliance guardrails

Before enabling sensitive behavior, explicitly inspect privacy constraints.

- Reuse the project's existing consent and privacy utilities when they exist.
- Do not invent CSP allowlists.
- Do not invent LDU logic or region rules.
- Do not enable Advanced Matching / PII without explicit approval and a legitimate first-party data source.
- Do not bypass existing legal, consent, or regional review flows.
- If the implementation would change sensitive behavior and the policy is unclear, stop and ask.
- If TikTok and Meta are both in scope, review whether the same shared privacy policy should control both platforms.

For CSP, consent gating, LDU, identifier handling, and shared privacy governance details, consult `references/privacy-and-csp.md` before implementing those changes.

## Output contract

Use one of the following result structures.

### If you are in questions-first mode

```markdown
# Analytics SDK questions

## What blocks implementation
- ...

## Decisions that affect both TikTok and Meta
- ...

## Required answers
1. ...
2. ...
3. ...

## Safe progress so far
- ...
```

Ask the minimum number of high-impact questions. Do not dump the full input checklist if only 2-3 answers are blocking progress.

### If you are in plan-first mode

```markdown
# Analytics SDK setup plan

## What I confirmed
- Platforms:
- Framework / render path:
- Intended environments:
- Tracking scope:
- Current state by platform:
- Governance state:

## TikTok vs Meta gaps
- ...

## What to unify
- ...

## What remains platform-specific
- ...

## Ownership / source of truth
- ...

## Blockers or missing decisions
- Pixel ID(s):
- CSP status:
- Consent gating:
- LDU rule:
- PII / Advanced Matching:
- Event list:

## Governance recommendation
- ...

## Recommended next step
- ...
```

### If you are in direct-implementation mode

```markdown
# Analytics SDK implementation

## Bootstrap location
- file/path
- why this is the shared render point

## Current state by platform
- TikTok:
- Meta:

## Cross-platform decisions
- ...

## What was unified
- ...

## Intentional platform-specific differences
- ...

## Ownership / source of truth
- ...

## Privacy / compliance decisions
- CSP:
- Consent gating:
- LDU:
- Advanced Matching:

## Event mapping implemented
- business action -> TikTok event -> Meta event -> code location

## TikTok vs Meta gaps that remain
- ...

## Verification
- per-platform correctness holds
- cross-platform consistency is improved or explicitly bounded
- bootstrap initializes once per platform
- target events fire once at the correct business moment
- privacy gates behave as intended
```

## Reference routing

If the task involves:
- bootstrap placement, event payloads, event mapping, or platform-specific implementation details → read `references/install-and-events.md`
- CSP, consent behavior, LDU, Advanced Matching / PII, or shared-vs-platform-specific privacy rules → read `references/privacy-and-csp.md`

Keep vendor snippets, payload examples, and low-level policy details in references, not in this main skill file.

## Pre-implementation gate

Before writing code, confirm all of the following:
- The target app or site is identified.
- A shared render path or existing analytics abstraction is identified.
- Current state by platform is classified.
- Governance state is classified.
- Any duplicate-init ownership is understood well enough to modify safely.
- Blocking privacy questions are resolved or the work is constrained to a safe non-sensitive subset.
- The chosen execution mode is still correct.

If any item fails, do not proceed with broad implementation.

## Post-implementation verification

Before finishing, verify two layers of success.

### Per-platform correctness
- Each platform is initialized at most once.
- Initialization lives in a global/shared location.
- No init/load calls remain in components or click handlers unless intentionally wrapped and justified.
- Page-view behavior is present only where expected and does not duplicate.
- Purchase and other commerce events include required fields such as `currency` and `value` when applicable.
- Privacy gates behave as intended and were not bypassed.

### Cross-platform consistency
- Event names and key parameters are aligned across TikTok and Meta only where business semantics match.
- Differences that remain are intentional and documented.
- Ownership and source of truth are preserved or clarified.
- The implementation matches the relevant reference files where applicable.
