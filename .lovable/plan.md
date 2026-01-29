

## Align SEO Meta Descriptions with BenefitsRow Terminology

### Overview
Update all SEO meta descriptions and UI section headers across the site to use consistent terminology that matches the **BenefitsRow** component (the source of truth at the top of the homepage).

---

### Source of Truth: BenefitsRow Copy

| Feature | Title | Subtitle |
|---------|-------|----------|
| Map | **Interactive Route 66 Google Map** | Explore attractions, destinations, and hidden gems with interactive filtering |
| Planner | **Shareable Travel Planner** | Build custom Route 66 trips and share them with friends |
| Social | **Social Media & More** | Instagram integration and community features for travelers |
| Events | **Route 66 Events Calendar** | Discover centennial celebrations, festivals, and car shows across all 8 states |
| Blog | **Route 66 Blog & News** | Centennial updates, local stories, and what's happening along the Mother Road |

---

### Files to Update

#### 1. Static HTML SEO Fallback (What Google Crawls First)
**File:** `index.html` (line 238)

| Current | Updated |
|---------|---------|
| `Plan your ultimate Route 66 road trip with Ramble 66: interactive maps, must-see stops, and shareable itineraries.` | `Plan your ultimate Route 66 road trip with Ramble 66: Interactive Route 66 Google Map, Shareable Travel Planner, Route 66 Events Calendar, and Route 66 Blog & News.` |

---

#### 2. React Helmet Default Description
**File:** `src/components/shared/SocialMetaTags.tsx` (line 26)

| Current | Updated |
|---------|---------|
| `Plan and share your ultimate Route 66 road trip with our interactive map and shareable travel planner...` | `Plan and share your ultimate Route 66 road trip with our Interactive Route 66 Google Map and Shareable Travel Planner. Discover hidden gems, classic diners, retro motels, and iconic attractions along America's Mother Road.` |

**Also update keywords (line 60):** Add `Interactive Route 66 Google Map, Shareable Travel Planner, Route 66 Events Calendar, Route 66 Blog & News` to the keyword list.

---

#### 3. Homepage Description Prop
**File:** `src/pages/Index.tsx` (line 28)

| Current | Updated |
|---------|---------|
| `Plan your ultimate Route 66 road trip with our interactive map and comprehensive guide...` | `Plan your ultimate Route 66 road trip with our Interactive Route 66 Google Map and Shareable Travel Planner. Discover hidden gems, classic diners, retro motels, and iconic attractions.` |

---

#### 4. Trip Planner Page SEO
**File:** `src/pages/Route66Planner.tsx` (lines 33-34)

| Element | Current | Updated |
|---------|---------|---------|
| Title | `Route 66 Travel Planner – Ramble 66` | `Shareable Travel Planner – Ramble 66` |
| Description | `Plan your perfect Route 66 journey with destination cities, attractions, and day-by-day itineraries.` | `Shareable Travel Planner: Build custom Route 66 trips and share them with friends and family. Plan your perfect journey with destination cities and day-by-day itineraries.` |

---

#### 5. Blog Page SEO
**File:** `src/pages/BlogPage.tsx` (lines 13-17)

| Element | Current | Updated |
|---------|---------|---------|
| Title | `Route 66 Blog \| Ramble66 - Stories from the Mother Road` | `Route 66 Blog & News \| Ramble 66` |
| Description | `Explore Route 66 stories, travel tips, hidden gems, and road trip guides...` | `Route 66 Blog & News: Centennial updates, local stories, and what's happening along the Mother Road. Get inspired for your Route 66 adventure.` |
| Canonical | `ramble66.lovable.app/blog` | `ramble66.com/blog` |

---

#### 6. About Page SEO
**File:** `src/pages/AboutPage.tsx` (lines 11-13)

| Element | Current | Updated |
|---------|---------|---------|
| Description | `Learn about Ramble 66—your Route 66 trip planner. We help travelers discover hidden gems...` | `About Ramble 66: Your one-stop shop for Interactive Route 66 Google Map, Shareable Travel Planner, Route 66 Events Calendar, and Route 66 Blog & News.` |

---

### UI Section Headers to Update

#### 7. Map Section Header
**File:** `src/components/InteractiveMap/InteractiveMapSection.tsx` (lines 14-18)

| Element | Current | Updated |
|---------|---------|---------|
| H2 | `Explore Route 66 with Our Interactive Map` | `Interactive Route 66 Google Map` |
| Subtitle | `Navigate America's most iconic highway with our interactive map featuring historic towns, attractions, and hidden gems along the Mother Road` | `Explore attractions, destinations, and hidden gems with interactive filtering` |

---

#### 8. Map Banner Title
**File:** `src/components/Route66Map/components/BannerContent.tsx` (line 25)

| Current | Updated |
|---------|---------|
| `ROUTE 66 INTERACTIVE MAP` | `INTERACTIVE ROUTE 66 GOOGLE MAP` |

---

#### 9. Map Content Data (Multi-language)
**File:** `src/components/InteractiveMap/data/mapContent.ts` (line 6)

| Language | Current | Updated |
|----------|---------|---------|
| English | `Explore Route 66 Google Map` | `Interactive Route 66 Google Map` |
| German | `Erkunde Route 66 Google Map` | `Interaktive Route 66 Google Map` |
| French | `Explorez Route 66 Google Map` | `Route 66 Google Map Interactive` |
| Portuguese | `Explore Route 66 Google Map` | `Mapa Interativo Google da Rota 66` |

---

#### 10. Trip Planner Section Header
**File:** `src/components/TripPlannerSection.tsx` (lines 12-16)

| Element | Current | Updated |
|---------|---------|---------|
| H2 | `Plan Your Custom Route 66 Trip` | `Shareable Travel Planner` |
| Subtitle | `Create your perfect Route 66 adventure with our intelligent trip planner featuring time estimates, budget calculations, and must-see destinations` | `Build custom Route 66 trips and share them with friends and family` |

---

#### 11. Events Calendar Section Header
**File:** `src/components/CentennialEventsCalendar/index.tsx` (lines 84-91)

| Element | Current | Updated |
|---------|---------|---------|
| H2 | `Route 66 Turns 100! 🎉` | `Route 66 Events Calendar` |
| Subtitle | `Year-long celebrations across all 8 states! Plan ahead for parades, festivals, car shows, and more along the Mother Road.` | `Discover centennial celebrations, festivals, and car shows across all 8 states` |

**Note:** The "Route 66 Turns 100!" celebration messaging moves to the badge above the header (already exists).

---

### Summary Table

| File | Change Type | Priority |
|------|-------------|----------|
| `index.html` | SEO - Static fallback | High (Google crawlers) |
| `SocialMetaTags.tsx` | SEO - React Helmet defaults | High |
| `Index.tsx` | SEO - Homepage description | High |
| `Route66Planner.tsx` | SEO - Planner page | Medium |
| `BlogPage.tsx` | SEO - Blog page + canonical fix | Medium |
| `AboutPage.tsx` | SEO - About page | Medium |
| `InteractiveMapSection.tsx` | UI - Section header | Medium |
| `BannerContent.tsx` | UI - Map banner | Medium |
| `mapContent.ts` | UI - Multi-language content | Low |
| `TripPlannerSection.tsx` | UI - Section header | Medium |
| `CentennialEventsCalendar/index.tsx` | UI - Section header | Medium |

---

### Technical Details

| Aspect | Details |
|--------|---------|
| Files modified | 11 |
| SEO impact | High - aligns meta descriptions with visible site content |
| Google re-index | May take days/weeks for search snippets to update |
| Breaking changes | None |
| Multi-language | `mapContent.ts` updates require translations for DE, FR, PT-BR |

---

### Testing Checklist

After implementation:
1. Verify Google Search snippet aligns with new meta description (note: re-indexing takes time)
2. All section headers on homepage use consistent BenefitsRow naming
3. Map banner displays "INTERACTIVE ROUTE 66 GOOGLE MAP"
4. Trip planner header shows "Shareable Travel Planner"
5. Events calendar header shows "Route 66 Events Calendar"
6. Blog page shows "Route 66 Blog & News" in title
7. Check that canonical URLs use `ramble66.com` (not `lovable.app`)

