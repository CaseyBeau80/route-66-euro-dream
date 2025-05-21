
import { useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { googleMapsApiKey } from '../config/MapConfig';

export const useMapLoading = () => {
  // Load the Google Maps JS API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey,
  });

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [currentZoom, setCurrentZoom] = useState<number>(5);

  return {
    isLoaded,
    loadError,
    isDragging,
    setIsDragging,
    currentZoom,
    setCurrentZoom
  };
};
