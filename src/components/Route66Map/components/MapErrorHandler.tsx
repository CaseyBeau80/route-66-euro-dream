
import React from 'react';
import MapLoadError from './MapLoadError';
import MapLoadingIndicator from './MapLoading';
import { useGoogleMapsContext } from './GoogleMapsProvider';

interface MapErrorHandlerProps {
  children: React.ReactNode;
}

export const MapErrorHandler: React.FC<MapErrorHandlerProps> = ({ children }) => {
  const { isLoading, error } = useGoogleMapsContext();

  console.log('🔍 MapErrorHandler state check:', { 
    isLoading, 
    hasError: !!error,
    errorMessage: error 
  });

  // Only handle data loading errors, not Google Maps API loading
  // Google Maps API loading is handled by MapDisplay
  if (isLoading) {
    console.log('⏳ Route 66 waypoints still loading...');
    return <MapLoadingIndicator />;
  }

  if (error) {
    console.error('❌ Failed to load Route 66 waypoints:', error);
    return <MapLoadError error={`Failed to load Route 66 waypoints: ${error}`} />;
  }

  console.log('✅ MapErrorHandler: All checks passed, rendering children');
  return <>{children}</>;
};
