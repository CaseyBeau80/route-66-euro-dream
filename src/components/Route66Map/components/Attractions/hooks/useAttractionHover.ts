
import { useState, useRef, useCallback } from 'react';

export const useAttractionHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showDelayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCardHoveredRef = useRef(false);

  const handleMouseEnter = useCallback((attractionName?: string) => {
    // Clear any pending hide timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Clear any existing show delay
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
    }

    console.log(`⏳ Starting hover delay for attraction: ${attractionName || 'unknown'}`);
    
    // Faster response time for better UX
    showDelayTimeoutRef.current = setTimeout(() => {
      console.log(`🎯 Hover started for attraction: ${attractionName || 'unknown'}`);
      setIsHovered(true);
      showDelayTimeoutRef.current = null;
    }, 150);
  }, []);

  const handleMouseLeave = useCallback((attractionName?: string) => {
    // Clear any pending show delay
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
      showDelayTimeoutRef.current = null;
      console.log(`🚫 Cancelled hover delay for attraction: ${attractionName || 'unknown'}`);
    }

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Longer delay to allow moving to the card - only hide if card is not being hovered
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isCardHoveredRef.current) {
        console.log(`🎯 Hover ended for attraction: ${attractionName || 'unknown'}`);
        setIsHovered(false);
      }
      hoverTimeoutRef.current = null;
    }, 500);
  }, []);

  const handleCardMouseEnter = useCallback((attractionName?: string) => {
    console.log(`🐭 Mouse entered attraction hover card for: ${attractionName || 'unknown'} - keeping card visible`);
    isCardHoveredRef.current = true;
    
    // Clear any pending hide timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    // Ensure card stays visible
    setIsHovered(true);
  }, []);

  const handleCardMouseLeave = useCallback((attractionName?: string) => {
    console.log(`🐭 Mouse left attraction hover card for: ${attractionName || 'unknown'} - starting hide delay`);
    isCardHoveredRef.current = false;
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Shorter delay when leaving the card
    hoverTimeoutRef.current = setTimeout(() => {
      console.log(`🎯 Hover ended for attraction: ${attractionName || 'unknown'}`);
      setIsHovered(false);
      hoverTimeoutRef.current = null;
    }, 300);
  }, []);

  const updatePosition = useCallback((x: number | null, y: number | null) => {
    // Handle null values safely
    if (x === null || y === null || typeof x !== 'number' || typeof y !== 'number') {
      console.warn('🚫 Invalid position values provided to updatePosition:', { x, y });
      return;
    }
    
    console.log(`📍 Updating attraction hover position:`, { x, y });
    setHoverPosition({ x, y });
  }, []);

  const cleanup = useCallback(() => {
    console.log(`🧹 Cleaning up attraction hover state`);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
      showDelayTimeoutRef.current = null;
    }
    isCardHoveredRef.current = false;
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
    isCardHoveredRef.current = false;
    setIsHovered(false);
  }, []);

  return {
    isHovered,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    handleCardMouseEnter,
    handleCardMouseLeave,
    updatePosition,
    cleanup,
    clearHover
  };
};
