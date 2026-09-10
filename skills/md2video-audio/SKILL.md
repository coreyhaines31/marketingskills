---
name: md2video-audio
description: Convert specified Markdown files into MP4 videos with free human-like voice narration and presentation visuals. Use this skill when users request converting Markdown into videos, creating narrated videos, generating tutorial videos, or combining audio and visual content. Related to content creation and media generation workflows; for SEO and written content optimization, see ai-seo and seo-audit.
---

# Markdown Free Narrated Video Generation Skill (md2video-audio)

- Purpose: Automatically convert local Markdown files into MP4 videos containing presentation visuals and free voice narration.

## 1. Core Rules

**The following principles must always be strictly followed:**

- **Rule 1**: **Never modify the original source document.** Process sequentially from the original Markdown file to the optimized script, presentation script, narration script, and finally the generated video.
- **Rule 2**: Never install or remove dependencies, delete files, execute scripts, or request interactive input without explicit user confirmation. When uncertain, ask the user first.

## 2. Sequential Workflow

This task follows a strict sequential workflow divided into multiple stages. You must proceed in order. Do not skip to later stages until the current stage is completed and validated.

### 1. Environment Dependency Check and Installation

Reference: `references/environment.md`

### 2. Generate Optimized Script

- Never modify the original file.
- Output file format: `new-original-name-timestamp.md`
- Preserve the original text and logical structure. Only perform necessary paragraph splitting, section formatting, color enhancement, and add natural introduction and transition sentences.
- Reference: `references/newscript.md`

### 3. Generate Presentation Script

- Output file format: `show-original-name-timestamp.md`
- Convert the optimized Markdown file (`new-original-name-timestamp.md`) into a logically structured presentation script.

Requirements:

1. At the top of the Markdown file, add presentation configuration.
   - Pause and ask the user which Marp presentation style to use.
   - Ask whether to enable `allowHtml: true`.
   - If the default style is selected, follow `references/showscript.md`.

2. Convert HTML tags into Markdown syntax whenever possible.
   - Example: Convert `<img>` into `![]()` while preserving original parameters.

3. Split slides using `---` according to semantic structure and Markdown sections.

Validate every slide:

1. Check whether slide content exceeds the safe layout capacity (85% of the Marp slide height).
   - Estimate height dynamically based on style configuration in YAML Front Matter.
   - If content exceeds the safe boundary, split it into smaller logical slides.
   - Keep the number of slides as small as possible while maintaining good layout.

2. Check whether any content block exceeds 350px height.
   - Split expandable content such as tables and code blocks into logically separated blocks.

3. Insert natural line breaks when code lines are too long.

Only continue after validation passes. If validation fails, fix the issues and retry. If validation fails three times, ask the user to manually adjust before continuing.

### 4. Generate Narration Script

- Output file format: `speaking-original-name-timestamp.md`

Generate a natural narration script based on the presentation script.

Requirements:

1. Add two `---` separators at the beginning before the first narration section.
2. Remove unnecessary decorative emojis and display-only symbols that should not be spoken.

Validation:

- The number of `---` separators must exactly match between the narration script and presentation script.
- Verify using:

```bash
grep -E '^---[[:space:]]*$' your_file.md | wc -l
````

 If counts do not match, fix the narration script. Usually this requires adding missing separators at the beginning.

 If validation fails three times, ask the user to manually adjust before continuing.

 ### 5\. Generate Video Using Python Pipeline

 Use the two generated Markdown files:

 - Presentation script
- Narration script

 Execute the Python script included in this skill:

```
python ai-2md2marp2av.py presentation.md narration.md
```

 The script generates:

 - High-quality PPT images using Marp
- Voice narration using Edge-TTS
- Final synchronized MP4 video

 The script contains interactive prompts. Users must provide manual input when required.

 ### 6\. Fallback Strategy

 If video generation fails:

 1. Execute:

```
md2marp2av.py
```

 2. If it still fails, execute:

```
md2video.py
```

 Use fallback methods only after the primary generation workflow fails.

