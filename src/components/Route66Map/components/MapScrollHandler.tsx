
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

    console.log('🔄 MapScrollHandler: Setting up scroll event handling with NATIVE Google Maps zoom');

    const mapContainer = containerRef.current;
    let hintTimeout: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      // Check if the scroll is happening over the map
      const target = e.target as HTMLElement;
      const isOverMap = mapContainer.contains(target);
      
      if (!isOverMap) return;

      // Allow ALL wheel events on the map - let Google Maps handle zoom natively
      console.log('🔍 Wheel event on map - allowing Google Maps to handle zoom');
      
      // Don't prevent default - let Google Maps handle the zoom
      // This enables native mouse wheel zoom
      return;
    };

    // Add wheel event listener with passive: true to not interfere with Google Maps
    mapContainer.addEventListener('wheel', handleWheel, { passive: true });

    // Cleanup
    return () => {
      console.log('🧹 MapScrollHandler: Cleaning up scroll handlers');
      mapContainer.removeEventListener('wheel', handleWheel);
      if (hintTimeout) {
        clearTimeout(hintTimeout);
      }
    };
  }, [map, containerRef, setShowScrollHint]);

  return null;
};

export default MapScrollHandler;
