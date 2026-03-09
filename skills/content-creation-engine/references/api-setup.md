# API Setup Reference

Detailed implementation for the Vercel serverless functions powering the content creation engine.

## Project Structure

```
/
├── app/
│   ├── page.tsx                    # Dashboard
│   ├── content/page.tsx            # Content creation
│   ├── brands/page.tsx             # Brand management
│   └── projects/page.tsx           # Project history
├── api/
│   ├── generate/route.ts           # POST - layout + image generation
│   ├── export/[projectId]/route.ts # POST - PDF/PNG/carousel export
│   ├── brands/route.ts             # GET/POST brands
│   ├── brands/[brandId]/route.ts   # GET/PUT/DELETE brand
│   └── projects/route.ts           # GET projects
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── claude.ts                   # Claude API wrapper
│   └── cloudflare.ts              # Cloudflare Workers AI wrapper
└── components/
    ├── BrandSelector.tsx
    ├── ContentEditor.tsx
    ├── HTMLPreview.tsx
    └── ExportButtons.tsx
```

---

## `/api/generate` — Full Implementation

```typescript
// app/api/generate/route.ts
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FORMAT_SPECS: Record<string, string> = {
  pdf: 'A4 format (794×1123px), 40px margins, single-column default, print-optimized',
  png: '1080×1350px, high visual impact, bold imagery',
  carousel: '1080×1350px per slide, 5–10 slides, auto-paginate at section breaks',
  linkedin: '1200×627px, professional tone, text-forward layout',
  twitter: '1024×512px, high contrast, single key message',
  tiktok: '1080×1920px vertical, bold typography, mobile-optimized',
};

export async function POST(req: NextRequest) {
  const { brandId, copy, outputFormats, customHints, visualReference, productImage } = await req.json();

  // 1. Fetch brand from Supabase (includes extracted guidelines JSON + latest narrative)
  const { data: brand } = await supabase
    .from('brands')
    .select('*, brand_narratives(content, version)')
    .eq('id', brandId)
    .single();

  const narrative = brand?.brand_narratives?.[0]?.content ?? '';
  const extractedGuidelines = brand?.guidelines ?? null;  // Claude-extracted on brand setup

  // 2. Build Claude prompt
  const prompt = buildPrompt({
    brand,
    narrative,
    extractedGuidelines,
    copy,
    outputFormats,
    formatSpecs: outputFormats.map((f: string) => `${f.toUpperCase()}: ${FORMAT_SPECS[f]}`).join(' | '),
    customHints,
  });

  // 3. Build message content — prepend vision image blocks if provided
  const userContent: Anthropic.MessageParam['content'] = [];

  if (visualReference) {
    userContent.push({
      type: 'image',
      source: { type: 'base64', media_type: visualReference.mediaType, data: visualReference.data },
    });
    userContent.push({
      type: 'text',
      text: 'The image above is a visual reference. Analyze its layout structure, typography hierarchy, color usage patterns, and visual composition. Apply those style patterns to the layout below — adapted to the brand context. Do NOT copy any text or logos from the reference.',
    });
  }

  if (productImage) {
    userContent.push({
      type: 'image',
      source: { type: 'base64', media_type: productImage.mediaType, data: productImage.data },
    });
    userContent.push({
      type: 'text',
      text: buildProductModePrefix(),
    });
  }

  userContent.push({ type: 'text', text: prompt });

  // 4. Call Claude (vision-enabled when reference provided)
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: userContent }],
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
  const { htmlLayout, imagePrompts, productPlacement } = JSON.parse(responseText);

  // 5. Generate images in parallel
  const images = await Promise.all(
    imagePrompts.map(async (p: { description: string; placement: string }) => ({
      placement: p.placement,
      prompt: p.description,
      url: await generateImage(p.description),
    }))
  );

  // 6. Embed AI-generated scene images into HTML
  let finalHtml = htmlLayout;
  for (const img of images) {
    finalHtml = finalHtml.replace(
      `data-placement="${img.placement}"`,
      `src="${img.url}" data-placement="${img.placement}"`
    );
  }

  // Embed the actual product image directly (never AI-replaced)
  if (productImage) {
    finalHtml = finalHtml.replace(
      'data-placement="product"',
      `src="data:${productImage.mediaType};base64,${productImage.data}" data-placement="product"`
    );
  }

  // 7. Auto-save project
  const { data: project } = await supabase
    .from('projects')
    .insert({
      brand_id: brandId,
      copy,
      layout_html: finalHtml,
      image_prompts: imagePrompts,
      output_formats: outputFormats,
      has_visual_reference: !!visualReference,
      has_product_image: !!productImage,
      product_placement: productPlacement ?? null,
      status: 'draft',
    })
    .select()
    .single();

  return NextResponse.json({ projectId: project.id, htmlLayout: finalHtml, images, productPlacement });
}

function buildProductModePrefix(): string {
  return `The image above is a product to be featured in marketing content.

Identify:
1. Product type: digital (ebook, PDF cover, app/SaaS screenshot) or physical
2. Best device frame if digital: laptop | phone | tablet | none
3. Key visual selling points visible in the image

Generate an HTML layout that:
- Places the product as the primary visual hero using: <img data-placement="product">
  (this placeholder is replaced with the actual product image after generation)
- If digital: wraps the product placeholder in a CSS device frame (use inline CSS,
  no external assets — pure CSS laptop/phone/tablet mockup)
- Wraps brand-consistent copy and typography around the product
- Uses imagePrompts ONLY for background/scene/lifestyle elements — NOT to replace
  the product (e.g. "desk setup background", "lifestyle scene")

Your JSON response MUST include productPlacement:
{
  "htmlLayout": "...",
  "imagePrompts": [{ "description": "scene background only", "placement": "background" }],
  "productPlacement": { "deviceFrame": "laptop|phone|tablet|none", "productType": "digital|physical" }
}`;
}

function buildPrompt({ brand, narrative, extractedGuidelines, copy, outputFormats, formatSpecs, customHints }: any) {
  const colors = [brand.primary_color, ...(brand.secondary_colors ?? [])].join(', ');
  const typography = brand.typography
    ? `${brand.typography.fontFamily}, headings ${brand.typography.headingSizes}, body ${brand.typography.bodySize}`
    : 'system-ui, default sizing';

  // Prefer Claude-extracted guidelines over manual fields when available
  const guidelinesBlock = extractedGuidelines
    ? `Extracted Brand Guidelines:
- Typography: ${extractedGuidelines.typography}
- Color Palette: ${extractedGuidelines.colorPalette?.join(', ')}
- Spacing/Grid: ${extractedGuidelines.spacing}
- Tone: ${extractedGuidelines.tone}
- Visual Style: ${extractedGuidelines.visualStyle}`
    : `Brand Context:
- Colors: ${colors}
- Typography: ${typography}
- Voice: ${brand.tone_of_voice ?? 'Professional'}`;

  return `You are a layout designer for ${brand.name}. Design an HTML layout for this content.

${guidelinesBlock}
- Narrative: ${narrative}

Content to Layout:
${copy}

Output Formats: ${outputFormats.map((f: string) => f.toUpperCase()).join(', ')}
Specifications: ${formatSpecs}
${customHints ? `Custom Hints: ${customHints}` : ''}

Rules:
- Use inline CSS only (no external stylesheets)
- Use brand colors for accents, headings, and highlights
- For images, use: <img data-placement="hero"> as placeholder
- Ensure layout is pixel-perfect for the specified dimensions
- Maintain generous whitespace and visual hierarchy

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "htmlLayout": "<complete self-contained HTML with inline CSS>",
  "imagePrompts": [
    {
      "description": "Detailed Stable Diffusion prompt matching brand aesthetic, max 150 words",
      "placement": "hero | section_1 | sidebar | background"
    }
  ]
}`;
}

async function generateImage(prompt: string): Promise<string> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-v1-5-inpainting`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        negative_prompt: 'text, watermark, logo, signature, blurry, low quality',
      }),
    }
  );
  const result = await response.json();
  // Returns base64; embed directly in HTML
  return `data:image/png;base64,${result.result.image}`;
}
```

---

## `/api/brands/analyze` — Extract Guidelines from Uploaded Files

Called once during brand setup after files are uploaded to Supabase storage:

```typescript
// app/api/brands/analyze/route.ts
export async function POST(req: NextRequest) {
  const { brandId, fileUrls } = await req.json();
  // fileUrls: array of Supabase storage public URLs (PDFs, images, style sheets)

  // Fetch file contents as base64 for vision
  const fileBlocks: Anthropic.MessageParam['content'] = [];
  for (const url of fileUrls) {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mediaType = res.headers.get('content-type') ?? 'image/png';
    fileBlocks.push({ type: 'image', source: { type: 'base64', media_type: mediaType as any, data: base64 } });
  }

  fileBlocks.push({
    type: 'text',
    text: `Analyze the brand materials above and extract a structured brand guidelines profile.
Return ONLY valid JSON (no markdown):
{
  "typography": "Font families, heading/body sizes, line-height style",
  "colorPalette": ["#hex1", "#hex2", "#hex3"],
  "spacing": "Grid system, section padding, margin patterns",
  "tone": "Voice and tone description in 1-2 sentences",
  "visualStyle": "Visual aesthetic in 1-2 sentences"
}`,
  });

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: fileBlocks }],
  });

  const guidelines = JSON.parse(message.content[0].type === 'text' ? message.content[0].text : '{}');

  // Save extracted guidelines to brand record
  await supabase.from('brands').update({ guidelines }).eq('id', brandId);

  return NextResponse.json({ guidelines });
}
```

---

## `/api/brands` — CRUD

```typescript
// app/api/brands/route.ts
export async function GET() {
  const { data } = await supabase
    .from('brands')
    .select('id, name, primary_color, secondary_colors, updated_at')
    .order('updated_at', { ascending: false });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data } = await supabase.from('brands').insert(body).select().single();
  return NextResponse.json(data, { status: 201 });
}

// app/api/brands/[brandId]/route.ts
export async function PUT(req: NextRequest, { params }: { params: { brandId: string } }) {
  const body = await req.json();
  const { data } = await supabase
    .from('brands')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', params.brandId)
    .select()
    .single();
  return NextResponse.json(data);
}
```

---

## Supabase Client Setup

```typescript
// lib/supabase.ts
import { createBrowserClient, createServerClient } from '@supabase/ssr';

// Client-side (React components)
export const supabaseBrowser = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side (API routes) — uses service role for admin operations
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

---

## Error Handling Patterns

```typescript
// Wrap Claude calls with timeout
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    ),
  ]);

// Use in generate:
const message = await withTimeout(
  anthropic.messages.create({ ... }),
  15_000  // 15s timeout
);

// Fallback if image generation fails
const imageUrl = await generateImage(prompt).catch(() => null);
// null → render placeholder in HTML, don't block layout delivery
```

---

## Multi-Format Batch Export (Client-Side)

Call this after receiving `htmlLayout` from `/api/generate`:

```typescript
// lib/batchExport.ts
import { exportPDF } from './exportPDF';
import { exportPNG } from './exportPNG';
import { exportCarousel } from './exportCarousel';

type ExportFormat = 'pdf' | 'png' | 'carousel' | 'linkedin' | 'twitter' | 'tiktok';

export async function batchExport(
  htmlContent: string,
  formats: ExportFormat[],
  brandName: string
): Promise<void> {
  // All exports fire in parallel — one HTML, multiple downloads
  await Promise.all(
    formats.map(fmt => {
      switch (fmt) {
        case 'pdf':      return exportPDF(htmlContent, brandName);
        case 'carousel': return exportCarousel(htmlContent, brandName);
        default:         return exportPNG(htmlContent, fmt, brandName);
      }
    })
  );
}

// Usage in ExportButtons.tsx:
// await batchExport(htmlLayout, selectedFormats, brandName);
// → triggers all file downloads simultaneously
```

---

## Visual Reference: Frontend Handling

The client converts the uploaded file to base64 before sending:

```typescript
// lib/prepareVisualReference.ts
export async function prepareVisualReference(file: File): Promise<{
  mediaType: string;
  data: string;
  fileName: string;
} | null> {
  if (!file) return null;

  // PDF: render first page to PNG via canvas (using pdfjs-dist)
  if (file.type === 'application/pdf') {
    const pdfjsLib = await import('pdfjs-dist');
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
    const data = canvas.toDataURL('image/png').split(',')[1];
    return { mediaType: 'image/png', data, fileName: file.name };
  }

  // Image: read directly as base64
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target!.result as string;
      resolve({
        mediaType: file.type as any,
        data: dataUrl.split(',')[1],
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
  });
}
```

**Accepted file types:** JPG, PNG, WEBP, GIF, PDF (first page used)
**Size guidance:** Keep under 5MB for fast uploads; Claude handles up to 20MB images

---

## Rate Limits & Quotas

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Claude API | Pay-as-you-go | ~$0.003/1k tokens; budget ~$10/month |
| Cloudflare Workers AI | 100k calls/month | Resets monthly |
| Vercel Functions | 100GB-hours/month | Well within limits for 10 pieces/day |
| Supabase | 500MB DB, 1GB storage | Sufficient for MVP |
