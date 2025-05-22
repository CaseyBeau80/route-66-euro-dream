
import { useRef, useCallback, useState } from 'react';
import { useMapLoading } from './useMapLoading';
import { useMarkerInteraction } from './useMarkerInteraction';
import { mapBounds } from '../config/MapConfig';

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
    
    // Check if the current view is outside the Route 66 corridor
    const route66LatLngBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(mapBounds.south, mapBounds.west),
      new google.maps.LatLng(mapBounds.north, mapBounds.east)
    );
    
    // Check if the current view is completely outside the Route 66 corridor
    if (!route66LatLngBounds.intersects(bounds)) {
      setIsOutOfBounds(true);
      
      // Auto-correct by panning back to the Route 66 corridor
      mapRef.current.panToBounds(route66LatLngBounds);
    } else {
      setIsOutOfBounds(false);
    }
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
