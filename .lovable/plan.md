

## Plan: Build Event Detail Pages at `/events/:eventId`

### Key corrections confirmed
- Query the **`centennial_events`** table directly (not the `upcoming_events` view)
- Links use `event.id` which maps to the `event_id` text slug column (via `transformEvent`)
- Route parameter is `:eventId` matching the `event_id` column

### Changes

**1. New file: `src/pages/EventDetailPage.tsx`**
- Fetch from `centennial_events` table via `@/lib/supabase` where `event_id = :eventId`
- Fetch 3 nearby events in the same state (excluding current)
- Display: H1 title, smart date range, location/venue, full state name, category badge, full description, highlight badge, Guinness badge + note, CTA button to `official_url`
- Nearby events section linking to `/events/{event_id}`
- SEO via React Helmet: title, meta description (155 chars), canonical, og:type="event", robots index/follow
- 404: render existing NotFound if no match
- Design: match AttractionPage — Playfair headings, cream background, 2px borders, offset shadows

**2. Update `src/App.tsx`**
- Add lazy import for `EventDetailPage`
- Add route `/events/:eventId` after `/events` and before the `/:stateSlug` catch-all

**3. Update `src/components/CentennialEventsCalendar/components/EventCard.tsx`**
- Wrap card in `<Link to={`/events/${event.id}`}>` (event.id = event_id slug)
- Remove onClick modal trigger

**4. Update `src/components/CentennialEventsCalendar/components/FeaturedEvents.tsx`**
- Same: featured cards link to `/events/${event.id}` instead of onClick

**5. Update `src/components/CentennialEventsCalendar/index.tsx`**
- Remove modal state (`selectedEvent`, `isModalOpen`, handlers)
- Remove `EventModal` import
- Pass no `onEventClick` to child components

**6. Update `src/hooks/useCentennialEvents.ts`**
- Change `.from('upcoming_events')` to `.from('centennial_events')` for the listing query too (fixing the source of truth)

### No database changes required

