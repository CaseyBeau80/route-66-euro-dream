
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

  // Simple map validation - check if map exists and has zoom methods
  const isMapValid = React.useMemo(() => {
    return !!(
      isMapReady && 
      mapRef?.current &&
      typeof mapRef.current.getZoom === 'function' &&
      typeof mapRef.current.setZoom === 'function'
    );
  }, [isMapReady, mapRef?.current]);

  // Track zoom changes from Google Maps
  React.useEffect(() => {
    if (!isMapValid) return;

    const map = mapRef!.current!;
    
    // Get initial zoom
    const initialZoom = map.getZoom();
    if (initialZoom !== undefined) {
      setCurrentZoom(initialZoom);
      console.log('🔍 Initial zoom set to:', initialZoom);
    }

    // Listen for zoom changes
    const zoomListener = map.addListener('zoom_changed', () => {
      const newZoom = map.getZoom();
      if (newZoom !== undefined) {
        setCurrentZoom(newZoom);
        console.log('🔍 Zoom changed to:', newZoom);
      }
    });

    return () => {
      if (zoomListener) {
        zoomListener.remove();
      }
    };
  }, [isMapValid]);

  // Direct zoom handlers that interact with Google Maps
  const handleZoomIn = React.useCallback(() => {
    console.log('🔍 ZoomControlsOverlay: Zoom IN clicked');
    
    if (!isMapValid) {
      console.error('❌ Cannot zoom in - map not ready');
      return;
    }
    
    const map = mapRef!.current!;
    const currentLevel = map.getZoom();
    
    if (currentLevel !== undefined && currentLevel < 18) {
      const newZoom = Math.min(currentLevel + 1, 18);
      console.log(`🔍 Zooming IN from ${currentLevel} to ${newZoom}`);
      map.setZoom(newZoom);
    } else {
      console.log('⚠️ Already at maximum zoom');
    }
  }, [isMapValid, mapRef]);

  const handleZoomOut = React.useCallback(() => {
    console.log('🔍 ZoomControlsOverlay: Zoom OUT clicked');
    
    if (!isMapValid) {
      console.error('❌ Cannot zoom out - map not ready');
      return;
    }
    
    const map = mapRef!.current!;
    const currentLevel = map.getZoom();
    
    if (currentLevel !== undefined && currentLevel > 3) {
      const newZoom = Math.max(currentLevel - 1, 3);
      console.log(`🔍 Zooming OUT from ${currentLevel} to ${newZoom}`);
      map.setZoom(newZoom);
    } else {
      console.log('⚠️ Already at minimum zoom');
    }
  }, [isMapValid, mapRef]);

  console.log('🎮 ZoomControlsOverlay render state:', {
    isMapReady,
    isMapValid,
    hasMapRef: !!mapRef?.current,
    currentZoom,
    canShowControls: isMapValid
  });

  // Only show controls when map is valid
  if (!isMapValid) {
    return (
      <div className="absolute bottom-16 left-4 z-30">
        <div className="bg-white/90 p-3 rounded-lg shadow-lg border text-sm text-gray-600">
          {!isMapReady ? 'Map loading...' : 'Zoom controls initializing...'}
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
