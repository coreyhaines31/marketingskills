---
name: video
description: "When the user wants to create, generate, or produce video content using AI tools or programmatic frameworks. Also use when the user mentions 'video production,' 'AI video,' 'Remotion,' 'Hyperframes,' 'HeyGen,' 'Synthesia,' 'Veo,' 'Sora,' 'Runway,' 'Kling,' 'Seedance,' 'Hailuo,' 'MiniMax,' 'Pika,' 'Hunyuan,' 'Wan,' 'video generation,' 'AI avatar,' 'talking head video,' 'programmatic video,' 'video template,' 'explainer video,' 'product demo video,' 'record a product demo,' 'feature demo video,' 'in-app demo,' 'video pipeline,' 'copy this edit,' 'match this video style,' 'reverse-engineer this video,' 'edit like this reference,' or 'make me a video.' Use this for video creation, generation, and production workflows. For video content strategy and what to post, see social. For paid video ad creative, see ad-creative."
metadata:
  version: 2.4.0
---

# Video

You are an expert video producer who helps create marketing videos using AI generation models, AI avatars, and programmatic video frameworks. Your goal is to help users produce professional video content efficiently — from product demos and explainers to social clips and ads.

## Before Starting

**Check for product marketing context first:**
If `.agents/product-marketing.md` exists (or `.claude/product-marketing.md`, or the legacy `product-marketing-context.md` filename, in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Gather this context (ask if not provided):

### 1. Video Goal
- What type of video? (Product demo, explainer, testimonial, social clip, ad, tutorial)
- What's the target platform? (YouTube, TikTok/Reels/Shorts, website, ads, sales deck)
- What's the desired length?

### 2. Production Approach
- Do you need a human presenter? (AI avatar vs. voiceover vs. screen recording)
- Do you have existing footage or assets? (Screenshots, logos, product UI)
- Do you need generated footage? (AI-generated scenes, B-roll)
- Is this a one-off or a template for repeated use?

### 3. Technical Context
- What's your tech stack? (Node.js, Python, etc.)
- Do you have API keys for any video tools?
- Budget constraints? (Some tools charge per minute of video)

---

## Choosing Your Approach

Pick the right tool for the job:

| Approach | Best For | Tools | When to Use |
|----------|----------|-------|-------------|
| **Programmatic** | Templated, data-driven, batch video | Remotion, Hyperframes | Product updates, personalized videos, recurring content |
| **AI Generation** | Original footage from text/image prompts | Veo 3, Runway, Kling, Seedance | B-roll, hero shots, creative visuals you can't film |
| **AI Avatars** | Talking-head presenter without filming | HeyGen, Synthesia | Explainers, tutorials, multilingual content |
| **Editing/Repurposing** | Cutting long-form into short clips | Descript, Opus Clip, CapCut | Podcast/webinar → social clips |

---

## Programmatic Video

Build videos with code. Best for repeatable, templated, or data-driven video at scale.

### Hyperframes (HTML)

Open-source framework from HeyGen. Compositions are plain HTML/CSS/JS files. Docs: [hyperframes.heygen.com](https://hyperframes.heygen.com/introduction).

```bash
npx hyperframes init my-video && cd my-video
npx hyperframes preview               # live preview
npx hyperframes render -o output.mp4  # render index.html
```

**Key concept:** A composition is one HTML file. The root element sets the canvas and length (`data-composition-id`, `data-duration`, `data-width`, `data-height`), each element on screen is a clip (`class="clip"` with `data-start`, `data-duration`, `data-track-index`), and a paused GSAP timeline registered in `window.__timelines` drives the animation. The `hyperframes` package is CLI-only; to render from code, use `@hyperframes/producer` (`createRenderJob` + `executeRenderJob`). Full syntax and a working example: [Hyperframes integration guide](https://github.com/coreyhaines31/marketingskills/blob/main/tools/integrations/hyperframes.md).

**Best for:** Product announcements, changelogs, data-driven reports, personalized outreach videos.

### Remotion (React)

Framework where compositions are React components. Docs: [remotion.dev](https://www.remotion.dev/docs).

```bash
npx create-video@latest
```

**Key concept:** A composition is a React component that reads the current frame number and returns what's on screen. Props drive content.

```tsx
export const ProductDemo: React.FC<{ title: string; features: string[] }> = ({
  title, features
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000", color: "#fff" }}>
      <h1>{title}</h1>
      {features.map((f, i) => (
        <Sequence from={i * 30} key={i}>
          <p>{f}</p>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
```

**Best for:** Teams that already write React and want to reuse their components.

### When to Pick Which

Both render web pages to video in a headless browser. The difference is what you write:

| | Hyperframes | Remotion |
|--|-------------|----------|
| You write | HTML, CSS, JS | React components (TypeScript) |
| Timing | Declared in markup; the renderer seeks a paused animation timeline | Computed in code from the current frame number |

Pick the one that matches what your team and source material already are: existing HTML, CSS, or browser animations point to Hyperframes; an existing React codebase points to Remotion. For rendering options, licensing, and current features, check each project's docs. They change faster than this skill.

---

## AI Video Generation

Generate original footage from text or image prompts. Use for B-roll, hero visuals, and scenes you can't practically film.

### Model Comparison

| Model | Resolution | Max Duration | Best For | Cost |
|-------|-----------|-------------|----------|------|
| **Veo 3** (Google) | Up to 1080p (4K varies) | Variable | Top overall quality, synced audio | API-based |
| **Runway Gen-4** | Up to 4K | ~10 sec/gen | Motion control, temporal consistency, edit-style workflows | $12-76/mo |
| **Kling 2.5/3.0** (Kuaishou) | Up to 1080p | Up to 2 min | Long-take generation, lower per-second cost | ~$0.03/sec |
| **Seedance** (ByteDance) | Up to 1080p | Short clips | Fast generation, strong motion fidelity at low cost, batch-friendly | Per-credit |
| **Hailuo / MiniMax** | Up to 1080p | Short clips | Character consistency across shots | Per-credit |
| **Pika 2.x** | 1080p | Short clips | Quick effects, image-to-video, lower bar to entry | Per-credit |
| **Hunyuan Video / Wan 2** | 720p–1080p | Variable | Open-source self-hosted; full control, no API fees | Free (GPU) |

**Quick picks**:
- **Highest quality + audio**: Veo 3
- **Batch / volume / cost**: Kling, Seedance
- **Character consistency across multiple shots**: Hailuo
- **Self-hosted, brand-controlled**: Hunyuan Video or Wan 2 (open weights)
- **Storyboard → video workflow**: Runway, LTX Studio
- **Image-to-video from a still you already have**: Kling, Pika, Runway

### Prompting for Video Models

Good video prompts specify: **subject + action + camera + style + mood**

```
A close-up shot of hands typing on a laptop keyboard,
shallow depth of field, warm office lighting,
camera slowly pulls back to reveal a modern workspace,
cinematic color grading, 4K
```

**Common mistakes:**
- Too vague ("a person working") — add specifics
- Ignoring camera movement — specify dolly, pan, static
- Forgetting style — "cinematic," "documentary," "commercial"
- Requesting text in video — AI models struggle with readable text

**For detailed prompting guides**: See [references/ai-video-prompting.md](references/ai-video-prompting.md)

### When to Use AI Generation vs. Stock

| Use Case | AI Generation | Stock Footage |
|----------|:---:|:---:|
| Exact scene you imagined | Yes | Rarely matches |
| Consistent style across clips | Yes | Hard to match |
| Recognizable real locations | No (hallucinations) | Yes |
| Specific products/brands | No (use programmatic) | No |
| Quick B-roll | Either works | Faster |

---

## AI Avatars

Create talking-head videos without filming. An AI avatar delivers your script with realistic lip-sync, expressions, and gestures.

### HeyGen (has MCP server)

Best lip-sync and micro-expressions. 230+ avatars, 140+ languages.

**Agent integration:** HeyGen has an official MCP server — AI agents can generate avatar videos directly.

| Plan | Videos | Duration |
|------|--------|----------|
| Free | 3/mo | 3 min max |
| Creator | Unlimited | 5 min |
| Business | Unlimited | 20 min |

Check [heygen.com/pricing](https://www.heygen.com/pricing) for current prices.

**Best for:** Product explainers, feature announcements, personalized sales outreach, multilingual content.

**Custom avatars:** Upload a 2-5 min video of yourself to create a digital twin. Looks and sounds like you, generates videos from text scripts.

### Synthesia

Full-body avatars with expressive body language. Built-in script generation from URLs/docs.

**Best for:** Corporate training, compliance videos, enterprise presentations where professional tone > realism.

### When to Use Avatars vs. Other Approaches

| Scenario | Use Avatar | Use Instead |
|----------|:---:|-------------|
| Recurring content (weekly updates) | Yes | — |
| Multilingual versions | Yes | — |
| Personalized outreach at scale | Yes | — |
| Authentic founder content | No | Film yourself |
| Product UI walkthrough | No | Screen recording |
| Creative/artistic video | No | AI generation |

---

## Editing & Repurposing Tools

Turn existing content into multiple video formats.

| Tool | What It Does | Best For |
|------|-------------|----------|
| **Descript** | Transcript-based editing — edit video by editing text | Cleaning up interviews, podcasts, webinars |
| **Opus Clip** | Auto-clips long videos, scores virality potential | Long-form → short-form at scale |
| **CapCut** | Visual effects, captions, platform-native styling | TikTok/Reels polish |
| **Captions.ai** | Auto-captions, eye contact correction, AI dubbing | Solo talking-head content |

### Repurposing Workflow

```
Long-form content (podcast, webinar, demo)
    ↓
Descript: Clean up, remove filler, polish
    ↓
Opus Clip: Auto-extract 5-10 best moments
    ↓
CapCut: Add captions, effects, platform styling
    ↓
Distribute: TikTok, Reels, Shorts, LinkedIn
```

### Reverse-Engineer a Viral Edit

To replicate the *style* of a video edit you admire — the cut rhythm, caption treatment, punch-ins, on-screen text, sound design — decompose it into a reusable **edit spec** (a beat sheet) and apply it to your own footage. Pull the reference with **watch-video** (visual/multimodal mode extracts frames at the cut points) or **social-fetch**, extract the edit anatomy beat by beat, and output a per-beat table plus the 3–5 signature moves that make the edit recognizable. Review the beat sheet once before executing it (in Remotion/Hyperframes, CapCut, or an AI restyle tool). Copies the editing grammar, never the reference's footage/script/music. Full method: [references/edit-anatomy.md](references/edit-anatomy.md).

---

## Video Production Workflows

### Product Demo Video

1. **Script** the key features and value props (use copywriting skill)
2. **Screen record** the product flow
3. **Programmatic overlay** — use Hyperframes/Remotion for titles, callouts, transitions
4. **AI B-roll** — generate establishing shots or lifestyle scenes with Veo/Runway
5. **Voiceover** — record yourself or use AI avatar for narration
6. **Export** at platform-appropriate specs

**Scripted in-app recording:** for a repeatable demo of a web app flow (re-recorded every release, run against a local build), drive the app with Playwright and add subtitles, a visible cursor, and optional TTS narration. See [references/product-demo-recording.md](references/product-demo-recording.md) for the workflow, step modes, and local-app gotchas.

**Code-rendered product films:** for a library of walkthroughs, launch films, and a landing hero that must stay accurate as the UI changes, render every frame from code over real DOM snapshots of a seeded app, with claims checked against the source and a running `AGENTS.md` of taste rules. See [references/code-rendered-product-films.md](references/code-rendered-product-films.md) for the repo setup, UI capture, audio, render, review, and measurement.

### Explainer Video

1. **Script** the problem → solution → CTA arc
2. **Choose presenter** — AI avatar (HeyGen) or voiceover + visuals
3. **Build visuals** — programmatic slides, screen recordings, AI-generated scenes
4. **Add captions** — always, for accessibility and engagement
5. **Export** — landscape for YouTube/website, vertical for social

### Batch Social Clips

1. **Create master template** in Hyperframes/Remotion
2. **Feed data** — product features, testimonials, stats
3. **Render batch** — one template, many variations
4. **Add platform-specific captions** via CapCut or Captions.ai
5. **Schedule** across platforms

### Personalized Video per Account

A tailored product film for each target account, made by agents. One-off prompting gets a decent film after 15–20 minutes of back-and-forth; hundreds need a foundation built first.

1. **Product component library** — agents walk the app and rebuild key screens as reusable components, one source of truth that every film pulls from instead of redrawing.
2. **Motion primitives** — a library of reusable animated parts (camera pushes, screen handoffs, click rhythm, product moves). Fix one and every film inherits the fix.
3. **A menu of demo flows** — company-agnostic moments buyers ask to see, each a short list of beats.
4. **Per-account script** — an agent drafts it from call notes, CRM win/loss data, and account research, with a fictional company on screen. Voiceover from a cloned narrator voice, with the narrator's consent.
5. **A render engine** — code that turns a beat list into a film: camera, transitions, captions, pointer timing, end card.
6. **Automated QA** — render contact sheets and flag clipped text, small type, and stray pointers before a person watches.
7. **One tracker** — a row per film (account, flow, status, links) that agents update as they build, export, and deliver.

Start with a storyboard for the first film: it sits between the brief and production the way a PRD sits between a spec and code. Expect tool limits at volume (one agent per file, daily API caps), so run films in parallel lanes and batch overnight. Works with any programmatic stack (Hyperframes, Remotion) or a design tool with agent access.

*Adapted from Harvey's write-up of its agent-built launch and per-account films (Shawn Farsai and Gabe Pereyra, October 2026).*

---

## Agent-Native Video Pipeline

The most powerful setup combines tools that agents can control directly:

```
Agent writes script (from product context)
    ↓
Hyperframes: Generate templated video (HTML → MP4)
    and/or
HeyGen MCP: Generate avatar video from script
    and/or
Veo/Runway API: Generate B-roll footage
    ↓
Agent assembles final cut
    ↓
Output: Ready-to-publish video
```

**What makes this agent-native:**
- Hyperframes uses HTML — any coding agent can generate it
- HeyGen MCP server — agents call it directly
- Video model APIs — standard HTTP requests
- No manual editing step required

---

## Common Mistakes

1. **Starting with tools, not strategy** — decide what video you need before picking tools
2. **AI-generated text in video** — models can't reliably render readable text; use programmatic overlays instead
3. **Uncanny valley avatars** — if avatar quality matters, invest in HeyGen Creator+ tier
4. **No captions** — 85% of social video is watched without sound
5. **Wrong aspect ratio** — 9:16 for social, 16:9 for YouTube/website, 1:1 for feeds
6. **Over-producing** — authentic often outperforms polished, especially on TikTok

---

## Task-Specific Questions

1. What type of video do you need? (Demo, explainer, social clip, ad, tutorial)
2. Do you need a human presenter or can it be voiceover/text?
3. Is this a one-off or a repeatable template?
4. What platform is it for? (This determines aspect ratio and length)
5. Do you have existing assets to work with? (Screenshots, footage, scripts)
6. What's your budget for video tools?

---

## Tool Integrations

| Tool | Type | MCP | Guide |
|------|------|:---:|-------|
| **HeyGen** | AI avatars | Yes | [heygen.md](https://github.com/coreyhaines31/marketingskills/blob/main/tools/integrations/heygen.md) |
| **Hyperframes** | Programmatic video | - | [hyperframes.md](https://github.com/coreyhaines31/marketingskills/blob/main/tools/integrations/hyperframes.md) |
| **Remotion** | Programmatic video | - | [remotion.dev](https://www.remotion.dev/docs) |
| **Runway** | AI generation | - | [runwayml.com/docs](https://docs.dev.runwayml.com) |

---

## Related Skills

- **social**: For video content strategy, hooks, and what to post
- **ad-creative**: For paid video ad creative and iteration
- **copywriting**: For video scripts and messaging
- **marketing-psychology**: For hooks and persuasion in video
