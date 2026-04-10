

## Plan: Add 19 hidden-gems → attractions redirect routes

### Confirmed: Fallback is safe
`useAttraction` (in `src/hooks/useAttraction.ts`) queries `attractions`, `hidden_gems`, `native_american_sites`, and `drive_ins` via `Promise.all`. The surviving 92 hidden-gem slugs will continue to resolve correctly through the catch-all route.

### Changes

**`src/App.tsx`**

1. Import `Navigate` from `react-router-dom` (already imported: `Routes, Route` — just add `Navigate`)

2. Insert 19 explicit redirect routes **before** the existing `/hidden-gems/:slug` catch-all (line 127). Each uses `<Navigate to="/attractions/..." replace />`:

| From (`/hidden-gems/...`) | To (`/attractions/...`) |
|---|---|
| `arcadia-round-barn` | `arcadia-round-barn` |
| `cars-on-the-route` | `cars-on-the-route` |
| `chain-of-rocks-bridge` | `chain-of-rocks-bridge` |
| `elmers-bottle-tree-ranch` | `elmers-bottle-tree-ranch` |
| `galena-mining-historical-museum` | `galena-mining-historical-museum` |
| `route-66-state-park` | `route-66-state-park` |
| `standin-on-the-corner-park` | `standin-on-the-corner-park` |
| `route-66-association-hall-of-fame-museum` | `route-66-hall-of-fame-museum-pontiac` |
| `route-66-mother-road-museum` | `route-66-mother-road-museum-barstow` |
| `wigwam-motel-san-bernardino` | `wigwam-motel-rialto` |
| `big-texan-steak-ranch` | `the-big-texan-steak-ranch` |
| `leaning-water-tower` | `britten-leaning-water-tower` |
| `roys-motel-and-caf` | `roys-motel-cafe-amboy` |
| `route-66-museum` | `oklahoma-route-66-museum` |
| `odell-station` | `odell-standard-oil-gas-station` |
| `lucilles-historic-highway-gas-station` | `lucilles-service-station` |
| `garys-gay-parita` | `gay-parita-sinclair-gas-station` |
| `pops-soda-ranch` | `pops-arcadia` |
| `amarillo-route-66-historic-district` | `amarillo-sixth-street-route-66` |

3. Keep the existing `/hidden-gems/:slug` catch-all route **after** the 19 explicit routes — it continues to render `LazyAttractionPage` for the remaining hidden-gem slugs.

### Route order (critical)
React Router v6 matches in declaration order. The 19 explicit routes come first so they match before the `:slug` wildcard.

### Files touched
- `src/App.tsx` only

