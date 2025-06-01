
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
  // Enhanced click handlers with multiple event types for maximum compatibility
  const handleZoomInAction = React.useCallback(() => {
    console.log('🎯 ZoomControls: Zoom IN ACTION triggered, disabled:', disabled, 'currentZoom:', currentZoom);
    
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
  }, [disabled, currentZoom, maxZoom, onZoomIn]);

  const handleZoomOutAction = React.useCallback(() => {
    console.log('🎯 ZoomControls: Zoom OUT ACTION triggered, disabled:', disabled, 'currentZoom:', currentZoom);
    
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
  }, [disabled, currentZoom, minZoom, onZoomOut]);

  // Comprehensive event handlers that capture ALL possible interaction types
  const createEventHandler = (action: () => void, actionName: string) => {
    return (e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
      console.log(`🔥 ${actionName} event captured:`, e.type, e.target);
      e.preventDefault();
      e.stopPropagation();
      action();
    };
  };

  const handleZoomInClick = createEventHandler(handleZoomInAction, 'ZOOM_IN');
  const handleZoomOutClick = createEventHandler(handleZoomOutAction, 'ZOOM_OUT');

  // Additional mouse and touch handlers for fallback
  const handleZoomInMouseDown = (e: React.MouseEvent) => {
    console.log('🖱️ Zoom IN mousedown captured');
    e.preventDefault();
    e.stopPropagation();
    handleZoomInAction();
  };

  const handleZoomOutMouseDown = (e: React.MouseEvent) => {
    console.log('🖱️ Zoom OUT mousedown captured');
    e.preventDefault();
    e.stopPropagation();
    handleZoomOutAction();
  };

  const handleZoomInTouchStart = (e: React.TouchEvent) => {
    console.log('👆 Zoom IN touchstart captured');
    e.preventDefault();
    e.stopPropagation();
    handleZoomInAction();
  };

  const handleZoomOutTouchStart = (e: React.TouchEvent) => {
    console.log('👆 Zoom OUT touchstart captured');
    e.preventDefault();
    e.stopPropagation();
    handleZoomOutAction();
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
    <div 
      className="flex flex-col gap-2 bg-white/95 p-3 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200"
      style={{ 
        zIndex: 9999, 
        position: 'relative',
        pointerEvents: 'auto'
      }}
      onMouseDown={(e) => console.log('🔍 Container mousedown:', e.target)}
      onTouchStart={(e) => console.log('🔍 Container touchstart:', e.target)}
    >
      {/* Native button for zoom in with comprehensive event handling */}
      <button
        onClick={handleZoomInClick}
        onMouseDown={handleZoomInMouseDown}
        onTouchStart={handleZoomInTouchStart}
        disabled={isZoomInDisabled}
        className="w-12 h-12 p-0 border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-200 rounded flex items-center justify-center transition-colors"
        style={{ 
          zIndex: 10000, 
          pointerEvents: isZoomInDisabled ? 'none' : 'auto',
          position: 'relative'
        }}
        type="button"
        title={isZoomInDisabled ? 'Maximum zoom reached' : 'Zoom in'}
      >
        <ZoomIn className="h-6 w-6" />
      </button>
      
      <div className="text-xs text-center font-bold py-2 px-3 bg-gray-50 rounded border min-h-[32px] flex items-center justify-center">
        {Math.round(currentZoom * 10) / 10}
      </div>
      
      {/* Native button for zoom out with comprehensive event handling */}
      <button
        onClick={handleZoomOutClick}
        onMouseDown={handleZoomOutMouseDown}
        onTouchStart={handleZoomOutTouchStart}
        disabled={isZoomOutDisabled}
        className="w-12 h-12 p-0 border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-200 rounded flex items-center justify-center transition-colors"
        style={{ 
          zIndex: 10000, 
          pointerEvents: isZoomOutDisabled ? 'none' : 'auto',
          position: 'relative'
        }}
        type="button"
        title={isZoomOutDisabled ? 'Minimum zoom reached' : 'Zoom out'}
      >
        <ZoomOut className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ZoomControls;
