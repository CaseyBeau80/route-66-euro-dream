
import { useState, useRef, useCallback, useMemo } from 'react';

export const useAttractionHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const positionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoverActiveRef = useRef(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });

  // Simplified and more stable hover enter handler
  const handleMouseEnter = useCallback((attractionName?: string) => {
    // Clear any pending hide timeout immediately
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // If already active, don't restart
    if (isHoverActiveRef.current) {
      return;
    }

    console.log(`🎯 Hover ENTER for attraction: ${attractionName || 'unknown'}`);
    isHoverActiveRef.current = true;
    setIsHovered(true);
  }, []);

  // Simplified and more stable hover leave handler with longer delay
  const handleMouseLeave = useCallback((attractionName?: string) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Add a longer delay to prevent flickering
    hoverTimeoutRef.current = setTimeout(() => {
      console.log(`🎯 Hover LEAVE for attraction: ${attractionName || 'unknown'}`);
      isHoverActiveRef.current = false;
      setIsHovered(false);
      hoverTimeoutRef.current = null;
    }, 500); // Increased delay to 500ms
  }, []);

  // Much more conservative position update with distance-based filtering
  const updatePosition = useCallback((x: number, y: number) => {
    // Only update if position has changed significantly (reduces jitter)
    const lastPos = lastPositionRef.current;
    const distance = Math.sqrt(Math.pow(x - lastPos.x, 2) + Math.pow(y - lastPos.y, 2));
    
    if (distance < 10) {
      // Position hasn't changed enough, ignore update
      return;
    }

    if (positionTimeoutRef.current) {
      clearTimeout(positionTimeoutRef.current);
    }
    
    positionTimeoutRef.current = setTimeout(() => {
      console.log(`📍 Position update:`, { x, y, distance });
      lastPositionRef.current = { x, y };
      setHoverPosition({ x, y });
      positionTimeoutRef.current = null;
    }, 100); // Reduced frequency of position updates
  }, []);

  // Enhanced cleanup function
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
    isHoverActiveRef.current = false;
    setIsHovered(false);
  }, []);

  // Immediate clear hover for emergency situations
  const clearHover = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (positionTimeoutRef.current) {
      clearTimeout(positionTimeoutRef.current);
      positionTimeoutRef.current = null;
    }
    isHoverActiveRef.current = false;
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
