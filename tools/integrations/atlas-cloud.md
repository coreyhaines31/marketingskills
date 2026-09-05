# Atlas Cloud

Unified API for discovering and running image, video, audio, 3D, and language models. The repository includes a zero-dependency video CLI for schema-validated generation.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | Yes | Asynchronous media generation and OpenAI-compatible LLM endpoints |
| MCP | Yes | Model discovery, generation, polling, upload, and chat tools |
| CLI | Yes | tools/clis/atlas-cloud-video.js for video discovery and generation |
| SDK | - | Use the REST API or CLI |

## Authentication

- **Environment variable**: ATLASCLOUD_API_KEY
- **Header**: Authorization: Bearer {api_key}
- **Get key**: Atlas Cloud Console -> API Keys

Never put the key in a prompt, command argument, request body, or downloaded-media request.

## Schema-First Workflow

Model IDs and parameters change over time. Discover the live catalog and inspect the selected model's schema before building a request:

~~~bash
export ATLASCLOUD_API_KEY="..."

node tools/clis/atlas-cloud-video.js models \
  --type Video \
  --search "text to video" \
  --limit 10

node tools/clis/atlas-cloud-video.js schema \
  --model "$MODEL_ID"
~~~

The schema command returns components.schemas.Input from the model's current OpenAPI document. Only pass fields listed there.

## Generate Video

Preview the exact request without creating a billable task:

~~~bash
node tools/clis/atlas-cloud-video.js generate \
  --model "$MODEL_ID" \
  --prompt "A close product shot with a slow camera orbit" \
  --params-file request.json \
  --dry-run
~~~

Populate request.json only with optional or additional required fields shown by the schema command. Do not copy fields from another model.

Then submit once, poll with a deadline, and download the first output:

~~~bash
node tools/clis/atlas-cloud-video.js generate \
  --model "$MODEL_ID" \
  --prompt "A close product shot with a slow camera orbit" \
  --params-file request.json \
  --wait \
  --max-wait 600 \
  --interval 5 \
  --download output.mp4
~~~

Use --params with a JSON object only when the schema-derived payload is small enough to review safely on the command line.

## Safety and Failure Behavior

- The CLI fetches the live model catalog and schema before every generation.
- Unknown fields, invalid types, and values outside a schema enum are rejected locally.
- Generation POST requests are sent exactly once and are never retried.
- Prediction GET requests retry at most three times with bounded backoff.
- Polling stops on success, terminal failure, or --max-wait.
- Output downloads use credential-free HTTPS requests. Local, private, and non-routable targets are rejected.
- TUN-style synthetic DNS in 198.18.0.0/15 is allowed only for a named HTTPS host; a literal URL in that range is still rejected.
- The prediction ID is written to stderr before polling so a completed task remains recoverable if a later download fails.
- Downloads refuse to overwrite an existing file.

## Relevant Skills

- video
- image
- ad-creative
