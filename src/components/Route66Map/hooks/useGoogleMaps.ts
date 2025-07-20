
import { useState, useRef, useCallback, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { useMapLoading } from './useMapLoading';
import { GoogleMapsIntegrationService } from '../../TripCalculator/services/GoogleMapsIntegrationService';

// Define libraries as a constant to prevent recreating the array
const GOOGLE_MAPS_LIBRARIES: ("maps")[] = ['maps'];

export const useGoogleMaps = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [apiKeyLoading, setApiKeyLoading] = useState<boolean>(true);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  
  // Load API key on component mount
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        setApiKeyLoading(true);
        setApiKeyError(null);
        const key = await GoogleMapsIntegrationService.getApiKey();
        if (key) {
          setApiKey(key);
          console.log('✅ Google Maps API key loaded successfully');
        } else {
          setApiKeyError('No API key available');
          console.log('❌ No Google Maps API key available');
        }
      } catch (error) {
        console.error('❌ Failed to load Google Maps API key:', error);
        setApiKeyError(error instanceof Error ? error.message : 'Failed to load API key');
      } finally {
        setApiKeyLoading(false);
      }
    };

    loadApiKey();
  }, []);
  
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

  const hasApiKey = !apiKeyLoading && !apiKeyError && isValidGoogleMapsKey(apiKey);
  
  console.log('🗺️ Google Maps loader config:', {
    hasApiKey,
    apiKeyLoading,
    apiKeyError,
    apiKeyLength: apiKey.length,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'none',
    isValidKey: hasApiKey,
    libraries: GOOGLE_MAPS_LIBRARIES
  });

  // Only load Google Maps if we have a valid API key and it's not loading
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: GOOGLE_MAPS_LIBRARIES,
    version: 'weekly',
    language: 'en',
    region: 'US',
    preventGoogleFontsLoading: true,
    // Only load if we have a valid API key and not loading
    ...(hasApiKey ? {} : { googleMapsApiKey: '' })
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
    GoogleMapsIntegrationService.setApiKey(trimmedKey);
    console.log('🔑 API key updated, page will reload to initialize Google Maps');
    // Reload the page immediately to reinitialize Google Maps with new API key
    window.location.reload();
  }, []);

  console.log('🗺️ Google Maps loading state:', {
    isLoaded: hasApiKey ? isLoaded : false,
    loadError: hasApiKey ? loadError : null,
    hasValidApiKey: hasApiKey,
    actualIsLoaded: isLoaded,
    actualLoadError: loadError,
    apiKeyLoading,
    apiKeyError
  });

  // Log any loading errors
  if (loadError) {
    console.error('❌ Google Maps loading error:', loadError);
  }

  return {
    isLoaded: hasApiKey ? isLoaded : false,
    loadError: hasApiKey ? loadError : (apiKeyError ? new Error(apiKeyError) : null),
    activeMarker,
    currentZoom,
    isDragging,
    mapRef,
    handleMarkerClick,
    handleMapClick,
    setCurrentZoom,
    setIsDragging,
    hasApiKey,
    setApiKey: setApiKeyAndReload,
    apiKeyLoading
  };
};
