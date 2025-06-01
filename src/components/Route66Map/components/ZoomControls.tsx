
import React, { useState, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface ZoomControlsProps {
  map: google.maps.Map | null;
  isMapReady: boolean;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ map, isMapReady }) => {
  const [currentZoom, setCurrentZoom] = useState(4);
  const [isZooming, setIsZooming] = useState(false);

  // Update zoom level when map zoom changes
  useEffect(() => {
    if (!map || !isMapReady) return;

    const updateZoomLevel = () => {
      const zoom = map.getZoom();
      if (zoom !== undefined) {
        setCurrentZoom(zoom);
        console.log('🎮 Zoom level updated:', Math.round(zoom * 10) / 10);
      }
    };

    // Set initial zoom
    updateZoomLevel();

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
      console.log('⚠️ Zoom in blocked:', { hasMap: !!map, isMapReady, isZooming });
      return;
    }

    console.log('🎯 Zooming in from:', currentZoom);
    setIsZooming(true);
    
    try {
      const newZoom = Math.min(currentZoom + 1, 18);
      map.setZoom(newZoom);
      console.log('✅ Zoom in completed:', newZoom);
      
      // Reset zooming state after a delay
      setTimeout(() => setIsZooming(false), 300);
    } catch (error) {
      console.error('❌ Error zooming in:', error);
      setIsZooming(false);
    }
  }, [map, isMapReady, currentZoom, isZooming]);

  const handleZoomOut = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!map || !isMapReady || isZooming) {
      console.log('⚠️ Zoom out blocked:', { hasMap: !!map, isMapReady, isZooming });
      return;
    }

    console.log('🎯 Zooming out from:', currentZoom);
    setIsZooming(true);
    
    try {
      const newZoom = Math.max(currentZoom - 1, 3);
      map.setZoom(newZoom);
      console.log('✅ Zoom out completed:', newZoom);
      
      // Reset zooming state after a delay
      setTimeout(() => setIsZooming(false), 300);
    } catch (error) {
      console.error('❌ Error zooming out:', error);
      setIsZooming(false);
    }
  }, [map, isMapReady, currentZoom, isZooming]);

  // Don't render if map isn't ready
  if (!isMapReady || !map) {
    console.log('🔄 ZoomControls not rendering - map not ready');
    return null;
  }

  const isZoomInDisabled = currentZoom >= 18 || isZooming;
  const isZoomOutDisabled = currentZoom <= 3 || isZooming;

  console.log('🎮 ZoomControls render:', {
    currentZoom: Math.round(currentZoom * 10) / 10,
    isZoomInDisabled,
    isZoomOutDisabled,
    hasMap: !!map,
    isMapReady,
    isZooming
  });

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
        className={`w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
          isZooming ? 'scale-95 bg-gray-200' : 'active:bg-gray-200 active:scale-95'
        }`}
        type="button"
        title={isZoomInDisabled ? 'Maximum zoom reached' : 'Zoom in'}
        style={{ pointerEvents: 'auto' }}
      >
        <ZoomIn className={`h-6 w-6 text-gray-700 ${isZooming ? 'animate-pulse' : ''}`} />
      </button>
      
      {/* Current Zoom Display */}
      <div className="text-xs text-center font-bold py-2 px-3 bg-gray-50 rounded border min-h-[32px] flex items-center justify-center">
        {Math.round(currentZoom * 10) / 10}
      </div>
      
      {/* Zoom Out Button */}
      <button
        onClick={handleZoomOut}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        disabled={isZoomOutDisabled}
        className={`w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
          isZooming ? 'scale-95 bg-gray-200' : 'active:bg-gray-200 active:scale-95'
        }`}
        type="button"
        title={isZoomOutDisabled ? 'Minimum zoom reached' : 'Zoom out'}
        style={{ pointerEvents: 'auto' }}
      >
        <ZoomOut className={`h-6 w-6 text-gray-700 ${isZooming ? 'animate-pulse' : ''}`} />
      </button>
    </div>
  );
};

export default ZoomControls;
