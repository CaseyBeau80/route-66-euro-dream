
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
    console.log("🗺️ Google Map loaded - clean initialization");
    mapRef.current = map;
    setMap(map);
    
    // Set initial position for Route 66
    map.setZoom(5);
    map.setCenter({ lat: 35.5, lng: -100 });
    
    // Setup listeners
    setupMapListeners(map);
    
    console.log('✅ Clean map initialization complete');
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
