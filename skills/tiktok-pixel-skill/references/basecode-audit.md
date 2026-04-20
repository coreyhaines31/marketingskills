# Audit: Base Code Audit

## Purpose
Check whether TikTok Pixel Base Code is present, correctly initialized, and able to support the target page or flow.

This audit is mandatory for page-level TikTok Pixel implementation tasks.

This audit is not limited to diagnosis.  
If Base Code is missing, incomplete, misplaced, duplicated, or too weak to support reliable event tracking, this audit should also determine whether the implementation must be repaired, supplemented, or replaced with the canonical Base Code template.

## Source of Truth
Use the following resources as the source of truth:

- `references/tt-guide.md`
  - Use for Base Code initialization expectations, `ttq.load(...)`, `ttq.page()`, and general page coverage expectations.

- `references/basecode-template.md`
  - Use as the canonical Base Code template source when Base Code is missing, broken, incomplete, or unsuitable for reuse.

## Main Questions
Answer the following:

1. Does TikTok Base Code appear to exist?
2. Is initialization likely placed in a globally effective location?
3. Is the target page or flow actually covered by that initialization?
4. Is `ttq.page()` present or otherwise handled in a valid page-view strategy?
5. Are there risks such as duplicate initialization, partial initialization, page-specific gaps, or weak placement?
6. If Base Code is missing or unreliable, should the current implementation be reused, repaired, supplemented, or replaced with the canonical template?
7. If a canonical template must be used, is the required `pixel_code` already known?

## What to Search
Use repository evidence to search for:
- `ttq`
- `ttq.load`
- `ttq.page`
- `TiktokAnalyticsObject`
- shared layout files
- root application files
- global head injection points
- analytics bootstrap code
- tag manager wrappers
- global script managers

Also search for:
- shared script injection utilities
- analytics bootstrap layers
- application shell files
- route shell files
- existing marketing or analytics initialization code

These searches should determine not only whether TikTok code exists somewhere, but whether it is initialized in a way that actually supports the target page or flow.

## Evaluation Framework

### A. Presence
Determine whether TikTok Base Code exists at all.

Possible outcomes:
- clearly present,
- partially present,
- present but fragmented,
- absent.

Do not treat event-only snippets as complete Base Code.

### B. Global Placement
Check whether the code is initialized in a location that is likely to run for the relevant page or flow.

Examples of strong placement:
- shared root layout,
- app shell,
- global analytics loader,
- universal head injection layer.

Examples of weak placement:
- isolated page component,
- campaign-specific fragment,
- test-only path,
- code path that only runs after user interaction.

### C. Coverage of the Target Page or Flow
Even if Base Code exists, determine whether it covers the page or flow the user cares about.

Examples of weak coverage:
- Base Code only exists on a different route family,
- Base Code is gated behind conditions not met on the target page,
- implementation only exists in an embedded checkout or one branch of the flow,
- code is mounted too late to support the target event cleanly.

### D. Base Code Quality
Check whether the implementation appears structurally sound.

Look for:
- valid bootstrap pattern,
- correct load/init sequence,
- no obvious duplication,
- no obviously broken wrappers,
- reusable initialization instead of scattered one-off injections.

If the code is highly fragmented or duplicated, do not automatically preserve it.

### E. PageView Handling
Determine whether page-view handling appears valid for the application type.

For traditional multi-page apps:
- `ttq.page()` should usually fire on page load.

For client-side routed apps:
- route transitions may need explicit handling.
- do not assume a single initial page call is enough for all route changes.

If Base Code exists but page-view handling is weak, call this out as a Base Code support problem rather than only an event problem.

### F. Duplicate or Broken Initialization
Check for:
- multiple `ttq.load(...)` calls for the same Pixel,
- repeated bootstrap insertion,
- multiple wrappers competing to initialize the same instance,
- initialization after important user events rather than before them.

If duplication or broken initialization is found, determine whether:
- a local repair is enough,
- the current implementation should be consolidated,
- or the canonical template should replace fragmented initialization patterns.

### G. Template Escalation Decision
If Base Code is missing, clearly broken, weakly placed, or not globally reusable, explicitly decide one of the following:

- **Reuse current Base Code**
- **Repair current Base Code**
- **Supplement current Base Code**
- **Replace with canonical Base Code template**

When replacement or supplementation is recommended, retrieve the canonical template from:
- `references/basecode-template.md`

If the required `pixel_code` is not already known from the repository, current task context, or prior confirmed user input, ask the user for the TikTok Pixel code before generating the final installable Base Code.

Do not leave the template variable unresolved in the final implementation output.

Do not invent or paraphrase a Base Code snippet when a canonical template resource is available.

## Output Requirements
Summarize findings as:

- **Presence**
- **Scope**
- **Coverage**
- **PageView handling**
- **Risks**
- **Template escalation decision**
- **Pixel code availability**
- **Impact on the target event implementation**

If Base Code is missing or unreliable, also include:
- **recommended insertion location**
- **whether the canonical Base Code template should be used**
- **whether user input is required for `pixel_code`**

## Confidence Labels
Mark conclusions as:
- Confirmed
- Likely
- Needs verification

## Important Rules
- Do not assume Base Code is correct just because `ttq.track(...)` appears somewhere.
- Do not assume global coverage if initialization is only visible in a page or component file.
- Do not treat route-based SPAs as fully covered unless page-view behavior is explicitly considered.
- If Base Code appears weak or partial, call this out before recommending event-level changes.
- If Base Code is missing or not trustworthy, prefer retrieving the canonical Base Code template over improvising a custom bootstrap snippet.
- Do not keep fragmented or low-quality initialization patterns just because some TikTok code already exists.
- If the final code requires `pixel_code` and that value is not known, ask for it before outputting an installable Base Code patch.
