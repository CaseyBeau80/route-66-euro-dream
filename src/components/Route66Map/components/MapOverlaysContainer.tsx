
import React from 'react';
import ZoomControls from '../MapElements/ZoomControls';
import RouteStatisticsOverlay from './RouteStatisticsOverlay';

interface MapOverlaysContainerProps {
  selectedState: string | null;
  onClearSelection: () => void;
  isDragging: boolean;
  showRouteStats: boolean;
  isMapReady: boolean;
  onToggleRouteStats: () => void;
  mapRef?: React.MutableRefObject<google.maps.Map | null>;
}

const MapOverlaysContainer: React.FC<MapOverlaysContainerProps> = ({
  selectedState,
  onClearSelection,
  isDragging,
  showRouteStats,
  isMapReady,
  onToggleRouteStats,
  mapRef
}) => {
  // Zoom control handlers that interface with Google Maps
  const handleZoomIn = () => {
    if (mapRef?.current) {
      const currentZoom = mapRef.current.getZoom() || 5;
      const newZoom = Math.min(currentZoom + 1, 18);
      mapRef.current.setZoom(newZoom);
      console.log('🔍 Zoom in to:', newZoom);
    }
  };

  const handleZoomOut = () => {
    if (mapRef?.current) {
      const currentZoom = mapRef.current.getZoom() || 5;
      const newZoom = Math.max(currentZoom - 1, 3);
      mapRef.current.setZoom(newZoom);
      console.log('🔍 Zoom out to:', newZoom);
    }
  };

  const getCurrentZoom = () => {
    return mapRef?.current?.getZoom() || 5;
  };

  return (
    <>
      {/* Clear Selection Button */}
      {selectedState && !isDragging && (
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={onClearSelection}
            className="bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-200 border border-gray-200"
          >
            ← Back to Full Route
          </button>
        </div>
      )}

      {/* Zoom Controls */}
      {isMapReady && mapRef?.current && (
        <ZoomControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          currentZoom={getCurrentZoom()}
          minZoom={3}
          maxZoom={18}
          disabled={false}
        />
      )}

      {/* Route Statistics Overlay */}
      <RouteStatisticsOverlay 
        isVisible={showRouteStats && isMapReady}
        onToggle={onToggleRouteStats}
      />
    </>
  );
};

export default MapOverlaysContainer;
