
import { useCallback, useRef } from 'react';

interface UseMapEventsProps {
  setCurrentZoom: (zoom: number) => void;
  setIsDragging: (isDragging: boolean) => void;
  checkMapBounds: () => void;
  debouncedZoomHandler: (zoom: number) => void;
  preserveCenterRef: React.MutableRefObject<google.maps.LatLng | null>;
  isInitialLoadRef: React.MutableRefObject<boolean>;
  isZoomingRef: React.MutableRefObject<boolean>;
}

export const useMapEvents = ({
  setCurrentZoom,
  setIsDragging,
  checkMapBounds,
  debouncedZoomHandler,
  preserveCenterRef,
  isInitialLoadRef,
  isZoomingRef
}: UseMapEventsProps) => {
  
  const setupMapListeners = useCallback((map: google.maps.Map) => {
    // Add zoom change listener with debouncing
    map.addListener('zoom_changed', () => {
      const newZoom = map.getZoom() || 5;
      
      // Only process if not currently in a zoom operation
      if (!isZoomingRef.current) {
        debouncedZoomHandler(newZoom);
      }
    });
    
    // Override the default zoom controls behavior with improved timing
    const originalSetZoom = map.setZoom;
    map.setZoom = function(zoom: number) {
      if (!isInitialLoadRef.current && !isZoomingRef.current) {
        // This is a programmatic zoom after initial load - preserve center
        const currentCenter = map.getCenter();
        if (currentCenter) {
          preserveCenterRef.current = currentCenter;
          console.log('🎯 Intercepted setZoom, preserving center:', currentCenter.toJSON());
        }
      }
      
      // Call original setZoom
      const result = originalSetZoom.call(this, zoom);
      
      // Restore center if we have one preserved
      if (preserveCenterRef.current && !isInitialLoadRef.current) {
        setTimeout(() => {
          if (preserveCenterRef.current) {
            console.log('🎯 Restoring center after intercepted zoom:', preserveCenterRef.current.toJSON());
            map.setCenter(preserveCenterRef.current);
            preserveCenterRef.current = null;
          }
        }, 150);
      }
      
      return result;
    };
    
    // Enhanced drag event listeners
    map.addListener('dragstart', () => {
      console.log('🖱️ Google Map drag started - user interaction detected');
      setIsDragging(true);
    });
    
    map.addListener('dragend', () => {
      console.log('🖱️ Google Map drag ended - checking bounds');
      setIsDragging(false);
      checkMapBounds();
    });
    
    map.addListener('bounds_changed', checkMapBounds);
    
    // Test draggability
    console.log('🗺️ Map draggable setting:', map.get('draggable'));
    console.log('🗺️ Map gesture handling:', map.get('gestureHandling'));
  }, [setCurrentZoom, setIsDragging, checkMapBounds, debouncedZoomHandler, preserveCenterRef, isInitialLoadRef, isZoomingRef]);

  return { setupMapListeners };
};
