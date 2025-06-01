
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

  // Enhanced zoom tracking with comprehensive error handling
  React.useEffect(() => {
    if (!isMapReady || !mapRef?.current) {
      console.log('🔍 ZoomControlsOverlay: Map not ready or ref unavailable', {
        isMapReady,
        hasMapRef: !!mapRef?.current
      });
      return;
    }

    const map = mapRef.current;
    
    // Get initial zoom with enhanced error handling
    try {
      const initialZoom = map.getZoom();
      if (typeof initialZoom === 'number' && !isNaN(initialZoom)) {
        setCurrentZoom(initialZoom);
        console.log('🔍 ZoomControlsOverlay: Initial zoom set to:', initialZoom);
      } else {
        console.warn('⚠️ ZoomControlsOverlay: Invalid initial zoom value:', initialZoom);
        setCurrentZoom(5); // fallback
      }
    } catch (error) {
      console.error('❌ ZoomControlsOverlay: Error getting initial zoom:', error);
      setCurrentZoom(5); // fallback
    }

    // Enhanced zoom change handler with comprehensive error handling
    const handleZoomChange = () => {
      try {
        if (!mapRef.current) {
          console.warn('⚠️ ZoomControlsOverlay: Map ref lost during zoom change');
          return;
        }

        const newZoom = mapRef.current.getZoom();
        if (typeof newZoom === 'number' && !isNaN(newZoom)) {
          setCurrentZoom(newZoom);
          console.log('🔍 ZoomControlsOverlay: Zoom changed to:', newZoom);
        } else {
          console.warn('⚠️ ZoomControlsOverlay: Invalid zoom value received:', newZoom);
        }
      } catch (error) {
        console.error('❌ ZoomControlsOverlay: Error in zoom change handler:', error);
      }
    };

    // Enhanced listener setup with error handling
    let zoomListener: google.maps.MapsEventListener | null = null;
    
    try {
      console.log('🔍 ZoomControlsOverlay: Setting up zoom listener');
      zoomListener = map.addListener('zoom_changed', handleZoomChange);
      console.log('✅ ZoomControlsOverlay: Zoom listener added successfully');
    } catch (listenerError) {
      console.error('❌ ZoomControlsOverlay: Error adding zoom listener:', listenerError);
    }

    // Enhanced cleanup with comprehensive error handling
    return () => {
      console.log('🧹 ZoomControlsOverlay: Starting zoom listener cleanup');
      
      if (zoomListener) {
        try {
          // Check if the listener object has the expected methods
          console.log('🔍 ZoomControlsOverlay: Zoom listener type check:', {
            hasRemove: typeof zoomListener.remove === 'function',
            type: typeof zoomListener,
            constructor: zoomListener.constructor?.name
          });

          // Strategy 1: Use remove() method if available
          if (typeof zoomListener.remove === 'function') {
            console.log('🧹 ZoomControlsOverlay: Using listener.remove()');
            zoomListener.remove();
            console.log('✅ ZoomControlsOverlay: Zoom listener removed successfully');
          }
          // Strategy 2: Try google.maps.event.removeListener
          else if (window.google?.maps?.event?.removeListener) {
            console.log('🧹 ZoomControlsOverlay: Using google.maps.event.removeListener');
            google.maps.event.removeListener(zoomListener);
            console.log('✅ ZoomControlsOverlay: Zoom listener removed via event API');
          }
          else {
            console.warn('⚠️ ZoomControlsOverlay: No removal method available for listener');
          }
        } catch (removeError) {
          console.error('❌ ZoomControlsOverlay: Error removing zoom listener:', removeError);
          
          // Fallback cleanup attempt
          try {
            if (window.google?.maps?.event?.clearInstanceListeners && mapRef.current) {
              console.log('🧹 ZoomControlsOverlay: Attempting fallback listener cleanup');
              google.maps.event.clearInstanceListeners(mapRef.current);
              console.log('✅ ZoomControlsOverlay: Fallback cleanup completed');
            }
          } catch (fallbackError) {
            console.error('❌ ZoomControlsOverlay: Fallback cleanup failed:', fallbackError);
          }
        }
      } else {
        console.log('🔍 ZoomControlsOverlay: No zoom listener to clean up');
      }
    };
  }, [isMapReady, mapRef]);

  // Enhanced zoom handlers with comprehensive error handling and validation
  const handleZoomIn = React.useCallback(() => {
    console.log('🔍 ZoomControlsOverlay: ZOOM IN clicked');
    
    if (!mapRef?.current) {
      console.error('❌ ZoomControlsOverlay: No map reference available for zoom in');
      return;
    }
    
    try {
      const map = mapRef.current;
      
      // Enhanced validation
      if (typeof map.getZoom !== 'function' || typeof map.setZoom !== 'function') {
        console.error('❌ ZoomControlsOverlay: Map zoom methods not available');
        return;
      }
      
      const currentLevel = map.getZoom();
      
      if (typeof currentLevel === 'number' && !isNaN(currentLevel)) {
        if (currentLevel < 18) {
          const newZoom = Math.min(currentLevel + 1, 18);
          console.log(`🔍 ZoomControlsOverlay: Setting zoom from ${currentLevel} to ${newZoom}`);
          
          // Use setZoom with enhanced error checking
          map.setZoom(newZoom);
          
          // Verify the zoom was set
          setTimeout(() => {
            try {
              const actualZoom = map.getZoom();
              console.log(`🔍 ZoomControlsOverlay: Zoom verification - expected: ${newZoom}, actual: ${actualZoom}`);
            } catch (verifyError) {
              console.warn('⚠️ ZoomControlsOverlay: Could not verify zoom level:', verifyError);
            }
          }, 100);
        } else {
          console.log('🔍 ZoomControlsOverlay: Already at maximum zoom level');
        }
      } else {
        console.error('❌ ZoomControlsOverlay: Invalid current zoom level:', currentLevel);
      }
    } catch (error) {
      console.error('❌ ZoomControlsOverlay: Error zooming in:', error);
    }
  }, [mapRef]);

  const handleZoomOut = React.useCallback(() => {
    console.log('🔍 ZoomControlsOverlay: ZOOM OUT clicked');
    
    if (!mapRef?.current) {
      console.error('❌ ZoomControlsOverlay: No map reference available for zoom out');
      return;
    }
    
    try {
      const map = mapRef.current;
      
      // Enhanced validation
      if (typeof map.getZoom !== 'function' || typeof map.setZoom !== 'function') {
        console.error('❌ ZoomControlsOverlay: Map zoom methods not available');
        return;
      }
      
      const currentLevel = map.getZoom();
      
      if (typeof currentLevel === 'number' && !isNaN(currentLevel)) {
        if (currentLevel > 3) {
          const newZoom = Math.max(currentLevel - 1, 3);
          console.log(`🔍 ZoomControlsOverlay: Setting zoom from ${currentLevel} to ${newZoom}`);
          
          // Use setZoom with enhanced error checking
          map.setZoom(newZoom);
          
          // Verify the zoom was set
          setTimeout(() => {
            try {
              const actualZoom = map.getZoom();
              console.log(`🔍 ZoomControlsOverlay: Zoom verification - expected: ${newZoom}, actual: ${actualZoom}`);
            } catch (verifyError) {
              console.warn('⚠️ ZoomControlsOverlay: Could not verify zoom level:', verifyError);
            }
          }, 100);
        } else {
          console.log('🔍 ZoomControlsOverlay: Already at minimum zoom level');
        }
      } else {
        console.error('❌ ZoomControlsOverlay: Invalid current zoom level:', currentLevel);
      }
    } catch (error) {
      console.error('❌ ZoomControlsOverlay: Error zooming out:', error);
    }
  }, [mapRef]);

  // Don't render anything if map isn't ready
  if (!isMapReady) {
    console.log('🔍 ZoomControlsOverlay: Not rendering - map not ready');
    return null;
  }

  // Enhanced positioning to completely avoid overlay system
  return (
    <div 
      className="fixed bottom-20 left-6 z-50"
      style={{ 
        pointerEvents: 'auto',
        position: 'fixed',
        zIndex: 9999,
        isolation: 'isolate' // Create new stacking context
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
