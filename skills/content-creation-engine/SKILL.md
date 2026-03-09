---
name: content-creation-engine
version: 1.0.0
description: "When the user wants to build, set up, or use a brand-aware content creation system for generating marketing content at scale. Use when the user mentions 'content creation engine,' 'brand-consistent content,' 'multi-format export,' 'PDF export,' 'social carousel generation,' 'layout generation,' 'Cloudflare image generation,' 'brand management system,' or 'automated content production.' Covers brand profiles, Claude-powered layout generation, Cloudflare AI image generation, and multi-format export (PDF, PNG, Instagram carousels, LinkedIn, Twitter/X, TikTok). For standalone social posts without a generation engine, see social-content."
---

# Content Creation Engine

You are an expert in building and operating brand-aware content production systems. Your goal is to help users rapidly produce polished, brand-consistent content across multiple formats with minimal friction.

## Initial Assessment

**Check for product marketing context first:**
If `.claude/product-marketing-context.md` exists, read it before asking questions. Use that context and only ask for information not already covered.

Before building or using the engine, understand:

1. **Mode** — Are you *building* the engine (new setup) or *using* an existing one to produce content?
2. **Brand Context** — How many brands? Are guidelines stored or do they need to be created?
3. **Starting point** — New React project, existing project, or adding to a deployed app?
4. **Accounts** — Supabase, Cloudflare, and Anthropic API keys needed.

---

## Architecture Overview

```
Brand Setup (one-time per brand)
    ↓
Upload files + add narratives → Claude extracts guidelines → saved to Supabase
    ↓
Content Creation
    ↓
Brand Selector → Brand Context (extracted guidelines, colors, typography, tone)
    ↓
Paste finished copy + Optional: visual reference image | product image
    ↓
Vercel Serverless → Claude API (vision analysis + layout generation)
    ↓
Claude returns: HTML layout + image prompts
    ↓
Cloudflare Workers AI (image generation, in parallel)
    ↓
Final HTML assembly (layout + images)
    ↓
Export: PDF (html2pdf) | PNG (html2canvas) | Carousel ZIP | Social specs
    ↓
Supabase (brands, projects, exports persistence)
```

### Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 18 + TypeScript | Component-based, fast iteration |
| Hosting | Vercel | Native serverless, easy Claude API integration |
| Database | Supabase (PostgreSQL) | Auth + DB + Storage in one vendor |
| Image Gen | Cloudflare Workers AI | Free tier: 100k calls/month |
| Layout Gen | Claude API (via Vercel) | Intelligent brand-aware HTML output |
| PDF Export | html2pdf | HTML → PDF preserving layout |
| PNG Export | html2canvas | HTML → PNG at specified dimensions |

---

## Build Order

Build in this sequence to get value fastest:

1. **Supabase setup** — Schema, auth, storage buckets, RLS policies
2. **Brand management** — CRUD, file upload, narrative versioning
3. **Brand analysis endpoint** — `/api/brands/analyze`: Claude vision extracts guidelines from uploaded files
4. **Generate endpoint** — `/api/generate`: Claude layout + Cloudflare images
5. **HTML preview** — Live render in right panel
6. **PDF + PNG export** — html2pdf + html2canvas, multi-format batch
7. **Social format presets** — Carousel ZIP, LinkedIn, Twitter/X, TikTok
8. **Visual reference** — Style-matched generation from uploaded image/PDF
9. **Product image / mockup mode** — Hero product + CSS device frames
10. **Project history + templates** — Save, reuse, batch generation
11. **Iteration UI** — Inline copy edit, per-image regenerate, re-export

---

## Brand Management

### Data Model

```sql
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  primary_color TEXT,          -- hex: "#1A2B3C"
  secondary_colors JSONB,      -- ["#FF5733", "#33FF57"]
  typography JSONB,            -- { fontFamily, headingSizes, bodySize }
  tone_of_voice TEXT,          -- "Direct, contrarian, growth-focused"
  guidelines JSONB,            -- Claude-extracted: { typography, colorPalette, spacing, tone, visualStyle }
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE brand_guidelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  file_name TEXT,
  file_url TEXT,               -- Supabase storage URL
  file_type TEXT,              -- "pdf" | "image" | "text"
  uploaded_at TIMESTAMP DEFAULT now()
);

CREATE TABLE brand_narratives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  content TEXT,                -- Brand story, mission, positioning
  version INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT now()
);
```

### Brand Analysis (One-Time Setup)

Upload files → Claude extracts structured guidelines → saved to `brands.guidelines`.

**Setup flow:**
1. Upload brand files (guidelines PDFs, past content samples, style sheets, images)
2. Add text narratives: brand voice, positioning, tone guidance
3. Click "Analyze Brand" → `/api/brands/analyze` calls Claude vision on uploaded files
4. Claude extracts and returns structured `guidelines` JSON:
   ```json
   {
     "typography": "Freight Display for headings, Inter for body, generous line-height",
     "colorPalette": ["#1A2B3C", "#FF5733", "#F5F5F0"],
     "spacing": "40px section padding, 8px base grid, wide margins",
     "tone": "Direct, warm, premium — avoids jargon",
     "visualStyle": "Clean editorial, photography-forward, minimal ornamentation"
   }
   ```
5. Review and edit extracted guidelines before saving
6. Saved to Supabase — reused for every content generation

**For detailed brand setup**: See [references/brand-management.md](references/brand-management.md)

---

## Content Generation Workflow

### User Flow

1. Select brand from dropdown
2. Paste finished copy (written separately — engine handles layout, not copy)
3. *(Optional)* Upload a visual reference — an image or PDF whose layout/style you want to match
4. *(Optional)* Upload a product image — the product/cover/screenshot to feature as the hero of the content
5. Choose output format(s) — check all you need:
   ☐ PDF (A4)  ☐ PNG/Instagram  ☐ Carousel  ☐ LinkedIn  ☐ Twitter/X  ☐ TikTok
6. Add optional layout hints: "Hero image at top," "2-column layout," "minimal white space"
7. Click Generate → Vercel serverless function runs
8. Preview HTML output in right panel
9. *(Iterate)* Tweak copy or layout hints → click Regenerate; or regenerate individual images
10. Export to desired format(s)

### Vercel Serverless: `/api/generate`

```typescript
// POST /api/generate
interface GenerateRequest {
  brandId: string;
  copy: string;
  outputFormats: ('pdf' | 'png' | 'carousel' | 'linkedin' | 'twitter' | 'tiktok')[];
  customHints?: string;
  visualReference?: {
    mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
    data: string;        // base64-encoded image (PDF: first page converted to PNG)
    fileName?: string;
  };
  productImage?: {
    mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
    data: string;        // base64-encoded — embedded directly as the content hero
    fileName?: string;
  };
}

interface GenerateResponse {
  projectId: string;
  htmlLayout: string;        // Complete HTML + inline CSS
  images: ImageResult[];     // { placement, url, prompt }
  productPlacement?: {       // present when productImage was supplied
    deviceFrame: 'laptop' | 'phone' | 'tablet' | 'none';
    productType: 'digital' | 'physical';
  };
}
```

**Generation flow:**
1. Fetch brand profile + guidelines from Supabase
2. Convert any PDF inputs → PNG (first page) if needed
3. Construct Claude message — text prompt with brand context + copy + format specs; prepend vision image blocks for `visualReference` and/or `productImage` if provided
4. Call Claude API (vision-enabled when images supplied) → returns `{ htmlLayout, imagePrompts, productPlacement? }`
5. Call Cloudflare Workers AI in parallel for each image prompt (scene/background only when productImage present)
6. Embed AI-generated scene images + the actual product image into HTML
7. Return assembled HTML to frontend
8. Auto-save as draft project in Supabase

**For full API implementation**: See [references/api-setup.md](references/api-setup.md)

---

## Claude Prompt Template

Send this to Claude via the Vercel serverless function:

When no visual reference is provided, send a single text message:

```
You are a layout designer for [BRAND NAME]. Design an HTML layout for this content.

Brand Context:
- Name: [BRAND NAME]
- Colors: Primary [HEX], Secondary [HEX LIST]
- Typography: [FONT FAMILY], Headings [SIZE], Body [SIZE]
- Voice: [TONE DESCRIPTION]
- Narrative: [BRAND STORY]

Content to Layout:
[COPY]

Output Formats: [FORMAT LIST]
Specifications: [SIZE, MARGINS, LAYOUT RULES]
Custom Hints: [HINTS IF PROVIDED]

Respond ONLY with valid JSON:
{
  "htmlLayout": "<complete HTML with inline CSS>",
  "imagePrompts": [{ "description": "...", "placement": "hero | section_1 | ..." }]
}
```

When a visual reference is provided, prepend an image block before the text:

```
[IMAGE: visual reference]
The image above is a visual reference. Analyze its:
- Layout structure (grid, columns, whitespace, element positions)
- Typography hierarchy (heading scale, weight, line height)
- Color usage patterns (background/foreground ratios, accent usage)
- Visual composition (image-to-text ratio, focal points)

Apply those style patterns to the layout below, adapted to the brand context.
Do NOT copy text or logos from the reference — style only.

[rest of prompt as above]
```

When a product image is provided, prepend it as a vision block and use product-mode instructions:
- Claude identifies product type (digital/physical) and selects a device frame if needed
- Layout uses `<img data-placement="product">` as the hero placeholder (swapped with actual image post-generation)
- `imagePrompts` target scene/background only — the product itself is never AI-replaced
- Response adds `productPlacement: { deviceFrame, productType }` to the JSON

**For full prompt text and CSS device frame templates**: See [references/mockup-mode.md](references/mockup-mode.md)

### Format Specifications

| Format | Dimensions | Layout Rules |
|--------|-----------|--------------|
| PDF A4 | 794×1123px | 40px margins, single column default |
| PNG Instagram | 1080×1350px | Bold visuals, minimal text |
| Carousel (IG) | 1080×1350px per slide | Auto-paginate copy, 5-10 slides |
| LinkedIn | 1200×627px | Professional, text-forward |
| Twitter/X | 1024×512px | High contrast, short message |
| TikTok | 1080×1920px | Vertical, bold typography |

---

## Image Generation

### Cloudflare Workers AI Integration

```javascript
async function generateImage(prompt: string): Promise<string> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-v1-5-inpainting`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
      body: JSON.stringify({ prompt }),
    }
  );
  const result = await response.json();
  return result.result.image; // base64
}
```

**Free tier:** 100,000 calls/month → ~300–900 images/month at 2-3 per content piece.

### Image Prompt Best Practices

- Include brand color palette: "warm tones matching #FF5733"
- Specify style: "clean editorial photography," "flat design illustration," "minimal abstract"
- Avoid faces unless essential (reduces rejection rate)
- Include negative prompts for consistency: "no text, no logos, no watermarks"
- Match format: "landscape 2:1 ratio" for LinkedIn, "portrait 4:5 ratio" for Instagram

---

## Multi-Format Export

**Yes — the same content can be exported to multiple formats from a single generation.**

Because HTML is the single source of truth, all exports are client-side operations. Generate once, then trigger any combination of exports in parallel:

```typescript
// After one generation, export to all selected formats simultaneously
await batchExport(htmlLayout, ['pdf', 'png', 'carousel'], brandName);
// → triggers PDF download + PNG download + carousel ZIP download at once
```

One Claude API call generates the HTML → `batchExport()` fires all selected export functions in parallel → user receives simultaneous downloads. For maximum layout quality per format, use per-format generation (one Claude call per format).

---

## Project History & Templates

### Projects Schema

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  brand_id UUID NOT NULL REFERENCES brands(id),
  title TEXT,
  copy TEXT,
  layout_html TEXT,
  image_prompts JSONB,
  output_formats JSONB,              -- array of selected formats
  has_visual_reference BOOLEAN DEFAULT false,
  has_product_image BOOLEAN DEFAULT false,
  product_placement JSONB,           -- { deviceFrame, productType }
  template_id UUID REFERENCES templates(id),
  status TEXT DEFAULT 'draft',       -- 'draft' | 'exported' | 'archived'
  exported_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  brand_id UUID REFERENCES brands(id),
  name TEXT NOT NULL,
  layout_html TEXT,
  custom_hints TEXT,
  output_formats JSONB,
  created_at TIMESTAMP DEFAULT now()
);
```

Templates: generate content you like → "Save as Template" → reuse layout + hints for future pieces.

**For full schema and brand analysis endpoint**: See [references/brand-management.md](references/brand-management.md)

---

## UI Layout

### Dashboard
- Sticky brand selector dropdown (always visible)
- Quick stats: pieces created this week, brands managed
- Primary CTA: "New Content"
- Sidebar: New Content | Brands | Recent Projects | Templates

### Content Creation Page
```
Left Panel (40%):                       Right Panel (60%):
- Brand selector                        - HTML preview (live render)
- Copy textarea                         - Export buttons: PDF | PNG | Carousel
- Visual reference (optional)           - Per-image: "Regenerate" button
  [Drop image/PDF — style influence]    - Inline copy edit
- Product image (optional)
  [Drop product/cover/screenshot]
  → becomes the hero; Claude builds
    marketing content around it
- Format checkboxes
- Layout hints (optional)
- [Generate] button
```

### Brand Management Page
- Card grid of brands (name, color preview, last used)
- Brand detail: colors (color picker), typography, tone, narrative
- Guidelines: file list with upload/delete, paste text option
- Version history for narratives

---

## Environment Variables

```bash
# Vercel
ANTHROPIC_API_KEY=sk-ant-...
CF_ACCOUNT_ID=...
CF_API_TOKEN=...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Server-side only
```

---

## Implementation Decisions

1. **Copy-first, layout-second** — Users write copy elsewhere (Claude chat); this engine layouts and images it. Reduces API complexity.
2. **HTML as single source of truth** — One generation → export to any/all formats client-side with no extra API calls. Multi-format = one Claude call + parallel export functions.
3. **Cloudflare for images** — Free tier covers daily use (5-10 pieces/day = ~15-30 images). No additional billing.
4. **Supabase for everything** — Auth + DB + Storage = one vendor, one dashboard, Row Level Security ready.
5. **Auto-save always on** — Every generation auto-saves as draft. No "save" friction.
6. **Version history for narratives** — Brand narratives are versioned; layout-only guidelines keep only latest.
7. **Visual reference via Claude vision (single-pass)** — The reference image is included directly in the Claude API call as a vision block alongside the text prompt. No separate analysis step — Claude extracts style patterns and applies them to the layout in one pass. PDFs are converted to PNG (first page) on the server before sending.
8. **Product image ≠ visual reference** — `productImage` is embedded directly as the HTML content hero (user's actual image, never replaced by AI). Cloudflare-generated images only fill scene/background slots around it. CSS device frames (laptop/phone/tablet) handle digital product mockups without extra AI calls.

---

## Success Criteria

- [ ] Upload brand docs once → reuse intelligently across all future content pieces
- [ ] Layout is brand-adapted, not generic — colors, type, spacing, voice reflected
- [ ] Copy → exported PDF/PNG in under 5 minutes including preview and iteration
- [ ] All 6 output formats working: PDF, PNG, Carousel, LinkedIn, Twitter/X, TikTok
- [ ] Visual reference matching: output visually resembles the uploaded reference
- [ ] Product mockup mode: dropped product image becomes the content hero
- [ ] Scales across 3+ brands without manual overhead or configuration per piece
- [ ] Daily use at 5-10 pieces/week is fast, reliable, and friction-free

## Constraints & Assumptions

- **Input**: Copy is written/iterated separately (in Claude chat); this engine handles layout only
- **Users**: Internal tool only — no public sharing, no multi-user auth needed initially
- **Brands**: 3-5 active brands to start; schema supports unlimited
- **Images**: Cloudflare Workers AI free tier (100k calls/month) covers ~300-900 images/month
- **Content saved**: All generations auto-saved as drafts; export triggers status update
- **Brand guidelines auto-extracted**: Reviewed/confirmed before saving, not applied blindly

---

## Task-Specific Questions

1. Are you building from scratch or adding to an existing React/Next.js project?
2. Do you have a Supabase project and Cloudflare account set up already?
3. How many brands to start? Do existing brand guidelines need uploading?
4. Should brand guidelines be auto-applied after extraction, or manually reviewed first?
5. Should content history be saved to Supabase, or just export and discard?
6. Image regeneration — one-click regenerate, or do you want to edit prompts manually?

---

## Related Skills

- **social-content**: For manual social media content without the engine
- **copywriting**: For writing the copy that feeds into this engine
- **content-strategy**: For planning what content to produce
- **launch-strategy**: For coordinating content production around launches
- **analytics-tracking**: For measuring content performance after publishing
