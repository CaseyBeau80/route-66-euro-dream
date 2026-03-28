

## Plan: Alternating Light/Dark Event Card Backgrounds

**File:** `src/components/Blog/BlogPostContent.tsx`

### 1. StateTag — add `isDark` prop (lines 22–36)

Change signature to `({ abbr, isDark }: { abbr: string; isDark?: boolean })`. When `isDark`:
- Text: `text-route66-primary` → `text-[#F5F0E8]`
- Icon style: replace the sepia/hue-rotate filter with `filter: 'brightness(0) invert(1)'`

### 2. Add `isDark` flag in MarkdownBlock (after line 109)

```tsx
const isDark = isEventCard && index % 2 !== 0;
```

### 3. Replace outer card div styling (lines 184–187)

Remove `border-l-4` and alternating border colors. Use:
- `isDark` false: `bg-[#FAFAF7] rounded-lg shadow-sm p-5 md:p-6 my-6`
- `isDark` true: `bg-[#2C1810] rounded-lg shadow-sm p-5 md:p-6 my-6`

### 4. Make `proseClasses` dynamic (line 114)

Split into light/dark variants based on `isDark`:
- Light: existing classes unchanged
- Dark: swap to `prose-headings:text-white prose-p:text-[#F5F0E8] prose-a:text-[#E8C27A] prose-strong:text-white prose-em:text-[#F5F0E8]`

### 5. Field label/value colors (lines 201–202)

- Label: `text-route66-rust` → `text-[#E8C27A]` when dark
- Value: `text-route66-brown` → `text-[#F5F0E8]` when dark

### 6. Separator border (line 208)

- Light: `border-route66-sand/40`
- Dark: `border-[#E8C27A]/30`

### 7. Pass `isDark` to StateTag

Both render sites (lines 193, 217): `<StateTag key={abbr} abbr={abbr} isDark={isDark} />`

**Summary:** One file, ~30 lines changed.

