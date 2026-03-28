

# Hero Section Redesign

## Current Problems
- Too much text: pain points, benefits list, countdown, CTA button all compete for attention
- Two-column layout with Big Bo on the right feels cluttered and doesn't communicate value quickly
- A first-time visitor has to read a wall of text to understand what the site does
- The Big Bo image is confined to a small column

## New Design Concept

### Above the fold (initial view)
A clean, centered hero with Big Bo as the dominant visual:

1. **Full-width Big Bo image** as the hero background/centerpiece — large, proud, unmissable
2. **"RAMBLE 66"** brand name overlaid at top
3. **One-liner value prop**: "Plan Your Route 66 Road Trip — Free" in bold pink/white
4. **Subtitle**: "Along the Mother Road" 
5. **Single CTA button**: "Start Exploring" scrolls to map
6. **Countdown badge** (small, tucked in corner): "XXX Days to the Centennial"

### Below the fold (scroll-reveal section)
As user scrolls past Big Bo, **five feature cards animate in** (staggered fade-in-up), each clickable:

1. Interactive Route 66 Google Map
2. Route 66 Events Calendar  
3. Shareable Travel Planner
4. Social Media & Community
5. Route 66 Blog & News

These replace the current inline checklist and the separate BenefitsRow component. Each card has an icon, title, one-line description, and scrolls/navigates to its section on click.

## Technical Plan

### File: `src/components/Hero/HeroSection.tsx`
- Remove the two-column grid layout
- Make Big Bo the full-width hero image (centered, max-height constrained so it doesn't overwhelm)
- Overlay brand name, value prop, and CTA on top of or just below the image
- Remove the pain points text block entirely
- Keep countdown but make it a small pill/badge, not a large section with cake image
- Remove cake image

### File: `src/components/Hero/HeroFeatures.tsx` (new)
- Five feature cards in a responsive grid (1 col mobile, 3+2 or 5 col desktop)
- Each card: icon, title, subtitle, click handler
- Scroll-triggered stagger animation using IntersectionObserver + CSS transitions
- Cards fade-in-up one by one as the section enters viewport

### File: `src/components/Hero/HeroSection.tsx` (structure)
- Section 1: Big Bo hero (brand + value prop + CTA overlaid)
- Section 2: `<HeroFeatures />` component with animated reveal

### Layout sketch
```text
┌─────────────────────────────────────┐
│          RAMBLE 66                  │
│                                     │
│        [  Big Bo Image  ]           │
│       (full width, centered)        │
│                                     │
│  "Plan Your Route 66 Road Trip"     │
│         [Start Exploring]           │
│      ● 593 Days to Centennial       │
└─────────────────────────────────────┘
         ↓ scroll down ↓
┌─────────────────────────────────────┐
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐    │
│  │Map│ │Cal│ │Plnr│ │Soc│ │Blog│   │
│  └───┘ └───┘ └───┘ └───┘ └───┘    │
│  (animated stagger reveal)          │
└─────────────────────────────────────┘
```

### Animation approach
- Use IntersectionObserver to detect when the features section enters viewport
- Each card gets a CSS class with `opacity-0 translate-y-8` by default
- On intersect, add `opacity-100 translate-y-0 transition-all duration-500` with increasing `delay` (0ms, 100ms, 200ms, 300ms, 400ms)
- Keeps it simple, performant, no extra libraries

### What gets removed
- Pain points text (4 paragraphs)
- Inline benefits checklist (5 items with green checks)
- Cake image + large countdown section
- BenefitsRow component (its functionality moves into HeroFeatures)
- Background SVG pattern
- Decorative blur gradient behind Big Bo

### What stays
- Big Bo image (same file, just displayed larger/full-width)
- Brand name, countdown (simplified)
- All scroll-to-section functionality
- Multilingual content structure (simplified)

