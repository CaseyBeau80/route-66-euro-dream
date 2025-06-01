
import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  currentZoom: number;
  minZoom: number;
  maxZoom: number;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  currentZoom,
  minZoom,
  maxZoom
}) => {
  const isZoomInDisabled = currentZoom >= maxZoom;
  const isZoomOutDisabled = currentZoom <= minZoom;

  return (
    <div 
      className="absolute bottom-20 left-6 z-50 flex flex-col gap-2 bg-white/95 p-3 rounded-lg shadow-xl border border-gray-200 backdrop-blur-sm"
      style={{ 
        pointerEvents: 'auto'
      }}
    >
      {/* Zoom In Button */}
      <button
        onClick={onZoomIn}
        disabled={isZoomInDisabled}
        className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-200 transition-colors"
        type="button"
        title={isZoomInDisabled ? 'Maximum zoom reached' : 'Zoom in'}
      >
        <ZoomIn className="h-6 w-6 text-gray-700" />
      </button>
      
      {/* Current Zoom Display */}
      <div className="text-xs text-center font-bold py-2 px-3 bg-gray-50 rounded border min-h-[32px] flex items-center justify-center">
        {Math.round(currentZoom * 10) / 10}
      </div>
      
      {/* Zoom Out Button */}
      <button
        onClick={onZoomOut}
        disabled={isZoomOutDisabled}
        className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-200 transition-colors"
        type="button"
        title={isZoomOutDisabled ? 'Minimum zoom reached' : 'Zoom out'}
      >
        <ZoomOut className="h-6 w-6 text-gray-700" />
      </button>
    </div>
  );
};

export default ZoomControls;
