
import { useState, useCallback } from 'react';
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

  return (
    <>
      <Helmet>
        <title>Route 66 StoryMap — 100 Years of the Mother Road | Ramble 66</title>
        <meta
          name="description"
          content="An immersive, scroll-driven narrative exploring the history of Route 66 from 1926 to the 2026 Centennial — through eight states, before-and-after photos, and interactive maps."
        />
      </Helmet>

      <MainLayout>
        {/* Nav dots */}
        <StoryMapNavDots
          chapters={storyMapChapters}
          activeIndex={activeChapterIndex}
        />

        {/* Cover */}
        <StoryMapCover />

        {/* Chapters with alternating layouts */}
        {storyMapChapters.map((chapter, i) => {
          // State chapters (index >= 2) get before/after sliders
          const hasBeforeAfter = chapter.streetViewCoords && chapter.beforeImage && GOOGLE_MAPS_KEY;

          return (
            <StoryMapChapter
              key={chapter.id}
              chapter={chapter}
              index={i}
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
                <div
                  className="overflow-hidden rounded-sm border-2 border-solid border-[#6B4C38]"
                  style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.3)' }}
                >
                  <img
                    src={chapter.beforeImage}
                    alt={chapter.title}
                    className="aspect-video w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : null}
            </StoryMapChapter>
          );
        })}

        {/* Floating map panel - visible on desktop */}
        <div className="pointer-events-none fixed bottom-4 right-4 z-40 hidden h-48 w-72 overflow-hidden rounded-sm border-2 border-solid border-[#6B4C38] lg:block"
          style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.4)' }}
        >
          <div className="pointer-events-auto h-full w-full">
            <StoryMapScrollMap center={mapCenter} zoom={mapZoom} />
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
