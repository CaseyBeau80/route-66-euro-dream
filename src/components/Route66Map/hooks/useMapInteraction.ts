
import { useState, useEffect, useRef } from "react";

interface UseMapInteractionProps {
  zoom: number;
  minZoom: number;
  maxZoom: number;
  baseWidth: number;
  baseHeight: number;
  onZoomChange?: (newZoom: number) => void;
}

export const useMapInteraction = ({
  zoom,
  minZoom,
  maxZoom,
  baseWidth,
  baseHeight,
  onZoomChange
}: UseMapInteractionProps) => {
  // State for panning functionality
  const [viewBoxX, setViewBoxX] = useState(0);
  const [viewBoxY, setViewBoxY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  
  // Track touch points for pinch detection
  const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
  const [initialZoom, setInitialZoom] = useState<number>(zoom);
  const [isPinching, setIsPinching] = useState<boolean>(false);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate adjusted viewBox based on zoom
  const viewBoxWidth = baseWidth / zoom;
  const viewBoxHeight = baseHeight / zoom;
  
  // Construct viewBox string with current pan position
  const viewBox = `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`;
  
  // Sensitivity adjustment factor - lower number means more sensitive zoom
  const SENSITIVITY_FACTOR = 0.5;
  
  // Update local zoom state when parent zoom changes
  useEffect(() => {
    setInitialZoom(zoom);
    
    return () => {
      // Clear any timeout on component unmount
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, [zoom]);

  // Calculate distance between two touch points
  const getDistance = (touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Reset the view to center
  const resetView = () => {
    setViewBoxX((baseWidth - viewBoxWidth) / 2);
    setViewBoxY((baseHeight - viewBoxHeight) / 2);
  };

  // Center the view on component mount and when zoom changes
  useEffect(() => {
    resetView();
  }, [zoom, viewBoxWidth, viewBoxHeight]);

  return {
    viewBox,
    isDragging,
    isPinching,
    touchStartDistance,
    lastPosition,
    setIsDragging,
    setLastPosition,
    setViewBoxX,
    setViewBoxY,
    setTouchStartDistance,
    setInitialZoom,
    setIsPinching,
    viewBoxWidth,
    viewBoxHeight,
    initialZoom,
    touchTimeoutRef,
    getDistance,
    SENSITIVITY_FACTOR
  };
};
