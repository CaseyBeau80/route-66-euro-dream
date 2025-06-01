
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
  // Enhanced state tracking for debugging
  const [isMapStable, setIsMapStable] = React.useState(false);
  const [mapRefChangeCount, setMapRefChangeCount] = React.useState(0);

  // Track mapRef stability
  React.useEffect(() => {
    const hasValidMap = !!(mapRef?.current && typeof mapRef.current.getZoom === 'function');
    setIsMapStable(hasValidMap);
    
    console.log('🗺️ MapOverlaysContainer mapRef status:', {
      hasMapRef: !!mapRef,
      hasCurrentMap: !!mapRef?.current,
      hasZoomMethod: !!(mapRef?.current && typeof mapRef.current.getZoom === 'function'),
      isMapReady,
      isMapStable: hasValidMap,
      changeCount: mapRefChangeCount
    });

    if (mapRef?.current) {
      setMapRefChangeCount(prev => prev + 1);
    }
  }, [mapRef?.current, isMapReady]);

  // Stabilized zoom handlers with enhanced error handling and retry logic
  const handleZoomIn = React.useCallback(() => {
    console.log('🔍 Zoom in handler called - starting validation');
    
    if (!mapRef?.current) {
      console.error('❌ Map reference not available for zoom in');
      return;
    }
    
    if (typeof mapRef.current.getZoom !== 'function') {
      console.error('❌ Map zoom methods not available');
      return;
    }
    
    try {
      const currentZoom = mapRef.current.getZoom();
      console.log('🔍 Current zoom level before zoom in:', currentZoom);
      
      if (currentZoom !== undefined && currentZoom !== null) {
        const newZoom = Math.min(currentZoom + 1, 18);
        console.log('🔍 Setting new zoom level to:', newZoom);
        
        // Use setZoom with a small delay to ensure it takes effect
        mapRef.current.setZoom(newZoom);
        
        // Verify the zoom change after a brief delay
        setTimeout(() => {
          const verifyZoom = mapRef.current?.getZoom();
          console.log('✅ Zoom verification - New zoom level:', verifyZoom);
        }, 100);
        
        console.log('✅ Zoom in completed successfully to level:', newZoom);
      } else {
        console.error('❌ Could not get valid current zoom level:', currentZoom);
      }
    } catch (error) {
      console.error('❌ Error during zoom in operation:', error);
    }
  }, [mapRef]);

  const handleZoomOut = React.useCallback(() => {
    console.log('🔍 Zoom out handler called - starting validation');
    
    if (!mapRef?.current) {
      console.error('❌ Map reference not available for zoom out');
      return;
    }
    
    if (typeof mapRef.current.getZoom !== 'function') {
      console.error('❌ Map zoom methods not available');
      return;
    }
    
    try {
      const currentZoom = mapRef.current.getZoom();
      console.log('🔍 Current zoom level before zoom out:', currentZoom);
      
      if (currentZoom !== undefined && currentZoom !== null) {
        const newZoom = Math.max(currentZoom - 1, 3);
        console.log('🔍 Setting new zoom level to:', newZoom);
        
        // Use setZoom with a small delay to ensure it takes effect
        mapRef.current.setZoom(newZoom);
        
        // Verify the zoom change after a brief delay
        setTimeout(() => {
          const verifyZoom = mapRef.current?.getZoom();
          console.log('✅ Zoom verification - New zoom level:', verifyZoom);
        }, 100);
        
        console.log('✅ Zoom out completed successfully to level:', newZoom);
      } else {
        console.error('❌ Could not get valid current zoom level:', currentZoom);
      }
    } catch (error) {
      console.error('❌ Error during zoom out operation:', error);
    }
  }, [mapRef]);

  const getCurrentZoom = React.useCallback(() => {
    if (!mapRef?.current || typeof mapRef.current.getZoom !== 'function') {
      console.log('🔍 Map not available for getCurrentZoom, returning default');
      return 5;
    }
    
    try {
      const zoom = mapRef.current.getZoom();
      console.log('🔍 Getting current zoom:', zoom);
      return zoom || 5;
    } catch (error) {
      console.error('❌ Error getting current zoom:', error);
      return 5;
    }
  }, [mapRef]);

  // Enhanced debugging for component state
  React.useEffect(() => {
    console.log('🗺️ MapOverlaysContainer state update:', {
      isMapReady,
      hasMapRef: !!mapRef?.current,
      isMapStable,
      mapRefChangeCount,
      mapType: mapRef?.current ? 'Google Maps' : 'None',
      currentZoom: mapRef?.current ? getCurrentZoom() : 'N/A',
      shouldShowZoomControls: isMapReady && isMapStable
    });
  }, [isMapReady, mapRef?.current, isMapStable, mapRefChangeCount, getCurrentZoom]);

  // Determine if zoom controls should be shown
  const shouldShowZoomControls = isMapReady && isMapStable && mapRef?.current;

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

      {/* Enhanced Zoom Controls with multiple fallback checks */}
      {shouldShowZoomControls ? (
        <div className="absolute bottom-16 left-4 z-30">
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
      ) : (
        <div className="absolute bottom-16 left-4 z-30">
          <div className="bg-white/90 p-3 rounded-lg shadow-lg border text-sm text-gray-600">
            {!isMapReady ? 'Map loading...' : 
             !isMapStable ? 'Map initializing...' : 
             'Zoom controls unavailable'}
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
