import React, { ReactNode, useState, useEffect } from "react";

interface MapSvgContainerProps {
  children: ReactNode;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
}

const MapSvgContainer = ({ 
  children, 
  zoom = 1,
  minZoom = 1,
  maxZoom = 4 
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

  return (
    <svg 
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full transition-all duration-300 ease-in-out"
    >
      {children}
    </svg>
  );
};

export default MapSvgContainer;
