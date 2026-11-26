# WaveSpeedAI

API for image, video, audio and 3D generation models (for example Seedream, Seedance, Kling, Wan and Veo). Used here to make ad images, product videos and voice-overs from a prompt or from existing product photos.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | Yes | REST: submit a job to a model, then fetch the result |
| MCP | Yes | Hosted remote server, or a local `npx` server |
| CLI | Yes | `wavespeed` CLI (Node 18+ or a standalone binary) |
| SDK | Yes | Python (`pip install wavespeed`) and JavaScript (`npm install wavespeed`) |

## Authentication

- **Type**: API key
- **Header**: `Authorization: Bearer {api_key}`
- **Get key**: https://wavespeed.ai/accesskey
- **Env var**: `WAVESPEED_API_KEY`. Keep it in an environment variable or secret manager, never in the repo.

Every generation is billed to the account that owns the key. Each model page at https://wavespeed.ai/models shows the model's inputs and its price for the settings you choose.

## How a request works

1. `POST https://api.wavespeed.ai/api/v3/{model_id}` with the model's input as JSON. The response contains `data.id`.
2. `GET https://api.wavespeed.ai/api/v3/predictions/{id}/result` until `data.status` is `completed` or `failed`.
3. When completed, `data.outputs` is a list of file URLs. Download what you need to keep.

The model id is the path shown on the model page, for example `bytedance/seedream-v5.5`. Input names differ by model, so read the model page (or the model's schema through MCP or the CLI) before building a request. Do not resubmit a request that timed out on your side: fetch its result by id first, since a resubmission is a new, separately billed job.

## Common operations

### Ad image from a prompt

```bash
curl -X POST https://api.wavespeed.ai/api/v3/bytedance/seedream-v5.5 \
  -H "Authorization: Bearer $WAVESPEED_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Studio photo of a matte black water bottle on a sand-colored background, soft daylight, room for a headline at the top",
    "aspect_ratio": "2:3",
    "resolution": "2k"
  }'
```

### Edit an existing product photo

Pass one or more public image URLs in `images`:

```bash
curl -X POST https://api.wavespeed.ai/api/v3/bytedance/seedream-v5.5/edit \
  -H "Authorization: Bearer $WAVESPEED_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Place the bottle on a wet rock by a mountain lake at sunrise, keep the label unchanged",
    "images": ["https://example.com/product.png"]
  }'
```

### Product video from a photo

```bash
curl -X POST https://api.wavespeed.ai/api/v3/alibaba/wan-3.0/image-to-video \
  -H "Authorization: Bearer $WAVESPEED_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "https://example.com/product.png",
    "prompt": "Slow push-in on the bottle as morning light moves across the label",
    "aspect_ratio": "9:16",
    "duration": 8,
    "resolution": "1080p"
  }'
```

For a video from text alone, use `alibaba/wan-3.0/text-to-video` with the same fields minus `image`. Video jobs take longer than images; poll every few seconds.

### Voice-over

```bash
curl -X POST https://api.wavespeed.ai/api/v3/wavespeed-ai/qwen3-tts/text-to-speech \
  -H "Authorization: Bearer $WAVESPEED_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Cold for twenty-four hours. Built for the trail.",
    "language": "English",
    "voice": "Ryan"
  }'
```

### Fetch the result

```bash
curl https://api.wavespeed.ai/api/v3/predictions/PREDICTION_ID/result \
  -H "Authorization: Bearer $WAVESPEED_API_KEY"
```

To be notified instead of polling, see [webhooks](https://wavespeed.ai/docs/how-to-use-webhooks). Local files can be uploaded through the [upload API](https://wavespeed.ai/docs/upload-files-api) to get a URL for `image` or `images`.

## MCP Server Setup

The hosted server lets an agent search the model catalog, read a model's input schema, check the price and run it.

### Claude Code

```bash
claude mcp add --transport http wavespeed https://api.wavespeed.ai/mcp
```

On first use it signs in through the browser. To use an API key instead:

```bash
claude mcp add --transport http wavespeed https://api.wavespeed.ai/mcp \
  --header "Authorization: Bearer $WAVESPEED_API_KEY"
```

### Codex

```bash
codex mcp add wavespeed --url https://api.wavespeed.ai/mcp
codex mcp login wavespeed
```

### Other clients (Cursor, Claude Desktop, VS Code)

Use the remote URL `https://api.wavespeed.ai/mcp` with an `Authorization: Bearer` header, or run the local server, which reads `WAVESPEED_API_KEY` and can upload local files for you:

```json
{
  "mcpServers": {
    "wavespeed": {
      "command": "npx",
      "args": ["-y", "@wavespeed/mcp@latest"],
      "env": { "WAVESPEED_API_KEY": "YOUR_API_KEY" }
    }
  }
}
```

## CLI

```bash
npm install -g @wavespeed/cli
wavespeed login --api-key "$WAVESPEED_API_KEY" --no-browser

# Image, saved locally
wavespeed run bytedance/seedream-v5.5 \
  --prompt "Flat-lay of running gear on concrete, top-down" \
  --input aspect_ratio=1:1 --download ./out/

# Video from a local photo (@path uploads the file)
wavespeed run alibaba/wan-3.0/image-to-video \
  --input image=@./product.png \
  --prompt "Camera orbits the shoe on a turntable" \
  --input duration=6 --json
```

`--json` prints one JSON object, which suits scripts and agents. The CLI checks inputs against the model's schema before it submits.

## Links

- Docs: https://wavespeed.ai/docs
- Model catalog: https://wavespeed.ai/models
- MCP server: https://wavespeed.ai/docs/mcp
- CLI: https://wavespeed.ai/docs/wavespeed-cli
- Error codes: https://wavespeed.ai/docs/error-codes
