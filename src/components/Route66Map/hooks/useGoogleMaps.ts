
import { useState, useRef, useCallback } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { useMapLoading } from './useMapLoading';

// Define libraries as a constant to prevent recreating the array
const GOOGLE_MAPS_LIBRARIES: ("maps")[] = ['maps'];

export const useGoogleMaps = () => {
  // Get API key with priority: Environment Variable > localStorage > demo key
  const getStoredApiKey = (): string => {
    // 1. Check environment variable first
    const envKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (envKey && envKey.trim() !== '' && envKey !== 'your_google_maps_api_key_here') {
      console.log('🔑 Using Google Maps API key from environment variable');
      return envKey.trim();
    }
    
    // 2. Check localStorage as fallback
    const storedKey = localStorage.getItem('google_maps_api_key');
    if (storedKey && storedKey.trim() !== '') {
      console.log('🔑 Using Google Maps API key from localStorage');
      return storedKey.trim();
    }
    
    // 3. Use your actual API key as fallback
    console.log('🔑 Using fallback Google Maps API key');
    return 'AIzaSyCj2hJjT8wA0G3gBmUaK7qmhKX8Uv3mDH8';
  };

  const [apiKey, setApiKey] = useState<string>(getStoredApiKey());
  
  // Enhanced validation - check if key looks like a real Google Maps API key
  const isValidGoogleMapsKey = (key: string): boolean => {
    if (!key || key.trim() === '' || key === 'demo-key') return false;
    
    // Check if key starts with common test/placeholder text
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

  const hasApiKey = isValidGoogleMapsKey(apiKey);
  
  console.log('🗺️ Google Maps loader config:', {
    hasApiKey,
    apiKeyLength: apiKey.length,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'none',
    isValidKey: hasApiKey,
    libraries: GOOGLE_MAPS_LIBRARIES,
    envVar: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing',
    currentDomain: typeof window !== 'undefined' ? window.location.hostname : 'Unknown'
  });

  // Only load Google Maps if we have a valid API key
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: hasApiKey ? apiKey : '',
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

  const setApiKeyAndReload = useCallback((newApiKey: string) => {
    const trimmedKey = newApiKey.trim();
    localStorage.setItem('google_maps_api_key', trimmedKey);
    console.log('🔑 API key updated, page will reload to initialize Google Maps');
    // Reload the page immediately to reinitialize Google Maps with new API key
    window.location.reload();
  }, []);

  console.log('🗺️ Google Maps loading state:', {
    isLoaded: hasApiKey ? isLoaded : false,
    loadError: hasApiKey ? loadError : null,
    hasValidApiKey: hasApiKey,
    actualIsLoaded: isLoaded,
    actualLoadError: loadError
  });

  // Log any loading errors
  if (loadError) {
    console.error('❌ Google Maps loading error:', loadError);
  }

  return {
    isLoaded: hasApiKey ? isLoaded : false,
    loadError: hasApiKey ? loadError : null,
    activeMarker,
    currentZoom,
    isDragging,
    mapRef,
    handleMarkerClick,
    handleMapClick,
    setCurrentZoom,
    setIsDragging,
    hasApiKey,
    setApiKey: setApiKeyAndReload
  };
};
