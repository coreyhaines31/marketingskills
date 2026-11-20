# Generative AI Tools for Ad Creative

Reference for using AI image generators, video generators, and code-based video tools to produce ad visuals at scale.

---

## When to Use Generative Tools

| Need | Tool Category | Best Fit |
|------|---------------|----------|
| Static ad images (banners, social) | Image generation | GPT Image, Gemini image, Flux, Ideogram |
| Ad images with text overlays | Image generation (text-capable) | Ideogram, Gemini image, Recraft |
| Short video ads (6-30 sec) | Video generation | Veo, Kling, Runway, Seedance |
| Video ads with voiceover | Video gen + voice | Veo (native), or Runway + ElevenLabs |
| Voiceover tracks for ads | Voice generation | ElevenLabs, OpenAI TTS, Cartesia |
| Multi-language ad versions | Voice generation | ElevenLabs, Cartesia |
| Brand voice cloning | Voice generation | ElevenLabs, Resemble AI |
| Product mockups and variations | Image generation + references | Flux (multi-image reference) |
| Templated video ads at scale | Code-based video | Remotion, Hyperframes |
| Personalized video (name, data) | Code-based video | Remotion, Hyperframes |
| Brand-consistent variations | Image gen + style refs | Flux, Ideogram, Gemini image |

---

## Image Generation

Models, versions, and prices here were checked against the vendors' docs on 2026-11-19. They change every few months, so follow the links before pinning a model ID or quoting a price.

### Gemini Image ("Nano Banana", Google)

Google's image generation models, available through the Gemini API.

**Fits:** Ad images, product visuals, images with short text, edits to existing images
**API:** Gemini API (Google AI Studio, Vertex AI)
**Pricing:** Per image, by model tier and resolution. See [pricing](https://ai.google.dev/gemini-api/docs/pricing)

**What the docs describe:**
- Text rendering in images (logos, headlines)
- Image editing: modify an existing image with a prompt
- Up to 14 reference images in one request
- Several tiers, from a low-cost Lite model to Pro

**Ad creative use cases:**
- Generate social media ad images from text descriptions
- Create product mockup variations
- Edit existing ad images (swap backgrounds, change colors)
- Generate images with headline text baked in

**Calling it:** Google's docs now show the Interactions API (`POST /v1beta/interactions`) for image generation and mark `gemini-2.5-flash-image` as a legacy model. Copy the current request and model ID from the docs instead of an example pinned here.

**Docs:** [Gemini Image Generation](https://ai.google.dev/gemini-api/docs/image-generation)

---

### Flux (Black Forest Labs)

Image models with API access through BFL's own API, Replicate, and fal.ai.

**Fits:** Photorealistic images, brand-consistent variations, multi-reference generation
**API:** BFL API, Replicate, fal.ai
**Pricing:** FLUX 3 Image is priced per image by resolution; FLUX.2 by megapixel. See [pricing](https://docs.bfl.ai/quick_start/pricing)

**Model lineup:**
| Model | What it is |
|-------|------------|
| FLUX 3 Image | The current family; takes up to ten reference images |
| FLUX 3 Image Klein | The lower-cost tier of the current family |
| FLUX.2 [pro], [max], [flex], [klein] | The previous family, still supported |
| FLUX.2 [dev] | Open weights for local, non-commercial use; no hosted API |

**What the docs describe:**
- Multi-image reference for consistent identity across ads
- Product consistency: the same product in different contexts
- Style transfer from reference images

**Ad creative use cases:**
- Generate 50+ ad variations with consistent product/person identity
- Create product-in-context images (your SaaS on different devices)
- Style-match to existing brand assets using reference images
- Rapid A/B test image variations

**Docs:** [BFL API](https://docs.bfl.ai/), [Replicate Flux](https://replicate.com/black-forest-labs)

---

### Ideogram

Image models focused on typography and text rendering within images.

**Fits:** Ad banners with text, branded graphics, social ad images with headlines
**API:** Ideogram API, Runware
**Pricing:** Per image, by model and quality tier. See [pricing](https://ideogram.ai/pricing/?pricing_tab=api)

**What the docs describe:**
- Text and typography in the image as the stated focus
- Style references (up to 10 images through the API), style presets, and color palettes
- Magic Prompt, which rewrites the prompt automatically unless turned off
- The 4.x models are current; 3.0 is still available

**Ad creative use cases:**
- Generate ad banners with headline text directly in the image
- Create social media graphics with branded text overlays
- Produce multiple design variations with consistent typography
- Generate promotional materials without needing a designer for each iteration

**Docs:** [Ideogram API](https://developer.ideogram.ai/), [Ideogram](https://ideogram.ai/)

---

### Other Image Tools

| Tool | Fits | API Status | Notes |
|------|------|------------|-------|
| **GPT Image** (OpenAI) | General image generation and editing | Official API | DALL-E 2 and 3 were shut down in May 2026. Take the current model ID from [OpenAI's docs](https://platform.openai.com/docs/guides/image-generation) |
| **Recraft** | Vector (SVG) output and illustration | Official API | V4.1 is the default model |
| **Midjourney** | Stylised, art-directed images | No official public API | Discord and web; unofficial APIs exist but risk bans |
| **Stable Diffusion** | Self-hosted, customizable | Open weights | Fits teams with GPU infrastructure |

---

## Video Generation

Models, limits, and prices here were checked on 2026-11-19. They change every few months, so follow the links before planning around a clip length or quoting a price. Where a vendor's own docs did not load, the row says which listing the fact came from.

### Google Veo

Google's video generation models.

**Fits:** Short video clips with generated sound, in vertical or landscape
**API:** Google Cloud (Vertex AI). Third parties such as Runway's API also host it
**Pricing:** Per second, by model. See [Google Cloud pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing)

**What the docs describe:**
- Veo 3.1 and Veo 3.1 Fast are generally available on Google Cloud (`veo-3.1-generate-001`, `veo-3.1-fast-generate-001`)
- Clips of 4, 6, or 8 seconds, so longer ads are assembled from several clips
- 9:16 and 16:9; 720p and 1080p, plus 4K on the standard model
- Sound generation, text-to-video, image-to-video, first-and-last-frame, extension, and reference images
- The Veo 3.1 preview models in the Gemini API were shut down on 22 Oct 2026. Google's Gemini API docs now point to Gemini Omni Flash, which makes 3 to 15 second clips with audio

**Ad creative use cases:**
- Generate short clips and assemble 15-30 second ads from them
- Create vertical video ads for TikTok, Reels, Shorts
- Produce product clips with generated sound
- Generate several variations of the same prompt in different styles

**Docs:** [Veo on Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/video/overview), [Gemini API video](https://ai.google.dev/gemini-api/docs/video)

---

### Kling (Kuaishou)

Video generation with audio and reference inputs.

**Fits:** Longer single clips, image-to-video, clips with sound
**API:** Kling's developer platform. Third parties such as Runway and fal.ai also host it
**Pricing:** Per second, by model and resolution. Check the provider you call it through

**What could be checked** (from Runway's listing of the models; Kling's own developer docs did not load):
- Kling 4.0 makes 3 to 30 second clips at 720p or 1080p, with audio included
- Kling 3.0 makes 3 to 15 second clips, up to 4K
- Text, frames, and image or video references as inputs

**Ad creative use cases:**
- Longer single-take product clips
- Brand videos with synchronized audio
- Animate product images into video ads

**Docs:** [Kling AI Developer](https://kling.ai/dev/model/video)

---

### Runway

Video generation and editing, with an API that also hosts other labs' models.

**Fits:** Text and image to video, editing existing footage, comparing several models through one API
**API:** Runway API
**Pricing:** Credits at $0.01 each, charged per second by model. See [API pricing](https://docs.dev.runwayml.com/guides/pricing/)

**What the docs describe:**
- Gen-4.5 for text and image to video, Gen-4 Turbo for image to video, and Aleph for video-to-video editing
- Other labs' models through the same API, including Veo, Kling, and Seedance
- Duration, resolution, and control features differ by model; check the model page before planning a shot

**Ad creative use cases:**
- Generate video ads from a reference frame
- Restyle or edit existing footage to match brand aesthetics
- Run the same brief through several models with one key

**Docs:** [Runway API](https://docs.dev.runwayml.com/)

---

### Seedance (ByteDance)

ByteDance's video models, which generate audio and video together and take several kinds of reference.

**Fits:** Clips with sound generated in one pass, generation guided by image, video, and audio references
**API:** BytePlus ModelArk (official). Third parties such as Runway, Replicate, and fal.ai also host it
**Pricing:** Per second, by model and resolution. Check the provider you call it through

**What could be checked:**
- ByteDance describes Seedance 2.0 as joint audio-video generation that accepts text, image, audio, and video inputs and references
- Seedance 2.5 is listed next to 2.0 on BytePlus. Runway's listing gives it up to 30 seconds per clip and resolutions up to 4K
- Lower-cost Fast and Mini tiers exist for 2.0

**Ad creative use cases:**
- Video ads with synchronized voiceover and sound effects in one pass
- Multi-reference generation (product images, brand assets, style references)
- Fast iteration on video ad concepts with the lower-cost tiers

**Docs:** [Seedance](https://seed.bytedance.com/en/seedance2_0)

---

### Higgsfield

A video creation app built around camera-move control.

**Fits:** Social video ads where the camera move is the idea
**Platform:** [higgsfield.ai](https://higgsfield.ai/), web and mobile. No public API is stated; its site lists an MCP connector for Claude

**What the site describes:**
- Camera moves chosen as tags (static, handheld, zoom, pan)
- An editing room that changes the angle, light, and camera of an existing video
- Cinema Studio: up to one minute per generation, in 4K
- Other labs' models available inside the app

**Ad creative use cases:**
- Social media video ads with a deliberate camera move
- Animate product images into dynamic video
- Several variations of one shot with different camera styles

---

### Video Tool Comparison

| Tool | Clip length | Audio | API | Fits |
|------|-------------|-------|-----|------|
| **Veo 3.1** | 4, 6, or 8 sec | Generated | Google Cloud; third parties | Short clips with sound, vertical or landscape |
| **Kling 4.0** | 3-30 sec (Runway's listing) | Included | Kling; third parties | Longer single clips |
| **Runway Gen-4.5** | See docs | See docs | Official | Reference-frame generation, video-to-video editing |
| **Seedance 2.5** | Up to 30 sec (Runway's listing) | Generated with the video | BytePlus; third parties | Multi-reference generation |
| **Higgsfield** | Up to 1 min (Cinema Studio) | See site | None stated | Camera-move control |

---

## Voice & Audio Generation

For layering realistic voiceovers onto video ads, adding narration to product demos, or generating audio for code-rendered videos. These tools turn ad scripts into natural-sounding voice tracks.

### When to Use Voice Tools

Many video generators (Veo, Kling, Seedance) now include native audio. Use standalone voice tools when you need:

- **Voiceover on silent video** — add a voice track to silent AI-generated clips or code-rendered templates
- **Brand voice consistency** — Clone a specific voice for all ads
- **Multi-language versions** — Same ad script in 20+ languages
- **Script iteration** — Re-record voiceover without reshooting video
- **Precise control** — Exact timing, emotion, and pacing

---

### ElevenLabs

Voice generation and voice cloning platform.

**Fits:** Voiceovers, brand voice cloning, multilingual versions
**API:** REST API with streaming support
**Pricing:** Plans with monthly credits; text to speech costs about 1 credit per character. See [pricing](https://elevenlabs.io/pricing)

**What the docs describe:**
- 90+ languages on the v4 models; 29 on Multilingual v2
- Voice cloning from a short clip (instant) or longer recordings (professional)
- Streaming for real-time generation
- A voice library of pre-built voices

**Ad creative use cases:**
- Generate voiceover tracks for video ads
- Clone your brand spokesperson's voice for all ad variations
- Produce the same ad in 10+ languages from one script
- A/B test different voice styles (authoritative vs. friendly vs. urgent)

**API example:**
```bash
curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}" \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Stop wasting hours on manual reporting. Try DataFlow free for 14 days.",
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
  }' --output voiceover.mp3
```

`eleven_multilingual_v2` is the API's default model. The vendor's [models page](https://elevenlabs.io/docs/models) lists the newer `eleven_v4` for quality and `eleven_v4_turbo` for low latency.

**Docs:** [ElevenLabs API](https://elevenlabs.io/docs/api-reference/text-to-speech/convert)

---

### OpenAI TTS

Text-to-speech in the OpenAI API.

**Fits:** Quick voiceovers and drafts when you already use the OpenAI API
**API:** OpenAI API (same SDK as the GPT models)
**Pricing:** See [OpenAI pricing](https://platform.openai.com/docs/pricing)

**What the docs describe:**
- Built-in voices (the guide lists 13)
- Custom voices created from a speaker's consent recording and a matching sample
- Real-time streaming
- **A shutdown date:** `tts-1`, `tts-1-hd`, and `gpt-4o-mini-tts` shut down on 6 Jan 2027. Check the guide for the replacement before building on them

**Ad creative use cases:**
- Fast voiceover for draft and test ad versions
- High-volume narration
- Prototype ad audio before investing in a cloned voice

**Docs:** [OpenAI TTS](https://platform.openai.com/docs/guides/text-to-speech)

---

### Cartesia Sonic

Voice generation built for real-time applications.

**Fits:** Real-time and interactive voice, streaming
**API:** REST + WebSocket streaming
**Pricing:** A free tier and paid plans, billed in credits at about 1 per character. See [pricing](https://cartesia.ai/pricing)

**What the docs describe:**
- `sonic-3.6` is the current model
- 44 languages
- Instant and professional voice cloning
- Pacing and intonation that follow the emotional context of the text, without markup tags
- Streaming API for real-time generation

**Ad creative use cases:**
- Real-time ad preview during creative iteration
- Interactive demo videos with dynamic narration
- Voiceovers in a cloned brand voice

**Docs:** [Cartesia Sonic](https://docs.cartesia.ai/build-with-cartesia/tts-models/latest)

---

### Voicebox (Open Source)

A free voice synthesis studio that runs on your own machine, with several open TTS engines behind it.

**Fits:** Voice cloning at no per-character cost, private or pre-launch material that shouldn't leave the machine
**API:** Local REST API at `http://127.0.0.1:17493`
**Pricing:** Free (MIT license). Runs entirely on your machine.
**Stack:** Tauri (Rust) + React + FastAPI (Python)

**What the project describes:**
- Eight TTS engines, including Qwen3-TTS, Chatterbox, and Kokoro
- 23 languages across the engines; some engines are English only
- Voice cloning from short audio samples
- Multi-track timeline editor for composing conversations
- GPU acceleration on Apple Silicon, NVIDIA, and AMD
- No cloud dependency: all processing on-device

**Ad creative use cases:**
- Voice cloning for a brand spokesperson across all ad variations
- Batch-generate voiceovers without per-character costs
- Private, local generation when ad content is sensitive or pre-launch
- Prototype voice variations before committing to a paid service

**API example:**
```bash
curl -X POST http://127.0.0.1:17493/generate \
  -H "Content-Type: application/json" \
  -d '{"text": "Stop wasting hours on manual reporting.", "profile_id": "abc123", "language": "en"}'
```

**Install:** Desktop apps for macOS and Windows at [voicebox.sh](https://voicebox.sh); Linux builds from source:
```bash
git clone https://github.com/jamiepine/voicebox.git
cd voicebox && make setup && make dev
```

**Docs:** [GitHub](https://github.com/jamiepine/voicebox)

---

### Other Voice Tools

| Tool | Fits | What the vendor states | Site |
|------|------|------------------------|------|
| **Resemble AI** | Enterprise voice work that must stay in-house | On-premise, containerized deployment | [resemble.ai](https://www.resemble.ai/) |
| **WellSaid Labs** | Licensed voices for commercial use | Voices recorded by consenting, paid voice actors; 55+ languages and accents | [wellsaid.io](https://www.wellsaid.io/) |
| **Fish Audio** | Voice cloning with emotion control | Cloning from a short sample, emotion tags, 30+ languages | [fish.audio](https://fish.audio/) |
| **Murf AI** | Non-technical teams | Browser-based studio, 200+ voices, 35+ languages | [murf.ai](https://murf.ai/) |
| **Google Cloud TTS** | Teams on Google Cloud | Part of Google Cloud; check its voice list | [Google TTS](https://cloud.google.com/text-to-speech) |
| **Amazon Polly** | Teams on AWS | SSML control; 100+ voices in 40+ languages and variants | [Amazon Polly](https://aws.amazon.com/polly/) |

---

### Voice Tool Comparison

Vendor-stated facts, checked 2026-11-19. Quality is a matter of ear: test a short script in two or three.

| Tool | Voice cloning | Languages | Runs |
|------|---------------|-----------|------|
| **ElevenLabs** | Instant and professional | 90+ on v4 models | Cloud API |
| **OpenAI TTS** | Custom voices from a consent recording | See the guide | Cloud API |
| **Cartesia Sonic** | Instant and professional | 44 | Cloud API |
| **Fish Audio** | From a short sample | 30+ | Cloud API |
| **WellSaid** | Licensed actor voices | 55+ languages and accents | Cloud API |
| **Voicebox** | Yes, local | 23 across engines | Your machine (open source) |

### Voice Tool Options by Need

These are options to evaluate, not rankings. Test a short script in two or three tools and judge by ear; check each vendor's current pricing and language list.

```
Need voiceover for ads?
├── Clone a specific brand voice → options include ElevenLabs, Cartesia, Fish Audio, Resemble AI (on-premise)
├── Multilingual (same ad, many languages) → options include ElevenLabs, Cartesia, WellSaid Labs
├── Free / open source / local → options include Voicebox
├── Already on the OpenAI API → options include OpenAI TTS (check the model shutdown date)
├── Actor-compensated voice licensing → options include WellSaid Labs
└── Real-time / interactive → options include Cartesia Sonic
```

### Workflow: Voice + Video

```
1. Write ad script (use ad-creative skill for copy)
2. Generate voiceover with ElevenLabs/OpenAI TTS
3. Generate or render video:
   a. Silent video (AI-generated or code-rendered) → layer voice track
   b. Or use Veo/Seedance with native audio (skip separate VO)
4. Combine with ffmpeg if layering separately:
   ffmpeg -i video.mp4 -i voiceover.mp3 -c:v copy -c:a aac output.mp4
5. Generate variations (different scripts, voices, or languages)
```

---

## Code-Based Video

For templated, data-driven video ads, render video from code instead of prompts. Unlike AI video generators that produce unique video each time, code-based frameworks render deterministic, brand-exact video from templates and data. Two common options are **Remotion** (React components) and **Hyperframes** (HTML files). For how they differ and how to pick, see the `video` skill; for licensing and current features, check each project's docs ([remotion.dev](https://www.remotion.dev/docs), [hyperframes.heygen.com](https://hyperframes.heygen.com/introduction)).

**Fits:** Templated ad variations, personalized video, brand-consistent production

### Why Code-Based Video for Ads

| AI Video Generators | Code-based video |
|---------------------|----------|
| Unique output each time | Deterministic, pixel-perfect |
| Prompt-based, less control | Full code control over every frame |
| Hard to match brand exactly | Exact brand colors, fonts, spacing |
| One-at-a-time generation | Batch render hundreds from data |
| No dynamic data insertion | Personalize with names, prices, stats |

### Ad Creative Use Cases

**1. Dynamic product ads**
Feed a JSON array of products and render a unique video ad for each. Example in Remotion (the same template works as an HTML composition in Hyperframes):
```tsx
// Simplified Remotion component for product ads
export const ProductAd: React.FC<{
  productName: string;
  price: string;
  imageUrl: string;
  tagline: string;
}> = ({productName, price, imageUrl, tagline}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#fff'}}>
      <Img src={imageUrl} style={{width: 400, height: 400}} />
      <h1>{productName}</h1>
      <p>{tagline}</p>
      <div className="price">{price}</div>
      <div className="cta">Shop Now</div>
    </AbsoluteFill>
  );
};
```

**2. A/B test video variations**
Render the same template with different headlines, CTAs, or color schemes:
```tsx
const variations = [
  {headline: "Save 50% Today", cta: "Get the Deal", theme: "urgent"},
  {headline: "Join 10K+ Teams", cta: "Start Free", theme: "social-proof"},
  {headline: "Built for Speed", cta: "Try It Now", theme: "benefit"},
];
// Render all variations programmatically
```

**3. Personalized outreach videos**
Generate videos addressing prospects by name for cold outreach or sales.

**4. Social ad batch production**
Render the same content in each aspect ratio, with one composition (layout) per ratio:
- 1:1 for feed
- 9:16 for Stories/Reels
- 16:9 for YouTube

Each ratio needs its own layout: a Hyperframes file renders only at its own ratio, and a product photo framed for 9:16 crops in 16:9. Check the peak-zoom frame of every size for a cut-off product, logo, or text (see the [Hyperframes guide](https://github.com/coreyhaines31/marketingskills/blob/main/tools/integrations/hyperframes.md#product-photos)).

### Code-Based Workflow for Ad Creative

```
1. Design the template, one layout per aspect ratio (or have an AI agent write it)
2. Define data schema (products, headlines, CTAs, images)
3. Feed data array into template
4. Batch render all variations and check frames in every size
5. Upload to ad platform
```

### Getting Started

Remotion commands below; for Hyperframes setup, see the `video` skill.

```bash
# Create a new Remotion project
npx create-video@latest

# Render a single video
npx remotion render src/index.ts MyComposition out/video.mp4

# Batch render from data
npx remotion render src/index.ts MyComposition --props='{"data": [...]}'
```

---

## Choosing the Right Tool

### Options by Need

Start from the approach (code-based vs AI generation), then pick a tool. The tools listed are options to evaluate, not rankings: models change quickly, so run the same brief through two or three and compare the output, and check current versions and pricing on each vendor's site.

```
Need video ads?
├── Templated, data-driven (same structure, different data)
│   └── Code-based video (Remotion, Hyperframes; see the video skill)
├── Unique creative from prompts (exploratory)
│   ├── Dialogue/voiceover in the clip → options include Veo, Kling, Seedance
│   ├── Consistency across scenes → options include models that take reference images (Veo, Seedance, Kling)
│   ├── Native vertical (9:16) output → options include Veo
│   ├── High volume at low cost → options include the Fast, Lite, or Mini tiers of Veo, Kling, and Seedance
│   └── Cinematic camera work → options include Higgsfield, Kling
└── Both → AI generation for hero creative, code-based video for variations

Need image ads?
├── Text/headlines in the image → options include Ideogram, Gemini image, Recraft
├── Product consistency across variations → options include Flux and Gemini image (multi-reference)
├── Quick iterations on existing images → options include Gemini image, GPT Image
├── Polished final assets → options include Flux, Midjourney
└── High volume at low cost → options include Flux's Klein tier, Gemini's Lite image model
```

### Cost Comparison for 100 Ad Variations

Rough order-of-magnitude estimates to compare approaches, not quotes. Prices change often; verify on each vendor's pricing page before budgeting.

| Approach | Tool | Approximate Cost |
|----------|------|-----------------|
| 100 static images | An image API | ~$3-25, at the $0.03-0.25 per image published by the vendors checked on 2026-11-19 |
| 100 × 15-sec videos | Veo 3.1 Fast through Runway's API ($0.15 per second with audio, checked 2026-11-19) | ~$225 |
| 100 × 15-sec videos | Code-based video (templated) | Render compute only (self-hosted); check license terms |
| 10 hero videos + 90 templated | Veo + code-based video | ~$22 + render time |

### Workflow for Scaled Ad Production

1. **Generate hero creative** with AI (Nano Banana, Flux, Veo) — high-quality, exploratory
2. **Build templates** in code (Remotion or Hyperframes) based on winning creative patterns
3. **Batch produce variations** from data (products, headlines, CTAs)
4. **Iterate** — use AI tools for new angles, code-based templates for scale

This hybrid approach gives you the creative exploration of AI generators and the consistency and scale of code-based rendering.

---

## Platform-Specific Image Specs

When generating images for ads, request the correct dimensions:

| Platform | Placement | Aspect Ratio | Recommended Size |
|----------|-----------|-------------|-----------------|
| Meta Feed | Single image | 1:1 | 1080x1080 |
| Meta Stories/Reels | Vertical | 9:16 | 1080x1920 |
| Meta Carousel | Square | 1:1 | 1080x1080 |
| Google Display | Landscape | 1.91:1 | 1200x628 |
| Google Display | Square | 1:1 | 1200x1200 |
| LinkedIn Feed | Landscape | 1.91:1 | 1200x627 |
| LinkedIn Feed | Square | 1:1 | 1200x1200 |
| TikTok Feed | Vertical | 9:16 | 1080x1920 |
| Twitter/X Feed | Landscape | 16:9 | 1200x675 |
| Twitter/X Card | Landscape | 1.91:1 | 800x418 |

Include these dimensions in your generation prompts to avoid needing to crop or resize.
