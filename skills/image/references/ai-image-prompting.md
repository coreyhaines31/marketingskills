# AI Image Prompting Guide

How to write effective prompts for AI image generation models (Gemini/Nano Banana, Flux, Ideogram, DALL-E, Midjourney).

---

## Prompt Structure

A strong image prompt follows this formula:

```
[Subject] + [Setting/context] + [Visual style] + [Lighting] + [Composition] + [Technical specs]
```

### Example Prompts by Use Case

**Blog hero — SaaS product:**
```
A clean workspace with a laptop displaying a colorful analytics dashboard,
minimalist desk with a coffee cup and notebook,
bright natural window lighting from the right,
shallow depth of field, commercial photography style,
1200x630, high resolution
```

**Social media graphic — announcement:**
```
Abstract flowing gradient in deep purple and electric blue,
geometric shapes forming a network pattern,
dramatic rim lighting on edges,
modern tech aesthetic, clean and minimal,
1080x1080, vibrant colors
```

**Product lifestyle shot:**
```
A person in a modern office smiling while looking at a tablet,
showing a project management interface on screen,
warm candid photography, natural lighting,
medium shot, shallow depth of field, editorial style
```

**Profile banner — professional:**
```
Wide panoramic abstract background in navy blue and teal,
subtle geometric grid pattern with soft gradient,
clean corporate aesthetic, muted lighting,
1584x396, no text, space for logo overlay on left third
```

**Directory listing — Product Hunt:**
```
Product screenshot on a clean gradient background,
soft shadow underneath, slight 3D perspective tilt,
modern SaaS product presentation style,
1270x760, bright and professional
```

---

## Style Keywords

### Photorealistic
- "commercial photography"
- "shot on Canon EOS R5"
- "editorial style"
- "natural lighting"
- "shallow depth of field"

### Clean/Corporate
- "clean modern aesthetic"
- "minimal design"
- "professional corporate style"
- "bright and airy"
- "white background"

### Illustrative
- "flat vector illustration"
- "isometric 3D render"
- "hand-drawn sketch style"
- "watercolor illustration"
- "line art"

### Abstract/Brand
- "flowing gradient"
- "geometric pattern"
- "abstract data visualization"
- "particle effects"
- "holographic iridescent"

### Tech/SaaS
- "dark mode UI aesthetic"
- "neon accent lighting"
- "glassmorphism"
- "futuristic minimal"
- "developer-focused"

---

## Lighting Keywords

| Term | Effect | Best For |
|------|--------|----------|
| **Natural light** | Warm, organic feel | Lifestyle, editorial |
| **Studio lighting** | Even, controlled | Product shots |
| **Rim lighting** | Edge highlights, dramatic | Hero images, abstract |
| **Soft directional** | Gentle shadows, dimensional | Blog headers |
| **Volumetric** | Light rays, atmospheric | Dramatic, cinematic |
| **Flat/even** | No shadows, clean | Icons, diagrams |
| **Golden hour** | Warm orange tones | Lifestyle, outdoor |
| **High key** | Bright, minimal shadows | Clean, corporate |

---

## Composition Keywords

| Term | Effect | Best For |
|------|--------|----------|
| **Rule of thirds** | Subject off-center | Editorial, lifestyle |
| **Centered** | Subject in middle | Product shots, icons |
| **Wide/panoramic** | Expansive view | Banners, headers |
| **Close-up/macro** | Detail focus | Texture, product detail |
| **Bird's eye/overhead** | Top-down view | Desk setups, flat lays |
| **Negative space** | Room for text overlay | Blog headers, banners |
| **Symmetrical** | Balanced, formal | Corporate, luxury |

---

## Model-Specific Tips

### Gemini Image (Google)

- Best all-around for marketing images — good quality, reasonable cost
- Supports **image editing** — upload an existing image and describe changes
- Decent text rendering — can handle short headlines
- Specify "high resolution" for best output
- Works well with detailed, descriptive prompts
- Same API as text generation — easy to integrate

### Flux (Black Forest Labs)

- **Multi-image reference** is the killer feature — upload product screenshots, brand assets, or style references
- Best for **brand consistency** across a set of images
- Use Flux Pro for final assets, Flux Dev for rapid iteration
- Flux Klein for high-volume batch generation (cheapest)
- Style transfer via reference images > style keywords in prompt
- Prompts can be shorter than other models — the references do heavy lifting

### Ideogram

- **Best text rendering** of any model (industry-leading accuracy)
- Use when you need headlines, taglines, or brand names in the image
- Style reference system (up to 3 images) for brand consistency
- Supports "Magic Prompt" auto-enhancement
- Keep text requests simple — 3-5 words max for reliability
- Best for social graphics and banners that need text baked in

### GPT Image (OpenAI)

- Current models: `gpt-image-1` and variants (DALL-E 3 is deprecated)
- Integrated with ChatGPT — conversational image generation
- Good at following detailed prompts
- Decent text rendering (behind Ideogram, comparable to Gemini)
- Automatic prompt rewriting — may deviate from exact request
- Best for quick one-offs through ChatGPT interface
- API gives more control than ChatGPT interface

### Midjourney

- Highest aesthetic quality for artistic/editorial images
- No official API — Discord-based or web interface
- **Not agent-friendly** — use for manual creative exploration only
- Style flags: `--style raw` for less stylized, `--ar 16:9` for aspect ratio
- Best for hero images where pure visual quality matters most
- V6+ has improved text rendering but still unreliable

---

## Common Prompt Mistakes

| Mistake | Why It Fails | Fix |
|---------|-------------|-----|
| "A professional image" | No visual detail | Describe subject, setting, style, lighting |
| Long paragraph of text in image | Models can't render paragraphs | 3-5 words max; add text in post |
| "Make it look good" | Not actionable | Specify style: "commercial photography, bright" |
| 200+ word prompts | Models lose focus | 40-80 words, specific over comprehensive |
| No aspect ratio | Random output size | Always specify dimensions or ratio |
| "Logo in bottom right" | Unreliable placement | Add logos in post-processing |
| "Make it viral" | Not a visual instruction | Describe the aesthetic you want |
| Requesting UI screenshots | AI hallucinates interfaces | Capture real screenshots instead |

---

## Batch Generation Workflow

When you need multiple images with consistent style (e.g., a blog series or social campaign):

1. **Generate 3-4 test images** with different style prompts
2. **Pick the winning style** based on brand fit
3. **Save the exact prompt** as your template
4. **Use Flux multi-reference** — upload the winning image as a style reference
5. **Batch generate** variations with the same style, different subjects
6. **Post-process** — add text overlays, logos, crop to platform sizes

---

## Aspect Ratios Quick Reference

| Use Case | Ratio | Pixels | Notes |
|----------|-------|--------|-------|
| Blog hero / OG image | 1.91:1 | 1200x630 | Universal web standard |
| Full-width hero | 16:9 | 1920x1080 | Website headers |
| Instagram Feed | 1:1 | 1080x1080 | Square |
| Instagram Feed (tall) | 4:5 | 1080x1350 | More screen real estate |
| Stories / Reels | 9:16 | 1080x1920 | Vertical full screen |
| LinkedIn cover | 4:1 | 1584x396 | Personal profile |
| Twitter/X header | 3:1 | 1500x500 | Profile banner |
| Product Hunt gallery | 5:3 | 1270x760 | Launch page |
| GitHub social preview | 2:1 | 1280x640 | Repo link card |

---

## Cost Optimization

- **Iterate at low quality first** — use Flux Dev or Gemini Flash for drafts, upgrade for finals
- **Use references over long prompts** — Flux multi-reference produces more consistent results with fewer retries
- **Batch similar requests** — generate all blog headers in one session with the same style
- **Cache and reuse** — abstract backgrounds, patterns, and textures can be reused across multiple images
- **Post-process instead of re-generate** — crop, overlay text, and adjust color in code rather than generating new images
