

## Plan: Switch to `upcoming_events` view and fix event status badges

### What changes

1. **`src/hooks/useCentennialEvents.ts`** — Change the query from `centennial_events` table to `upcoming_events` view. Add `event_status` to the `DatabaseEvent` interface and pass it through to the `CentennialEvent` type as `eventStatus`.

2. **`src/data/centennialEventsData.ts`** — Add `eventStatus?: 'upcoming' | 'happening_now'` to the `CentennialEvent` interface.

3. **`src/components/CentennialEventsCalendar/components/EventCard.tsx`** — Replace the countdown badge logic:
   - If `event.eventStatus === 'happening_now'` → green badge saying "Happening now"
   - If `event.eventStatus === 'upcoming'` → existing relative countdown (e.g. "In 2 weeks")
   - Remove the old fallback that could show future countdowns for past-start events

4. **`src/components/CentennialEventsCalendar/components/FeaturedEvents.tsx`** — Update the `FeaturedEventCard` countdown badge with the same `eventStatus`-based logic so featured cards also show correct status.

### Why this works

The `upcoming_events` view already filters out past events server-side, so no client-side date filtering is needed. The `event_status` field provides a reliable server-computed status, eliminating timezone/parsing edge cases where a "happening now" multi-day event incorrectly shows a future countdown.

### Files touched
- `src/data/centennialEventsData.ts` (add `eventStatus` to interface)
- `src/hooks/useCentennialEvents.ts` (query `upcoming_events`, map `event_status`)
- `src/components/CentennialEventsCalendar/components/EventCard.tsx` (badge logic)
- `src/components/CentennialEventsCalendar/components/FeaturedEvents.tsx` (badge logic)

