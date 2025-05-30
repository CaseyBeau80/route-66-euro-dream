
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
    console.log("🗺️ Google Map loaded - enabling NATIVE navigation only");
    mapRef.current = map;
    setMap(map);
    
    // Set initial position for Route 66
    map.setZoom(5);
    map.setCenter({ lat: 35.5, lng: -100 });
    
    // Force enable native navigation - no React state interference
    map.setOptions({
      draggable: true,
      gestureHandling: 'greedy',
      scrollwheel: true,
      panControl: true,
      zoomControl: true,
      disableDefaultUI: false,
      keyboardShortcuts: true
    });
    
    // Verify settings
    console.log('🖱️ Native dragging enabled:', map.get('draggable'));
    console.log('🖱️ Gesture handling:', map.get('gestureHandling'));
    
    // Setup minimal listeners only
    setupMapListeners(map);
    
    console.log('✅ Map ready for NATIVE mouse navigation');
  }, [mapRef, setupMapListeners]);

  const onUnmount = useCallback(() => {
    console.log("🗺️ Google Map unmounted");
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
