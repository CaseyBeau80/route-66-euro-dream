
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
  // Enhanced debugging for component lifecycle
  React.useEffect(() => {
    console.log('🎮 ZoomControls MOUNTED with handlers:', {
      onZoomIn: typeof onZoomIn,
      onZoomOut: typeof onZoomOut,
      currentZoom,
      disabled,
      timestamp: new Date().toISOString()
    });

    return () => {
      console.log('🎮 ZoomControls UNMOUNTING at:', new Date().toISOString());
    };
  }, []);

  // Track handler changes
  React.useEffect(() => {
    console.log('🔄 ZoomControls handlers changed:', {
      onZoomInType: typeof onZoomIn,
      onZoomOutType: typeof onZoomOut,
      areHandlersValid: typeof onZoomIn === 'function' && typeof onZoomOut === 'function'
    });
  }, [onZoomIn, onZoomOut]);

  // Stabilized click handlers with enhanced error handling
  const handleZoomInClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🎯 ZoomControls: Zoom IN button clicked!', {
      disabled,
      currentZoom,
      maxZoom,
      canZoomIn: currentZoom < maxZoom,
      handlerType: typeof onZoomIn,
      timestamp: new Date().toISOString()
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
      canZoomOut: currentZoom > minZoom,
      handlerType: typeof onZoomOut,
      timestamp: new Date().toISOString()
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

  // Enhanced state logging
  React.useEffect(() => {
    console.log('🎮 ZoomControls state update:', {
      currentZoom,
      minZoom,
      maxZoom,
      disabled,
      canZoomIn: currentZoom < maxZoom && !disabled,
      canZoomOut: currentZoom > minZoom && !disabled,
      handlersValid: typeof onZoomIn === 'function' && typeof onZoomOut === 'function'
    });
  }, [currentZoom, minZoom, maxZoom, disabled, onZoomIn, onZoomOut]);

  // Format zoom level for display
  const zoomPercentage = Math.round(currentZoom * 100);
  
  // Enhanced click area with visual feedback
  return (
    <div className="flex flex-col gap-2 bg-white/95 p-3 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200 pointer-events-auto">
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomInClick}
        onMouseDown={(e) => {
          console.log('🖱️ Zoom IN mousedown detected');
          e.preventDefault();
        }}
        disabled={disabled || currentZoom >= maxZoom}
        title={`Zoom in (Current: ${currentZoom.toFixed(1)})`}
        className="w-12 h-12 p-0 hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 border-2 border-gray-300 hover:border-blue-400 active:border-blue-600 active:scale-95"
        type="button"
        style={{ 
          cursor: disabled || currentZoom >= maxZoom ? 'not-allowed' : 'pointer',
          minHeight: '48px',
          minWidth: '48px'
        }}
      >
        <ZoomIn className="h-6 w-6" />
      </Button>
      
      <div className="text-xs text-center font-bold py-2 px-3 bg-gray-50 rounded border min-h-[32px] flex items-center justify-center">
        {zoomPercentage}%
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleZoomOutClick}
        onMouseDown={(e) => {
          console.log('🖱️ Zoom OUT mousedown detected');
          e.preventDefault();
        }}
        disabled={disabled || currentZoom <= minZoom}
        title={`Zoom out (Current: ${currentZoom.toFixed(1)})`}
        className="w-12 h-12 p-0 hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 border-2 border-gray-300 hover:border-blue-400 active:border-blue-600 active:scale-95"
        type="button"
        style={{ 
          cursor: disabled || currentZoom <= minZoom ? 'not-allowed' : 'pointer',
          minHeight: '48px',
          minWidth: '48px'
        }}
      >
        <ZoomOut className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ZoomControls;
