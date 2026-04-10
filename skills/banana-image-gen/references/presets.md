# Brand/Style Presets Reference

> Load this on-demand when the user asks about presets or brand consistency.

## Preset Schema

Each preset is stored as `~/.banana/presets/NAME.json`:

```json
{
  "name": "tech-saas",
  "description": "Clean tech SaaS brand",
  "colors": ["#2563EB", "#1E40AF", "#F8FAFC"],
  "style": "clean minimal tech illustration, flat vectors, soft shadows",
  "typography": "bold geometric sans-serif",
  "lighting": "bright diffused studio, no harsh shadows",
  "mood": "professional, trustworthy, modern",
  "default_ratio": "16:9",
  "default_resolution": "2K"
}
```

## Example Presets

### tech-saas
- **Colors:** #2563EB, #1E40AF, #F8FAFC (blue + white)
- **Style:** Clean minimal tech illustration, flat vectors, soft shadows
- **Typography:** Bold geometric sans-serif
- **Mood:** Professional, trustworthy, modern

### luxury-brand
- **Colors:** #1A1A1A, #C9A96E, #FAFAF5 (black + gold + cream)
- **Style:** Elegant high-end photography, rich textures, deep contrast
- **Typography:** Thin elegant serif, generous letter-spacing
- **Mood:** Exclusive, sophisticated, aspirational

### editorial-magazine
- **Colors:** #000000, #FFFFFF, #FF3B30 (black + white + accent red)
- **Style:** Bold editorial photography, strong geometric composition
- **Typography:** Condensed all-caps sans-serif headlines
- **Mood:** Bold, provocative, contemporary

## How Presets Merge into Reasoning Brief

When a preset is active, Claude uses its values as defaults for the Reasoning Brief:
1. **Colors** → inform palette descriptions in Context and Style components
2. **Style** → becomes the base for the Style component
3. **Typography** → used for any text rendering
4. **Lighting** → becomes the base for the Lighting component
5. **Mood** → influences Action and Context components

User instructions always override preset values. If a user says "make it dark"
but the preset has bright lighting, follow the user's instruction.

## Managing Presets

```bash
# List presets
presets.py list

# Show details
presets.py show tech-saas

# Create interactively (Claude fills in details from conversation)
presets.py create NAME --colors "#hex,#hex" --style "..." --mood "..."

# Delete
presets.py delete NAME --confirm
```
