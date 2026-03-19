

## Plan: SEO-Friendly Attraction and State Pages

### Overview
Create two new page types: individual attraction detail pages at `/attractions/:slug` and state landing pages at `/illinois`, `/missouri`, etc. Both will fetch data from the external Supabase, include rich SEO metadata (Helmet + JSON-LD), and follow the existing patterns (MainLayout, SocialMetaTags, lazy loading).

### Data Sources
- **Attractions**: Fetched from `attractions`, `hidden_gems`, `drive_ins`, `native_american_sites` tables on the external Supabase (`xbwaphzntaxmdfzfsmvt`)
- **State pages**: Aggregate attractions + waypoints from `route66_waypoints` filtered by state, plus all attraction categories for that state
- Slug generation: `name.toLowerCase().replace(/[^a-z0-9]+/g, '-')` (matching existing city slug pattern)

### Files to Create

**1. `src/pages/AttractionPage.tsx`** — Individual attraction detail page
- Route: `/attractions/:slug`
- Fetches from all 4 attraction tables by matching slug against name
- Displays: hero image, description, location (city/state), map coordinates, website link, tags, nearby attractions
- SEO: Helmet with `<title>`, meta description, canonical URL, Open Graph tags
- JSON-LD: `TouristAttraction` schema with geo, address, description
- Uses MainLayout wrapper

**2. `src/hooks/useAttraction.ts`** — Hook to fetch a single attraction by slug
- Queries all 4 tables in parallel, matches slug, returns first match with category info
- Returns `{ attraction, isLoading, error, nearbyAttractions }`

**3. `src/pages/StatePage.tsx`** — State landing page
- Route: `/:stateSlug` (e.g., `/illinois`, `/oklahoma`)
- Validates slug against the 8 Route 66 states to avoid catching other routes
- Displays: state hero section, list of cities/waypoints in that state, attractions in that state grouped by category
- SEO: Helmet with state-specific title/description, JSON-LD `ItemList` of attractions
- Links to individual `/attractions/:slug` pages and `/city/:citySlug` pages

**4. `src/hooks/useStateData.ts`** — Hook to fetch state-level data
- Fetches waypoints filtered by state abbreviation
- Fetches attractions/hidden_gems/drive_ins/native_american_sites filtered by state
- Returns `{ cities, attractions, isLoading }`

**5. `src/data/route66States.ts`** — Static state metadata
- Maps slug → state name, abbreviation, description, hero image
- 8 entries: Illinois, Missouri, Kansas, Oklahoma, Texas, New Mexico, Arizona, California
- Used for validation (so `/:stateSlug` doesn't catch `/about`, `/blog`, etc.)

### Files to Modify

**6. `src/App.tsx`** — Add new lazy routes
- Add `LazyAttractionPage` at `/attractions/:slug`
- Add `LazyStatePage` with explicit routes for each state: `/illinois`, `/missouri`, `/oklahoma`, `/texas`, `/new-mexico`, `/arizona`, `/california`, `/kansas`
- Place state routes AFTER all existing named routes but BEFORE the `*` catch-all

**7. `src/components/NavigationBar/constants/navigationConfig.ts`** — Optional
- Could add an "Explore" or "States" dropdown; will skip unless requested to keep nav clean

**8. `src/pages/SitemapXmlPage.tsx`** — Add new URLs
- Include `/attractions/:slug` entries for known attractions
- Include state page URLs

### Page Design Details

**Attraction Page** (`/attractions/cadillac-ranch`):
- Hero section with image (or fallback), name, city/state badge
- Description paragraph
- Info cards: coordinates, website link, category badge, tags
- "Nearby Attractions" section (same state, limited to 4)
- CTA to trip planner
- Breadcrumb: Home > State > Attraction Name

**State Page** (`/oklahoma`):
- Hero with state name, Route 66 mile count, brief description
- "Cities Along Route 66" grid linking to `/city/:slug`
- "Attractions" grid grouped by category, linking to `/attractions/:slug`
- State-specific fun facts or highlights

### SEO Implementation
- Each page gets unique `<title>`, `<meta name="description">`, canonical URL via `SocialMetaTags`
- JSON-LD structured data: `TouristAttraction` for attraction pages, `ItemList` for state pages
- Open Graph and Twitter Card meta tags for social sharing

### Technical Notes
- All new pages lazy-loaded via `React.lazy()` for code splitting
- Data fetched from external Supabase client (`src/lib/supabase.ts`), not Lovable Cloud
- State route validation prevents conflicts with existing routes like `/about`, `/blog`

