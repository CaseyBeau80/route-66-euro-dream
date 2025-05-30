
import { useState, useRef, useCallback } from 'react';

export const useSimpleGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | undefined>(undefined);
  const [currentZoom, setCurrentZoom] = useState(5);
  const [isDragging, setIsDragging] = useState(false);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  
  const mapRef = useRef<google.maps.Map | null>(null);

  // Simplified zoom handler
  const handleZoomChange = useCallback(() => {
    if (mapRef.current) {
      const newZoom = mapRef.current.getZoom() || 5;
      setCurrentZoom(newZoom);
      console.log('🔍 Zoom changed to:', newZoom);
    }
  }, []);

  // Simplified drag handlers
  const handleDragStart = useCallback(() => {
    console.log('🖱️ Drag started');
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    console.log('🖱️ Drag ended');
    setIsDragging(false);
  }, []);

  // Map click handler
  const handleMapClick = useCallback(() => {
    setActiveMarker(null);
  }, []);

  // Marker click handler
  const handleMarkerClick = useCallback((markerId: string) => {
    setActiveMarker(markerId);
  }, []);

  // Setup map listeners
  const setupMapListeners = useCallback((map: google.maps.Map) => {
    console.log('🗺️ Setting up simple map listeners');
    
    // Clear any existing listeners
    google.maps.event.clearInstanceListeners(map);
    
    // Add basic listeners
    map.addListener('zoom_changed', handleZoomChange);
    map.addListener('dragstart', handleDragStart);
    map.addListener('dragend', handleDragEnd);
    
    console.log('✅ Map listeners configured successfully');
  }, [handleZoomChange, handleDragStart, handleDragEnd]);

  // Initialize Google Maps API
  const initializeGoogleMaps = useCallback(() => {
    try {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        setLoadError(undefined);
        console.log('✅ Google Maps API loaded successfully');
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
    isDragging,
    activeMarker,
    mapRef,
    setCurrentZoom,
    setIsDragging,
    handleMapClick,
    handleMarkerClick,
    setupMapListeners,
    initializeGoogleMaps
  };
};
