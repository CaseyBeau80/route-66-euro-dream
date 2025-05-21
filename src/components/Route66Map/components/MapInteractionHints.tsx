
import React from 'react';

interface MapInteractionHintsProps {
  isDragging: boolean;
}

const MapInteractionHints: React.FC<MapInteractionHintsProps> = ({ isDragging }) => {
  return (
    <>
      {/* Mobile touch indicator - only shows briefly when dragging */}
      {isDragging && (
        <div className="absolute top-4 right-4 z-10 bg-white/80 text-xs px-2 py-1 rounded-full shadow-md md:hidden">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Moving map
          </span>
        </div>
      )}
      
      {/* Touch instructions hint for mobile */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white/80 text-xs px-3 py-1.5 rounded-full shadow-md md:hidden">
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
          Drag with finger to move map
        </span>
      </div>
    </>
  );
};

export default MapInteractionHints;
