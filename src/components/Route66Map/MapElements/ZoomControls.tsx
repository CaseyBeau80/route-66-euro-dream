
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
  // Direct click handlers with immediate execution
  const handleZoomInClick = React.useCallback(() => {
    console.log('🎯 ZoomControls: Zoom IN button clicked directly!');
    
    if (disabled || currentZoom >= maxZoom) {
      console.log('⚠️ Zoom in blocked - disabled or at max zoom');
      return;
    }

    // Call the zoom function immediately
    onZoomIn();
  }, [onZoomIn, disabled, currentZoom, maxZoom]);

  const handleZoomOutClick = React.useCallback(() => {
    console.log('🎯 ZoomControls: Zoom OUT button clicked directly!');
    
    if (disabled || currentZoom <= minZoom) {
      console.log('⚠️ Zoom out blocked - disabled or at min zoom');
      return;
    }

    // Call the zoom function immediately
    onZoomOut();
  }, [onZoomOut, disabled, currentZoom, minZoom]);

  const isZoomInDisabled = disabled || currentZoom >= maxZoom;
  const isZoomOutDisabled = disabled || currentZoom <= minZoom;
  
  console.log('🎮 ZoomControls render:', {
    currentZoom,
    isZoomInDisabled,
    isZoomOutDisabled,
    disabled
  });

  return (
    <div className="flex flex-col gap-2 bg-white/95 p-3 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200">
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomInClick}
        disabled={isZoomInDisabled}
        className="w-12 h-12 p-0 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
      >
        <ZoomIn className="h-6 w-6" />
      </Button>
      
      <div className="text-xs text-center font-bold py-2 px-3 bg-gray-50 rounded border min-h-[32px] flex items-center justify-center">
        {Math.round(currentZoom * 10)}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomOutClick}
        disabled={isZoomOutDisabled}
        className="w-12 h-12 p-0 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
      >
        <ZoomOut className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ZoomControls;
