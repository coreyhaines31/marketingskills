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
  const { brandId, copy, outputFormat, customHints } = await req.json();

  // 1. Fetch brand from Supabase
  const { data: brand } = await supabase
    .from('brands')
    .select('*, brand_narratives(content, version)')
    .eq('id', brandId)
    .single();

  const { data: guidelines } = await supabase
    .from('brand_guidelines')
    .select('file_name, file_type')
    .eq('brand_id', brandId);

  const narrative = brand?.brand_narratives?.[0]?.content ?? '';

  // 2. Build Claude prompt
  const prompt = buildPrompt({
    brand,
    narrative,
    copy,
    outputFormat,
    formatSpec: FORMAT_SPECS[outputFormat],
    customHints,
  });

  // 3. Call Claude
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
  const { htmlLayout, imagePrompts } = JSON.parse(responseText);

  // 4. Generate images in parallel
  const images = await Promise.all(
    imagePrompts.map(async (p: { description: string; placement: string }) => ({
      placement: p.placement,
      prompt: p.description,
      url: await generateImage(p.description),
    }))
  );

  // 5. Embed images into HTML
  let finalHtml = htmlLayout;
  for (const img of images) {
    finalHtml = finalHtml.replace(
      `data-placement="${img.placement}"`,
      `src="${img.url}" data-placement="${img.placement}"`
    );
  }

  // 6. Auto-save project
  const { data: project } = await supabase
    .from('projects')
    .insert({
      brand_id: brandId,
      copy,
      layout_html: finalHtml,
      image_prompts: imagePrompts,
      status: 'draft',
    })
    .select()
    .single();

  return NextResponse.json({ projectId: project.id, htmlLayout: finalHtml, images });
}

function buildPrompt({ brand, narrative, copy, outputFormat, formatSpec, customHints }: any) {
  const colors = [brand.primary_color, ...(brand.secondary_colors ?? [])].join(', ');
  const typography = brand.typography
    ? `${brand.typography.fontFamily}, headings ${brand.typography.headingSizes}, body ${brand.typography.bodySize}`
    : 'system-ui, default sizing';

  return `You are a layout designer for ${brand.name}. Design an HTML layout for this content.

Brand Context:
- Name: ${brand.name}
- Colors: ${colors}
- Typography: ${typography}
- Voice: ${brand.tone_of_voice ?? 'Professional'}
- Narrative: ${narrative}

Content to Layout:
${copy}

Output Format: ${outputFormat.toUpperCase()}
Specifications: ${formatSpec}
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

## Rate Limits & Quotas

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Claude API | Pay-as-you-go | ~$0.003/1k tokens; budget ~$10/month |
| Cloudflare Workers AI | 100k calls/month | Resets monthly |
| Vercel Functions | 100GB-hours/month | Well within limits for 10 pieces/day |
| Supabase | 500MB DB, 1GB storage | Sufficient for MVP |
