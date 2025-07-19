
import React, { createContext, useContext } from 'react';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
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
  waypoints: any[];
  isLoading: boolean;
  error: any;
  hasApiKey: boolean;
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
  const {
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
    hasApiKey
  } = useGoogleMaps();

  const { waypoints, isLoading, error } = useSupabaseRoute66();

  const contextValue: GoogleMapsContextType = {
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
    waypoints,
    isLoading,
    error,
    hasApiKey
  };

  return (
    <GoogleMapsContext.Provider value={contextValue}>
      {children}
    </GoogleMapsContext.Provider>
  );
};
