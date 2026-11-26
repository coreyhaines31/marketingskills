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

- Record the client, model, date, server URL, and tools exposed by the connection. Follow the [agent setup guide](https://aisa.one/llms.txt) and inspect current schemas.
- Verify authentication with the free `account` tool when exposed. For a legacy connection, inspect `use` and invoke its documented account read. Redact keys, tokens, and account identifiers from evidence.
- Use `search` to discover candidates. Retrieve a missing schema through `batch_get_schema` or the exposed `get_details` alias. Use exact tool names and supported arguments, and reuse the returned `session_id`.
- Obtain a successful `batch_quote` for the exact calls proposed for execution. Re-quote changes to sources, arguments, or scope. Keep the quoted call list with the evidence.
- Live evaluations require explicit authorization for their scope and spend. Honor a quote-only instruction or tighter budget even when a quote reports `auto_execute_eligible`.
- The current `batch_use` schema has no `max_price_usd` field. For a fixed spending maximum, establish a documented maximum or a provable bound from supported request limits. Leave execution pending and record the limitation until a supported bound fits the remaining budget.
- Execute the same quoted calls through `batch_use`. Inspect individual results and reported charges. Preserve completed results and reconcile uncertain execution or costs before proposing a retry.
- Research authorization covers the agreed reads. Obtain authorization for posting, sending outreach, or changing accounts.
- Retain source links, retrieval dates, provider labels, relevant filters, pagination state, quoted costs, and actual charges when reported. Mark unavailable evidence explicitly.

Contract and workflow references checked on 2026-11-25 using the [agent setup guide](https://aisa.one/llms.txt), [MCP quickstart](https://aisa.one/docs/agent-quickstart), [billing guide](https://aisa.one/docs/guides/pricing), and [public API catalog](https://aisa.one/catalog). Inspect the connected client's current tool list before a live run. Recorded fixture and live runs establish their own execution results.

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
