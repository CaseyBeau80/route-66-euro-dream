
import { useRef, useCallback } from 'react';

export const useScrollZoom = () => {
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const createScrollHandler = useCallback((
    map: google.maps.Map,
    setShowScrollHint: (show: boolean) => void
  ) => {
    return (e: WheelEvent) => {
      // PREVENT all wheel events to disable zoom
      console.log('🚫 Scroll zoom prevented by useScrollZoom hook');
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
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
