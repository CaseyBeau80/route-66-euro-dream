
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

  // Simple zoom tracking
  React.useEffect(() => {
    if (!isMapReady || !mapRef?.current) {
      console.log('🔍 ZoomControlsOverlay: Map not ready');
      return;
    }

    const map = mapRef.current;
    
    // Get initial zoom
    const initialZoom = map.getZoom() || 5;
    setCurrentZoom(initialZoom);
    console.log('🔍 ZoomControlsOverlay: Initial zoom:', initialZoom);

    // Simple zoom change handler
    const handleZoomChange = () => {
      const newZoom = map.getZoom() || 5;
      setCurrentZoom(newZoom);
      console.log('🔍 ZoomControlsOverlay: Zoom changed to:', newZoom);
    };

    // Add listener
    const zoomListener = map.addListener('zoom_changed', handleZoomChange);
    console.log('✅ ZoomControlsOverlay: Zoom listener added');

    // Simple cleanup
    return () => {
      console.log('🧹 ZoomControlsOverlay: Cleaning up zoom listener');
      if (zoomListener) {
        zoomListener.remove();
      }
    };
  }, [isMapReady, mapRef]);

  // Simple zoom handlers
  const handleZoomIn = React.useCallback(() => {
    console.log('🎯 ZoomControlsOverlay: ZOOM IN clicked - starting handler');
    
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
    console.log('🎯 ZoomControlsOverlay: ZOOM OUT clicked - starting handler');
    
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

  // Don't render if map isn't ready
  if (!isMapReady) {
    console.log('🔍 ZoomControlsOverlay: Not rendering - map not ready');
    return null;
  }

  console.log('🎮 ZoomControlsOverlay: Rendering zoom controls', {
    isMapReady,
    hasMapRef: !!mapRef?.current,
    currentZoom
  });

  // Render outside overlay system with absolute positioning
  return (
    <div 
      className="fixed bottom-20 left-6 z-50"
      style={{ 
        pointerEvents: 'auto',
        position: 'fixed',
        zIndex: 9999
      }}
    >
      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        currentZoom={currentZoom}
        minZoom={3}
        maxZoom={18}
        disabled={!isMapReady}
      />
    </div>
  );
};

export default ZoomControlsOverlay;
