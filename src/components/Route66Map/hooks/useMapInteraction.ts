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
  
  // Track previous zoom for smooth transitions
  const [previousZoom, setPreviousZoom] = useState<number>(zoom);
  
  // Calculate adjusted viewBox based on zoom
  const viewBoxWidth = baseWidth / zoom;
  const viewBoxHeight = baseHeight / zoom;
  
  // Construct viewBox string with current pan position
  const viewBox = `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`;
  
  // Sensitivity adjustment factor - lower number means more sensitive zoom
  const SENSITIVITY_FACTOR = 0.5;
  
  // Calculate distance between two touch points
  const getDistance = (touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Adjust view position when zoom changes to maintain current view center
  useEffect(() => {
    if (previousZoom !== zoom) {
      // Calculate the center of the current view
      const currentCenterX = viewBoxX + viewBoxWidth / 2;
      const currentCenterY = viewBoxY + viewBoxHeight / 2;
      
      // Calculate new viewBox dimensions
      const newViewBoxWidth = baseWidth / zoom;
      const newViewBoxHeight = baseHeight / zoom;
      
      // Calculate new viewBox position to keep the same center
      let newViewBoxX = currentCenterX - newViewBoxWidth / 2;
      let newViewBoxY = currentCenterY - newViewBoxHeight / 2;
      
      // Ensure the new position is within bounds
      const maxPanX = baseWidth - newViewBoxWidth;
      const maxPanY = baseHeight - newViewBoxHeight;
      
      newViewBoxX = Math.min(Math.max(newViewBoxX, 0), maxPanX);
      newViewBoxY = Math.min(Math.max(newViewBoxY, 0), maxPanY);
      
      setViewBoxX(newViewBoxX);
      setViewBoxY(newViewBoxY);
      setPreviousZoom(zoom);
    }
    
    setInitialZoom(zoom);
    
    return () => {
      // Clear any timeout on component unmount
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, [zoom, baseWidth, baseHeight, viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight, previousZoom]);

  // Initialize view to center only on first load
  useEffect(() => {
    if (previousZoom === zoom && viewBoxX === 0 && viewBoxY === 0) {
      const initialViewBoxWidth = baseWidth / zoom;
      const initialViewBoxHeight = baseHeight / zoom;
      setViewBoxX((baseWidth - initialViewBoxWidth) / 2);
      setViewBoxY((baseHeight - initialViewBoxHeight) / 2);
    }
  }, []);

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
