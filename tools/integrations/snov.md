# Snov.io

Email finding, verification, and drip campaign platform for outreach.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | ✓ | REST API for email finding, verification, prospects, drip campaigns |
| MCP | - | Not available |
| CLI | [✓](../clis/snov.js) | Zero-dependency Node.js CLI |
| SDK | - | API-only |

## Authentication

- **Type**: OAuth2 client credentials
- **Flow**: POST to `/oauth/access_token` with client_id + client_secret
- **Env vars**: `SNOV_CLIENT_ID`, `SNOV_CLIENT_SECRET`
- **Get keys**: [Snov.io > Integration > API](https://app.snov.io/integration/api)

The CLI handles token acquisition automatically.

## Common Agent Operations

### Search emails by domain

```bash
node tools/clis/snov.js domain search --domain example.com --type all --limit 10
```

### Start and retrieve a v2 domain search

The [current Domain Search API](https://snov.io/api) returns asynchronous tasks. Start one explicitly, then retrieve its result using the returned `meta.task_hash` and the same kind:

```bash
node tools/clis/snov.js domain start --kind company --domain example.com
node tools/clis/snov.js domain result --kind company --task-hash <task_hash>
node tools/clis/snov.js domain start --kind emails --domain example.com
node tools/clis/snov.js domain start --kind generic --domain example.com
node tools/clis/snov.js domain start --kind prospects --domain example.com --page 2 --positions "VP Sales,Marketing Lead"
```

`company` retrieves company information; `emails` finds domain emails; `generic` finds generic contacts; `prospects` finds prospect profiles. Results include the provider's task state and pagination metadata unchanged. An `in progress` result is not completed data: call `domain result` later. The CLI does not poll, retry or follow response links automatically.

For `emails` and `generic`, pass a nonempty `meta.next` from a completed result to another explicit `domain start --kind <kind> --domain <domain> --next <cursor>`. Each result page contains up to 50 emails. For `prospects`, choose `--page` (positive, default provider page 1) to retrieve up to 20 profiles; optional `--positions` accepts one to ten comma-separated titles. The CLI does not perform additional prospect email searches.

Snov charges credits for domain search starts according to its current plan/API rules. Inspect a dry run and avoid repeatedly starting the same search while waiting. Results are read once from fixed Snov endpoints; unverified email results still need verification before use. Legacy `domain search` and `domain count` retain their existing v1 requests and flags.

```bash
node tools/clis/snov.js domain start --kind emails --domain example.com --dry-run
```

### Find a specific person's email

```bash
node tools/clis/snov.js email find --domain example.com --first-name John --last-name Doe
```

### Verify an email

```bash
node tools/clis/snov.js email verify --email john@example.com
```

### Find prospect by email

```bash
node tools/clis/snov.js prospect find --email john@example.com
```

### Add prospect to a list

```bash
node tools/clis/snov.js prospect add --email john@example.com --first-name John --last-name Doe --list-id 12345
```

### Manage prospect lists

```bash
# List all lists
node tools/clis/snov.js lists list

# Get prospects in a list
node tools/clis/snov.js lists prospects --id 12345 --page 1 --per-page 50
```

### Check domain technology stack

```bash
node tools/clis/snov.js technology check --domain example.com
```

### Manage drip campaigns

```bash
# List campaigns
node tools/clis/snov.js drips list

# Get campaign details
node tools/clis/snov.js drips get --id 12345

# Add prospect to drip campaign
node tools/clis/snov.js drips add-prospect --id 12345 --email john@example.com
```

## Rate Limits

- Rate limits vary by plan
- OAuth tokens expire after a set period; CLI handles refresh automatically

## Use Cases

- **Link building**: Find contacts and run automated drip outreach
- **Prospecting**: Build and manage prospect lists
- **Technology research**: Check what tech stack a target domain uses
- **Email verification**: Clean lists before sending
