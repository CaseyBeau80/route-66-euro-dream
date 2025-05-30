
import React, { useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import MapLoadingStates from './components/MapLoadingStates';
import MapContainer from './components/MapContainer';
import ApiKeyInput from './components/ApiKeyInput';

interface MapDisplayProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ selectedState, onStateClick }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    // Check for API key on component mount
    const envApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const storedApiKey = localStorage.getItem('google_maps_api_key');
    
    if (envApiKey && envApiKey !== 'demo-key') {
      setApiKey(envApiKey);
    } else if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  // Use the proper Google Maps API loader
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || 'demo-key',
  });

  // If no API key is available, show the input form
  if (!apiKey) {
    return <ApiKeyInput onApiKeySet={setApiKey} />;
  }

  console.log('🗺️ MapDisplay: API loading state', { isLoaded, hasError: !!loadError });

  if (loadError) {
    console.error('❌ Google Maps API failed to load:', loadError);
    // If there's an error, it might be due to invalid API key, allow user to re-enter
    return <ApiKeyInput onApiKeySet={setApiKey} />;
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
