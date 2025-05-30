
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
    
    console.log('🔑 API Key check:', { 
      hasEnvKey: !!envApiKey, 
      envKeyValue: envApiKey, 
      hasStoredKey: !!storedApiKey,
      storedKeyLength: storedApiKey?.length || 0
    });
    
    // Prioritize stored API key over env key for user-provided keys
    if (storedApiKey && storedApiKey.trim() !== '' && storedApiKey !== 'demo-key') {
      console.log('🔑 Using stored API key');
      return storedApiKey.trim();
    } else if (envApiKey && envApiKey.trim() !== '' && envApiKey !== 'demo-key') {
      console.log('🔑 Using environment API key');
      return envApiKey.trim();
    }
    
    console.log('🔑 No valid API key found');
    return '';
  }, []);

  // Only use the loader if we have a valid API key
  const shouldLoadApi = apiKey && apiKey.trim() !== '' && apiKey !== 'demo-key';
  
  console.log('🗺️ Google Maps loader config:', {
    shouldLoadApi,
    apiKeyLength: apiKey.length,
    apiKeyPrefix: apiKey.substring(0, 10) + '...'
  });

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: shouldLoadApi ? apiKey : '',
    libraries: GOOGLE_MAPS_LIBRARIES,
    version: 'weekly',
    language: 'en',
    region: 'US',
    preventGoogleFontsLoading: true,
    // Add additional options to prevent conflicts
    loadScriptOptions: {
      async: true,
      defer: true,
    }
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
    console.log('🔑 No valid Google Maps API key available');
    return {
      isLoaded: false,
      loadError: null,
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

  // Log any loading errors
  if (loadError) {
    console.error('❌ Google Maps loading error:', loadError);
  }

  return {
    isLoaded: shouldLoadApi ? isLoaded : false,
    loadError: shouldLoadApi ? loadError : null,
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
