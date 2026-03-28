

## Plan: Add Structured Event Field Rendering

**File:** `src/components/Blog/BlogPostContent.tsx`

### Changes

**1. Add `parseEventFields` helper** (after `extractAndRenderYouTube`, before `MarkdownBlock` — around line 87)

Parses content for lines matching `**{emoji} Label:** value` pattern. Returns `{ before, fields[], after }` or `null`.

**2. Add `eventFields` memo inside `MarkdownBlock`** (after line 90)

```ts
const eventFields = useMemo(() => isEventCard ? parseEventFields(content) : null, [content, isEventCard]);
```

**3. Update `MarkdownBlock` return** (lines 171–189)

Inside the card's content area (the `<div className="min-w-0 flex-1">` on line 181, and the fallback on line 186), conditionally render:

- If `eventFields` is not null: render `before` as ReactMarkdown prose, then structured field rows (`div.mb-4.divide-y` with flex rows: label in `text-route66-rust text-sm font-bold w-24 shrink-0`, value in `text-route66-brown text-sm flex-1`), then `after` as ReactMarkdown prose, then videos.
- If `eventFields` is null: render `proseAndVideos` exactly as before.

The outer card div, border-l-4 alternating colors, and state icon column are unchanged.

### Summary

One file changed. No routing, SEO, or other component changes. The existing prose components/config are reused for before/after sections.

