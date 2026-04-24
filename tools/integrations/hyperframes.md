# Hyperframes

Open-source programmatic video framework from HeyGen. Create videos from HTML/CSS/JS — no React, no proprietary DSL. Designed for AI agent workflows.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | - | Library, not a hosted service |
| MCP | - | - |
| CLI | Yes | `npx hyperframes render` |
| SDK | Yes | Node.js/TypeScript package |

## Why Hyperframes

- **LLM-native**: AI models generate better HTML than React components — plain web standards, no framework DSL
- **Deterministic**: Same input always produces identical output (ideal for automation)
- **Open source**: Apache 2.0 license, zero per-render fees
- **Agent-friendly**: Any coding agent that can write HTML can create videos

## Install

```bash
npm install hyperframes
```

Requires: Node.js 22+, Chrome/Chromium (for rendering)

## Quick Start

```typescript
import { render } from "hyperframes";

await render({
  frames: [
    {
      html: `
        <div style="display:flex; align-items:center; justify-content:center;
                    height:100%; background:#000; color:#fff; font-family:system-ui;">
          <h1 style="font-size:64px;">Welcome to Acme</h1>
        </div>
      `,
      duration: 3,
    },
    {
      html: `
        <div style="display:flex; flex-direction:column; align-items:center;
                    justify-content:center; height:100%; background:#000; color:#fff;
                    font-family:system-ui;">
          <h2 style="font-size:48px;">Ship faster with AI</h2>
          <p style="font-size:24px; color:#888;">Try it free today</p>
        </div>
      `,
      duration: 3,
    },
  ],
  output: "intro.mp4",
  width: 1080,
  height: 1920, // 9:16 vertical
  fps: 30,
});
```

## Core Concepts

### Frames

Each frame is an HTML document rendered at a specific point in the timeline. Think of it as a slide with a duration.

```typescript
{
  html: "<div>...</div>",  // Full HTML content
  duration: 3,              // Seconds to display
  css?: "body { ... }",     // Optional external CSS
}
```

### Transitions

CSS transitions and animations work between frames:

```html
<div style="animation: fadeIn 0.5s ease-in;">
  <h1>Slide In</h1>
</div>
<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
```

### Data-Driven Videos

Generate frames from data for batch production:

```typescript
const features = ["Analytics", "Automation", "AI Insights"];

const frames = features.map((feature) => ({
  html: `
    <div style="display:flex; align-items:center; justify-content:center;
                height:100%; background:linear-gradient(135deg, #667eea, #764ba2);
                color:#fff; font-family:system-ui;">
      <h1 style="font-size:56px;">${feature}</h1>
    </div>
  `,
  duration: 2.5,
}));

await render({ frames, output: "features.mp4", width: 1080, height: 1920 });
```

## Common Marketing Templates

### Product Announcement

```typescript
const frames = [
  { html: hookSlide("Something new is here"), duration: 2 },
  { html: featureSlide(title, description, screenshot), duration: 4 },
  { html: ctaSlide("Try it free →", url), duration: 3 },
];
```

### Testimonial Video

```typescript
const frames = [
  { html: quoteSlide(testimonial.text), duration: 4 },
  { html: attributionSlide(testimonial.author, testimonial.company), duration: 2 },
  { html: ctaSlide("Join 1,000+ happy customers"), duration: 3 },
];
```

### Stats/Metrics Video

```typescript
const metrics = [
  { label: "Users", value: "10,000+" },
  { label: "Uptime", value: "99.9%" },
  { label: "NPS", value: "72" },
];

const frames = metrics.map(m => ({
  html: metricSlide(m.label, m.value),
  duration: 2.5,
}));
```

## Aspect Ratios

| Platform | Width | Height | Ratio |
|----------|-------|--------|-------|
| TikTok/Reels/Shorts | 1080 | 1920 | 9:16 |
| YouTube | 1920 | 1080 | 16:9 |
| Instagram Feed | 1080 | 1080 | 1:1 |
| Instagram Feed | 1080 | 1350 | 4:5 |

## Hyperframes vs. Remotion

| Factor | Hyperframes | Remotion |
|--------|-------------|----------|
| Language | HTML/CSS/JS | React/TypeScript |
| Agent compatibility | Better (plain HTML) | Good (needs React knowledge) |
| Animation | CSS transitions/keyframes | Spring physics, interpolation |
| Cloud rendering | Not built-in | Lambda (AWS) |
| License | Apache 2.0 (free) | Company license for commercial use |
| Ecosystem | New, growing | Mature, large community |

**Use Hyperframes when:** AI agent is generating the video, simple animations, batch templated content, cost-sensitive.

**Use Remotion when:** Complex animations needed, already using React, need Lambda for massive scale, want larger ecosystem.

## Relevant Skills

- video
- social-content
- ad-creative
