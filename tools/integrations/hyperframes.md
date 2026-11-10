# Hyperframes

Open-source programmatic video framework from HeyGen. Create videos from HTML/CSS/JS — no React, no proprietary DSL. Ships agent skills for coding agents.

## Capabilities

| Integration | Available | Notes |
|-------------|-----------|-------|
| API | - | Library, not a hosted service |
| MCP | - | - |
| CLI | Yes | `npx hyperframes render` |
| SDK | Yes | `@hyperframes/producer` for rendering from code; the `hyperframes` package itself is CLI-only |

## Why Hyperframes

- **Plain HTML**: compositions are HTML/CSS/JS files, so any agent that writes HTML can write one
- **Deterministic**: same input, same output (good for automation)
- **Open source**: see the [license](https://github.com/heygen-com/hyperframes/blob/main/LICENSE)

## Install

```bash
npx hyperframes <command>          # or: npm install -g hyperframes
```

Requires Node.js 22+ and FFmpeg. The `hyperframes` package is a **CLI only**; it has no importable API. For rendering from your own code, use `@hyperframes/producer` (below). Checked against v0.8.205, Oct 2026.

## Quick Start (CLI)

```bash
npx hyperframes init my-video        # scaffold a project from a template
cd my-video
npx hyperframes preview              # live preview in the Studio (localhost:3002)
npx hyperframes render -o output.mp4 # render the project's index.html
npx hyperframes render -c ./promo.html -o promo.mp4   # render a specific composition
npx hyperframes lint .               # catch composition errors before rendering
```

## How a Composition Works

A composition is an HTML file. The root element declares the canvas and total length, each visible element is a **clip** with its own start, duration, and track, and animation runs on a paused GSAP timeline that Hyperframes drives frame by frame. This is the shape of the package's own `blank` template:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>

<div id="root" data-composition-id="main"
     data-start="0" data-duration="8" data-width="1080" data-height="1920">
  <h1 id="title" class="clip" data-start="0" data-duration="4" data-track-index="0">Welcome to Acme</h1>
  <p id="cta" class="clip" data-start="4" data-duration="4" data-track-index="0">Try it free</p>
</div>

<script>
  const tl = gsap.timeline({ paused: true });
  tl.fromTo("#title", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, 0);
  tl.fromTo("#cta", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 4);
  window.__timelines["main"] = tl;
  tl.seek(0);
</script>
```

- **Timing** lives in `data-start` and `data-duration` (seconds). `data-track-index` layers clips that overlap.
- **Size** comes from `data-width` and `data-height` on the root; set the page's `html, body` to the same size in CSS.
- **Animation** goes on the GSAP timeline, keyed to the same start times. Register it under the composition's id.
- Run `npx hyperframes lint` after editing; it catches missing attributes and timing mistakes.

## Rendering from Code

```typescript
import { createRenderJob, executeRenderJob } from "@hyperframes/producer";

const job = createRenderJob({ fps: 30, quality: "standard" });
await executeRenderJob(job, "./my-video", "./output.mp4");
```

`createRenderJob` takes the render settings (`fps` and `quality` are required; `entryFile`, `format`, `variables`, and others are optional). `executeRenderJob` takes the job, the project directory, and the output path.

## Data-Driven Videos

For batch or personalized videos, generate one composition per row (a changelog entry, a customer, a metric), then render each:

1. Keep one hand-built composition as the template.
2. For each row, write a copy with the row's text, numbers, and images filled in, and the clip timings adjusted if the content length changes.
3. Lint, then render each file with `npx hyperframes render -c <file> -o <name>.mp4` or `executeRenderJob` in a loop.

Product announcements, changelog videos, testimonial cards, and stat reveals all fit this pattern: a short sequence of clips with text, an image or two, and one or two GSAP moves each.

## Aspect Ratios

| Platform | Width | Height | Ratio |
|----------|-------|--------|-------|
| TikTok/Reels/Shorts | 1080 | 1920 | 9:16 |
| YouTube | 1920 | 1080 | 16:9 |
| Instagram Feed | 1080 | 1080 | 1:1 |
| Instagram Feed | 1080 | 1350 | 4:5 |

## Hyperframes vs. Remotion

The difference is the authoring model: Hyperframes compositions are HTML files, Remotion compositions are React components. Use Hyperframes when your source material is already HTML, CSS, or a browser animation; use Remotion when you already have a React codebase. For rendering options, licensing, and current features, check the [Hyperframes docs](https://hyperframes.heygen.com/introduction) and [Remotion docs](https://www.remotion.dev/docs) rather than a comparison table that goes stale.

## Relevant Skills

- video
- social
- ad-creative
