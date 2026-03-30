

## Plan: Fix map gesture handling on mobile

### Change
In `src/components/Route66Map/hooks/useMapInitialization.ts`, change the mobile gesture handling from `'greedy'` to `'cooperative'`.

Currently (line 37):
```ts
const gestureHandling = isMobile ? 'greedy' : 'cooperative';
```

Updated:
```ts
const gestureHandling = 'cooperative';
```

This makes Google Maps require two-finger gestures to pan/zoom on mobile, allowing single-finger swipes to scroll the page normally. Google Maps automatically shows a "Use two fingers to move the map" prompt.

### Files
- `src/components/Route66Map/hooks/useMapInitialization.ts` — one line change

