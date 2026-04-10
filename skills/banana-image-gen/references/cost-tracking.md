# Cost Tracking Reference

> Load this on-demand when the user asks about costs or before batch operations.

## Pricing Table

| Model | Resolution | Cost/Image | Notes |
|-------|-----------|-----------|-------|
| 3.1 Flash | 512 | $0.020 | Quick drafts |
| 3.1 Flash | 1K | $0.039 | Standard (default) |
| 3.1 Flash | 2K | $0.078 | Quality assets |
| 3.1 Flash | 4K | $0.156 | Print/hero images |
| 2.5 Flash | 512 | $0.020 | Draft fallback |
| 2.5 Flash | 1K | $0.039 | Standard fallback |
| Batch API | Any | 50% of above | Asynchronous, higher latency |

Pricing is approximate, based on ~1,290 output tokens per image.
Research suggests actual costs may be ~$0.067/img. Verify at https://ai.google.dev/gemini-api/docs/pricing

## Free Tier Limits

- ~10 requests per minute (RPM)
- ~500 requests per day (RPD)
- Per Google Cloud project, resets midnight Pacific

## Cost Tracker Commands

```bash
# Log a generation
cost_tracker.py log --model gemini-3.1-flash-image-preview --resolution 1K --prompt "coffee shop hero"

# View summary (total + last 7 days)
cost_tracker.py summary

# Today's usage
cost_tracker.py today

# Estimate before batch
cost_tracker.py estimate --model gemini-3.1-flash-image-preview --resolution 1K --count 10

# Reset ledger
cost_tracker.py reset --confirm
```

## Storage

Ledger stored at `~/.banana/costs.json`. Created automatically on first use.
