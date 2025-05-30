import { useState, useRef, useCallback } from 'react';

export const useSimpleGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | undefined>(undefined);
  const [currentZoom, setCurrentZoom] = useState(5);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  
  const mapRef = useRef<google.maps.Map | null>(null);
  const zoomDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastZoomTimeRef = useRef<number>(0);
  const centerPreservationRef = useRef<google.maps.LatLng | null>(null);
  const isRapidZoomingRef = useRef(false);

  // Debounced zoom handler with rapid zoom detection
  const handleZoomChange = useCallback(() => {
    if (!mapRef.current) return;
    
    const now = Date.now();
    const timeSinceLastZoom = now - lastZoomTimeRef.current;
    
    // Detect rapid zooming (less than 200ms between zoom events)
    if (timeSinceLastZoom < 200) {
      isRapidZoomingRef.current = true;
      
      // Preserve current center during rapid zoom
      if (!centerPreservationRef.current) {
        const currentCenter = mapRef.current.getCenter();
        if (currentCenter) {
          centerPreservationRef.current = currentCenter;
          console.log('🎯 Preserving center during rapid zoom:', currentCenter.toJSON());
        }
      }
    } else {
      isRapidZoomingRef.current = false;
      centerPreservationRef.current = null;
    }
    
    lastZoomTimeRef.current = now;
    
    // Clear existing debounce timer
    if (zoomDebounceRef.current) {
      clearTimeout(zoomDebounceRef.current);
    }
    
    // Debounce zoom updates to prevent rapid state changes
    zoomDebounceRef.current = setTimeout(() => {
      if (mapRef.current) {
        const newZoom = mapRef.current.getZoom() || 5;
        setCurrentZoom(newZoom);
        console.log('🔍 Debounced zoom update to:', newZoom);
        
        // Restore preserved center if we have one
        if (centerPreservationRef.current) {
          console.log('🎯 Restoring preserved center after rapid zoom:', centerPreservationRef.current.toJSON());
          mapRef.current.setCenter(centerPreservationRef.current);
          centerPreservationRef.current = null;
        }
        
        isRapidZoomingRef.current = false;
      }
    }, 300); // Increased debounce time for better stability
  }, []);

  // Map click handler
  const handleMapClick = useCallback(() => {
    setActiveMarker(null);
  }, []);

  // Marker click handler
  const handleMarkerClick = useCallback((markerId: string) => {
    setActiveMarker(markerId);
  }, []);

  // Enhanced setup with rapid zoom protection
  const setupMapListeners = useCallback((map: google.maps.Map) => {
    console.log('🗺️ Setting up enhanced zoom protection for Google Maps');
    
    // Clear any existing listeners
    google.maps.event.clearInstanceListeners(map);
    
    // Add protected zoom listener
    map.addListener('zoom_changed', handleZoomChange);
    
    // Add bounds change listener to prevent unwanted center changes
    map.addListener('bounds_changed', () => {
      if (isRapidZoomingRef.current && centerPreservationRef.current) {
        // During rapid zoom, keep the center stable
        setTimeout(() => {
          if (centerPreservationRef.current && mapRef.current) {
            mapRef.current.setCenter(centerPreservationRef.current);
          }
        }, 50);
      }
    });
    
    console.log('✅ Enhanced zoom protection enabled');
  }, [handleZoomChange]);

  // Initialize Google Maps API
  const initializeGoogleMaps = useCallback(() => {
    try {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        setLoadError(undefined);
        console.log('✅ Google Maps API ready with enhanced zoom protection');
      } else {
        throw new Error('Google Maps API not available');
      }
    } catch (error) {
      console.error('❌ Google Maps API loading error:', error);
      setLoadError(error as Error);
    }
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (zoomDebounceRef.current) {
      clearTimeout(zoomDebounceRef.current);
    }
    centerPreservationRef.current = null;
    isRapidZoomingRef.current = false;
    lastZoomTimeRef.current = 0;
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
