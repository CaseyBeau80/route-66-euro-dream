
import React from "react";
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
  // Simple zoom handlers
  const handleZoomIn = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 ZoomControls: Zoom IN clicked');
    
    if (disabled || currentZoom >= maxZoom) {
      console.log('⚠️ Zoom in disabled or at max zoom');
      return;
    }

    onZoomIn();
  }, [disabled, currentZoom, maxZoom, onZoomIn]);

  const handleZoomOut = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 ZoomControls: Zoom OUT clicked');
    
    if (disabled || currentZoom <= minZoom) {
      console.log('⚠️ Zoom out disabled or at min zoom');
      return;
    }

    onZoomOut();
  }, [disabled, currentZoom, minZoom, onZoomOut]);

  const isZoomInDisabled = disabled || currentZoom >= maxZoom;
  const isZoomOutDisabled = disabled || currentZoom <= minZoom;
  
  console.log('🎮 ZoomControls render:', {
    currentZoom: Math.round(currentZoom * 10) / 10,
    isZoomInDisabled,
    isZoomOutDisabled,
    disabled
  });

  return (
    <div className="flex flex-col gap-2 bg-white/95 p-3 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200">
      {/* Zoom In Button */}
      <button
        onClick={handleZoomIn}
        disabled={isZoomInDisabled}
        className="w-12 h-12 p-0 border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-200 rounded flex items-center justify-center transition-colors"
        type="button"
        title={isZoomInDisabled ? 'Maximum zoom reached' : 'Zoom in'}
      >
        <ZoomIn className="h-6 w-6" />
      </button>
      
      {/* Current Zoom Display */}
      <div className="text-xs text-center font-bold py-2 px-3 bg-gray-50 rounded border min-h-[32px] flex items-center justify-center">
        {Math.round(currentZoom * 10) / 10}
      </div>
      
      {/* Zoom Out Button */}
      <button
        onClick={handleZoomOut}
        disabled={isZoomOutDisabled}
        className="w-12 h-12 p-0 border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-200 rounded flex items-center justify-center transition-colors"
        type="button"
        title={isZoomOutDisabled ? 'Minimum zoom reached' : 'Zoom out'}
      >
        <ZoomOut className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ZoomControls;
