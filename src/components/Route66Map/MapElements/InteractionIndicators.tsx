
import React from "react";
import { Touchpad, Move } from "lucide-react";

interface InteractionIndicatorsProps {
  isPinching: boolean;
  zoomActivity: boolean;
  isDragging: boolean;
  zoom: number;
}

const InteractionIndicators = ({
  isPinching,
  zoomActivity,
  isDragging,
  zoom
}: InteractionIndicatorsProps) => {
  return (
    <>
      {/* Add interaction indicators for mobile devices */}
      <div className="absolute top-2 right-4 bg-white/90 p-1.5 rounded-md shadow-md backdrop-blur-sm md:hidden flex items-center gap-1 transition-all text-xs">
        {isPinching || zoomActivity ? (
          <div className={`flex items-center gap-1 ${isPinching || zoomActivity ? 'bg-blue-100 scale-110' : ''}`}>
            <Touchpad className={`h-3 w-3 ${isPinching || zoomActivity ? 'text-blue-500 animate-pulse' : ''}`} />
            <span>Pinch to zoom {zoom.toFixed(1)}x</span>
          </div>
        ) : (
          <div className={`flex items-center gap-1 ${isDragging ? 'bg-green-100 scale-110' : ''}`}>
            <Move className={`h-3 w-3 ${isDragging ? 'text-green-500 animate-pulse' : ''}`} />
            <span>Drag to move</span>
          </div>
        )}
      </div>
      
      {/* Add desktop drag hint */}
      <div className="absolute bottom-24 right-4 bg-white/90 p-1.5 rounded-md shadow-md backdrop-blur-sm hidden md:flex items-center gap-1 text-xs">
        <Move className="h-3 w-3" />
        <span>Click and drag to explore</span>
      </div>
    </>
  );
};

export default InteractionIndicators;
