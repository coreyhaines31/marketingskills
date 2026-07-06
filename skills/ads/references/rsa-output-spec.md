# Google RSA Output Spec

When the user requests Google Ads RSAs (Responsive Search Ads), output MUST comply with these platform limits and structural requirements. Do not output any RSA that violates them.

## Hard limits per RSA (enforce before responding)

- **Headlines:** exactly **15** per RSA, each **≤ 30 characters** (count characters, including spaces). Render as `1. ... (NN chars)` so the reader can verify.
- **Descriptions:** exactly **4** per RSA, each **≤ 90 characters**.
- **Paths:** up to 2 path fields, each **≤ 15 characters**.
- **Final URL:** present, https.
- **Pinning:** state any pinned positions explicitly. Default = unpinned unless user asks.
- **Per-account guardrail:** Google enforces **3 RSAs max per ad group**. When the user asks for >3, group them by ad group.

## Required sidecar artifacts (always include with RSA request)

1. **Ad group structure**, labeled `Ad group structure:` — list each ad group with its theme, target keywords (match types), and which RSAs map to it.
2. **Negative keyword list**, labeled `Negative keywords:` — minimum **8** entries, group-level vs campaign-level called out.
3. **Sitelinks** (≥ 4), **Callouts** (≥ 4 ≤25 chars), **Structured snippets** if relevant.

## Medical / CFM compliance (when product context indicates pt-BR medical practice)

If `.agents/product-marketing.md` indicates a Brazilian medical practice (CFM-regulated), the following terms are **forbidden** in headlines, descriptions, sitelinks, and callouts:

- Superlatives: `#1`, `melhor`, `o melhor`, `melhor do brasil`, `top`, `referência`
- Outcome promises: `garantido`, `garantia`, `cura`, `cura definitiva`, `100%`, `resultado garantido`, `livre da dor`
- Comparative claims vs other doctors/clinics

Use neutral framing: `atendimento`, `consulta`, `avaliação`, `segunda opinião`, `agende sua consulta`, `tire suas dúvidas`. Geo modifier (`Porto Alegre`, `POA`, `Zona Sul POA`) required where the prompt specifies a region.

## Output ORDER (mandatory — emit in this order to avoid truncation)

1. **Ad group structure** (short)
2. **Negative keywords** (≥8, MANDATORY — emit BEFORE RSAs so it isn't dropped if output runs long)
3. **Sitelinks** (≥4)
4. **Callouts** (≥4)
5. **RSA1, RSA2, RSA3** (largest section, last — safe to truncate gracefully)

## Output template (mandatory shape)

```
Ad group structure:
- AG1 [theme]: keywords (match types) → RSA1, RSA2
- AG2 [theme]: ...

Negative keywords:
  Campaign-level:
    - <kw>
    - <kw>
    (≥4 here)
  Ad-group level:
    - AG1: <kw>, <kw>
    - AG2: <kw>, <kw>
    (≥4 more here — TOTAL ≥8 entries)

Sitelinks (≥4):
  - <title (≤25)> | <desc1 (≤35)> | <desc2 (≤35)> | URL

Callouts (≥4, each ≤25 chars):
  - <callout>

RSA1 — [ad group name]
  Final URL: https://...
  Path1: ...   Path2: ...
  Headlines (15, each ≤30 chars):
    1. <headline> (NN chars)
    ...
    15. <headline> (NN chars)
  Descriptions (4, each ≤90 chars):
    1. <description> (NN chars)
    ...
    4. <description> (NN chars)
  Pinning: H1=none; H2=none; ...   (or explicit pins)

RSA2 — ...
RSA3 — ...
```

## Self-check before responding

Before sending the output, run this checklist mentally:

- [ ] Each RSA has exactly 15 headlines, exactly 4 descriptions.
- [ ] Every headline is ≤30 chars; every description is ≤90 chars. Character counts printed.
- [ ] Negative keyword list labeled and ≥8 entries.
- [ ] Ad group structure labeled.
- [ ] If medical (CFM): no forbidden superlative/outcome words; geo modifier present where required; language is pt-BR.

If any check fails, rewrite before responding. Do not ship partial RSAs.
