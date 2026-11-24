# Product Demo Recording

Adapted from a contribution by @klepfish (PR #345).

How to record a scripted, repeatable demo of a web app feature (signup, onboarding, a settings flow, a dashboard interaction) by driving the app in headless Chromium with Playwright. The output is an MP4 with a title card, scene subtitles, a visible cursor, and optional TTS narration.

## When to Use This Format

| Situation | Format |
|-----------|--------|
| Feature flow you'll re-record every release | **Scripted in-app recording** (this guide) |
| Narrated walkthrough where personality matters | Live screen recording (Loom, Screen Studio, Tella) |
| Homepage hero or launch video with motion design | Programmatic (Hyperframes/Remotion) over screen captures |
| Talking-head explainer with UI cutaways | AI avatar plus screen recording |
| Sales demo tailored to one prospect | Live recording, or an interactive demo tool |

Scripted recording pays off when:
- The UI changes often and you need to regenerate the video in minutes
- You want pixel-identical runs (same data, same pacing, no mouse jitter)
- The demo must run against a local or staging build before launch
- Several flows need the same branded look

Skip it for a one-off video where a human recording would take ten minutes.

## Reference Implementation

The contributor's working scripts (a recorder template and a narrator) live at a fixed commit in this repo's history:

https://github.com/coreyhaines31/marketingskills/tree/37cb655f4017ccec2680f9fa5f3c13e6eed36a7d/skills/feature-demo/scripts

They need Node 18+, Playwright, and ffmpeg. Treat them as a reference implementation to copy and adapt. The workflow below is written so you can rebuild it without them.

## Before Recording

Gather:
1. **Audience and product** — prospects, existing customers, developers, or internal QA. This sets caption tone (jargon-light for prospects, implementation detail for developers) and pacing.
2. **Entry URL and scene list** — one line per scene. The scene list doubles as the subtitle captions, so write each line as the caption you want on screen.
3. **Auth state** — does the demo start logged in? Plan a seeded user plus a programmatic login or injected cookies.
4. **Narration** — default to silent with subtitles. Add voiceover only if asked.
5. **Brand** — app name, demo domain for the fake URL bar, title-card background and accent colors, optional logo SVG. Pull these from product marketing context when it exists.

## Recording Workflow

### 1. Bring the app up locally

Run the app at a stable URL (e.g. `http://127.0.0.1:8000`). Any stack works since the recorder only needs HTTP and a page that renders in headless Chromium. Open it in a real browser first and click through the flow once. Read the gotchas section below before your first run.

### 2. Install tooling

```bash
npx playwright install chromium --with-deps
which ffmpeg || brew install ffmpeg   # or apt-get install ffmpeg
```

### 3. Set up the browser context

Create a context with:
- `viewport` and `recordVideo.size` set to the same size (1280×800 is a good default)
- `bypassCSP: true` so injected overlays aren't blocked
- `ignoreHTTPSErrors: true` if you serve a self-signed cert
- An `addInitScript` that injects the overlay (subtitle bar, step badge, fake cursor) on every page load

Record `Date.now()` when the context starts. Every subtitle logs its offset from that moment, which is what lets narration line up later.

### 4. Script the flow as steps

Wrap each scene in a `step(label, caption, fn, { mode })` helper that:
1. Shows the caption in the subtitle bar and logs `{ step, text, offsetMs }` to a timings array
2. Waits for the narration duration (see step modes)
3. Runs the Playwright actions in `fn`
4. On failure, saves a screenshot named after the label for triage

Guidelines:
- **Captions of 50-80 characters** read well and keep pauses short
- **Show a "STEP N / TOTAL" badge** so viewers know how long the demo runs
- **Reset backend state at the top** if the demo uses a fixed account (see gotchas)
- **Use explicit waits** (`waitForURL`, `getByRole(...).waitFor()`) rather than fixed sleeps

Before adding the cursor or narration, wait for visible evidence that the action completed. A settings demo can show the new option while the saved value is still old. Check the result after the Save action.

```js
await page.getByRole('combobox', { name: 'Digest schedule' }).selectOption('Weekly');
await page.getByRole('button', { name: 'Save changes' }).click();
await page.getByRole('status').filter({ hasText: /^Saved schedule: Weekly$/ }).waitFor({ state: 'visible' });
```

For a persistent setting, reload and check the saved value again. In the final MP4, play the passage after the click and confirm that the result is readable at the delivery size. The [localhost example from Valmera's public documentation](https://github.com/ABO3SKRALMASAOODI/valmera-mcp/blob/63becfd40dbab2f03feb9b8be8fb59ef1bc69ca3/docs/RECORD-A-LOCALHOST-PRODUCT-DEMO.md) includes the same dropdown selection with and without the save.

### 5. Make the cursor visible

Playwright fires DOM events with no visible pointer, so viewers can't see what got clicked. Inject a fake cursor element and wrap clicks and fills in helpers:
- `clickWithCursor(locator)` scrolls the target into view, animates the cursor to its center (~500 ms), plays a click ripple, then clicks
- `fillWithCursor(locator, value)` does the same, then types

Keep targets above the subtitle bar so it never covers the element being clicked.

### 6. Add a title card and browser chrome

- **Title card** — render a full-frame PNG with the logo (or a text wordmark) on the brand background with an accent underline. Hold it at the start of the video. It also becomes the preview thumbnail.
- **Browser chrome** — render a tab strip and URL bar showing `demoDomain + path` as a separate PNG, then stack it on top of the recording with ffmpeg. This keeps the real localhost URL out of the video.

### 7. Export

Write the timings array to a JSON sidecar next to the `.webm`. For a silent version with subtitles and chrome:

```bash
ffmpeg -y -i recording.webm -i browser-frame.png \
  -filter_complex "[1:v][0:v]vstack=inputs=2" \
  -c:v libx264 -crf 23 out.mp4
```

Trim the blank first-paint frames from the front (start about 150 ms before the first subtitle's offset). Export at the target platform's aspect ratio.

## Step Modes

Each step picks when narration plays relative to its action. This is what keeps audio and visuals aligned.

| Mode | Order | Use for |
|------|-------|---------|
| **before** (default) | Caption and narration finish, then the action runs | Transitions: a click that navigates to a new page |
| **during** | Narration and action run in parallel; both must finish | In-place visible actions: filling a form, dragging, opening a menu |
| **after** | Action runs, then caption and narration | Describing a state the action just produced (rare) |

**Why before is the default:** if a navigating click fires early, the speaker keeps describing the old page while the viewer is already on the new one. The whole video then reads one scene off.

**Picking a mode:**

| Scene | Mode |
|-------|------|
| Click a button and the page navigates | `before` |
| Fill a form or type in a field | `during` |
| Skip or dismiss, then navigate | `before` |
| Hover or open a menu without navigating | `during` |
| Land on a final state (dashboard, success screen) | `during` |
| Click that opens a modal you want to describe | `before` |

Narration clips usually run 3-7 seconds, while actions take 1.5-2 seconds. With one fixed mode for every step, the two drift apart over a long demo.

## Local-App Gotchas

### `Secure; SameSite=None` cookies are rejected over HTTP

Browsers won't set `Secure` cookies over plain HTTP on a non-localhost host (for example a LAN IP or a custom dev domain), so the session never sticks and every navigation bounces to login. `http://localhost` is usually treated as secure and is fine. Otherwise, either drop the `Secure` flag for the recording run (`SameSite=None` requires `Secure`, so switch to `SameSite=Lax` at the same time; often an env flag), or serve HTTPS with a self-signed cert and `ignoreHTTPSErrors: true`.

### Strict CSP blocks the overlay

A `style-src 'self'` policy without `unsafe-inline` blocks the inline styles on the subtitle bar and cursor. Keep `bypassCSP: true` on the context.

### SPA crashes on boot produce a blank video

A missing env var that throws during bootstrap (a realtime client or analytics constructor given an empty key) leaves the page blank, and the recorder captures it without complaint. Confirm the page renders in a real browser first. Front-trimming can't rescue a broken page.

### State accumulates across runs

Re-runs against a fixed account leave extra rows behind, which make text selectors ambiguous (the new modal option and a leftover card both match). Add a reset at the top of the script that clears only the rows the demo touches, using your stack's tool (`rails runner`, `php artisan tinker`, a SQL one-liner, an admin API call). When shelling out, use the array form of `spawnSync` so the shell doesn't expand variables. Demos that sign up a fresh random email each run can skip this.

### Env vars pointing at production

Some agent sessions export `DB_HOST` or `DB_PASSWORD` for a production database. Any reset or seed command that inherits the shell environment will hit prod. Pass an explicit env to child processes with the local database host instead of forwarding `process.env`.

### Revert recording-only config

Put cookie flags and env overrides changed for the recording back before committing, so the diff contains only the recorder script.

## Optional Narration

Narration reuses the subtitle captions as the script.

1. **Generate one clip per caption** with a TTS provider. Neutral options include ElevenLabs (expressive voices, wide voice library) and OpenAI's TTS API (simple, inexpensive). Cache clips by step so re-records skip the API.
2. **Use real clip durations as step waits.** Measure each clip with `ffprobe` and feed that into `before`/`during` timing. Without TTS, estimate about 12 characters per second.
3. **Narrate the title card** with a one-sentence intro in the same voice.
4. **Mux with ffmpeg** — delay each clip to its subtitle offset (`adelay`), push back any clip that would overlap the previous one, mix with `amix`, and pad the video tail (`tpad=stop_mode=clone`) if audio runs past the visuals.

**API keys:** the TTS key belongs in an environment variable (e.g. `ELEVENLABS_API_KEY`) or a secret manager, loaded by the script at runtime. Never ask the user to paste a key into chat, and never write one into the repo or a committed `.env` file. If the key isn't set, tell the user which variable to set in their own shell and fall back to a silent recording in the meantime. If a user pastes a key into chat anyway, don't use it: tell them to rotate it, since chat logs aren't a safe place for secrets.

## Delivery Checklist

- [ ] Page renders correctly in a real browser before recording
- [ ] Session persists across navigations (cookie check)
- [ ] Each step uses the right mode
- [ ] Cursor visible on every click and fill
- [ ] Each consequential action’s result is readable in the delivered MP4
- [ ] Subtitles readable and never covering the active element
- [ ] Fake URL bar shows the public domain
- [ ] Title card works as a thumbnail
- [ ] Recording-only config reverted
- [ ] MP4 handed back with a one-line summary of what it shows
