

## Plan: Fix event card date display and countdown logic

### Problem
1. Event cards show only `date_display` (e.g., "10-Mar-26") even for multi-day events — misleading when paired with "Happening now"
2. Countdown badges use `Math.round` which can produce unintuitive results
3. Past events should be hidden by default but accessible via month filter

### Changes

**1. `src/components/CentennialEventsCalendar/utils/eventCalendarHelpers.ts`**

- Add a new `formatSmartDateDisplay` helper that:
  - If `dateEnd` exists and differs from `dateStart`, formats as `"10-Mar-26 → 11-Dec-26"` (d-MMM-yy format)
  - If `dateEnd` equals `dateStart` or is null, returns the existing `dateDisplay` as-is
- Update `getCountdownText` week bucketing to use floor-based ranges: 1–7 days = "In 1 week", 8–14 = "In 2 weeks", 15–21 = "In 3 weeks", 22–28 = "In 4 weeks", 29+ = month-based
- Update `getSmartCountdownText` to also return "Past" when `dateEnd` (or `dateStart` if no end) is before today

**2. `src/components/CentennialEventsCalendar/components/EventCard.tsx`**

- Import `formatSmartDateDisplay`
- Replace `{event.dateDisplay}` on line 95 with `{formatSmartDateDisplay(event)}`
- Skip rendering past events (when countdown === "Past") — though this is already handled by the filter hook

**3. `src/components/CentennialEventsCalendar/components/FeaturedEvents.tsx`**

- Import `formatSmartDateDisplay`
- Replace line 195 (`event.dateDisplay || formatDateRange(...)`) with `formatSmartDateDisplay(event)`

**4. `src/components/CentennialEventsCalendar/hooks/useEventFilters.ts`** — no changes needed; `isUpcomingOrCurrentEvent` already filters out past events using `dateEnd || dateStart`.

### No database changes required

