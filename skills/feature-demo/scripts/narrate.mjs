// Narrates a recording produced by the feature-demo recorder
// (scripts/record-<feature>.mjs).
//
// Reads subtitle text + offsets from a timings JSON sidecar, fetches MP3
// narration for each subtitle from the ElevenLabs API, and muxes the audio
// onto the silent WebM at the matching timestamps with ffmpeg.
//
// Prereqs: ffmpeg in $PATH, ELEVENLABS_API_KEY set in env.
//
// Run:  node .agents/skills/feature-demo/scripts/narrate.mjs <video.webm> [out.mp4]
// Env:  ELEVENLABS_API_KEY (required)
//       ELEVENLABS_VOICE_ID (default Bella: EXAVITQu4vr4xnSDxMaL)
//       ELEVENLABS_MODEL_ID (default eleven_v3 — the most expressive model;
//                            switch to eleven_multilingual_v2 if v3 sounds
//                            off, it's the marketed voiceover model)
//       TIMINGS_PATH (default <video-dir>/subtitle-timings.json)

import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { chromium } from 'playwright';

// Walk up from the script location looking for a file under the project
// (e.g. public/img/...). This script ships in two places — scripts/ and
// .agents/skills/feature-demo/ — so a fixed relative path would only work
// for one of them, and an absolute path breaks on every machine but mine.
const findUpward = (relPath) => {
    let dir = path.dirname(fileURLToPath(import.meta.url));
    for (let i = 0; i < 8; i++) {
        const candidate = path.join(dir, relPath);
        if (existsSync(candidate)) return candidate;
        const parent = path.dirname(dir);
        if (parent === dir) break;
        dir = parent;
    }
    return null;
};

const videoPath = process.argv[2];
if (!videoPath) {
    console.error('usage: node .agents/skills/feature-demo/scripts/narrate.mjs <video.webm> [out.mp4]');
    process.exit(2);
}
const outPath = process.argv[3] || videoPath.replace(/\.(webm|mp4)$/i, '') + '-narrated.mp4';
const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
    console.error('ELEVENLABS_API_KEY is required');
    process.exit(2);
}
const voiceId = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';
const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_v3';
const timingsPath = process.env.TIMINGS_PATH || path.join(path.dirname(videoPath), 'subtitle-timings.json');

if (!existsSync(videoPath)) {
    console.error(`video not found: ${videoPath}`);
    process.exit(2);
}
if (!existsSync(timingsPath)) {
    console.error(`timings not found: ${timingsPath}`);
    process.exit(2);
}

const timingsJson = JSON.parse(readFileSync(timingsPath, 'utf8'));
const { subtitles, titleCard } = timingsJson;
if (!subtitles?.length) {
    console.error('no subtitles in timings file');
    process.exit(2);
}

const workDir = path.join(path.dirname(videoPath), 'narration');
mkdirSync(workDir, { recursive: true });

const run = (cmd, args, { capture = false } = {}) =>
    new Promise((resolve, reject) => {
        const p = spawn(cmd, args, { stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit' });
        const chunks = [];
        if (capture) p.stdout.on('data', (c) => chunks.push(c));
        p.on('error', reject);
        p.on('close', (code) => (code === 0 ? resolve(Buffer.concat(chunks).toString('utf8')) : reject(new Error(`${cmd} exited ${code}`))));
    });

const probeDurationMs = async (file) => {
    const out = await run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', file], { capture: true });
    return Math.round(parseFloat(out.trim()) * 1000);
};

const fetchTts = async (text) => {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
            Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
            text,
            model_id: modelId,
            voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true },
        }),
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`ElevenLabs ${res.status}: ${body.slice(0, 200)}`);
    }
    return Buffer.from(await res.arrayBuffer());
};

// Renders the title-card PNG used as the first frame of the video.
// Reuses the Playwright already needed by the recorder pipeline.
const renderTitleCardPng = async (outPath, {
    width,
    height,
    title,
    subtitle,
    brandName,
    logoPath,
    backgroundColor = '#0f172a',
    accentColor = '#38bdf8',
}) => {
    // Project logo: read from logoPath (relative paths are resolved via
    // findUpward from the script location). Falls back to a text wordmark
    // built from brandName when no logo is configured or the file is missing.
    let logoMarkup;
    let resolvedLogo = null;
    if (logoPath) {
        resolvedLogo = path.isAbsolute(logoPath) ? logoPath : findUpward(logoPath);
    }
    if (resolvedLogo && existsSync(resolvedLogo)) {
        const svg = readFileSync(resolvedLogo, 'utf8')
            .replace(/<\?xml[^>]*\?>/, '')
            .replace(/<!--[\s\S]*?-->/g, '');
        logoMarkup = `<div class="logo">${svg}</div>`;
    } else {
        if (logoPath) {
            console.warn(`⚠ logoPath "${logoPath}" not found from any parent of script — falling back to text wordmark`);
        }
        logoMarkup = brandName
            ? `<div class="wordmark">${brandName}</div>`
            : '';
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        html,body{margin:0;padding:0;background:transparent}
        .card{
            box-sizing:border-box;width:${width}px;height:${height}px;
            background:${backgroundColor};
            display:flex;flex-direction:column;align-items:center;justify-content:center;
            color:#ffffff;
            font:400 22px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
            position:relative;
        }
        .logo{width:340px;height:auto;display:block;margin-bottom:48px}
        .wordmark{color:#ffffff;font-size:64px;font-weight:700;letter-spacing:-0.02em;margin-bottom:48px}
        .title{font-size:60px;font-weight:700;line-height:1.1;text-align:center;letter-spacing:-0.02em;margin:0 0 18px 0;max-width:980px;padding:0 40px}
        .subtitle{font-size:24px;opacity:0.7;text-align:center;font-weight:400;letter-spacing:0.02em}
        .accent{position:absolute;left:50%;bottom:60px;transform:translateX(-50%);width:64px;height:3px;background:${accentColor};border-radius:2px}
    </style></head><body>
        <div class="card">
            ${logoMarkup}
            <div class="title">${title}</div>
            <div class="subtitle">${subtitle}</div>
            <div class="accent"></div>
        </div>
    </body></html>`;
    let browser;
    let ctx;
    try {
        browser = await chromium.launch({ headless: true });
        ctx = await browser.newContext({ viewport: { width, height } });
        const page = await ctx.newPage();
        await page.setContent(html, { waitUntil: 'load' });
        await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width, height } });
    } finally {
        if (ctx) await ctx.close().catch(() => {});
        if (browser) await browser.close().catch(() => {});
    }
};

// Set up title card metadata (and pre-fetch intro narration) early.
// We don't shift subtitle offsets here — that happens AFTER the trim
// calculation below, so the trim only sees the ORIGINAL recording-time
// offsets, not the title-shifted ones.
// Probe the chrome PNG up-front (if present) so the title card can be
// rendered at the FULL output height — chrome doesn't overlay the
// title card, only the recorded scenes.
const framePath = path.join(path.dirname(videoPath), 'browser-frame.png');
const hasFrame = existsSync(framePath);
let chromeHeightPx = 0;
if (hasFrame) {
    const out = await run('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=height', '-of', 'default=nw=1:nk=1', framePath], { capture: true });
    chromeHeightPx = parseInt(out.trim(), 10) || 0;
    console.log(`🖼  Chrome frame ${framePath} (${chromeHeightPx}px tall)`);
}

let titleCardInfo = null;
if (titleCard?.title && titleCard?.intro) {
    const introPath = path.join(workDir, 'intro.mp3');
    if (!existsSync(introPath)) {
        console.log(`🎙  Generating intro narration: "${titleCard.intro.slice(0, 60)}…"`);
        writeFileSync(introPath, await fetchTts(titleCard.intro));
    } else {
        console.log(`🎙  Cached intro narration: ${introPath}`);
    }
    const introMs = await probeDurationMs(introPath);
    const TITLE_TAIL_MS = 700; // hold title slightly after intro audio ends
    const titleHoldMs = introMs + TITLE_TAIL_MS;

    const titlePngPath = path.join(workDir, 'title-card.png');
    const titleHeight = 800 + chromeHeightPx; // full output, no chrome overlay
    console.log(`🎬 Rendering title card "${titleCard.title}" (${titleHoldMs}ms hold, 1280×${titleHeight})`);
    await renderTitleCardPng(titlePngPath, {
        width: 1280,
        height: titleHeight,
        title: titleCard.title,
        subtitle: titleCard.subtitle || '',
        brandName: titleCard.brandName,
        logoPath: titleCard.logoPath,
        backgroundColor: titleCard.backgroundColor,
        accentColor: titleCard.accentColor,
    });

    titleCardInfo = { introPath, introMs, titleHoldMs, titlePngPath };
}

console.log(`🎙  Generating ${subtitles.length} narration clips with voice ${voiceId}…`);
for (const sub of subtitles) {
    const clipPath = path.join(workDir, `step-${sub.step}.mp3`);
    if (!existsSync(clipPath)) {
        writeFileSync(clipPath, await fetchTts(sub.text));
    }
    sub.clipPath = clipPath;
    sub.durationMs = await probeDurationMs(clipPath);
    console.log(`  step ${sub.step}: ${clipPath} (${sub.durationMs}ms)`);
}

// Trim the blank `about:blank` + first-paint period off the front of
// the silent video. Anchor the trim to the first subtitle's offset,
// keeping a small pre-roll so the page is visible for a moment before
// the caption appears. The recorder calls subtitle() right after
// waitForSelector returns, so the page is rendered just before the
// subtitle is set; ~150ms of pre-roll lands roughly at first paint.
const PRE_ROLL_MS = 150;
const trimStartMs = Math.max(0, subtitles[0].offsetMs - PRE_ROLL_MS);
if (trimStartMs > 0) {
    console.log(`✂️  Trimming ${trimStartMs}ms of blank screen off the start`);
    for (const sub of subtitles) {
        sub.offsetMs = Math.max(0, sub.offsetMs - trimStartMs);
    }
}

// Now shift every scene's audio offset by the title-card hold time, so
// the recorded video plays AFTER the title card in the final timeline.
if (titleCardInfo) {
    for (const sub of subtitles) {
        sub.offsetMs += titleCardInfo.titleHoldMs;
    }
}

// Push back any clip that would start while the previous one is still
// playing, so the narration never doubles up. This keeps the voiceover
// intelligible even if a caption is longer than its on-screen scene.
for (let i = 1; i < subtitles.length; i++) {
    const prev = subtitles[i - 1];
    const earliestStart = prev.offsetMs + prev.durationMs + 200;
    if (subtitles[i].offsetMs < earliestStart) {
        const slip = earliestStart - subtitles[i].offsetMs;
        console.log(`  ⏩ pushing step ${subtitles[i].step} back ${slip}ms to avoid overlap`);
        subtitles[i].offsetMs = earliestStart;
    }
}

// Build the ffmpeg mix.
//  - input ordering: [title-card-png (looped)?] silent-video [chrome-png?] [intro-mp3?] scene-mp3s...
//  - filter chain stacks chrome on top of (title + main) and mixes
//    intro narration + all scene narrations together.
const fullVideoDurationMs = await probeDurationMs(videoPath);
const videoDurationMs = fullVideoDurationMs - trimStartMs;
const titleHoldMs = titleCardInfo ? titleCardInfo.titleHoldMs : 0;
const totalVisibleMs = titleHoldMs + videoDurationMs;
const lastClipEndMs = Math.max(...subtitles.map((s) => s.offsetMs + (s.durationMs || 0)));
const padNeeded = lastClipEndMs > totalVisibleMs;
console.log(`🎬 Title hold=${titleHoldMs}ms, video=${videoDurationMs}ms (trimmed ${trimStartMs}ms), last narration ends at ${lastClipEndMs}ms${padNeeded ? ' — will pad main video tail' : ''}`);

const ffArgs = ['-y'];
let inputIdx = 0;
let titleVidIdx = -1, videoIdx, chromeIdx = -1, introIdx = -1;

if (titleCardInfo) {
    ffArgs.push('-loop', '1', '-framerate', '25', '-t', `${(titleHoldMs / 1000).toFixed(3)}`, '-i', titleCardInfo.titlePngPath);
    titleVidIdx = inputIdx++;
}
if (trimStartMs > 0) {
    // Input seek — fast and frame-accurate enough for trimming blank
    // frames; the filter chain sees a video that starts at t=0.
    ffArgs.push('-ss', `${(trimStartMs / 1000).toFixed(3)}`);
}
ffArgs.push('-i', videoPath);
videoIdx = inputIdx++;
if (hasFrame) {
    ffArgs.push('-i', framePath);
    chromeIdx = inputIdx++;
}
if (titleCardInfo) {
    ffArgs.push('-i', titleCardInfo.introPath);
    introIdx = inputIdx++;
}
const sceneIdxStart = inputIdx;
for (const sub of subtitles) {
    ffArgs.push('-i', sub.clipPath);
    inputIdx++;
}

const filterChunks = [];

// Main (recorded) video, padded if narration overruns
const mainPadSeconds = padNeeded
    ? ((lastClipEndMs + 500 - totalVisibleMs) / 1000).toFixed(3)
    : '0';
const padFilter = padNeeded
    ? `[${videoIdx}:v]tpad=stop_mode=clone:stop_duration=${mainPadSeconds},format=yuv420p,fps=25[mainVid]`
    : `[${videoIdx}:v]format=yuv420p,fps=25[mainVid]`;
filterChunks.push(padFilter);

// Stack chrome on top of the MAIN scene only — title card already
// fills the full output height and should NOT have chrome over it.
let sceneLabel = '[mainVid]';
if (hasFrame) {
    filterChunks.push(`[${chromeIdx}:v]scale=iw:ih[chrome]`);
    filterChunks.push(`[chrome][mainVid]vstack=inputs=2[sceneFull]`);
    sceneLabel = '[sceneFull]';
}

// Then concat the (full-bleed) title card with the (chrome+scene) main.
if (titleCardInfo) {
    filterChunks.push(`[${titleVidIdx}:v]format=yuv420p,fps=25[titleVid]`);
    filterChunks.push(`[titleVid]${sceneLabel}concat=n=2:v=1[vout]`);
} else {
    filterChunks.push(`${sceneLabel}null[vout]`);
}

// Audio: intro at t=0 (if title card), then each scene narration at its
// (already shifted) offset.
const audioLabels = [];
if (titleCardInfo) {
    filterChunks.push(`[${introIdx}:a]adelay=0|0,apad=pad_dur=0.3[introA]`);
    audioLabels.push('[introA]');
}
subtitles.forEach((sub, i) => {
    const idx = sceneIdxStart + i;
    filterChunks.push(`[${idx}:a]adelay=${sub.offsetMs}|${sub.offsetMs},apad=pad_dur=0.3[a${i + 1}]`);
    audioLabels.push(`[a${i + 1}]`);
});
filterChunks.push(`${audioLabels.join('')}amix=inputs=${audioLabels.length}:duration=longest:normalize=0[mixed]`);

const outputDurationMs = Math.max(totalVisibleMs, lastClipEndMs + 500);

ffArgs.push(
    '-filter_complex',
    filterChunks.join(';'),
    '-map',
    '[vout]',
    '-map',
    '[mixed]',
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-preset',
    'veryfast',
    '-crf',
    '23',
    '-c:a',
    'aac',
    '-b:a',
    '160k',
    '-t',
    `${(outputDurationMs / 1000).toFixed(3)}`,
    outPath,
);

console.log('🧪 ffmpeg', ffArgs.map((a) => (/\s/.test(a) ? JSON.stringify(a) : a)).join(' '));
await run('ffmpeg', ffArgs);
console.log(`✅ Narrated video: ${outPath}`);
