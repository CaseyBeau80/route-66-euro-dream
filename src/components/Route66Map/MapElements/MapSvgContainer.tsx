
import React, { ReactNode } from "react";

interface MapSvgContainerProps {
  children: ReactNode;
}

const MapSvgContainer = ({ children }: MapSvgContainerProps) => {
  return (
    <svg 
      viewBox="0 0 959 593" 
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full"
    >
      {children}
    </svg>
  );
};

export default MapSvgContainer;
