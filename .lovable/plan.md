

## Plan: Add Nearby Stops Section to NativeHeritagePage

### What Changes

**Single file edit: `src/pages/NativeHeritagePage.tsx`**

**1. Add state for nearby stops**
- Add a `nearbyStops` state array holding cards with `name`, `slug`, `image_url`, `city_name`, and `source_table`

**2. Fetch nearby stops after main site loads**
- In a second `useEffect` (triggered when `site` is set), run three parallel queries against the same state:
  1. `native_american_sites` — up to 3, excluding current site
  2. `attractions` — up to 4
  3. `hidden_gems` — up to 4
- Merge results: native sites first, then attractions, then hidden gems — preserving thematic continuity
- Slice to 3 total cards
- If fewer than 2 total, set `nearbyStops` to empty array (section will be hidden)

**3. Render the section**
- After the tags block, render a "Nearby Stops" section (only if `nearbyStops.length >= 2`)
- Each card links via `getAttractionDetailPath(item.source_table, item.slug)`
- Card style matches the state page cards: image, name, city — using the project's border/shadow conventions

### Ordering guarantee
```
[ ...nativeSites, ...attractions, ...hiddenGems ].slice(0, 3)
```
Native heritage cards always appear first. Fallback cards from attractions/hidden_gems only fill remaining slots.

### No other files touched
- Routing, `useStateData`, `StatePage`, and `getAttractionDetailPath` are all unchanged

