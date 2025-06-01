
import { useRef, useCallback } from 'react';

export const useScrollZoom = () => {
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const createScrollHandler = useCallback((
    map: google.maps.Map,
    setShowScrollHint: (show: boolean) => void
  ) => {
    return (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        // Allow zoom when Ctrl (or Cmd on Mac) is pressed
        e.stopPropagation();
        
        // Manual zoom handling
        const currentZoom = map.getZoom() || 4;
        const zoomDelta = e.deltaY > 0 ? -1 : 1;
        const newZoom = Math.max(3, Math.min(10, currentZoom + zoomDelta));
        
        map.setZoom(newZoom);
        console.log('🔍 Ctrl+Scroll zoom:', newZoom);
      } else {
        // Prevent default zoom and show hint
        e.preventDefault();
        e.stopPropagation();
        
        setShowScrollHint(true);
        
        // Clear existing timeout
        if (hintTimeoutRef.current) {
          clearTimeout(hintTimeoutRef.current);
        }
        
        // Hide hint after 2 seconds
        hintTimeoutRef.current = setTimeout(() => {
          setShowScrollHint(false);
        }, 2000);
        
        console.log('📜 Scroll without Ctrl detected, showing hint');
      }
    };
  }, []);

  const cleanup = useCallback(() => {
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
    }
  }, []);

  return {
    createScrollHandler,
    cleanup
  };
};
