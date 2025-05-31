
import React, { useEffect, useRef, useState } from 'react';

interface MapInitializationServiceProps {
  map: google.maps.Map;
  onMapReady: (map: google.maps.Map) => void;
}

const MapInitializationService: React.FC<MapInitializationServiceProps> = ({ 
  map, 
  onMapReady 
}) => {
  const [isMapReady, setIsMapReady] = useState(false);
  const initializationRef = useRef(false);

  useEffect(() => {
    if (!map || initializationRef.current) return;

    console.log('🚀 MapInitializationService: Starting map readiness check');
    
    // Check if Google Maps API is fully loaded
    const checkGoogleMapsApiReady = () => {
      if (!window.google || !window.google.maps || !window.google.maps.marker) {
        console.log('⏳ Google Maps API not fully loaded yet');
        return false;
      }
      return true;
    };

    // Check if map is already ready
    const checkMapReady = () => {
      try {
        // First check if Google Maps API is available
        if (!checkGoogleMapsApiReady()) {
          return false;
        }

        // Test if map methods are available and working
        const zoom = map.getZoom();
        const center = map.getCenter();
        
        if (zoom !== undefined && center && typeof zoom === 'number') {
          console.log('✅ Map is ready - zoom and center are available');
          initializationRef.current = true;
          setIsMapReady(true);
          onMapReady(map);
          return true;
        }
        return false;
      } catch (error) {
        console.log('⏳ Map not ready yet:', error);
        return false;
      }
    };

    // Try immediate check
    if (checkMapReady()) return;

    // Set up interval to check map readiness
    const readinessInterval = setInterval(() => {
      if (checkMapReady()) {
        clearInterval(readinessInterval);
      }
    }, 100);

    // Also listen for map events that indicate readiness
    const onTilesLoaded = () => {
      console.log('📍 Map tiles loaded event received');
      setTimeout(() => {
        if (checkMapReady()) {
          clearInterval(readinessInterval);
        }
      }, 100);
    };

    const onIdle = () => {
      console.log('🎯 Map idle event received');
      if (checkMapReady()) {
        clearInterval(readinessInterval);
      }
    };

    // Add event listeners
    const tilesLoadedListener = map.addListener('tilesloaded', onTilesLoaded);
    const idleListener = map.addListener('idle', onIdle);

    // Cleanup
    return () => {
      console.log('🧹 MapInitializationService cleanup');
      clearInterval(readinessInterval);
      if (tilesLoadedListener) tilesLoadedListener.remove();
      if (idleListener) idleListener.remove();
      initializationRef.current = false;
    };
  }, [map, onMapReady]);

  return null;
};

export default MapInitializationService;
