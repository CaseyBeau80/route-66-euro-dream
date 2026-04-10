

## Fix BrowseByStateGrid: Routing + Images

### Two changes, two files

**1. `src/App.tsx` (lines 198-207)**
Replace the 8 static state routes with one dynamic route:
```tsx
{/* STATE PAGES: catch-all for state slugs. */}
{/* WARNING: Any new top-level route must be declared ABOVE this line. */}
<Route path="/:stateSlug" element={
  <Suspense fallback={<RouteLoadingFallback />}>
    <LazyStatePage />
  </Suspense>
} />
```
Placed immediately before the `*` catch-all. `StatePage` already validates against `stateSlugMap` and redirects invalid slugs to `/404`.

**2. `src/components/HomePageTeasers/BrowseByStateGrid.tsx`**
- Replace `stateData` array with the 8 user-provided Unsplash URLs (already optimized, no transforms needed).
- Replace `<PictureOptimized>` with a plain `<img>` tag using `loading="lazy"`, `decoding="async"`, and `alt={`Route 66 through ${name}`}` — avoids any risk of `PictureOptimized` wrapping in unnecessary `<picture>`/`<source>` tags for external URLs.
- Keep the existing card visual structure unchanged (state name, abbreviation badge, blurb text, layout). Only the image `src` and the `<Link to>` destination change.

### Verification checklist
1. Click all 8 state cards → no 404s
2. All 8 images render (no alt-text fallback)
3. Type `/illinois` directly → works
4. `/blog`, `/explore`, `/events`, `/planner`, `/faq`, `/trivia`, `/about`, `/contact` all still work
5. `/some-random-slug` → 404 (slug validation works)

