# QuestionPunk

Create surveys and AI-moderated interviews with follow-up questions, then read responses through the hosted MCP server or REST API.

Facts below were checked against the MCP server's tool definitions, the [MCP server guide](https://www.questionpunk.com/features/mcp-server), the [developer page](https://www.questionpunk.com/developers), the [API access guide](https://www.questionpunk.com/support/api-access) and the [OpenAPI specification](https://app.questionpunk.com/api/public/v1/openapi.json) on 2026-11-26.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST at `https://app.questionpunk.com/api/public/v1`: surveys, questions, responses and exports, templates, webhooks |
| MCP | ✓ | Official hosted server at `https://app.questionpunk.com/api/v1` (Streamable HTTP, OAuth). MCP Registry name `io.github.questionpunk/questionpunk` |
| CLI | - | Not available |
| SDK | - | Generate a client from the OpenAPI spec |

## Authentication

- **MCP**: OAuth with PKCE and automatic client registration, so a client needs only the endpoint URL. Each user signs in to QuestionPunk and approves the connection; there is no API key in the MCP configuration. The server defines separate OAuth scopes for reading studies, changing them, reading responses and using QuestionPunk's own AI features.
- **REST API**: Create an API key under **Settings > Developer > API Keys** and store it in `QUESTIONPUNK_API_KEY`. Send it as `Authorization: Bearer $QUESTIONPUNK_API_KEY`. For the examples below, exporting responses requires the `responses:read` key scope and creating a webhook requires `webhooks:manage`. With an OAuth access token, the corresponding scopes are `read` and `write`.
- **Disconnect**: **Settings > Integrations > Connected apps** stops further MCP access. It does not delete what the agent already received.
- **Needs**: a QuestionPunk account. Plan limits apply.

## MCP Server Setup

### Claude Code

```bash
claude mcp add --transport http questionpunk https://app.questionpunk.com/api/v1
claude mcp login questionpunk
```

### Codex

```bash
codex mcp add questionpunk --url https://app.questionpunk.com/api/v1
codex mcp login questionpunk
```

### Gemini CLI

```bash
gemini mcp add --transport http questionpunk https://app.questionpunk.com/api/v1
```

Then run `/mcp auth questionpunk` inside Gemini CLI to sign in.

Claude (web and desktop) and ChatGPT add the same URL as a custom connector; steps are in the [MCP server guide](https://www.questionpunk.com/features/mcp-server).

## Common Agent Operations (MCP)

For an existing study, call `survey_get` with its `surveyId` to read the questions, status and `versions.current`. Use the version argument named by the tool you call next.

### Draft an onboarding interview

Create an English-language draft:

```text
survey_create({ title: "Onboarding feedback", lang: "en" })
```

Use the returned survey `id` as `surveyId` and its numeric `versions.current` as `surveyVersion` in this call:

```text
question_create_bulk({
  surveyId,
  surveyVersion,
  lang: "en",
  items: [{
    text: "Tell us about getting started.",
    answer_type: "ai_moderated_interview",
    itemDetails: { modality: "text" },
    textItemDetails: {
      interviewGoal: "Find out which onboarding steps were confusing."
    }
  }]
})
```

Share `editorUrl` with the study owner for review. The study stays a draft until published. If survey creation times out, look for the draft with `survey_list` before retrying. If the bulk call fails partway, use `survey_get` to see which questions were saved before adding the rest.

### Start from a template

```text
template_lookup({ text: "customer churn" })
template_create_survey_from({ templateId: "<id>" })
```

### Publish and get the participant link

```text
survey_publish({ surveyId: "<id>" })
```

Publish only when the user asks. The result has `shareUrl`, the link to send to participants. For a survey with a voice interview it also returns an estimated credit cost per response.

### Count and summarize responses

```text
responses_get_counts({ surveyId: "<id>", responseType: "real", suspiciousLevel: "clean" })
report_get({ surveyId: "<id>", responseType: "real", suspiciousLevel: "clean" })
```

Without filters both include synthetic (AI) responses and flagged ones, so pass the same filters to both and say which were applied.

### Cross-tab two numeric questions

```text
report_get_crosstab({ surveyId: "<id>", rowQuestionId: "<id>", colQuestionId: "<id>" })
```

Both questions must be rating, opinion scale, slider or numeric questions.

### Read open-ended answers for coding

```text
responses_read({ surveyId: "<id>", questionIds: ["<open question id>"] })
```

Returns JSON pages (up to 200 responses each; follow `page.nextCursor` until it is null) for the agent's own model to code. AI interview answers come back as question and answer turns.

### Export responses

```text
responses_export({ surveyId: "<id>", format: "wide" })
```

Returns CSV and XLSX download links that open in a browser signed in to QuestionPunk. They are not public share links.

## Common Operations (REST API)

### Check the key

```bash
curl -H "Authorization: Bearer $QUESTIONPUNK_API_KEY" \
  https://app.questionpunk.com/api/public/v1/me
```

### Export completed real responses

Set SURVEY_ID to the UUID of the survey you want to export.

```bash
curl -X POST -H "Authorization: Bearer $QUESTIONPUNK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"format": "csv", "filters": {"status": "completed", "type": "real"}}' \
  "https://app.questionpunk.com/api/public/v1/surveys/${SURVEY_ID}/export"
```

### Get a webhook when a response is completed

```bash
curl -X POST -H "Authorization: Bearer $QUESTIONPUNK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/hooks/questionpunk", "events": ["response.completed"]}' \
  https://app.questionpunk.com/api/public/v1/webhooks
```

Other events include `response.started`, `response.abandoned`, `survey.published` and `survey.response_limit_reached`; the OpenAPI spec lists them all.

## Rate Limits

- REST: 100 requests per fixed 60-second window per client IP. Keys used from the same IP share the window. On a 429, wait as `Retry-After` says.

## Tradeoffs

- Over MCP an agent does not answer a survey as a participant, buy participant recruitment, or add a language to a study.
- Edits to a published survey reach participants at once. Draft and check before publishing.
- `report_get_crosstab` crosses only numeric questions and covers all responses, real and synthetic. To break results down by a choice question, read the answers with `responses_read` and group them.
- MCP sign-in is per-user OAuth, which suits interactive sessions. For scheduled or unattended jobs, use the REST API with a scoped key.
- MCP tool arguments and REST request bodies are different contracts; check the OpenAPI spec for REST.
- For other routes to the same jobs: [Typeform](typeform.md) has its own API and MCP server for forms and surveys; [Hotjar](hotjar.md) covers on-site surveys next to heatmaps and recordings; the `customer-research` skill's `references/interviews-and-surveys.md` is the playbook for running interviews and surveys yourself.

## Relevant Skills

- **customer-research**: fielding a survey or AI-moderated interviews, then coding open-ended answers
- **churn-prevention**: an exit survey
- **pricing**: running a Van Westendorp price survey
