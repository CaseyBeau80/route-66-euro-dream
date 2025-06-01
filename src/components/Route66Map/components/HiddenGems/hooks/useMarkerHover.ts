
import { useState, useRef, useCallback } from 'react';

export const useMarkerHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showDelayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((gemTitle?: string) => {
    // Clear any pending hide timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Clear any existing show delay
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
    }

    console.log(`⏳ Starting hover delay for gem: ${gemTitle || 'unknown'}`);
    
    // Reduced delay from 400ms to 200ms for faster response
    showDelayTimeoutRef.current = setTimeout(() => {
      console.log(`✨ Hover started for gem: ${gemTitle || 'unknown'}`);
      setIsHovered(true);
      showDelayTimeoutRef.current = null;
    }, 200);
  }, []);

  const handleMouseLeave = useCallback((gemTitle?: string) => {
    // Clear any pending show delay
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
      showDelayTimeoutRef.current = null;
      console.log(`🚫 Cancelled hover delay for gem: ${gemTitle || 'unknown'}`);
    }

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Increased delay from 300ms to 1000ms (1 second) to give users more time
    hoverTimeoutRef.current = setTimeout(() => {
      console.log(`✨ Hover ended for gem: ${gemTitle || 'unknown'}`);
      setIsHovered(false);
      hoverTimeoutRef.current = null;
    }, 1000);
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
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
      showDelayTimeoutRef.current = null;
    }
    setIsHovered(false);
  }, []);

  const clearHover = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
      showDelayTimeoutRef.current = null;
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
