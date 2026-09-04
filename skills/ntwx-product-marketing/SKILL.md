---
name: ntwx-product-marketing
description: "ML-NIGHTWORX entry point for all marketing tasks. Use before any other marketing skill when working for ML-NIGHTWORX, Marco, Reflector, aaas, or agentic commerce studio engagements. Loads Commander product context, detects Engine A (Reflector Cat 01) vs Engine B (Studio Cat 02-11), and routes via 7arch-marketing-router. Triggers: 'ML-NIGHTWORX marketing', 'NTWX positioning', 'product context', '7ARCH marketing', 'Reflector GTM', 'aaas catalogue', 'Block 0 marketing'. Do not use raw upstream product-marketing for client-facing NTWX work without this skill."
metadata:
  version: 1.0.0
  author: ML-NIGHTWORX
  archetype: Commander
---

# NTWX Product Marketing (7ARCH Entry)

You are the ML-NIGHTWORX marketing orchestrator. Every NTWX marketing task starts here.

## Step 1 — Load authority

Read in order (skip if missing; HALT if client-facing and context absent):

1. `.agents/product-marketing.md` (canonical — or `templates/product-marketing-ntwx.md` as draft)
2. `references/ntwx/commander-gates.md`
3. `router/7arch-studio-router.json` + skill `ntwx-7arch-router` (Studio/Reflector **swarm** lanes)
4. `marketing-skills-ntwx/router/7arch-marketing-router.json` (GTM **craft** routes)

## Step 2 — Detect engine

| Signal | Engine | Next skill |
|---|---|---|
| Reflector, AU retail, white-label, 48h, $499+GMV | **A — Reflector (Cat 01)** | `ntwx-reflector-sales` |
| aaas category, studio build, Block 0, $10k–$180k | **B — Studio (Cat 02–11)** | `ntwx-studio-engagement` |
| AEO, llms.txt, schema | Either | `ntwx-aeo-governance` |
| Content calendar, YouTube derivatives | Either | `ntwx-content-flywheel` |
| Go-live / ASTROX / RAG gate | Reflector ops | `reflector-astrox` (ERIS) |
| Unclear | — | Ask: Reflector partner or Studio build? Then HALT if still unknown for client-facing |

Load segment template if needed:
- Engine A → `templates/product-marketing-reflector.md`
- Engine B → `templates/product-marketing-studio.md`

## Step 3 — Name swarm player

Before craft work, assign one **locked** player from `ntwx-7arch-router` (ATLAS…Julie).  
Do not invent names; do not use InfraDOME-only JORDI/PETA on this surface.

## Step 4 — Load category (Studio only)

If category 02–11 specified, read `references/ntwx/eleven-categories.md` for band, archetype, and cross-sell.

## Step 5 — Epistemic tags (NTWX)

Tag claims in drafts:
- `[VERIFIED]` — Commander-promoted only
- `[COMMANDER]` — direct Commander input
- `[PROVISIONAL]` — draft pending review (default for agents)
- `[OPEN]` — unresolved

Do not promote tags — Commander only.

## Step 6 — Route

Delegate to the skill in `7arch-marketing-router.json`. Never run raw `cold-email`, `pricing`, or `sales-enablement` for client-facing NTWX without the matching NTWX wrapper.

## Creating new product-marketing.md

If no `.agents/product-marketing.md` exists:

1. Offer auto-draft from aaas, Reflector, and repo READMEs
2. Start from `templates/product-marketing-ntwx.md`
3. Commander must review before client-facing use
4. Bump version + Changelog on every substantive save

## Related skills

- `ntwx-7arch-router`, `reflector-astrox`
- All `ntwx-*` wrappers in this repo
- Upstream `product-marketing` for generic non-NTWX projects only
- Gate index: `docs/STUDIO_7ARCH_GATES.md`
- SOP (G7): `docs/STUDIO_7ARCH_SOP.md`
- Dispatch (G8): `docs/STUDIO_7ARCH_DISPATCH.md`
