# Pipeyield

Reviews Google Ads search terms and suggests negative keywords to paste into Google Ads. The browser review explains each excluded search. The standard chat response gives reasons for up to five suggestions and includes the full list to paste.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✗ | No separate public REST API |
| MCP | ✓ | Remote MCP server, streamable HTTP: `https://app.pipeyield.com/mcp` (upload path) |
| CLI | ✗ | None |
| SDK | ✗ | None |

Two ways to run a review, both in the browser at https://pipeyield.com/review:

- **Upload** a Google Ads search terms export (CSV or Excel, ideally the last 90 days). No signup and no Google Ads login.
- **Connect Google Ads** by signing in with Google. Pipeyield only reads the account. Google's own screen says the access can change an account; to make changes impossible, sign in with a Google user that has read-only access in Google Ads.

The MCP server has two tools. `start_review` takes no input and returns a private upload link (valid 24 hours) and a `grant`. `get_review` takes that `grant` and returns the review once it is ready. Neither tool accepts a file or chat text.

## Authentication

- MCP: none. The `grant` from `start_review` is the retrieval credential for that review; treat it as private.
- Connect: Google sign-in in the browser.

## Setup

Claude Code:

```bash
claude mcp add --transport http pipeyield https://app.pipeyield.com/mcp
```

Claude on the web or desktop: add a custom connector named `Pipeyield` with the address `https://app.pipeyield.com/mcp` and choose no sign-in (custom connectors depend on the plan).

## Common operations

1. Ask the assistant to review the person's Google Ads search terms. The assistant calls `start_review` and gives the person the upload link.
2. For a review in this chat, open Campaigns → Insights and reports → Search terms in Google Ads. Export the report as CSV or Excel, ideally for the last 90 days, and upload it using the link from step 1.
3. After the upload, call `get_review` with the `grant` from step 1. Show the result when the state is `done`. If it is `working`, retry as directed. For a connected review, open https://pipeyield.com/review, choose Connect Google Ads, and read the result in the browser.
4. The person adds the negatives in Google Ads themselves. Pipeyield does not change the account.

## Limits and data

- The standard free allowance is one review per Google Ads account per month.
- Free reviews: the file and its review are deleted together within 24 hours, or within 7 days if you ask us to email the review. Deleted data leaves backups within a further 7 days.
- Reviews of a connected Google Ads account are kept longer: see https://pipeyield.com/privacy.
- Customer data is stored in Germany; an AI model from Anthropic in the United States labels the searches.

## Links

- Privacy: https://pipeyield.com/privacy
- Source for the Claude plugin client (MIT): https://github.com/Pipeyield/pipeyield-review
