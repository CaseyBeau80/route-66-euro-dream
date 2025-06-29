
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

    console.log('🔄 MapScrollHandler: Setting up scroll event handling with Ctrl+scroll enabled');

    const mapContainer = containerRef.current;
    let hintTimeout: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      // Check if the scroll is happening over the map
      const target = e.target as HTMLElement;
      const isOverMap = mapContainer.contains(target);
      
      if (!isOverMap) return;

      // Allow Ctrl + scroll for zoom
      if (e.ctrlKey || e.metaKey) {
        console.log('🎯 Ctrl+scroll detected - allowing zoom');
        return; // Let Google Maps handle the zoom
      }

      // PREVENT regular wheel events (without Ctrl) to disable zoom
      console.log('🚫 Regular wheel event on map - preventing zoom (use Ctrl+scroll to zoom)');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      // Show hint about Ctrl+scroll
      setShowScrollHint(true);
      if (hintTimeout) {
        clearTimeout(hintTimeout);
      }
      hintTimeout = setTimeout(() => {
        setShowScrollHint(false);
      }, 2000);
      
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
