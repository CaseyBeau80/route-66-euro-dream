
import { useState, useRef, useCallback, useMemo } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { useMapLoading } from './useMapLoading';

// Define libraries as a constant to prevent recreating the array
const GOOGLE_MAPS_LIBRARIES: ("maps")[] = ['maps'];

export const useGoogleMaps = () => {
  // Memoize the API key to prevent it from changing between renders
  const apiKey = useMemo(() => {
    const envApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const storedApiKey = localStorage.getItem('google_maps_api_key');
    
    if (envApiKey && envApiKey !== 'demo-key') {
      return envApiKey;
    } else if (storedApiKey && storedApiKey.trim() !== '') {
      return storedApiKey;
    }
    return '';
  }, []);

  // Only use the loader if we have a valid API key
  const shouldLoadApi = apiKey && apiKey.trim() !== '';
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: GOOGLE_MAPS_LIBRARIES,
    version: 'weekly',
    language: 'en',
    region: 'US',
    preventGoogleFontsLoading: true,
  });

  const {
    isDragging,
    setIsDragging,
    currentZoom,
    setCurrentZoom
  } = useMapLoading();

  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleMarkerClick = useCallback((markerId: string | number) => {
    const id = markerId.toString();
    console.log('🎯 Marker clicked:', id);
    setActiveMarker(prevActive => prevActive === id ? null : id);
  }, []);

  const handleMapClick = useCallback(() => {
    console.log('🗺️ Map clicked - clearing active marker');
    setActiveMarker(null);
  }, []);

  // If no API key is available, return a state that indicates this
  if (!shouldLoadApi) {
    console.log('🔑 No valid Google Maps API key found');
    return {
      isLoaded: false,
      loadError: new Error('No Google Maps API key provided'),
      activeMarker,
      currentZoom,
      isDragging,
      mapRef,
      handleMarkerClick,
      handleMapClick,
      setCurrentZoom,
      setIsDragging,
      hasApiKey: false
    };
  }

  return {
    isLoaded: shouldLoadApi ? isLoaded : false,
    loadError: shouldLoadApi ? loadError : new Error('No API key'),
    activeMarker,
    currentZoom,
    isDragging,
    mapRef,
    handleMarkerClick,
    handleMapClick,
    setCurrentZoom,
    setIsDragging,
    hasApiKey: shouldLoadApi
  };
};
