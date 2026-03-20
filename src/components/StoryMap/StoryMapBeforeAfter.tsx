
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
    // Dynamically import the web component
    import('img-comparison-slider').catch(() => {});
  }, []);

  return (
    <div
      ref={containerRef}
      className="mx-auto max-w-[900px] overflow-hidden rounded-sm border-2 border-solid border-[#6B4C38]"
      style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.3)' }}
    >
      {/* @ts-ignore - web component */}
      <img-comparison-slider class="w-full">
        <figure slot="first" className="m-0">
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="aspect-video w-full object-cover"
            style={{ filter: 'grayscale(0.8) sepia(0.2)' }}
          />
          <figcaption className="absolute bottom-3 left-3 rounded-sm bg-black/70 px-3 py-1 font-['Special_Elite'] text-xs text-white">
            {beforeLabel}
          </figcaption>
        </figure>
        <figure slot="second" className="m-0">
          <img
            src={afterImage}
            alt={afterLabel}
            className="aspect-video w-full object-cover"
          />
          <figcaption className="absolute bottom-3 right-3 rounded-sm bg-black/70 px-3 py-1 font-['Special_Elite'] text-xs text-white">
            {afterLabel}
          </figcaption>
        </figure>
      {/* @ts-ignore */}
      </img-comparison-slider>
    </div>
  );
};

export default StoryMapBeforeAfter;
