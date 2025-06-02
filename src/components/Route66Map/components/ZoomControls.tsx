
import React, { useState, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface ZoomControlsProps {
  map: google.maps.Map | null;
  isMapReady: boolean;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ map, isMapReady }) => {
  const [currentZoom, setCurrentZoom] = useState(4);
  const [isZooming, setIsZooming] = useState(false);

  // Sync zoom level with map
  useEffect(() => {
    if (!map || !isMapReady) {
      console.log('🎮 ZoomControls: Map not ready for zoom sync');
      return;
    }

    const updateZoomLevel = () => {
      const zoom = map.getZoom();
      if (zoom !== undefined) {
        console.log('🎮 ZoomControls: Map zoom changed to:', zoom);
        setCurrentZoom(zoom);
      }
    };

    // Set initial zoom immediately
    const initialZoom = map.getZoom();
    if (initialZoom !== undefined) {
      console.log('🎮 ZoomControls: Setting initial zoom:', initialZoom);
      setCurrentZoom(initialZoom);
    }

    // Listen for zoom changes
    const zoomListener = map.addListener('zoom_changed', updateZoomLevel);

    return () => {
      if (zoomListener) {
        google.maps.event.removeListener(zoomListener);
      }
    };
  }, [map, isMapReady]);

  const handleZoomIn = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!map || !isMapReady || isZooming) {
      console.log('🎮 ZoomControls: Zoom in blocked');
      return;
    }

    const currentMapZoom = map.getZoom();
    if (currentMapZoom === undefined || currentMapZoom >= 18) {
      console.log('🎮 ZoomControls: Already at maximum zoom');
      return;
    }

    console.log('🎮 ZoomControls: Zooming in from:', currentMapZoom);
    setIsZooming(true);
    
    const newZoom = Math.min(currentMapZoom + 1, 18);
    console.log('🎮 ZoomControls: Setting new zoom to:', newZoom);
    
    map.setZoom(newZoom);
    
    // Reset zooming state
    setTimeout(() => {
      setIsZooming(false);
    }, 500);
  }, [map, isMapReady, isZooming]);

  const handleZoomOut = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!map || !isMapReady || isZooming) {
      console.log('🎮 ZoomControls: Zoom out blocked');
      return;
    }

    const currentMapZoom = map.getZoom();
    if (currentMapZoom === undefined || currentMapZoom <= 3) {
      console.log('🎮 ZoomControls: Already at minimum zoom');
      return;
    }

    console.log('🎮 ZoomControls: Zooming out from:', currentMapZoom);
    setIsZooming(true);
    
    const newZoom = Math.max(currentMapZoom - 1, 3);
    console.log('🎮 ZoomControls: Setting new zoom to:', newZoom);
    
    map.setZoom(newZoom);
    
    // Reset zooming state
    setTimeout(() => {
      setIsZooming(false);
    }, 500);
  }, [map, isMapReady, isZooming]);

  // Don't render if map isn't ready
  if (!isMapReady || !map) {
    return null;
  }

  const isZoomInDisabled = currentZoom >= 18 || isZooming;
  const isZoomOutDisabled = currentZoom <= 3 || isZooming;

  console.log('🎮 ZoomControls: Rendering with zoom:', currentZoom);

  return (
    <div 
      className="absolute bottom-20 left-6 z-[1000] flex flex-col gap-2 bg-white/95 p-3 rounded-lg shadow-xl border border-gray-200 backdrop-blur-sm"
      style={{ 
        pointerEvents: 'auto',
        position: 'absolute',
        zIndex: 1000
      }}
    >
      {/* Zoom In Button */}
      <button
        onClick={handleZoomIn}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        disabled={isZoomInDisabled}
        className={`w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
          isZooming ? 'scale-95 bg-blue-100 border-blue-500' : 'active:bg-blue-100 active:scale-95'
        }`}
        type="button"
        title={isZoomInDisabled ? 'Maximum zoom reached' : 'Zoom in'}
        style={{ pointerEvents: 'auto' }}
      >
        <ZoomIn className={`h-6 w-6 text-gray-700 ${isZooming ? 'animate-pulse text-blue-600' : ''}`} />
      </button>
      
      {/* Current Zoom Display */}
      <div className="text-xs text-center font-bold py-2 px-3 bg-gray-50 rounded border min-h-[32px] flex items-center justify-center">
        <span className="text-gray-800">{Math.round(currentZoom * 10) / 10}</span>
        {isZooming && <span className="ml-1 text-blue-600 animate-pulse">•</span>}
      </div>
      
      {/* Zoom Out Button */}
      <button
        onClick={handleZoomOut}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        disabled={isZoomOutDisabled}
        className={`w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
          isZooming ? 'scale-95 bg-blue-100 border-blue-500' : 'active:bg-blue-100 active:scale-95'
        }`}
        type="button"
        title={isZoomOutDisabled ? 'Minimum zoom reached' : 'Zoom out'}
        style={{ pointerEvents: 'auto' }}
      >
        <ZoomOut className={`h-6 w-6 text-gray-700 ${isZooming ? 'animate-pulse text-blue-600' : ''}`} />
      </button>
    </div>
  );
};

export default ZoomControls;
