
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
  
  // Touch handling for pinch zoom with improved state management
  const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
  const [initialZoom, setInitialZoom] = useState<number>(zoom);
  const [lastZoom, setLastZoom] = useState<number>(zoom);
  
  // Update local zoom state when parent zoom changes
  useEffect(() => {
    setLastZoom(zoom);
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
      setInitialZoom(lastZoom); // Save the initial zoom level when starting the pinch
      
      // Log debug info
      console.log('Touch start - distance:', distance, 'initialZoom:', lastZoom);
    }
  };
  
  const handleTouchMove = (e: TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 2 && touchStartDistance && touchStartDistance > 0) {
      e.preventDefault(); // Prevent default browser behaviors
      
      const currentDistance = getDistance(e.touches);
      // Only process if we have a valid distance
      if (currentDistance > 0) {
        const scaleFactor = currentDistance / touchStartDistance;
        
        // Calculate new zoom level based on the initial zoom at touch start
        let newZoom = initialZoom * scaleFactor;
        
        // Apply zoom constraints
        newZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
        
        // Log debug info
        console.log('Touch move - distance:', currentDistance, 'scaleFactor:', scaleFactor, 'newZoom:', newZoom);
        
        // Update zoom if handler is provided and zoom changed significantly
        if (onZoomChange && Math.abs(newZoom - lastZoom) > 0.01) {
          onZoomChange(newZoom);
          setLastZoom(newZoom);
        }
      }
    }
  };
  
  const handleTouchEnd = () => {
    console.log('Touch end - resetting touch state');
    setTouchStartDistance(null);
  };

  return (
    <svg 
      ref={svgRef}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full transition-all duration-300 ease-in-out touch-none"
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
