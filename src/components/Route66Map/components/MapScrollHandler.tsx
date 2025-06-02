
import React, { useEffect, useRef } from 'react';

interface MapScrollHandlerProps {
  map: google.maps.Map | null;
  containerRef: React.RefObject<HTMLDivElement>;
  setShowScrollHint: (show: boolean) => void;
}

// Simplified scroll handler that doesn't interfere with Google Maps default zoom
const MapScrollHandler: React.FC<MapScrollHandlerProps> = ({
  map,
  containerRef,
  setShowScrollHint
}) => {
  console.log('🔄 MapScrollHandler: Using simplified scroll handling - Google Maps handles zoom natively');
  
  // No custom scroll handling needed - Google Maps handles it automatically
  // when scrollwheel: true is set in map options
  
  return null;
};

export default MapScrollHandler;
