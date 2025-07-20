import React, { createContext, useContext, useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { useMapLoading } from '../Route66Map/hooks/useMapLoading';
import { useSupabaseRoute66 } from '../Route66Map/hooks/useSupabaseRoute66';
import { GoogleMapsIntegrationService } from '../TripCalculator/services/GoogleMapsIntegrationService';

// Define libraries as a constant to prevent recreating the array
const GOOGLE_MAPS_LIBRARIES: ("maps")[] = ['maps'];

interface GlobalGoogleMapsContextType {
  isLoaded: boolean;
  loadError: any;
  activeMarker: string | null;
  currentZoom: number;
  isDragging: boolean;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  handleMarkerClick: (markerId: string | number) => void;
  handleMapClick: () => void;
  setCurrentZoom: (zoom: number) => void;
  setIsDragging: (dragging: boolean) => void;
  hasApiKey: boolean;
  setApiKey: (apiKey: string) => void;
  waypoints: any[];
  isLoading: boolean;
  error: any;
  apiKeyLoading: boolean;
}

const GlobalGoogleMapsContext = createContext<GlobalGoogleMapsContextType | null>(null);

export const useGlobalGoogleMapsContext = () => {
  const context = useContext(GlobalGoogleMapsContext);
  if (!context) {
    throw new Error('useGlobalGoogleMapsContext must be used within a GlobalGoogleMapsProvider');
  }
  return context;
};

interface GlobalGoogleMapsProviderProps {
  children: React.ReactNode;
}

export const GlobalGoogleMapsProvider: React.FC<GlobalGoogleMapsProviderProps> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyLoading, setApiKeyLoading] = useState<boolean>(true);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const mapRef = React.useRef<google.maps.Map | null>(null);

  // Load API key once globally
  useEffect(() => {
    let mounted = true;
    
    const loadApiKey = async () => {
      try {
        console.log('🔑 GlobalGoogleMapsProvider: Loading API key...');
        setApiKeyLoading(true);
        setApiKeyError(null);
        
        const key = await GoogleMapsIntegrationService.getApiKey();
        
        if (!mounted) return;
        
        if (key && key.trim().length > 0) {
          setApiKey(key);
          console.log('✅ GlobalGoogleMapsProvider: API key loaded successfully');
        } else {
          setApiKeyError('No API key available');
          console.log('❌ GlobalGoogleMapsProvider: No API key available');
        }
      } catch (error) {
        if (!mounted) return;
        
        console.error('❌ GlobalGoogleMapsProvider: Failed to load API key:', error);
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
  }, []);

  // Only call useJsApiLoader once globally when we have an API key
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
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

  const { waypoints, isLoading, error } = useSupabaseRoute66();

  const handleMarkerClick = React.useCallback((markerId: string | number) => {
    const id = markerId.toString();
    console.log('🎯 Global Marker clicked:', id);
    setActiveMarker(prevActive => prevActive === id ? null : id);
  }, []);

  const handleMapClick = React.useCallback(() => {
    console.log('🗺️ Global Map clicked - clearing active marker');
    setActiveMarker(null);
  }, []);

  const setApiKeyAndReload = React.useCallback((newApiKey: string) => {
    const trimmedKey = newApiKey.trim();
    GoogleMapsIntegrationService.setApiKey(trimmedKey);
    console.log('🔑 API key updated, page will reload to initialize Google Maps');
    window.location.reload();
  }, []);

  const hasValidApiKey = !apiKeyLoading && !apiKeyError && !!apiKey;
  const finalIsLoaded = hasValidApiKey && isLoaded;
  const finalLoadError = apiKeyError ? new Error(apiKeyError) : (hasValidApiKey ? loadError : null);

  console.log('🗺️ GlobalGoogleMapsProvider state:', {
    apiKeyLoading,
    apiKeyError,
    hasValidApiKey,
    finalIsLoaded,
    loadError: finalLoadError?.message
  });

  const contextValue: GlobalGoogleMapsContextType = {
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
    waypoints,
    isLoading,
    error,
    apiKeyLoading
  };

  return (
    <GlobalGoogleMapsContext.Provider value={contextValue}>
      {children}
    </GlobalGoogleMapsContext.Provider>
  );
};