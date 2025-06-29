import { useState, useRef, useCallback } from 'react';

export const useDestinationHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showDelayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((destinationName?: string) => {
    // Clear any pending hide timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Clear any existing show delay
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
    }

    console.log(`⏳ Starting hover delay for destination: ${destinationName || 'unknown'}`);
    
    // Increased delay from 200ms to 250ms (25% increase)
    showDelayTimeoutRef.current = setTimeout(() => {
      console.log(`🏛️ Hover started for destination: ${destinationName || 'unknown'}`);
      setIsHovered(true);
      showDelayTimeoutRef.current = null;
    }, 250);
  }, []);

  const handleMouseLeave = useCallback((destinationName?: string) => {
    // Clear any pending show delay
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
      showDelayTimeoutRef.current = null;
      console.log(`🚫 Cancelled hover delay for destination: ${destinationName || 'unknown'}`);
    }

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Add 300ms delay before hiding (same as hidden gems)
    hoverTimeoutRef.current = setTimeout(() => {
      console.log(`🏛️ Hover ended for destination: ${destinationName || 'unknown'}`);
      setIsHovered(false);
      hoverTimeoutRef.current = null;
    }, 300);
  }, []);

  const updatePosition = useCallback((x: number, y: number) => {
    console.log(`📍 Updating destination hover position:`, { x, y });
    setHoverPosition({ x, y });
  }, []);

  const cleanup = useCallback(() => {
    console.log(`🧹 Cleaning up destination hover state`);
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
