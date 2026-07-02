# Loop State & Run Logging

Idempotency is only real if the loop can remember what it already did between runs. This reference defines where that state lives and how to log runs — so loops don't double-act, re-nag the same people, or re-alert the same issue.

## Where state lives

Persist each loop's state in a file under `.agents/loops/` — the same `.agents/` convention this repo uses for `product-marketing.md` and `listening-sources.md`. One state file per loop:

```
.agents/loops/<loop-name>.json     # the loop's memory
.agents/loops/<loop-name>.log      # append-only run log
```

If your scheduler or platform provides its own dedupe/cursor storage, use that instead — the point is durable state, not the specific file. Never keep state only in memory; a loop that forgets on restart will repeat itself.

## What to store

A state file holds whatever the loop needs to not repeat itself:

```json
{
  "loop": "churn-signal",
  "last_run": "2026-07-01T09:00:00Z",
  "cursor": "2026-06-30T23:59:59Z",        // watermark — only process items newer than this
  "handled": ["acct_1042", "acct_1077"],    // dedupe keys already acted on
  "cooldowns": {                             // entity -> next-eligible timestamp
    "acct_1042": "2026-07-15T00:00:00Z"
  },
  "in_flight": ["exp_pricing_v3"],           // actions/tests currently open
  "counters": { "acct_1042_attempts": 2 }    // e.g. dunning/win-back attempt counts
}
```

- **cursor / watermark** — the high-water mark of what's been processed (a timestamp or last ID). The loop only looks at items past it.
- **handled** — dedupe keys for items already acted on, so re-runs skip them.
- **cooldowns** — per-entity suppression windows so you never re-contact someone inside the window.
- **in_flight** — open items (running tests, active interventions) so the loop doesn't start a conflicting one.
- **counters** — attempt counts that drive stop conditions (e.g., "after 2 win-back emails, stop").

Keep state small and prune it: expire old `handled`/`cooldown` entries once they're past their window.

## Idempotency patterns

- **Watermark**: process only items newer than `cursor`; advance `cursor` at the end of a successful run. Safe to re-run — it won't reprocess.
- **Dedupe set**: before acting on an item, check its key against `handled`; add it after acting.
- **Cooldown map**: before contacting an entity, check `cooldowns[entity]`; set it after contact.
- **In-flight guard**: before starting an action that shouldn't overlap (a test, an intervention), check `in_flight`.

## Run logging

Append one line per run, whether or not it acted. This is the audit trail and the vanity-loop detector.

```
2026-07-01T09:00Z  checked=312  acted=2   note="2 accounts newly at-risk, interventions staged"
2026-07-02T09:00Z  checked=298  acted=0   note="no action"
2026-07-03T09:00Z  checked=305  acted=0   note="no action"
```

Log at minimum: timestamp, how many items checked, how many acted on, and a short note. Use it to answer two questions:
- **Is it a vanity loop?** If every run is `acted=0` for weeks and nobody misses it — or it acts every run (a sign it's chasing noise) — reconsider it.
- **Did it double-act?** Two runs acting on the same entity means the dedupe/cooldown state isn't working.

## Resetting & backfilling safely

- To **reset** a loop, clear its `cursor`/`handled` — but keep `cooldowns` so a reset doesn't spam people who were recently contacted.
- On **first run** (no state yet), set the watermark to "now" rather than processing all history, or you'll blast every historical item. If you genuinely want a backfill, do a dry run first (log what it *would* do, act on nothing) and respect cooldowns.
- Never log raw PII in state or run logs — use IDs or hashes (see `loop-guardrails.md`).
