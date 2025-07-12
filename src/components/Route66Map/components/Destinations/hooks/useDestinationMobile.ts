import { useState, useRef, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const useDestinationMobile = () => {
  const isMobile = useIsMobile();
  const [isClicked, setIsClicked] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showDelayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchInteraction = useCallback((destinationName?: string) => {
    if (!isMobile) return;
    
    console.log(`📱 Touch interaction for destination: ${destinationName}`);
    setIsClicked(true);
  }, [isMobile]);

  const handleClick = useCallback((destinationName?: string) => {
    if (isMobile) {
      console.log(`📱 Mobile click for destination: ${destinationName}`);
      setIsClicked(true);
    }
  }, [isMobile]);

  const handleMouseEnter = useCallback((destinationName?: string) => {
    if (isMobile) return; // Skip hover on mobile
    
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
    
    showDelayTimeoutRef.current = setTimeout(() => {
      console.log(`🏛️ Hover started for destination: ${destinationName || 'unknown'}`);
      setIsHovered(true);
      showDelayTimeoutRef.current = null;
    }, 250);
  }, [isMobile]);

  const handleMouseLeave = useCallback((destinationName?: string) => {
    if (isMobile) return; // Skip hover on mobile
    
    // Clear any pending show delay
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
      showDelayTimeoutRef.current = null;
      console.log(`🚫 Cancelled hover delay for destination: ${destinationName || 'unknown'}`);
    }

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Add 300ms delay before hiding
    hoverTimeoutRef.current = setTimeout(() => {
      console.log(`🏛️ Hover ended for destination: ${destinationName || 'unknown'}`);
      setIsHovered(false);
      hoverTimeoutRef.current = null;
    }, 300);
  }, [isMobile]);

  const updatePosition = useCallback((x: number, y: number) => {
    console.log(`📍 Updating destination position:`, { x, y, isMobile });
    if (isMobile) {
      setClickPosition({ x, y });
    } else {
      setHoverPosition({ x, y });
    }
  }, [isMobile]);

  const closeClickable = useCallback(() => {
    console.log(`📱 Closing destination clickable card`);
    setIsClicked(false);
  }, []);

  const cleanup = useCallback(() => {
    console.log(`🧹 Cleaning up destination mobile state`);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (showDelayTimeoutRef.current) {
      clearTimeout(showDelayTimeoutRef.current);
      showDelayTimeoutRef.current = null;
    }
    setIsHovered(false);
    setIsClicked(false);
  }, []);

  return {
    isMobile,
    isClicked,
    clickPosition,
    isHovered,
    hoverPosition,
    handleTouchInteraction,
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
    updatePosition,
    closeClickable,
    cleanup
  };
};