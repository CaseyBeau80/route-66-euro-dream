

# Replace Hero Image with Video

## What changes
Replace the static Big Bo hero image with the uploaded video, playing as a looping background video (muted, autoplay). The brand text, CTA button, and countdown badge remain overlaid on top.

## Steps

1. **Copy video to `public/videos/`** — copy `user-uploads://Generated_Video_March_28_2026_-_3_19PM.mp4` to `public/videos/hero-video.mp4`

2. **Update `src/components/Hero/HeroSection.tsx`** — replace the `<img>` tag with a `<video>` element:
   - `autoPlay`, `loop`, `muted`, `playsInline` attributes for seamless background playback
   - Same `absolute inset-0 w-full h-full object-cover` styling
   - Keep the gradient overlay, CTA button, and countdown badge exactly as-is
   - Keep the brand/tagline section above unchanged

