
import { useState, useRef, useCallback } from 'react';

interface UseSvgMapInteractionProps {
  zoom: number;
  minZoom: number;
  maxZoom: number;
  baseWidth: number;
  baseHeight: number;
  onZoomChange?: (newZoom: number) => void;
}

export const useSvgMapInteraction = ({
  zoom,
  minZoom,
  maxZoom,
  baseWidth,
  baseHeight,
  onZoomChange
}: UseSvgMapInteractionProps) => {
  // View box state
  const [viewBoxX, setViewBoxX] = useState(0);
  const [viewBoxY, setViewBoxY] = useState(0);
  
  // Interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [isPinching, setIsPinching] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
  const [initialZoom, setInitialZoom] = useState(zoom);
  
  // Refs for timeouts and interaction
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Constants
  const SENSITIVITY_FACTOR = 1.5;
  
  // Calculate view box dimensions based on zoom
  const viewBoxWidth = baseWidth / zoom;
  const viewBoxHeight = baseHeight / zoom;
  
  // Calculate view box string
  const viewBox = `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`;
  
  // Utility function to get distance between two touch points
  const getDistance = useCallback((touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    
    const touch1 = touches[0];
    const touch2 = touches[1];
    
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    
    return Math.sqrt(dx * dx + dy * dy);
  }, []);
  
  // Function to capture zoom center (placeholder for now)
  const captureZoomCenter = useCallback(() => {
    console.log('📍 Capturing zoom center for SVG map');
    // This would capture the current center point for zoom operations
  }, []);
  
  return {
    // View box properties
    viewBox,
    viewBoxWidth,
    viewBoxHeight,
    
    // State properties
    isDragging,
    isPinching,
    touchStartDistance,
    lastPosition,
    initialZoom,
    
    // State setters
    setIsDragging,
    setLastPosition,
    setViewBoxX,
    setViewBoxY,
    setTouchStartDistance,
    setInitialZoom,
    setIsPinching,
    
    // Refs and utilities
    touchTimeoutRef,
    getDistance,
    SENSITIVITY_FACTOR,
    captureZoomCenter
  };
};
