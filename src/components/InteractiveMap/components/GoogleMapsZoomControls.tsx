
import React, { useState, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface GoogleMapsZoomControlsProps {
  map: google.maps.Map | null;
  isMapReady: boolean;
}

const GoogleMapsZoomControls: React.FC<GoogleMapsZoomControlsProps> = ({ 
  map, 
  isMapReady 
}) => {
  const [currentZoom, setCurrentZoom] = useState(5);
  const [isZooming, setIsZooming] = useState(false);

  // Sync with Google Maps zoom level
  useEffect(() => {
    if (!map || !isMapReady) return;

    const updateZoomLevel = () => {
      const zoom = map.getZoom();
      if (zoom !== undefined) {
        setCurrentZoom(zoom);
        console.log('🔍 Zoom level updated to:', zoom);
      }
    };

    // Set initial zoom
    const initialZoom = map.getZoom();
    if (initialZoom !== undefined) {
      setCurrentZoom(initialZoom);
      console.log('🔍 Initial zoom level:', initialZoom);
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
      console.log('🔍 Zoom in blocked - map not ready or already zooming');
      return;
    }

    const currentMapZoom = map.getZoom();
    if (currentMapZoom === undefined || currentMapZoom >= 12) {
      console.log('🔍 Zoom in blocked - at maximum zoom:', currentMapZoom);
      return;
    }

    console.log('🔍 Custom zoom in from:', currentMapZoom, 'to:', currentMapZoom + 1);
    setIsZooming(true);
    const newZoom = Math.min(currentMapZoom + 1, 12);
    
    // Force the zoom change through the map instance
    map.setZoom(newZoom);
    
    setTimeout(() => setIsZooming(false), 300);
  }, [map, isMapReady, isZooming]);

  const handleZoomOut = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!map || !isMapReady || isZooming) {
      console.log('🔍 Zoom out blocked - map not ready or already zooming');
      return;
    }

    const currentMapZoom = map.getZoom();
    if (currentMapZoom === undefined || currentMapZoom <= 4) {
      console.log('🔍 Zoom out blocked - at minimum zoom:', currentMapZoom);
      return;
    }

    console.log('🔍 Custom zoom out from:', currentMapZoom, 'to:', currentMapZoom - 1);
    setIsZooming(true);
    const newZoom = Math.max(currentMapZoom - 1, 4);
    
    // Force the zoom change through the map instance
    map.setZoom(newZoom);
    
    setTimeout(() => setIsZooming(false), 300);
  }, [map, isMapReady, isZooming]);

  // Don't render if map isn't ready
  if (!isMapReady || !map) {
    return null;
  }

  const isZoomInDisabled = currentZoom >= 12 || isZooming;
  const isZoomOutDisabled = currentZoom <= 4 || isZooming;

  return (
    <div 
      className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-2"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 p-2">
        {/* Zoom In Button */}
        <button
          onClick={handleZoomIn}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          disabled={isZoomInDisabled}
          className={`w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-t-md hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
            isZooming ? 'scale-95 bg-blue-100 border-blue-500' : 'active:bg-blue-100 active:scale-95'
          }`}
          type="button"
          title={isZoomInDisabled ? 'Maximum zoom reached' : 'Zoom in'}
          style={{ pointerEvents: 'auto' }}
        >
          <ZoomIn className={`h-4 w-4 text-gray-700 ${isZooming ? 'animate-pulse text-blue-600' : ''}`} />
        </button>
        
        {/* Current Zoom Display */}
        <div className="text-xs text-center font-medium py-1 px-2 bg-gray-50 border-x border-gray-300 min-h-[24px] flex items-center justify-center">
          <span className="text-gray-800">{Math.round(currentZoom * 10) / 10}</span>
          {isZooming && <span className="ml-1 text-blue-600 animate-pulse">•</span>}
        </div>
        
        {/* Zoom Out Button */}
        <button
          onClick={handleZoomOut}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          disabled={isZoomOutDisabled}
          className={`w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-b-md hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
            isZooming ? 'scale-95 bg-blue-100 border-blue-500' : 'active:bg-blue-100 active:scale-95'
          }`}
          type="button"
          title={isZoomOutDisabled ? 'Minimum zoom reached' : 'Zoom out'}
          style={{ pointerEvents: 'auto' }}
        >
          <ZoomOut className={`h-4 w-4 text-gray-700 ${isZooming ? 'animate-pulse text-blue-600' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default GoogleMapsZoomControls;
