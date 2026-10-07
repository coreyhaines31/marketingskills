# Arcmira

YouTube transcript search with source timestamps for content, speaker and sponsor research.

[Arcmira](https://arcmira.com) | [API documentation](https://arcmira.com/docs)

Contributed by Arcmira's maker.

## Capabilities

| Interface | Available | Notes |
|---|---|---|
| API | Yes | REST endpoints for search, transcripts, mentions, recommendations and monitors. |
| MCP | Yes | Remote server at `https://mcp.arcmira.com/mcp`; connect and sign in through the host. |
| CLI | Yes | The `arcmira` npm package includes a command line. |
| SDK | Yes | The `arcmira` npm and PyPI packages provide TypeScript/JavaScript and Python clients. |

## Authentication

Obtain an API key through the [account setup instructions](https://arcmira.com/docs/authentication). Store it in a secret manager or the `ARCMIRA_API_KEY` environment variable. Never commit a key or put it in browser code.

Send the key as `Authorization: Bearer $ARCMIRA_API_KEY`. The account check reports the plan, scopes and credit balance without using credits:

```bash
curl 'https://api.arcmira.com/v1/me' \
  -H "Authorization: Bearer $ARCMIRA_API_KEY"
```

The key acts in the account where it was created. Inspect that response before using a shared team account.

## Setup

To inspect the native CLI:

```bash
npx arcmira --help
```

For an agent connection, use the [MCP setup instructions](https://arcmira.com/docs/mcp-server). The keyless documentation MCP at `https://arcmira.com/docs/mcp` searches documentation; it does not search video transcripts.

## Common operations

### Find source passages for a content brief

Query one topic at a time. This example uses an explicit historical window, avoiding the newest-media window withheld from the Free plan:

```bash
curl --get 'https://api.arcmira.com/v1/search' \
  --data-urlencode 'q=creator economy' \
  --data 'after=2026-08-01' \
  --data 'before=2026-09-01' \
  --data 'limit=3' \
  -H "Authorization: Bearer $ARCMIRA_API_KEY"
```

Search returns passages in `chunks` with text, source video information and timestamped watch links. Keep the original source link and publication date with each excerpt. Open the recording and check nearby context before quoting it or choosing a clip. A match is source material, not an endorsement or a representative measure of audience sentiment.

### Resolve a person, company or show before filtering

```bash
curl --get 'https://api.arcmira.com/v1/entities/resolve' \
  --data-urlencode 'q=Ramp' \
  -H "Authorization: Bearer $ARCMIRA_API_KEY"
```

Use `best` when the response identifies one entity. If it returns `suggested`, disclose the assumption; if it returns `ask`, choose from the supplied options with the user. Pass the resolved IDs to filters such as `about`, `by` or `channel_ids`; names are not accepted as filter values. See the [search reference](https://arcmira.com/docs/search) for each filter's meaning.

### Inspect sponsor and recommendation evidence

Use the [commercial intelligence endpoints](https://arcmira.com/docs/commercial-intelligence) when the account has the required plan and scopes. They distinguish classified sponsored and organic recommendations. Review the cited recording before making a commercial claim. A mention alone does not establish a sponsorship.

## Choosing a method

| Need | Option and tradeoff |
|---|---|
| Inspect words in a video you already know | Use the original recording and its transcript when available. This is a manual path without a separate API account. |
| Search indexed spoken passages across videos | Arcmira returns source timestamps through its API and MCP. It covers an indexed catalog, not every YouTube video. |
| Produce captions from a recording you control | Use a transcription service or local speech-recognition tool. You must supply the recording and handle its processing and permissions. |

Arcmira is a hosted service with a Free plan and paid plans. The Free plan has usage limits and withholds the newest 30 days of media. Speaker labels cover a minority of indexed shows. Sponsor access and Premium transcripts depend on the plan. A paid read uses credits from your plan, then any top-up credits, then your on-demand budget. See [plans and usage](https://arcmira.com/docs/usage-and-billing) for current allowances and limits.

Search access does not grant permission to republish a recording. Check the source's rights and the intended use separately.

## Documentation

- [Search and entity resolution](https://arcmira.com/docs/search)
- [Transcript reads](https://arcmira.com/docs/transcripts)
- [Sponsors and recommendations](https://arcmira.com/docs/commercial-intelligence)
- [CLI and SDKs](https://arcmira.com/docs/libraries)
- [API schema](https://api.arcmira.com/v1/openapi.json)
