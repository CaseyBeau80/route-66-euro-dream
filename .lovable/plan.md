

## Plan: Fix stale skeleton flash on page refresh

### Problem
The `index.html` contains a large static "loading skeleton" (lines 41–184 critical CSS + lines 468–536 HTML) that renders an **old** hero layout: split-screen grid with "RAMBLE 66" heading, three blue text paragraphs, and the Big Bo mascot image. The current React hero is a full-width video section. On refresh, users see this old layout for ~200ms before React hydrates and replaces it.

### Fix

**Single file edit: `index.html`**

1. **Replace the skeleton HTML** (lines 468–526) with a simple full-width dark placeholder that matches the current video hero's visual weight — a dark background block at the same aspect ratio with a centered spinner. No text, no mascot image, no grid layout.

2. **Strip the stale critical CSS** (lines 41–184 and 267–464) that styles the old hero layout (`lcp-hero-container`, `lcp-hero-image`, `lcp-text-immediate`, `hero-section`, `hero-container`, `hero-title`, `hero-subtitle`, `hero-image-container`, `fcp-title`, `fcp-subtitle`, `critical-button`). Replace with minimal CSS for the new skeleton: dark background, centered spinner, matching aspect ratio.

3. **Remove the LCP image preload** (line 35) for the mascot PNG — the current hero loads a video, not that image.

4. **Remove the desktop grid media query** (lines 530–536) since the new skeleton won't use a two-column grid.

5. **Keep** the skeleton hide logic (lines 541–570), font loading scripts, and all other `<head>` content (analytics, preconnects, meta tags, redirects) unchanged.

### New skeleton shape (approximate)
```html
<div id="loading-skeleton" style="
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  max-height: 85vh;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
">
  <div class="fcp-loading"></div>
</div>
```

### Files touched
- `index.html` — replace skeleton HTML + prune stale CSS

