
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
  
  // Improved touch state management
  const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
  const [initialZoom, setInitialZoom] = useState<number>(zoom);
  const [lastZoomUpdate, setLastZoomUpdate] = useState<number>(Date.now());
  const touchStartRef = useRef<{x: number, y: number, time: number} | null>(null);
  
  // Update local zoom state when parent zoom changes
  useEffect(() => {
    setInitialZoom(zoom);
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
      setInitialZoom(zoom); // Save the initial zoom level when starting the pinch
      
      // Store touch start details for debugging
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      };
      
      // Log debug info
      console.log('Touch start - distance:', distance, 'initialZoom:', zoom);
    }
  };
  
  const handleTouchMove = (e: TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 2 && touchStartDistance && touchStartDistance > 0) {
      e.preventDefault(); // Prevent default browser behaviors
      
      const currentDistance = getDistance(e.touches);
      // Only process if we have a valid distance and enough time has passed since last update
      if (currentDistance > 0 && Date.now() - lastZoomUpdate > 16) { // ~60fps rate limiting
        const scaleFactor = currentDistance / touchStartDistance;
        
        // Calculate new zoom level based on the initial zoom at touch start
        // Apply exponential scaling for smoother zoom feel
        const rawZoom = initialZoom * scaleFactor;
        const newZoom = Math.max(minZoom, Math.min(maxZoom, rawZoom));
        
        // Throttle updates to prevent overwhelming the system
        setLastZoomUpdate(Date.now());
        
        // Log debug info
        console.log('Touch move - distance:', currentDistance, 'scaleFactor:', scaleFactor, 'newZoom:', newZoom);
        
        // Update zoom if handler is provided and zoom changed significantly
        if (onZoomChange && Math.abs(newZoom - zoom) > 0.01) {
          onZoomChange(newZoom);
        }
      }
    }
  };
  
  const handleTouchEnd = () => {
    // Add debug logging
    if (touchStartRef.current) {
      const touchDuration = Date.now() - touchStartRef.current.time;
      console.log('Touch end - duration:', touchDuration + 'ms', 'zoom value:', zoom);
    }
    setTouchStartDistance(null);
    touchStartRef.current = null;
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
      style={{ touchAction: "none" }} // Explicitly prevent browser touch actions
    >
      {children}
    </svg>
  );
};

export default MapSvgContainer;
