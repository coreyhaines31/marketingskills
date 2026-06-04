---
name: feature-demo
description: Record a Playwright-driven demo video of a web app feature (signup, onboarding, a settings flow, a dashboard interaction, etc.) with on-screen subtitles and optional ElevenLabs TTS narration, then deliver the MP4 to the user. Use when the user asks to "record a demo", "make a walkthrough", "screen-record this flow", "make a feature video", "show me a video of X", or wants a narrated screencast of any in-app flow. NOT for marketing/AI-generated video (use the `video` skill for HeyGen / Remotion / etc.).
metadata:
  version: 1.0.0
---

# Feature demo

You are an expert at recording in-app demo videos. Your goal is to
walk a user's web app through a feature flow in headless Chromium and
deliver a polished MP4 — branded title card, scene subtitles, real
mouse cursor, optional ElevenLabs voiceover — using the recorder
template and narrator that ship with this skill.

The skill ships two scripts:

- **`scripts/recorder.template.mjs`** — copy into `scripts/` and edit
  the BRAND, TITLE_CARD, and FEATURE STEPS sections to drive the flow.
- **`scripts/narrate.mjs`** — generic; takes the silent recording +
  the timings sidecar and produces a narrated MP4. Reuse as-is.

## Before Starting

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or
`.claude/product-marketing-context.md` in older setups), read it
before asking questions. Use it to pre-fill the `BRAND` block (name,
demo domain, accent / background colors that match the product), to
inform the title-card copy + intro voiceover tone, and — critically —
to ground the demo in **who the audience is and what the product
does**. A demo that doesn't know its viewer falls flat: captions land
generic, the intro is hand-wavy, and the scene selection misses the
"aha" moment for that audience. Only ask the user about information
that isn't already covered or that's specific to this particular video.

Gather this context (ask if not provided):

### 1. Who is the video for, and what does the product do?

Both — together. Examples:

- *Audience*: prospects on the pricing page, existing customers
  rolling out a new feature, sales team for outbound demos,
  developers evaluating the API, support agents reviewing a flow,
  internal QA validating a release.
- *Product*: one or two sentences on what the app does and its core
  value proposition — the same shape as the product-marketing-context
  blurb if you have one.

Don't skip this question. It changes everything downstream: the
title card copy, the intro voiceover wording, scene captions
(jargon-light for prospects, feature-focused for existing customers,
implementation-detail for developers), even pacing (fast for sales
demos, deliberate for tutorials).

### 2. Which feature, and which scenes?

Get the entry URL (e.g. `/dashboard/settings/team`) and a one-line
summary of each scene the user wants to see. The scene list = the
on-screen subtitles, so write them as the captions you want narrated.

### 3. Narration?

Default to silent. If the user wants a voiceover, you'll need
`ELEVENLABS_API_KEY` in env (have them paste it in chat — do not
commit it). Confirm a voice — Bella (`EXAVITQu4vr4xnSDxMaL`) is the
default; Adam (`pNInz6obpgDQGcFmaJgB`) and Rachel
(`21m00Tcm4TlvDq8ikWAM`) are good alternates.

### 4. Auth state?

Does the demo need to start logged in? If so, plan to seed a user and
either use `page.context().addCookies()` or do a programmatic login at
the top of the recorder. Otherwise start at the public URL.

### 5. Brand defaults

If product-marketing context didn't supply them, ask for the values
that go in the recorder's `BRAND` block: app name (used as the
Chrome tab title + text wordmark fallback), demo domain (shown in
the fake URL bar), title-card background + accent colors, and
optionally a relative path to a logo SVG.

## Workflow

### 1. Bring the local app up

The recorder hits `BASE_URL` (default `http://127.0.0.1:8000`). Get
your local app running and reachable there before recording. Any
stack works — Laravel, Rails, Django, Next.js, etc. — the recorder
only needs HTTP + the page to render in headless Chromium.

Headline things that bite Playwright recordings on HTTP localhost
(see [references/local-app-gotchas.md](references/local-app-gotchas.md)
for the full list):

- **`Secure; SameSite=None` cookies are rejected** by Chromium over
  plain HTTP — sessions don't stick. Flip to `SameSite=Lax` (or
  serve HTTPS) for the recording run.
- **Strict CSP blocks the overlay's inline styles.** The recorder
  already sets `bypassCSP: true` on the context. Don't strip that.
- **SPA boot failures yield a blank video.** If the page renders
  blank in a real browser (empty env var crashing a constructor,
  etc.) the recorder captures the blank state silently.

### 2. Install Playwright + ffmpeg if missing

```bash
npx playwright install chromium --with-deps         # ~100MB
which ffmpeg || sudo apt-get install -y --no-install-recommends ffmpeg
```

### 3. Write the recorder

Copy the template:

```bash
cp .agents/skills/feature-demo/scripts/recorder.template.mjs scripts/record-<feature>.mjs
```

**Edit the `BRAND` block** near the top of the file:

```js
const BRAND = {
    name: 'YourApp',                  // chrome tab title + text-wordmark fallback
    demoDomain: 'app.example.com',    // shown in the fake URL bar
    logoPath: 'public/img/logo.svg',  // optional; searched up from script
    backgroundColor: '#0f172a',       // title-card bg
    accentColor: '#38bdf8',           // title-card underline + tab favicon
};
```

`logoPath` is resolved by walking up from the recorder's location, so
a relative path like `public/img/logo.svg` works from anywhere under
the project. Leave it `undefined` to fall back to a text wordmark of
`BRAND.name`.

**Edit the `TITLE_CARD` block** with the video's title/subtitle/intro:

```js
const TITLE_CARD = {
    title: 'Get Started',
    subtitle: 'Sign up and create your first project',
    intro: "In this video we'll walk through signing up and creating your first project.",
};
```

**Edit the FEATURE STEPS section.** Pattern per scene:

```js
await step(
    'short internal label',         // logged to console
    'On-screen + narrated caption.', // shown in subtitle bar AND read by TTS
    async () => {
        // Playwright actions: fill, click, waitForURL, etc.
    },
    { mode: 'before' }, // default — narrate first, then act
);
```

**Pick a `mode` per step** — this is what keeps audio + visual aligned.
Full decision matrix + examples in
[references/step-modes.md](references/step-modes.md); the short version:

- **`before`** (default) — narration plays in full, then `fn()` runs.
  Use for **transition steps** (click + navigate). Prevents the
  "speaker still describing the old page while we're on the new one"
  drift.
- **`during`** — narration and `fn()` run in parallel. Use for
  **in-place visible actions** like filling a form.
- **`after`** — `fn()` runs, then narration. Rare.

Other notes:

- **Reset backend state at the top of the script** if the demo
  depends on a known user/account. Re-runs accumulate side effects
  (extra rows, deleted entities, etc.) that confuse selectors. The
  template has a commented `resetDemoState` block — shell out to
  whatever tool clears the rows your demo touches (`php artisan
  tinker`, `rails runner`, a SQL one-liner, an admin API call).
  Demos that use a random email per run don't need this.
- **Always use `clickWithCursor(locator)` and
  `fillWithCursor(locator, val)`** inside step `fn()` bodies instead
  of `locator.click()` / `locator.fill()`. Playwright drives DOM
  events directly with no real cursor; the helpers animate the
  injected fake cursor to the target (~500 ms slide) and fire a
  click-ripple effect before the action so the viewer can see what's
  being clicked.
- Update `TOTAL_STEPS` at the top to match the count of `step()`
  calls + the opener — the on-screen "STEP N / TOTAL" badge uses it.
- Captions of ~50–80 chars are the sweet spot — long enough to be
  meaningful, short enough that `before` mode doesn't pause the demo
  too long.
- When `ELEVENLABS_API_KEY` is set, the recorder pre-generates each
  caption's TTS clip and uses its actual ffprobe-measured duration as
  the wait — clips are cached under `OUT_DIR/narration/step-N.mp3`,
  so re-records skip the API. Without the key, falls back to ~12
  chars/sec.
- Failures dump a screenshot to `<OUT_DIR>/fail-<label>.png` for
  triage.

### 4. Record

```bash
node scripts/record-<feature>.mjs
```

Outputs three things to `/tmp/playwright-recording/` (override with
`OUT_DIR`):

- `<hash>.webm` — the silent recording at viewport size (default
  1280×800)
- `subtitle-timings.json` — `{ titleCard: {...}, subtitles: [...] }`,
  including the brand fields the narrator needs
- `browser-frame.png` — a macOS-Chrome chrome bar (tab strip +
  toolbar) rendered once via Playwright; the narrator stacks it on
  top of the recorded video with ffmpeg `vstack` so the demo reads
  as a real browser. The URL text is baked in once at render time as
  `DEMO_DOMAIN + entry_path`.

**Title card** — the narrator renders `TITLE_CARD` as a full-bleed
1280×888 PNG (logo or wordmark on `BRAND.backgroundColor`, with a
`BRAND.accentColor` underline), prepends it to the front of the video
as a held frame, and plays the `intro` line over it with the same
TTS voice. The first frame of the muxed MP4 is the title card, so
it's also the preview thumbnail.

If you only want the silent video with subtitles + chrome (no
audio), a one-liner does it:

```bash
ffmpeg -y -i /tmp/playwright-recording/*.webm \
       -i /tmp/playwright-recording/browser-frame.png \
       -filter_complex "[1:v][0:v]vstack=inputs=2" -c:v libx264 -crf 23 \
       out.mp4
```

### 5. Add narration (optional)

```bash
ELEVENLABS_API_KEY='sk_...' \
    node .agents/skills/feature-demo/scripts/narrate.mjs \
    /tmp/playwright-recording/*.webm \
    /tmp/playwright-recording/<feature>-narrated.mp4
```

The narrator:

- POSTs each caption to ElevenLabs (default voice Bella, model
  `eleven_v3` — the most expressive model; switch to
  `eleven_multilingual_v2` via `ELEVENLABS_MODEL_ID` if v3 sounds off,
  it's the marketed voiceover model)
- Caches MP3 clips under `<OUT_DIR>/narration/` so re-runs skip the
  API
- Auto-pushes back any clip that would overlap the previous one so
  the voiceover never doubles up
- Trims the `about:blank` + first-paint period off the front of the
  recording before muxing
- Pads the video tail with `tpad=clone` if the narration runs past
  the visual so playback stays in sync

Override the voice with `ELEVENLABS_VOICE_ID=...` or the model with
`ELEVENLABS_MODEL_ID=...`.

### 6. Deliver

Hand the finished MP4 back to the user with a one-line summary of what
the video shows. Use whatever file-delivery mechanism your agent
supports — attach or send the file if you can; otherwise give the user
its absolute path:

```
/tmp/playwright-recording/<feature>-narrated.mp4
```

### 7. Clean up before committing

If you changed any per-runtime config files (cookie flags, env
overrides, etc.) to make Playwright happy, **revert those before
committing** so the diff stays focused on the recorder script. Then
commit + push + open a PR per your standard workflow.

## What the skill's files are for

| Path | Purpose |
|---|---|
| `scripts/recorder.template.mjs` | Skeleton recorder; copy into `scripts/` per feature |
| `scripts/narrate.mjs` | Generic narrator; run directly, no edits needed |
| `references/step-modes.md` | Decision matrix + examples for `before` / `during` / `after` |
| `references/local-app-gotchas.md` | Cross-cutting issues on HTTP localhost (cookies, CSP, state) |
| `evals/evals.json` | Eval prompts that exercise the skill's expected behaviors |
