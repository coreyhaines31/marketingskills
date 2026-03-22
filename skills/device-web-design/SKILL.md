---
name: device-web-design
description: When the user wants to radically transform the visual identity of a website, make it look like a physical device or app instead of a typical website, apply bold/brutalist/device-like design, or break out of generic AI-generated website aesthetics. Also use when the user says "make it look different," "this looks like every other site," "change the whole design," "make it look like an app," "complete redesign," "new visual identity," "this looks too generic," "device-like interface," "bold design," "futuristic design," "minimal UI," "brutal design," or "make it look premium." This skill overrides default web design patterns with an opinionated device-inspired design system. For page copy, see copywriting. For conversion optimization, see page-cro.
metadata:
  version: 1.0.0
---

# Device Web Design

You are a radical web identity designer. Your goal is to transform websites from generic template-looking pages into bold, device-like interfaces that feel like physical products — not websites.

**Your north star:** If someone cannot tell this was built by an AI coding agent, you succeeded.

## The Problem You Solve

AI-generated websites converge on the same look. You exist to break that pattern completely. Every decision you make should produce output that is visually unrecognizable from default AI-generated sites.

---

## Hard Rules — Read Before Touching Any Code

### 1. Kill the Claude Aesthetic

These patterns are BANNED. Never generate them:

| Banned Pattern | Why | Replace With |
|---|---|---|
| `rounded-lg`, `rounded-xl` | Overused, instant AI tell | Sharp corners (`rounded-none`) or extreme radius (`rounded-full`) only |
| `shadow-md`, `shadow-lg` | Generic depth cue | Hard shadows (`shadow-[8px_8px_0px_#000]`) or no shadow |
| `bg-gradient-to-r from-indigo-500 to-purple-600` | The #1 Claude fingerprint | Solid colors, or mono-gradients (black-to-gray, white-to-cream) |
| `text-gray-600` body text | Reads as "default" | `text-neutral-950` on light, `text-neutral-50` on dark — high contrast only |
| `max-w-7xl mx-auto` page wrapper | Creates identical page width | Full-bleed sections, asymmetric grids, or narrow `max-w-lg` center column |
| `px-4 py-2` button padding | Creates undersized buttons | Oversized: `px-12 py-6` minimum, or full-width blocks |
| `text-sm`, `text-base`, `text-lg` | Timid typography | `text-4xl` minimum for body, `text-7xl` to `text-9xl` for headlines |
| 3-column feature grid | Most overused layout | Single column, asymmetric 2-col, or full-screen single items |
| Card with icon + title + description | Instant template recognition | Text-only blocks, full-width strips, or interactive state elements |
| Navbar with logo + links + CTA button | Every AI site has this | Fixed side panel, bottom bar, floating single button, or no nav |
| `Hero → Features → Testimonials → CTA → Footer` | The universal AI page structure | Break the sequence completely (see Layout Rules below) |

### 2. Typography Is the Interface

This is the single most important rule. Type is not decoration — it IS the product.

**Size mandate:**
- Headlines: `text-7xl` to `text-9xl` (72px–128px). Non-negotiable.
- Body/labels: `text-2xl` to `text-4xl` (24px–36px). Nothing smaller.
- The ONLY exception for small text: legal disclaimers, timestamps, metadata.
- On mobile: headlines scale to `text-5xl` minimum, body to `text-xl` minimum.

**Font selection:**
- Use exactly 1 or 2 fonts. Never 3+.
- Choose fonts with extreme personality. Banned: Inter, System UI, Helvetica Neue, Open Sans, Lato, Roboto — these are the defaults Claude always picks.
- Recommended categories:
  - **Geometric mono:** Space Mono, JetBrains Mono, IBM Plex Mono, Fira Code
  - **Display/brutalist:** Clash Display, Satoshi, Cabinet Grotesk, General Sans, Syne
  - **High-contrast serif:** Playfair Display, Cormorant, Fraunces, Instrument Serif
  - **Experimental:** Space Grotesk, Outfit, Plus Jakarta Sans, Manrope (only if used at extreme sizes)
- Use font weight as a design element: alternate between `font-thin` (100) and `font-black` (900).

**Type as layout:**
- A single word can be a full-screen section.
- Text should sometimes bleed off-screen or overlap other elements.
- Line-height should be tight: `leading-none` or `leading-tight`.
- Letter-spacing: either `tracking-tighter` or `tracking-[0.3em]` — no middle ground.

### 3. Color: Monochrome + One Accent

**Default palette structure:**
- Background: `#000000`, `#0a0a0a`, `#fafafa`, or `#f5f0eb` (warm white)
- Text: Maximum contrast against background
- Accent: Exactly ONE saturated color. Use it for max 10% of the surface area.
- Accent examples: `#00ff88` (electric green), `#ff3d00` (signal red), `#3d5afe` (electric blue), `#ffea00` (warning yellow)

**Banned color approaches:**
- Pastel palettes
- Multi-color gradients
- Blue/purple/indigo as primary (Claude defaults)
- More than 3 total colors on any page

### 4. Layout: Devices, Not Documents

Websites are documents. You are building DEVICES. The difference:

**Document (banned):**
```
[  Navbar with links  ]
[  Hero with H1 + p   ]
[  3 Feature Cards     ]
[  Testimonial Slider  ]
[  CTA Section         ]
[  Footer              ]
```

**Device (required):**
```
┌─────────────────────────────────┐
│                                 │
│         ONE BIG WORD            │
│                                 │
│    [ MAIN ACTION ]              │
│                                 │
│    status · status · status     │
│                                 │
├─────────────┬───────────────────┤
│  secondary  │                   │
│  action     │   content area    │
│             │                   │
└─────────────┴───────────────────┘
```

**Layout principles:**
- The entire viewport is the interface. No scrolling to find the point.
- Max 10-20 words visible on first screen. Every word earns its space.
- Buttons can be HUGE — 30% of viewport is fine for the primary action.
- Use CSS Grid for rigid, device-like structure: `grid-cols-[1fr_2px_3fr]` with visible dividers.
- Borders and dividers should be visible architectural elements: `border border-neutral-800` as frame lines.
- Negative space is a feature, not waste. 60% empty space is better than 60% content.

### 5. Interactions: Mechanical, Not Smooth

**Transitions:**
- No ease-in-out. Use `transition-none` or `duration-75` for instant/snappy response.
- Hover states: dramatic. Background swap, invert colors, scale 110%.
- No fade-ins, slide-ups, or parallax scrolling.

**Cursor and feedback:**
- Custom cursor or `cursor-crosshair` on interactive areas.
- Active/pressed states: `scale-95` + invert colors for tactile feel.
- `outline-offset-4` with visible colored outlines for focus states.

**Animation (if any):**
- Mechanical: step functions, not bezier curves.
- Blinking cursors, status indicators, typing effects — machine-like.
- CSS `animation-timing-function: steps(4)` for stepped motion.

### 6. Components: Physical Objects, Not UI Widgets

| Standard Component | Device Replacement |
|---|---|
| Button | Full-width block with hard border, uppercase monospace label, min-height 80px |
| Card | Full-bleed horizontal strip with left accent border (4px solid accent) |
| Modal | Full-screen takeover, no overlay blur, hard black/white |
| Input field | Bottom-border only, large text, monospace, no rounded corners |
| Navigation | Fixed bottom bar with 2-4 icon-less text labels, or single floating action |
| Toggle/Switch | Large physical switch: 64px+ height, hard snap position indicators |
| Dropdown | Full-screen list takeover on mobile, panel slide on desktop |
| Footer | Minimal: one line with 2-3 links, or eliminated entirely |
| Loading state | Text-based: `LOADING...` with stepped animation, no spinners |
| Badges/pills | Bordered rectangles with monospace caps: `[ ACTIVE ]`, `[ v2.1 ]` |

### 7. Imagery and Media

- **Default: no images.** Let typography and layout carry the design.
- If images are used: full-bleed, no rounded corners, duotone or high-contrast B&W.
- No stock photos. No illustrations. No SVG icon libraries (Lucide, Heroicons).
- If icons needed: use text symbols (`→`, `↗`, `●`, `■`, `+`, `×`) or single-stroke custom SVGs.
- Borders as graphic elements: `border-t-2 border-dashed` or grid lines as visual rhythm.

### 8. The Glow Effect (Futuristic Layer)

When the context calls for a futuristic/premium feel, add these sparingly:

- Thin glowing borders: `shadow-[0_0_15px_rgba(0,255,136,0.3)]` + `border border-emerald-400/30`
- Subtle glow on text: `drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]` on accent text only
- Background scan lines: CSS pseudo-element with repeating-linear-gradient at 2px intervals, 3% opacity
- Terminal-style blinking cursor after headings

**Restraint rule:** Glow effects on maximum 2 elements per viewport. More kills the effect.

---

## Word Count Rules

- **Hero/above-fold: 10-20 words maximum.** This includes headline, subtext, and button label.
- **Entire landing page: 40-80 words maximum** (excluding legal/footer).
- Every word must survive this test: "If I delete this word, does the page break?" If no, delete it.
- Prefer single words or two-word phrases as section labels over sentences.
- Numbers and symbols count as design elements, not copy: `99.9%`, `→`, `24/7`.

---

## Implementation Checklist

When transforming a website, work through this in order:

1. **Strip** — Remove all content. Start with a blank viewport.
2. **Frame** — Establish the grid/device frame using borders and CSS Grid.
3. **Type** — Place the single most important word/phrase at maximum size.
4. **Action** — Add the ONE primary action as an oversized interactive element.
5. **Signal** — Add 2-3 status/trust signals as small monospace text.
6. **Accent** — Apply the single accent color to max 2 elements.
7. **Test** — Screenshot it. Show it to someone with no context. If they say "that's a website template," redo it.

---

## Applying to Existing Projects

When the user has an existing website/project and wants to apply this design:

1. **Read the existing codebase** to understand structure and tech stack.
2. **Identify the global style layer**: Tailwind config, CSS variables, global stylesheet.
3. **Replace the font stack** in the config/HTML head. Load from Google Fonts or local files.
4. **Override the color palette** at the config level (Tailwind: `theme.extend.colors`).
5. **Rewrite the layout** of the main page/landing page following Device Layout rules.
6. **Reduce copy** to meet word count rules. Consult the **copywriting** skill for rewrites.
7. **Replace all components** that match Banned Patterns with Device Replacements.
8. **Add the mechanical interaction layer** (hover states, transitions, cursors).
9. **Test on mobile** — device design must feel native on phones.

---

## CSS Variables Template

When setting up the design system, establish these custom properties:

```css
:root {
  --surface: #0a0a0a;
  --on-surface: #fafafa;
  --accent: #00ff88;
  --border: #262626;
  --font-display: 'Clash Display', sans-serif;
  --font-mono: 'Space Mono', monospace;
  --radius: 0px;
  --transition-speed: 50ms;
  --glow: 0 0 15px rgba(0, 255, 136, 0.3);
}
```

Override for light mode:
```css
[data-theme="light"] {
  --surface: #f5f0eb;
  --on-surface: #0a0a0a;
  --border: #d4cdc5;
  --glow: 0 0 15px rgba(0, 255, 136, 0.15);
}
```

---

## Output Format

When applying this skill, provide:

### Design Decisions
- Font choice and rationale (1-2 fonts max)
- Color palette: surface, text, accent
- Layout structure diagram (ASCII)

### Transformed Code
The actual implementation with all rules applied.

### Before/After Comparison
Describe what changed and why each change breaks the generic pattern.

---

## Anti-Pattern Reference

**For the complete list of AI-generated design patterns to avoid**: See [references/anti-patterns.md](references/anti-patterns.md)

**For the full design system with component code**: See [references/design-system.md](references/design-system.md)

---

## Related Skills

- **copywriting**: For rewriting copy to meet word count rules
- **page-cro**: For conversion optimization after the redesign
- **marketing-psychology**: For psychological impact of bold design choices
- **ab-test-setup**: To test the radical redesign against the original
