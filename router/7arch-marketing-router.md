# 7ARCH Marketing Router — ML-NIGHTWORX

**Status:** Commander-canonical  
**Machine-readable:** `7arch-marketing-router.json`  
**Upstream craft skills:** Fork of [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills)

## Purpose

HERMES-style routing for **GTM tasks** (acquisition, retention, content, AEO) — separate from:
- InfraDOME dev router (`infradome/router/7arch_router.json`)
- Studio/Reflector **swarm** router (`router/7arch-studio-router.json` · skill `ntwx-7arch-router`)

## Read first (every marketing task)

1. `.agents/product-marketing.md` (Commander-owned in consuming repo)
2. `references/ntwx/commander-gates.md`
3. `references/ntwx/archetype-skill-matrix.md`
4. `router/7arch-studio-router.json` (name a locked swarm player)

## Engines

| Engine | Categories | Entry skill | Surface |
|---|---|---|---|
| Reflector | 01 | `ntwx-reflector-sales` | reflector.ml-nightworx.io |
| Studio | 02–11 | `ntwx-studio-engagement` | aaas.ml-nightworx.io |

## Route table

| Task | Skill | Archetype | Notes |
|---|---|---|---|
| New NTWX marketing task | `ntwx-product-marketing` | Commander | Always first |
| Swarm lane assignment | `ntwx-7arch-router` | Commander | Locked roster |
| ASTROX / go-live gate | `reflector-astrox` | ERIS | RAG≥90% + white-label |
| Reflector funnel | `ntwx-reflector-sales` | GENE | Phases 1–6 |
| Studio / aaas enquiry | `ntwx-studio-engagement` | JORDI | Block 0 required |
| Discovery brief | `ntwx-block0-discovery` | ATLAS | Pre-sale |
| Qualification | `ntwx-compatibility-score` | CEDAR | 2+ Red → stop |
| Content flywheel | `ntwx-content-flywheel` | CEDAR | 1 YT → 6 pieces |
| AEO / llms.txt | `ntwx-aeo-governance` | PROMETHEUS | All live surfaces |
| Competitive intel | `competitor-profiling` | ATLAS | Via wrapper context |
| Pricing | `pricing` | JORDI | **Commander HALT** |

## Non-negotiable (Reflector)

See `references/ntwx/reflector-sequencing-rules.md`:

1. Never audit cold  
2. Never tech before gap acknowledged  
3. Never lead with price  

## Installing in a consuming repo

```bash
git submodule add https://github.com/GIT-access-ntwx/marketingskills.git .agents/marketingskills
cp .agents/marketingskills/templates/product-marketing-ntwx.md .agents/product-marketing.md
# Edit .agents/product-marketing.md — Commander review required
```

Symlink NTWX skills into Cursor `.cursor/skills/` as documented in README.
