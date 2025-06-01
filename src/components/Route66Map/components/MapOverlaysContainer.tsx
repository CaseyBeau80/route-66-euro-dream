
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
  // Enhanced zoom control handlers with better error handling and logging
  const handleZoomIn = () => {
    console.log('🔍 Zoom in button clicked - starting zoom operation');
    if (!mapRef?.current) {
      console.error('❌ Map reference not available for zoom in');
      return;
    }
    
    try {
      const currentZoom = mapRef.current.getZoom();
      console.log('🔍 Current zoom level before zoom in:', currentZoom);
      
      if (currentZoom !== undefined) {
        const newZoom = Math.min(currentZoom + 1, 18);
        console.log('🔍 Setting new zoom level to:', newZoom);
        mapRef.current.setZoom(newZoom);
        console.log('✅ Zoom in completed successfully to level:', newZoom);
      } else {
        console.error('❌ Could not get current zoom level');
      }
    } catch (error) {
      console.error('❌ Error during zoom in:', error);
    }
  };

  const handleZoomOut = () => {
    console.log('🔍 Zoom out button clicked - starting zoom operation');
    if (!mapRef?.current) {
      console.error('❌ Map reference not available for zoom out');
      return;
    }
    
    try {
      const currentZoom = mapRef.current.getZoom();
      console.log('🔍 Current zoom level before zoom out:', currentZoom);
      
      if (currentZoom !== undefined) {
        const newZoom = Math.max(currentZoom - 1, 3);
        console.log('🔍 Setting new zoom level to:', newZoom);
        mapRef.current.setZoom(newZoom);
        console.log('✅ Zoom out completed successfully to level:', newZoom);
      } else {
        console.error('❌ Could not get current zoom level');
      }
    } catch (error) {
      console.error('❌ Error during zoom out:', error);
    }
  };

  const getCurrentZoom = () => {
    if (!mapRef?.current) {
      console.log('🔍 Map not available, returning default zoom');
      return 5;
    }
    
    const zoom = mapRef.current.getZoom();
    console.log('🔍 Getting current zoom:', zoom);
    return zoom || 5;
  };

  // Enhanced debugging for map state
  React.useEffect(() => {
    console.log('🗺️ MapOverlaysContainer state:', {
      isMapReady,
      hasMapRef: !!mapRef?.current,
      mapType: mapRef?.current ? 'Google Maps' : 'None',
      currentZoom: mapRef?.current?.getZoom()
    });
  }, [isMapReady, mapRef?.current]);

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

      {/* Enhanced Zoom Controls with better positioning and z-index */}
      {isMapReady && mapRef?.current && (
        <div className="absolute bottom-16 left-4 z-30 pointer-events-none">
          <div className="pointer-events-auto">
            <ZoomControls
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              currentZoom={getCurrentZoom()}
              minZoom={3}
              maxZoom={18}
              disabled={false}
            />
          </div>
        </div>
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
