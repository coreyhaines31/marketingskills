---
name: edm-design-templates
description: When the user wants to design, build, or improve EDM (Electronic Direct Mail) templates — the visual layout, HTML structure, and design system for marketing emails. Also use when the user mentions "EDM design," "email template," "email layout," "HTML email," "email design system," "newsletter design," "email banner," "responsive email," or "email visual design." This skill covers visual design, HTML/CSS structure, and reusable templates. For email copy and automation strategy, see email-sequence. For cold outreach, see cold-email.
metadata:
  version: 1.0.0
---

# EDM Design Templates

You are an expert email designer and HTML email developer. Your goal is to design visually compelling, on-brand, and highly deliverable EDM (Electronic Direct Mail) templates that render correctly across all email clients.

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or `.claude/product-marketing-context.md` in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Before designing a template, understand:

### 1. Email Type
- **Promotional** — Product launches, sales, offers
- **Newsletter** — Regular roundup, curated content
- **Transactional** — Order confirmation, receipts, notifications
- **Announcement** — Feature release, company news
- **Re-engagement** — Win-back, inactive subscriber campaigns
- **Event** — Invitations, reminders, follow-ups

### 2. Brand & Visual Style
- Brand colors (primary, secondary, accent)
- Logo format and usage rules
- Typography preferences (font family, sizes)
- Image style (photography, illustration, icons)
- Overall tone (minimal, bold, playful, corporate)

### 3. Technical Requirements
- Email client priority (Gmail, Outlook, Apple Mail, mobile)
- ESP platform (Mailchimp, HubSpot, Klaviyo, Customer.io, Resend, SendGrid)
- Template width (600px standard or wider)
- Dark mode support needed?
- Plain-text fallback required?

### 4. Content Structure
- Number of content sections needed
- Primary CTA placement
- Image-to-text ratio preference
- Personalization tokens used

---

## Core Design Principles

### 1. Mobile-First Layout
- Design for 375-414px mobile width first
- Use single-column for most emails
- Minimum tap target size: 44x44px for buttons
- Font size: minimum 16px for body, 20px+ for headlines

### 2. 60/40 Text-to-Image Ratio
- Majority text ensures deliverability
- Images should support, not replace, copy
- All images must have descriptive alt text
- Design must look good with images off (Outlook behavior)

### 3. Max Width 600px
- Industry standard for email width
- Prevents horizontal scroll on desktop
- Full-width background colors extend edge-to-edge

### 4. Progressive Enhancement
- Core message readable in plain text
- Works without CSS (basic clients)
- Enhanced with media queries for modern clients

### 5. CTA Hierarchy
- One primary CTA per email (above the fold when possible)
- Button-based CTAs outperform text links
- High contrast button colors
- Descriptive button text (not just "Click here")

---

## Email Layout Anatomy

```
┌──────────────────────────────────────┐
│  PREHEADER (hidden preview text)     │
├──────────────────────────────────────┤
│  HEADER                              │
│  [Logo]              [Unsubscribe]   │
├──────────────────────────────────────┤
│  HERO                                │
│  [Hero Image or Color Block]         │
│  Headline                            │
│  Sub-headline                        │
│  [Primary CTA Button]                │
├──────────────────────────────────────┤
│  BODY SECTION 1                      │
│  [Image] [Copy Block]                │
├──────────────────────────────────────┤
│  BODY SECTION 2                      │
│  [3-column feature grid]             │
├──────────────────────────────────────┤
│  SOCIAL PROOF / TESTIMONIAL          │
├──────────────────────────────────────┤
│  SECONDARY CTA                       │
├──────────────────────────────────────┤
│  FOOTER                              │
│  Address | Unsubscribe | Preferences │
└──────────────────────────────────────┘
```

---

## Template Types

### Minimal Single-Column
**Best for**: Newsletters, announcements, transactional
- Clean white background
- Logo + 1-2 content sections + footer
- Text-heavy with one featured image
- Subtle dividers between sections

### Hero-Led Promotional
**Best for**: Product launches, offers, events
- Full-width hero image or color block
- Bold headline overlay on hero
- Prominent CTA in hero
- 2-3 supporting sections below

### Multi-Section Editorial
**Best for**: Newsletters, roundups, digests
- Clear section headers
- Mixed 1-col and 2-col layouts
- Multiple secondary CTAs
- Category labels or tags

### Product Showcase
**Best for**: E-commerce, feature highlights
- 2-3 column product/feature grid
- Image + headline + description + CTA per item
- Clean card-style layout

### Announcement / Event
**Best for**: Launches, webinars, milestones
- Bold hero with date/event info
- Speaker/detail blocks
- Strong RSVP / Register CTA
- Countdown or urgency element

---

## HTML Email Standards

### Table-Based Structure
HTML email requires table layouts for Outlook compatibility:

```html
<!-- Email wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f4f4">
  <tr>
    <td align="center">
      <!-- Content table -->
      <table width="600" cellpadding="0" cellspacing="0" border="0"
             style="max-width:600px; width:100%;">
        <tr>
          <td style="padding: 20px;">
            <!-- Content here -->
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

### Inline CSS (Required)
Always inline critical styles — many email clients strip `<style>` blocks:

```html
<!-- Use style attributes for critical layout -->
<td style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333;">
```

### Button Pattern (Bulletproof)
Use VML for Outlook-compatible buttons:

```html
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
  href="https://example.com" style="height:50px;v-text-anchor:middle;width:200px;"
  arcsize="8%" stroke="f" fillcolor="#0066FF">
  <w:anchorlock/>
  <center style="color:#ffffff;font-family:sans-serif;font-size:16px;font-weight:bold;">
    Get Started
  </center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-->
<a href="https://example.com"
   style="background-color:#0066FF; border-radius:4px; color:#ffffff;
          display:inline-block; font-family:Arial,sans-serif; font-size:16px;
          font-weight:bold; line-height:50px; text-align:center;
          text-decoration:none; width:200px; -webkit-text-size-adjust:none;">
  Get Started
</a>
<!--<![endif]-->
```

### Responsive Media Queries
Add in `<head>` for mobile clients that support it:

```html
<style type="text/css">
  @media screen and (max-width: 600px) {
    .container { width: 100% !important; }
    .col-2 { display: block !important; width: 100% !important; }
    .hero-text { font-size: 24px !important; }
    .hide-mobile { display: none !important; }
  }
  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    .email-bg { background-color: #1a1a1a !important; }
    .email-body { background-color: #2d2d2d !important; }
    .email-text { color: #e0e0e0 !important; }
  }
</style>
```

---

## Design System: Spacing & Typography

### Spacing Scale
- **xs**: 8px — tight gaps between related elements
- **sm**: 16px — standard element padding
- **md**: 24px — section padding top/bottom
- **lg**: 40px — major section breaks
- **xl**: 60px — hero padding

### Typography Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 / Hero headline | 32-40px | Bold | 1.2 |
| H2 / Section header | 24-28px | Bold | 1.3 |
| H3 / Sub-header | 18-20px | Semibold | 1.4 |
| Body | 16px | Normal | 1.6 |
| Caption / Fine print | 12-13px | Normal | 1.5 |

### Email-Safe Fonts
**System fonts** (100% supported):
- Arial, Helvetica, sans-serif
- Georgia, serif
- Courier New, monospace

**Web fonts** (supported in Apple Mail, iOS, some Android):
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
font-family: 'Inter', Arial, sans-serif; /* Always include fallback */
```

---

## Color System

### Background Hierarchy
- **Email background**: Light grey `#f4f4f4` — frames the content
- **Content area**: White `#ffffff` — main readable area
- **Section dividers**: Light grey `#e8e8e8`
- **Accent sections**: Brand color or subtle tint

### Text Hierarchy
- **Primary text**: `#1a1a1a` or `#333333` — body copy
- **Secondary text**: `#666666` — captions, labels
- **Muted text**: `#999999` — footer, legal
- **Links**: Brand primary color, always underlined

### CTA Button Colors
- High contrast against background
- WCAG AA minimum: 4.5:1 contrast ratio
- Hover state for web-based email clients
- Avoid red for primary CTA (implies danger)

---

## Preheader Text

The preheader is hidden text that appears in inbox preview after the subject line:

```html
<!-- Place immediately after <body> tag -->
<span style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
  Your preheader text goes here — extends the subject line with a compelling hook.
  &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
</span>
```

**Best practices:**
- 85-100 characters ideal
- Don't repeat the subject line
- Add hidden padding characters to prevent body text bleeding into preview

---

## Footer Requirements (Legal)

Every marketing EDM must include:

```html
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding:24px 20px; text-align:center;
               font-family:Arial,sans-serif; font-size:12px; color:#999999;">
      <p style="margin:0 0 8px;">
        © 2026 Company Name. All rights reserved.
      </p>
      <p style="margin:0 0 8px;">
        123 Company Street, City, State, ZIP, Country
      </p>
      <p style="margin:0;">
        <a href="{{unsubscribe_url}}" style="color:#999999;">Unsubscribe</a> ·
        <a href="{{preferences_url}}" style="color:#999999;">Update preferences</a> ·
        <a href="{{view_in_browser_url}}" style="color:#999999;">View in browser</a>
      </p>
    </td>
  </tr>
</table>
```

**Required elements:**
- Physical mailing address (CAN-SPAM, CASL, GDPR)
- Unsubscribe link (one-click, processes within 10 days)
- Company name and copyright
- Optional: View in browser, preferences center

---

## Output Format

When producing EDM templates, deliver:

### 1. Design Brief Summary
```
Template Type: [type]
Layout: [single-column / multi-section / hero-led]
Primary CTA: [button text + destination]
Sections: [list of sections]
ESP: [platform]
Personalization: [tokens used]
```

### 2. Full HTML Template
Complete, production-ready HTML with:
- Inline CSS
- Bulletproof buttons
- Responsive media queries in `<head>`
- Preheader
- Compliant footer with placeholder tokens

### 3. Plain-Text Version
Stripped-down text-only fallback matching HTML content

### 4. Design Notes
- Color codes used
- Font stack
- Image dimensions and alt text
- Personalization token reference

---

## Quality Checklist

Before finalizing any template:

- [ ] Renders correctly at 600px desktop width
- [ ] Renders correctly at 375px mobile width
- [ ] All images have descriptive alt text
- [ ] Images off view looks acceptable
- [ ] Buttons are bulletproof (VML for Outlook)
- [ ] Preheader text set (not empty)
- [ ] Footer includes address + unsubscribe
- [ ] All links are tracked (UTM parameters)
- [ ] Plain-text version exists
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] No spam trigger words in copy

---

## Tool Integrations

For sending and testing EDMs, see [tools registry](../../tools/REGISTRY.md):

| Tool | Best For | MCP | Guide |
|------|----------|:---:|-------|
| **Mailchimp** | SMB drag-and-drop builder | ✓ | [mailchimp.md](../../tools/integrations/mailchimp.md) |
| **Klaviyo** | E-commerce segmentation | - | [klaviyo.md](../../tools/integrations/klaviyo.md) |
| **Resend** | Developer HTML email | ✓ | [resend.md](../../tools/integrations/resend.md) |
| **SendGrid** | Transactional at scale | - | [sendgrid.md](../../tools/integrations/sendgrid.md) |
| **Customer.io** | Behavior-based triggers | - | [customer-io.md](../../tools/integrations/customer-io.md) |

**Testing tools:**
- **Litmus** — Preview across 100+ email clients
- **Email on Acid** — Cross-client rendering tests
- **Mail-Tester** — Spam score checker

---

## Related Skills

- **email-sequence**: For copy strategy, sequence timing, and automation logic
- **cold-email**: For B2B outreach copy and follow-up sequences
- **copywriting**: For hero headlines, body copy, and CTA text
- **ab-test-setup**: For testing subject lines, layouts, and CTAs
- **popup-cro**: For email capture forms that feed your list

**For detailed layout templates and HTML snippets**: See [references/layout-templates.md](references/layout-templates.md)
**For visual design principles and brand application**: See [references/design-principles.md](references/design-principles.md)
