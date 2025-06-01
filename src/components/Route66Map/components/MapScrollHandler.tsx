
import React, { useEffect, useRef } from 'react';
import { useScrollZoom } from '../hooks/useScrollZoom';

interface MapScrollHandlerProps {
  map: google.maps.Map | null;
  containerRef: React.RefObject<HTMLDivElement>;
  setShowScrollHint: (show: boolean) => void;
}

const MapScrollHandler: React.FC<MapScrollHandlerProps> = ({
  map,
  containerRef,
  setShowScrollHint
}) => {
  const { createScrollHandler, cleanup } = useScrollZoom();
  const handlerRef = useRef<((e: WheelEvent) => void) | null>(null);

  useEffect(() => {
    if (!map || !containerRef.current) return;

    const mapDiv = containerRef.current;
    const scrollHandler = createScrollHandler(map, setShowScrollHint);
    handlerRef.current = scrollHandler;

    // Add wheel event listener only to the map container with passive: false
    // This ensures we can prevent default behavior when needed
    mapDiv.addEventListener('wheel', scrollHandler, { passive: false });

    // Also disable the default Google Maps scroll zoom to prevent conflicts
    map.setOptions({ scrollwheel: false });

    // Cleanup function
    const cleanupHandler = () => {
      if (mapDiv && handlerRef.current) {
        mapDiv.removeEventListener('wheel', handlerRef.current);
      }
      cleanup();
    };

    // Store cleanup function on map for later use
    (map as any).__scrollCleanup = cleanupHandler;

    return cleanupHandler;
  }, [map, containerRef, createScrollHandler, setShowScrollHint, cleanup]);

  return null;
};

export default MapScrollHandler;
