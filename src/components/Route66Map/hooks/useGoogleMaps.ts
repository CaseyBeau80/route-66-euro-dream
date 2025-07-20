import { useState, useRef, useCallback } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { useMapLoading } from './useMapLoading';
import { GoogleMapsIntegrationService } from '../../TripCalculator/services/GoogleMapsIntegrationService';

// Define libraries as a constant to prevent recreating the array
const GOOGLE_MAPS_LIBRARIES: ("maps")[] = ['maps'];

export const useGoogleMaps = () => {
  // Get API key synchronously from localStorage as fallback
  // The main loading is now handled by the parent component
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
  
  console.log('🗺️ useGoogleMaps: Using API key:', {
    hasKey: !!apiKey,
    keyLength: apiKey.length,
    keyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'none'
  });

  // Initialize Google Maps loader with consistent options
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

  const setApiKeyAndReload = useCallback((newApiKey: string) => {
    const trimmedKey = newApiKey.trim();
    GoogleMapsIntegrationService.setApiKey(trimmedKey);
    console.log('🔑 API key updated, page will reload to initialize Google Maps');
    // Reload the page immediately to reinitialize Google Maps with new API key
    window.location.reload();
  }, []);

  console.log('🗺️ useGoogleMaps final state:', {
    isLoaded,
    loadError: loadError?.message,
    hasApiKey: !!apiKey
  });

  // Log any loading errors
  if (loadError) {
    console.error('❌ Google Maps loading error:', loadError);
  }

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