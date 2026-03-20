
import { useEffect, useRef } from 'react';
import 'img-comparison-slider/dist/styles.css';

interface StoryMapBeforeAfterProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const StoryMapBeforeAfter = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Then',
  afterLabel = 'Now',
}: StoryMapBeforeAfterProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('img-comparison-slider').catch(() => {});
  }, []);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="mx-auto max-w-[900px] overflow-hidden rounded-sm border-2 border-solid border-[#6B4C38]"
        style={{ boxShadow: '6px 6px 0 rgba(0,0,0,0.35)' }}
      >
        {/* @ts-ignore - web component */}
        <img-comparison-slider class="w-full" style={{ '--default-handle-width': '3px', '--default-handle-color': '#C9932A' } as React.CSSProperties}>
          <figure slot="first" className="m-0" style={{ margin: 0 }}>
            <img
              src={beforeImage}
              alt={beforeLabel}
              className="aspect-[3/2] w-full object-cover"
              style={{ filter: 'grayscale(0.85) sepia(0.25) contrast(1.1)' }}
            />
            <figcaption
              className="absolute bottom-4 left-4 rounded-sm border border-[#6B4C38] bg-[#2C2C2C]/90 px-3 py-1.5 font-['Special_Elite'] text-[10px] uppercase tracking-[0.2em] text-white/80"
              style={{ boxShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}
            >
              {beforeLabel}
            </figcaption>
          </figure>
          <figure slot="second" className="m-0" style={{ margin: 0 }}>
            <img
              src={afterImage}
              alt={afterLabel}
              className="aspect-[3/2] w-full object-cover"
            />
            <figcaption
              className="absolute bottom-4 right-4 rounded-sm border border-[#6B4C38] bg-[#2C2C2C]/90 px-3 py-1.5 font-['Special_Elite'] text-[10px] uppercase tracking-[0.2em] text-white/80"
              style={{ boxShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}
            >
              {afterLabel}
            </figcaption>
          </figure>
        {/* @ts-ignore */}
        </img-comparison-slider>
      </div>

      {/* Photo caption */}
      <div className="mt-3 text-center font-['Special_Elite'] text-[10px] uppercase tracking-[0.2em] text-white/25">
        Drag to compare · Historical vs. Present Day
      </div>
    </div>
  );
};

export default StoryMapBeforeAfter;
