
import { useCallback, useState } from 'react';
import { useMapInteraction } from './useMapInteraction';

interface UseSimpleMapInitializationProps {
  setCurrentZoom: (zoom: number) => void;
  setIsDragging: (isDragging: boolean) => void;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

export const useSimpleMapInitialization = ({
  setCurrentZoom,
  setIsDragging,
  mapRef
}: UseSimpleMapInitializationProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  const { setupMapListeners, cleanup } = useMapInteraction({
    mapRef,
    setCurrentZoom,
    setIsDragging
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log("🗺️ Google Map loaded with simplified interaction");
    mapRef.current = map;
    setMap(map);
    
    // Set initial position for Route 66
    map.setZoom(5);
    map.setCenter({ lat: 35.5, lng: -100 });
    
    // Setup listeners and store cleanup function
    const cleanupListeners = setupMapListeners(map);
    
    // Store cleanup function on the map for later use
    (map as any)._cleanupListeners = cleanupListeners;
    
    console.log('✅ Map initialized with improved drag handling');
  }, [setCurrentZoom, setIsDragging, setupMapListeners, mapRef]);

  const onUnmount = useCallback(() => {
    console.log("🗺️ Google Map unmounted");
    
    // Call cleanup function if it exists
    if (mapRef.current && (mapRef.current as any)._cleanupListeners) {
      (mapRef.current as any)._cleanupListeners();
    }
    
    mapRef.current = null;
    setMap(null);
    cleanup();
  }, [cleanup, mapRef]);

  return {
    map,
    onLoad,
    onUnmount
  };
};
