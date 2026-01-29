
## Fix Chronological Sorting with DRY Helper Function

### Summary
Implement proper chronological sorting for the Centennial Events calendar using a reusable `compareDates` helper function that leverages `safeParseDate` for consistent cross-browser date parsing.

---

### Changes Overview

**File:** `src/components/CentennialEventsCalendar/hooks/useEventFilters.ts`

#### 1. Add DRY Helper Function (after line 4)

Create a reusable date comparison helper that encapsulates all parsing and edge-case logic:

```typescript
/**
 * Helper for consistent date comparison using safeParseDate.
 * Avoids inconsistent browser parsing and timezone issues.
 * Invalid dates are pushed to the end of sorted lists.
 */
const compareDates = (aDate: string, bDate: string): number => {
  const dateA = safeParseDate(aDate);
  const dateB = safeParseDate(bDate);
  if (!dateA && !dateB) return 0;  // Both invalid: keep relative order
  if (!dateA) return 1;             // Push invalid A to end
  if (!dateB) return -1;            // Push invalid B to end
  return dateA.getTime() - dateB.getTime();
};
```

#### 2. Simplify sortEvents Function (lines 43-57)

Use the helper and simplify the switch structure since default = date sort:

```typescript
// Sort events - default is chronological (soonest first)
const sortEvents = useCallback((eventsToSort: CentennialEvent[]): CentennialEvent[] => {
  return [...eventsToSort].sort((a, b) => {
    switch (sortType) {
      case 'state':
        return a.state.localeCompare(b.state);
      case 'category':
        return a.category.localeCompare(b.category);
      case 'date':
      default:
        // Date sort is the default behavior
        return compareDates(a.dateStart, b.dateStart);
    }
  });
}, [sortType]);
```

#### 3. Update highlightedEvents Sorting (lines 88-93)

Replace inline sorting with the helper:

```typescript
// Get highlighted/featured events - chronological sort (soonest first)
const highlightedEvents = useMemo(() => {
  return upcomingEvents
    .filter(e => e.isHighlight)
    .sort((a, b) => compareDates(a.dateStart, b.dateStart));
}, [upcomingEvents]);
```

---

### Technical Details

| Aspect | Before | After |
|--------|--------|-------|
| Date parsing | `new Date(string)` - inconsistent | `safeParseDate()` - reliable |
| Code duplication | 3 identical blocks | 1 reusable helper |
| Invalid date handling | Unpredictable | Pushed to end of list |
| Switch default case | Duplicated date logic | Falls through to 'date' |

---

### Testing Checklist

After implementation, verify:

1. **Chronological order**: Events display soonest-first (April before May before July)
2. **Invalid dates**: Any event with unparseable `dateStart` appears at the end of the list
3. **Featured carousel**: Highlighted events also display in correct chronological order
4. **Filter combinations**: Sorting remains correct when state/month/category filters are applied
5. **Cross-browser**: Dates render correctly in Chrome, Safari, Firefox
