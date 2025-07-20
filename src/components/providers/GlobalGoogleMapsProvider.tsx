import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMapLoading } from '../Route66Map/hooks/useMapLoading';
import { useSupabaseRoute66 } from '../Route66Map/hooks/useSupabaseRoute66';
import { GoogleMapsIntegrationService } from '../TripCalculator/services/GoogleMapsIntegrationService';
import { MarkerCompatibilityPatch } from '../Route66Map/services/MarkerCompatibilityPatch';

// Define libraries as a constant to prevent recreating the array
const GOOGLE_MAPS_LIBRARIES: ("maps" | "marker")[] = ['maps', 'marker'];

// Singleton to prevent multiple loader calls in StrictMode
let loaderInstance: any = null;
let loaderPromise: Promise<any> | null = null;

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

// Inner provider that only renders when we have an API key
const InnerGoogleMapsProvider: React.FC<{ apiKey: string; children: React.ReactNode }> = ({ apiKey, children }) => {
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<any>(null);
  const mapRef = React.useRef<google.maps.Map | null>(null);

  // Custom loader implementation that handles StrictMode
  useEffect(() => {
    const loadGoogleMaps = async () => {
      // Return early if already loaded
      if (loaderInstance && isLoaded) {
        console.log('🔄 InnerGoogleMapsProvider: Google Maps already loaded');
        return;
      }

      // Return the existing promise if loading is in progress
      if (loaderPromise) {
        console.log('🔄 InnerGoogleMapsProvider: Google Maps loading already in progress');
        try {
          await loaderPromise;
          setIsLoaded(true);
        } catch (error) {
          setLoadError(error);
        }
        return;
      }

      console.log('🔄 InnerGoogleMapsProvider: Starting Google Maps load with API key:', {
        keyLength: apiKey.length,
        keyPrefix: apiKey.substring(0, 20) + '...',
        libraries: GOOGLE_MAPS_LIBRARIES
      });

      try {
        // Validate API key format before loading
        if (!apiKey || apiKey.trim().length === 0) {
          throw new Error('Empty or invalid API key');
        }

        const cleanApiKey = apiKey.trim();
        
        // Log detailed API key validation
        console.log('🔑 API Key Validation:', {
          originalLength: apiKey.length,
          trimmedLength: cleanApiKey.length,
          startsWithAIza: cleanApiKey.startsWith('AIza'),
          hasSpaces: /\s/.test(apiKey),
          hasTabs: /\t/.test(apiKey),
          hasNewlines: /\n/.test(apiKey),
          firstChar: apiKey.charCodeAt(0),
          lastChar: apiKey.charCodeAt(apiKey.length - 1)
        });

        // Create the loader promise
        loaderPromise = import('@googlemaps/js-api-loader').then(({ Loader }) => {
          console.log('🚀 Creating Google Maps Loader with cleaned API key');
          loaderInstance = new Loader({
            apiKey: cleanApiKey, // Use cleaned API key
            version: 'weekly',
            libraries: GOOGLE_MAPS_LIBRARIES,
            language: 'en',
            region: 'US'
          });
          
          console.log('⏳ Starting Google Maps API load...');
          return loaderInstance.load();
        });

        await loaderPromise;
        setIsLoaded(true);
        console.log('✅ InnerGoogleMapsProvider: Google Maps loaded successfully');
      } catch (error) {
        console.error('❌ InnerGoogleMapsProvider: Failed to load Google Maps:', error);
        setLoadError(error);
        loaderPromise = null; // Reset on error to allow retry
      }
    };

    loadGoogleMaps();
  }, [apiKey]);

  console.log('🗺️ InnerGoogleMapsProvider loader state:', {
    isLoaded,
    hasLoadError: !!loadError,
    errorMessage: loadError?.message,
    apiKeyLength: apiKey.length,
    apiKeyValid: apiKey.startsWith('AIza')
  });

  // Log any load errors in detail
  if (loadError) {
    console.error('❌ InnerGoogleMapsProvider: Google Maps failed to load:', {
      error: loadError,
      message: loadError.message,
      stack: loadError.stack,
      apiKeyPrefix: apiKey.substring(0, 10) + '...',
      currentDomain: window.location.hostname,
      currentUrl: window.location.href,
      userAgent: navigator.userAgent
    });
  }

  // Apply compatibility patch when Google Maps is loaded
  useEffect(() => {
    if (isLoaded && !loadError) {
      console.log('🔧 InnerGoogleMapsProvider: Applying marker compatibility patch...');
      try {
        MarkerCompatibilityPatch.apply({ enableLogging: true });
      } catch (error) {
        console.error('❌ InnerGoogleMapsProvider: Failed to apply compatibility patch:', error);
      }
    }
  }, [isLoaded, loadError]);

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

  const contextValue: GlobalGoogleMapsContextType = {
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
    hasApiKey: true,
    setApiKey: setApiKeyAndReload,
    waypoints,
    isLoading,
    error,
    apiKeyLoading: false
  };

  return (
    <GlobalGoogleMapsContext.Provider value={contextValue}>
      {children}
    </GlobalGoogleMapsContext.Provider>
  );
};

export const GlobalGoogleMapsProvider: React.FC<GlobalGoogleMapsProviderProps> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyLoading, setApiKeyLoading] = useState<boolean>(true);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

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
          console.log('✅ GlobalGoogleMapsProvider: API key loaded successfully', {
            keyLength: key.length,
            keyPrefix: key.substring(0, 20) + '...'
          });
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

  const setApiKeyAndReload = React.useCallback((newApiKey: string) => {
    const trimmedKey = newApiKey.trim();
    GoogleMapsIntegrationService.setApiKey(trimmedKey);
    console.log('🔑 API key updated, page will reload to initialize Google Maps');
    window.location.reload();
  }, []);

  // If we're still loading or have an error, provide a minimal context
  if (apiKeyLoading || apiKeyError || !apiKey) {
    const contextValue: GlobalGoogleMapsContextType = {
      isLoaded: false,
      loadError: apiKeyError ? new Error(apiKeyError) : null,
      activeMarker: null,
      currentZoom: 10,
      isDragging: false,
      mapRef: { current: null },
      handleMarkerClick: () => {},
      handleMapClick: () => {},
      setCurrentZoom: () => {},
      setIsDragging: () => {},
      hasApiKey: false,
      setApiKey: setApiKeyAndReload,
      waypoints: [],
      isLoading: false,
      error: null,
      apiKeyLoading
    };

    return (
      <GlobalGoogleMapsContext.Provider value={contextValue}>
        {children}
      </GlobalGoogleMapsContext.Provider>
    );
  }

  // Once we have the API key, use the inner provider
  return (
    <InnerGoogleMapsProvider apiKey={apiKey}>
      {children}
    </InnerGoogleMapsProvider>
  );
};