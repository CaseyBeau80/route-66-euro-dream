
import { useCallback, useState, useRef } from 'react';
import { useMapEvents } from './useMapEvents';
import { useZoomPreservation } from './useZoomPreservation';

interface UseMapInitializationProps {
  setCurrentZoom: (zoom: number) => void;
  setIsDragging: (isDragging: boolean) => void;
  checkMapBounds: () => void;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

export const useMapInitialization = ({
  setCurrentZoom,
  setIsDragging,
  checkMapBounds,
  mapRef
}: UseMapInitializationProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  const {
    preserveCenterRef,
    isInitialLoadRef,
    zoomTimeoutRef,
    isZoomingRef,
    debouncedZoomHandler,
    markInitialLoadComplete,
    cleanup
  } = useZoomPreservation();

  // Create a bound version of debouncedZoomHandler for this component
  const boundDebouncedZoomHandler = useCallback((newZoom: number) => {
    debouncedZoomHandler(newZoom, setCurrentZoom);
  }, [debouncedZoomHandler, setCurrentZoom]);

  const { setupMapListeners } = useMapEvents({
    setCurrentZoom,
    setIsDragging,
    checkMapBounds,
    debouncedZoomHandler: boundDebouncedZoomHandler,
    preserveCenterRef,
    isInitialLoadRef,
    isZoomingRef
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log("🗺️ Google Map loaded successfully");
    mapRef.current = map;
    setMap(map);
    
    // Set initial zoom and center
    map.setZoom(5);
    map.setCenter({ lat: 35.5, lng: -100 }); // Center of US for Route 66
    
    // Mark initial load as complete after a delay
    markInitialLoadComplete();
    
    // Setup all map listeners
    setupMapListeners(map);
    
    // Clear any pending zoom operations when user starts dragging
    map.addListener('dragstart', () => {
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
    });
  }, [setCurrentZoom, setIsDragging, checkMapBounds, boundDebouncedZoomHandler, setupMapListeners, markInitialLoadComplete, zoomTimeoutRef, mapRef]);

  const onUnmount = useCallback(() => {
    console.log("🗺️ Google Map unmounted");
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
