---
name: tiktok-pixel-skill
description: Use this skill when the user wants to install, validate, repair, migrate, or implement TikTok Pixel Base Code or TikTok Pixel events in a code repository, specific page, or business flow. Especially use it when the user asks to configure a TikTok event for a page, check whether an event is correctly placed, timed, or parameterized, compare existing Meta Pixel implementation with TikTok Pixel, or generate concrete code-level implementation guidance.
---

# TikTok Pixel Repository Implementation Skill

## Purpose
Use this skill for repository-level, page-level, or flow-level TikTok Pixel implementation work.

This skill is designed for tasks such as:
- installing TikTok Pixel Base Code,
- validating whether TikTok Pixel is already implemented correctly,
- checking whether a TikTok event is correctly named, parameterized, and triggered,
- reviewing whether Base Code coverage is sufficient for the target page or flow,
- scanning existing Meta Pixel implementation and determining whether it can be mapped or reused,
- producing concrete code-level TikTok Pixel implementation guidance.

This skill should not be used for generic conceptual questions about TikTok Pixel unless the user is clearly asking about implementation in code, a page, or a business flow.

This skill must not stop at high-level advice when code-level reasoning is possible.

## Core Principle
For page-level or flow-level TikTok Pixel implementation tasks, the following checks are coupled and should normally be executed together:

1. Base Code audit
2. TikTok event audit
3. Meta alignment audit

Do not treat these as mutually exclusive scenarios.

The goal is not only to identify whether something is missing or incorrect, but to turn the findings into a specific implementation plan.

## Required Workflow
When the task is about implementing, validating, repairing, or migrating TikTok Pixel for a page or business flow, follow this sequence:

1. Identify the target page or flow, the relevant user action, the business moment, and the most appropriate TikTok event.
2. Audit Base Code coverage, initialization location, and page support assumptions.
3. If Base Code is missing, broken, incomplete, or unsuitable for reuse, retrieve the canonical Base Code template and determine whether the required `pixel_code` is already known.
4. If the required `pixel_code` is not already known from repository evidence, current context, or prior confirmed user input, ask the user for it before generating final installable Base Code output.
5. Audit TikTok event correctness, including event naming, parameters, trigger timing, deduplication, and identity logic when relevant.
6. Scan the repository for Meta Pixel implementation and determine whether its trigger points, parameters, or abstractions can be reused.
7. Merge the findings into one implementation view instead of leaving them as disconnected checks.
8. Provide concrete code-level guidance, including likely patch location, reuse strategy, and example implementation when possible.
9. Include validation guidance and explicitly mark uncertainty where evidence is incomplete.

## Required References
Use the following resources as the source of truth:

- `references/tt-guide.md`
  - Use for TikTok Pixel Base Code, `ttq.page`, `ttq.track`, `ttq.identify`, `event_id`, limited data use, autoConfig, and PII-related expectations.

- `references/meta-map.md`
  - Use for Meta-to-TikTok API mapping, PageView migration, standard/custom event migration, advanced matching migration, deduplication key mapping, LDU migration, and common parameter conversion patterns.

- `references/basecode-template.md`
  - Use as the canonical Base Code template when Base Code is missing, broken, incomplete, or unsuitable for reuse.

Do not restate the full contents of these resources unless needed for the current task. Use them as references for judgment and implementation.

## Execution Protocol
For page-level or flow-level implementation tasks, begin with:

1. `references/implement-page-event.md`

Then execute the three coupled audits:

2. `references/basecode-audit.md`
3. `references/event-audit.md`
4. `references/meta-alignment-audit.md`

Use supporting modules when needed:
- `references/repo-search-strategy.md`
- `references/trigger-timing-reasoning.md`
- `references/parameter-mapping.md`
- `references/code-patch-strategy.md`
- `references/confidence-classification.md`

Use `references/implementation-output.md` to structure the final answer.

Do not skip the audit steps when the user asks for direct implementation guidance. Even when the user asks for code immediately, first form an implementation judgment based on the available evidence.

## Output Requirement
The final answer should usually contain:

1. task understanding,
2. recommended TikTok event for the page or flow,
3. Base Code findings,
4. TikTok event findings,
5. Meta alignment findings,
6. implementation gaps,
7. recommended code changes,
8. example code or patch sketch,
9. validation steps,
10. uncertainty or risk notes.

Prefer file-level, module-level, handler-level, callback-level, or abstraction-level guidance whenever repository evidence is sufficient.

If Base Code must be installed or replaced and the required `pixel_code` is not yet known, request it before producing the final installable Base Code snippet.

## Evidence Discipline
Distinguish findings clearly:

- **Confirmed**: directly supported by visible code evidence
- **Likely**: strongly inferred from nearby implementation patterns or repository structure
- **Needs verification**: plausible but not safely confirmed from the visible evidence

Do not present inferred conclusions as certain facts.

If a key implementation recommendation depends on an assumption, state that assumption clearly before giving the recommendation.

## Constraints
- Do not assume Base Code is correct unless checked.
- Do not assume Meta and TikTok parameter semantics are identical without checking the mapping resource.
- Do not recommend event placement purely from UI wording; prefer actual business completion points and visible code flow.
- Do not approve an event just because a `ttq.track(...)` call exists.
- Do not stop after identifying a problem when a concrete patch strategy can be proposed.
- Do not mechanically copy Meta implementation when TikTok-specific API, parameter, or timing differences matter.
- Do not overclaim certainty when repository evidence is partial.
- Do not prefer the shortest patch if it creates a weak or fragile integration point.
- Do not invent or paraphrase a Base Code snippet when a canonical template resource is available.
- Do not output an installable Base Code patch with an unresolved `pixel_code`.

## Success Condition
This skill succeeds when it helps the user move from a repository-level TikTok Pixel problem to a specific, technically grounded, and implementation-ready plan.
