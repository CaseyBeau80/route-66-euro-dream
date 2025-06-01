
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
  const [isMapStable, setIsMapStable] = React.useState(false);

  // Enhanced map stability check
  React.useEffect(() => {
    if (!mapRef?.current || !isMapReady) {
      setIsMapStable(false);
      return;
    }

    const map = mapRef.current;
    
    // Test if map is actually functional
    try {
      const testZoom = map.getZoom();
      const testCenter = map.getCenter();
      
      if (testZoom !== undefined && testCenter) {
        console.log('🎮 Map is stable and functional:', { zoom: testZoom, center: testCenter.toString() });
        setIsMapStable(true);
        setCurrentZoom(testZoom);
      } else {
        console.log('⚠️ Map not yet stable');
        setIsMapStable(false);
      }
    } catch (error) {
      console.log('⚠️ Map stability test failed:', error);
      setIsMapStable(false);
    }
  }, [mapRef?.current, isMapReady]);

  // Track zoom changes from Google Maps with better error handling
  React.useEffect(() => {
    if (!isMapStable || !mapRef?.current) return;

    const map = mapRef.current;
    
    try {
      // Get initial zoom safely
      const initialZoom = map.getZoom();
      if (initialZoom !== undefined) {
        setCurrentZoom(initialZoom);
        console.log('🔍 Initial zoom set to:', initialZoom);
      }

      // Listen for zoom changes with error handling
      const zoomListener = map.addListener('zoom_changed', () => {
        try {
          const newZoom = map.getZoom();
          if (newZoom !== undefined) {
            setCurrentZoom(newZoom);
            console.log('🔍 Zoom changed to:', newZoom);
          }
        } catch (error) {
          console.error('❌ Error reading zoom level:', error);
        }
      });

      return () => {
        if (zoomListener) {
          try {
            zoomListener.remove();
          } catch (error) {
            console.error('❌ Error removing zoom listener:', error);
          }
        }
      };
    } catch (error) {
      console.error('❌ Error setting up zoom listener:', error);
    }
  }, [isMapStable, mapRef]);

  // Simplified zoom handlers that directly interact with Google Maps
  const handleZoomIn = React.useCallback(() => {
    console.log('🔍 ZoomControlsOverlay: Zoom IN clicked');
    
    if (!isMapStable || !mapRef?.current) {
      console.error('❌ Cannot zoom in - map not stable or reference missing');
      return;
    }
    
    try {
      const map = mapRef.current;
      const currentLevel = map.getZoom();
      
      if (currentLevel !== undefined && currentLevel < 18) {
        const newZoom = Math.min(currentLevel + 1, 18);
        console.log(`🔍 Zooming IN from ${currentLevel} to ${newZoom}`);
        map.setZoom(newZoom);
      } else {
        console.log('⚠️ Already at maximum zoom or cannot read current zoom');
      }
    } catch (error) {
      console.error('❌ Error during zoom in:', error);
    }
  }, [isMapStable, mapRef]);

  const handleZoomOut = React.useCallback(() => {
    console.log('🔍 ZoomControlsOverlay: Zoom OUT clicked');
    
    if (!isMapStable || !mapRef?.current) {
      console.error('❌ Cannot zoom out - map not stable or reference missing');
      return;
    }
    
    try {
      const map = mapRef.current;
      const currentLevel = map.getZoom();
      
      if (currentLevel !== undefined && currentLevel > 3) {
        const newZoom = Math.max(currentLevel - 1, 3);
        console.log(`🔍 Zooming OUT from ${currentLevel} to ${newZoom}`);
        map.setZoom(newZoom);
      } else {
        console.log('⚠️ Already at minimum zoom or cannot read current zoom');
      }
    } catch (error) {
      console.error('❌ Error during zoom out:', error);
    }
  }, [isMapStable, mapRef]);

  console.log('🎮 ZoomControlsOverlay render state:', {
    isMapReady,
    isMapStable,
    hasMapRef: !!mapRef?.current,
    currentZoom,
    canShowControls: isMapReady && isMapStable && mapRef?.current
  });

  // Only show controls when everything is ready and stable
  if (!isMapReady || !isMapStable || !mapRef?.current) {
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
