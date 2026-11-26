# Inki

Document editor for drafts that people revise before they go out. An agent saves a draft as an Inki note, people edit it and leave comments in Inki (web, Mac, iPhone, Android), and the agent reads their edits and comments back to revise. The MCP server also runs Inki's writing check and AI reviews on a note.

Facts below were checked against the [Connect AI docs](https://docs.inki.so/en/features/connect-ai), the server's OAuth metadata and the tool list the live MCP server returns on 2026-11-24.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | - | No public REST API; agents use the MCP server |
| MCP | ✓ | Official hosted server at `https://inki.so/api/mcp` (Streamable HTTP, OAuth). Find, read, save, edit, suggest, comment, check and review notes |
| CLI | - | Not available |
| SDK | - | Not available |

## Authentication

- **Type**: OAuth 2.1 with PKCE. Each user signs in to Inki as themselves; there are no API keys.
- **Client registration**: Dynamic Client Registration or a Client ID Metadata Document. Metadata at `https://inki.so/.well-known/oauth-authorization-server`.
- **Needs**: an Inki account.

## MCP Server Setup

### Claude Code

```bash
claude mcp add --transport http inki https://inki.so/api/mcp
```

Run `/mcp`, choose `inki`, then choose Authenticate.

### Codex

```bash
codex mcp add inki --url https://inki.so/api/mcp
```

A browser opens to sign in. If it doesn't, run `codex mcp login inki`.

### Cursor (`~/.cursor/mcp.json`)

```json
{ "mcpServers": { "inki": { "url": "https://inki.so/api/mcp" } } }
```

Claude (web, desktop, mobile) and ChatGPT connect from their own directories; the steps are in the [Connect AI docs](https://docs.inki.so/en/features/connect-ai).

## Common Agent Operations

Start with `read_writing_rules`: it returns the writing rules the user keeps in Inki (general, folder and note rules; the narrower scope wins), so the draft follows them from the first version.

### Save a draft as a note

```text
create_note({ title: "Launch email", markdown: "<draft>", request_key: "launch-email-1" })
```

Returns the note's URL. Reuse the same `request_key` only to retry the same save.

### Read the person's edits and comments

```text
read_note({ note_id: "<id>" })
list_comments({ note_id: "<id>" })
```

`read_note` returns the note's Markdown and a `revision`. If this agent wrote the note before, `changes_since_your_last_write` lists every passage changed in Inki since then, with the text before and after. `list_comments` returns the open threads with the quoted passage and each comment's author kind (`editor`, `member`, `assistant`, `external_agent`). `search_notes` and `list_notes` find a note by words or by folder and date.

### Revise or suggest

```text
edit_note({ note_id: "<id>", expected_revision: 12, request_key: "fix-intro",
  ops: [{ op: "replace", old_text: "<exact passage>", new_text: "<new passage>" }] })
suggest_note_edit({ note_id: "<id>", expected_revision: 12, request_key: "cta-option",
  ops: [{ op: "replace", old_text: "<exact passage>", new_text: "<proposal>" }] })
```

Ops are `replace`, `insert_before`, `insert_after` and `delete` (anchored to text that appears once in the note), `append` and `replace_all`. Every op applies or none does. If the note changed after the read, the call returns `stale_revision` and writes nothing, so the person's newer edits are never overwritten. `suggest_note_edit` leaves the text as it is; the person applies or discards each suggestion in Inki. `undo_note_edit` reverts an `edit_note` by its `change_id`.

### Answer and close comment threads

```text
reply_comment({ note_id: "<id>", thread_id: "<thread>", body: "Shortened it. Keep the price line?", request_key: "reply-1" })
resolve_comment({ note_id: "<id>", thread_id: "<thread>", body: "Cut the second paragraph to one sentence.", request_key: "resolve-1" })
```

`resolve_comment` posts its body as the last reply and resolves the thread; the person can reopen it.

### Check and review

```text
check_note({ note_id: "<id>" })   # typos, grammar, hard-to-read sentences; call get_check while in_progress
review_note({ note_id: "<id>", reviewer: "editor", request_key: "review-1" })
get_review({ review_id: "<id>" }) # call again while in_progress; usually one to three minutes
```

Check findings carry the quoted text, the reason, suggested replacements or a question for the writer, and a severity from 1 to 3. Reviewers are `editor` (ready for its reader?), `reader` (a first-time reader's reactions), `fact_checker` (claims against web sources) and `critic` (strongest objections).

## Rate Limits and Pricing

- Finding, reading, saving and editing notes use no credits.
- A review uses about 100 Inki credits. Checks use no credits but count toward an hourly limit of checked paragraphs.
- The Free plan has 100 credits a month; Light, Pro and Max add more. Check [inki.so](https://inki.so) for current prices.

## Tradeoffs

- OAuth only, with no API keys, so it fits interactive agent sessions better than scheduled or headless runs.
- No connected app can permanently delete notes, empty the trash, delete folders or create share links. Sharing a note with a reviewer happens in the Inki app.
- Agents read and write notes as Markdown. To hand a draft to a team that works in Google Docs or Word, export it from the Inki app.
- For other routes to the same job: keep drafts as Markdown files in the repository and review them in pull requests, or have the agent write into Google Docs or Notion through their own APIs or MCP servers and read comments there.

## Relevant Skills

- **copywriting**: saving page or email copy as a note so a person can edit it before the agent revises
- **copy-editing**: running the check and an `editor` review on a draft, then fixing only the findings the person accepts
- **emails**: drafting a sequence in one note and revising it from the person's comments
- **content-strategy**: keeping briefs and drafts where reviewers can comment
