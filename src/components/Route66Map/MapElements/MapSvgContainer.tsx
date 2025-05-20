
import React, { ReactNode, useState, useEffect, useRef, TouchEvent } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MapSvgContainerProps {
  children: ReactNode;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  onZoomChange?: (newZoom: number) => void;
}

const MapSvgContainer = ({ 
  children, 
  zoom = 1,
  minZoom = 1,
  maxZoom = 4,
  onZoomChange
}: MapSvgContainerProps) => {
  // Base viewBox dimensions
  const baseWidth = 959;
  const baseHeight = 593;
  const baseCenterX = baseWidth / 2;
  const baseCenterY = baseHeight / 2;
  
  // Calculate adjusted viewBox based on zoom
  const viewBoxWidth = baseWidth / zoom;
  const viewBoxHeight = baseHeight / zoom;
  
  // Calculate new viewBox origin to keep the map centered
  const viewBoxX = baseCenterX - (viewBoxWidth / 2);
  const viewBoxY = baseCenterY - (viewBoxHeight / 2);
  
  const viewBox = `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`;
  
  const svgRef = useRef<SVGSVGElement>(null);
  const isMobile = useIsMobile();
  
  // Touch handling for pinch zoom
  const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(zoom);
  
  useEffect(() => {
    setCurrentZoom(zoom);
  }, [zoom]);
  
  // Calculate distance between two touch points
  const getDistance = (touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  const handleTouchStart = (e: TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 2) {
      e.preventDefault(); // Prevent default browser pinch zoom
      const distance = getDistance(e.touches);
      setTouchStartDistance(distance);
    }
  };
  
  const handleTouchMove = (e: TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 2 && touchStartDistance) {
      e.preventDefault(); // Prevent default browser behaviors
      
      const currentDistance = getDistance(e.touches);
      const scaleFactor = currentDistance / touchStartDistance;
      
      // Calculate new zoom level
      let newZoom = currentZoom * scaleFactor;
      
      // Apply zoom constraints
      newZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
      
      // Update zoom if handler is provided
      if (onZoomChange && newZoom !== currentZoom) {
        onZoomChange(newZoom);
      }
      
      // Reset touch start distance for continuous pinching
      setTouchStartDistance(currentDistance);
      setCurrentZoom(newZoom);
    }
  };
  
  const handleTouchEnd = () => {
    setTouchStartDistance(null);
  };

  return (
    <svg 
      ref={svgRef}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full transition-all duration-300 ease-in-out"
      // Only add touch handlers on mobile devices for better performance
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
      onTouchCancel={isMobile ? handleTouchEnd : undefined}
    >
      {children}
    </svg>
  );
};

export default MapSvgContainer;
