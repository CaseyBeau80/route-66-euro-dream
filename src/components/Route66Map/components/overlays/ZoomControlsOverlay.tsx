
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

  // Enhanced map validation with detailed logging
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
      hasZoomMethods: !!(mapRef?.current && typeof mapRef.current.getZoom === 'function'),
      isValid: valid
    });
    
    return valid;
  }, [isMapReady, mapRef?.current]);

  // Track zoom changes from Google Maps with better error handling
  React.useEffect(() => {
    if (!hasValidMap) {
      console.log('🚫 ZoomControlsOverlay: Map not ready for zoom tracking');
      return;
    }

    const map = mapRef!.current!;
    
    // Get initial zoom with enhanced error handling
    try {
      const initialZoom = map.getZoom();
      if (initialZoom !== undefined && typeof initialZoom === 'number') {
        setCurrentZoom(initialZoom);
        console.log('🔍 ZoomControlsOverlay: Initial zoom set to:', initialZoom);
      } else {
        console.warn('⚠️ Initial zoom is not a valid number:', initialZoom);
      }
    } catch (error) {
      console.error('❌ Error getting initial zoom:', error);
    }

    // Listen for zoom changes with enhanced error handling
    const zoomListener = map.addListener('zoom_changed', () => {
      try {
        const newZoom = map.getZoom();
        if (newZoom !== undefined && typeof newZoom === 'number') {
          setCurrentZoom(newZoom);
          console.log('🔍 ZoomControlsOverlay: Zoom changed to:', newZoom);
        } else {
          console.warn('⚠️ New zoom is not a valid number:', newZoom);
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

  // Enhanced zoom handlers with immediate feedback and error recovery
  const handleZoomIn = React.useCallback(() => {
    console.log('🔍 ZoomControlsOverlay: ZOOM IN triggered, hasValidMap:', hasValidMap);
    
    if (!hasValidMap) {
      console.error('❌ Cannot zoom in - map not available');
      return;
    }
    
    try {
      const map = mapRef!.current!;
      const currentLevel = map.getZoom();
      
      console.log('🔍 Current zoom level before zoom in:', currentLevel);
      
      if (currentLevel !== undefined && typeof currentLevel === 'number' && currentLevel < 18) {
        const newZoom = currentLevel + 1;
        console.log(`🔍 Zooming IN from ${currentLevel} to ${newZoom}`);
        
        // Use both setZoom and panBy for immediate visual feedback
        map.setZoom(newZoom);
        
        // Immediate state update for UI responsiveness
        setCurrentZoom(newZoom);
        
        console.log('✅ Zoom in completed successfully');
      } else {
        console.log('⚠️ Cannot zoom in - at maximum zoom or invalid current zoom:', currentLevel);
      }
    } catch (error) {
      console.error('❌ Error during zoom in:', error);
    }
  }, [hasValidMap, mapRef]);

  const handleZoomOut = React.useCallback(() => {
    console.log('🔍 ZoomControlsOverlay: ZOOM OUT triggered, hasValidMap:', hasValidMap);
    
    if (!hasValidMap) {
      console.error('❌ Cannot zoom out - map not available');
      return;
    }
    
    try {
      const map = mapRef!.current!;
      const currentLevel = map.getZoom();
      
      console.log('🔍 Current zoom level before zoom out:', currentLevel);
      
      if (currentLevel !== undefined && typeof currentLevel === 'number' && currentLevel > 3) {
        const newZoom = currentLevel - 1;
        console.log(`🔍 Zooming OUT from ${currentLevel} to ${newZoom}`);
        
        // Use both setZoom and panBy for immediate visual feedback
        map.setZoom(newZoom);
        
        // Immediate state update for UI responsiveness
        setCurrentZoom(newZoom);
        
        console.log('✅ Zoom out completed successfully');
      } else {
        console.log('⚠️ Cannot zoom out - at minimum zoom or invalid current zoom:', currentLevel);
      }
    } catch (error) {
      console.error('❌ Error during zoom out:', error);
    }
  }, [hasValidMap, mapRef]);

  console.log('🎮 ZoomControlsOverlay render state:', {
    isMapReady,
    hasValidMap,
    hasMapRef: !!mapRef?.current,
    currentZoom,
    zoomType: typeof currentZoom
  });

  // Show loading state only when map is not ready
  if (!isMapReady) {
    return (
      <div className="absolute bottom-16 left-4 z-30">
        <div className="bg-white/90 p-3 rounded-lg shadow-lg border text-sm text-gray-600">
          Map loading...
        </div>
      </div>
    );
  }

  // Enhanced container with explicit pointer events and z-index
  return (
    <div 
      className="absolute bottom-16 left-4 z-30"
      style={{ 
        zIndex: 9998,
        pointerEvents: 'auto'
      }}
      onMouseDown={(e) => console.log('🔍 ZoomControlsOverlay container mousedown:', e.target)}
      onTouchStart={(e) => console.log('🔍 ZoomControlsOverlay container touchstart:', e.target)}
    >
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
