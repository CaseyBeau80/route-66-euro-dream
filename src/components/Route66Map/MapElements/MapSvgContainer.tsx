
import React, { ReactNode, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMapInteraction } from "../hooks/useMapInteraction";
import { 
  createMouseEventHandlers, 
  createTouchEventHandlers 
} from "../hooks/mapInteraction";

interface MapSvgContainerProps {
  children: ReactNode;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  onZoomChange?: (newZoom: number) => void;
  onDragStart?: () => void;
}

const MapSvgContainer = ({ 
  children, 
  zoom = 1,
  minZoom = 1,
  maxZoom = 4,
  onZoomChange,
  onDragStart
}: MapSvgContainerProps) => {
  // Base viewBox dimensions
  const baseWidth = 959;
  const baseHeight = 593;
  
  const svgRef = useRef<SVGSVGElement>(null);
  const isMobile = useIsMobile();
  
  // Use our custom hook for map interaction
  const {
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
  } = useMapInteraction({
    zoom,
    minZoom,
    maxZoom,
    baseWidth,
    baseHeight,
    onZoomChange
  });
  
  // Create handlers for mouse events with drag start notification
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = createMouseEventHandlers({
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
    onDragStart
  });
  
  // Create handlers for touch events with drag start notification
  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = createTouchEventHandlers({
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
    onDragStart
  });

  return (
    <svg 
      ref={svgRef}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      className={`absolute inset-0 w-full h-full transition-all duration-300 ease-in-out ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
      onTouchCancel={isMobile ? handleTouchEnd : undefined}
      style={{ touchAction: "none" }} // Explicitly prevent browser touch actions
    >
      {children}
    </svg>
  );
};

export default MapSvgContainer;
