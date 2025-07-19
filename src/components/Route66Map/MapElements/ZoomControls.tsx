
import React, { useState, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  currentZoom: number;
  minZoom: number;
  maxZoom: number;
  map?: google.maps.Map | null;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  currentZoom,
  minZoom,
  maxZoom,
  map
}) => {
  const [isZooming, setIsZooming] = useState(false);
  const [mapZoom, setMapZoom] = useState(currentZoom);

  // Sync with Google Maps zoom level if map is provided
  useEffect(() => {
    if (!map) return;

    const updateZoomLevel = () => {
      const zoom = map.getZoom();
      if (zoom !== undefined) {
        console.log('🎮 ZoomControls: Map zoom changed to:', zoom);
        setMapZoom(zoom);
      }
    };

    // Set initial zoom
    const initialZoom = map.getZoom();
    if (initialZoom !== undefined) {
      setMapZoom(initialZoom);
    }

    // Listen for zoom changes
    const zoomListener = map.addListener('zoom_changed', updateZoomLevel);

    return () => {
      if (zoomListener) {
        google.maps.event.removeListener(zoomListener);
      }
    };
  }, [map]);

  const handleZoomIn = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🎮 ZoomControls: Zoom in clicked');
    setIsZooming(true);
    
    if (map) {
      const currentMapZoom = map.getZoom() || 4;
      const newZoom = Math.min(currentMapZoom + 1, 16); // Enhanced max zoom for detailed viewing
      console.log(`🔍 Setting Google Maps zoom from ${currentMapZoom} to ${newZoom}`);
      map.setZoom(newZoom);
    } else {
      onZoomIn();
    }
    
    setTimeout(() => setIsZooming(false), 300);
  }, [map, onZoomIn]);

  const handleZoomOut = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🎮 ZoomControls: Zoom out clicked');
    setIsZooming(true);
    
    if (map) {
      const currentMapZoom = map.getZoom() || 4;
      const newZoom = Math.max(currentMapZoom - 1, 4); // Route 66 focused min zoom
      console.log(`🔍 Setting Google Maps zoom from ${currentMapZoom} to ${newZoom}`);
      map.setZoom(newZoom);
    } else {
      onZoomOut();
    }
    
    setTimeout(() => setIsZooming(false), 300);
  }, [map, onZoomOut]);

  const displayZoom = map ? mapZoom : currentZoom;
  const isZoomInDisabled = displayZoom >= (map ? 16 : maxZoom); // Enhanced max zoom
  const isZoomOutDisabled = displayZoom <= (map ? 4 : minZoom);

  console.log('🎮 ZoomControls: Rendering with enhanced zoom range:', displayZoom, 'isGoogleMap:', !!map);

  return (
    <div className="absolute bottom-28 right-6 z-[1000] flex flex-col gap-2 bg-white/95 p-3 rounded-lg shadow-xl border border-gray-200 backdrop-blur-sm">
      {/* Zoom In Button */}
      <button
        onClick={handleZoomIn}
        disabled={isZoomInDisabled || isZooming}
        className={`w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
          isZooming ? 'scale-95 bg-blue-100 border-blue-500' : 'active:bg-blue-100 active:scale-95'
        }`}
        type="button"
        title={isZoomInDisabled ? 'Maximum zoom reached' : 'Zoom in'}
      >
        <ZoomIn className={`h-6 w-6 text-gray-700 ${isZooming ? 'animate-pulse text-blue-600' : ''}`} />
      </button>
      
      {/* Current Zoom Display */}
      <div className="text-xs text-center font-bold py-2 px-3 bg-gray-50 rounded border min-h-[32px] flex items-center justify-center">
        <span className="text-gray-800">{Math.round(displayZoom * 10) / 10}</span>
        {isZooming && <span className="ml-1 text-blue-600 animate-pulse">•</span>}
      </div>
      
      {/* Zoom Out Button */}
      <button
        onClick={handleZoomOut}
        disabled={isZoomOutDisabled || isZooming}
        className={`w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
          isZooming ? 'scale-95 bg-blue-100 border-blue-500' : 'active:bg-blue-100 active:scale-95'
        }`}
        type="button"
        title={isZoomOutDisabled ? 'Minimum zoom reached' : 'Zoom out'}
      >
        <ZoomOut className={`h-6 w-6 text-gray-700 ${isZooming ? 'animate-pulse text-blue-600' : ''}`} />
      </button>
    </div>
  );
};

export default ZoomControls;
