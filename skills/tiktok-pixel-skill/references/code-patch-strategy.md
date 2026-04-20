# Module: Code Patch Strategy

## Purpose
Turn audit findings into concrete, maintainable code-level implementation guidance for TikTok Pixel.

Use this module whenever:
- TikTok Pixel code is missing,
- existing code is incorrect,
- Meta code should be adapted,
- the user needs a patch plan or example implementation.

## Core Principle
Do not jump directly to inserting raw `ttq.track(...)` everywhere.
Prefer the most maintainable integration path available in the repository.

Also, do not treat event patching as independent from Base Code health.
If Base Code is missing, broken, incomplete, weakly placed, or not globally reusable for the target flow, fix the Base Code foundation first before finalizing event-level patches.

## Base Code Dependency Rule
Before recommending event-level implementation, check the outcome of `references/basecode-audit.md`.

Use the following priority:

1. If Base Code is missing, broken, or unusable, repair or replace Base Code first.
2. If Base Code is only partially valid and does not reliably cover the target page or flow, supplement or relocate Base Code before finalizing event placement.
3. Only treat event-level patching as primary when Base Code is already sufficient for the target flow.

Do not recommend a final event patch as implementation-ready if the Base Code foundation is still unresolved.

## Template Escalation Rule
If the Base Code audit concludes that the existing Base Code should be replaced or supplemented:

- retrieve the canonical template from `references/basecode-template.md`,
- determine whether the required `pixel_code` is already known,
- if not known, ask the user for the TikTok Pixel code before generating final installable Base Code.

Do not invent or paraphrase a Base Code snippet when a canonical template resource is available.

Do not output final installable Base Code with an unresolved `{{PIXEL_CODE}}`.

## Patch Priority Order
Choose implementation strategies in this order:

1. Reuse an existing shared analytics abstraction
2. Extend an existing Meta or multi-platform analytics wrapper
3. Patch a stable business logic layer
4. Patch a page-level handler
5. Patch a UI interaction handler only if stronger layers are unavailable

The lower the patch level, the greater the maintenance risk.

## Strategy 1: Reuse Shared Analytics Layer
Use this when the repository already has:
- `trackEvent(...)`
- analytics dispatchers
- event middleware
- platform adapters
- marketing event wrappers

Benefits:
- centralized behavior,
- easier future maintenance,
- cleaner multi-platform support.

Typical recommendation:
- add TikTok mapping in the analytics adapter rather than injecting page-local code.

## Strategy 2: Extend Existing Meta Wrapper
Use this when Meta Pixel exists in a clear reusable wrapper or event dispatch path.

Benefits:
- reuse business timing,
- reuse parameter sourcing,
- reduce duplicate logic.

But do not mechanically duplicate Meta code.
Adapt:
- API usage,
- parameter names,
- deduplication keys,
- identify handling.

## Strategy 3: Patch Stable Business Logic
Use this when there is no clean analytics layer, but a stable business success point exists.

Examples:
- cart mutation success callback,
- order confirmation service,
- form submit success handler,
- search execution service.

This is often the best fallback when analytics abstractions are weak.

## Strategy 4: Patch Page-Level Flow
Use this when the page owns the business flow and there is no better shared layer.

Examples:
- page container handling checkout result,
- route-level success page,
- page-specific conversion flow.

This is acceptable, but less reusable than shared logic.

## Strategy 5: Patch UI Handler
Use only when stronger insertion points are unavailable.

Examples:
- button click handler,
- modal confirm button,
- submit button action.

This is the weakest acceptable strategy for conversion-quality events and should usually include a caution note.

## Patch Design Checklist
Every patch recommendation should answer:

1. **Base Code prerequisite**
   - is the Base Code foundation already sufficient,
   - does Base Code need repair, supplementation, or replacement first,
   - is user input required for `pixel_code`

2. **Where to patch**
   - file or module type
   - likely function or layer

3. **Why this location**
   - business correctness
   - maintainability
   - code ownership alignment

4. **What to add**
   - `ttq.load`
   - `ttq.page`
   - `ttq.track`
   - `ttq.identify`
   - `event_id`
   - parameter mapping

5. **What to reuse**
   - Meta parameter object
   - shared analytics utility
   - business response payload
   - route or page lifecycle hook
   - canonical Base Code template when needed

6. **What to avoid**
   - duplicate firing,
   - double initialization,
   - stale data,
   - UI-only values,
   - pre-success triggers,
   - unresolved `pixel_code`,
   - event patching on top of broken Base Code.

## Patch Output Style
When recommending a code change, use this structure:

- **Base Code prerequisite**
- **Patch location**
- **Reason**
- **Expected change**
- **Example implementation**
- **Risk / verification note**

## Example Recommendation Pattern
Use this style when helpful:

- Base Code prerequisite: current Base Code is only page-local and does not reliably cover checkout success; replace it with the canonical template in the root layout first.
- Patch location: existing checkout success analytics dispatcher.
- Reason: this location already has confirmed order-success semantics and stable order payload access.
- Expected change:
  - install canonical Base Code at the global app shell,
  - reuse the existing order confirmation payload,
  - add TikTok `Purchase`,
  - map `eventID` to `event_id`,
  - map `content_ids[0]` to `content_id`.
- Risk / verification note:
  - confirm the provided `pixel_code`,
  - verify no duplicate browser/server firing,
  - verify the checkout success route is globally covered after Base Code installation.

## Escalation Rule
If the current repository state shows both:
- unreliable Base Code foundation,
- and missing or incorrect event implementation,

then structure the recommendation in two phases:

### Phase 1: Base Code repair
- install, repair, supplement, or replace Base Code
- resolve `pixel_code` if required
- confirm global or route-appropriate coverage

### Phase 2: Event implementation
- add or repair target event logic
- map parameters
- validate timing
- verify deduplication and identity handling when relevant

Do not collapse both phases into a misleading single-step patch if the foundation is not ready.

## Important Rules
- Do not recommend a patch that ignores repository structure.
- Do not prioritize shortest code over best integration point.
- Do not inject TikTok logic into random UI code if a stable analytics layer exists.
- Prefer a smaller but correct patch over a large speculative refactor.
- If Base Code is not yet trustworthy, do not present event-level changes as complete.
- If `pixel_code` is required and not known, ask for it before giving final installable Base Code.
