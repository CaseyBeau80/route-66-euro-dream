
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
    
    // Simplified Google Maps API readiness check
    const checkGoogleMapsApiReady = () => {
      if (!window.google || !window.google.maps) {
        console.log('⏳ Google Maps API base not loaded yet');
        return false;
      }
      
      // Check for marker API - but be more flexible about it
      if (!window.google.maps.marker) {
        console.log('⏳ Google Maps marker API not loaded yet, but continuing anyway');
        // Don't fail if marker API isn't loaded - we can work without it
      }
      
      return true;
    };

    // Simplified map readiness check
    const checkMapReady = () => {
      try {
        // First check if Google Maps API is available
        if (!checkGoogleMapsApiReady()) {
          return false;
        }

        // Test basic map functionality
        const center = map.getCenter();
        
        if (center) {
          console.log('✅ Map is ready - center is available');
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

    // Set up a more aggressive interval to check map readiness
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max
    
    const readinessInterval = setInterval(() => {
      attempts++;
      
      if (checkMapReady()) {
        clearInterval(readinessInterval);
        return;
      }
      
      // If we've tried too many times, assume the map is ready anyway
      if (attempts >= maxAttempts) {
        console.log('⚠️ Map readiness timeout - assuming map is ready');
        clearInterval(readinessInterval);
        initializationRef.current = true;
        setIsMapReady(true);
        onMapReady(map);
        return;
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

    // Add event listeners with error handling
    let tilesLoadedListener: google.maps.MapsEventListener | null = null;
    let idleListener: google.maps.MapsEventListener | null = null;
    
    try {
      tilesLoadedListener = map.addListener('tilesloaded', onTilesLoaded);
      idleListener = map.addListener('idle', onIdle);
    } catch (error) {
      console.log('⚠️ Could not add event listeners:', error);
    }

    // Cleanup
    return () => {
      console.log('🧹 MapInitializationService cleanup');
      clearInterval(readinessInterval);
      if (tilesLoadedListener) {
        try {
          tilesLoadedListener.remove();
        } catch (error) {
          console.log('⚠️ Error removing tiles loaded listener:', error);
        }
      }
      if (idleListener) {
        try {
          idleListener.remove();
        } catch (error) {
          console.log('⚠️ Error removing idle listener:', error);
        }
      }
      initializationRef.current = false;
    };
  }, [map, onMapReady]);

  return null;
};

export default MapInitializationService;
