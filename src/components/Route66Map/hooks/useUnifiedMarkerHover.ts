import { useState, useCallback, useRef } from 'react';

interface HoverPosition {
  x: number;
  y: number;
}

interface UseUnifiedMarkerHoverProps {
  showDelay?: number;
  hideDelay?: number;
}

export const useUnifiedMarkerHover = ({ 
  showDelay = 0, 
  hideDelay = 300 
}: UseUnifiedMarkerHoverProps = {}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState<HoverPosition>({ x: 0, y: 0 });
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((itemName: string) => {
    console.log(`🐭 Mouse entered marker for: ${itemName}`);
    
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    // Clear any existing show delay
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    if (showDelay > 0) {
      console.log(`⏳ Starting hover delay for: ${itemName} (${showDelay}ms)`);
      showTimeoutRef.current = setTimeout(() => {
        console.log(`✅ Hover activated for: ${itemName}`);
        setIsHovered(true);
        showTimeoutRef.current = null;
      }, showDelay);
    } else {
      setIsHovered(true);
    }
  }, [showDelay]);

  const handleMouseLeave = useCallback((itemName: string) => {
    console.log(`🐭 Mouse left marker for: ${itemName}`);
    
    // Clear any pending show delay
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
      console.log(`🚫 Cancelled hover delay for: ${itemName}`);
    }

    // Clear any existing hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    // Add hide delay
    hideTimeoutRef.current = setTimeout(() => {
      console.log(`❌ Hover ended for: ${itemName}`);
      setIsHovered(false);
      hideTimeoutRef.current = null;
    }, hideDelay);
  }, [hideDelay]);

  const updatePosition = useCallback((x: number, y: number) => {
    // Validate the position values to prevent Infinity
    const validX = isFinite(x) ? x : 0;
    const validY = isFinite(y) ? y : 0;
    
    console.log(`📍 Updating hover position:`, { 
      originalX: x, 
      originalY: y, 
      validX, 
      validY,
      isXFinite: isFinite(x),
      isYFinite: isFinite(y)
    });
    
    setHoverPosition({ x: validX, y: validY });
  }, []);

  const clearHover = useCallback(() => {
    console.log('🧹 Clearing hover state immediately');
    
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    setIsHovered(false);
    setHoverPosition({ x: 0, y: 0 });
  }, []);

  const cleanup = useCallback(() => {
    console.log('🧹 Cleaning up hover state and timers');
    clearHover();
  }, [clearHover]);

  return {
    isHovered,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    updatePosition,
    clearHover,
    cleanup
  };
};