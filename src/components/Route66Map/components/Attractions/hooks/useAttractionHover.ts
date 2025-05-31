
import { useState, useRef, useCallback } from 'react';

export const useAttractionHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((attractionName?: string) => {
    // Clear any pending timeout to prevent flickering
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    console.log(`🎯 Hover started for attraction: ${attractionName || 'unknown'}`);
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback((attractionName?: string) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Add a shorter delay to reduce flickering but still provide smooth interaction
    hoverTimeoutRef.current = setTimeout(() => {
      console.log(`🎯 Hover ended for attraction: ${attractionName || 'unknown'}`);
      setIsHovered(false);
      hoverTimeoutRef.current = null;
    }, 150); // Reduced from 300ms to 150ms
  }, []);

  const updatePosition = useCallback((x: number, y: number) => {
    console.log(`📍 Updating attraction hover position:`, { x, y });
    setHoverPosition({ x, y });
  }, []);

  const cleanup = useCallback(() => {
    console.log(`🧹 Cleaning up attraction hover state`);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(false);
  }, []);

  const clearHover = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(false);
  }, []);

  return {
    isHovered,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    updatePosition,
    cleanup,
    clearHover
  };
};
