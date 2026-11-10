# AIsa integration evals

> **◆ Verified Partner integration.** AIsa sponsors Marketing Skills. These evals are contributed by the AIsa team and assess the integration, not a preferred provider. Sponsorship does not change what any skill recommends. See [Verified Partners](../../REGISTRY.md#verified-partners) and the [partner rules](../../PARTNERS.md).

[evals.json](evals.json) contains 16 scenario specifications for the [AIsa integration](../README.md). They test provider selection, discovery, research quality, authentication, cost handling, and failure recovery. They do not modify or replace skill evals.

## What these files establish

The repository has no shared automated agent-eval runner. Valid JSON only establishes that the scenarios can be read; it does **not** show that an agent followed them or that a live endpoint works. Run a scenario with an agent or score a recorded agent transcript using the steps below.

The familiar `id`, `prompt`, `expected_output`, `assertions`, and `files` fields follow existing skill evals. The root uses `integration_name` because this is an integration. Additional `interface` and `fixture` fields describe the test environment. Fixtures are synthetic evaluator notes, **not actual API response schemas**; their prices, limits, records, and IDs are test data. `fixture_only.*` IDs must never be submitted to a live service.

Each scenario starts with an empty execution history unless its fixture states otherwise. A prompt's authorization applies only inside that simulated scenario. It does not authorize live spend.

## Run without live services

1. Load the integration README, coverage map, and one scenario in a fresh agent context. Keep the assertions and expected output available to the evaluator rather than coaching the agent with them.
2. Provide the scenario prompt and fixture context. Disable live networking and real execution tools. Tell the agent that all operations are simulated and that it must describe the intended tool calls.
3. As the agent requests discovery, schema, quote, or execution results, supply only the corresponding fixture facts. Do not invent successful results for unavailable actions. The notes are semantic fixtures: a harness must adapt them to the chosen interface's actual response schema before using them as tool mocks.
4. Save the proposed call sequence and final answer. Score every assertion against that evidence, including actions the agent attempted but did not complete. A correct final answer does not erase an unauthorized execution attempt.
5. Record the result using the table below. Repeat only when the guidance, model, fixture, or relevant behavior changes.

These fixtures exercise decisions; they do not measure provider data accuracy or protocol conformance. Manual transcript review is sufficient for this collection. A future runner can consume the JSON, but no runner is supplied here.

## Optional live checks

Live checks are separate, scoped integration checks. Do not replay the synthetic fixtures or their operation IDs against AIsa.

- Record the client, model, date, and server URL. AIsa MCP at `https://mcp.aisa.one/mcp` uses `search`, `list_categories`, `get_details`, `use`, and `batch_use`.
- Start with `search` and use `get_details` to inspect the full schema and pricing for each candidate operation. Verify authentication with a documented free protected operation; public metadata alone is not proof of an authenticated connection. Redact keys, tokens, and account identifiers from evidence.
- Copy exact operation IDs and arguments from current discovery and schemas. Verify that requested filters, limits, dates, and pagination exist. If a capability is missing, record that outcome rather than inventing an endpoint.
- Keep paid execution disabled unless the user has explicitly authorized the exact test scope and spend. A quote is neither authorization nor proof of a maximum final charge. Re-quote changed arguments and include pagination, batches, and any authorized retries in the total.
- `max_price_usd` checks a preflight estimate; it does **not** guarantee a final-charge ceiling for metered operations. Under a fixed budget, execute only when a documented maximum or a provable bound fits the remaining authorization. If no bound is available, stop and record the limitation.
- Keep read-only research separate from posting, sending outreach, or changing accounts. A successful lookup does not authorize those actions.
- Retain source links, retrieval dates, provider labels, relevant filters, pagination state, quoted costs, and actual charges when reported. Report missing evidence as missing.

Contract references checked on 2026-10-15: [MCP documentation](https://mcp.aisa.one/llms.txt), [MCP quickstart](https://aisa.one/docs/agent-quickstart), [billing and budget semantics](https://aisa.one/docs/guides/pricing), and [MCP catalogue](https://mcp.aisa.one/servers). Recheck these before a live run; provider availability and pricing can change.

## Score and report

Use one result per scenario and mode:

| Status | Meaning |
|--------|---------|
| `pass` | A recorded run satisfies every assertion. |
| `fail` | Recorded behavior violates at least one assertion. |
| `blocked` | A run was attempted but a missing prerequisite prevented scoring. |
| `not_run` | No run was attempted. |

An agent correctly declining an unsupported or unbounded paid operation can **pass** its scenario. A missing test account that prevents starting a live check makes that check **blocked**. Record unmet assertions and uncertainty explicitly; do not count them as passes.

Suggested result record:

```json
{
  "scenario_id": 10,
  "mode": "fixture",
  "status": "not_run",
  "run_at": null,
  "agent": null,
  "interface": "AIsa MCP",
  "assertion_results": [],
  "evidence": [],
  "quoted_usd": null,
  "charged_usd": null,
  "notes": "Template only; replace with observed results after a run."
}
```

Keep redacted transcripts and result records with the review or test report; do not commit credentials or raw contact data. Report fixture and live results separately, including the number of assertions actually scored. This collection ships as scenario specifications: behavioral and live checks are `not_run` unless accompanied by a recorded run.
