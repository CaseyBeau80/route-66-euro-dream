
import { MouseEvent } from "react";

/**
 * Creates mouse event handlers for map interaction
 */
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
  onDragStart?: () => void;
}) => {
  const handleMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
    // Call onDragStart if provided
    if (onDragStart) {
      onDragStart();
    }
  };
  
  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
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
