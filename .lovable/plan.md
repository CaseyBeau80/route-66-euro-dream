

## Plan: Clean up EventsTeaser modal remnants

### What and why
`EventsTeaser.tsx` still imports `EventModal`, maintains modal state, and passes an `onClick` handler — all dead code since event cards now navigate to `/events/:eventId` via `<Link>`.

### Changes to `src/components/HomePageTeasers/EventsTeaser.tsx`

1. Remove imports: `EventModal`, `CentennialEvent` type
2. Remove state: `selectedEvent`, `isModalOpen`
3. Remove `handleEventClick` function
4. Remove `onClick={handleEventClick}` prop from `<EventCard>`
5. Remove `<EventModal ... />` at the bottom of the JSX

No other files affected.

