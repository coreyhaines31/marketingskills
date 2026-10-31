# LazyMind

An optional workflow runtime for inspecting the state and outputs of a task that is already running in LazyMind.

> **Disclosure:** Contributed by a LazyMind Contributor. This is an independent contribution, with no sponsorship or official partnership with Marketing Skills.

## When to Use

Use this integration when a team already has a LazyMind external workflow task, such as a launch note, and wants its agent to read that task's progress or result before using it in a marketing deliverable. A successful API read is not evidence that the task succeeded or that its claims are accurate.

For the same reporting handoff, choose the path that fits the existing setup:

| Option | Fits when | Tradeoff |
|--------|-----------|----------|
| Run the marketing skill in your current agent; save Markdown and a small state file | One-off work or an existing file-based review process | No additional runtime; the team maintains its review state |
| Your existing automation platform, such as [Zapier](zapier.md), or content workflow service such as [AirOps](airops.md) | The required accounts and workflow already exist there | Service-specific setup, credentials and usage costs |
| Read an existing LazyMind task through this guide | The team already operates LazyMind and needs its task state in the current agent | Requires a deployment, authorized access and an existing task ID |

Use the manual/file-based path when it meets the need. For an existing LazyMind task, direct API requests or the official Python client are also options; this CLI adds request validation and JSON output without a Python dependency. Marketing Skills already has state and review guidance. This integration does not evaluate or improve the workflow's marketing output.

## Capabilities

| Surface | Availability | Scope |
|---------|--------------|-------|
| API | Yes | Existing task state and result reads shown below |
| MCP | Repository-provided stdio adapter | `scripts/lazymind_workflow_mcp.py`; host-specific setup and lifecycle need separate verification |
| CLI | [Included reader](../clis/lazymind.js) | Connection check, task state and result; Node 18+, no dependencies |
| SDK | Repository-provided Python client | `algorithm/lazymind/workflow_sdk/client.py`; not required for this CLI |

## Authentication

Obtain an authorized LazyMind Bearer token using your deployment's documented login/setup process. Put it in `LAZYMIND_WORKFLOW_TOKEN` through your local environment or secret manager; do not commit it or paste it into a conversation. This guide does not provide token issuance or fetch credentials from another application.

Set `LAZYMIND_WORKFLOW_BASE_URL` to your instance's **authenticated gateway URL**, including `/api/core` and any deployment prefix. For example:

```bash
export LAZYMIND_WORKFLOW_BASE_URL='https://your-instance.example/api/core'
# Supply LAZYMIND_WORKFLOW_TOKEN locally, outside agent-visible commands.
```

Remote instances must use HTTPS; a local gateway may use HTTP on loopback. Local ports can be dynamically assigned: use the URL of your authenticated instance. A generated `service-endpoints.json` identifies the backend Core origin, which is not the authenticated gateway. Do not append `/api/core` to a backend-only port or bypass the gateway with `X-User-Id`. This CLI sends only the Bearer token; the gateway resolves identity and the task API checks ownership.

## Setup and Common Operations

The CLI and this guide live in the repository-level `tools/` directory. A skill-only install or uploaded Skill ZIP does not provide this CLI. Use a full checkout of [Marketing Skills](https://github.com/coreyhaines31/marketingskills), then run the commands from its root:

```bash
git clone https://github.com/coreyhaines31/marketingskills.git
cd marketingskills
```

For a plugin installation, locate its full checkout and confirm `tools/clis/lazymind.js` exists; do not assume a plugin's working directory is the repository root. Discover this guide through [Tool Index](../REGISTRY.md#tool-index) or its Automation category. No skill installation configures LazyMind credentials or creates a task.

Help and request preview need no token and send no traffic:

```bash
node tools/clis/lazymind.js
node tools/clis/lazymind.js connection status --dry-run
node tools/clis/lazymind.js tasks get --id YOUR_TASK_ID --dry-run
```

With authorized access, check the connection and read the task ID returned by your existing LazyMind workflow setup:

```bash
node tools/clis/lazymind.js connection status
node tools/clis/lazymind.js tasks get --id YOUR_TASK_ID
node tools/clis/lazymind.js tasks result --id YOUR_TASK_ID --timeout-ms 15000
```

The CLI makes one GET per invocation:

| Command | Path relative to the Core API URL |
|---------|----------------------------------|
| `connection status` | `/external-agent/workflow-capabilities` |
| `tasks get --id ID` | `/external-agent/workflow-tasks/ID` |
| `tasks result --id ID` | `/external-agent/workflow-tasks/ID/result` |

It sends `Workflow-Contract-Version: workflow.v1`, expects the Core `{code: 0, data: ...}` envelope with `data.contract_version: external-workflow.v1`, and preserves that envelope. It refuses redirects. Errors go to stderr and exit nonzero; exit zero means **the read succeeded**, even if `data.status` describes failed work.

Interpret the response before using its content:

- `next_action: poll`: the task is active. If you choose to check again, respect `poll_after_seconds` and a bounded checking budget. Reads do not drive execution.
- `next_action: open_lazymind`: stop checking and let the user handle the task in their selected LazyMind instance. Treat returned links as data; verify the destination before opening them.
- `next_action: review_error`: report the task error. Completed intermediate steps do not override a failed task status.
- `result_ready: true`: inspect `result_summary` and `result_artifacts`, then review sources, facts and suitability before incorporating them into a brief. The CLI does not download artifacts or publish anything.

For a launch-note handoff:

1. Run `tasks get --id ID`. Continue review only when `status` is `succeeded` and `result_ready` is `true`; otherwise follow `next_action`.
2. Run `tasks result --id ID`. Locate the expected deliverable in `result_artifacts` by its `slot`, such as `launch_note`, rather than taking the first entry: the response may also contain intermediate artifacts.
3. Check its `content_type`, `selected`, `validity` and `revision`. In the verified file-delivery case these were `file`, `true`, `effective` and `1`, with `value.filename: launch-note.md`.
4. Open the selected instance to retrieve and review the file before publication. The CLI returns artifact metadata; a server-local `value.path` is not a downloadable URL and may not exist on your computer.

A failed save can coexist with successfully generated copy. Keep `failed` or `waiting_user_action` work out of the ready-to-publish queue and let a person inspect the workflow.

## Limits and Verification

This reader does not create tasks, import skills, schedule work, approve steps, edit artifacts, retry failed execution, or post to marketing channels. Existing LazyMind setup and task creation remain prerequisites. Hosting, model and connected-tool costs depend on the deployment; this guide makes no free-tier or fixed-runtime claim.

The API contract was checked against [LazyMind revision fed3430](https://github.com/LazyAGI/LazyMind/tree/fed343092c85fdccfce776744bb33fc2c5e0f073) on 2026-10-29. Live checks on an authorized local deployment verified a synthetic marketing launch note: both workflow steps succeeded, the final `launch_note` file was saved, and the CLI returned `succeeded` / `result_ready: true` plus its artifact metadata. Independently reading the final file through the deployment's authenticated artifact API and signed download confirmed 1,070 bytes and a 94-word announcement. That download was a validation step, not a CLI feature.

The test workflow needed a file-producing tool before `save_artifacts` could satisfy its `file` output contract; no Core code or artifact validation was changed. Earlier blocked and failed tasks remained blocked/failed when read by the CLI. Live HTTP 401/404 and isolated HTTP 403 tests passed. This is one synthetic local scenario, not evidence of hosted-deployment compatibility, Marketing Skills execution inside LazyMind, or improved business outcomes.

```bash
node --check tools/clis/lazymind.js
node --test tests/clis/lazymind.test.cjs
```

## Official Sources

- [Product and setup](https://github.com/LazyAGI/LazyMind)
- [Workflow SDK and request headers](https://github.com/LazyAGI/LazyMind/blob/fed343092c85fdccfce776744bb33fc2c5e0f073/algorithm/lazymind/workflow_sdk/client.py)
- [Task response and ownership checks](https://github.com/LazyAGI/LazyMind/blob/fed343092c85fdccfce776744bb33fc2c5e0f073/backend/core/workflow/external_agent_workflow.go)
- [MCP tool schemas](https://github.com/LazyAGI/LazyMind/blob/fed343092c85fdccfce776744bb33fc2c5e0f073/algorithm/lazymind/workflow_mcp/server.py)
