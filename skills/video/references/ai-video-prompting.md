# AI Video Prompting Guide

How to write effective prompts for AI video generation models (Veo, Runway, Kling, Pika).

---

## Prompt Structure

A strong video prompt follows this formula:

```
[Subject] + [Action] + [Camera movement] + [Visual style] + [Lighting/mood] + [Technical specs]
```

### Example Prompts by Use Case

**Product hero shot:**
```
A sleek laptop on a minimal white desk, screen glowing with a dashboard UI,
camera slowly orbits 180 degrees around the desk,
soft volumetric lighting from the left, shallow depth of field,
cinematic commercial aesthetic, 4K
```

**Lifestyle B-roll:**
```
A woman in a modern co-working space smiling while looking at her phone,
natural window light, candid documentary feel,
camera handheld with subtle movement, warm color grading
```

**Abstract/brand:**
```
Flowing liquid gold particles forming the shape of a network graph,
dark background, particles catch light as they move,
slow-motion macro photography style, dramatic rim lighting
```

**SaaS explainer scene:**
```
An overhead shot of a team around a conference table pointing at charts,
camera slowly pushes in, bright modern office,
clean corporate style, even lighting, 1080p
```

---

## Camera Movement Vocabulary

Use these terms — video models understand them:

| Term | Effect |
|------|--------|
| **Static** | Locked camera, no movement |
| **Pan left/right** | Camera rotates horizontally |
| **Tilt up/down** | Camera rotates vertically |
| **Dolly in/out** | Camera moves toward/away from subject |
| **Orbit** | Camera circles around subject |
| **Tracking shot** | Camera follows moving subject |
| **Crane/aerial** | Camera rises or descends |
| **Handheld** | Subtle shake, documentary feel |
| **Zoom** | Lens zoom (different from dolly) |
| **Slow push** | Gradual dolly in — builds tension/focus |

---

## Style Keywords

### Cinematic
- "cinematic color grading"
- "anamorphic lens flare"
- "shallow depth of field"
- "film grain"
- "35mm film"

### Commercial/Corporate
- "clean commercial lighting"
- "bright and airy"
- "professional corporate aesthetic"
- "even, diffused lighting"

### Documentary
- "handheld documentary style"
- "natural lighting"
- "candid, unposed"
- "observational camera"

### Social/Trendy
- "vertical 9:16"
- "fast-paced cuts"
- "bold text overlays"
- "high contrast, saturated colors"

---

## Model-Specific Tips

### Veo (Google)

- Excels at photorealism and complex scenes
- Supports audio generation synced to video
- Best with detailed, descriptive prompts
- Specify "high resolution" or "1080p" for best quality
- Can handle multiple subjects and scene transitions

### Runway Gen-4

- Strong motion control — specify camera movements precisely
- Best temporal consistency (subjects stay consistent across frames)
- Use motion brush for specific area animation
- Image-to-video works well — provide a reference frame
- Keep prompts under 100 words for best results

### Kling

- Can generate up to 2 minutes (much longer than others)
- Good for longer narrative sequences
- More affordable for bulk generation
- Quality drops slightly at longer durations
- Best with simpler scenes and fewer subjects

### Pika

- Fastest generation time (under 2 minutes)
- Good for quick iterations and experimentation
- Effects mode adds motion to still images
- Best for short clips (5-15 seconds)
- Less control over camera movement

---

## Common Prompt Mistakes

| Mistake | Why It Fails | Fix |
|---------|-------------|-----|
| "A person using our app" | Too vague, no visual detail | Describe the person, setting, lighting, camera |
| Including text/logos | AI can't render readable text | Add text in post via Hyperframes/CapCut |
| "Make it viral" | Not a visual instruction | Describe the visual style you want |
| Extremely long prompts (200+ words) | Models lose focus | Keep to 50-100 words, be specific |
| No camera direction | Random/static camera | Always specify movement or "static" |
| "Realistic" alone | Not specific enough | "Photorealistic, natural lighting, shot on RED camera" |

---

## Prompting Workflow

1. **Reference first** — find a real video that looks like what you want
2. **Describe it** — break down: subject, action, camera, style, mood
3. **Generate 3-4 variations** — same concept, different angles or styles
4. **Iterate on the best** — refine the prompt based on results
5. **Composite** — combine AI footage with programmatic text/overlays

---

## Aspect Ratios

Always specify in your prompt or generation settings:

| Platform | Ratio | Resolution |
|----------|-------|-----------|
| YouTube | 16:9 | 1920x1080 or 3840x2160 |
| TikTok/Reels/Shorts | 9:16 | 1080x1920 |
| Instagram Feed | 1:1 or 4:5 | 1080x1080 or 1080x1350 |
| Website hero | 16:9 | 1920x1080 |
| LinkedIn | 16:9 or 1:1 | 1920x1080 |

---

## Cost Optimization

- **Iterate at low resolution** — upscale only the final version
- **Use Kling for drafts** — cheapest per second, switch to Veo/Runway for finals
- **Image-to-video** — providing a reference frame saves generation credits and gives better results
- **Batch similar prompts** — models often offer volume discounts
- **Cache and reuse** — B-roll clips can be reused across multiple videos
