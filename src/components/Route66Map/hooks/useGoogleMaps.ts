import { useState, useRef, useCallback } from 'react';
import { useMapLoading } from './useMapLoading';
import { GoogleMapsIntegrationService } from '../../TripCalculator/services/GoogleMapsIntegrationService';

// DEPRECATED: This hook is no longer used and should be replaced with useGlobalGoogleMapsContext
// Keeping it for backward compatibility but removing the useJsApiLoader call to prevent conflicts

export const useGoogleMaps = () => {
  // Get API key synchronously from localStorage as fallback
  const getApiKey = (): string => {
    try {
      const storedKey = localStorage.getItem('google_maps_api_key');
      if (storedKey && storedKey.trim().length > 0) {
        return storedKey.trim();
      }
    } catch (error) {
      console.warn('⚠️ Failed to get API key from localStorage:', error);
    }
    return ''; // Return empty string as fallback
  };

  const apiKey = getApiKey();
  
  console.log('🗺️ useGoogleMaps: DEPRECATED - Use useGlobalGoogleMapsContext instead');

  // NO LONGER CALLING useJsApiLoader to prevent conflicts with GlobalGoogleMapsProvider
  // Return mock values since this hook is deprecated
  const isLoaded = false;
  const loadError = new Error('useGoogleMaps is deprecated - use useGlobalGoogleMapsContext instead');

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

  return {
    isLoaded,
    loadError,
    activeMarker,
    currentZoom,
    isDragging,
    mapRef,
    handleMarkerClick,
    handleMapClick,
    setCurrentZoom,
    setIsDragging,
    hasApiKey: !!apiKey,
    setApiKey: setApiKeyAndReload,
    apiKeyLoading: false // Always false since loading is handled upstream
  };
};