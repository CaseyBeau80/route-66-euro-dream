
import { useState, useRef, useCallback } from 'react';
import { useMapLoading } from './useMapLoading';

export const useGoogleMaps = () => {
  const {
    isDragging,
    setIsDragging,
    currentZoom,
    setCurrentZoom
  } = useMapLoading();

  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleMarkerClick = useCallback((markerId: string) => {
    console.log('🎯 Marker clicked:', markerId);
    setActiveMarker(prevActive => prevActive === markerId ? null : markerId);
  }, []);

  const handleMapClick = useCallback(() => {
    console.log('🗺️ Map clicked - clearing active marker');
    setActiveMarker(null);
  }, []);

  return {
    activeMarker,
    currentZoom,
    isDragging,
    mapRef,
    handleMarkerClick,
    handleMapClick,
    setCurrentZoom,
    setIsDragging
  };
};
