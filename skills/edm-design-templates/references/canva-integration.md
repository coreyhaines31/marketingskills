# Canva Integration for EDM Design

How to use Canva alongside HTML EDM templates — design visually in Canva, export, and deploy.

---

## Workflow Overview

```
CANVA (visual design)  →  Export assets  →  HTML template  →  ESP (send)
     ↑                                            ↓
Canva template link ←←← Share for editing ←←← Final design
```

Canva is ideal for:
- Designing the **hero image** and banner graphics
- Creating **section illustration** images
- Building **social-share** versions of the email
- Letting non-technical team members edit visuals without touching HTML

---

## Starting a New EDM Design in Canva

### Recommended Canva Dimensions

| Section | Canva Size | Notes |
|---------|-----------|-------|
| Full email mockup | 600 × 2000px | Scroll layout preview |
| Hero banner | 600 × 300px | Above-the-fold image |
| Feature image | 600 × 400px | In-body content image |
| 3-col thumbnail | 200 × 200px | Per item in grid |
| Header / logo bar | 600 × 80px | Brand header |
| Footer bar | 600 × 100px | Unsubscribe zone |

### Direct Canva Start Links

Open these to start a new design at the right size:

- **Email Newsletter template gallery**: https://www.canva.com/email-newsletters/templates/
- **Custom size (600×2000px email mockup)**: https://www.canva.com/design/create?type=EmailNewsletter
- **Presentation-style email concept**: https://www.canva.com/create/presentations/

### Canva → Email Hero (600 × 300px)
1. Open Canva → Create design → Custom size → **600 × 300 px**
2. Design your hero (background, headline, sub-headline, visual)
3. Download → PNG or JPEG (quality: high, transparent background off)
4. Host on CDN (Cloudflare, AWS S3) → paste URL into `<img src="">` in HTML template

---

## Canva Brand Kit Setup

Set these in Canva Brand Kit (available on Canva Pro) so all team designs stay on-brand:

### Brand Kit Fields
- **Logo**: Upload SVG/PNG in dark and light versions
- **Brand colors**: Add primary, secondary, accent hex codes
- **Fonts**: Set heading and body fonts (match email-safe fallbacks)

### Font Mapping: Canva → Email HTML
| Canva Font | Email HTML Fallback |
|-----------|-------------------|
| Montserrat | Arial, Helvetica, sans-serif |
| Playfair Display | Georgia, Times New Roman, serif |
| Inter | Arial, Helvetica, sans-serif |
| Lato | Arial, Helvetica, sans-serif |
| Merriweather | Georgia, serif |

Since email clients don't support most web fonts, design in Canva with a matching visual style, then use system font fallbacks in HTML.

---

## Canva Shareable Design Link

After designing in Canva, generate a share link so teammates can edit:

1. **Open your Canva design**
2. Click **Share** (top right)
3. Choose **"Share a link"**
4. Set permission to **"Can edit"** (for team) or **"Can view"** (for client review)
5. Copy the link — it follows this format:
   ```
   https://www.canva.com/design/DESIGN_ID/view
   https://www.canva.com/design/DESIGN_ID/edit
   ```

**Template link** (anyone can copy and edit their own version):
1. Share → **"Template link"**
2. Anyone with the link gets their own editable copy
3. Format: `https://www.canva.com/design/DESIGN_ID/template`

---

## Exporting from Canva for Email

### Export Settings
| Format | Use Case | Settings |
|--------|---------|---------|
| PNG | Hero images, icons | 2x scale, transparent if needed |
| JPEG | Photos, complex backgrounds | Quality 85-90% |
| PDF | Client approval review | — |
| SVG | Simple logos/icons | — |

### File Size Targets
- Hero image: < 200KB
- Content images: < 100KB each
- Total email: < 100KB HTML + all images loaded in < 2s on 4G

### Compression
After export, run images through:
- **TinyPNG** (tinypng.com) — PNG/JPEG compression
- **Squoosh** (squoosh.app) — Advanced compression with preview

---

## Canva Template Library: Email Types

Canva's built-in email template categories most useful for EDMs:

| Category | Canva Search Term |
|----------|-----------------|
| Promotional email | "promotional email newsletter" |
| Product launch | "product launch email" |
| Event invitation | "event invitation email" |
| Newsletter | "newsletter email" |
| Real estate | "real estate email newsletter" |
| Travel | "travel email newsletter" |

---

## Embedding Canva Designs (Optional)

For review purposes, Canva designs can be embedded in Notion or web pages:

```html
<!-- Canva embed (for review pages, not for email) -->
<div style="position:relative;width:100%;height:0;padding-top:56.25%;">
  <iframe loading="lazy"
    style="position:absolute;width:100%;height:100%;top:0;left:0;border:none;"
    src="https://www.canva.com/design/DESIGN_ID/view?embed"
    allowfullscreen="allowfullscreen"
    allow="fullscreen">
  </iframe>
</div>
```

---

## Recommended Canva + Email Workflow

### Step 1: Brief in Canva
Create a mood board or wireframe in Canva showing layout intent

### Step 2: Design hero and images in Canva
- Hero banner (600 × 300px)
- Feature images
- Icons/illustrations

### Step 3: Share Canva link for approval
- Send template link to client/stakeholder
- Collect feedback via Canva comments

### Step 4: Export approved images from Canva
- Download at 2x resolution
- Compress with TinyPNG

### Step 5: Place into HTML template
- Host images on CDN
- Insert URLs into HTML `<img>` tags
- Inline CSS and test in Litmus / Email on Acid

### Step 6: Send test + final send
