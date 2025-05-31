
import { useState, useRef, useCallback, useMemo } from 'react';

export const useAttractionHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const positionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoverStableRef = useRef(false);

  // ULTRA-STABLE hover enter handler with debouncing
  const handleMouseEnter = useCallback((attractionName?: string) => {
    // Prevent rapid state changes
    if (isHoverStableRef.current) {
      console.log(`🔒 Hover already stable for: ${attractionName}, ignoring enter`);
      return;
    }

    // Clear any pending timeout to prevent flickering
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    console.log(`🎯 STABLE hover started for attraction: ${attractionName || 'unknown'}`);
    isHoverStableRef.current = true;
    setIsHovered(true);
  }, []);

  // ULTRA-STABLE hover leave handler with longer delay
  const handleMouseLeave = useCallback((attractionName?: string) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Add a longer delay to prevent flickering and re-renders
    hoverTimeoutRef.current = setTimeout(() => {
      console.log(`🎯 STABLE hover ended for attraction: ${attractionName || 'unknown'}`);
      isHoverStableRef.current = false;
      setIsHovered(false);
      hoverTimeoutRef.current = null;
    }, 500); // Longer delay for stability
  }, []);

  // ULTRA-STABLE position update with heavy debouncing
  const updatePosition = useCallback((x: number, y: number) => {
    if (positionTimeoutRef.current) {
      clearTimeout(positionTimeoutRef.current);
    }
    
    positionTimeoutRef.current = setTimeout(() => {
      console.log(`📍 STABLE position update:`, { x, y });
      setHoverPosition({ x, y });
      positionTimeoutRef.current = null;
    }, 50); // Heavier debouncing for stability
  }, []);

  // Enhanced cleanup function
  const cleanup = useCallback(() => {
    console.log(`🧹 ULTRA-STABLE cleanup of attraction hover state`);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (positionTimeoutRef.current) {
      clearTimeout(positionTimeoutRef.current);
      positionTimeoutRef.current = null;
    }
    isHoverStableRef.current = false;
    setIsHovered(false);
  }, []);

  // Immediate clear hover without delay for emergency situations
  const clearHover = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (positionTimeoutRef.current) {
      clearTimeout(positionTimeoutRef.current);
      positionTimeoutRef.current = null;
    }
    isHoverStableRef.current = false;
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
