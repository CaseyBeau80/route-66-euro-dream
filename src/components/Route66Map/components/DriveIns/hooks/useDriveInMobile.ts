import { useState, useCallback, useRef } from 'react';

interface ClickPosition {
  x: number;
  y: number;
}

interface HoverPosition {
  x: number;
  y: number;
}

export const useDriveInMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth <= 768;
  });
  
  const [isClicked, setIsClicked] = useState(false);
  const [clickPosition, setClickPosition] = useState<ClickPosition>({ x: 0, y: 0 });
  
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState<HoverPosition>({ x: 0, y: 0 });
  
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchInteraction = useCallback((x: number, y: number) => {
    console.log(`📱 Drive-in touch interaction at position:`, { x, y });
    setClickPosition({ x, y });
    setIsClicked(true);
  }, []);

  const handleClick = useCallback((driveInName: string) => {
    console.log(`🖱️ Drive-in clicked: ${driveInName}`);
    if (isMobile) {
      // Mobile behavior handled by touch interaction
      return;
    }
    // Desktop click behavior can be handled here if needed
  }, [isMobile]);

  const handleMouseEnter = useCallback((driveInName: string) => {
    console.log(`🐭 Mouse entered drive-in marker for: ${driveInName}`);
    
    if (isMobile) return; // Skip hover on mobile
    
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    setIsHovered(true);
  }, [isMobile]);

  const handleMouseLeave = useCallback((driveInName: string) => {
    console.log(`🐭 Mouse left drive-in marker for: ${driveInName} - starting hide delay`);
    
    if (isMobile) return; // Skip hover on mobile
    
    // Set a delay before hiding the hover card
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300); // 300ms delay
  }, [isMobile]);

  const updatePosition = useCallback((x: number, y: number) => {
    // Validate the position values to prevent Infinity
    const validX = isFinite(x) ? x : 0;
    const validY = isFinite(y) ? y : 0;
    
    console.log(`📍 Updating drive-in position:`, { 
      originalX: x, 
      originalY: y, 
      validX, 
      validY,
      isXFinite: isFinite(x),
      isYFinite: isFinite(y)
    });
    
    if (isMobile) {
      setClickPosition({ x: validX, y: validY });
    } else {
      setHoverPosition({ x: validX, y: validY });
    }
  }, [isMobile]);

  const closeClickable = useCallback(() => {
    console.log('🚫 Closing drive-in clickable card');
    setIsClicked(false);
  }, []);

  const cleanup = useCallback(() => {
    console.log('🧹 Cleaning up drive-in mobile state');
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    setIsHovered(false);
    setIsClicked(false);
    setHoverPosition({ x: 0, y: 0 });
    setClickPosition({ x: 0, y: 0 });
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