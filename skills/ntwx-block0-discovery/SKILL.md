---
name: ntwx-block0-discovery
description: "ML-NIGHTWORX Block 0 discovery brief for studio engagements and complex sales. Use when scoping aaas builds, agent authority limits, integrations, or pre-quote discovery. Triggers: 'Block 0', 'discovery brief', 'scope brief', 'agent authority limits scoping', 'pre-quote discovery', 'engagement brief'. Required before formal studio quotes."
metadata:
  version: 1.0.0
  author: ML-NIGHTWORX
  archetype: ATLAS
---

# NTWX Block 0 Discovery Brief

**Aligned to:** aaas.ml-nightworx.io delivery model  
**Output:** Structured brief for Commander review and PROMETHEUS handoff

## When to run

- Any Studio (Cat 02–11) enquiry before formal quote
- Complex Reflector exception (custom GMV/integration) before scope change
- Internal new build in agentic-moat / infradome

## Brief fields

Capture all; HALT if category or primary outcome unknown:

| Field | Question |
|---|---|
| **Category (01–11)** | Which aaas category? If 01, confirm Reflector vs custom platform |
| **Primary outcome** | Magic-wand: one problem solved in 90 days |
| **Company & segment** | Industry, size, geography |
| **Decision velocity** | Fast / medium / slow |
| **Live surface interest** | Which demo/pattern from catalogue |
| **Integration depth** | APIs, payments, exchanges, CRM, data sources |
| **Agent authority limits** | What agents may/may not do autonomously |
| **Human-in-the-loop gates** | Required approval points |
| **Model / compute routing** | Single model vs ADE-F.T multi-lane |
| **Security / firewall** | Constraints, compliance regimes (APP, defence, etc.) |
| **Data sovereignty** | AU-only vs multi-region |
| **Commercial architecture** | Build fee, retainer, rev-share, licensing |
| **Timeline** | Target go-live |
| **Success metric** | How they measure ROI at 90 days |

## Output format

```markdown
# Block 0 Brief — [Company] — [Category NN]

**Date:** YYYY-MM-DD  
**Status:** [PROVISIONAL] — Commander review required  
**Engine:** A Reflector | B Studio  
**Lead archetype (delivery):** [from eleven-categories.md]

## Outcome
...

## Scope shape
- Pattern base: [catalogue item]
- Last mile: [custom list]

## Governance
- Authority limits: ...
- Approval gates: ...

## Commercial (indicative)
- Band: ... (from catalogue)
- Commander quote: HALT required

## Risks / HALTs
...
```

## Handoff

- Sales: → `ntwx-studio-engagement` or `ntwx-reflector-sales`  
- Delivery: → PROMETHEUS (build) with PETA/ERIS review triggers flagged  
- Update `.agents/product-marketing.md` Changelog if positioning shifts

## Related skills

- `ntwx-product-marketing`, `ntwx-compatibility-score`, `ntwx-studio-engagement`
