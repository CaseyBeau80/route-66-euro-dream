
import React from 'react';
import ZoomControls from '../../MapElements/ZoomControls';

interface ZoomControlsOverlayProps {
  isMapReady: boolean;
  mapRef?: React.MutableRefObject<google.maps.Map | null>;
}

const ZoomControlsOverlay: React.FC<ZoomControlsOverlayProps> = ({
  isMapReady,
  mapRef
}) => {
  // Enhanced state tracking for debugging
  const [isMapStable, setIsMapStable] = React.useState(false);
  const [mapRefChangeCount, setMapRefChangeCount] = React.useState(0);

  // Track mapRef stability
  React.useEffect(() => {
    const hasValidMap = !!(mapRef?.current && typeof mapRef.current.getZoom === 'function');
    setIsMapStable(hasValidMap);
    
    console.log('🗺️ ZoomControlsOverlay mapRef status:', {
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
        
        mapRef.current.setZoom(newZoom);
        
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
        
        mapRef.current.setZoom(newZoom);
        
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

  // Determine if zoom controls should be shown
  const shouldShowZoomControls = isMapReady && isMapStable && mapRef?.current;

  return (
    <div className="absolute bottom-16 left-4 z-30">
      {shouldShowZoomControls ? (
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
      ) : (
        <div className="bg-white/90 p-3 rounded-lg shadow-lg border text-sm text-gray-600">
          {!isMapReady ? 'Map loading...' : 
           !isMapStable ? 'Map initializing...' : 
           'Zoom controls unavailable'}
        </div>
      )}
    </div>
  );
};

export default ZoomControlsOverlay;
