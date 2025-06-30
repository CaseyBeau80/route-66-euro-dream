
import { useState, useCallback, useRef } from 'react';

interface HoverPosition {
  x: number;
  y: number;
}

export const useDriveInMarkerHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState<HoverPosition>({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((driveInName: string) => {
    console.log(`🐭 Mouse entered drive-in marker for: ${driveInName}`);
    
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback((driveInName: string) => {
    console.log(`🐭 Mouse left drive-in marker for: ${driveInName} - starting hide delay`);
    
    // Set a delay before hiding the hover card
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300); // 300ms delay
  }, []);

  const updatePosition = useCallback((x: number, y: number) => {
    // Validate the position values to prevent Infinity
    const validX = isFinite(x) ? x : 0;
    const validY = isFinite(y) ? y : 0;
    
    console.log(`📍 Updating drive-in hover position:`, { 
      originalX: x, 
      originalY: y, 
      validX, 
      validY,
      isXFinite: isFinite(x),
      isYFinite: isFinite(y)
    });
    
    setHoverPosition({ x: validX, y: validY });
  }, []);

  const cleanup = useCallback(() => {
    console.log('🧹 Cleaning up drive-in marker hover state');
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    setIsHovered(false);
    setHoverPosition({ x: 0, y: 0 });
  });

  return {
    isHovered,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    updatePosition,
    cleanup
  };
};
