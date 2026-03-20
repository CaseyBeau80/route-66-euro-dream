
import { useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import MainLayout from '@/components/MainLayout';
import StoryMapCover from '@/components/StoryMap/StoryMapCover';
import StoryMapChapter from '@/components/StoryMap/StoryMapChapter';
import StoryMapBeforeAfter from '@/components/StoryMap/StoryMapBeforeAfter';
import StoryMapScrollMap from '@/components/StoryMap/StoryMapScrollMap';
import StoryMapNavDots from '@/components/StoryMap/StoryMapNavDots';
import StoryMapEventHighlights from '@/components/StoryMap/StoryMapEventHighlights';
import StoryMapCTA from '@/components/StoryMap/StoryMapCTA';
import { storyMapChapters } from '@/data/storyMapData';

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const buildStreetViewUrl = (lat: number, lng: number) =>
  `https://maps.googleapis.com/maps/api/streetview?size=900x506&location=${lat},${lng}&fov=90&key=${GOOGLE_MAPS_KEY}`;

const StoryMapPage = () => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [mapCenter, setMapCenter] = useState(storyMapChapters[0].coordinates);
  const [mapZoom, setMapZoom] = useState(storyMapChapters[0].zoom);

  const handleChapterInView = useCallback((index: number) => {
    setActiveChapterIndex(index);
    setMapCenter(storyMapChapters[index].coordinates);
    setMapZoom(storyMapChapters[index].zoom);
  }, []);

  // JSON-LD structured data
  const jsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '100 Years of the Mother Road — Route 66 Centennial StoryMap',
    description: 'An immersive scroll-driven narrative exploring Route 66 history from 1926 to the 2026 Centennial.',
    datePublished: '2025-01-01',
    author: { '@type': 'Organization', name: 'Ramble 66' },
  }), []);

  return (
    <>
      <Helmet>
        <title>Route 66 StoryMap — 100 Years of the Mother Road | Ramble 66</title>
        <meta
          name="description"
          content="An immersive, scroll-driven narrative exploring the history of Route 66 from 1926 to the 2026 Centennial — through eight states, before-and-after photos, and interactive maps."
        />
        <meta property="og:title" content="Route 66 StoryMap — 100 Years of the Mother Road" />
        <meta property="og:description" content="Scroll through a century of the Mother Road. Eight states. 2,448 miles. One unforgettable story." />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <MainLayout>
        {/* Nav dots - desktop only */}
        <StoryMapNavDots
          chapters={storyMapChapters}
          activeIndex={activeChapterIndex}
        />

        {/* Cover */}
        <StoryMapCover />

        {/* Chapters */}
        {storyMapChapters.map((chapter, i) => {
          const hasBeforeAfter = chapter.streetViewCoords && chapter.beforeImage && GOOGLE_MAPS_KEY;

          return (
            <StoryMapChapter
              key={chapter.id}
              chapter={chapter}
              index={i}
              totalChapters={storyMapChapters.length}
              onInView={() => handleChapterInView(i)}
            >
              {hasBeforeAfter ? (
                <StoryMapBeforeAfter
                  beforeImage={chapter.beforeImage!}
                  afterImage={buildStreetViewUrl(
                    chapter.streetViewCoords!.lat,
                    chapter.streetViewCoords!.lng
                  )}
                />
              ) : chapter.beforeImage ? (
                <div className="relative">
                  <div
                    className="overflow-hidden rounded-sm border-2 border-solid border-[#6B4C38]"
                    style={{ boxShadow: '6px 6px 0 rgba(0,0,0,0.35)' }}
                  >
                    <img
                      src={chapter.beforeImage}
                      alt={chapter.title}
                      className="aspect-[3/2] w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className={`mt-3 font-['Special_Elite'] text-[10px] uppercase tracking-[0.2em] ${
                    chapter.theme === 'dark' ? 'text-white/25' : 'text-[#3D2B1F]/25'
                  }`}>
                    Historical photograph · Route 66 Archives
                  </div>
                </div>
              ) : null}
            </StoryMapChapter>
          );
        })}

        {/* Floating map panel */}
        <div
          className="pointer-events-none fixed bottom-6 left-6 z-40 hidden h-44 w-64 overflow-hidden rounded-sm border-2 border-solid border-[#6B4C38]/60 xl:block"
          style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.4)' }}
        >
          <div className="pointer-events-auto h-full w-full">
            <StoryMapScrollMap center={mapCenter} zoom={mapZoom} />
          </div>
          {/* Map label */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
            <span className="font-['Special_Elite'] text-[8px] uppercase tracking-[0.2em] text-white/50">
              Your position on the Mother Road
            </span>
          </div>
        </div>

        {/* Centennial events */}
        <StoryMapEventHighlights />

        {/* CTA */}
        <StoryMapCTA />
      </MainLayout>
    </>
  );
};

export default StoryMapPage;
