
import React, { createContext, useContext } from 'react';
import { useGlobalGoogleMapsContext } from '../../providers/GlobalGoogleMapsProvider';
import { useSupabaseRoute66 } from '../hooks/useSupabaseRoute66';

interface GoogleMapsContextType {
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
}

const GoogleMapsContext = createContext<GoogleMapsContextType | null>(null);

export const useGoogleMapsContext = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMapsContext must be used within a GoogleMapsProvider');
  }
  return context;
};

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children }) => {
  // Use the global Google Maps context instead of creating our own loader
  const globalContext = useGlobalGoogleMapsContext();
  
  const { waypoints, isLoading, error } = useSupabaseRoute66();

  const contextValue: GoogleMapsContextType = {
    isLoaded: globalContext.isLoaded,
    loadError: globalContext.loadError,
    activeMarker: globalContext.activeMarker,
    currentZoom: globalContext.currentZoom,
    isDragging: globalContext.isDragging,
    mapRef: globalContext.mapRef,
    handleMarkerClick: globalContext.handleMarkerClick,
    handleMapClick: globalContext.handleMapClick,
    setCurrentZoom: globalContext.setCurrentZoom,
    setIsDragging: globalContext.setIsDragging,
    hasApiKey: globalContext.hasApiKey,
    setApiKey: globalContext.setApiKey,
    waypoints,
    isLoading,
    error
  };

  return (
    <GoogleMapsContext.Provider value={contextValue}>
      {children}
    </GoogleMapsContext.Provider>
  );
};
