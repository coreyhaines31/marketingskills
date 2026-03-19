# EDM Design Principles

Advanced visual design guidelines for email templates. Apply these principles when creating or evaluating EDM designs.

---

## Visual Hierarchy

### The F-Pattern
Subscribers scan emails in an F-pattern — strong top bar, left-aligned secondary scan:
- Put the most important message in the top-left quadrant
- Use the first 100px of height as prime real estate
- Don't bury the CTA below the fold if avoidable

### The Inverted Pyramid
Structure every email section like an inverted pyramid:
```
[WIDE] — Attention-grabbing headline or image
  [MEDIUM] — Supporting context and benefits
    [NARROW] — Single, focused CTA
```

### Focal Points
Every section needs one clear focal point. Use size, color, or white space to create it:
- **Size**: Make the most important thing biggest
- **Color**: Use brand color for CTAs only — don't dilute its signal
- **Space**: Surround the focal point with breathing room

---

## Color Application

### The 60-30-10 Rule
- **60%** — Background/neutral (white, light grey)
- **30%** — Secondary color (light brand tint, section backgrounds)
- **10%** — Accent/action (brand primary, buttons only)

### Background Color Strategy
| Element | Purpose | Color Approach |
|---------|---------|----------------|
| Email wrapper | Frame content | `#f4f4f4` — neutral grey |
| Content body | Main reading area | `#ffffff` — white |
| Hero section | Visual impact | Brand color or strong image |
| Feature callout | Section emphasis | Light brand tint or `#f8f9fa` |
| Footer | Low emphasis | `#f4f4f4` or white |

### Dark Mode Support
~35% of recipients use dark mode. Handle with meta tag + CSS:

```html
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">

<style>
  @media (prefers-color-scheme: dark) {
    /* Email wrapper */
    .email-wrapper { background-color: #121212 !important; }
    /* Content body */
    .email-body { background-color: #1e1e1e !important; }
    /* Text */
    .email-text { color: #e0e0e0 !important; }
    .email-text-muted { color: #999999 !important; }
    /* Dividers */
    .email-divider { border-color: #333333 !important; }
    /* Logo: swap to light version */
    .logo-dark { display: none !important; }
    .logo-light { display: block !important; }
  }
</style>
```

**Logo handling for dark mode:**
```html
<!-- Light logo (shown by default) -->
<img class="logo-dark" src="logo-dark.png" alt="Brand" height="32"
     style="display:block;height:32px;">
<!-- Dark logo (shown in dark mode) -->
<img class="logo-light" src="logo-light.png" alt="Brand" height="32"
     style="display:none;height:32px;max-height:0;overflow:hidden;">
```

---

## Typography in Practice

### Line Length
- Optimal reading: 50-75 characters per line
- At 600px width with 32px padding: ~70 characters at 16px
- Never let body text span full container width without padding

### Typographic Contrast
Create clear hierarchy with only 2-3 font sizes:
- **DO**: 36px headline / 18px subhead / 16px body
- **DON'T**: 28px / 22px / 18px / 16px / 14px (too many levels)

### All-Caps Usage
- OK for labels, category tags, small metadata
- Max 15-20 characters
- Never for body copy — reduces readability 25%

### Widows and Orphans
Avoid single words on the last line of a headline. Use `&nbsp;` between last two words:
```html
<h1>Introducing our brand-new&nbsp;feature</h1>
```

---

## Image Guidelines

### Image Dimensions
| Location | Recommended Size | Max File Size |
|----------|-----------------|---------------|
| Hero image | 1200 × 600px @2x | 200KB |
| Content image (full-width) | 1200 × 800px @2x | 150KB |
| Half-width image | 600 × 500px @2x | 100KB |
| Third-width thumbnail | 400 × 400px @2x | 80KB |
| Logo | varies, 2x retina | 30KB |
| Icon | 96 × 96px @2x | 10KB |

### Retina / HiDPI
Use 2x images but constrain display size with HTML attributes:
```html
<!-- Actual file: 1200px wide. Displayed at 600px. -->
<img src="hero@2x.jpg" width="600" style="width:100%;max-width:600px;" alt="...">
```

### Alt Text Best Practices
- Decorative images: `alt=""` (empty, not missing)
- Informational images: describe content and context
- CTA images: include button text in alt
- Don't start with "Image of" or "Photo of"

```html
<!-- Bad -->
<img src="team.jpg" alt="Image of our team">

<!-- Good -->
<img src="team.jpg" alt="The Acme team at our 2025 annual retreat">

<!-- CTA image -->
<img src="get-started-btn.png" alt="Get started for free">
```

### Image Hosting
- Host on CDN, not email attachments
- Use HTTPS URLs only
- Avoid URL parameters that might trigger spam filters
- Preferred CDNs: Cloudflare, AWS CloudFront, Fastly

---

## White Space as a Design Tool

### When to use more space:
- Between sections (40-60px)
- Around primary CTAs (24px top and bottom)
- After headlines (16px)

### When to use less:
- Between an image and its caption (8px)
- Between list items (4-8px)
- Between label and value pairs (4px)

### The "breathing room" rule:
If two elements feel visually connected, reduce space.
If they feel like different sections, increase space.
When in doubt, add 8px more than you think you need.

---

## CTA Design Patterns

### Button Sizing
- Minimum width: 120px
- Height: 44-54px (minimum 44px for mobile touch)
- Horizontal padding: 24-32px
- Border radius: 4-6px (subtle) or 27px+ (pill shape)

### Button Copy Patterns
| Pattern | Example |
|---------|---------|
| Action + outcome | "Start your free trial" |
| Urgency | "Claim your spot (48 hrs left)" |
| Personalized | "See your report, {{first_name}}" |
| Risk reduction | "Try free — no credit card" |
| Specific | "Download the 2026 Guide" |

### Secondary CTA Styling
Use text links for secondary actions — not buttons:
```html
<p style="text-align:center;margin:16px 0 0;">
  Already have an account?
  <a href="{{login_url}}" style="color:#0066FF;text-decoration:underline;">
    Sign in instead
  </a>
</p>
```

---

## Layout Patterns by Email Type

### Promotional: The Offer Stack
```
LOGO
HERO IMAGE (full-bleed)
BOLD HEADLINE
Single benefit statement
[PRIMARY CTA]
─────────────────
Why now / urgency block
Social proof (1 quote or logos)
[SECONDARY CTA]
FOOTER
```

### Newsletter: The Editorial Stack
```
LOGO + DATE
─────────────────
THIS WEEK IN [topic] (section label)
MAIN STORY — headline + 2 para + link
─────────────────
ALSO WORTH READING (section label)
3 × [image + title + 1 sentence + link]
─────────────────
FROM THE COMMUNITY
1 quote or spotlight
─────────────────
FOOTER
```

### Transactional: The Clarity Stack
```
LOGO
ACTION CONFIRMATION (bold, clear)
Order / account / event details (structured)
[PRIMARY CTA — if action needed]
─────────────────
NEED HELP? (support link)
FOOTER
```

### Re-engagement: The Empathy Stack
```
LOGO
Warm, human subject line
Acknowledge the gap (no blame)
Value reminder — what they're missing
[LOW-FRICTION CTA — "See what's new"]
─────────────────
OR if they want to stop:
[Unsubscribe link — make it easy]
FOOTER
```

---

## Accessibility Checklist

### Color & Contrast
- [ ] Body text contrast ≥ 4.5:1 (WCAG AA)
- [ ] Large text (18px+) contrast ≥ 3:1
- [ ] CTA button contrast ≥ 4.5:1
- [ ] Don't use color alone to convey information

### Structure
- [ ] Heading hierarchy is logical (H1 → H2 → H3)
- [ ] Reading order makes sense without visual layout
- [ ] Links have descriptive text (not "click here")

### Images
- [ ] All meaningful images have alt text
- [ ] Decorative images have `alt=""`
- [ ] Text in images is also in HTML or alt text

### Screen Readers
- [ ] Use `role="presentation"` on layout tables
- [ ] Use semantic HTML where supported
- [ ] Test with a screen reader (VoiceOver or NVDA)

```html
<!-- Layout table accessibility -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
```

---

## Spam Avoidance

### Avoid These in Design
- Excessive use of red or all-caps (triggers spam filters)
- More images than text (image-heavy emails flagged)
- Hidden text (white on white, font-size:0)
- Large attachments
- Broken links

### Deliverability-Friendly Design Choices
- 60%+ text content
- All images hosted on HTTPS CDN
- Clean HTML without excessive nesting
- Under 100KB total email file size (HTML only)
- Test with Mail-Tester.com before sending

### Pre-send Checklist
- [ ] Spam score tested (aim for 7+ on Mail-Tester)
- [ ] All links working and tracked
- [ ] Unsubscribe link confirmed working
- [ ] Rendered in Gmail, Outlook, Apple Mail
- [ ] Rendered on iOS and Android
- [ ] Images load correctly on mobile data
- [ ] Plain-text version looks reasonable
