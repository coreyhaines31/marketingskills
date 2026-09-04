---
name: ntwx-7arch-router
description: >-
  NTWX-Studio / Reflector Seven-Arch Model Router. Routes work across the locked
  swarm roster (ATLAS, PROMETHEUS, SIENNA, CEDAR, ERIS, GENE + Corey, Harry,
  Carrie, Julie). Use when assigning harness/loop/graph ownership, spawning
  specialised players, or deciding who owns research, provision, white-label
  audit, RAG/PMF, ASTROX/compliance, or commercial sequence. Triggers:
  '7ARCH router', 'Seven-Arch', 'swarm route', 'NTWX-7ARCH', 'who owns this
  lane', 'Studio Reflector roster'. Do not invent roster names outside the lock.
metadata:
  version: "1.2"
  author: ML-NIGHTWORX
  status: COMMANDER_CLEARED_G3_G4
  surface: studio-reflector
---

# NTWX Seven-Arch Model Router v1.2

Call name: **`ntwx-7arch-router`**

**Surface:** NTWX-Studio / Reflector swarm routing (not InfraDOME build matrix, not GTM-only marketing router).

**Machine-readable:** `router/7arch-studio-router.json`  
**Product catalog:** `data/NTWX-Studio_Reflector_Catalog.csv`  
**Roster map:** `data/NTWX_Roster_Owner_Map.csv`  
**GTM targets (ATLAS):** `data/NTWX_GTM_Target_List_InfraAEO_HawkAEO.csv`  
**Layers bind:** `docs/NTWX_Agent_Architecture_Layers_Guide.md`  
**SOP (G7):** `docs/STUDIO_7ARCH_SOP.md`  
**Dispatch (G8):** `docs/STUDIO_7ARCH_DISPATCH.md`  
**Install (G9):** `docs/STUDIO_7ARCH_INSTALL.md` · `scripts/check_studio_7arch.py`  
**Pack entry (G10):** `docs/STUDIO_7ARCH_README.md` · ATLAS queue: `docs/STUDIO_7ARCH_ATLAS_QUEUE.md`  
**Regen/Merge (G11):** `scripts/regen_atlas_queue.py` · `docs/STUDIO_7ARCH_MERGE_CHECKLIST.md`  
**Cursor rule:** `.cursor/rules/7arch-studio-router.mdc`

## Authority order

1. This skill + `router/7arch-studio-router.json` for **Studio/Reflector swarm** lanes  
2. `data/NTWX_Roster_Owner_Map.csv` — **lane role = primary owner** `[COMMANDER]`  
3. Product catalog + category leads for offer routing  
4. Architecture layers bind for harness / loop / graph  
5. `marketing-skills-ntwx/router/7arch-marketing-router.json` for **GTM craft**  
6. `infradome/router/7arch_router.json` for **InfraDOME product build** only  

Do **not** overwrite InfraDOME’s JORDI/PETA seats into this locked roster.

## Locked roster — lane role = owner `[COMMANDER]`

| Player | Primary owner / lane | Catalog lead cats |
|---|---|---|
| **ATLAS** | Research & prospect lists (Thai GTM, Infra-AEO, Hawk-AEO) | 02, 04, 08, 11 |
| **PROMETHEUS** | Provisioning & technical build | 01, 03, 06, 11 |
| **SIENNA** | White-label clean-up & audit | 04 |
| **CEDAR** | RAG accuracy & early PMF signals | 02, 05, 09, 10 |
| **ERIS** | ASTROX + technical compliance & sovereignty | 05, 06, 08 |
| **GENE** | Commercial / sales sequence | 01, 03, 09 |
| **Corey** | Brand marketing | 10 |
| **Harry** | Stripe finance & connection | — |
| **Carrie** | Compliance paperwork & ongoing monitoring | 07 |
| **Julie** | Jurisdiction | 07 |

Specialists need a catalog `primary_owner` entry only when they own a specific offer row.

## Category second seats (ex-JORDI/PETA) `[COMMANDER]`

| Cat | Leads |
|---|---|
| 03 OASIS / tokenised property | **GENE** + **PROMETHEUS** |
| 05 NTWX-7ARCH Router | **ERIS** + **CEDAR** |
| 07 LEGAL777 | **Carrie** + **Julie** |
| 08 HAWK | **ATLAS** + **ERIS** |
| 10 WITH AWARENESS | **Corey** + **CEDAR** |

## Product / GTM bind

| Rule | Detail |
|---|---|
| Lookup | `catalog_products[].id` or category `01`–`11` |
| Reflector SaaS | Cat **01** + `ntwx-reflector-sales` + `reflector-astrox` |
| Infra-AEO / Hawk-AEO targets | ATLAS → `data/NTWX_GTM_Target_List_InfraAEO_HawkAEO.csv` (`suggested_owner`) |
| Cat 05 | `05-ntwx7` → ERIS + CEDAR + this skill |

## Layer concerns `[COMMANDER]`

| Concern | Primary | Assist |
|---|---|---|
| **Harness** | PROMETHEUS | Harry |
| **Loop** | GENE | Carrie, CEDAR |
| **Graph** | ATLAS | CEDAR |
| White-label | SIENNA | — |
| ASTROX / sovereignty | ERIS | Julie, Carrie |
| Brand | Corey | — |

## Routing rules

1. **One primary owner per task.** Name the locked player; specialists assist only.  
2. **Research / lists / Thai GTM → ATLAS.** Use GTM target CSV for Infra-AEO + Hawk-AEO.  
3. **Build / provision → PROMETHEUS.** Invoke `ntwx-glass` (no `cloudflare-ntwx`).  
4. **White-label / audit → SIENNA.**  
5. **RAG / PMF → CEDAR.** Gate via `reflector-astrox`.  
6. **ASTROX / sovereignty → ERIS.**  
7. **Commercial sequence → GENE.**  
8. **Brand → Corey** after `ntwx-product-marketing`.  
9. **Stripe → Harry.** Commander HALT on commercial terms.  
10. **Paperwork / monitoring → Carrie.**  
11. **Jurisdiction → Julie.** HALT non-AU without Commander.  
12. **No JORDI / PETA** on this surface.

## Engine handoff

| Signal | Engine | Next |
|---|---|---|
| Reflector / AU white-label / 48h | A | GENE → `ntwx-reflector-sales` + `reflector-astrox` |
| aaas Cat 02–11 / Block 0 | B | ATLAS → `ntwx-block0-discovery` then GENE → `ntwx-studio-engagement` |
| Infra-AEO / Hawk-AEO outreach | GTM | ATLAS → GTM target list |
| Deploy glass / Workers / Pages | Build | PROMETHEUS → `ntwx-glass` |
| Marketing craft | GTM | Corey via `ntwx-product-marketing` |

## Subagent brief template

```text
Archetype: <LOCKED_NAME>
Lane: <primary_owner from roster>
Concern: harness | loop | graph | compliance | brand | finance | jurisdiction
Catalog/GTM:
DoD:
HALT if: missing Commander commercial/jurisdiction fact
```

## Related skills

- `reflector-astrox`, `ntwx-product-marketing`, `ntwx-reflector-sales`, `ntwx-studio-engagement`  
- `ntwx-glass` — Cloudflare Pages/Workers/Cloud Run  
- Gate index: `docs/STUDIO_7ARCH_GATES.md`  
- **Day-to-day SOP:** `docs/STUDIO_7ARCH_SOP.md` (G7) — run this for every Studio/Reflector task  
- **Dispatch pack:** `docs/STUDIO_7ARCH_DISPATCH.md` (G8) — quick card + filled stamps T1–T3
