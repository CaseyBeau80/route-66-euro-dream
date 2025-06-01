
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
  const [currentZoom, setCurrentZoom] = React.useState(5);

  // Simple map validation
  const hasValidMap = React.useMemo(() => {
    const valid = !!(
      isMapReady && 
      mapRef?.current && 
      typeof mapRef.current.getZoom === 'function' &&
      typeof mapRef.current.setZoom === 'function'
    );
    
    console.log('🗺️ ZoomControlsOverlay map validation:', {
      isMapReady,
      hasMapRef: !!mapRef?.current,
      isValid: valid
    });
    
    return valid;
  }, [isMapReady, mapRef?.current]);

  // Track zoom changes from Google Maps
  React.useEffect(() => {
    if (!hasValidMap) {
      return;
    }

    const map = mapRef!.current!;
    
    // Get initial zoom
    try {
      const initialZoom = map.getZoom();
      if (typeof initialZoom === 'number') {
        setCurrentZoom(initialZoom);
        console.log('🔍 ZoomControlsOverlay: Initial zoom set to:', initialZoom);
      }
    } catch (error) {
      console.error('❌ Error getting initial zoom:', error);
    }

    // Listen for zoom changes - use zoom_changed instead of other events to avoid overlay conflicts
    const zoomListener = map.addListener('zoom_changed', () => {
      try {
        const newZoom = map.getZoom();
        if (typeof newZoom === 'number') {
          setCurrentZoom(newZoom);
          console.log('🔍 ZoomControlsOverlay: Zoom changed to:', newZoom);
        }
      } catch (error) {
        console.error('❌ Error in zoom_changed listener:', error);
      }
    });

    return () => {
      if (zoomListener) {
        try {
          zoomListener.remove();
          console.log('🧹 ZoomControlsOverlay: Zoom listener removed');
        } catch (error) {
          console.error('❌ Error removing zoom listener:', error);
        }
      }
    };
  }, [hasValidMap]);

  // Simplified zoom handlers that avoid overlay conflicts
  const handleZoomIn = React.useCallback(() => {
    console.log('🔍 ZoomControlsOverlay: ZOOM IN triggered');
    
    if (!hasValidMap) {
      console.error('❌ Cannot zoom in - map not available');
      return;
    }
    
    try {
      const map = mapRef!.current!;
      const currentLevel = map.getZoom();
      
      if (typeof currentLevel === 'number' && currentLevel < 18) {
        const newZoom = currentLevel + 1;
        console.log(`🔍 Zooming IN from ${currentLevel} to ${newZoom}`);
        
        // Use setZoom directly without any overlay manipulation
        map.setZoom(newZoom);
        
        console.log('✅ Zoom in completed successfully');
      } else {
        console.log('⚠️ Cannot zoom in - at maximum zoom');
      }
    } catch (error) {
      console.error('❌ Error during zoom in:', error);
    }
  }, [hasValidMap, mapRef]);

  const handleZoomOut = React.useCallback(() => {
    console.log('🔍 ZoomControlsOverlay: ZOOM OUT triggered');
    
    if (!hasValidMap) {
      console.error('❌ Cannot zoom out - map not available');
      return;
    }
    
    try {
      const map = mapRef!.current!;
      const currentLevel = map.getZoom();
      
      if (typeof currentLevel === 'number' && currentLevel > 3) {
        const newZoom = currentLevel - 1;
        console.log(`🔍 Zooming OUT from ${currentLevel} to ${newZoom}`);
        
        // Use setZoom directly without any overlay manipulation
        map.setZoom(newZoom);
        
        console.log('✅ Zoom out completed successfully');
      } else {
        console.log('⚠️ Cannot zoom out - at minimum zoom');
      }
    } catch (error) {
      console.error('❌ Error during zoom out:', error);
    }
  }, [hasValidMap, mapRef]);

  console.log('🎮 ZoomControlsOverlay render state:', {
    isMapReady,
    hasValidMap,
    currentZoom
  });

  // Show loading state when map is not ready
  if (!isMapReady) {
    return (
      <div className="absolute bottom-16 left-4 z-30">
        <div className="bg-white/90 p-3 rounded-lg shadow-lg border text-sm text-gray-600">
          Map loading...
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-16 left-4 z-30">
      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        currentZoom={currentZoom}
        minZoom={3}
        maxZoom={18}
        disabled={!hasValidMap}
      />
    </div>
  );
};

export default ZoomControlsOverlay;
