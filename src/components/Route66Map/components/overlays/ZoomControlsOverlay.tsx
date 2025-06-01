
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
  const [currentZoom, setCurrentZoom] = React.useState(5);

  // Track mapRef stability and zoom changes
  React.useEffect(() => {
    const hasValidMap = !!(mapRef?.current && typeof mapRef.current.getZoom === 'function');
    setIsMapStable(hasValidMap);
    
    // Update current zoom when map changes
    if (hasValidMap) {
      try {
        const zoom = mapRef.current.getZoom();
        setCurrentZoom(zoom || 5);
        
        // Add zoom change listener
        const zoomListener = mapRef.current.addListener('zoom_changed', () => {
          const newZoom = mapRef.current?.getZoom();
          if (newZoom !== undefined) {
            setCurrentZoom(newZoom);
          }
        });

        return () => {
          if (zoomListener) {
            zoomListener.remove();
          }
        };
      } catch (error) {
        console.error('❌ Error setting up zoom listener:', error);
      }
    }
  }, [mapRef?.current, isMapReady]);

  // Improved zoom handlers with better error handling
  const handleZoomIn = React.useCallback(() => {
    console.log('🔍 Zoom in button clicked');
    
    if (!mapRef?.current) {
      console.error('❌ Map reference not available for zoom in');
      return;
    }
    
    try {
      const currentZoomLevel = mapRef.current.getZoom();
      if (currentZoomLevel !== undefined && currentZoomLevel !== null) {
        const newZoom = Math.min(currentZoomLevel + 1, 18);
        console.log(`🔍 Zooming in from ${currentZoomLevel} to ${newZoom}`);
        
        mapRef.current.setZoom(newZoom);
        setCurrentZoom(newZoom);
        
        console.log('✅ Zoom in completed successfully');
      } else {
        console.error('❌ Could not get current zoom level');
      }
    } catch (error) {
      console.error('❌ Error during zoom in operation:', error);
    }
  }, [mapRef]);

  const handleZoomOut = React.useCallback(() => {
    console.log('🔍 Zoom out button clicked');
    
    if (!mapRef?.current) {
      console.error('❌ Map reference not available for zoom out');
      return;
    }
    
    try {
      const currentZoomLevel = mapRef.current.getZoom();
      if (currentZoomLevel !== undefined && currentZoomLevel !== null) {
        const newZoom = Math.max(currentZoomLevel - 1, 3);
        console.log(`🔍 Zooming out from ${currentZoomLevel} to ${newZoom}`);
        
        mapRef.current.setZoom(newZoom);
        setCurrentZoom(newZoom);
        
        console.log('✅ Zoom out completed successfully');
      } else {
        console.error('❌ Could not get current zoom level');
      }
    } catch (error) {
      console.error('❌ Error during zoom out operation:', error);
    }
  }, [mapRef]);

  // Determine if zoom controls should be shown
  const shouldShowZoomControls = isMapReady && isMapStable && mapRef?.current;

  console.log('🎮 ZoomControlsOverlay render state:', {
    isMapReady,
    isMapStable,
    shouldShowZoomControls,
    currentZoom,
    hasMapRef: !!mapRef?.current
  });

  return (
    <div className="absolute bottom-16 left-4 z-30">
      {shouldShowZoomControls ? (
        <div className="pointer-events-auto">
          <ZoomControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            currentZoom={currentZoom}
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
