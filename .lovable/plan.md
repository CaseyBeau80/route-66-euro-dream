

## Plan: Hard-code mobile map center instead of fitBounds

**Problem**: The `fitBounds` call in `useRouteManager.ts` keeps centering the map too far north for the 400px compact mobile view, clipping Southwest attractions regardless of padding tweaks.

**Solution**: On mobile, skip `fitBounds` entirely and set a hard-coded center and zoom.

### Changes

**File: `src/components/Route66Map/hooks/useRouteManager.ts`** (lines 77-109)

Replace the entire fitBounds + bounds extension + setTimeout zoom block with:

```ts
if (isMobile) {
  // Hard-code mobile view to show full Route 66 corridor in 400px compact view
  map.setCenter({ lat: 36.5, lng: -105 });
  map.setZoom(4);
} else {
  const bounds = new google.maps.LatLngBounds();
  smoothPath.forEach(point => bounds.extend(point));
  map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });

  setTimeout(() => {
    const currentZoom = map.getZoom() || 5;
    map.setZoom(Math.max(4, currentZoom - 1));
  }, 1000);
}
```

This removes all the bounds-extension hacks and asymmetrical padding for mobile, replacing them with a single deterministic center/zoom that reliably shows the full corridor.

