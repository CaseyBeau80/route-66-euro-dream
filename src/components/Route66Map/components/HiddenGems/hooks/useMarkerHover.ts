
import { useState, useRef, useCallback } from 'react';

export const useMarkerHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((gemTitle: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    console.log(`🎯 Hover started for gem: ${gemTitle}`);
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback((gemTitle: string) => {
    hoverTimeoutRef.current = setTimeout(() => {
      console.log(`🎯 Hover ended for gem: ${gemTitle}`);
      setIsHovered(false);
    }, 150); // Small delay to prevent flickering
  }, []);

  const updatePosition = useCallback((x: number, y: number) => {
    setHoverPosition({ x, y });
  }, []);

  const cleanup = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  }, []);

  return {
    isHovered,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    updatePosition,
    cleanup
  };
};
