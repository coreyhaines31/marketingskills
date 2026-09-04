---
name: ntwx-reflector-sales
description: "ML-NIGHTWORX Reflector sales funnel (Category 01). Use for AU white-label AI commerce outreach, discovery, audit, decision-maker one-pagers, demos, and 48h close — NOT generic cold email. Enforces Reflector 6-phase sequencing and Porter Differentiation Focus. Triggers: 'Reflector prospect', 'AU retail AI commerce', 'Reflector outreach', 'Phase 2 discovery', 'Reflector audit', '48 hour launch sales', 'DOME pitch' (legacy name). Always use instead of raw cold-email or sales-enablement for Reflector."
metadata:
  version: 1.0.0
  author: ML-NIGHTWORX
  archetype: GENE
  engine: reflector
---

# NTWX Reflector Sales (6-Phase Funnel)

**Authority:** `references/ntwx/reflector-sequencing-rules.md`  
**Sales OS:** https://reflector.ml-nightworx.io  
**Context:** Run `ntwx-product-marketing` first; Engine A only

## Non-negotiable (enforce before every output)

1. Never send audit cold — discovery first  
2. Never show tech before gap acknowledged — Phase 3 before Phase 5  
3. Never lead with price — value → moat → ROI → price  

## Phase → action → upstream delegate

### Phase 1 — Target (ATLAS + GENE, internal)

- Qualify IN/OUT per `reflector-sequencing-rules.md`
- Delegate list building to upstream `prospecting` + `competitor-profiling`
- Output: prospect row (name, company, phase=1, observation note)

### Phase 2 — Discovery (CEDAR + GENE)

Run compatibility pre-check via `ntwx-compatibility-score` if enough context.

**Send this email** (adapt `[Name]`, `[Company]`, `[observation]`):

```
Subject: Quick question about [Company]'s commerce stack

Hi [Name],

I've been looking at [Company]'s setup and noticed [specific observation — e.g., keyword-based search, not AI-powered discovery].

I help AU retailers launch AI commerce in 48 hours. Fixed-price. $499/mo + 5% of revenue. You own your data.

6 quick questions to see if there's a fit:
1. Are you investing in any AI tools? (Even ChatGPT counts)
2. What's been your experience with AI so far — good, bad, or too early to tell?
3. Any regulations we should design around?
4. How comfortable are you with data flowing through third-party AI models?
5. If you could wave a magic wand and AI solved one problem in 90 days — what would it be?
6. Where do you think AI could make the most immediate visible difference?

Two minutes to answer. Or 15-minute call — your choice.

— [Your name]
ML-NIGHTWORX | Reflector

P.S. Everything stays between us. Sovereign data environment — your data, your infrastructure, your control.
```

**Magic-wand rule:** Q5 answer = pitch axis for Phases 4–5.

### Phase 3 — Audit (SIENNA + GENE)

Pre-filled draft — "please correct" psychology. Three findings: technical gap, compliance gap, analytics gap.

Delegate polish to upstream `copy-editing` only; do not change sequencing.

### Phase 4 — Decision-maker (GENE)

Forwardable one-pager structure:

- THE OPPORTUNITY (1 sentence — magic-wand answer)
- WHAT I FOUND (3 bullets)
- WHY Reflector (3 moats only — not all 8)
- INVESTMENT & RETURN (price only here — after value)
- DATA SOVEREIGNTY bullets
- NEXT STEP: 15-min call

Delegate structure to upstream `sales-enablement`; override with this template.

### Phase 5 — Solution (GENE + PROMETHEUS)

10-min demo script:

1. Intake form (2 min)
2. provision-partner.sh --dry-run (2 min)
3. RAG accuracy report >90% (2 min)
4. ASTROX pre-flight (1 min)
5. Sovereign data room (2 min)

**Gate:** Only if Phases 2–3 complete and decision-maker engaged.  
**Checklist skill:** run `reflector-astrox` (ERIS lead; CEDAR RAG; SIENNA white-label; PROMETHEUS provision).  
**Swarm router:** `ntwx-7arch-router`.

### Phase 6 — Close (GENE + PROMETHEUS)

48h operational handoff timeline from Reflector cockpit. Not a pitch — handoff.

Use close frame from `reflector-sequencing-rules.md`.  
**Go-live:** `reflector-astrox` must report `GO-LIVE: ALLOWED` before promising live.

## Disqualification

If `ntwx-compatibility-score` returns 2+ Red → stop. Suggest Nosto/Klevu if price-only fit.

## Commander HALT

- Custom pricing or GMV share changes
- Non-AU deployment promises
- Named client case studies

## Related skills

- `ntwx-7arch-router`, `reflector-astrox`, `ntwx-compatibility-score`, `ntwx-product-marketing`
- Upstream: `prospecting`, `cold-email`, `sales-enablement`, `revops` (internal delegate only)
