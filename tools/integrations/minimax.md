# MiniMax (Hailuo)

AI video generation platform. Generate original marketing footage from text or image prompts — B-roll, hero shots, and scenes you can't practically film — with strong character consistency across clips.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | Yes | REST API for text-to-video and image-to-video generation, task management, and file retrieval |
| MCP | - | - |
| CLI | Yes | [minimax-video.js](../clis/minimax-video.js) — zero-dependency, single-file |
| SDK | - | - |

## Authentication

- **Type**: Bearer token
- **Header**: `Authorization: Bearer {api_key}`
- **Environment variable**: `MINIMAX_API_KEY`
- **Get key**: API key section of the MiniMax platform console

## Regional Endpoints

Pick the region closest to your account. The global (English) region is the default.

| Region | Host | Docs |
|--------|------|------|
| `global_en` | `https://api.minimax.io` | [platform.minimax.io/docs](https://platform.minimax.io/docs/api-reference/video-generation-t2v) |
| `cn_zh` | `https://api.minimaxi.com` | [platform.minimaxi.com/docs](https://platform.minimaxi.com/docs/api-reference/video-generation-t2v) |

Select the region with `--region <global_en|cn_zh>` on the CLI (or the `MINIMAX_REGION` environment variable). Set `MINIMAX_BASE_URL` to override the host entirely.

## Models

Video generation is asynchronous: submit a task, then poll until it completes. The v2 response provides the output URL directly; v1 tasks use file retrieval.

| Model | Notes |
|-------|-------|
| `MiniMax-H3` | Current default — v2 text, image, and reference inputs with 2K output |
| `MiniMax-Hailuo-2.3` | v1 high-fidelity generation |
| `MiniMax-Hailuo-2.3-Fast` | Faster generation, lower cost |
| `MiniMax-Hailuo-02` | Previous-generation Hailuo |
| `T2V-01-Director` | Director model with camera-movement control |
| `T2V-01` | Base text-to-video model |
| `I2V-01-Director` | Director image-to-video model with camera-movement control |
| `I2V-01-live` | Image-to-video model for animated illustrations |
| `I2V-01` | Base image-to-video model |

## CLI Quick Start

```bash
# Preview any request without sending it (key is masked)
node tools/clis/minimax-video.js video generate \
  --prompt "A close-up of hands typing on a laptop, warm office lighting, camera slowly pulls back" \
  --duration 6 --resolution 2K --ratio 16:9 --dry-run

# 1. Submit a generation task → returns task_id
node tools/clis/minimax-video.js video generate \
  --prompt "A close-up of hands typing on a laptop, warm office lighting" \
  --model MiniMax-H3 --duration 6 --resolution 2K --ratio 16:9

# Use a first-frame image for image-to-video
node tools/clis/minimax-video.js video generate \
  --prompt "The camera slowly pushes toward the product" \
  --first-frame-image https://example.com/product.png --duration 6

# Legacy v1 image-to-video accepts a first frame without a prompt
node tools/clis/minimax-video.js video generate \
  --model I2V-01 --first-frame-image https://example.com/product.png

# 2. Poll the v2 task until status is succeeded → returns task.content.url
node tools/clis/minimax-video.js video status --task-id TASK_ID

# Use --api-version v1 for status and file retrieval with v1 models
node tools/clis/minimax-video.js video status --task-id TASK_ID --api-version v1
node tools/clis/minimax-video.js video download --file-id FILE_ID

# List available video models
node tools/clis/minimax-video.js models
```

## API Quick Start

### Submit a Text-to-Video Task

```bash
curl -X POST https://api.minimax.io/v2/video_generation \
  -H "Authorization: Bearer $MINIMAX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "MiniMax-H3",
    "content": [{
      "type": "text",
      "text": "A close-up of hands typing on a laptop, warm office lighting"
    }],
    "duration": 6,
    "resolution": "2K",
    "ratio": "16:9"
  }'
```

Accepted v2 request fields: `model`, `content`, `resolution`, `duration`, `ratio`, `callback_url`. Add `image_url` content with a `first_frame` or `last_frame` role for image-to-video.

### Poll the Task

```bash
curl "https://api.minimax.io/v2/query/video_generation/TASK_ID" \
  -H "Authorization: Bearer $MINIMAX_API_KEY"
```

Returns `task.status` and, once finished, `task.content.url`.

### v1 File Retrieval

```bash
curl "https://api.minimax.io/v1/files/retrieve?file_id=FILE_ID" \
  -H "Authorization: Bearer $MINIMAX_API_KEY"
```

The v1 API remains available for Hailuo, T2V, and I2V models. It returns `task_id`, `status`, and `file_id`; retrieve the file from `/v1/files/retrieve`.

## Common Marketing Use Cases

| Use Case | Approach |
|----------|----------|
| Hero visuals | Generate a cinematic hero shot from a scene description |
| B-roll | Text prompts for background footage you can't easily film |
| Consistent scenes | Reuse subject/style phrasing across shots for character consistency |
| Ad concept testing | Rapidly generate short clips to validate a creative direction |
| Social short-form | Vertical clips for feeds and stories |

## Relevant Skills

- video
- social
- ad-creative
