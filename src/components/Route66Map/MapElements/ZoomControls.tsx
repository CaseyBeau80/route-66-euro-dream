
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
  // Simple click handlers
  const handleZoomIn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 ZoomControls: Zoom IN button clicked directly');
    
    if (disabled || currentZoom >= maxZoom) {
      console.log('⚠️ Zoom in blocked - disabled or at max zoom');
      return;
    }

    console.log('🎯 ZoomControls: Calling onZoomIn');
    onZoomIn();
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 ZoomControls: Zoom OUT button clicked directly');
    
    if (disabled || currentZoom <= minZoom) {
      console.log('⚠️ Zoom out blocked - disabled or at min zoom');
      return;
    }

    console.log('🎯 ZoomControls: Calling onZoomOut');
    onZoomOut();
  };

  const isZoomInDisabled = disabled || currentZoom >= maxZoom;
  const isZoomOutDisabled = disabled || currentZoom <= minZoom;
  
  console.log('🎮 ZoomControls render state:', {
    currentZoom: Math.round(currentZoom * 10) / 10,
    isZoomInDisabled,
    isZoomOutDisabled,
    disabled,
    hasZoomInHandler: typeof onZoomIn === 'function',
    hasZoomOutHandler: typeof onZoomOut === 'function'
  });

  return (
    <div 
      className="flex flex-col gap-2 bg-white/95 p-3 rounded-lg shadow-xl border border-gray-200 backdrop-blur-sm"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Zoom In Button */}
      <button
        onClick={handleZoomIn}
        disabled={isZoomInDisabled}
        className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-200 transition-colors"
        type="button"
        title={isZoomInDisabled ? 'Maximum zoom reached' : 'Zoom in'}
        style={{ 
          pointerEvents: 'auto',
          cursor: isZoomInDisabled ? 'not-allowed' : 'pointer'
        }}
      >
        <ZoomIn className="h-6 w-6 text-gray-700" />
      </button>
      
      {/* Current Zoom Display */}
      <div className="text-xs text-center font-bold py-2 px-3 bg-gray-50 rounded border min-h-[32px] flex items-center justify-center">
        {Math.round(currentZoom * 10) / 10}
      </div>
      
      {/* Zoom Out Button */}
      <button
        onClick={handleZoomOut}
        disabled={isZoomOutDisabled}
        className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-200 transition-colors"
        type="button"
        title={isZoomOutDisabled ? 'Minimum zoom reached' : 'Zoom out'}
        style={{ 
          pointerEvents: 'auto',
          cursor: isZoomOutDisabled ? 'not-allowed' : 'pointer'
        }}
      >
        <ZoomOut className="h-6 w-6 text-gray-700" />
      </button>
    </div>
  );
};

export default ZoomControls;
