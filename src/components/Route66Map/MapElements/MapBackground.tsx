
import React, { ReactNode } from "react";

interface MapBackgroundProps {
  children: ReactNode;
}

const MapBackground = ({ children }: MapBackgroundProps) => {
  return (
    <div className="absolute inset-0 rounded-xl bg-[#f5f5f5] overflow-hidden">
      {children}
    </div>
  );
};

export default MapBackground;
