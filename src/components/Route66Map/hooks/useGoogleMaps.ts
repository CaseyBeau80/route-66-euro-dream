import { useState, useRef, useCallback, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { useMapLoading } from './useMapLoading';
import { GoogleMapsIntegrationService } from '../../TripCalculator/services/GoogleMapsIntegrationService';

// Define libraries as a constant to prevent recreating the array
const GOOGLE_MAPS_LIBRARIES: ("maps")[] = ['maps'];

export const useGoogleMaps = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyLoading, setApiKeyLoading] = useState<boolean>(true);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [hasTriedLoading, setHasTriedLoading] = useState<boolean>(false);
  
  // Load API key on component mount
  useEffect(() => {
    let mounted = true;
    
    const loadApiKey = async () => {
      if (hasTriedLoading) return; // Prevent multiple attempts
      
      try {
        console.log('🔑 Loading Google Maps API key...');
        setApiKeyLoading(true);
        setApiKeyError(null);
        setHasTriedLoading(true);
        
        const key = await GoogleMapsIntegrationService.getApiKey();
        
        if (!mounted) return; // Component unmounted
        
        if (key && key.trim().length > 0) {
          setApiKey(key);
          console.log('✅ Google Maps API key loaded successfully:', key.substring(0, 8) + '...');
        } else {
          setApiKeyError('No API key available');
          console.log('❌ No Google Maps API key available');
        }
      } catch (error) {
        if (!mounted) return; // Component unmounted
        
        console.error('❌ Failed to load Google Maps API key:', error);
        setApiKeyError(error instanceof Error ? error.message : 'Failed to load API key');
      } finally {
        if (mounted) {
          setApiKeyLoading(false);
        }
      }
    };

    loadApiKey();
    
    return () => {
      mounted = false;
    };
  }, [hasTriedLoading]);
  
  // Enhanced validation - check if key looks like a real Google Maps API key
  const isValidGoogleMapsKey = (key: string | null): boolean => {
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

  const hasValidApiKey = !apiKeyLoading && !apiKeyError && isValidGoogleMapsKey(apiKey);
  
  console.log('🗺️ Google Maps state:', {
    apiKeyLoading,
    apiKeyError,
    hasValidApiKey,
    apiKeyLength: apiKey?.length || 0,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'none',
    hasTriedLoading
  });

  // CRITICAL: Only initialize loader when we have a valid API key
  // Pass empty string when no key to prevent loader issues
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: hasValidApiKey ? apiKey! : '', // Use actual key or empty string
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

  const setApiKeyAndReload = useCallback((newApiKey: string) => {
    const trimmedKey = newApiKey.trim();
    GoogleMapsIntegrationService.setApiKey(trimmedKey);
    console.log('🔑 API key updated, page will reload to initialize Google Maps');
    // Reload the page immediately to reinitialize Google Maps with new API key
    window.location.reload();
  }, []);

  const finalIsLoaded = hasValidApiKey && isLoaded;
  const finalLoadError = hasValidApiKey ? loadError : (apiKeyError ? new Error(apiKeyError) : null);

  console.log('🗺️ Google Maps final state:', {
    finalIsLoaded,
    finalLoadError: finalLoadError?.message,
    hasValidApiKey,
    actualIsLoaded: isLoaded,
    actualLoadError: loadError?.message
  });

  // Log any loading errors
  if (loadError && hasValidApiKey) {
    console.error('❌ Google Maps loading error:', loadError);
  }

  return {
    isLoaded: finalIsLoaded,
    loadError: finalLoadError,
    activeMarker,
    currentZoom,
    isDragging,
    mapRef,
    handleMarkerClick,
    handleMapClick,
    setCurrentZoom,
    setIsDragging,
    hasApiKey: hasValidApiKey,
    setApiKey: setApiKeyAndReload,
    apiKeyLoading
  };
};