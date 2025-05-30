
import React from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  currentZoom: number;
  minZoom: number;
  maxZoom: number;
  disabled?: boolean;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  currentZoom,
  minZoom,
  maxZoom,
  disabled = false
}) => {
  // Format zoom level as percentage
  const zoomPercentage = Math.round(currentZoom * 100);
  
  return (
    <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1 bg-white/90 p-1.5 rounded-md shadow-md backdrop-blur-sm">
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        disabled={disabled || currentZoom >= maxZoom}
        title="Zoom in"
        className="w-8 h-8 shadow-sm hover:bg-gray-100"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <div className="text-xs text-center font-medium py-1 min-w-[40px]">
        {zoomPercentage}%
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        disabled={disabled || currentZoom <= minZoom}
        title="Zoom out"
        className="w-8 h-8 shadow-sm hover:bg-gray-100"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ZoomControls;
