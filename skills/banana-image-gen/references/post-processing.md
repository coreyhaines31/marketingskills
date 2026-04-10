# Post-Processing Pipeline Reference

> Load this on-demand when the user needs image manipulation after generation.

## Prerequisites

Check availability before using:
```bash
which magick    # ImageMagick 7 (preferred)
which convert   # ImageMagick 6 (fallback)
which ffmpeg    # For video/animation
```

Install ImageMagick if not present: `sudo apt install imagemagick` (Debian/Ubuntu) or `brew install imagemagick` (macOS).

## Common Operations

### Resize for Platforms

```bash
# Instagram post (1080x1080)
magick input.png -resize 1080x1080^ -gravity center -extent 1080x1080 instagram.png

# Twitter/X header (1500x500)
magick input.png -resize 1500x500^ -gravity center -extent 1500x500 twitter-header.png

# YouTube thumbnail (1280x720)
magick input.png -resize 1280x720^ -gravity center -extent 1280x720 youtube-thumb.png

# LinkedIn banner (1584x396)
magick input.png -resize 1584x396^ -gravity center -extent 1584x396 linkedin-banner.png

# Favicon (multi-size ICO)
magick input.png -resize 32x32 favicon.ico
```

### Background Removal (Transparency)

```bash
# Remove solid white background
magick input.png -fuzz 10% -transparent white output.png

# Remove solid color background (specify color)
magick input.png -fuzz 15% -transparent "#F0F0F0" output.png

# Clean edges after transparency (anti-alias)
magick input.png -fuzz 10% -transparent white -channel A -blur 0x1 -level 50%,100% output.png

# Auto-crop transparent padding
magick input.png -trim +repage output.png
```

### Format Conversion

```bash
# PNG to WebP (web-optimized, smaller file)
magick input.png -quality 85 output.webp

# PNG to JPEG (with white background for transparency)
magick input.png -background white -flatten -quality 90 output.jpg

# PNG to AVIF (modern, smallest size)
magick input.png -quality 80 output.avif

# SVG trace (for logos -- requires potrace)
potrace input.pbm -s -o output.svg
```

### Color Adjustments

```bash
# Increase contrast
magick input.png -contrast-stretch 2%x1% output.png

# Warm color temperature
magick input.png -modulate 100,110,105 output.png

# Cool color temperature
magick input.png -modulate 100,90,95 output.png

# Desaturate (muted colors)
magick input.png -modulate 100,70,100 output.png

# Convert to grayscale
magick input.png -colorspace Gray output.png

# Sepia tone
magick input.png -sepia-tone 80% output.png
```

### Compositing

```bash
# Overlay watermark (bottom-right, 20% opacity)
magick base.png watermark.png -gravity southeast -geometry +20+20 \
  -compose dissolve -define compose:args=20 -composite output.png

# Side-by-side comparison
magick input1.png input2.png +append comparison.png

# Vertical stack
magick input1.png input2.png -append stack.png

# Add padding/border
magick input.png -bordercolor white -border 40 output.png

# Add rounded corners
magick input.png \( +clone -alpha extract -draw \
  "roundrectangle 0,0,%[fx:w-1],%[fx:h-1],20,20" \) \
  -alpha off -compose CopyOpacity -composite rounded.png
```

### Batch Processing

```bash
# Resize all PNGs in directory
for f in ~/Documents/nanobanana_generated/*.png; do
  magick "$f" -resize 800x800 "${f%.png}_thumb.png"
done

# Convert all to WebP
for f in ~/Documents/nanobanana_generated/*.png; do
  magick "$f" -quality 85 "${f%.png}.webp"
done
```

## Animation (GIF/Video from Multiple Frames)

```bash
# Create GIF from multiple images
magick -delay 100 frame1.png frame2.png frame3.png animation.gif

# Create MP4 from image sequence
ffmpeg -framerate 1 -pattern_type glob -i '*.png' \
  -c:v libx264 -pix_fmt yuv420p slideshow.mp4
```

## Note on 4K Output

With Gemini 3.1 Flash's `imageSize: "4K"` option (up to 4096×4096), many traditional
upscaling post-processing steps are no longer necessary. If your target platform accepts
images at or below 4K resolution, generate at native 4K instead of generating at 1K
and upscaling. This produces better detail and avoids upscaling artifacts.

## Green Screen Transparency Pipeline

Gemini cannot generate transparent backgrounds. Use this workaround:

### 1. Generate with green screen prompt

Append to any prompt:
```
on a solid bright green (#00FF00) chroma key background
with a thin white outline separating the subject from the background
```

### 2. Remove green screen (ImageMagick)

```bash
magick input.png -fuzz 20% -transparent "#00FF00" output.png
```

### 3. Clean edges + trim (ImageMagick)

```bash
magick output.png -channel A -blur 0x1 -level 50%,100% -trim +repage final.png
```

### 4. Alternative (FFmpeg, better for batch)

```bash
ffmpeg -i input.png -vf "colorkey=0x00FF00:0.3:0.1,despill=type=green" -pix_fmt rgba output.png
```

### Tips
- `-fuzz 20%` handles slight color variations at edges; increase to 25% for softer edges
- The white outline in the prompt helps prevent color spill on subject edges
- For batch processing, the FFmpeg approach is faster and handles despill automatically
- Always verify edges after conversion -- may need manual touchup for hair/fur

## Quality Assessment

```bash
# Get image dimensions and info
magick identify -verbose input.png | head -20

# Check file size
ls -lh input.png

# Get exact pixel dimensions
magick identify -format "%wx%h" input.png
```
