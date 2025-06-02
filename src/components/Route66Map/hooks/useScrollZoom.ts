
import { useRef, useCallback } from 'react';

export const useScrollZoom = () => {
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const createScrollHandler = useCallback((
    map: google.maps.Map,
    setShowScrollHint: (show: boolean) => void
  ) => {
    return (e: WheelEvent) => {
      // Don't interfere with Google Maps native zoom at all
      console.log('🔍 Native Google Maps wheel zoom - no interference');
      
      // Let Google Maps handle all wheel events natively
      // No preventDefault, no stopPropagation - just let it work
      return;
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
