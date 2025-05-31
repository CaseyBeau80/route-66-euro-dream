
import { useState, useRef, useCallback, useMemo } from 'react';

export const useAttractionHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const positionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced hover enter handler
  const handleMouseEnter = useCallback((attractionName?: string) => {
    // Clear any pending timeout to prevent flickering
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    console.log(`🎯 Hover started for attraction: ${attractionName || 'unknown'}`);
    setIsHovered(true);
  }, []);

  // Debounced hover leave handler
  const handleMouseLeave = useCallback((attractionName?: string) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Add a delay to reduce flickering but still provide smooth interaction
    hoverTimeoutRef.current = setTimeout(() => {
      console.log(`🎯 Hover ended for attraction: ${attractionName || 'unknown'}`);
      setIsHovered(false);
      hoverTimeoutRef.current = null;
    }, 150);
  }, []);

  // Debounced position update to improve performance
  const updatePosition = useCallback((x: number, y: number) => {
    if (positionTimeoutRef.current) {
      clearTimeout(positionTimeoutRef.current);
    }
    
    positionTimeoutRef.current = setTimeout(() => {
      console.log(`📍 Updating attraction hover position:`, { x, y });
      setHoverPosition({ x, y });
      positionTimeoutRef.current = null;
    }, 16); // ~60fps for smooth movement
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log(`🧹 Cleaning up attraction hover state`);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (positionTimeoutRef.current) {
      clearTimeout(positionTimeoutRef.current);
      positionTimeoutRef.current = null;
    }
    setIsHovered(false);
  }, []);

  // Quick clear hover without delay
  const clearHover = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (positionTimeoutRef.current) {
      clearTimeout(positionTimeoutRef.current);
      positionTimeoutRef.current = null;
    }
    setIsHovered(false);
  }, []);

  // Memoized return object to prevent unnecessary re-renders
  return useMemo(() => ({
    isHovered,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    updatePosition,
    cleanup,
    clearHover
  }), [isHovered, hoverPosition, handleMouseEnter, handleMouseLeave, updatePosition, cleanup, clearHover]);
};
