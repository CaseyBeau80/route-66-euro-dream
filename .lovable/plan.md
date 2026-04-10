

## Updated Plan: Switch state pages to canonical categories

No changes to the overall approach — just two refinements folded in.

### Refinement 1: Null-safe dedup filter
In `src/hooks/useStateData.ts`, the dedup filter will use:
```ts
const key = (item.name?.trim().toLowerCase()) ?? '';
```
This prevents a crash if a future record has a null name.

### Refinement 2: Import path confirmed
`getAttractionDetailPath` is exported from `src/types/attractionDetail.ts` (line 26). The import in `StatePage.tsx` will be:
```ts
import { getAttractionDetailPath } from '@/types/attractionDetail';
```

### Full change list (unchanged from prior plan)

**1. `src/types/attractionDetail.ts`** — Add `category_canonical?: string | null` to `AttractionData`.

**2. `src/hooks/useStateData.ts`**
- Add `category_canonical: d.category_canonical` to all three `.map()` blocks.
- Change merge order to attractions → native_american_sites → hidden_gems.
- Add null-safe dedup: `(item.name?.trim().toLowerCase()) ?? ''`.

**3. `src/pages/StatePage.tsx`**
- Define `CANONICAL_CATEGORIES` constant (10 entries, fixed order).
- Replace `reduce` grouping + `Object.entries().map()` render with: iterate canonical list, filter by `category_canonical`, skip empty.
- Fix card links: `getAttractionDetailPath(item.source_table, item.slug)` (import confirmed at `@/types/attractionDetail`).
- Items with `category_canonical === null` silently excluded.

### Files touched: 3
### What's untouched: Homepage, BrowseByStateGrid, /explore, map, all other routes.

