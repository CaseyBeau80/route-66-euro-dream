
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
    console.log("🗺️ Google Map loaded - enabling navigation");
    mapRef.current = map;
    setMap(map);
    
    // Set initial position for Route 66
    map.setZoom(5);
    map.setCenter({ lat: 35.5, lng: -100 });
    
    // Force enable all navigation options
    map.setOptions({
      draggable: true,
      gestureHandling: 'greedy',
      scrollwheel: true,
      panControl: true,
      zoomControl: true
    });
    
    // Verify navigation settings
    console.log('🖱️ Map draggable:', map.get('draggable'));
    console.log('🖱️ Gesture handling:', map.get('gestureHandling'));
    console.log('🖱️ Pan control:', map.get('panControl'));
    
    // Setup listeners
    setupMapListeners(map);
    
    // Test map interaction by adding a simple pan test
    setTimeout(() => {
      console.log('🧪 Testing map pan capabilities...');
      const currentCenter = map.getCenter();
      if (currentCenter) {
        console.log('🧪 Current center:', currentCenter.toJSON());
        console.log('🧪 Map should be ready for user interaction');
      }
    }, 1000);
    
    console.log('✅ Map initialization complete with navigation enabled');
  }, [mapRef, setupMapListeners]);

  const onUnmount = useCallback(() => {
    console.log("🗺️ Google Map unmounted - clean cleanup");
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
