
import { useState, useRef, useCallback, useMemo } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { useMapLoading } from './useMapLoading';

// Define libraries as a constant to prevent recreating the array - using only maps library
const GOOGLE_MAPS_LIBRARIES: ("maps")[] = ['maps'];

export const useGoogleMaps = () => {
  // Memoize the API key to prevent it from changing between renders
  const apiKey = useMemo(() => {
    // Use hardcoded API key for production
    const hardcodedApiKey = 'AIzaSyCj2hJjT8wA0G3gBmUaK7qmhKX8Uv3mDH8';
    const envApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const storedApiKey = localStorage.getItem('google_maps_api_key');
    
    console.log('🔑 API Key check:', { 
      hasHardcodedKey: !!hardcodedApiKey,
      hasEnvKey: !!envApiKey, 
      hasStoredKey: !!storedApiKey,
      storedKeyLength: storedApiKey?.length || 0
    });
    
    // Prioritize hardcoded key, then stored, then env
    if (hardcodedApiKey && hardcodedApiKey.trim() !== '') {
      console.log('🔑 Using hardcoded API key');
      return hardcodedApiKey.trim();
    } else if (storedApiKey && storedApiKey.trim() !== '' && storedApiKey !== 'demo-key') {
      console.log('🔑 Using stored API key');
      return storedApiKey.trim();
    } else if (envApiKey && envApiKey.trim() !== '' && envApiKey !== 'demo-key') {
      console.log('🔑 Using environment API key');
      return envApiKey.trim();
    }
    
    console.log('🔑 No valid API key found');
    return '';
  }, []);

  // Enhanced validation - check if key looks like a real Google Maps API key
  const isValidGoogleMapsKey = (key: string): boolean => {
    if (!key || key.trim() === '' || key === 'demo-key') return false;
    
    // Check if key starts with common test/placeholder text (but NOT AIzaSy which is valid)
    const invalidPrefixes = ['What do yo', 'I am tryin', 'your_', 'demo', 'test', 'placeholder', 'YOUR_API_KEY', 'enter_your'];
    const keyLower = key.toLowerCase();
    
    for (const prefix of invalidPrefixes) {
      if (keyLower.startsWith(prefix.toLowerCase())) {
        console.log(`🔑 Invalid API key detected - starts with: ${prefix}`);
        return false;
      }
    }
    
    // Google Maps API keys are typically 39 characters and start with 'AIzaSy'
    if (key.length < 35) {
      console.log('🔑 API key too short');
      return false;
    }
    
    // Accept keys that start with AIzaSy (legitimate Google Maps API keys)
    if (key.startsWith('AIzaSy')) {
      console.log('🔑 Valid Google Maps API key format detected');
      return true;
    }
    
    // For other formats, be more lenient but still check basic criteria
    if (key.length >= 35 && !/^[a-zA-Z_\s]/.test(key)) {
      console.log('🔑 API key appears to be in valid format');
      return true;
    }
    
    console.log('🔑 API key format appears invalid');
    return false;
  };

  const shouldLoadApi = isValidGoogleMapsKey(apiKey);
  
  console.log('🗺️ Google Maps loader config:', {
    shouldLoadApi,
    apiKeyLength: apiKey.length,
    apiKeyPrefix: apiKey.substring(0, 10) + '...',
    isValidKey: shouldLoadApi,
    libraries: GOOGLE_MAPS_LIBRARIES
  });

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: shouldLoadApi ? apiKey : '',
    libraries: GOOGLE_MAPS_LIBRARIES,
    version: 'weekly',
    language: 'en',
    region: 'US',
    preventGoogleFontsLoading: true
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

  // If no API key is available or the key is clearly invalid, return appropriate state
  if (!shouldLoadApi) {
    console.log('🔑 No valid Google Maps API key available - showing input form');
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
