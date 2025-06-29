
import { useRef, useCallback } from 'react';

export const useScrollZoom = () => {
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const createScrollHandler = useCallback((
    map: google.maps.Map,
    setShowScrollHint: (show: boolean) => void
  ) => {
    return (e: WheelEvent) => {
      // Allow Ctrl + scroll for zoom
      if (e.ctrlKey || e.metaKey) {
        console.log('🎯 Ctrl+scroll detected in useScrollZoom - allowing zoom');
        return; // Let Google Maps handle the zoom
      }

      // PREVENT regular wheel events to disable zoom
      console.log('🚫 Regular scroll zoom prevented by useScrollZoom hook (use Ctrl+scroll to zoom)');
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
