
import { useCallback, useState } from 'react';

interface UseCleanMapInitializationProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  setupMapListeners: (map: google.maps.Map) => void;
}

export const useCleanMapInitialization = ({
  mapRef,
  setupMapListeners
}: UseCleanMapInitializationProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log("🗺️ Google Map loaded - using NATIVE navigation only");
    mapRef.current = map;
    setMap(map);
    
    // Set initial position for Route 66
    const route66Center = { lat: 35.5, lng: -100 };
    map.setZoom(5);
    map.setCenter(route66Center);
    
    // Enable native navigation with minimal restrictions
    map.setOptions({
      draggable: true,
      gestureHandling: 'greedy',
      scrollwheel: true,
      panControl: true,
      zoomControl: true,
      disableDefaultUI: false,
      keyboardShortcuts: true,
      // Only basic zoom limits - no bounds restrictions
      minZoom: 3,
      maxZoom: 18
    });
    
    console.log('🖱️ Native dragging enabled:', map.get('draggable'));
    console.log('🖱️ Gesture handling:', map.get('gestureHandling'));
    console.log('🎯 Initial center set to Route 66 area:', route66Center);
    
    // Setup simple listeners
    setupMapListeners(map);
    
    console.log('✅ Map ready for NATIVE navigation - no interference');
  }, [mapRef, setupMapListeners]);

  const onUnmount = useCallback(() => {
    console.log("🗺️ Google Map unmounted - simple cleanup");
    if (mapRef.current) {
      google.maps.event.clearInstanceListeners(mapRef.current);
    }
    mapRef.current = null;
    setMap(null);
  }, [mapRef]);

  return {
    map,
    onLoad,
    onUnmount
  };
};
