
import React, { useEffect } from 'react';

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
  useEffect(() => {
    if (!map || !containerRef.current) return;

    console.log('🔄 MapScrollHandler: Setting up scroll event handling with DISABLED zoom');

    const mapContainer = containerRef.current;
    let hintTimeout: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      // Check if the scroll is happening over the map
      const target = e.target as HTMLElement;
      const isOverMap = mapContainer.contains(target);
      
      if (!isOverMap) return;

      // PREVENT all wheel events on the map to disable zoom
      console.log('🚫 Wheel event on map - preventing zoom');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };

    // Add wheel event listener with passive: false to allow preventDefault
    mapContainer.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    // Cleanup
    return () => {
      console.log('🧹 MapScrollHandler: Cleaning up scroll handlers');
      mapContainer.removeEventListener('wheel', handleWheel, { capture: true });
      if (hintTimeout) {
        clearTimeout(hintTimeout);
      }
    };
  }, [map, containerRef, setShowScrollHint]);

  return null;
};

export default MapScrollHandler;
