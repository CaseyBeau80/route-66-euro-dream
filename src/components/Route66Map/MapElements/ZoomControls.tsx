
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
  // Stabilized click handlers with immediate execution
  const handleZoomInClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🎯 ZoomControls: Zoom IN button clicked!', {
      disabled,
      currentZoom,
      maxZoom,
      canZoomIn: currentZoom < maxZoom
    });

    if (disabled || currentZoom >= maxZoom) {
      console.log('⚠️ Zoom in blocked - disabled or at max zoom');
      return;
    }

    if (typeof onZoomIn === 'function') {
      try {
        onZoomIn();
        console.log('✅ onZoomIn handler executed successfully');
      } catch (error) {
        console.error('❌ Error executing onZoomIn:', error);
      }
    } else {
      console.error('❌ onZoomIn is not a function:', typeof onZoomIn);
    }
  }, [onZoomIn, disabled, currentZoom, maxZoom]);

  const handleZoomOutClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🎯 ZoomControls: Zoom OUT button clicked!', {
      disabled,
      currentZoom,
      minZoom,
      canZoomOut: currentZoom > minZoom
    });

    if (disabled || currentZoom <= minZoom) {
      console.log('⚠️ Zoom out blocked - disabled or at min zoom');
      return;
    }

    if (typeof onZoomOut === 'function') {
      try {
        onZoomOut();
        console.log('✅ onZoomOut handler executed successfully');
      } catch (error) {
        console.error('❌ Error executing onZoomOut:', error);
      }
    } else {
      console.error('❌ onZoomOut is not a function:', typeof onZoomOut);
    }
  }, [onZoomOut, disabled, currentZoom, minZoom]);

  // Check if buttons should be disabled
  const isZoomInDisabled = disabled || currentZoom >= maxZoom;
  const isZoomOutDisabled = disabled || currentZoom <= minZoom;

  // Format zoom level for display
  const zoomPercentage = Math.round(currentZoom * 10);
  
  console.log('🎮 ZoomControls render:', {
    currentZoom,
    isZoomInDisabled,
    isZoomOutDisabled,
    zoomPercentage
  });

  return (
    <div className="flex flex-col gap-2 bg-white/95 p-3 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200 pointer-events-auto">
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomInClick}
        disabled={isZoomInDisabled}
        title={`Zoom in (Current: ${currentZoom.toFixed(1)})`}
        className="w-12 h-12 p-0 hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 border-2 border-gray-300 hover:border-blue-400 active:border-blue-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
      >
        <ZoomIn className="h-6 w-6" />
      </Button>
      
      <div className="text-xs text-center font-bold py-2 px-3 bg-gray-50 rounded border min-h-[32px] flex items-center justify-center">
        {zoomPercentage}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomOutClick}
        disabled={isZoomOutDisabled}
        title={`Zoom out (Current: ${currentZoom.toFixed(1)})`}
        className="w-12 h-12 p-0 hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 border-2 border-gray-300 hover:border-blue-400 active:border-blue-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
      >
        <ZoomOut className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ZoomControls;
