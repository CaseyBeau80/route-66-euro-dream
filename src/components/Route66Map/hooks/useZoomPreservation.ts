
import { useCallback, useRef } from 'react';

export const useZoomPreservation = () => {
  const preserveCenterRef = useRef<google.maps.LatLng | null>(null);
  const isInitialLoadRef = useRef(true);
  const zoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isZoomingRef = useRef(false);

  // Debounced zoom handler to prevent rapid zoom changes
  const debouncedZoomHandler = useCallback((newZoom: number, setCurrentZoom: (zoom: number) => void) => {
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
    }
    
    zoomTimeoutRef.current = setTimeout(() => {
      setCurrentZoom(newZoom);
      isZoomingRef.current = false;
      console.log('🔍 Debounced zoom level set to:', newZoom);
    }, 100);
  }, []);

  // Improved center preservation with better timing
  const captureCurrentCenter = useCallback((map: google.maps.Map | null) => {
    if (map && !isInitialLoadRef.current && !isZoomingRef.current) {
      const currentCenter = map.getCenter();
      if (currentCenter) {
        preserveCenterRef.current = currentCenter;
        console.log('🎯 Captured center for preservation:', currentCenter.toJSON());
        return true;
      }
    }
    return false;
  }, []);

  // Enhanced zoom function with proper center preservation
  const performZoom = useCallback((map: google.maps.Map | null, newZoom: number) => {
    if (!map || isZoomingRef.current) return;
    
    console.log('🔍 Starting zoom operation to level:', newZoom);
    isZoomingRef.current = true;
    
    // Capture current center
    const centerCaptured = captureCurrentCenter(map);
    
    // Perform zoom
    map.setZoom(newZoom);
    
    // Restore center after zoom completes
    if (centerCaptured && preserveCenterRef.current) {
      setTimeout(() => {
        if (preserveCenterRef.current && map) {
          console.log('🎯 Restoring preserved center after zoom:', preserveCenterRef.current.toJSON());
          map.setCenter(preserveCenterRef.current);
          preserveCenterRef.current = null;
        }
      }, 150); // Slightly longer delay to ensure zoom has completed
    }
  }, [captureCurrentCenter]);

  const markInitialLoadComplete = useCallback(() => {
    setTimeout(() => {
      isInitialLoadRef.current = false;
      console.log('🗺️ Initial load complete, center preservation now active');
    }, 1000);
  }, []);

  const cleanup = useCallback(() => {
    preserveCenterRef.current = null;
    isInitialLoadRef.current = true;
    isZoomingRef.current = false;
    
    // Clear any pending timeouts
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
    }
  }, []);

  return {
    preserveCenterRef,
    isInitialLoadRef,
    zoomTimeoutRef,
    isZoomingRef,
    debouncedZoomHandler,
    captureCurrentCenter,
    performZoom,
    markInitialLoadComplete,
    cleanup
  };
};
