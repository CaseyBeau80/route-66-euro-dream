
import { TouchEvent } from "react";
import { TouchHandlerProps } from "./types";

/**
 * Creates touch event handlers for map interaction (pan and pinch-zoom)
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
}: TouchHandlerProps) => {
  // Handle touch start - detect single touch (pan) or multi-touch (pinch)
  const handleTouchStart = (e: TouchEvent<SVGSVGElement>) => {
    // Clear any existing timeout for touch end detection
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
    }
    
    if (e.touches.length === 1) {
      // Single touch - prepare for panning
      setIsDragging(true);
      setLastPosition({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
      
      // Call the onDragStart callback if provided
      if (onDragStart) {
        onDragStart();
      }
      
      console.log("[TouchStart] Single touch started");
    } 
    else if (e.touches.length === 2) {
      // Two touches - prepare for pinch zoom
      const distance = getDistance(e.touches);
      setIsPinching(true);
      setTouchStartDistance(distance);
      setInitialZoom(zoom);
      
      console.log(`[TouchStart] Detected 2 touch points - starting pinch`);
      console.log(`[TouchStart] Initial distance: ${distance.toFixed(2)}, Initial zoom: ${zoom}`);
    }
  };
  
  // Handle touch move - pan or pinch zoom based on number of touches
  const handleTouchMove = (e: TouchEvent<SVGSVGElement>) => {
    // Prevent default to stop screen from scrolling
    e.preventDefault();
    
    if (isPinching && e.touches.length === 2 && touchStartDistance) {
      // Handle pinch zoom
      const currentDistance = getDistance(e.touches);
      const distanceDelta = currentDistance - touchStartDistance;
      const scale = 1 + (distanceDelta / (touchStartDistance * SENSITIVITY_FACTOR));
      let newZoom = Math.min(Math.max(initialZoom * scale, minZoom), maxZoom);
      
      console.log(`[TouchMove] Distance delta: ${distanceDelta.toFixed(2)}, Adjusted scale: ${scale.toFixed(3)}, NewZoom: ${newZoom.toFixed(2)}`);
      
      // Update zoom if changed significantly
      if (Math.abs(newZoom - zoom) > 0.01 && onZoomChange) {
        onZoomChange(newZoom);
      }
    } 
    else if (isDragging && e.touches.length === 1) {
      // Handle panning with single touch
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      
      const dx = touchX - lastPosition.x;
      const dy = touchY - lastPosition.y;
      
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
      setLastPosition({ x: touchX, y: touchY });
    }
  };
  
  // Handle touch end - reset states
  const handleTouchEnd = (e: TouchEvent<SVGSVGElement>) => {
    console.log(`[TouchEnd] Touch ended, isPinching: ${isPinching}`);
    
    // If we were pinching and still have active touches
    if (isPinching && e.touches.length < 2) {
      console.log(`[TouchEnd] Multi-touch ended, final zoom: ${zoom}`);
      
      // Set a timeout to reset pinch state - this helps prevent immediate pan
      // after a pinch operation ends
      touchTimeoutRef.current = setTimeout(() => {
        setIsPinching(false);
        setTouchStartDistance(null);
        console.log(`[TouchEnd] Pinch state reset`);
      }, 100);
    }
    
    // If no touches remain, reset dragging state
    if (e.touches.length === 0) {
      setIsDragging(false);
    }
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};
