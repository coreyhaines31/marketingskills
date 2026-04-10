# MCP Tools Reference -- @ycse/nanobanana-mcp

> Package: `@ycse/nanobanana-mcp`
> GitHub: https://github.com/YCSE/nanobanana-mcp

## Tools

### gemini_generate_image
Generate an image from a text prompt.

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Text description of the image to generate |

**Returns:** Image data + file path (saved to `~/Documents/nanobanana_generated/`)

**Example usage in Claude Code:**
```
User: "Generate a sunset over mountains in watercolor style"
→ Claude calls gemini_generate_image with prompt
→ Returns image path and description
```

### gemini_edit_image
Edit an existing image with text instructions.

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `imagePath` | string | Yes | Path to the image file to edit |
| `prompt` | string | Yes | Edit instructions |

**Returns:** Modified image data + file path

**Example:**
```
User: "Remove the background from ~/Documents/photo.png"
→ Claude calls gemini_edit_image with path and instruction
```

### gemini_chat
Multi-turn visual conversation maintaining session context.

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | Chat message (can reference previous images) |

**Returns:** Text response + optional image

**Key feature:** Session consistency -- maintains style, characters, and context across turns. Great for iterative refinement.

### set_aspect_ratio
Configure the aspect ratio for subsequent image generations.

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `ratio` | string | Yes | Aspect ratio (e.g., "16:9", "1:1", "9:16") |

**Supported ratios:** 1:1, 16:9, 9:16, 4:3, 3:4, 2:3, 3:2, 4:5, 5:4, 1:4, 4:1, 1:8, 8:1, 21:9

### set_model
Switch the active Gemini model.

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | Model identifier |

**Available models:**
- `gemini-3.1-flash-image-preview` (default, recommended -- Nano Banana 2)
- `gemini-2.5-flash-image` (stable fallback -- Nano Banana original)
<!-- REMOVED 2026-03-19: gemini-3-pro-image-preview shut down by Google March 9, 2026. Do not use. -->

### get_image_history
Retrieve list of images generated in the current session.

**Parameters:** None

**Returns:** Array of image entries with paths and prompts

### clear_conversation
Reset session context and conversation history.

**Parameters:** None

**Returns:** Confirmation of reset

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_AI_API_KEY` | Yes | API key from https://aistudio.google.com/apikey |
| `NANOBANANA_MODEL` | No | Override default model (default: `gemini-3.1-flash-image-preview`) |

## Output Directory
All generated images are saved to: `~/Documents/nanobanana_generated/`

Images are named with timestamps for easy identification.

## Feature Availability via MCP

Some newer Gemini API features depend on the MCP package version of `@ycse/nanobanana-mcp`. Check the package version to confirm support:

| Feature | API Status | MCP Support |
|---------|-----------|-------------|
| `imageSize` (resolution control) | Available | Depends on package version |
| Thinking level (`thinkingConfig`) | Available | Depends on package version |
| Search grounding (`googleSearch`) | Available | Depends on package version |
| Image-only output (`responseModalities: ["IMAGE"]`) | Available | Depends on package version |
| Multi-image input (up to 14 refs) | Available | Via `gemini_chat` with image paths |
| All 14 aspect ratios | Available | Via `set_aspect_ratio` |

If a feature is not yet supported by the MCP package, you can still use it via direct API calls with the fallback scripts (`scripts/generate.py` and `scripts/edit.py`).

## ImageConfig Parameter Reference

| Parameter | Type | Valid values | Default | Critical notes |
|---|---|---|---|---|
| `aspect_ratio` | string | "1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9", "1:4"*, "4:1"*, "1:8"*, "8:1"* | "1:1" | * = Nano Banana 2 only |
| `image_size` | string | "512"*, "1K", "2K"*, "4K"* | "1K" | MUST be uppercase. "2k" silently fails. * = Nano Banana 2 only |
| `person_generation` | string | "ALLOW_ALL", "ALLOW_ADULT", "ALLOW_NONE" | Varies | ALLOW_ALL restricted in EU/UK |

## ❌ Parameters That Do NOT Exist for Gemini Image Models

These are common copy-paste errors from Imagen or other model documentation.
Passing them will not cause errors -- they will be silently ignored.

- `numberOfImages` / `n` / `sampleCount` -- Gemini generates ONE image per call. These are Imagen-only. There is no batch parameter.
- `negativePrompt` -- See prompt-engineering.md for the correct approach (semantic reframing).
- `output_mime_type` -- Vertex AI only, not available in Gemini API.
- `candidate_count` -- Only 1 supported for image models.
- `seed` -- Not supported for reproducible generation.

## Error Response Taxonomy

| Error type | Cause | Correct response |
|---|---|---|
| HTTP 429 | Rate limit | Exponential backoff. Free tier: ~5-15 RPM. |
| HTTP 400 FAILED_PRECONDITION | Billing not enabled | User must enable billing in Google AI Studio |
| `finishReason: "IMAGE_SAFETY"` | Content policy block | Apply safety rephrase from prompt-engineering.md, retry once |
| Empty `parts` in response | Wrong `response_modalities` | Must include "IMAGE" in responseModalities |
| `thought_signature` missing | Multi-turn editing on Gemini 3 | Preserve this field from previous response for edit continuity |
