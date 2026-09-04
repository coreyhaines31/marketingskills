# NTWX 7ARCH Marketing Layer

**Version:** 1.0.0  
**Date:** 2026-08-08  
**Commander:** Marco, ML-NIGHTWORX

## What this fork adds

Upstream provides 49 generic marketing craft skills. This fork adds:

- **7 wrapper skills** enforcing 7ARCH routing, Reflector sequencing, Block 0, Commander HALTs
- **6 reference playbooks** in `references/ntwx/`
- **3 product-marketing templates** in `templates/`
- **HERMES GTM router** in `router/7arch-marketing-router.json`

## Engines

| Engine | Category | Surface | Entry skill |
|---|---|---|---|
| Reflector | 01 | reflector.ml-nightworx.io | `ntwx-reflector-sales` |
| Studio | 02–11 | aaas.ml-nightworx.io | `ntwx-studio-engagement` |

## Studio 7ARCH gates (master index in AGENTS.md)

| Gate | Title | Status |
|---|---|---|
| G0 | Discovery Inventory | DONE |
| G1 | Swarm Router Scaffold | DONE |
| G2 | Entry Wiring | DONE |
| G3 | Catalog Bind + Roster Owner + Remaps | DONE |
| G4 | Architecture Layers Bind | DONE |
| G5 | Live Smoke | DONE |
| G6 | Canonicalise & PR ready | DONE |
| G7 | Standard Operating Procedure | DONE |
| G8 | Operator Dispatch Pack | DONE |
| G9 | Install & Health Check | DONE |
| G10 | Pack README + ATLAS Priority Queue | DONE |
| G11 | Queue Regen + Merge Checklist | DONE |
| G12 | ATLAS Highest-Priority Briefs | DONE |
| G13 | ATLAS High-Priority Batch Briefs | DONE |
| G14 | Full Queue Coverage + GENE Handoff | DONE |
| G15 | Executive Status + Version Freeze | DONE |
| G16 | CI Health Workflow | DONE |
| G17 | Final Handoff | DONE |

Entry: `docs/STUDIO_7ARCH_README.md` · Handoff: `docs/STUDIO_7ARCH_HANDOFF.md` · Pack `1.1.1`

## Syncing upstream

```bash
git remote add upstream https://github.com/coreyhaines31/marketingskills.git
git fetch upstream
git merge upstream/main
# Resolve conflicts only in README/AGENTS NTWX headers if needed
# Never overwrite skills/ntwx-* or references/ntwx/
```

## Commander checklist (first install)

- [ ] Copy `product-marketing-ntwx.md` → consuming repo `.agents/product-marketing.md`
- [ ] Review and edit positioning — bump version + Changelog
- [ ] Symlink 7 NTWX skills into `.cursor/skills/`
- [ ] Confirm Reflector sequencing rules understood by operators
- [ ] Do not run formal quotes without Commander HALT clearance

## Test prompts

```
"Run ntwx-product-marketing for a Reflector AU retail prospect"
"Phase 2 discovery email for [Company] — keyword search observation"
"Block 0 brief for InfraDOME category 04 enquiry"
"Compatibility score — slow decision, wants hourly billing"
"Content flywheel from this week's Agentic Commerce YouTube script"
"Audit aaas.ml-nightworx.io llms.txt and schema"
```
