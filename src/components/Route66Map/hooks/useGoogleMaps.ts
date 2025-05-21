
import { useRef, useCallback } from 'react';
import { route66Towns } from '@/types/route66';
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
  
  // Convert route66Towns to the format needed for the polyline
  const route66Path = route66Towns.map(town => ({
    lat: town.latLng[0],
    lng: town.latLng[1],
  }));
  
  // Map ref for potential future use
  const mapRef = useRef<google.maps.Map | null>(null);

  // Handle zoom controls
  const handleZoomIn = useCallback(() => {
    if (mapRef.current) {
      const newZoom = Math.min((mapRef.current.getZoom() || 5) + 1, 15);
      mapRef.current.setZoom(newZoom);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) {
      const newZoom = Math.max((mapRef.current.getZoom() || 5) - 1, 4);
      mapRef.current.setZoom(newZoom);
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
    route66Path,
    mapRef,
    handleMarkerClick,
    handleMapClick,
    handleZoomIn,
    handleZoomOut
  };
};
