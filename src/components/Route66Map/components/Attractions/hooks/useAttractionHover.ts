
import { useState, useRef, useCallback, useMemo } from 'react';

export const useAttractionHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const positionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoverStableRef = useRef(false);
  const showDelayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ULTRA-STABLE hover enter handler with show delay
  const handleMouseEnter = useCallback((attractionName?: string) => {
    // Clear any pending hide timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // If already showing, don't restart the delay
    if (isHoverStableRef.current) {
      console.log(`🔒 Hover already stable for: ${attractionName}, ignoring enter`);
      return;
    }

    // Clear any existing show delay
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
    }

    console.log(`⏳ Starting hover delay for attraction: ${attractionName || 'unknown'}`);
    
    // Add 400ms delay before showing the tooltip
    showDelayTimeoutRef.current = setTimeout(() => {
      console.log(`🎯 STABLE hover started for attraction: ${attractionName || 'unknown'}`);
      isHoverStableRef.current = true;
      setIsHovered(true);
      showDelayTimeoutRef.current = null;
    }, 400);
  }, []);

  // ULTRA-STABLE hover leave handler with longer delay
  const handleMouseLeave = useCallback((attractionName?: string) => {
    // Clear any pending show delay
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
      showDelayTimeoutRef.current = null;
      console.log(`🚫 Cancelled hover delay for attraction: ${attractionName || 'unknown'}`);
    }

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
    }, 300);
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
    }, 50);
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
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
      showDelayTimeoutRef.current = null;
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
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
      showDelayTimeoutRef.current = null;
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
