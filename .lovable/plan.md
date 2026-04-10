

## Plan: Fetch State Hero Images from `states` Table

### Problem
State pages show a blank/black hero because `fallbackHero` points to a single hardcoded Unsplash URL that may be dead.

### What Changes

**1. Add a state hero query to `useStateData` hook** (`src/hooks/useStateData.ts`)
- Add a query to `supabase.from('states').select('hero_image_url, hero_alt').eq('code', stateAbbr).maybeSingle()` inside the existing `Promise.all`
- Return `heroImageUrl` and `heroAlt` from the hook alongside existing `cities`, `attractions`, `isLoading`

**2. Update `StatePage.tsx` hero section** (`src/pages/StatePage.tsx`)
- Destructure `heroImageUrl` and `heroAlt` from `useStateData`
- Replace the hardcoded `fallbackHero` Unsplash URL with `heroImageUrl`
- Use `heroAlt` for the img alt attribute, falling back to `Route 66 in ${stateInfo.name}`
- Keep the existing dark overlay/gradient for text contrast
- If `heroImageUrl` is null, render a neutral gradient background (e.g., `bg-gradient-to-br from-[#2C2C2C] to-[#3D2B1F]`) instead of a broken image
- Update the `og:image` meta tag to use `heroImageUrl` when available

### Technical Details
- No new files created — only two existing files modified
- Uses the same external Supabase client (`@/lib/supabase`) already in use
- The `states` table query is added to the existing `Promise.all` so it loads in parallel with attractions data — no extra loading time
- Existing attractions/hidden_gems/native_american_sites merge logic is untouched

