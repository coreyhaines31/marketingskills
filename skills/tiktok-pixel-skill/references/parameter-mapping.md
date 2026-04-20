# Module: Parameter Mapping

## Purpose
Map repository-visible analytics data and Meta Pixel parameters into TikTok Pixel-compatible event payloads.

Use this module whenever:
- existing Meta Pixel code is present,
- TikTok event parameters need validation,
- repository data sources need to be transformed into TikTok payloads.

## Sources of Truth
Use:
- `references/tt-guide.md`
- `references/meta-map.md`

## Core Rule
Do not assume parameter names are portable across platforms.
Check both naming and semantics.

## Mapping Principles

### 1. Prefer business-truth data sources
Best sources:
- backend-confirmed order data,
- cart state,
- product model data,
- checkout response,
- user profile data collected in the flow.

Weaker sources:
- button label text,
- DOM scraping,
- placeholder state,
- presentation-only UI values.

### 2. Preserve meaning, not just shape
A field is reusable only if it still means the same thing after migration.

Examples:
- product identifier remains product identifier,
- transaction identifier remains deduplication identifier,
- total purchase value remains total purchase value.

Do not reuse fields if the original meaning is ambiguous.

### 3. Normalize platform differences
Examples that should be explicitly checked:

- Meta `content_ids` → TikTok `content_id`
- Meta `eventID` → TikTok `event_id`
- Meta advanced matching in init → TikTok `ttq.identify(...)`

### 4. Event-specific relevance matters
Not every parameter belongs to every event.
Judge whether the parameter improves correctness for the target event.

## Common Mapping Cases

### A. PageView
TikTok usually uses:
- `ttq.page()`

Do not force a custom `ttq.track('PageView', ...)` pattern when the repository should use `ttq.page()`.

### B. Purchase
Common valuable fields:
- `value`
- `currency`
- `content_id`
- `content_type`
- `quantity`
- `event_id` when deduplication is relevant

Check:
- whether `value` reflects final confirmed value,
- whether currency is real and available,
- whether item identifiers are singular or need transformation,
- whether the purchase moment is confirmed.

### C. AddToCart
Common valuable fields:
- `content_id`
- `content_type`
- `quantity`
- possibly `value` and `currency` if available and meaningful

Check:
- whether the item was actually added,
- whether cart data exists at that moment,
- whether the value refers to item value or cart value.

### D. Lead / Registration
Common valuable fields:
- success context,
- plan type,
- source / funnel metadata,
- identify fields only when legitimately available

Check:
- whether the flow has reached a success state,
- whether identity data is available and appropriate for `ttq.identify(...)`.

### E. Search
Common valuable fields:
- search term,
- search category or filters when meaningful

Check:
- whether the search action is executed,
- whether the value comes from actual query state rather than partially typed UI.

## Advanced Matching / Identify Mapping
If the repository or Meta code exposes user identity:

- Meta init-side identity handling should not be copied directly.
- TikTok identity should use `ttq.identify(...)`.
- Email and phone should be checked for format quality.
- If repository values are unreliable or partial, classify as Needs verification.

## Deduplication Mapping
If Meta uses:
- `eventID`

Then TikTok should be checked for:
- `event_id`

Do not copy the old key name directly.

Check whether the event identifier is:
- unique,
- stable,
- aligned between browser and server reporting if dual reporting exists.

## Output Behavior
When producing a mapping recommendation, present:

1. source field,
2. target TikTok field,
3. whether direct reuse is safe,
4. whether transformation is required,
5. confidence level.

## Suggested Mini-Format
Use this style when helpful:

- `meta.content_ids` → `tiktok.content_id` — transform required
- `meta.eventID` → `tiktok.event_id` — rename required
- `meta.em/ph in init` → `ttq.identify(...)` — API adaptation required

## Important Rules
- Do not treat parameter mapping as simple renaming.
- Do not invent TikTok fields that are not supported by the visible standard.
- Do not overfit every Meta parameter into TikTok if its value is unclear.
- When uncertain, prefer a smaller but correct TikTok payload over a larger but noisy one.
