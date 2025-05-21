
import { useRef, useCallback } from 'react';
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

  return {
    isLoaded,
    loadError,
    activeMarker,
    currentZoom,
    setCurrentZoom,
    isDragging,
    setIsDragging,
    mapRef,
    handleMarkerClick,
    handleMapClick
  };
};
