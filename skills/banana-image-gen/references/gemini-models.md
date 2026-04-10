# Gemini Image Generation Models

> Last updated: 2026-03-19
> Aligned with Google's March 2026 API state

## Available Models

### gemini-3.1-flash-image-preview -- Nano Banana 2 (DEFAULT)
| Property | Value |
|----------|-------|
| **Model ID** | `gemini-3.1-flash-image-preview` |
| **Tier** | Nano Banana 2 (Flash) |
| **Status** | Preview -- **Active, recommended default** |
| **Speed** | Fast -- optimized for high-volume use |
| **Aspect Ratios** | All 14 ratios including extreme: 1:4, 4:1, 1:8, 8:1 (see table below) |
| **Max Resolution** | Up to 4096×4096 (4K tier) |
| **Input Tokens** | 131,072 |
| **Features** | Google Search grounding (web + image), thinking levels, image-only output, extreme aspect ratios |
| **Rate Limits (Free)** | ~5-15 RPM / ~20-500 RPD (per project, resets midnight Pacific. Cut ~92% Dec 2025) |
| **Output Tokens** | ~1,290 output tokens per image |
| **Best For** | All standard production generation and editing -- most use cases |

### gemini-2.5-flash-image -- Nano Banana (Original)
| Property | Value |
|----------|-------|
| **Model ID** | `gemini-2.5-flash-image` |
| **Tier** | Nano Banana (Flash, original generation) |
| **Status** | GA -- **Active** |
| **Speed** | Fast |
| **Aspect Ratios** | 1:1, 16:9, 9:16, 4:3, 3:4, 2:3, 3:2, 4:5, 5:4, 21:9 (10 ratios) |
| **Max Resolution** | Up to 1024×1024 (1K tier) |
| **Input Tokens** | 32,768 |
| **Rate Limits (Free)** | ~5-15 RPM / ~20-500 RPD |
| **Best For** | Free-tier users, budget-conscious high-volume workflows, 1K-resolution use cases |
| **Cost** | ~$0.039/image at 1K |

## ⛔ DEPRECATED -- Nano Banana Pro (gemini-3-pro-image-preview)

<!-- REMOVED 2026-03-19: gemini-3-pro-image-preview shut down by Google March 9, 2026 -->

**Shut down by Google on March 9, 2026.** API calls to this model ID will fail
with a hard error. Do not use. The replacement is Nano Banana 2
(`gemini-3.1-flash-image-preview`).

**Was:** Nano Banana Pro tier -- professional asset production, 4K output, 14 reference images, 94% text accuracy.

**Migration:** Replace all references to `gemini-3-pro-image-preview` with `gemini-3.1-flash-image-preview`.

## Deprecated Models (DO NOT USE)

### gemini-2.0-flash-exp
- **Status:** Deprecated, replaced by gemini-2.5-flash-image

## Domain-to-Model Routing

| Domain Mode | Recommended Model | Reason |
|---|---|---|
| Cinema, Landscape, Abstract | Nano Banana 2 | Thinking mode improves complex compositions |
| Product, Portrait | Nano Banana 2 | 2K/4K resolution for fidelity |
| UI, Infographic | Nano Banana 2 | Search grounding for factual diagrams |
| Logo | Nano Banana 2 | Text rendering improvements in 3.1 |
| Editorial | Nano Banana 2 | Default |
| Free tier / budget | Nano Banana (original) | $0.039/image, still excellent |

## Resolution Defaults by Domain

| Domain | Default `imageSize` | Rationale |
|--------|-------------------|-----------|
| Portrait, Product, Logo | `2K` | Fine detail and text fidelity |
| Cinema, Landscape | `2K` + widescreen ratio | Atmospheric depth at larger canvas |
| UI, Infographic | `1K` | Structured output doesn't benefit from 4K |
| Quick draft / preview | `512` (Nano Banana 2 only) | Rapid iteration |
| Print / high fidelity | `4K` | Maximum resolution for physical output |

## Aspect Ratios

All 14 supported ratios. Availability varies by model:

| Ratio | Orientation | Use Cases | NB2 (3.1 Flash) | NB (2.5 Flash) |
|-------|-------------|-----------|:----------------:|:--------------:|
| `1:1` | Square | Social posts, avatars, thumbnails | ✅ | ✅ |
| `16:9` | Landscape | Blog headers, YouTube thumbnails, presentations | ✅ | ✅ |
| `9:16` | Portrait | Stories, Reels, TikTok, mobile | ✅ | ✅ |
| `4:3` | Landscape | Product shots, classic display | ✅ | ✅ |
| `3:4` | Portrait | Book covers, portrait framing | ✅ | ✅ |
| `2:3` | Portrait | Pinterest pins, posters | ✅ | ✅ |
| `3:2` | Landscape | DSLR standard, photo prints | ✅ | ✅ |
| `4:5` | Portrait | Instagram portrait, social | ✅ | ✅ |
| `5:4` | Landscape | Large format photography | ✅ | ✅ |
| `21:9` | Ultra-wide | Cinematic, film-grade, ultra-wide monitors | ✅ | ✅ |
| `1:4` | Tall strip | Vertical banners, side panels | ✅ | ❌ |
| `4:1` | Wide strip | Website banners, headers | ✅ | ❌ |
| `1:8` | Extreme tall | Narrow vertical strips | ✅ | ❌ |
| `8:1` | Extreme wide | Ultra-wide banners | ✅ | ❌ |

## Resolution Tiers

Control output resolution with the `imageSize` parameter. Note the **UPPERCASE** requirement -- lowercase values are silently rejected.

| `imageSize` Value | Pixel Range | Model Availability | Use Case |
|-------------------|-------------|-------------------|----------|
| `512` | Up to 512×512 | Nano Banana 2 only | Drafts, quick iteration, low bandwidth |
| `1K` | Up to 1024×1024 | All models | Standard web use, social media |
| `2K` | Up to 2048×2048 | Nano Banana 2 only | Quality assets, detailed work |
| `4K` | Up to 4096×4096 | Nano Banana 2 only | Print production, hero images, final assets |

**Notes:**
- Actual pixel dimensions depend on aspect ratio (e.g., 4K at 16:9 = 4096×2304)
- Higher resolutions consume more tokens and cost more
- The API default is `1K` if `imageSize` is omitted. The banana skill defaults to `2K` -- always pass `imageSize` explicitly
- `imageSize` value MUST be uppercase -- `"2k"` will be silently ignored

## API Configuration

### Endpoint
```
https://generativelanguage.googleapis.com/v1beta/models/{model-id}:generateContent
```

### Required Parameters
```json
{
  "contents": [{"parts": [{"text": "your prompt here"}]}],
  "generationConfig": {
    "responseModalities": ["TEXT", "IMAGE"],
    "imageConfig": {
      "aspectRatio": "16:9",
      "imageSize": "2K"
    }
  }
}
```

### Image-Only Output Mode
Force the model to return only an image (no text response):
```json
{
  "generationConfig": {
    "responseModalities": ["IMAGE"]
  }
}
```

### Thinking Level
Control how much the model "thinks" before generating. Higher levels improve complex compositions but increase latency:
```json
{
  "generationConfig": {
    "thinkingConfig": {
      "thinkingLevel": "medium"
    }
  }
}
```
Levels: `minimal`, `low`, `medium`, `high`

### Google Search Grounding
Ground generation in real-world visual references. Supports web and image search (Nano Banana 2):
```json
{
  "tools": [{"googleSearch": {}}]
}
```
**Prompt pattern:** `[Search/source request] + [Analytical task] + [Visual translation]`

Example: "Search for the latest SpaceX Starship design, analyze its proportions and markings, then generate a photorealistic image of it at sunset on the launch pad."

### Multi-Image Input
Up to 14 reference images can be provided:
- **10 object references** -- for style, composition, or visual matching
- **4 character references** -- assign distinct names to preserve features across generations

Useful for character consistency, style transfer, and brand-aligned generation.

## Rate Limits by Tier

| Tier | RPM | RPD | Notes |
|------|-----|-----|-------|
| Free | ~5-15 | ~20-500 | Per project, resets midnight Pacific. Cut ~92% Dec 2025. |
| Tier 1 (billing enabled) | 150-300 | 1,500-10,000 | Production workloads |
| Tier 2 ($250+ spend) | 1,000+ | Unlimited | High-volume |
| Enterprise | Custom | Custom | Contact Google |

## Pricing

| Model | Resolution | Cost per Image | Notes |
|-------|-----------|---------------|-------|
| NB2 (3.1 Flash) | 1K | ~$0.067 | Standard |
| NB2 (3.1 Flash) | 2K | ~$0.134 | 2x standard |
| NB2 (3.1 Flash) | 4K | ~$0.268 | 4x standard |
| NB (2.5 Flash) | 1K | ~$0.039 | Previous gen, budget option |
| Batch API | Any | 50% discount | Asynchronous, higher latency |

Pricing is approximate and based on ~1,290 output tokens per image.

## Image Output Specs

| Property | Value |
|----------|-------|
| **Format** | PNG |
| **Max Resolution** | Up to 4096×4096 (4K tier, Nano Banana 2) |
| **Color Space** | sRGB |
| **Text Rendering** | Supported -- excellent under 25 characters |
| **Style Control** | Via prompt engineering |

## Safety Filters

Gemini uses a two-layer safety architecture:

1. **Input filters** -- block prompts containing prohibited content before generation
2. **Output filters** -- analyze generated images and block unsafe results

| `finishReason` | Meaning | Retryable? |
|----------------|---------|:----------:|
| `STOP` | Successful generation | N/A |
| `IMAGE_SAFETY` | Output blocked by safety filter | Rephrase prompt |
| `PROHIBITED_CONTENT` | Content policy violation | No -- topic is blocked |
| `SAFETY` | General safety block | Rephrase prompt |
| `RECITATION` | Detected copyrighted content | Rephrase prompt |

**Known issue:** Filters are known to be overly cautious -- benign prompts may be blocked. Iterate with rephrased wording if this happens.

## Content Credentials

- **SynthID watermarks** are always embedded in generated images (invisible, machine-readable)
- **C2PA metadata** is included on paid outputs (verifiable provenance chain)

## Key Limitations
- No video generation (image only)
- No transparent backgrounds (PNG but always with background -- use green screen workaround)
- Text rendering quality varies -- keep text under 25 characters for best results
- Safety filters may block some prompts (violence, NSFW, public figures) -- known to be overly cautious
- Session context resets between Claude Code conversations
- `imageSize` values MUST be uppercase -- lowercase fails silently
- Gemini generates ONE image per API call -- no batch parameter exists
- No negative prompt parameter -- use semantic reframing instead
