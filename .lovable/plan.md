

# StoryMap-Style Interactive Page for Route 66 Centennial

## Overview
Create an immersive `/storymap` page with scroll-driven narrative, Google Map animations, before/after historical image sliders, and centennial event highlights — styled with a cinematic Ken Burns documentary tone.

## New Files to Create

### 1. Data file: `src/data/storyMapData.ts`
- Per-state narration text (Ken Burns style), before/after image URLs, Street View coordinates
- Chapter definitions with titles, narration prose, and associated coordinates
- Cover text and CTA content

### 2. Page: `src/pages/StoryMapPage.tsx`
- Wraps content in `MainLayout`
- Composes all StoryMap chapter components in scroll order
- SEO metadata via Helmet

### 3. Components (`src/components/StoryMap/`)

| Component | Purpose |
|---|---|
| `StoryMapCover.tsx` | Full-screen parallax hero with title, subtitle, scroll-down indicator |
| `StoryMapChapter.tsx` | Reusable section: cinematic narration (italic serif), media slot (image/map/slider) |
| `StoryMapNavDots.tsx` | Fixed side dots indicating current chapter via Intersection Observer |
| `StoryMapScrollMap.tsx` | Google Map panel that pans/zooms per chapter using existing `useGoogleMaps` hook + `@react-google-maps/api` |
| `StoryMapBeforeAfter.tsx` | Before/after image slider using `img-comparison-slider` package (new dependency) |
| `StoryMapEventHighlights.tsx` | Grid of centennial events from `useCentennialEvents` hook |
| `StoryMapCTA.tsx` | Closing call-to-action with links to interactive map and events calendar |

### 4. Routing & Navigation
- Add lazy route `const LazyStoryMapPage = lazy(...)` in `App.tsx` at path `/storymap`
- Add "StoryMap" link to `navigationConfig.ts` (using `Map` or `BookOpen` icon)

## Key Technical Details

- **New dependency**: `img-comparison-slider` for the before/after sliders
- **Google Maps API key**: Reuse existing `VITE_GOOGLE_MAPS_API_KEY` env var for Street View Static API URLs
- **Scroll animations**: Framer Motion `useInView` triggers chapter transitions and map pan/zoom
- **Before images**: Loaded from Supabase storage bucket `storymap` (9 historical B&W photos listed in the plan)
- **After images**: Google Street View Static API with coordinates per state
- **Styling**: Dark cinematic sections (`bg-gray-950 text-white`) alternating with light; narration in `font-serif italic`; full-bleed images with overlays
- **Data reuse**: `timelineData.ts` milestones, `route66States` descriptions, `route66Towns` coordinates, `useCentennialEvents` hook
- **Mobile**: Responsive layout, touch-friendly slider, nav dots hidden on small screens
- **No database changes needed**

## Storage Bucket Prerequisite
A Supabase storage bucket named `storymap` needs to be created with the 9 historical photos uploaded. The before/after feature depends on these images being available.

