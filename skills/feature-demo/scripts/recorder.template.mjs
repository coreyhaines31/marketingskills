// Per-feature recording skeleton produced by the feature-demo skill.
// Copy into scripts/ and edit the BRAND, TITLE_CARD, and FEATURE STEPS
// sections for your flow.
//
// Run:  node scripts/<your-recording>.mjs
// Env:  BASE_URL (default http://127.0.0.1:8000) — the URL the recorder hits
//       OUT_DIR (default /tmp/playwright-recording)
//       TIMINGS_PATH (default <OUT_DIR>/subtitle-timings.json)
//       DEMO_DOMAIN — shown in the fake URL bar (overrides BRAND.demoDomain)
//       ELEVENLABS_API_KEY — if set, the recorder pre-generates the TTS
//           narration MP3 for each caption and waits for its ACTUAL
//           duration before moving to the next scene, so audio and video
//           stay in lockstep. Without it, falls back to a character-rate
//           estimate.
//       ELEVENLABS_VOICE_ID (default Bella EXAVITQu4vr4xnSDxMaL)
//       ELEVENLABS_MODEL_ID (default eleven_v3)

import { mkdirSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { spawn, spawnSync } from 'child_process';
import { chromium } from 'playwright';

// ─── BRAND ────────────────────────────────────────────────────────────────
// Edit per project. These end up in the chrome tab title + the title
// card. logoPath is searched up from the script location (so e.g. for a
// Laravel app `public/img/logo.svg` finds it from anywhere under the
// repo); leave it `undefined` to fall back to a text wordmark of `name`.
const BRAND = {
    name: '<YourApp>',
    demoDomain: 'app.example.com',
    logoPath: undefined, // e.g. 'public/img/logo.svg'
    backgroundColor: '#0f172a', // title-card background
    accentColor: '#38bdf8',     // title-card underline + chrome tab favicon
};

// ─── CONFIG ───────────────────────────────────────────────────────────────
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:8000';
const OUT_DIR = process.env.OUT_DIR || '/tmp/playwright-recording';
const TIMINGS_PATH = process.env.TIMINGS_PATH || path.join(OUT_DIR, 'subtitle-timings.json');
const DEMO_DOMAIN = process.env.DEMO_DOMAIN || BRAND.demoDomain;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';
const ELEVENLABS_MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_v3';
const NARRATION_DIR = path.join(OUT_DIR, 'narration');
mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(NARRATION_DIR, { recursive: true });

// Update TOTAL_STEPS to match the number of `step(...)` calls below
// (including the opener) so the on-screen "Step N / TOTAL" badge is accurate.
const TOTAL_STEPS = 8;

// Title card + intro voiceover shown at the start of the final video.
// The narrator script renders this as the first frame (so it's also the
// preview thumbnail) and plays the intro over it. Brand fields from
// BRAND above are merged in at write-time so narrate.mjs has everything
// it needs in a single sidecar.
const TITLE_CARD = {
    title: '<Your video title>',
    subtitle: '<One-line subtitle>',
    intro: "<One-sentence intro spoken over the title card explaining what the video covers.>",
};

// ─── NARRATION TIMING ─────────────────────────────────────────────────────
// Tail buffer added to actual narration duration so the next scene doesn't
// jump in the moment the speaker finishes.
const NARRATION_TAIL_MS = 400;

// IMPORTANT: reset any per-feature backend state before recording so each
// run starts from the same place. Without this, leftover rows from prior
// runs (e.g. extra steps you added to a sequence) accumulate and confuse
// selectors. The pattern: shell out via spawnSync (array form so the
// shell doesn't expand `$vars`) and zero out the bits this demo touches.
// Skip if the demo doesn't need a known user (e.g. registration demos
// that use a random email per run).
//
// Example (Laravel):
// const resetDemoState = () => {
//     const phpCode = `
//         $u = \\App\\Models\\User::firstWhere("email", "demo@example.local");
//         if ($u) { /* delete extra rows the demo creates */ }
//     `;
//     const res = spawnSync('php', ['artisan', 'tinker', '--execute', phpCode], {
//         env: process.env, encoding: 'utf8',
//     });
//     if (res.status !== 0) throw new Error(`reset failed: ${res.stderr || res.stdout}`);
//     console.log(`🧹 ${res.stdout.trim()}`);
// };
// resetDemoState();

const runCapture = (cmd, args) =>
    new Promise((resolve, reject) => {
        const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'inherit'] });
        const chunks = [];
        p.stdout.on('data', (c) => chunks.push(c));
        p.on('error', reject);
        p.on('close', (code) => (code === 0 ? resolve(Buffer.concat(chunks).toString('utf8')) : reject(new Error(`${cmd} exited ${code}`))));
    });

const probeDurationMs = async (file) => {
    try {
        const out = await runCapture('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', file]);
        return Math.round(parseFloat(out.trim()) * 1000);
    } catch (e) {
        console.warn(`ffprobe failed on ${file}: ${e.message}`);
        return null;
    }
};

// Returns the duration each scene's wait should cover. Pre-generates the
// TTS clip and caches it on disk so the recorder waits for the actual
// narration length. Falls back to ~12 chars/sec if no API key is set.
const fallbackEstimateMs = (text) => Math.max(2500, Math.ceil(text.length / 12) * 1000);
const ensureNarrationDuration = async (step, text) => {
    if (!ELEVENLABS_API_KEY) return fallbackEstimateMs(text);
    const clipPath = path.join(NARRATION_DIR, `step-${step}.mp3`);
    if (!existsSync(clipPath)) {
        const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
            method: 'POST',
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json',
                Accept: 'audio/mpeg',
            },
            body: JSON.stringify({
                text,
                model_id: ELEVENLABS_MODEL_ID,
                voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true },
            }),
        });
        if (!res.ok) {
            const body = await res.text();
            console.warn(`ElevenLabs ${res.status} for step ${step}: ${body.slice(0, 200)} — using estimate`);
            return fallbackEstimateMs(text);
        }
        writeFileSync(clipPath, Buffer.from(await res.arrayBuffer()));
    }
    const dur = await probeDurationMs(clipPath);
    return (dur || fallbackEstimateMs(text)) + NARRATION_TAIL_MS;
};

// ─── OVERLAY ──────────────────────────────────────────────────────────────
// Injected on every page load. Adds:
//   - a scene-caption subtitle bar pinned to the bottom
//   - a fake mouse cursor that clickWithCursor/fillWithCursor steer to
//     each target before the action, so the viewer can see what's being
//     clicked (Playwright drives events with no real cursor by default)
// The browser chrome itself is rendered as a separate PNG (see
// renderChromeFramePng below) and stacked on top of the video by
// narrate.mjs — keeping it out of the recorded viewport means the page
// layout stays untouched.
const CAPTION_H = 70;
const CURSOR_TIP_X = 5;
const CURSOR_TIP_Y = 2;
const CURSOR_SVG = `<svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="M 5 2 L 5 22 L 9.5 17.5 L 12.5 25 L 15 24 L 12 16 L 18.5 16 Z" fill="black" stroke="white" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
const overlayInit = () => `
(() => {
    if (window.__cgyOverlayInstalled) return;
    window.__cgyOverlayInstalled = true;
    const CAPTION_H = ${CAPTION_H};
    const CURSOR_TIP_X = ${CURSOR_TIP_X};
    const CURSOR_TIP_Y = ${CURSOR_TIP_Y};
    const CURSOR_SVG = ${JSON.stringify(CURSOR_SVG)};

    const ensure = () => {
        if (!document.body) return requestAnimationFrame(ensure);
        if (document.getElementById('__cgy_overlay')) return;

        const padStyle = document.createElement('style');
        padStyle.id = '__cgy_padstyle';
        padStyle.textContent =
            'html,body{padding-bottom:' + CAPTION_H + 'px !important;box-sizing:border-box !important;}' +
            '@keyframes __cgyRipple { 0% { width:8px;height:8px;opacity:0.5; } 100% { width:48px;height:48px;opacity:0; } }' +
            '@keyframes __cgyClickPulse { 0% { transform:scale(1); } 50% { transform:scale(0.78); } 100% { transform:scale(1); } }';
        document.head.appendChild(padStyle);

        const bar = document.createElement('div');
        bar.id = '__cgy_overlay';
        bar.innerHTML = '<span id="__cgy_overlay_badge"></span><span id="__cgy_overlay_text"></span>';
        bar.setAttribute('style', [
            'position:fixed','left:0','right:0','bottom:0','z-index:2147483647',
            'background:rgba(15,23,42,0.92)','color:#f8fafc',
            'font:500 20px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
            'padding:18px 28px','display:flex','align-items:center','gap:16px',
            'box-shadow:0 -4px 16px rgba(0,0,0,0.25)','letter-spacing:0.01em',
            'pointer-events:none','transition:opacity 200ms ease',
            'border-top:3px solid #38bdf8',
        ].join(';'));
        document.body.appendChild(bar);
        bar.querySelector('#__cgy_overlay_badge').setAttribute('style', [
            'background:#38bdf8','color:#0f172a','font-weight:700',
            'padding:4px 12px','border-radius:999px','font-size:14px',
            'letter-spacing:0.08em','text-transform:uppercase','flex:none',
        ].join(';'));

        const cur = document.createElement('div');
        cur.id = '__cgy_cursor';
        cur.setAttribute('style', [
            'position:fixed',
            'left:' + (window.__cgyCursorLastX != null ? window.__cgyCursorLastX - CURSOR_TIP_X : 60) + 'px',
            'top:' + (window.__cgyCursorLastY != null ? window.__cgyCursorLastY - CURSOR_TIP_Y : 60) + 'px',
            'width:22px','height:22px','pointer-events:none','z-index:2147483646',
            'transition:left 0.5s cubic-bezier(.22,.61,.36,1),top 0.5s cubic-bezier(.22,.61,.36,1)',
            'filter:drop-shadow(0 1px 2px rgba(0,0,0,0.35))',
        ].join(';'));
        cur.innerHTML = '<div id="__cgy_cursor_inner" style="width:100%;height:100%">' + CURSOR_SVG + '</div>';
        document.body.appendChild(cur);

        window.__cgyMoveCursor = (x, y) => {
            window.__cgyCursorLastX = x;
            window.__cgyCursorLastY = y;
            const el = document.getElementById('__cgy_cursor');
            if (!el) return;
            el.style.left = (x - CURSOR_TIP_X) + 'px';
            el.style.top = (y - CURSOR_TIP_Y) + 'px';
        };
        window.__cgyClickAt = (x, y) => {
            const inner = document.getElementById('__cgy_cursor_inner');
            if (inner) {
                inner.style.animation = '__cgyClickPulse 0.18s ease';
                setTimeout(() => { inner.style.animation = ''; }, 200);
            }
            const ripple = document.createElement('div');
            ripple.setAttribute('style', [
                'position:fixed','left:' + x + 'px','top:' + y + 'px',
                'width:8px','height:8px','border-radius:50%',
                'background:rgba(15,23,42,0.35)','pointer-events:none',
                'z-index:2147483645','transform:translate(-50%,-50%)',
                'animation:__cgyRipple 0.5s ease-out forwards',
            ].join(';'));
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        };

        if (window.__cgyOverlayPending) {
            window.__cgySetSubtitle(window.__cgyOverlayPending.badge, window.__cgyOverlayPending.text);
        }
    };
    window.__cgySetSubtitle = (badge, text) => {
        const el = document.getElementById('__cgy_overlay');
        if (!el) {
            window.__cgyOverlayPending = { badge, text };
            ensure();
            return;
        }
        el.querySelector('#__cgy_overlay_badge').textContent = badge;
        el.querySelector('#__cgy_overlay_text').textContent = text;
    };
    ensure();
})();
`;

// Renders a Chrome-on-macOS chrome frame PNG via a headless Playwright
// page — narrate.mjs stacks this on top of the recorded video with
// ffmpeg so the demo reads as a real Chrome window. Two rows: tab
// strip (traffic lights + active tab) + toolbar (nav buttons + omnibox
// + profile/extensions/menu). SVGs for icons so they render crisply.
const renderChromeFramePng = async (context, outPath, { width, demoDomain, initialPath, tabTitle, faviconColor }) => {
    const CHROME_H = 88; // 38 tab strip + 50 toolbar
    const url = demoDomain + (initialPath.startsWith('/') ? initialPath : '/' + initialPath);
    const faviconLetter = (tabTitle || 'A')[0].toUpperCase();
    const fav = faviconColor || '#38bdf8';
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        html,body{margin:0;padding:0;background:transparent;font:13px/1.2 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#3c4043}
        .chrome{box-sizing:border-box;width:${width}px}
        .tabs{display:flex;align-items:flex-end;height:38px;background:#dee1e6;padding:0 8px 0 18px;gap:1px}
        .lights{display:flex;gap:8px;flex:none;align-self:center;margin-right:12px}
        .light{width:12px;height:12px;border-radius:50%;display:block;box-shadow:inset 0 0 0 0.5px rgba(0,0,0,0.16)}
        .tab{height:32px;background:#fff;border-radius:8px 8px 0 0;display:flex;align-items:center;padding:0 12px 0 14px;gap:9px;min-width:160px;max-width:240px;font-size:12.5px;color:#3c4043;position:relative;box-shadow:inset 0 -1px 0 #dee1e6}
        .tab .fav{width:14px;height:14px;border-radius:3px;background:${fav};display:flex;align-items:center;justify-content:center;color:white;font-size:9px;font-weight:700;flex:none}
        .tab .title{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .tab .close{width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#5f6368;flex:none}
        .tab .close svg{width:10px;height:10px}
        .new-tab{align-self:center;width:28px;height:28px;display:flex;align-items:center;justify-content:center;color:#5f6368;border-radius:4px;margin-left:6px}
        .new-tab svg{width:14px;height:14px}
        .tabs-spacer{flex:1}
        .toolbar{height:50px;background:#f1f3f4;display:flex;align-items:center;padding:0 12px;gap:6px;border-bottom:1px solid #e1e3e6}
        .icon-btn{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#5f6368;flex:none}
        .icon-btn svg{width:18px;height:18px}
        .icon-btn.dim{color:#bdc1c6}
        .omnibox{flex:1;height:34px;background:#e8eaed;border-radius:18px;display:flex;align-items:center;padding:0 14px;gap:10px;color:#3c4043;font-size:13px;margin:0 8px;overflow:hidden}
        .omnibox .lock{display:flex;align-items:center;color:#5f6368;flex:none}
        .omnibox .lock svg{width:14px;height:14px}
        .omnibox .url{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .omnibox .star{color:#5f6368;flex:none}
        .omnibox .star svg{width:16px;height:16px}
        .profile{width:30px;height:30px;border-radius:50%;background:#1a73e8;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:13px;flex:none;margin-left:4px}
    </style></head><body><div class="chrome">
        <div class="tabs">
            <div class="lights">
                <span class="light" style="background:#ff5f57"></span>
                <span class="light" style="background:#febc2e"></span>
                <span class="light" style="background:#28c840"></span>
            </div>
            <div class="tab">
                <span class="fav">${faviconLetter}</span>
                <span class="title">${tabTitle}</span>
                <span class="close"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></span>
            </div>
            <div class="new-tab"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/></svg></div>
            <div class="tabs-spacer"></div>
        </div>
        <div class="toolbar">
            <div class="icon-btn dim"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"/></svg></div>
            <div class="icon-btn dim"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg></div>
            <div class="icon-btn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0012 4a8 8 0 100 16 8 8 0 007.41-5h-2.1A6 6 0 1112 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg></div>
            <div class="omnibox">
                <span class="lock"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg></span>
                <span class="url">${url}</span>
                <span class="star"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></span>
            </div>
            <div class="icon-btn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7s2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/></svg></div>
            <div class="icon-btn"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg></div>
            <div class="profile">${faviconLetter}</div>
        </div>
    </div></body></html>`;
    const page = await context.newPage();
    await page.setViewportSize({ width, height: CHROME_H });
    await page.setContent(html, { waitUntil: 'load' });
    await page.screenshot({ path: outPath, omitBackground: true, clip: { x: 0, y: 0, width, height: CHROME_H } });
    await page.close();
};

// ─── ENGINE ───────────────────────────────────────────────────────────────
const subtitleTimings = [];
let recordingStart = null;
let browser;
let context;
const consoleErrors = [];

try {
    browser = await chromium.launch({ headless: true });

    // Render the chrome PNG in a NON-RECORDING context so it doesn't
    // produce a stray second .webm in OUT_DIR.
    const setupCtx = await browser.newContext({ viewport: { width: 1280, height: 88 } });
    const framePath = path.join(OUT_DIR, 'browser-frame.png');
    await renderChromeFramePng(setupCtx, framePath, {
        width: 1280,
        demoDomain: DEMO_DOMAIN,
        initialPath: '/<YOUR-ENTRY-PATH>',
        tabTitle: BRAND.name,
        faviconColor: BRAND.accentColor,
    });
    await setupCtx.close();
    console.log(`🖼  Chrome frame → ${framePath}`);

    context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        deviceScaleFactor: 1,
        recordVideo: { dir: OUT_DIR, size: { width: 1280, height: 800 } },
        ignoreHTTPSErrors: true,
        // Strict CSP on some pages would block the overlay's inline styles.
        bypassCSP: true,
    });
    await context.addInitScript(overlayInit());

    const page = await context.newPage();
    recordingStart = Date.now();
    page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));
    page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(`console.error: ${msg.text()}`);
    });

    let currentStep = 0;
    const subtitle = async (text) => {
        currentStep += 1;
        const badge = `Step ${currentStep} / ${TOTAL_STEPS}`;
        const offsetMs = Date.now() - recordingStart;
        subtitleTimings.push({ step: currentStep, badge, text, offsetMs });
        await page.evaluate(
            ({ badge, text }) => window.__cgySetSubtitle && window.__cgySetSubtitle(badge, text),
            { badge, text },
        );
    };

    // Move the fake cursor to the center of a locator and animate it
    // there (~500ms slide), optionally fire a click ripple, then perform
    // the actual Playwright action. Always prefer these over locator.click()
    // / locator.fill() so the viewer can see what's being clicked.
    //
    // If the target is outside the "safe zone" (above the top edge or
    // behind the bottom subtitle bar), smooth-scroll it into the middle
    // of the visible area first. SCROLL_DURATION_MS is intentionally
    // generous so the scroll feels deliberate, not snappy.
    const CURSOR_MOVE_MS = 520;
    const SAFE_BOTTOM_PAD = CAPTION_H + 24;
    const SAFE_TOP_PAD = 24;
    const SCROLL_DURATION_MS = parseInt(process.env.SCROLL_DURATION_MS, 10) || 1300;
    const TYPE_DELAY_MS = parseInt(process.env.TYPE_DELAY_MS, 10) || 65;
    const slowScrollBy = async (deltaY) => {
        if (Math.abs(deltaY) < 2) return;
        await page.evaluate(
            ({ deltaY, durationMs }) => new Promise((resolve) => {
                const startY = window.pageYOffset;
                const startT = performance.now();
                const ease = (t) => 0.5 * (1 - Math.cos(Math.PI * t));
                const step = () => {
                    const elapsed = performance.now() - startT;
                    const progress = Math.min(elapsed / durationMs, 1);
                    window.scrollTo(0, startY + deltaY * ease(progress));
                    if (progress < 1) requestAnimationFrame(step);
                    else resolve();
                };
                requestAnimationFrame(step);
            }),
            { deltaY, durationMs: SCROLL_DURATION_MS },
        );
    };
    const cursorTo = async (locator) => {
        let box = await locator.boundingBox();
        if (!box) return null;
        const viewport = page.viewportSize();
        const safeTop = SAFE_TOP_PAD;
        const safeBottom = viewport.height - SAFE_BOTTOM_PAD;
        const outOfSafeZone = box.y < safeTop || box.y + box.height > safeBottom;
        if (outOfSafeZone) {
            const safeCenter = (safeTop + safeBottom) / 2;
            const elementCenter = box.y + box.height / 2;
            await slowScrollBy(elementCenter - safeCenter);
            box = await locator.boundingBox();
            if (!box) return null;
        }
        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;
        await page.evaluate(
            ({ x, y }) => window.__cgyMoveCursor && window.__cgyMoveCursor(x, y),
            { x, y },
        );
        await page.waitForTimeout(CURSOR_MOVE_MS);
        return { x, y };
    };
    const clickWithCursor = async (locator) => {
        const pt = await cursorTo(locator);
        if (pt) {
            await page.evaluate(({ x, y }) => window.__cgyClickAt && window.__cgyClickAt(x, y), pt);
            await page.waitForTimeout(120);
        }
        await locator.click();
    };
    // Types `value` one character at a time (~TYPE_DELAY_MS per char) so
    // the viewer can read along. Click first to focus, clear, then type.
    const fillWithCursor = async (locator, value) => {
        const pt = await cursorTo(locator);
        if (pt) {
            await page.evaluate(({ x, y }) => window.__cgyClickAt && window.__cgyClickAt(x, y), pt);
            await page.waitForTimeout(120);
        }
        await locator.click();
        await locator.fill('');
        await locator.pressSequentially(value, { delay: TYPE_DELAY_MS });
    };

    // ELEVENLABS_API_KEY makes each step wait for the actual TTS clip
    // duration; without it we use a character-rate estimate.
    //
    //   mode 'before' (default) — narrate first, THEN run fn(). Use when
    //       fn() transitions the page (click + navigate) so the viewer
    //       finishes hearing the caption while still seeing the current
    //       page, then watches the transition silently.
    //   mode 'during' — run fn() in parallel with narration. Use for
    //       visible in-place actions like filling a form, where you want
    //       the action to play while it's being described.
    //   mode 'after' — run fn() first, THEN narrate. Use to describe a
    //       state that the action just produced.
    const step = async (label, captionText, fn, { mode = 'before' } = {}) => {
        console.log(`▶ ${label} [${mode}]`);
        try {
            let waitMs = 900;
            if (captionText) {
                await subtitle(captionText);
                waitMs = await ensureNarrationDuration(currentStep, captionText);
                console.log(`  step ${currentStep} narration: ${waitMs}ms`);
            }
            if (mode === 'during') {
                await Promise.all([fn(), page.waitForTimeout(waitMs)]);
            } else if (mode === 'after') {
                await fn();
                if (captionText) await page.waitForTimeout(waitMs);
            } else {
                // 'before'
                await page.waitForTimeout(waitMs);
                await fn();
            }
            console.log(`✓ ${label}`);
        } catch (err) {
            console.error(`✗ ${label}: ${err.message}`);
            await page.screenshot({ path: `${OUT_DIR}/fail-${label.replace(/\W+/g, '-')}.png`, fullPage: true });
            throw err;
        }
    };

    // ─── FEATURE STEPS ────────────────────────────────────────────────────
    // Replace the steps below for your feature. Pattern:
    //   await step('internal label', 'On-screen / narrated caption', async () => {
    //       // Playwright actions for this scene — always use
    //       // clickWithCursor / fillWithCursor (not locator.click / fill)
    //       // so the viewer sees what's being clicked.
    //   }, { mode: 'before' });
    //
    // Tips:
    //  - Keep captions to one sentence; that's what gets read aloud.
    //  - Use `await page.waitForTimeout(N)` inside the action when you need
    //    the user to "see" a state before moving on.
    //  - The first step usually navigates somewhere; the opener below
    //    shows the bare-minimum pattern.

    console.log('▶ open the entry page');
    await page.goto(`${BASE_URL}/<YOUR-ENTRY-PATH>`, { waitUntil: 'networkidle', timeout: 15000 });
    // Extra settle so Inertia/Vue finishes hydrating + fonts paint before
    // we mark t=0 with the first subtitle — the narrator trims the front
    // of the video to (subtitle_offset - 150ms), so the page must be
    // fully visible by then or the trimmed video starts mid-render.
    await page.waitForTimeout(500);
    const openerCaption = `Opening the <feature name> in ${BRAND.name}.`;
    await subtitle(openerCaption);
    await page.waitForTimeout(await ensureNarrationDuration(currentStep, openerCaption));

    await step(
        'fill the first thing',
        'A one-sentence caption describing what happens in this scene.',
        async () => {
            // await fillWithCursor(page.locator('input[name="..."]'), '...');
            // await clickWithCursor(page.getByRole('button', { name: /save/i }));
        },
    );

    // ...repeat for each scene; bump TOTAL_STEPS above to match the count.

    console.log('\n🎬 Recording complete.');
} catch (err) {
    console.error('\n💥 Failure:', err.stack || err.message);
    process.exitCode = 1;
} finally {
    if (context) await context.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});

    try {
        writeFileSync(
            TIMINGS_PATH,
            JSON.stringify(
                {
                    titleCard: {
                        ...TITLE_CARD,
                        brandName: BRAND.name,
                        logoPath: BRAND.logoPath,
                        backgroundColor: BRAND.backgroundColor,
                        accentColor: BRAND.accentColor,
                    },
                    subtitles: subtitleTimings,
                },
                null,
                2,
            ),
        );
        console.log(`📝 Subtitle timings → ${TIMINGS_PATH}`);
    } catch (e) {
        console.error(`failed to write timings: ${e.message}`);
    }

    if (consoleErrors.length) {
        console.log('\nBrowser console errors collected:');
        for (const e of consoleErrors.slice(0, 20)) console.log(`  - ${e}`);
        process.exitCode = 1;
    }
}
