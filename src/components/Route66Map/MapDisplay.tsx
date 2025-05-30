
import React from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { googleMapsApiKey } from './config/GoogleMapsConfig';
import MapLoadingStates from './components/MapLoadingStates';
import MapContainer from './components/MapContainer';

interface MapDisplayProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ selectedState, onStateClick }) => {
  // Use the proper Google Maps API loader
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey,
  });

  console.log('🗺️ MapDisplay: API loading state', { isLoaded, hasError: !!loadError });

  if (loadError) {
    console.error('❌ Google Maps API failed to load:', loadError);
  }

  // Show loading or error states
  const loadingState = MapLoadingStates({ loadError, isLoaded });
  if (loadingState) {
    return loadingState;
  }

  return (
    <MapContainer
      isLoaded={isLoaded}
    />
  );
};

export default MapDisplay;
