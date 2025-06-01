
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

  // Simple zoom tracking without interference
  React.useEffect(() => {
    if (!isMapReady || !mapRef?.current) {
      return;
    }

    const map = mapRef.current;
    
    // Get initial zoom safely
    try {
      const initialZoom = map.getZoom();
      if (typeof initialZoom === 'number') {
        setCurrentZoom(initialZoom);
        console.log('🔍 Initial zoom set to:', initialZoom);
      }
    } catch (error) {
      console.error('❌ Error getting initial zoom:', error);
    }

    // Listen for zoom changes - use simple event listener
    const handleZoomChange = () => {
      try {
        const newZoom = map.getZoom();
        if (typeof newZoom === 'number') {
          setCurrentZoom(newZoom);
          console.log('🔍 Zoom changed to:', newZoom);
        }
      } catch (error) {
        console.error('❌ Error in zoom change handler:', error);
      }
    };

    const zoomListener = map.addListener('zoom_changed', handleZoomChange);

    return () => {
      try {
        if (zoomListener) {
          zoomListener.remove();
          console.log('🧹 Zoom listener removed');
        }
      } catch (error) {
        console.warn('⚠️ Error removing zoom listener:', error);
      }
    };
  }, [isMapReady, mapRef]);

  // Extremely simple zoom handlers that avoid ALL overlay operations
  const handleZoomIn = React.useCallback(() => {
    console.log('🔍 ZOOM IN clicked');
    
    if (!mapRef?.current) {
      console.error('❌ No map reference available');
      return;
    }
    
    try {
      const map = mapRef.current;
      const currentLevel = map.getZoom();
      
      if (typeof currentLevel === 'number' && currentLevel < 18) {
        const newZoom = currentLevel + 1;
        console.log(`🔍 Setting zoom from ${currentLevel} to ${newZoom}`);
        map.setZoom(newZoom);
      }
    } catch (error) {
      console.error('❌ Error zooming in:', error);
    }
  }, [mapRef]);

  const handleZoomOut = React.useCallback(() => {
    console.log('🔍 ZOOM OUT clicked');
    
    if (!mapRef?.current) {
      console.error('❌ No map reference available');
      return;
    }
    
    try {
      const map = mapRef.current;
      const currentLevel = map.getZoom();
      
      if (typeof currentLevel === 'number' && currentLevel > 3) {
        const newZoom = currentLevel - 1;
        console.log(`🔍 Setting zoom from ${currentLevel} to ${newZoom}`);
        map.setZoom(newZoom);
      }
    } catch (error) {
      console.error('❌ Error zooming out:', error);
    }
  }, [mapRef]);

  // Don't render anything if map isn't ready
  if (!isMapReady) {
    return null;
  }

  // Render as a simple positioned div - NOT as a map overlay
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
