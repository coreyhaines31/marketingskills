# Output Template: TikTok Pixel Implementation Response

Use the following structure by default.

## 1. Task Understanding
State:
- target page or flow,
- target user action,
- recommended TikTok event,
- whether the task is install / validate / repair / migrate.

## 2. Recommended Event
State the recommended TikTok event and why it matches the business moment.

## 3. Base Code Findings
Summarize:
- whether Base Code appears present,
- whether it appears correctly initialized,
- whether the target page appears covered,
- whether there are major Base Code risks.

## 4. TikTok Event Findings
Summarize:
- whether the event already exists,
- whether the name is correct,
- whether the parameters are correct,
- whether the trigger timing is correct,
- whether deduplication or identify support is missing.

## 5. Meta Alignment Findings
Summarize:
- whether matching Meta code exists,
- whether it can be reused,
- what differences must be handled for TikTok.

## 6. Gap Summary
Provide a concise list of:
- missing pieces,
- incorrect pieces,
- risky assumptions,
- implementation dependencies.

## 7. Recommended Code Changes
Describe:
- where to patch,
- what to add or change,
- what existing logic to reuse,
- whether event timing should move.

## 8. Example Code
Provide a concise code example or patch sketch.

## 9. Validation Steps
Explain how to verify:
- event fired,
- parameters correct,
- no duplicate firing,
- coverage is correct.

## 10. Confidence Notes
Mark key findings as:
- Confirmed
- Likely
- Needs verification