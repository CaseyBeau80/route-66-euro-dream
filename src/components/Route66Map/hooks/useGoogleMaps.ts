
import { useRef, useCallback, useState } from 'react';
import { useMapLoading } from './useMapLoading';
import { useMarkerInteraction } from './useMarkerInteraction';

export const useGoogleMaps = () => {
  // Use our extracted hooks
  const {
    isLoaded,
    loadError,
    isDragging,
    setIsDragging,
    currentZoom,
    setCurrentZoom
  } = useMapLoading();
  
  const {
    activeMarker,
    handleMarkerClick,
    handleMapClick
  } = useMarkerInteraction();
  
  // Map ref for potential future use
  const mapRef = useRef<google.maps.Map | null>(null);
  
  // State for tracking bounds and restricted area
  const [isOutOfBounds, setIsOutOfBounds] = useState(false);

  // Handle checking if we're approaching map boundaries
  const checkMapBounds = useCallback(() => {
    if (!mapRef.current) return;
    
    const bounds = mapRef.current.getBounds();
    if (!bounds) return;
    
    // Here we could implement additional boundary checking logic if needed
  }, []);

  return {
    isLoaded,
    loadError,
    activeMarker,
    currentZoom,
    setCurrentZoom,
    isDragging,
    setIsDragging,
    mapRef,
    isOutOfBounds,
    checkMapBounds,
    handleMarkerClick,
    handleMapClick
  };
};
