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
    console.log("🗺️ Google Map loaded - enabling NATIVE navigation with zoom protection");
    mapRef.current = map;
    setMap(map);
    
    // Set initial position for Route 66 - this should be the stable center
    const route66Center = { lat: 35.5, lng: -100 };
    map.setZoom(5);
    map.setCenter(route66Center);
    
    // Force enable native navigation with enhanced stability
    map.setOptions({
      draggable: true,
      gestureHandling: 'greedy',
      scrollwheel: true,
      panControl: true,
      zoomControl: true,
      disableDefaultUI: false,
      keyboardShortcuts: true,
      // Add zoom restrictions to prevent extreme zoom changes
      minZoom: 3,
      maxZoom: 15,
      // Restrict bounds to keep focus on Route 66 area
      restriction: {
        latLngBounds: {
          north: 50.0,
          south: 25.0,
          east: -65.0,
          west: -125.0
        },
        strictBounds: false
      }
    });
    
    // Verify settings
    console.log('🖱️ Native dragging enabled:', map.get('draggable'));
    console.log('🖱️ Gesture handling:', map.get('gestureHandling'));
    console.log('🎯 Initial center set to Route 66 area:', route66Center);
    
    // Setup enhanced listeners with zoom protection
    setupMapListeners(map);
    
    console.log('✅ Map ready for NATIVE navigation with zoom protection');
  }, [mapRef, setupMapListeners]);

  const onUnmount = useCallback(() => {
    console.log("🗺️ Google Map unmounted - cleaning up zoom protection");
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
