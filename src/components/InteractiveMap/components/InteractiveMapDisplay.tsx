
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import Route66Map from '../../Route66Map';

interface InteractiveMapDisplayProps {
  isMapExpanded: boolean;
  onToggleExpanded: () => void;
}

const InteractiveMapDisplay: React.FC<InteractiveMapDisplayProps> = ({
  isMapExpanded,
  onToggleExpanded
}) => {
  const isMobile = useIsMobile();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  useEffect(() => {
    if (!isMobile) return;

    const originalOverflow = document.body.style.overflow;

    if (mobileExpanded) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobile, mobileExpanded]);

  const toggleMobileExpand = () => {
    setMobileExpanded((prev) => !prev);
  };

  const desktopHeightClass = isMapExpanded ? 'h-[900px]' : 'h-[750px]';

  const mapFrame = (fullscreen: boolean) => (
    <div className={`relative h-full bg-route66-background border-2 border-route66-border overflow-hidden pointer-events-auto ${fullscreen ? 'rounded-none' : 'rounded-2xl shadow-2xl'}`}>
      <Route66Map />
      {isMobile && (
        <button
          onClick={toggleMobileExpand}
          className="absolute top-3 right-3 z-[10000] bg-route66-primary text-white p-2 rounded-sm border-2 border-route66-border shadow-xl"
          aria-label={mobileExpanded ? 'Minimize map' : 'Expand map'}
        >
          {mobileExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      )}
    </div>
  );

  return (
    <div className="relative">
      {(!isMobile || !mobileExpanded) && (
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${isMobile ? 'h-[400px] rounded-2xl' : `${desktopHeightClass} rounded-2xl`}`}
        >
          {mapFrame(false)}
        </div>
      )}

      {isMobile && mobileExpanded && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[2147483647] isolate bg-route66-background pointer-events-none">
          <div className="h-full w-full">
            {mapFrame(true)}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default InteractiveMapDisplay;
