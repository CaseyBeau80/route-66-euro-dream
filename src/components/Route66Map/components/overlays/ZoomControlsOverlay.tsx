
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

  // Simple check - just verify map exists and is ready
  const hasValidMap = !!(isMapReady && mapRef?.current);

  // Track zoom changes from Google Maps
  React.useEffect(() => {
    if (!hasValidMap) return;

    const map = mapRef!.current!;
    
    // Get initial zoom
    try {
      const initialZoom = map.getZoom();
      if (initialZoom !== undefined) {
        setCurrentZoom(initialZoom);
        console.log('🔍 ZoomControlsOverlay: Initial zoom set to:', initialZoom);
      }
    } catch (error) {
      console.log('⚠️ Could not get initial zoom:', error);
    }

    // Listen for zoom changes
    const zoomListener = map.addListener('zoom_changed', () => {
      try {
        const newZoom = map.getZoom();
        if (newZoom !== undefined) {
          setCurrentZoom(newZoom);
          console.log('🔍 ZoomControlsOverlay: Zoom changed to:', newZoom);
        }
      } catch (error) {
        console.log('⚠️ Error getting zoom level:', error);
      }
    });

    return () => {
      if (zoomListener) {
        try {
          zoomListener.remove();
        } catch (error) {
          console.log('⚠️ Error removing zoom listener:', error);
        }
      }
    };
  }, [hasValidMap]);

  // Simplified zoom handlers
  const handleZoomIn = React.useCallback(() => {
    console.log('🔍 ZoomControlsOverlay: Zoom IN clicked, hasValidMap:', hasValidMap);
    
    if (!hasValidMap) {
      console.error('❌ Cannot zoom in - map not available');
      return;
    }
    
    try {
      const map = mapRef!.current!;
      const currentLevel = map.getZoom();
      
      if (currentLevel !== undefined && currentLevel < 18) {
        const newZoom = currentLevel + 1;
        console.log(`🔍 Zooming IN from ${currentLevel} to ${newZoom}`);
        map.setZoom(newZoom);
      } else {
        console.log('⚠️ Already at maximum zoom or could not get current zoom');
      }
    } catch (error) {
      console.error('❌ Error during zoom in:', error);
    }
  }, [hasValidMap, mapRef]);

  const handleZoomOut = React.useCallback(() => {
    console.log('🔍 ZoomControlsOverlay: Zoom OUT clicked, hasValidMap:', hasValidMap);
    
    if (!hasValidMap) {
      console.error('❌ Cannot zoom out - map not available');
      return;
    }
    
    try {
      const map = mapRef!.current!;
      const currentLevel = map.getZoom();
      
      if (currentLevel !== undefined && currentLevel > 3) {
        const newZoom = currentLevel - 1;
        console.log(`🔍 Zooming OUT from ${currentLevel} to ${newZoom}`);
        map.setZoom(newZoom);
      } else {
        console.log('⚠️ Already at minimum zoom or could not get current zoom');
      }
    } catch (error) {
      console.error('❌ Error during zoom out:', error);
    }
  }, [hasValidMap, mapRef]);

  console.log('🎮 ZoomControlsOverlay render state:', {
    isMapReady,
    hasValidMap,
    hasMapRef: !!mapRef?.current,
    currentZoom
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

  // Show controls even if map reference is not yet available (it will become available)
  return (
    <div className="absolute bottom-16 left-4 z-30 pointer-events-auto">
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
