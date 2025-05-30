
import { useState, useRef, useCallback } from 'react';

export const useSimpleGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | undefined>(undefined);
  const [currentZoom, setCurrentZoom] = useState(5);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  
  const mapRef = useRef<google.maps.Map | null>(null);

  // Simple zoom handler - no debouncing, no center preservation
  const handleZoomChange = useCallback(() => {
    if (!mapRef.current) return;
    
    const newZoom = mapRef.current.getZoom() || 5;
    setCurrentZoom(newZoom);
    console.log('🔍 Zoom changed to:', newZoom);
  }, []);

  // Map click handler
  const handleMapClick = useCallback(() => {
    setActiveMarker(null);
  }, []);

  // Marker click handler
  const handleMarkerClick = useCallback((markerId: string) => {
    setActiveMarker(markerId);
  }, []);

  // Simple setup - let Google Maps handle everything natively
  const setupMapListeners = useCallback((map: google.maps.Map) => {
    console.log('🗺️ Setting up simple Google Maps listeners');
    
    // Clear any existing listeners
    google.maps.event.clearInstanceListeners(map);
    
    // Add simple zoom listener - no interference
    map.addListener('zoom_changed', handleZoomChange);
    
    console.log('✅ Simple zoom handling enabled - Google Maps native behavior');
  }, [handleZoomChange]);

  // Initialize Google Maps API
  const initializeGoogleMaps = useCallback(() => {
    try {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        setLoadError(undefined);
        console.log('✅ Google Maps API ready - native behavior enabled');
      } else {
        throw new Error('Google Maps API not available');
      }
    } catch (error) {
      console.error('❌ Google Maps API loading error:', error);
      setLoadError(error as Error);
    }
  }, []);

  // Simple cleanup
  const cleanup = useCallback(() => {
    console.log('🧹 Simple cleanup completed');
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
    initializeGoogleMaps,
    cleanup
  };
};
