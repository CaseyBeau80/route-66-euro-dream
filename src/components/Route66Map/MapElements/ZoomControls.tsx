
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
  // Enhanced click handlers with logging
  const handleZoomInClick = () => {
    console.log('🎯 ZoomControls: Zoom in button clicked');
    onZoomIn();
  };

  const handleZoomOutClick = () => {
    console.log('🎯 ZoomControls: Zoom out button clicked');
    onZoomOut();
  };

  // Log current state
  React.useEffect(() => {
    console.log('🎮 ZoomControls state:', {
      currentZoom,
      minZoom,
      maxZoom,
      disabled,
      canZoomIn: currentZoom < maxZoom,
      canZoomOut: currentZoom > minZoom
    });
  }, [currentZoom, minZoom, maxZoom, disabled]);

  // Format zoom level for display
  const zoomPercentage = Math.round(currentZoom * 100);
  
  return (
    <div className="flex flex-col gap-1 bg-white/90 p-1.5 rounded-md shadow-md backdrop-blur-sm">
      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomInClick}
        disabled={disabled || currentZoom >= maxZoom}
        title={`Zoom in (Current: ${currentZoom})`}
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
        onClick={handleZoomOutClick}
        disabled={disabled || currentZoom <= minZoom}
        title={`Zoom out (Current: ${currentZoom})`}
        className="w-8 h-8 shadow-sm hover:bg-gray-100"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ZoomControls;
