# Audit: Meta Alignment Audit

## Purpose
Check whether existing Meta Pixel implementation can be used as a migration source, implementation clue, or reusable event model for TikTok Pixel.

This audit is mandatory for page-level TikTok Pixel implementation tasks when repository evidence may contain Meta Pixel logic.

## Source of Truth
Use `references/meta-map.md` as the primary reference for:
- API mapping,
- PageView migration,
- standard/custom event migration,
- advanced matching migration,
- deduplication key mapping,
- limited data use migration,
- parameter mapping differences.

## Main Questions
Answer the following:

1. Does matching Meta Pixel implementation exist for the target page or flow?
2. Does it represent a reusable event trigger point?
3. Does it expose reusable parameter sources?
4. What Meta-to-TikTok API or parameter differences must be corrected?
5. Is the Meta implementation itself trustworthy enough to reuse?

## Step 1: Search for Meta implementation
Search for:
- `fbq(`
- `trackSingle`
- `trackCustom`
- analytics wrappers that eventually call Meta Pixel
- event name strings
- Meta deduplication fields such as `eventID`
- privacy / LDU handling
- identity passing in Meta initialization

Determine whether Meta code exists:
- in the target page,
- in a shared wrapper,
- in a business service,
- in a central analytics layer.

## Step 2: Check event equivalence
Determine whether the visible Meta event corresponds to the user's target TikTok event.

Examples:
- `fbq('track', 'Purchase', ...)` -> likely TikTok `Purchase`
- `fbq('track', 'AddToCart', ...)` -> likely TikTok `AddToCart`
- `fbq('trackCustom', 'Step4', ...)` -> likely TikTok custom `Step4`
- `fbq('track', 'PageView')` -> TikTok `ttq.page()`

If the Meta event does not perfectly match the business moment, do not reuse blindly.

## Step 3: Check reusable trigger points
Determine where Meta fires:
- click handler,
- submit handler,
- success callback,
- route change,
- page mount,
- order completion response,
- analytics middleware.

Judge whether TikTok should fire at the same point.

Possible outcomes:
- same trigger point can be reused,
- same logical layer can be reused but timing should move,
- Meta trigger point is weak and should not be copied.

## Step 4: Check reusable parameter sources
Inspect the Meta parameter object.

Determine:
- which fields can be reused as-is,
- which fields need renaming,
- which fields need semantic adjustment,
- which fields should be discarded.

Examples:
- Meta `content_ids` may need TikTok `content_id`
- Meta `eventID` may need TikTok `event_id`
- Meta advanced matching in `fbq('init', ...)` may need TikTok `ttq.identify(...)`

## Step 5: Check reusable abstractions
Determine whether the repository has:
- a unified analytics dispatch function,
- a Meta-specific wrapper that should be generalized,
- an event mapping layer,
- a privacy handling layer,
- a deduplication helper,
- a checkout / order instrumentation helper.

Prefer reusing stable abstractions over injecting isolated TikTok code in random page files.

## Step 6: Judge migration quality
Classify the Meta implementation as:

- Strong migration source
- Useful but needs adjustment
- Weak clue only
- Not safe to reuse

## Output Requirements
Summarize findings as:

- **Meta presence**
- **Matching event**
- **Reusable trigger point**
- **Reusable parameters**
- **API / semantic differences**
- **Migration quality**

## Important Rules
- Do not assume Meta correctness automatically implies TikTok correctness.
- Do not mechanically copy Meta API usage.
- Do not copy Meta deduplication keys without renaming and checking semantics.
- Do not copy Meta identity handling without adapting to TikTok identify flow.
- Prefer shared abstraction reuse when it improves maintainability.
