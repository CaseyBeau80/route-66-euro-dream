
import { useState, useRef, useCallback } from 'react';

export const useMarkerHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((gemTitle?: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    console.log(`✨ Hover started for gem: ${gemTitle || 'unknown'}`);
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback((gemTitle?: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      console.log(`✨ Hover ended for gem: ${gemTitle || 'unknown'}`);
      setIsHovered(false);
      hoverTimeoutRef.current = null;
    }, 300); // Longer delay to prevent flickering
  }, []);

  const updatePosition = useCallback((x: number, y: number) => {
    console.log(`📍 Updating hover position:`, { x, y });
    setHoverPosition({ x, y });
  }, []);

  const cleanup = useCallback(() => {
    console.log(`🧹 Cleaning up hover state`);
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
