
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

    console.log('🔄 MapScrollHandler: Setting up scroll event handling');

    const mapContainer = containerRef.current;
    let hintTimeout: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      // Check if the scroll is happening over the map
      const target = e.target as HTMLElement;
      const isOverMap = mapContainer.contains(target);
      
      if (!isOverMap) return;

      // If Ctrl/Cmd is pressed, allow native Google Maps zoom
      if (e.ctrlKey || e.metaKey) {
        console.log('🔍 Ctrl+Scroll zoom allowed');
        // Let Google Maps handle this - don't prevent default
        return;
      }

      // For regular scroll without Ctrl, show the hint
      console.log('📜 Regular scroll detected, showing hint');
      
      // Show the hint
      setShowScrollHint(true);
      
      // Clear existing timeout
      if (hintTimeout) {
        clearTimeout(hintTimeout);
      }
      
      // Hide hint after 3 seconds
      hintTimeout = setTimeout(() => {
        setShowScrollHint(false);
      }, 3000);
    };

    // Add wheel event listener to the map container
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
