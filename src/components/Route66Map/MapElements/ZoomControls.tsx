
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
  // Simplified click handlers with better error handling
  const handleZoomInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🎯 ZoomControls: Zoom IN button clicked, disabled:', disabled, 'currentZoom:', currentZoom);
    
    if (disabled) {
      console.log('⚠️ Zoom controls are disabled');
      return;
    }

    if (currentZoom >= maxZoom) {
      console.log('⚠️ Already at max zoom level');
      return;
    }

    try {
      onZoomIn();
      console.log('✅ Zoom in function called successfully');
    } catch (error) {
      console.error('❌ Error calling zoom in:', error);
    }
  };

  const handleZoomOutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🎯 ZoomControls: Zoom OUT button clicked, disabled:', disabled, 'currentZoom:', currentZoom);
    
    if (disabled) {
      console.log('⚠️ Zoom controls are disabled');
      return;
    }

    if (currentZoom <= minZoom) {
      console.log('⚠️ Already at min zoom level');
      return;
    }

    try {
      onZoomOut();
      console.log('✅ Zoom out function called successfully');
    } catch (error) {
      console.error('❌ Error calling zoom out:', error);
    }
  };

  const isZoomInDisabled = disabled || currentZoom >= maxZoom;
  const isZoomOutDisabled = disabled || currentZoom <= minZoom;
  
  console.log('🎮 ZoomControls render:', {
    currentZoom: Math.round(currentZoom * 10) / 10,
    isZoomInDisabled,
    isZoomOutDisabled,
    disabled,
    minZoom,
    maxZoom
  });

  return (
    <div className="flex flex-col gap-2 bg-white/95 p-3 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200">
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomInClick}
        disabled={isZoomInDisabled}
        className="w-12 h-12 p-0 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-200"
        type="button"
        title={isZoomInDisabled ? 'Maximum zoom reached' : 'Zoom in'}
      >
        <ZoomIn className="h-6 w-6" />
      </Button>
      
      <div className="text-xs text-center font-bold py-2 px-3 bg-gray-50 rounded border min-h-[32px] flex items-center justify-center">
        {Math.round(currentZoom * 10) / 10}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomOutClick}
        disabled={isZoomOutDisabled}
        className="w-12 h-12 p-0 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-200"
        type="button"
        title={isZoomOutDisabled ? 'Minimum zoom reached' : 'Zoom out'}
      >
        <ZoomOut className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ZoomControls;
