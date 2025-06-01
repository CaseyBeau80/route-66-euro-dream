
import React, { useState, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface ZoomControlsProps {
  map: google.maps.Map | null;
  isMapReady: boolean;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ map, isMapReady }) => {
  const [currentZoom, setCurrentZoom] = useState(4);
  const [isUpdating, setIsUpdating] = useState(false);

  // Update zoom level when map zoom changes
  useEffect(() => {
    if (!map || !isMapReady) return;

    const updateZoomLevel = () => {
      const zoom = map.getZoom();
      if (zoom !== undefined) {
        setCurrentZoom(zoom);
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
    
    if (!map || !isMapReady || isUpdating) {
      console.log('⚠️ Zoom in blocked:', { hasMap: !!map, isMapReady, isUpdating });
      return;
    }

    console.log('🎯 ZoomControls: Executing zoom in');
    setIsUpdating(true);
    
    try {
      const currentZoom = map.getZoom() || 4;
      const newZoom = Math.min(currentZoom + 1, 18);
      map.setZoom(newZoom);
      console.log('✅ Zoom in successful:', newZoom);
    } catch (error) {
      console.error('❌ Error zooming in:', error);
    } finally {
      setTimeout(() => setIsUpdating(false), 100);
    }
  }, [map, isMapReady, isUpdating]);

  const handleZoomOut = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!map || !isMapReady || isUpdating) {
      console.log('⚠️ Zoom out blocked:', { hasMap: !!map, isMapReady, isUpdating });
      return;
    }

    console.log('🎯 ZoomControls: Executing zoom out');
    setIsUpdating(true);
    
    try {
      const currentZoom = map.getZoom() || 4;
      const newZoom = Math.max(currentZoom - 1, 3);
      map.setZoom(newZoom);
      console.log('✅ Zoom out successful:', newZoom);
    } catch (error) {
      console.error('❌ Error zooming out:', error);
    } finally {
      setTimeout(() => setIsUpdating(false), 100);
    }
  }, [map, isMapReady, isUpdating]);

  // Don't render if map isn't ready
  if (!isMapReady || !map) {
    console.log('🔍 ZoomControls: Not rendering - map not ready');
    return null;
  }

  const isZoomInDisabled = isUpdating || currentZoom >= 18;
  const isZoomOutDisabled = isUpdating || currentZoom <= 3;

  console.log('🎮 ZoomControls render:', {
    currentZoom: Math.round(currentZoom * 10) / 10,
    isZoomInDisabled,
    isZoomOutDisabled,
    isUpdating,
    hasMap: !!map
  });

  return (
    <div 
      className="absolute bottom-20 left-6 z-50 flex flex-col gap-2 bg-white/95 p-3 rounded-lg shadow-xl border border-gray-200 backdrop-blur-sm"
      style={{ 
        pointerEvents: 'auto'
      }}
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
