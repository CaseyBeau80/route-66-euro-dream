
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

  // Track zoom changes from Google Maps
  React.useEffect(() => {
    if (!mapRef?.current || !isMapReady) return;

    const map = mapRef.current;
    
    // Get initial zoom
    const initialZoom = map.getZoom();
    if (initialZoom !== undefined) {
      setCurrentZoom(initialZoom);
    }

    // Listen for zoom changes
    const zoomListener = map.addListener('zoom_changed', () => {
      const newZoom = map.getZoom();
      if (newZoom !== undefined) {
        setCurrentZoom(newZoom);
        console.log('🔍 Google Maps zoom changed to:', newZoom);
      }
    });

    return () => {
      if (zoomListener) {
        zoomListener.remove();
      }
    };
  }, [mapRef, isMapReady]);

  // Simple zoom handlers that directly call Google Maps methods
  const handleZoomIn = React.useCallback(() => {
    if (!mapRef?.current) {
      console.error('❌ No map reference available for zoom in');
      return;
    }
    
    console.log('🔍 Zoom IN clicked - current zoom:', currentZoom);
    
    try {
      const map = mapRef.current;
      const currentLevel = map.getZoom();
      if (currentLevel !== undefined) {
        const newZoom = Math.min(currentLevel + 1, 18);
        console.log('🔍 Setting zoom from', currentLevel, 'to', newZoom);
        map.setZoom(newZoom);
      }
    } catch (error) {
      console.error('❌ Error zooming in:', error);
    }
  }, [mapRef, currentZoom]);

  const handleZoomOut = React.useCallback(() => {
    if (!mapRef?.current) {
      console.error('❌ No map reference available for zoom out');
      return;
    }
    
    console.log('🔍 Zoom OUT clicked - current zoom:', currentZoom);
    
    try {
      const map = mapRef.current;
      const currentLevel = map.getZoom();
      if (currentLevel !== undefined) {
        const newZoom = Math.max(currentLevel - 1, 3);
        console.log('🔍 Setting zoom from', currentLevel, 'to', newZoom);
        map.setZoom(newZoom);
      }
    } catch (error) {
      console.error('❌ Error zooming out:', error);
    }
  }, [mapRef, currentZoom]);

  // Only show controls when map is ready and we have a valid map reference
  const shouldShowControls = isMapReady && mapRef?.current;

  console.log('🎮 ZoomControlsOverlay render:', {
    isMapReady,
    hasMapRef: !!mapRef?.current,
    shouldShowControls,
    currentZoom
  });

  if (!shouldShowControls) {
    return (
      <div className="absolute bottom-16 left-4 z-30">
        <div className="bg-white/90 p-3 rounded-lg shadow-lg border text-sm text-gray-600">
          Map initializing...
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-16 left-4 z-30 pointer-events-auto">
      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        currentZoom={currentZoom}
        minZoom={3}
        maxZoom={18}
        disabled={false}
      />
    </div>
  );
};

export default ZoomControlsOverlay;
