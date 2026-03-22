# Device Web Design — Complete Design System

## Font Stacks (Copy-Paste Ready)

### Option A: Brutalist Mono (Recommended for tools, dashboards, technical products)
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Clash+Display:wght@200;400;600;700&display=swap" rel="stylesheet">
```
```css
--font-display: 'Clash Display', sans-serif;
--font-mono: 'Space Mono', monospace;
```

### Option B: High-Contrast Editorial (For content products, media, premium brands)
```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Cabinet+Grotesk:wght@100;900&display=swap" rel="stylesheet">
```
```css
--font-display: 'Cabinet Grotesk', sans-serif;
--font-serif: 'Instrument Serif', serif;
```

### Option C: Geometric Industrial (For SaaS, dev tools, B2B)
```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
```
```css
--font-display: 'Syne', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Option D: Warm Minimal (For lifestyle, creative, consumer products)
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@100;900&family=General+Sans:wght@400;600&display=swap" rel="stylesheet">
```
```css
--font-display: 'Fraunces', serif;
--font-body: 'General Sans', sans-serif;
```

---

## Color Palettes (5 Pre-Built)

### Palette 1: Void + Electric Green (Default)
```css
--surface: #0a0a0a;
--on-surface: #fafafa;
--accent: #00ff88;
--accent-dim: rgba(0, 255, 136, 0.15);
--border: #262626;
--surface-raised: #141414;
```

### Palette 2: Paper + Signal Red
```css
--surface: #f5f0eb;
--on-surface: #0a0a0a;
--accent: #ff3d00;
--accent-dim: rgba(255, 61, 0, 0.1);
--border: #d4cdc5;
--surface-raised: #ebe5de;
```

### Palette 3: Midnight + Electric Blue
```css
--surface: #050a18;
--on-surface: #e8eaf6;
--accent: #3d5afe;
--accent-dim: rgba(61, 90, 254, 0.15);
--border: #1a237e;
--surface-raised: #0d1547;
```

### Palette 4: Concrete + Warning Yellow
```css
--surface: #1a1a1a;
--on-surface: #e0e0e0;
--accent: #ffea00;
--accent-dim: rgba(255, 234, 0, 0.12);
--border: #333333;
--surface-raised: #242424;
```

### Palette 5: Pure White + Black (Ultra Minimal)
```css
--surface: #ffffff;
--on-surface: #000000;
--accent: #000000;
--accent-dim: rgba(0, 0, 0, 0.05);
--border: #000000;
--surface-raised: #f5f5f5;
```

---

## Tailwind Config Override

Replace or extend the default Tailwind config:

```js
// tailwind.config.js
module.exports = {
  theme: {
    borderRadius: {
      none: '0px',
      full: '9999px',
      DEFAULT: '0px', // Force sharp corners globally
    },
    extend: {
      colors: {
        surface: 'var(--surface)',
        'on-surface': 'var(--on-surface)',
        accent: 'var(--accent)',
        'accent-dim': 'var(--accent-dim)',
        border: 'var(--border)',
        'surface-raised': 'var(--surface-raised)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        'display-xl': ['clamp(4rem, 10vw, 8rem)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(3rem, 7vw, 6rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.01em' }],
        'body-lg': ['clamp(1.25rem, 2.5vw, 2rem)', { lineHeight: '1.3' }],
        'body-md': ['clamp(1rem, 2vw, 1.5rem)', { lineHeight: '1.4' }],
        'label': ['0.75rem', { lineHeight: '1', letterSpacing: '0.15em', fontWeight: '500' }],
      },
      boxShadow: {
        'hard': '8px 8px 0px var(--on-surface)',
        'hard-sm': '4px 4px 0px var(--on-surface)',
        'glow': '0 0 15px var(--accent-dim)',
        'glow-strong': '0 0 30px var(--accent-dim), 0 0 60px var(--accent-dim)',
      },
      transitionDuration: {
        '0': '0ms',
        '50': '50ms',
      },
    },
  },
}
```

---

## Component Library

### Primary Action Button

```html
<!-- Full-width device button -->
<button class="
  w-full min-h-[80px]
  bg-accent text-surface
  font-mono text-body-lg font-bold uppercase tracking-[0.15em]
  border-2 border-on-surface
  transition-all duration-50
  hover:bg-on-surface hover:text-surface
  active:scale-95
  cursor-crosshair
">
  START NOW
</button>
```

### Oversized Hero Button (30% viewport)

```html
<button class="
  w-full h-[30vh]
  bg-surface text-on-surface
  font-display text-display-lg font-black uppercase
  border border-border
  transition-colors duration-50
  hover:bg-accent hover:text-surface
  active:scale-[0.98]
  cursor-crosshair
  flex items-center justify-center
">
  OPEN
</button>
```

### Secondary Action (Ghost)

```html
<button class="
  px-8 py-4 min-h-[64px]
  bg-transparent text-on-surface
  font-mono text-body-md uppercase tracking-[0.2em]
  border border-border
  transition-all duration-50
  hover:border-accent hover:text-accent hover:shadow-glow
  active:scale-95
">
  LEARN MORE →
</button>
```

### Status Badge

```html
<span class="
  inline-flex items-center
  px-3 py-1
  font-mono text-label uppercase tracking-[0.2em]
  border border-border text-on-surface/60
">
  ● LIVE
</span>
```

### Full-Width Strip (replaces Card)

```html
<div class="
  w-full py-8 px-6
  border-t border-border
  flex items-center justify-between
  group
  transition-colors duration-50
  hover:bg-surface-raised
  cursor-crosshair
">
  <span class="font-display text-display-md font-bold text-on-surface">
    Features
  </span>
  <span class="
    font-mono text-body-md text-on-surface/40
    group-hover:text-accent
    transition-colors duration-50
  ">
    →
  </span>
</div>
```

### Input Field (Device Style)

```html
<div class="w-full">
  <label class="
    block font-mono text-label uppercase tracking-[0.2em] text-on-surface/50
    mb-2
  ">
    EMAIL
  </label>
  <input type="email" class="
    w-full bg-transparent text-on-surface
    font-mono text-body-lg
    border-0 border-b-2 border-border
    py-3 px-0
    focus:border-accent focus:outline-none
    placeholder:text-on-surface/20
    transition-colors duration-50
  " placeholder="you@company.com" />
</div>
```

### Navigation — Bottom Bar

```html
<nav class="
  fixed bottom-0 left-0 right-0 z-50
  bg-surface/95 backdrop-blur-sm
  border-t border-border
  flex items-center justify-around
  h-16
  font-mono text-label uppercase tracking-[0.15em]
">
  <a href="#" class="text-accent">HOME</a>
  <a href="#" class="text-on-surface/50 hover:text-on-surface transition-colors duration-50">PRODUCT</a>
  <a href="#" class="text-on-surface/50 hover:text-on-surface transition-colors duration-50">ABOUT</a>
</nav>
```

### Navigation — Floating Single Button

```html
<button class="
  fixed top-6 right-6 z-50
  w-14 h-14
  bg-surface border border-border
  text-on-surface font-mono text-lg
  flex items-center justify-center
  hover:bg-accent hover:text-surface hover:shadow-glow
  transition-all duration-50
  cursor-crosshair
">
  ≡
</button>
```

### Full-Screen Menu (opened state)

```html
<div class="
  fixed inset-0 z-40
  bg-surface
  flex flex-col items-center justify-center gap-2
">
  <a href="#" class="
    font-display text-display-xl font-black
    text-on-surface hover:text-accent
    transition-colors duration-50
    leading-none
  ">PRODUCT</a>
  <a href="#" class="
    font-display text-display-xl font-black
    text-on-surface hover:text-accent
    transition-colors duration-50
    leading-none
  ">PRICING</a>
  <a href="#" class="
    font-display text-display-xl font-black
    text-on-surface hover:text-accent
    transition-colors duration-50
    leading-none
  ">CONTACT</a>
</div>
```

### Toggle / Switch (Device-Scale)

```html
<button class="
  relative w-[120px] h-[56px]
  bg-surface border-2 border-border
  cursor-crosshair
  transition-colors duration-50
  data-[active=true]:border-accent
" data-active="false">
  <span class="
    absolute top-1 left-1
    w-[48px] h-[48px]
    bg-on-surface
    transition-transform duration-75
    data-[active=true]:translate-x-[64px]
    data-[active=true]:bg-accent
  "></span>
</button>
```

---

## Page Templates

### Template A: The Monolith (Single Product Launch)

```
┌────────────────────────────────────┐
│                                    │
│                                    │
│          PRODUCT NAME              │  ← text-display-xl, centered
│                                    │
│      one line description          │  ← text-body-lg, muted
│                                    │
│     ┌──────────────────────┐       │
│     │     GET ACCESS       │       │  ← 30% viewport button
│     └──────────────────────┘       │
│                                    │
│   ● LIVE    v2.1    1,204 users    │  ← status row, monospace
│                                    │
└────────────────────────────────────┘
```

Total words: ~12

### Template B: The Dashboard Gate (App with Login)

```
┌──────────┬─────────────────────────┐
│          │                         │
│  LOGO    │                         │
│          │    Welcome back.        │  ← text-display-md
│  ─────── │                         │
│          │    _______________       │  ← email input
│  About   │    _______________       │  ← password input
│  Docs    │                         │
│  Status  │    [ ENTER ]            │  ← full-width button
│          │                         │
│          │    or continue with →   │
│  ─────── │                         │
│  v3.0.1  │                         │
│          │                         │
└──────────┴─────────────────────────┘
```

Total words: ~10

### Template C: The Switchboard (Multi-Feature Product)

```
┌────────────────────────────────────┐
│  BRAND          ● ONLINE     [≡]  │  ← top bar
├────────────────────────────────────┤
│                                    │
│   Do one thing                     │  ← text-display-lg
│   incredibly well.                 │
│                                    │
├──────────────────┬─────────────────┤
│                  │                 │
│  [ FEATURE A → ] │ [ FEATURE C → ]│  ← full-height strips
│                  │                 │
│  [ FEATURE B → ] │ [ FEATURE D → ]│
│                  │                 │
├──────────────────┴─────────────────┤
│  START FREE         WATCH DEMO →   │  ← bottom action bar
└────────────────────────────────────┘
```

Total words: ~16

### Template D: The Terminal (Developer/Technical Product)

```
┌────────────────────────────────────┐
│  $ product-name                    │  ← monospace header
│                                    │
│  Ship faster.                      │  ← text-display-xl
│  Break nothing.                    │
│                                    │
│  ┌────────────────────────────┐    │
│  │  npm install product-name  │    │  ← code block, copyable
│  └────────────────────────────┘    │
│                                    │
│  ████████████████████░░░░  82%     │  ← progress/trust indicator
│  12,847 installs this week         │
│                                    │
│  [ DOCS ]  [ GITHUB ]  [ DISCORD ] │  ← 3 equal buttons
└────────────────────────────────────┘
```

Total words: ~18

---

## Glow Effects (Copy-Paste)

### Glowing Border
```css
.glow-border {
  border: 1px solid rgba(0, 255, 136, 0.3);
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.1), inset 0 0 15px rgba(0, 255, 136, 0.05);
}
```

### Glowing Text
```css
.glow-text {
  color: var(--accent);
  text-shadow: 0 0 10px var(--accent-dim), 0 0 40px var(--accent-dim);
}
```

### Scan Lines Overlay
```css
.scan-lines::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
  pointer-events: none;
}
```

### Blinking Cursor
```css
.blink-cursor::after {
  content: '█';
  animation: blink 1s steps(1) infinite;
  color: var(--accent);
  margin-left: 4px;
}
@keyframes blink {
  50% { opacity: 0; }
}
```

### Pulse Glow (for status indicators)
```css
.pulse-glow {
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 5px var(--accent-dim); }
  50% { box-shadow: 0 0 20px var(--accent-dim), 0 0 40px var(--accent-dim); }
}
```

---

## Responsive Breakpoints

Device design stays device-like at all sizes:

```css
/* Mobile: single column, stacked actions */
@media (max-width: 768px) {
  .device-grid { grid-template-columns: 1fr; }
  .display-text { font-size: clamp(2.5rem, 12vw, 5rem); }
  .action-button { min-height: 72px; }
  .bottom-nav { height: 60px; }
}

/* Tablet: two columns with visible divider */
@media (min-width: 769px) and (max-width: 1024px) {
  .device-grid { grid-template-columns: 1fr 1px 1fr; }
  .display-text { font-size: clamp(3rem, 8vw, 6rem); }
}

/* Desktop: full device layout */
@media (min-width: 1025px) {
  .device-grid { grid-template-columns: 280px 1px 1fr; }
  .display-text { font-size: clamp(4rem, 10vw, 8rem); }
}
```

---

## Quick Reference: Before → After

| Element | Generic AI Version | Device Version |
|---|---|---|
| Page title | "Welcome to ProductName — The all-in-one solution for modern teams" | "ProductName" |
| Hero section | 60+ words explaining what it does | 8 words max + oversized button |
| Feature list | 3 cards with icon, title, paragraph | 3 full-width strips with feature name + arrow |
| CTA button | `px-4 py-2 rounded-lg bg-blue-600 text-white text-sm` | `w-full min-h-[80px] bg-accent text-surface font-mono uppercase tracking-widest` |
| Font size range | 14px – 32px | 24px – 128px |
| Colors used | 5–8 colors including gradients | 3 colors: surface, text, one accent |
| Navigation | Horizontal bar with 5-7 links | Bottom bar with 2-3 labels or floating button |
| Border radius | 8px–16px everywhere | 0px (sharp) or 9999px (full circle) only |
| Shadows | `shadow-md`, `shadow-lg` (diffuse) | `8px 8px 0px #000` (hard) or none |
| Hover effects | Subtle opacity/color shift | Full color inversion, instant transition |
| Total word count | 200-500 words | 40-80 words |
