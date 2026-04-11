

## Plan: Shared `AttractionJsonLd` Component

### Problem
Both `AttractionPage.tsx` and `NativeHeritagePage.tsx` have inline JSON-LD blocks that are inconsistent — they emit null address fields, `sameAs` as a string instead of array, and omit `keywords`/`touristType`. No hidden gems page exists separately (they use `AttractionPage`).

### Changes

**1. New file: `src/components/seo/AttractionJsonLd.tsx`**
- Accepts the props from the prompt (`name`, `description`, `imageUrl`, `url`, `city`, `state`, `latitude`, `longitude`, `website`, `tags`, `touristType`)
- Builds a clean JSON-LD object with strict null filtering:
  - `address` omitted entirely if no city AND no state
  - `geo` omitted unless both lat/lng are numbers
  - `sameAs` as single-element array, omitted if no website
  - `keywords` as comma-separated string from tags, omitted if empty
  - `touristType` omitted if not provided
- Renders via `<Helmet><script type="application/ld+json">`

**2. Edit: `src/pages/AttractionPage.tsx`**
- Remove the inline `jsonLd` object and its `<script>` tag from the Helmet block
- Add `<AttractionJsonLd>` alongside existing Helmet, passing attraction fields
- `url` uses the existing `canonicalUrl` which already handles `hidden_gems` vs `attractions` base path
- No `touristType` prop (omitted = default behavior)

**3. Edit: `src/pages/NativeHeritagePage.tsx`**
- Remove the inline `jsonLd` object and its `<script>` tag
- Add `<AttractionJsonLd>` with `touristType="Cultural heritage site"`
- Everything else on the page stays identical

### Files touched
- `src/components/seo/AttractionJsonLd.tsx` — new (~45 lines)
- `src/pages/AttractionPage.tsx` — remove inline JSON-LD, add component
- `src/pages/NativeHeritagePage.tsx` — remove inline JSON-LD, add component

