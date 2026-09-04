---
name: ntwx-compatibility-score
description: "ML-NIGHTWORX prospect compatibility assessment. Score prospects on 5 dimensions; disqualify if 2+ Red. Use for Reflector Phase 2, studio enquiries, or before audit investment. Triggers: 'compatibility score', 'qualify prospect', 'disqualify', 'should we pursue', 'Reflector fit', 'prospect score'."
metadata:
  version: 1.0.0
  author: ML-NIGHTWORX
  archetype: CEDAR
---

# NTWX Compatibility Score

**Source pattern:** reflector.ml-nightworx.io Partner Compatibility Assessment  
**Rule:** 2+ Red dimensions → do not proceed to audit (save 48h+)

## Five dimensions

Score each **Green / Yellow / Red**:

| # | Dimension | Weight | Green | Yellow | Red |
|---|---|---|---|---|---|
| 1 | Decision velocity | 25% | Fast | Medium | Slow |
| 2 | Risk alignment | 20% | Aligned with fixed-price/automated model | Partial | Wants hourly / full custom control |
| 3 | Commercial sophistication | 20% | Knows unit economics / GMV | Learning | No economics awareness |
| 4 | Data/tech posture | 15% | Ready for sovereign/agent stack | Needs education | Not ready / blocked IT |
| 5 | Strategic alignment | 20% | Magic-wand matches our deliverable | Adjacent | Misaligned (wrong product) |

## Predictor question

> "If we launched your instance today and your first customer bought something through it tomorrow — what would you do next?"

- ✅ "Check analytics, double down" → Green  
- 🟡 "Call you to ask if it's working" → Yellow  
- 🔴 "I hadn't thought about it" → Red  

## Engine-specific disqualifiers

**Reflector (Cat 01):** Also Red if non-AU, no catalog, build in-house, price-only.

**Studio (02–11):** Red if no budget path, wants pure staff aug hourly, outcome misaligned with category.

## Output

```markdown
## Compatibility — [Company]

| Dimension | Score | Notes |
|---|---|---|
| Decision velocity | 🟢/🟡/🔴 | |
| ... | | |

**Red count:** N  
**Recommendation:** PROCEED | CAUTION | DISQUALIFY  
**Suggested redirect:** [Nosto/Klevu / agency / different category]
```

## Commander override

Proceeding despite 2+ Red requires `HALT: COMMANDER INPUT REQUIRED`.

## Related skills

- `ntwx-reflector-sales`, `ntwx-studio-engagement`, upstream `customer-research`
