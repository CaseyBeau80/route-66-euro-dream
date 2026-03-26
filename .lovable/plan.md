

# Fix Phantom Sitemap URLs, NotFound Canonical, and Blog Domain

Four files, targeted edits only.

## 1. `src/utils/sitemapGenerator.ts`

- **Line 55**: Remove `{ loc: '/events', ... }` from static routes array
- **Lines 16–22**: Remove `sanitizeEventId` function (no longer needed)
- **Lines 92–100**: Remove `addEventRoutes` method
- **Lines 102–107**: Remove `addNativeSiteRoutes` method
- **Lines 142, 143**: Remove `eventIds` and `nativeSiteSlugs` from `SitemapData` interface
- **Lines 153–154**: Remove the two corresponding calls in `generateSitemapFile`

## 2. `src/pages/SitemapXmlPage.tsx`

- **Line 15**: Remove `supabase.from('centennial_events').select('event_id')` from `Promise.all`
- **Lines 18–22**: Remove the `native_american_sites` query block
- **Lines 28–29**: Remove `eventIds` and `nativeSiteSlugs` from the object passed to `generateSitemapFile`

## 3. `src/pages/NotFound.tsx`

- **Line 18–22**: Remove `path="/"` from `SocialMetaTags` so no canonical tag is emitted
- Add `<meta name="robots" content="noindex, nofollow" />` inside the `SocialMetaTags` or via a separate `<Helmet>` to explicitly tell Google not to index 404 pages

Note on HTTP status: This is a client-side SPA — the server always returns HTTP 200. A true 404 status requires server-side configuration (e.g., Netlify `_redirects` or Cloudflare rules). Adding `noindex` is the best we can do at the app level and is the standard SPA approach.

## 4. `src/pages/BlogPostPage.tsx`

Four `ramble66.lovable.app` → `ramble66.com` replacements:
- **Line 51**: JSON-LD author image URL
- **Line 58**: JSON-LD publisher logo URL
- **Line 63**: JSON-LD mainEntityOfPage `@id`
- **Line 73**: `<link rel="canonical">` href
- **Line 79**: `og:url` content

(Five replacements total — line 79 was also `lovable.app`.)

## Summary

- 4 files edited
- Removes all phantom `/events/*` and `/native-sites/*` sitemap URLs
- Stops NotFound from claiming to be the homepage via canonical
- Fixes blog post domain to production `ramble66.com`

