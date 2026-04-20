# Module: Confidence Classification

## Purpose
Classify findings according to evidence quality so the final output does not overstate certainty.

Use this module whenever repository evidence is incomplete, inferred, indirect, or ambiguous.

## Core Principle
Separate:
- what is directly visible,
- what is strongly inferred,
- what still requires human confirmation.

Do not flatten all conclusions into equal certainty.

## Confidence Levels

### 1. Confirmed
Use this label when the finding is directly supported by visible evidence.

Examples:
- direct `ttq.track('Purchase', ...)` call found,
- direct `fbq('track', 'AddToCart', ...)` call found,
- `eventID` clearly present in Meta code,
- `ttq.load(...)` found in global app shell,
- purchase success callback visibly contains order data.

### 2. Likely
Use this label when the conclusion is strongly inferred from nearby code patterns, but not fully explicit.

Examples:
- a shared analytics wrapper appears to dispatch to TikTok indirectly,
- a route-level success page strongly implies Purchase tracking should live there,
- Meta parameter source likely maps well to TikTok but exact field semantics are partially hidden,
- cart mutation success looks like the correct AddToCart insertion point, though final analytics dispatch is abstracted elsewhere.

### 3. Needs Verification
Use this label when the conclusion is plausible but cannot be safely confirmed from visible evidence.

Examples:
- repository snippet does not show the final success callback,
- a page appears covered by Base Code but global bootstrap file is not visible,
- a value looks like transaction ID but is not clearly documented,
- the app may use server-side reporting but no browser/server linkage is visible.

## Classification Dimensions
Apply confidence labels to important findings such as:

- Base Code presence
- page coverage
- target event existence
- parameter validity
- trigger timing correctness
- Meta reuse safety
- deduplication readiness
- identify readiness
- recommended patch location

## Output Behavior
When possible, attach confidence labels close to the claim.

Preferred style:
- **Confirmed**: TikTok Base Code is initialized in the root layout.
- **Likely**: AddToCart should be patched in the cart mutation success handler.
- **Needs verification**: The confirmation page likely represents final Purchase success, but the backend confirmation chain is not visible.

## Escalation Rule
If a key implementation recommendation depends on a weakly supported assumption, explicitly mark that assumption before giving the patch suggestion.

Example:
- **Needs verification**: This click handler may not guarantee cart-add success.
- Recommendation: Prefer the cart API success callback if available.

## Important Rules
- Do not use confident language for inferred findings.
- Do not hide uncertainty in footnotes only.
- Do not label trivial claims while leaving major architectural assumptions unlabeled.
- Prefer honest partial certainty over polished overclaiming.