# Export Formats Reference

Detailed implementation for each export format in the content creation engine.

---

## PDF Export

### Implementation

```typescript
// components/ExportButtons.tsx
import html2pdf from 'html2pdf.js';

const FORMAT_PDF_OPTIONS = {
  a4: {
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    filename_suffix: 'a4',
  },
  letter: {
    jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' },
    filename_suffix: 'letter',
  },
};

export async function exportPDF(
  htmlContent: string,
  brandName: string,
  format: 'a4' | 'letter' = 'a4'
) {
  const container = document.createElement('div');
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  const options = {
    margin: 10,
    filename: `${brandName}_${Date.now()}_${FORMAT_PDF_OPTIONS[format].filename_suffix}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: FORMAT_PDF_OPTIONS[format].jsPDF,
  };

  await html2pdf().set(options).from(container).save();
  document.body.removeChild(container);
}
```

### Print-Optimized CSS

Include this in Claude's generated HTML for PDF output:

```css
@media print {
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page-break { page-break-after: always; }
}
body {
  margin: 0;
  padding: 40px;
  width: 714px;   /* A4 width minus margins */
  box-sizing: border-box;
}
```

---

## PNG Export

### Single Image

```typescript
import html2canvas from 'html2canvas';

const FORMAT_DIMENSIONS: Record<string, { width: number; height: number }> = {
  instagram: { width: 1080, height: 1350 },
  linkedin: { width: 1200, height: 627 },
  twitter: { width: 1024, height: 512 },
  tiktok: { width: 1080, height: 1920 },
  square: { width: 1080, height: 1080 },
};

export async function exportPNG(
  htmlContent: string,
  format: keyof typeof FORMAT_DIMENSIONS,
  brandName: string
) {
  const { width, height } = FORMAT_DIMENSIONS[format];

  const container = document.createElement('div');
  container.style.cssText = `width:${width}px;height:${height}px;position:fixed;top:-9999px;`;
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  const canvas = await html2canvas(container, {
    scale: 2,
    width,
    height,
    useCORS: true,
    allowTaint: true,
  });

  canvas.toBlob(
    blob => {
      const url = URL.createObjectURL(blob!);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${brandName}_${format}_${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    },
    'image/png',
    1.0
  );

  document.body.removeChild(container);
}
```

---

## Instagram Carousel Export

### Auto-Pagination Logic

```typescript
export async function exportCarousel(
  htmlContent: string,
  brandName: string,
  slideCount?: number
): Promise<void> {
  // Split HTML into slides by section elements or page-break markers
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const sections = doc.querySelectorAll('section, [data-slide], .slide-break');

  const slides: string[] = sections.length > 0
    ? Array.from(sections).map(s => s.outerHTML)
    : autoSplit(htmlContent, slideCount ?? 8);

  // Render each slide and collect blobs
  const blobs: Blob[] = [];
  for (let i = 0; i < slides.length; i++) {
    const slideHtml = wrapSlide(slides[i], i + 1, slides.length);
    const blob = await renderSlideToBlob(slideHtml, 1080, 1350);
    blobs.push(blob);
  }

  // Package as ZIP
  await downloadCarouselZIP(blobs, brandName);
}

function wrapSlide(content: string, index: number, total: number): string {
  return `
    <div style="width:1080px;height:1350px;overflow:hidden;position:relative;">
      ${content}
      <div style="position:absolute;bottom:20px;right:24px;font-size:14px;opacity:0.6;">
        ${index} / ${total}
      </div>
    </div>`;
}

async function renderSlideToBlob(html: string, width: number, height: number): Promise<Blob> {
  const el = document.createElement('div');
  el.style.cssText = `width:${width}px;height:${height}px;position:fixed;top:-9999px;`;
  el.innerHTML = html;
  document.body.appendChild(el);

  const canvas = await html2canvas(el, { scale: 2, width, height, useCORS: true });
  document.body.removeChild(el);

  return new Promise(resolve => canvas.toBlob(b => resolve(b!), 'image/png', 1.0));
}

function autoSplit(html: string, targetSlides: number): string[] {
  // Split at paragraph boundaries to approximate slide count
  const paragraphs = html.split(/<\/p>|<\/h[1-6]>|<br\s*\/?>/i).filter(Boolean);
  const perSlide = Math.ceil(paragraphs.length / targetSlides);
  const slides: string[] = [];
  for (let i = 0; i < paragraphs.length; i += perSlide) {
    slides.push(paragraphs.slice(i, i + perSlide).join('</p>') + '</p>');
  }
  return slides;
}
```

### ZIP Packaging

```typescript
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

async function downloadCarouselZIP(blobs: Blob[], brandName: string): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder(`${brandName}_carousel`)!;

  blobs.forEach((blob, i) => {
    folder.file(`slide_${String(i + 1).padStart(2, '0')}.png`, blob);
  });

  // Add manifest
  const manifest = { slideCount: blobs.length, brand: brandName, exportedAt: new Date().toISOString() };
  folder.file('carousel_manifest.json', JSON.stringify(manifest, null, 2));

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `${brandName}_carousel_${Date.now()}.zip`);
}
```

**Dependencies to install:**
```bash
npm install jszip file-saver @types/file-saver
```

---

## TikTok Format

- Dimensions: 1080×1920px (9:16 vertical)
- Strategy: Use the carousel engine for video-style "slides" at TikTok ratio
- Claude prompt hint: "Bold, large typography at top third. High-contrast background. Minimal text per frame."
- Export as individual PNGs for manual assembly in CapCut or similar

---

## Supabase Export Storage

```typescript
// Save export file to Supabase storage and record in project_exports
async function saveExportToStorage(
  blob: Blob,
  userId: string,
  brandId: string,
  projectId: string,
  format: string
): Promise<string> {
  const path = `${userId}/brands/${brandId}/exports/${projectId}_${format}_${Date.now()}.${format === 'pdf' ? 'pdf' : 'png'}`;

  const { error } = await supabase.storage
    .from('brand-assets')
    .upload(path, blob);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('brand-assets')
    .getPublicUrl(path);

  await supabase.from('project_exports').insert({
    project_id: projectId,
    format,
    file_url: publicUrl,
  });

  return publicUrl;
}
```

---

## Format Quick Reference

| Format | Dimensions | DPI | File | Use Case |
|--------|-----------|-----|------|----------|
| PDF A4 | 794×1123 | 72 (screen) | .pdf | Documents, reports, newsletters |
| PDF Letter | 816×1056 | 72 | .pdf | US-format documents |
| PNG Instagram | 1080×1350 | 72 | .png | Feed posts |
| PNG Carousel | 1080×1350 per slide | 72 | .zip | Multi-slide IG content |
| PNG LinkedIn | 1200×627 | 72 | .png | LinkedIn posts |
| PNG Twitter | 1024×512 | 72 | .png | Twitter/X cards |
| PNG TikTok | 1080×1920 | 72 | .png | TikTok still frames |
| PNG Square | 1080×1080 | 72 | .png | Generic social |
