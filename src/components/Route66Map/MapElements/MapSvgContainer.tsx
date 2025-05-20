
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
  
  // State for panning functionality
  const [viewBoxX, setViewBoxX] = useState(0);
  const [viewBoxY, setViewBoxY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  
  // Calculate adjusted viewBox based on zoom
  const viewBoxWidth = baseWidth / zoom;
  const viewBoxHeight = baseHeight / zoom;
  
  // Construct viewBox string with current pan position
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
  
  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
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
  
  // Handle touch events for mobile
  const handleTouchStart = (e: TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1) {
      // Single touch for panning
      setIsDragging(true);
      setLastPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
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

  // Reset the view to center (for external controls)
  const resetView = () => {
    setViewBoxX((baseWidth - viewBoxWidth) / 2);
    setViewBoxY((baseHeight - viewBoxHeight) / 2);
  };

  // Center the view on component mount and when zoom changes
  useEffect(() => {
    resetView();
  }, [zoom, viewBoxWidth, viewBoxHeight]);

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
