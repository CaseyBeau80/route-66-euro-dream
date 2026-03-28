

# Blog Card Layout Improvements

**File:** `src/components/Blog/BlogCard.tsx`

## Changes

### 1. Image fallback with placeholder
- Add `imgError` state. On `<img onError>`, set it true.
- When `!featuredImageUrl || imgError`, render a `bg-route66-brown` div with a small inline SVG Route 66 shield centered inside, instead of the `<img>`.

### 2. Horizontal layout (non-featured cards)
- Change card to `flex flex-row` with image area fixed at `w-48 min-h-[9rem]` (h-36) and content as `flex-1`.
- Remove the overlay and title-on-image pattern for non-featured cards — title moves into the content area.
- Featured cards keep the current vertical/large layout.

### 3. Metadata row cleanup
- Already uses `text-sm text-route66-brown/50` and `font-medium` — just ensure author has `font-medium` (not bold) and stays on one line with `· ` separator.

### 4. Title sizing
- Non-featured: `text-lg font-semibold line-clamp-2` (down from text-xl).

### 5. Excerpt
- Show excerpt on all cards (not just featured), with `line-clamp-2 text-sm text-route66-brown/60`.

### 6. Tags styling
- `text-xs bg-route66-sand/40 rounded-full px-2 py-0.5 gap-1.5`.

### 7. "Read Story →" bottom-aligned
- Content div uses `flex flex-col justify-between` so footer always sits at the bottom.

### Technical detail
- The non-featured card becomes a horizontal card (`flex flex-row`), image on left, content on right with flex-col justify-between.
- Featured card keeps current vertical stacked layout with overlay title.
- One `useState<boolean>` added for image error tracking.

