

# Add State Icon Badges to Event Cards — BlogPostContent.tsx

## Changes (single file)

### 1. Insert constants and helpers after imports (after line 9, before line 11)

Add `ROUTE66_STATES` map, `StateTag` component, and `parseStates` helper — exactly as specified.

### 2. Add state parsing inside MarkdownBlock (after line 58)

```ts
const states = useMemo(() => isEventCard ? parseStates(content) : [], [content, isEventCard]);
```

### 3. Update MarkdownBlock return (lines 60–138)

Keep the outer card div (lines 61–63) unchanged. Inside it, conditionally wrap the interior:

- **When `isEventCard && states.length > 0`**: wrap in `<div className="flex flex-row gap-3">` with:
  - Left column: `<div className="shrink-0 flex flex-col items-center gap-1">` with `StateTag` per state
  - Right column: `<div className="min-w-0 flex-1">` containing the existing prose div (lines 65–124) and videos div (lines 126–137)
- **Otherwise**: render interior exactly as before (no wrapping div)

The outer card div with `border-l-4 border-route66-rust` is unchanged in all cases.

