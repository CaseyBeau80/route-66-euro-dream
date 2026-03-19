

## Fix Broken Sitemap URLs — Sanitize Slugs and Event IDs

### Problem
1. **Event IDs with spaces** (e.g., "Route 66 UltraRun", "Andy Payne") produce invalid XML URLs
2. **Garbage attraction slugs** (e.g., an image URL saved as a slug) pollute the sitemap
3. No validation exists — any string from the database goes straight into the sitemap

### Plan

#### 1. Add a slug validation/sanitization utility to `src/utils/sitemapGenerator.ts`

Add two helper functions:

- **`isValidSlug(value)`** — returns `false` if the string contains spaces, starts with `http`, or has non-URL-safe characters. This filters out garbage entries entirely.
- **`sanitizeForUrl(value)`** — for event IDs that have spaces but are otherwise legitimate, URL-encode them (replace spaces with `%20` or convert to a hyphenated slug).

#### 2. Apply filtering in each `add*Routes` method

- **`addAttractionRoutes`** and **`addHiddenGemRoutes`**, **`addBlogRoutes`**, **`addNativeSiteRoutes`**: Skip any slug that fails `isValidSlug()` (contains spaces, starts with `http`, has special characters beyond hyphens/alphanumerics).
- **`addEventRoutes`**: URL-encode the event ID so spaces become `%20`, but also skip entries that look like garbage (e.g., start with `http`).

#### 3. Apply the same filtering in `vite.config.ts` (build-time) and `SitemapXmlPage.tsx` (client-side)

Filter the arrays returned from the database before passing them to `generateSitemapFile()`:
```
attractionSlugs: attractions.map(r => r.slug).filter(isValidSlug)
eventIds: events.map(r => r.event_id).filter(s => !s.startsWith('http'))
```

#### 4. XML-escape the `<loc>` values in `generateXML()`

Encode `&`, `<`, `>`, `'`, `"` in all URL values to produce valid XML, as a safety net.

### Validation rules (summary)

| Check | Action |
|---|---|
| Contains spaces | URL-encode for events, skip for slugs |
| Starts with `http` | Skip entirely |
| Contains `?`, `#`, `&` | Skip entirely |
| Length > 200 chars | Skip entirely |

### Files Modified
- `src/utils/sitemapGenerator.ts` — add validation helpers + apply in all route methods + XML-escape in `generateXML()`
- `vite.config.ts` — filter slugs before passing to generator
- `src/pages/SitemapXmlPage.tsx` — filter slugs before passing to generator

