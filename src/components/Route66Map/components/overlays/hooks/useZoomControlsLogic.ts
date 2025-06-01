
import React from 'react';

interface UseZoomControlsLogicProps {
  isMapReady: boolean;
  mapRef?: React.MutableRefObject<google.maps.Map | null>;
}

export const useZoomControlsLogic = ({ isMapReady, mapRef }: UseZoomControlsLogicProps) => {
  const [currentZoom, setCurrentZoom] = React.useState(5);

  // Simple zoom tracking
  React.useEffect(() => {
    if (!isMapReady || !mapRef?.current) {
      console.log('🔍 useZoomControlsLogic: Map not ready');
      return;
    }

    const map = mapRef.current;
    
    // Get initial zoom
    const initialZoom = map.getZoom() || 5;
    setCurrentZoom(initialZoom);
    console.log('🔍 useZoomControlsLogic: Initial zoom:', initialZoom);

    // Simple zoom change handler
    const handleZoomChange = () => {
      const newZoom = map.getZoom() || 5;
      setCurrentZoom(newZoom);
      console.log('🔍 useZoomControlsLogic: Zoom changed to:', newZoom);
    };

    // Add listener
    const zoomListener = map.addListener('zoom_changed', handleZoomChange);
    console.log('✅ useZoomControlsLogic: Zoom listener added');

    // Simple cleanup
    return () => {
      console.log('🧹 useZoomControlsLogic: Cleaning up zoom listener');
      if (zoomListener) {
        zoomListener.remove();
      }
    };
  }, [isMapReady, mapRef]);

  // Simple zoom handlers
  const handleZoomIn = React.useCallback(() => {
    console.log('🎯 useZoomControlsLogic: ZOOM IN clicked - starting handler');
    
    if (!mapRef?.current) {
      console.error('❌ No map reference available');
      return;
    }
    
    const map = mapRef.current;
    const currentLevel = map.getZoom() || 5;
    const newZoom = Math.min(currentLevel + 1, 18);
    
    console.log(`🔍 Setting zoom from ${currentLevel} to ${newZoom}`);
    map.setZoom(newZoom);
  }, [mapRef]);

  const handleZoomOut = React.useCallback(() => {
    console.log('🎯 useZoomControlsLogic: ZOOM OUT clicked - starting handler');
    
    if (!mapRef?.current) {
      console.error('❌ No map reference available');
      return;
    }
    
    const map = mapRef.current;
    const currentLevel = map.getZoom() || 5;
    const newZoom = Math.max(currentLevel - 1, 3);
    
    console.log(`🔍 Setting zoom from ${currentLevel} to ${newZoom}`);
    map.setZoom(newZoom);
  }, [mapRef]);

  return {
    currentZoom,
    handleZoomIn,
    handleZoomOut
  };
};
