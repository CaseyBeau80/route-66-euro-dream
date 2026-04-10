

## Plan: Add Native Heritage Detail Route

### Problem
Clicking a Native American Heritage card on state pages goes to `/attractions/undefined` because `getAttractionDetailPath` doesn't handle `native_american_sites` — it falls through to `/attractions/${slug}`.

### Changes

**1. Update `getAttractionDetailPath` in `src/types/attractionDetail.ts`**
Add a case for `native_american_sites` returning `/native-heritage/${slug}`.

**2. Register new route in `src/App.tsx`**
Add `<Route path="/native-heritage/:slug">` above the state catch-all route, lazy-loading a new `NativeHeritagePage` component.

**3. Create `src/pages/NativeHeritagePage.tsx`**
New detail page modeled on `AttractionPage.tsx` with the same visual structure (hero, breadcrumb, description, info grid, tags, back link, not-found state). Key differences:
- Fetches from `native_american_sites` table by slug
- Shows **Tribal Nation** and **Site Type** in the info grid instead of admission/hours
- SEO title: `${name} — Route 66 Native American Heritage | Ramble 66`
- Not-found message: "Heritage Site Not Found — This stop along the Mother Road doesn't exist — yet."
- Fetches nearby native sites for the "Nearby Stops" section

**4. No changes needed to `useStateData` or `StatePage`**
The merged list already sets `source_table: 'native_american_sites'` and passes it to `getAttractionDetailPath` — fixing that function (step 1) is all that's needed for the state page links.

### Files touched
- `src/types/attractionDetail.ts` — one-line edit
- `src/App.tsx` — add route + lazy import
- `src/pages/NativeHeritagePage.tsx` — new file (~180 lines)

