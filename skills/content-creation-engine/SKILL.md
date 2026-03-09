---
name: content-creation-engine
version: 1.0.0
description: "When the user wants to build, set up, or use a brand-aware content creation system for generating marketing content at scale. Use when the user mentions 'content creation engine,' 'brand-consistent content,' 'multi-format export,' 'PDF export,' 'social carousel generation,' 'layout generation,' 'Cloudflare image generation,' 'brand management system,' or 'automated content production.' Covers brand profiles, Claude-powered layout generation, AI image generation, and multi-format export (PDF, PNG, Instagram carousels, LinkedIn, Twitter/X, TikTok). For standalone social posts without a generation engine, see social-content."
---

# Content Creation Engine

You are an expert in building and operating brand-aware content production systems. Your goal is to help users rapidly produce polished, brand-consistent content across multiple formats with minimal friction.

## Initial Assessment

**Check for product marketing context first:**
If `.claude/product-marketing-context.md` exists, read it before asking questions. Use that context and only ask for information not already covered.

Before building or using the engine, understand:

1. **Mode** — Are you *building* the engine (new setup) or *using* an existing one to produce content?
2. **Brand Context** — How many brands? Are guidelines stored or do they need to be created?
3. **Output Formats** — Which formats are needed: PDF, PNG, Instagram carousel, LinkedIn, Twitter/X, TikTok?
4. **Phase** — MVP (brand management + PDF/PNG) or full build (carousels + social formats + templates)?

---

## Architecture Overview

```
User Dashboard (React + TypeScript)
    ↓
Brand Selector → Brand Context (colors, typography, tone, narrative, guidelines)
    ↓
Content Input (finished copy)
    ↓
Vercel Serverless → Claude API (layout generation)
    ↓
Claude returns: HTML layout + image prompts
    ↓
Cloudflare Workers AI (Stable Diffusion image generation)
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

## Phase 1: MVP Build Order

Build in this sequence to get value fastest:

1. **Supabase setup** — Schema, auth, storage buckets
2. **Brand management** — CRUD for brand profiles
3. **Generate endpoint** — Vercel function calling Claude
4. **HTML preview** — Render Claude's output in React
5. **PDF + PNG export** — html2pdf and html2canvas
6. **Project history** — Save/view past generations

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

### Brand Profile Checklist

Gather these for each brand before generating content:

- [ ] Brand name and one-line description
- [ ] Primary color (hex) + secondary colors
- [ ] Typography: font family, heading sizes, body size
- [ ] Tone of voice (3-5 adjectives + short description)
- [ ] Brand narrative (mission, positioning, key messages)
- [ ] Guidelines document (PDF, image, or pasted text)

**For detailed brand setup**: See [references/brand-management.md](references/brand-management.md)

---

## Content Generation Workflow

### User Flow

1. Select brand from dropdown
2. Paste finished copy (written separately — engine handles layout, not copy)
3. Choose output format(s): PDF, PNG, Instagram carousel, LinkedIn, Twitter/X, TikTok
4. Add optional layout hints: "Hero image at top," "2-column layout," "minimal white space"
5. Click Generate → Vercel serverless function runs
6. Preview HTML output in right panel
7. Export to desired format(s)

### Vercel Serverless: `/api/generate`

```typescript
// POST /api/generate
interface GenerateRequest {
  brandId: string;
  copy: string;
  outputFormat: 'pdf' | 'png' | 'carousel' | 'linkedin' | 'twitter' | 'tiktok';
  customHints?: string;
}

interface GenerateResponse {
  projectId: string;
  htmlLayout: string;        // Complete HTML + inline CSS
  images: ImageResult[];     // { placement, url, prompt }
}
```

**Generation flow:**
1. Fetch brand profile + guidelines from Supabase
2. Construct Claude prompt with brand context + copy + format specs
3. Call Claude API → returns `{ htmlLayout, imagePrompts }`
4. Call Cloudflare Workers AI in parallel for each image prompt
5. Embed generated images into HTML
6. Return assembled HTML to frontend
7. Auto-save as draft project in Supabase

**For full API implementation**: See [references/api-setup.md](references/api-setup.md)

---

## Claude Prompt Template

Send this to Claude via the Vercel serverless function:

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

Output Format: [FORMAT]
Specifications: [SIZE, MARGINS, LAYOUT RULES]
Custom Hints: [HINTS IF PROVIDED]

Respond ONLY with valid JSON:
{
  "htmlLayout": "<complete HTML with inline CSS>",
  "imagePrompts": [
    {
      "description": "Stable Diffusion prompt (max 150 words)",
      "placement": "hero | section_1 | sidebar | background"
    }
  ]
}
```

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

### PDF Export

```typescript
import html2pdf from 'html2pdf.js';

function exportPDF(htmlContent: string, brandName: string) {
  const options = {
    margin: 10,
    filename: `${brandName}_${Date.now()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(options).from(htmlContent).save();
}
```

### PNG Export

```typescript
import html2canvas from 'html2canvas';

async function exportPNG(element: HTMLElement, width: number, height: number) {
  const canvas = await html2canvas(element, { scale: 2, width, height });
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob!);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export_${Date.now()}.png`;
    a.click();
  });
}
```

### Carousel Export (Instagram)

- Auto-paginate copy across 1080×1350px slides
- Render each slide as separate PNG
- Bundle into ZIP: `slide_1.png`, `slide_2.png`, etc.
- Include `carousel_manifest.json` with copy per slide
- Target 5-10 slides; break at natural paragraph/section points

**For full export implementation**: See [references/export-formats.md](references/export-formats.md)

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
  template_id UUID REFERENCES templates(id),
  status TEXT DEFAULT 'draft',  -- 'draft' | 'exported' | 'archived'
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  brand_id UUID REFERENCES brands(id),
  name TEXT NOT NULL,            -- "Weekly Newsletter", "Product Launch"
  layout_html TEXT,
  custom_hints TEXT,
  output_format TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

### Template Workflow

1. Generate content you like
2. Click "Save as Template" → stores layout + custom hints
3. On next use: select template from dropdown → pre-fills hints
4. Generate with new copy → template guides layout consistency

---

## UI Layout

### Dashboard
- Sticky brand selector dropdown (always visible)
- Quick stats: pieces created this week, brands managed
- Primary CTA: "New Content"
- Sidebar: New Content | Brands | Recent Projects | Templates

### Content Creation Page
```
Left Panel (40%):          Right Panel (60%):
- Brand selector           - HTML preview (live render)
- Copy textarea            - Export buttons: PDF | PNG | Carousel
- Format checkboxes        - Per-image: "Regenerate" button
- Layout hints (optional)  - Inline copy edit
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

## Performance Targets

| Operation | Target | Approach |
|-----------|--------|----------|
| Layout generation | < 3s | Claude API direct call |
| Image generation | < 5s total | Parallel Cloudflare calls |
| PDF export | < 2s | html2pdf client-side |
| PNG export | < 1s | html2canvas client-side |
| Full generate + images | < 5s | Images generated in parallel |

---

## Implementation Decisions

1. **Copy-first, layout-second** — Users write copy elsewhere (Claude chat); this engine layouts and images it. Reduces API complexity.
2. **HTML as single source of truth** — One representation exports to all formats via html2pdf/html2canvas.
3. **Cloudflare for images** — Free tier covers daily use (5-10 pieces/day = ~15-30 images). No additional billing.
4. **Supabase for everything** — Auth + DB + Storage = one vendor, one dashboard, Row Level Security ready.
5. **Auto-save always on** — Every generation auto-saves as draft. No "save" friction.
6. **Version history for narratives** — Brand narratives are versioned; layout-only guidelines keep only latest.

---

## Phased Rollout

### Phase 1 (MVP)
- [ ] Brand CRUD (name, colors, typography, tone, narrative)
- [ ] Single content generation (PDF + PNG output)
- [ ] HTML preview in-browser
- [ ] Project history (view only)

### Phase 2
- [ ] Instagram carousel export (ZIP)
- [ ] LinkedIn, Twitter/X, TikTok format presets
- [ ] Draft edit + regenerate workflow
- [ ] Guidelines file upload (Supabase storage)

### Phase 3
- [ ] Per-image regeneration
- [ ] Layout templates (save/reuse)
- [ ] Batch generation (multiple pieces)
- [ ] Analytics (pieces created, formats used, time saved)

---

## Task-Specific Questions

1. Are you building the engine from scratch or adding to an existing React project?
2. Which output formats are needed first?
3. Do you have a Supabase project and Cloudflare account set up?
4. How many brands will you manage initially?
5. Do you have existing brand guidelines to upload?

---

## Related Skills

- **social-content**: For manual social media content without the engine
- **copywriting**: For writing the copy that feeds into this engine
- **content-strategy**: For planning what content to produce
- **launch-strategy**: For coordinating content production around launches
- **analytics-tracking**: For measuring content performance after publishing
