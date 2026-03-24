# 2026 Envision Supplier Summit — Remotion Video

Motion graphics video built with [Remotion](https://www.remotion.dev/).
**Runtime**: 80 seconds (+ 30s cut)
**Resolution**: 1920×1080 @ 30fps
**Audience**: BSC suppliers, 2026 Envision Supplier Summit

## Quick start

```bash
npm install
npm start          # open preview in browser
```

## Render

```bash
# Full 80-second master
npm run render

# 30-second cut (supplier section + close)
npm run render:30s
```

Output files land in `out/`.

## Structure

```
src/
├── index.ts                    # Remotion entry point
├── Root.tsx                    # Registers both compositions
├── SummitVideo.tsx             # Master composition + 30s cut
├── constants.ts                # Timing, colors, captions, overlays
└── components/
    ├── scenes/
    │   ├── Intro.tsx           # Shots 1–3  (0–12s)
    │   ├── BodyPart1.tsx       # Shots 4–7  (12–35s)
    │   ├── BodyPart2.tsx       # Shots 8–11 (35–60s)
    │   └── Close.tsx           # Shots 12–14 (60–80s)
    └── ui/
        ├── Caption.tsx         # Voiceover subtitle captions
        └── OnScreenText.tsx    # 5 headline overlays
```

## Adjusting content

- **Voiceover captions**: edit `CAPTIONS` array in `src/constants.ts`
- **On-screen text**: edit `OVERLAYS` array in `src/constants.ts`
- **Colors**: edit `COLORS` in `src/constants.ts`
- **Shot timing**: edit `SHOTS` and `SECTIONS` in `src/constants.ts`

## Compositions

| ID              | Duration | Purpose                              |
|-----------------|----------|--------------------------------------|
| `SummitVideo`   | 80s      | Full master — summit screening       |
| `SummitVideo30` | ~45s     | Digital cut — supplier-focused close |
