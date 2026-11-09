# Code-Rendered Product Films

How to make a library of product videos (landing hero, launch films, feature walkthroughs for app and docs) entirely in code, with agents doing the production and a human giving taste feedback. No screen recording, no video editor.

*Adapted from Elie Steinbock's write-up of how Inbox Zero produced its hero, launch films, and about 15 walkthroughs, each well under $1 in API calls (October 2026).*

## When to Use This Format

| Need | Use |
|---|---|
| A library of walkthroughs that must stay accurate as the UI changes | This method |
| One repeatable recording of a flow, re-run each release | [product-demo-recording.md](product-demo-recording.md) (Playwright drives the live app) |
| Personality-led narrated demo | Live screen recording |
| Per-account films at volume | The Personalized Video per Account workflow in SKILL.md (same foundations) |

The upfront cost is the kit (captured UI, engine, briefs). It pays back from the third or fourth video.

## Core Idea: Every Frame Is a Function of Time

Each video is an HTML/CSS/JS page where every frame is a pure function of `t`. Headless Chrome screenshots each frame and ffmpeg encodes them.

- **Copy changes are re-renders, not re-edits.**
- **Frames render in parallel**, because nothing carries over between frames.
- **Render purity is mandatory**: no `Date.now()`, no randomness without a seed, no state carried between frames. Workers start mid-timeline.
- Hide scenes with `display:none`, not `visibility:hidden` (visible children leak through a hidden parent).
- Camera moves, cursor paths, typing, and highlights are all CSS transforms computed from `t` with springs and easing.
- Preview in a browser with a `?t=17` parameter to jump to 17s.

A small engine (a few hundred lines) is enough; Hyperframes and Remotion use the same model if you'd rather not write one.

## Set Up a Private Video Repo

Keep videos in their own private repo, separate from the product.

```
AGENTS.md     # read-first: pipeline, taste rules, mistakes made
README.md     # catalog: every video, its branch, length, status, where it's used
BRIEF.md      # product truths, fictional cast, kit API, end-card and taste rules
engine.js     # renderAt(t), scenes, easing, word-by-word captions
render.mjs    # parallel Playwright frame renderer → ffmpeg
mix.sh        # voice + music mix
kit/app/      # real app screens captured as DOM snapshots
kit/          # overlays (captions, callouts, cursor, toasts), end card, third-party UI mocks
music/        # shared music beds
```

- **One branch and one git worktree per video.** `main` holds only shared things (kit, briefs, tools). Commit kit fixes found mid-video separately so they can be cherry-picked to `main`.
- Commit each video's web encode, poster, `.vtt` captions, and a `VARIANT.md` (script, timings, chapters, claim checks, docs-vs-UI discrepancies). Git-ignore masters and intermediates.
- **Keep `AGENTS.md` alive.** Every reviewer note and every agent mistake becomes a one-line rule. This is what makes the tenth video right on the first try.

## Capture the Real UI

1. Run the app locally on a **seeded database of fictional data**: one consistent cast (a main user, 4–5 contacts, a fictional company) with realistic fake records. Use local emulators for third-party APIs where you can.
2. A Playwright script visits each screen and state the videos need and saves the **rendered DOM with inlined CSS** as a standalone HTML snapshot, plus a PNG for reference.
3. Missing states are **derived** from the nearest snapshot by editing the DOM to match the real component's source. Never invent UI.
4. **Audit every snapshot for leaks before committing**: real names, emails, avatars, API keys, and the capture machine's timezone and locale. Once committed, a leak is in git history.

## Write the Script (Accuracy First)

- Read the docs page **and the app source** for the feature. Every label, button, and step on screen must match the product.
- **When docs and UI disagree, the UI wins.** Log the discrepancy in `VARIANT.md` and fix the docs afterward. This turns video production into a steady source of docs fixes and bug reports.
- **Check claims in code**, not just docs ("does feature X actually use data Y?").
- Keep **product truths** in `BRIEF.md`: supported platforms, trial terms, what's early access.
- Walkthrough shape: a 1–2s product payoff up front, numbered steps with one caption each, one result shot, a minimal end card.
- Hero and launch openers must say what the product *is* in the first line. Write several candidates and let the reviewer pick, then record the pick.

## Starter Taste Rules

Add your reviewer's rules to these:

- **Openers**: light and product-native; reach the product payoff within ~2s. No dark gradients, fake app icons with badges, or captions over blurred clutter.
- **No recaps** in words or as a closing montage.
- **End cards**: centered logo lockup, one line, a quiet URL. Landing cuts can carry one CTA. No dot-joined copy, no text-stuffed buttons.
- **Legibility**: body text ≥ 20px at 1080p; no wide shot of unreadable UI for more than ~1s; no words sliced at frame edges; captions settled ≥ 0.4s before the click they describe.
- **Transitions**: no long crossfades between two busy UIs. Cut, push the camera, or use a short blur-through.

## Audio

- **Voiceover**: a TTS model with style instructions, one voice per format. Generate 2–3 takes per line and have an audio-capable model score pacing, mispronunciations, odd stresses, and clipped endings, then pick.
- **Music**: one shared bed per format. Music models ignore the requested length, so detect the beat grid (e.g. librosa) and cut or loop at phrase boundaries.
- **Mix**: duck music under the voice with a sidechain, then normalize in two passes to −14 LUFS integrated and −1.2 dBTP true peak.
- **Agents can't listen.** Flag music endings and loop points for a human ear-check.

## Render

- Split frames across N Playwright workers; each loads the page, sets `t`, screenshots. Encode a high-quality master (CRF ~12) and a web copy (CRF ~20).
- Add a screenshot timeout and retry; long renders hit flaky frames.
- Support rendering a sub-range or one segment, so a fix doesn't need a full render.
- **On a shared machine**: cap workers per agent and stop only your own processes by PID. A broad `pkill` kills other agents' renders.

## Review Before Anyone Sees It

- Sample frames into 2×2 contact sheets and **look at them yourself**, zooming in on captions, edges, and data. This is the main review.
- A video-capable model can check timing and caption order across the whole film, but **treat its output as hints**: video and audio judges report glitches that aren't there. Verify every claim against frames.
- Checklist: claims match code, fictional cast only, no leaks, legibility rules, end card.
- Hand the reviewer the finished files along with the `VARIANT.md` discrepancy list.

## Parallel Production

Once the kit and briefs exist, run **one subagent per video**, each with its own worktree and branch, the brief, the relevant docs page, and an instruction to read `AGENTS.md` first. Each writes, builds, renders, reviews, and reports back the file path and discrepancies found. A coordinator merges kit fixes into `main`, uploads, and places the videos.

## Publish and Measure

- **Hosting**: a video host with a clean player (no recommendations) and auto-captions, rather than YouTube embeds. Record each asset ID in the repo; pass API tokens via env vars. Upload scripts must surface API errors (a plan limit silently swallowed is a missing video).
- **In the app and docs**: lazy-load the player so it adds nothing to the page until opened.
- **Landing hero**: track click, start, progress, completion, and close events with a `video_id`. Don't A/B test the hero video on overall signups: only the visitors who click play can be affected, so the test is underpowered. Ship the better cut and compare cuts on watch-through and viewer-to-signup rate by `video_id`. See ab-testing.
- **YouTube**: the API keeps uploads from unaudited projects private, so upload through Studio. If an agent automates Studio, have it read every field back before scheduling.

## Mistakes to Skip

| Mistake | Rule |
|---|---|
| Invented UI in the first cut | Real DOM snapshots only |
| A claim the product doesn't make | Check claims in code |
| A tagline the company doesn't use | Offer options, record the reviewer's pick |
| A real timezone leaked into a committed snapshot | Audit snapshots before committing |
| Agents killed each other's renders | Stop processes only by your own PID |
| A judge model "found" glitches that weren't there | Verify against frames |
| An upload script swallowed a hosting error | Scripts surface API errors |
