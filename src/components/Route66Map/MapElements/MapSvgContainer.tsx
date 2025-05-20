
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
  
  // Track touch points for pinch detection with improved sensitivity
  const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
  const [initialZoom, setInitialZoom] = useState<number>(zoom);
  const [isPinching, setIsPinching] = useState<boolean>(false);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Sensitivity adjustment factor - lower number means more sensitive zoom
  const SENSITIVITY_FACTOR = 0.5;
  
  // Update local zoom state when parent zoom changes
  useEffect(() => {
    setInitialZoom(zoom);
    
    return () => {
      // Clear any timeout on component unmount
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
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
    if (e.touches.length === 2 && touchStartDistance && touchStartDistance > 0 && isPinching) {
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
