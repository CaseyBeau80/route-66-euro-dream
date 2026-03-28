

## Plan: Event Card Layout Refinements

**File:** `src/components/Blog/BlogPostContent.tsx`

### 1. Shrink state icon (lines 26–30)
- Container: `w-12` → `w-10`
- Image: `w-10 h-10` → `w-8 h-8`

### 2. Tighten label column (line 182)
- `w-28` → `w-20`

### 3. Restructure event card layout when `eventFields` is not null (lines 176–195, 202–213)

Currently, when `eventFields` exists, the icon sits beside ALL content (title + fields + after). Restructure so the icon only sits beside the title.

Replace the `proseAndVideos` variable and the card return to produce this structure when `eventFields` is not null:

```tsx
{/* Title row: icon + title side by side */}
<div className="flex items-center gap-3">
  <div className="shrink-0 flex flex-col items-center gap-1">
    {states.map(abbr => <StateTag key={abbr} abbr={abbr} />)}
  </div>
  {eventFields.before && renderMarkdown(eventFields.before)}
</div>
{/* Fields below, full width */}
<div className="mb-4 flex flex-col gap-2">
  {eventFields.fields.map(...with w-20...)}
</div>
{/* More info with separator */}
{eventFields.after && (
  <div className="mt-4 pt-3 border-t border-route66-sand/40">
    {renderMarkdown(eventFields.after)}
  </div>
)}
{videosBlock}
```

For the non-eventFields case, keep existing layout (icon beside all content) unchanged.

### Summary
- 4 targeted changes in one file
- ~25 lines modified

