
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
  // Focusing only on the 8 Route 66 states
  const route66States = ['IL', 'MO', 'KS', 'OK', 'TX', 'NM', 'AZ', 'CA'];
  
  const filteredTowns = route66Towns.filter(town => {
    const parts = town.name.split(', ');
    if (parts.length > 1) {
      const stateCode = parts[parts.length - 1];
      return route66States.includes(stateCode);
    }
    return false;
  });
  
  const route66Path = filteredTowns.map(town => ({
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
