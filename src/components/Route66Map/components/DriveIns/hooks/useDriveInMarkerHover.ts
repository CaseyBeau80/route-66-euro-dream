
import { useState, useCallback, useRef } from 'react';

export const useDriveInMarkerHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((driveInName: string) => {
    console.log(`🐭 Mouse entered drive-in marker: ${driveInName}`);
    
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback((driveInName: string) => {
    console.log(`🐭 Mouse left drive-in marker: ${driveInName} - starting hide delay`);
    
    // Add a small delay before hiding to allow moving to hover card
    hideTimeoutRef.current = setTimeout(() => {
      console.log(`⏰ Hide timeout triggered for drive-in: ${driveInName}`);
      setIsHovered(false);
      hideTimeoutRef.current = null;
    }, 300); // 300ms delay
  }, []);

  const updatePosition = useCallback((x: number, y: number) => {
    setHoverPosition({ x, y });
  }, []);

  const cleanup = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsHovered(false);
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
