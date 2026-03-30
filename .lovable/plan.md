
Goal: stop mobile map recentering after load while preserving current desktop framing behavior.

What I found
- The main override is in `src/components/Route66Map/components/SingleRouteRenderer.tsx`.
- That component runs after map load and always does:
  - `map.fitBounds(bounds);`
  - then a delayed `map.setZoom(...)` inside `setTimeout`
- Since `GoogleMapsRoute66.tsx` renders `SingleRouteRenderer` on the live Route 66 map, it can override the mobile center/zoom set elsewhere.
- `src/components/InteractiveGoogleMap/InteractiveGoogleMap.tsx` sets map options on load, but it does not call `fitBounds`, `setCenter`, `setZoom`, or `panTo` for position changes.
- I also found other viewport-changing code in unused/alternate Route 66 files (`CleanSingleRoute`, `MapBounds`, helper/services), but based on current usage they are not the active culprit for this screen.

Implementation plan
1. Update `src/components/Route66Map/components/SingleRouteRenderer.tsx`
   - Add `useIsMobile()`.
   - Add explicit diagnostic logs before every viewport mutation:
     - one log for the mobile path that confirms it is preserving `{ lat: 36.5, lng: -105 }` and `zoom 4`
     - one log for desktop-only `fitBounds`
     - one log for desktop-only delayed `setZoom`
   - Wrap `map.fitBounds(...)` and delayed `map.setZoom(...)` in `if (!isMobile)` so they never run on mobile.
   - On mobile, set the desired view once:
     - `map.setCenter({ lat: 36.5, lng: -105 })`
     - `map.setZoom(4)`

2. Keep desktop behavior unchanged
   - Preserve the existing bounds-fit and delayed zoom-out logic exactly for desktop.
   - Do not alter desktop initialization or route rendering behavior.

3. Add “last writer” logging for debugging
   - In `SingleRouteRenderer.tsx`, make the logs unique and searchable so the console clearly shows whether this component is the final viewport mutator.
   - Optionally mirror a corresponding log in `useRouteManager.ts` if that path is still mounted elsewhere, so it’s obvious whether a second route system is also writing to the map.

4. Do a quick code-level cleanup pass
   - Verify no active route on `/` still mounts `NuclearRouteManager` or another bounds-setting renderer alongside `SingleRouteRenderer`.
   - If any active mobile viewport mutation remains in the current homepage map path, wrap it with `!isMobile` too.

Expected result
- Mobile map keeps:
  - center `{ lat: 36.5, lng: -105 }`
  - zoom `4`
- That mobile position is set once and not overridden by route rendering.
- Desktop continues using the existing auto-fit route framing.

Technical details
- Active override found:
  - `src/components/Route66Map/components/SingleRouteRenderer.tsx:139-148`
- Already-correct mobile target exists in:
  - `src/components/Route66Map/hooks/useRouteManager.ts:77-80`
- Current homepage map path:
  - `src/components/Route66Map/GoogleMapsRoute66.tsx`
  - renders `SingleRouteRenderer`, so that file is the priority fix.
