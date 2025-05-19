
import React, { ReactNode } from "react";

interface MapSvgContainerProps {
  children: ReactNode;
}

const MapSvgContainer = ({ children }: MapSvgContainerProps) => {
  return (
    <svg 
      viewBox="0 200 900 500" 
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full"
    >
      {children}
    </svg>
  );
};

export default MapSvgContainer;
