

## Plan: Fix archive blog card layout

### Problem
The non-featured archive cards use a horizontal layout (`flex-row`) with a fixed `w-48` (192px) image. When the blog grid renders these in a 2- or 3-column grid, each card is only ~350px wide, leaving barely ~160px for the text content. This causes the title, date, tags, and excerpt to wrap awkwardly and look cramped — exactly what the screenshot shows.

### Fix
Switch the non-featured cards to a **vertical/stacked layout** (image on top, content below) — the same pattern as the featured card but smaller. This works cleanly at every grid width.

### Changes

**`src/components/Blog/BlogCard.tsx`** — rewrite the non-featured card block (lines 132–209):
- Remove `flex flex-row` and `w-48 shrink-0`
- Use a stacked layout: image in an `aspect-[3/2]` container on top, content below in a padded `div`
- Keep all existing content (metadata, title, excerpt, tags, footer) unchanged
- This matches how the featured card is structured, just with a smaller image ratio and tighter spacing

### No other files change
`BlogGrid.tsx` already renders these in a responsive grid — that's fine as-is.

