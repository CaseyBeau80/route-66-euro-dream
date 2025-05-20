
import { TouchEvent } from "react";

// Mouse event handlers
export const createMouseEventHandlers = ({
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
  onDragStart,
}) => {
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
    // Call onDragStart if provided
    if (onDragStart) {
      onDragStart();
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    
    const dx = e.clientX - lastPosition.x;
    const dy = e.clientY - lastPosition.y;
    
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
    setLastPosition({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};

// Touch event handlers
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
    } else if (e.touches.length === 2 && touchStartDistance && touchStartDistance > 0 && isPinching) {
      e.preventDefault(); // Prevent default browser behaviors
      e.stopPropagation();
      
      const currentDistance = getDistance(e.touches);
      
      if (currentDistance > 0) {
        // Calculate scale factor with improved sensitivity
        const rawScaleDelta = (currentDistance - touchStartDistance) / touchStartDistance;
        
        // Apply sensitivity adjustment and smooth the changes
        const adjustedScale = 1 + (rawScaleDelta * SENSITIVITY_FACTOR);
        
        // Apply the scale factor to initial zoom level with smoothing
        const newZoom = Math.max(
          minZoom, 
          Math.min(maxZoom, initialZoom * adjustedScale)
        );
        
        // Only update if the change is significant enough
        if (onZoomChange && Math.abs(newZoom - zoom) > 0.01) {
          console.log(`[TouchMove] Distance delta: ${(currentDistance - touchStartDistance).toFixed(2)}, Adjusted scale: ${adjustedScale.toFixed(3)}, NewZoom: ${newZoom.toFixed(2)}`);
          onZoomChange(newZoom);
        }
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
