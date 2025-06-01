
import React from 'react';
import MapLoadError from './MapLoadError';
import MapLoadingIndicator from './MapLoading';
import { useGoogleMapsContext } from './GoogleMapsProvider';

interface MapErrorHandlerProps {
  children: React.ReactNode;
}

export const MapErrorHandler: React.FC<MapErrorHandlerProps> = ({ children }) => {
  const { isLoaded, loadError, isLoading, error } = useGoogleMapsContext();

  if (loadError) {
    console.error('❌ Google Maps API failed to load:', loadError);
    return <MapLoadError error="Failed to load Google Maps API." />;
  }

  if (!isLoaded) {
    console.log('⏳ Google Maps API still loading...');
    return <MapLoadingIndicator />;
  }

  if (isLoading) {
    console.log('⏳ Route 66 waypoints still loading...');
    return <MapLoadingIndicator />;
  }

  if (error) {
    console.error('❌ Failed to load Route 66 waypoints:', error);
    return <MapLoadError error={`Failed to load Route 66 waypoints: ${error}`} />;
  }

  return <>{children}</>;
};
