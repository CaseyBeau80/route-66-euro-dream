

## Updated Plan: Home Page Simplification

All three user concerns are addressed:
- **Rollback**: Lovable's built-in version history provides one-click revert to any prior message. No manual branching needed.
- **Carousel independence**: Confirmed — `UnifiedRoute66Carousel` is fully self-contained (own hook, own state, only takes `className`). Safe to relocate.
- **SEO meta tags**: Every new page gets unique `<SocialMetaTags>` with distinct title + description.

---

### Changes by file

#### 6 new page files

**`src/pages/ExplorePage.tsx`**
- `<MainLayout>` → `<SocialMetaTags title="Explore Route 66 — All 240 Attractions & Hidden Gems" description="Browse the complete directory of Route 66 stops..." path="/explore" />` → H1 + intro paragraph → `<UnifiedRoute66Carousel />`

**`src/pages/EventsPage.tsx`**
- `<SocialMetaTags title="2026 Route 66 Centennial Events Calendar" description="Find every event celebrating Route 66's 100th anniversary..." path="/events" />` → `<CentennialEventsCalendar />`

**`src/pages/PlannerPage.tsx`**
- `<SocialMetaTags title="Route 66 Trip Planner — Build & Share Your Road Trip" description="Plan your Route 66 journey..." path="/planner" />` → `<TripPlannerSection />`

**`src/pages/PhotoWallPage.tsx`**
- `<SocialMetaTags title="Route 66 Photo Wall — Share Your Road Trip Photos" path="/photo-wall" />` → Photo Wall components from SocialSection

**`src/pages/FAQPage.tsx`**
- `<SocialMetaTags title="Route 66 FAQ — Common Questions Answered" path="/faq" includeFaqSchema={true} />` → `<FAQAccordion />`

**`src/pages/TriviaPage.tsx`**
- `<SocialMetaTags title="Route 66 Trivia Game — Test Your Mother Road Knowledge" path="/trivia" />` → `<FunSection />`

#### 4 new teaser components (`src/components/HomePageTeasers/`)

**`EventsTeaser.tsx`** — "2026 Centennial Events" heading, 3 featured event cards, "See all events →" link to `/events`

**`FeaturedStopsTeaser.tsx`** — "Featured Stops" heading, 6-8 cards (query where `featured=true`, limit 8), "Browse all 240 stops →" link to `/explore`

**`PhotoWallTeaser.tsx`** — "Join the Photo Wall" heading, 3-4 recent thumbnails, "View the Photo Wall →" link to `/photo-wall`

**`BrowseByStateGrid.tsx`** — "Explore Route 66 by State" heading, 8 state cards (IL→CA), responsive grid (4/2/1 columns), links to existing `/illinois` etc.

#### `src/pages/Index.tsx` — slim down

New structure (top to bottom):
1. Hero + countdown (unchanged)
2. Interactive Map (unchanged)
3. `<EventsTeaser />`
4. `<BrowseByStateGrid />`
5. `<FeaturedStopsTeaser />`
6. `<PhotoWallTeaser />`
7. `<BackToTopButton />`

Remove: full Events Calendar, Trip Planner, full Directory, full Social Section, FAQ, Trivia, Toll Roads sections. Move `includeFaqSchema` off homepage `SocialMetaTags` (it moves to FAQPage).

#### `src/App.tsx` — add 6 lazy routes

```
/explore    → LazyExplorePage
/events     → LazyEventsPage
/planner    → LazyPlannerPage
/photo-wall → LazyPhotoWallPage
/faq        → LazyFAQPage
/trivia     → LazyTriviaPage
```

Before the `*` catch-all. No changes to existing routes or the 19 hidden-gems redirects.

#### `src/components/NavigationBar/constants/navigationConfig.ts`

Updated nav: Home | Explore | Events | Planner | Blog | About | Contact (7 items)

#### `src/components/Footer.tsx`

- Add Instagram 4-thumbnail strip ("#Ramble66 on Instagram")
- Add footer links to /faq, /trivia, /photo-wall

---

### Files touched (~14)
- `src/App.tsx`
- `src/pages/Index.tsx`
- `src/components/NavigationBar/constants/navigationConfig.ts`
- `src/components/Footer.tsx`
- 6 new page files
- 4 new teaser components

### What stays untouched
- All existing components (relocated, not rewritten)
- All existing routes, redirects, hooks, Supabase queries
- Hero section + Interactive Map on home page
- Visual design system

