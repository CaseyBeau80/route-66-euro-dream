
import { useCallback, useRef, useState } from 'react';

interface UseMapInteractionProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  setCurrentZoom: (zoom: number) => void;
  setIsDragging: (isDragging: boolean) => void;
}

export const useMapInteraction = ({
  mapRef,
  setCurrentZoom,
  setIsDragging
}: UseMapInteractionProps) => {
  const [isUserDragging, setIsUserDragging] = useState(false);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const zoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simplified zoom handler - no aggressive center preservation
  const handleZoomChange = useCallback(() => {
    if (!mapRef.current) return;
    
    const newZoom = mapRef.current.getZoom() || 5;
    
    // Clear any existing zoom timeout
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
    }
    
    // Debounce zoom updates to prevent rapid changes
    zoomTimeoutRef.current = setTimeout(() => {
      setCurrentZoom(newZoom);
      console.log('🔍 Zoom updated to:', newZoom);
    }, 150);
  }, [setCurrentZoom, mapRef]);

  // Improved drag start handler
  const handleDragStart = useCallback(() => {
    console.log('🖱️ Drag started by user');
    setIsUserDragging(true);
    setIsDragging(true);
    
    // Clear any pending zoom operations during drag
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
    }
  }, [setIsDragging]);

  // Improved drag end handler with proper cleanup
  const handleDragEnd = useCallback(() => {
    console.log('🖱️ Drag ended');
    setIsUserDragging(false);
    
    // Clear any existing drag timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    
    // Set a small delay before clearing dragging state for smoother UX
    dragTimeoutRef.current = setTimeout(() => {
      setIsDragging(false);
    }, 100);
  }, [setIsDragging]);

  // Setup map event listeners
  const setupMapListeners = useCallback((map: google.maps.Map) => {
    console.log('🗺️ Setting up simplified map interaction listeners');
    
    // Zoom change listener
    map.addListener('zoom_changed', handleZoomChange);
    
    // Drag listeners with improved timing
    map.addListener('dragstart', handleDragStart);
    map.addListener('dragend', handleDragEnd);
    
    // Cleanup function
    return () => {
      google.maps.event.clearInstanceListeners(map);
    };
  }, [handleZoomChange, handleDragStart, handleDragEnd]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
    }
    setIsUserDragging(false);
    setIsDragging(false);
  }, [setIsDragging]);

  return {
    isUserDragging,
    setupMapListeners,
    cleanup
  };
};
