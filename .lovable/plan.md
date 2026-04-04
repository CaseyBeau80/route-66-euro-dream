

## Plan: Fix blog content link colors on dark backgrounds

### Problem
Links inside dark event cards (the alternating dark blue `bg-[#1B2A4A]` cards in digest-style posts) may not be readable. The current `#6BABDB` color is set but could be overridden by global CSS `!important` rules. The user wants white or near-white link text on dark backgrounds with clear hover states.

### Changes

**File: `src/components/Blog/BlogPostContent.tsx`**

1. Change the dark-mode link color from `#6BABDB` to `#FFFFFF` (white) in two places:
   - Line 115: Update `prose-a:text-[#6BABDB]` → `prose-a:text-white` in the `proseClasses` string
   - Line 117: Update `linkColor` from `text-[#6BABDB]` → `text-white`

2. Add hover styling for dark-mode links: `hover:prose-a:text-[#C9D6E8]` (a soft light blue/gray) to the prose classes, and update the inline link components (lines 124, 127) to use a hover color that shifts slightly lighter/underlined.

3. The light-mode link styles (`text-route66-primary`) remain unchanged.

### Files touched
- `src/components/Blog/BlogPostContent.tsx` (link color values on ~3 lines)

