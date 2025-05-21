
import { useState, useRef, useCallback } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { route66Towns } from '@/types/route66';
import { googleMapsApiKey } from '../config/MapConfig';

export const useGoogleMaps = () => {
  // Load the Google Maps JS API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey,
  });

  // State for active marker and zoom level
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(5);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Convert route66Towns to the format needed for the polyline
  const route66Path = route66Towns.map(town => ({
    lat: town.latLng[0],
    lng: town.latLng[1],
  }));
  
  // Map ref for potential future use
  const mapRef = useRef<google.maps.Map | null>(null);

  // Handle marker click
  const handleMarkerClick = (index: number) => {
    setActiveMarker(index === activeMarker ? null : index);
  };

  // Handle map click
  const handleMapClick = () => {
    setActiveMarker(null);
  };

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
    setActiveMarker,
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
