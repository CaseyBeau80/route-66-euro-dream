
import React, { useState } from 'react';
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

  const toggleMobileExpand = () => {
    setMobileExpanded(prev => !prev);
  };

  // Mobile: tap to toggle between 400px and full-screen
  // Desktop: use existing isMapExpanded logic
  const heightClass = isMobile
    ? mobileExpanded
      ? 'fixed inset-0 z-[9999] h-screen w-screen'
      : 'h-[400px]'
    : isMapExpanded
      ? 'h-[900px]'
      : 'h-[750px]';

  return (
    <div className="relative">
      <div 
        className={`
          transition-all duration-500 ease-in-out overflow-hidden
          ${isMobile && mobileExpanded ? heightClass : `${heightClass} rounded-2xl`}
        `}
      >
        <div className={`relative h-full bg-white border-2 border-route66-border shadow-2xl overflow-hidden ${isMobile && mobileExpanded ? '' : 'rounded-2xl'}`}>
          <Route66Map />
          {isMobile && (
            <button
              onClick={toggleMobileExpand}
              className="absolute top-3 right-3 z-[10000] bg-[#2C2C2C] text-white p-2 rounded-sm border-2 border-route66-border shadow-[2px_2px_0_rgba(0,0,0,0.3)]"
              aria-label={mobileExpanded ? 'Minimize map' : 'Expand map'}
            >
              {mobileExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapDisplay;
