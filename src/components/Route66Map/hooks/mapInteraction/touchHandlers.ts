
import { TouchEvent } from "react";

/**
 * Creates touch event handlers for map interaction including pinch-to-zoom
 */
export const createTouchEventHandlers = ({
  setIsDragging,
  setLastPosition,
  isDragging,
  lastPosition,
  setViewBoxX,
  setViewBoxY,
  zoom,
  baseWidth,
  baseHeight,
  viewBoxWidth,
  viewBoxHeight,
  isPinching,
  touchStartDistance,
  getDistance,
  onZoomChange,
  minZoom,
  maxZoom,
  initialZoom,
  setTouchStartDistance,
  setInitialZoom,
  setIsPinching,
  touchTimeoutRef,
  SENSITIVITY_FACTOR,
  onDragStart,
}: {
  setIsDragging: (isDragging: boolean) => void;
  setLastPosition: (position: { x: number; y: number }) => void;
  isDragging: boolean;
  lastPosition: { x: number; y: number };
  setViewBoxX: (x: number | ((prev: number) => number)) => void;
  setViewBoxY: (y: number | ((prev: number) => number)) => void;
  zoom: number;
  baseWidth: number;
  baseHeight: number;
  viewBoxWidth: number;
  viewBoxHeight: number;
  isPinching: boolean;
  touchStartDistance: number | null;
  getDistance: (touches: React.TouchList) => number;
  onZoomChange?: (newZoom: number) => void;
  minZoom: number;
  maxZoom: number;
  initialZoom: number;
  setTouchStartDistance: (distance: number | null) => void;
  setInitialZoom: (zoom: number) => void;
  setIsPinching: (isPinching: boolean) => void;
  touchTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  SENSITIVITY_FACTOR: number;
  onDragStart?: () => void;
}) => {
  const handleTouchStart = (e: TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1) {
      // Single touch for panning
      setIsDragging(true);
      setLastPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      
      // Call onDragStart if provided
      if (onDragStart) {
        onDragStart();
      }
    } else if (e.touches.length === 2) {
      console.log("[TouchStart] Detected 2 touch points - starting pinch");
      e.preventDefault(); // Prevent default browser pinch zoom
      
      const distance = getDistance(e.touches);
      setTouchStartDistance(distance);
      setInitialZoom(zoom);
      setIsPinching(true);
      
      console.log(`[TouchStart] Initial distance: ${distance.toFixed(2)}, Initial zoom: ${zoom}`);
    }
  };
  
  const handleTouchMove = (e: TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1 && isDragging && !isPinching) {
      // Handle panning (single touch)
      handleSingleTouchMove(e);
    } else if (e.touches.length === 2 && touchStartDistance && touchStartDistance > 0 && isPinching) {
      // Handle pinch zoom (two touches)
      handlePinchZoom(e);
    }
  };
  
  // Helper for single touch panning
  const handleSingleTouchMove = (e: TouchEvent<SVGSVGElement>) => {
    const touch = e.touches[0];
    const dx = touch.clientX - lastPosition.x;
    const dy = touch.clientY - lastPosition.y;
    
    // Scale the drag amount based on current zoom level
    const scaledDx = dx / zoom;
    const scaledDy = dy / zoom;
    
    // Calculate boundaries to prevent excessive panning
    const maxPanX = baseWidth - viewBoxWidth;
    const maxPanY = baseHeight - viewBoxHeight;
    
    // Update viewBox position with boundaries
    setViewBoxX((prev) => Math.min(Math.max(prev - scaledDx, 0), maxPanX));
    setViewBoxY((prev) => Math.min(Math.max(prev - scaledDy, 0), maxPanY));
    
    // Update last position
    setLastPosition({ x: touch.clientX, y: touch.clientY });
  };
  
  // Helper for pinch zoom handling
  const handlePinchZoom = (e: TouchEvent<SVGSVGElement>) => {
    e.preventDefault(); // Prevent default browser behaviors
    e.stopPropagation();
    
    const currentDistance = getDistance(e.touches);
    
    if (currentDistance > 0) {
      // Calculate scale factor with improved sensitivity
      const rawScaleDelta = (currentDistance - touchStartDistance!) / touchStartDistance!;
      
      // Apply sensitivity adjustment and smooth the changes
      const adjustedScale = 1 + (rawScaleDelta * SENSITIVITY_FACTOR);
      
      // Apply the scale factor to initial zoom level with smoothing
      const newZoom = Math.max(
        minZoom, 
        Math.min(maxZoom, initialZoom * adjustedScale)
      );
      
      // Only update if the change is significant enough
      if (onZoomChange && Math.abs(newZoom - zoom) > 0.01) {
        console.log(`[TouchMove] Distance delta: ${(currentDistance - touchStartDistance!).toFixed(2)}, Adjusted scale: ${adjustedScale.toFixed(3)}, NewZoom: ${newZoom.toFixed(2)}`);
        onZoomChange(newZoom);
      }
    }
  };
  
  const handleTouchEnd = (e: TouchEvent<SVGSVGElement>) => {
    console.log("[TouchEnd] Touch ended, isPinching:", isPinching);
    
    // End dragging on touch end
    setIsDragging(false);
    
    // Add a small delay before resetting pinch state to catch quick touch changes
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }
    
    touchTimeoutRef.current = setTimeout(() => {
      setTouchStartDistance(null);
      setIsPinching(false);
      console.log("[TouchEnd] Pinch state reset");
    }, 200);
    
    // If this was a multi-touch event that ended
    if (e.touches.length < 2 && isPinching) {
      console.log("[TouchEnd] Multi-touch ended, final zoom:", zoom);
    }
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};
