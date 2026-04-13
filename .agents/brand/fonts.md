# NÉVUE Font Library

> **For AI agents:** This is your complete typography reference. When writing HTML emails, design briefs, landing page specs, ad creative direction, or any other branded output — use only fonts and usage rules defined here. Reference `brand-tokens.json` for pixel values and weights.

---

## Quick Reference

| Role | Font | Weight | Source |
|------|------|--------|--------|
| Display / Hero | Cormorant Garamond | 600, 700 | Google Fonts (free) |
| Pull Quotes / Accent | Cormorant Garamond | 400 Italic | Google Fonts (free) |
| Headings H1–H3 | Playfair Display | 700 | Google Fonts (free) |
| Subheadings H4–H5 | Playfair Display | 500 | Google Fonts (free) |
| Body Copy | Inter | 400 | Google Fonts (free) |
| Navigation / Buttons / Labels | DM Sans | 400, 500 | Google Fonts (free) |
| Captions / Metadata | DM Sans | 300, 400 | Google Fonts (free) |

---

## Import Code

### All fonts (single Google Fonts import — use this in HTML `<head>`)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&display=swap" rel="stylesheet">
```

### CSS `@import` (for stylesheets)

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&display=swap');
```

### Individual imports (use when you only need one font)

```html
<!-- Cormorant Garamond only -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet">

<!-- Playfair Display only -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet">

<!-- Inter only -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">

<!-- DM Sans only -->
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet">
```

---

## Font 1 — Cormorant Garamond

**Role:** Display, wordmark-adjacent, hero headlines, pull quotes  
**Character:** High-contrast strokes, elegant serifs, distinctly refined. The closest free font match to the NÉVUE wordmark aesthetic.

### When to use
- Hero section headlines (H1 when used as display)
- Wordmark recreation in HTML/CSS contexts
- Pull quotes and testimonial text
- Luxury feature callouts
- Section openers ("Begin Your Journey")
- Any text that needs to feel editorial, beautiful, or luxurious

### When NOT to use
- Body paragraphs (too decorative for long reads)
- Navigation items
- Form labels
- Legal/disclaimers

### Usage specs

```css
/* Display Hero */
.display-hero {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 600;
  font-size: 72px;
  line-height: 1.1;
  letter-spacing: 0.08em;
  color: var(--nevue-navy);
}

/* Wordmark (CSS recreation) */
.wordmark {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 600;
  font-size: 36px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--nevue-navy);
}

/* Pull Quote */
.pull-quote {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 400;
  font-style: italic;
  font-size: 28px;
  line-height: 1.5;
  letter-spacing: 0.01em;
  color: var(--nevue-charcoal);
}

/* Cormorant on Navy (use gold) */
.display-on-navy {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 600;
  color: var(--nevue-gold);
  letter-spacing: 0.12em;
}
```

### Available weights
| Weight | Name | Best for |
|--------|------|---------|
| 400 | Regular | Pull quotes, editorial text |
| 400 Italic | Regular Italic | Pull quotes, poetic lines, accents |
| 500 | Medium | Subheadings, feature text |
| 500 Italic | Medium Italic | Featured testimonials |
| 600 | Semibold | Hero headlines, section titles |
| 700 | Bold | Maximum emphasis display text |

---

## Font 2 — Playfair Display

**Role:** H1–H4 headings in body content, section titles  
**Character:** A slightly more structured luxury serif than Cormorant. Better for medium-length headlines where legibility matters more than pure elegance. Highly readable at 24–48px.

### When to use
- Page section headings (H1, H2, H3)
- Blog post and article titles
- Email subject-area display text
- Service/treatment page section names
- Pricing page tier names
- Any place a heading needs to feel premium but also be clearly readable

### When NOT to use
- Very small text (below 18px it loses character)
- UI navigation
- Buttons or CTAs

### Usage specs

```css
/* H1 — Page Title */
h1, .h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-size: 48px;
  line-height: 1.2;
  letter-spacing: 0.02em;
  color: var(--nevue-navy);
}

/* H2 — Section Title */
h2, .h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-size: 36px;
  line-height: 1.25;
  letter-spacing: 0.01em;
  color: var(--nevue-navy);
}

/* H3 — Subsection */
h3, .h3 {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 500;
  font-size: 28px;
  line-height: 1.3;
  letter-spacing: 0.01em;
  color: var(--nevue-charcoal);
}

/* H4 — Minor heading */
h4, .h4 {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 500;
  font-size: 22px;
  line-height: 1.4;
  letter-spacing: 0.01em;
  color: var(--nevue-charcoal);
}

/* H2 on Navy background */
.h2-on-navy {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-size: 36px;
  color: var(--nevue-white);
}

/* H3 with gold accent line below */
.section-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-size: 32px;
  color: var(--nevue-navy);
  padding-bottom: 20px;
}
.section-title::after {
  content: '';
  display: block;
  width: 48px;
  height: 1px;
  background: var(--nevue-gold);
  margin-top: 16px;
}
```

### Available weights
| Weight | Name | Best for |
|--------|------|---------|
| 400 | Regular | Softer headings |
| 400 Italic | Regular Italic | Featured article subheads |
| 500 | Medium | H3, H4, card titles |
| 500 Italic | Medium Italic | Secondary headings |
| 700 | Bold | H1, H2, primary page titles |

---

## Font 3 — Inter

**Role:** Body copy, descriptions, paragraphs, long-form content  
**Character:** The gold standard for digital readability. Neutral, highly legible at all sizes, humanist proportions that feel warm without being casual. Used by thousands of modern premium products.

### When to use
- All body paragraphs
- Product/service descriptions
- Blog post body text
- Email body copy
- FAQ answers
- Any text exceeding 2 lines

### When NOT to use
- Headlines or anything requiring elegance
- Buttons or navigation (use DM Sans)
- Wordmarks or display text

### Usage specs

```css
/* Body default */
body, .body-text {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.7;
  letter-spacing: 0;
  color: var(--nevue-charcoal);
}

/* Body large (intro paragraphs) */
.body-lg {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.75;
  color: var(--nevue-charcoal);
}

/* Body small (secondary text, supporting copy) */
.body-sm {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.6;
  color: var(--nevue-charcoal);
}

/* On navy backgrounds */
.body-on-navy {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.7;
  color: rgba(250, 250, 248, 0.85);
}

/* Emphasis (use instead of bold) */
.body-emphasis {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-style: italic;
  color: var(--nevue-navy);
}
```

### Available weights
| Weight | Name | Best for |
|--------|------|---------|
| 300 | Light | Captions, subtle secondary text |
| 400 | Regular | All body copy (default) |
| 500 | Medium | Mild emphasis, intro paragraphs |
| 600 | Semibold | Strong emphasis without being bold |

---

## Font 4 — DM Sans

**Role:** UI text — navigation, buttons, labels, captions, metadata, form text  
**Character:** Geometric sans-serif with friendly precision. Where Inter is warm for long reads, DM Sans is crisp for short functional text. Perfect for anything a user needs to scan, click, or act on.

### When to use
- Navigation items
- Button text (always uppercase + tracked)
- Form labels and input text
- Price tags and numerical data
- Metadata (dates, categories, tags)
- Captions and photo credits
- Legal/disclaimer text
- Table headers
- Badge/tag labels

### When NOT to use
- Paragraphs or long-form text (use Inter)
- Emotional or editorial headlines (use Cormorant/Playfair)

### Usage specs

```css
/* Button (primary pattern) */
.btn {
  font-family: 'DM Sans', -apple-system, sans-serif;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1;
}

/* Navigation */
nav a, .nav-item {
  font-family: 'DM Sans', sans-serif;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--nevue-charcoal);
}

/* Label / Tag */
.label {
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--nevue-charcoal);
}

/* Caption */
.caption {
  font-family: 'DM Sans', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: 0.02em;
  color: var(--nevue-mist);
}

/* Price display */
.price {
  font-family: 'DM Sans', sans-serif;
  font-weight: 300;
  font-size: 32px;
  letter-spacing: -0.01em;
  color: var(--nevue-navy);
}

/* Form label */
label, .form-label {
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--nevue-charcoal);
  margin-bottom: 8px;
}
```

### Available weights
| Weight | Name | Best for |
|--------|------|---------|
| 300 | Light | Price figures, display numbers |
| 400 | Regular | Navigation, captions, form inputs |
| 500 | Medium | Buttons, labels, active states |
| 600 | Semibold | Strong UI emphasis |

---

## Complete CSS Stylesheet (Copy-Paste Ready)

Use this as the base typography stylesheet for any NÉVUE branded web page, email template, or landing page.

```css
/* ============================================
   NÉVUE TYPOGRAPHY SYSTEM
   v1.0 — Include after Google Fonts import
   ============================================ */

:root {
  --font-display:  'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  --font-heading:  'Playfair Display', Georgia, serif;
  --font-body:     'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-ui:       'DM Sans', -apple-system, sans-serif;

  --nevue-navy:    #1B2744;
  --nevue-gold:    #C9A96E;
  --nevue-cream:   #EDE0CC;
  --nevue-linen:   #F5EDD8;
  --nevue-marble:  #F2EFEC;
  --nevue-white:   #FAFAF8;
  --nevue-charcoal:#1A1A2E;
  --nevue-mist:    #D6CFC5;
}

/* Base */
*, *::before, *::after { box-sizing: border-box; }

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--nevue-charcoal);
  background-color: var(--nevue-white);
}

/* Display */
.display-xl {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(48px, 6vw, 72px);
  line-height: 1.1;
  letter-spacing: 0.08em;
}

.display-lg {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(40px, 5vw, 56px);
  line-height: 1.15;
  letter-spacing: 0.08em;
}

.wordmark {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

/* Headings */
h1, .h1 {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: clamp(36px, 4vw, 48px);
  line-height: 1.2;
  letter-spacing: 0.02em;
  color: var(--nevue-navy);
  margin-bottom: 1rem;
}

h2, .h2 {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: clamp(28px, 3vw, 36px);
  line-height: 1.25;
  letter-spacing: 0.01em;
  color: var(--nevue-navy);
  margin-bottom: 0.875rem;
}

h3, .h3 {
  font-family: var(--font-heading);
  font-weight: 500;
  font-size: clamp(22px, 2.5vw, 28px);
  line-height: 1.3;
  letter-spacing: 0.01em;
  color: var(--nevue-charcoal);
  margin-bottom: 0.75rem;
}

h4, .h4 {
  font-family: var(--font-heading);
  font-weight: 500;
  font-size: clamp(18px, 2vw, 22px);
  line-height: 1.4;
  letter-spacing: 0.01em;
  color: var(--nevue-charcoal);
  margin-bottom: 0.5rem;
}

/* Body */
p, .body {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--nevue-charcoal);
  margin-bottom: 1rem;
}

.body-lg {
  font-size: 1.125rem;
  line-height: 1.75;
}

.body-sm {
  font-size: 0.875rem;
  line-height: 1.6;
}

/* Pull Quote */
.pull-quote {
  font-family: var(--font-display);
  font-weight: 400;
  font-style: italic;
  font-size: clamp(22px, 2.5vw, 28px);
  line-height: 1.5;
  color: var(--nevue-navy);
  border-left: 1px solid var(--nevue-gold);
  padding-left: 24px;
  margin: 40px 0;
}

/* UI Elements */
.label, label {
  font-family: var(--font-ui);
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--nevue-charcoal);
}

.caption {
  font-family: var(--font-ui);
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--nevue-mist);
}

nav a, .nav-link {
  font-family: var(--font-ui);
  font-weight: 400;
  font-size: 0.875rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--nevue-charcoal);
  transition: color 0.2s ease;
}

nav a:hover, .nav-link:hover {
  color: var(--nevue-navy);
}

/* Buttons */
.btn {
  font-family: var(--font-ui);
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1;
  padding: 14px 32px;
  border-radius: 0;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  display: inline-block;
  text-decoration: none;
}

.btn-primary {
  background: var(--nevue-navy);
  color: var(--nevue-white);
  border: 1px solid var(--nevue-navy);
}

.btn-primary:hover {
  background: var(--nevue-gold);
  border-color: var(--nevue-gold);
  color: var(--nevue-navy);
}

.btn-secondary {
  background: transparent;
  color: var(--nevue-navy);
  border: 1px solid var(--nevue-navy);
}

.btn-secondary:hover {
  background: var(--nevue-navy);
  color: var(--nevue-white);
}

.btn-ghost {
  background: transparent;
  color: var(--nevue-gold);
  border: 1px solid var(--nevue-gold);
}

.btn-ghost:hover {
  background: var(--nevue-gold);
  color: var(--nevue-navy);
}

/* Gold Divider (signature NÉVUE element) */
.gold-divider {
  width: 48px;
  height: 1px;
  background: var(--nevue-gold);
  margin: 24px 0;
}

.gold-divider-centered {
  width: 48px;
  height: 1px;
  background: var(--nevue-gold);
  margin: 24px auto;
}

/* Price */
.price {
  font-family: var(--font-ui);
  font-weight: 300;
  font-size: 2rem;
  letter-spacing: -0.01em;
  color: var(--nevue-navy);
}

.price-currency {
  font-size: 1rem;
  vertical-align: top;
  margin-top: 6px;
  display: inline-block;
}

/* Badge */
.badge {
  font-family: var(--font-ui);
  font-weight: 500;
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 12px;
  display: inline-block;
  background: var(--nevue-gold);
  color: var(--nevue-navy);
}
```

---

## Email-Safe Font Stack

For HTML emails (many clients don't load Google Fonts), use these fallback stacks:

```html
<!-- In email <style> tags or inline styles -->

<!-- Display/Hero text -->
<style>
  .email-display {
    font-family: 'Cormorant Garamond', 'Garamond', Georgia, serif;
    font-weight: bold;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  /* Heading */
  .email-heading {
    font-family: 'Playfair Display', 'Palatino Linotype', 'Book Antiqua', Georgia, serif;
    font-weight: bold;
  }

  /* Body */
  .email-body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.7;
  }

  /* UI/Buttons */
  .email-btn {
    font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
</style>
```

**Email rendering notes:**
- Gmail, Outlook Windows, and Apple Mail all support web fonts via `@import` in `<style>` — include the Google Fonts import
- Outlook desktop (Windows) does NOT reliably load web fonts — always define fallbacks
- For critical logo/wordmark text in email, use an image rather than live text to guarantee rendering
- Test serif body fonts in Outlook before deploying — fallbacks may render larger than expected

---

## Typography Do's and Don'ts

### Do
- ✅ Use wide letter-spacing (0.08–0.22em) on display text
- ✅ Pair a serif headline with sans-serif body on the same section
- ✅ Use Cormorant Garamond Italic for pull quotes and poetic lines
- ✅ Use the gold divider (48px horizontal line) to separate sections
- ✅ Keep body text at minimum 16px, 1.7 line height
- ✅ Use generous padding around all type

### Don't
- ✗ Don't mix Cormorant and Playfair in the same headline
- ✗ Don't bold body text — use italic + weight 500 for emphasis
- ✗ Don't use Inter or DM Sans for hero display text
- ✗ Don't use tight letter-spacing (negative tracking) on serif text
- ✗ Don't use more than two typefaces in a single design
- ✗ Don't use any font not in this library without explicit brand approval
- ✗ Don't use font sizes below 12px for any readable content
- ✗ Don't set long-form copy in all-caps — it's unreadable and un-brand

---

## Agent Copy-Paste Templates

### Email header (HTML)
```html
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1B2744;">
  <tr>
    <td align="center" style="padding:40px 40px 32px;">
      <p style="
        font-family:'Cormorant Garamond',Georgia,serif;
        font-weight:600;
        font-size:28px;
        letter-spacing:0.22em;
        text-transform:uppercase;
        color:#C9A96E;
        margin:0;
      ">NÉVUE</p>
    </td>
  </tr>
</table>
```

### Section heading with gold divider (HTML)
```html
<div style="text-align:center; padding:80px 40px 40px;">
  <p style="
    font-family:'DM Sans',-apple-system,sans-serif;
    font-weight:500;
    font-size:12px;
    letter-spacing:0.14em;
    text-transform:uppercase;
    color:#C9A96E;
    margin:0 0 16px;
  ">OUR SERVICES</p>
  <h2 style="
    font-family:'Playfair Display',Georgia,serif;
    font-weight:700;
    font-size:36px;
    line-height:1.25;
    letter-spacing:0.01em;
    color:#1B2744;
    margin:0 0 20px;
  ">Precision Wellness, Elevated</h2>
  <div style="width:48px;height:1px;background:#C9A96E;margin:0 auto;"></div>
</div>
```

### CTA button (HTML email-safe)
```html
<table cellpadding="0" cellspacing="0" style="margin:32px auto;">
  <tr>
    <td align="center" style="
      background-color:#1B2744;
      padding:14px 40px;
    ">
      <a href="[URL]" style="
        font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Arial,sans-serif;
        font-weight:500;
        font-size:13px;
        letter-spacing:0.12em;
        text-transform:uppercase;
        color:#FAFAF8;
        text-decoration:none;
        display:block;
      ">Book Your Visit</a>
    </td>
  </tr>
</table>
```

### Pull quote (HTML)
```html
<blockquote style="
  font-family:'Cormorant Garamond',Georgia,serif;
  font-weight:400;
  font-style:italic;
  font-size:26px;
  line-height:1.5;
  color:#1B2744;
  border-left:1px solid #C9A96E;
  padding-left:24px;
  margin:40px 0;
">
  "The results speak quietly. Clients return monthly."
</blockquote>
```
