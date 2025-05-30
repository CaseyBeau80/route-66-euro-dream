
import { useState, useRef, useCallback } from 'react';

export const useSimpleGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | undefined>(undefined);
  const [currentZoom, setCurrentZoom] = useState(5);
  const [isDragging, setIsDragging] = useState(false);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  
  const mapRef = useRef<google.maps.Map | null>(null);

  // Simple zoom handler
  const handleZoomChange = useCallback(() => {
    if (mapRef.current) {
      const newZoom = mapRef.current.getZoom() || 5;
      setCurrentZoom(newZoom);
      console.log('🔍 Zoom changed to:', newZoom);
    }
  }, []);

  // Minimal drag handlers - let Google Maps handle the actual dragging
  const handleDragStart = useCallback(() => {
    console.log('🖱️ User started dragging');
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    console.log('🖱️ User finished dragging');
    // Small delay to ensure smooth UX
    setTimeout(() => {
      setIsDragging(false);
    }, 100);
  }, []);

  // Map click handler
  const handleMapClick = useCallback(() => {
    setActiveMarker(null);
  }, []);

  // Marker click handler
  const handleMarkerClick = useCallback((markerId: string) => {
    setActiveMarker(markerId);
  }, []);

  // Minimal setup - let Google Maps handle navigation natively
  const setupMapListeners = useCallback((map: google.maps.Map) => {
    console.log('🗺️ Setting up minimal map listeners for navigation');
    
    // Clear any existing listeners
    google.maps.event.clearInstanceListeners(map);
    
    // Only essential listeners
    map.addListener('zoom_changed', handleZoomChange);
    map.addListener('dragstart', handleDragStart);
    map.addListener('dragend', handleDragEnd);
    
    console.log('✅ Minimal listeners configured for optimal navigation');
  }, [handleZoomChange, handleDragStart, handleDragEnd]);

  // Initialize Google Maps API
  const initializeGoogleMaps = useCallback(() => {
    try {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        setLoadError(undefined);
        console.log('✅ Google Maps API ready for navigation');
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
