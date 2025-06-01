
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
  // Enhanced click handlers with immediate feedback
  const handleZoomInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 ZoomControls: Zoom in button CLICKED!');
    onZoomIn();
  };

  const handleZoomOutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 ZoomControls: Zoom out button CLICKED!');
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
    <div className="flex flex-col gap-2 bg-white/95 p-2 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200 pointer-events-auto">
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomInClick}
        disabled={disabled || currentZoom >= maxZoom}
        title={`Zoom in (Current: ${currentZoom})`}
        className="w-10 h-10 p-0 hover:bg-gray-100 active:bg-gray-200 transition-colors"
        type="button"
      >
        <ZoomIn className="h-5 w-5" />
      </Button>
      
      <div className="text-xs text-center font-bold py-1 px-2 bg-gray-50 rounded border">
        {zoomPercentage}%
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomOutClick}
        disabled={disabled || currentZoom <= minZoom}
        title={`Zoom out (Current: ${currentZoom})`}
        className="w-10 h-10 p-0 hover:bg-gray-100 active:bg-gray-200 transition-colors"
        type="button"
      >
        <ZoomOut className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ZoomControls;
