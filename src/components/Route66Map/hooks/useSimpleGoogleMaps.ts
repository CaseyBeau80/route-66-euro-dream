
import { useState, useRef, useCallback } from 'react';

export const useSimpleGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | undefined>(undefined);
  const [currentZoom, setCurrentZoom] = useState(5);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  
  const mapRef = useRef<google.maps.Map | null>(null);

  // Simple zoom handler - no frequent updates
  const handleZoomChange = useCallback(() => {
    if (mapRef.current) {
      const newZoom = mapRef.current.getZoom() || 5;
      setCurrentZoom(newZoom);
      console.log('🔍 Zoom changed to:', newZoom);
    }
  }, []);

  // Map click handler
  const handleMapClick = useCallback(() => {
    setActiveMarker(null);
  }, []);

  // Marker click handler
  const handleMarkerClick = useCallback((markerId: string) => {
    setActiveMarker(markerId);
  }, []);

  // Minimal setup - let Google Maps handle navigation completely natively
  const setupMapListeners = useCallback((map: google.maps.Map) => {
    console.log('🗺️ Setting up native Google Maps navigation - no React interference');
    
    // Clear any existing listeners
    google.maps.event.clearInstanceListeners(map);
    
    // Only essential listeners - no drag state tracking
    map.addListener('zoom_changed', handleZoomChange);
    
    console.log('✅ Native Google Maps navigation enabled without React interference');
  }, [handleZoomChange]);

  // Initialize Google Maps API
  const initializeGoogleMaps = useCallback(() => {
    try {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        setLoadError(undefined);
        console.log('✅ Google Maps API ready for native navigation');
      } else {
        throw new Error('Google Maps API not available');
      }
    } catch (error) {
      console.error('❌ Google Maps API loading error:', error);
      setLoadError(error as Error);
    }
  }, []);

  return {
    isLoaded,
    loadError,
    currentZoom,
    activeMarker,
    mapRef,
    setCurrentZoom,
    handleMapClick,
    handleMarkerClick,
    setupMapListeners,
    initializeGoogleMaps
  };
};
