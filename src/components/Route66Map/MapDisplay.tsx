
import React, { useState, useEffect } from 'react';
import MapLoadingStates from './components/MapLoadingStates';
import GoogleMapsRoute66 from './GoogleMapsRoute66';
import ApiKeyInput from './components/ApiKeyInput';
import { useGoogleMaps } from './hooks/useGoogleMaps';

interface MapDisplayProps {
  selectedState: string | null;
  onStateClick: (stateId: string, stateName: string) => void;
  onClearSelection: () => void;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ 
  selectedState, 
  onStateClick, 
  onClearSelection 
}) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const { isLoaded, loadError, hasApiKey } = useGoogleMaps();

  useEffect(() => {
    // Check for API key on component mount
    const envApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const storedApiKey = localStorage.getItem('google_maps_api_key');
    
    console.log('🔑 Checking API keys:', { envApiKey: envApiKey ? 'found' : 'not found', storedApiKey: storedApiKey ? 'found' : 'not found' });
    
    if (envApiKey && envApiKey !== 'demo-key') {
      console.log('🔑 Using environment API key');
      setApiKey(envApiKey);
    } else if (storedApiKey) {
      console.log('🔑 Using stored API key');
      setApiKey(storedApiKey);
    } else {
      console.log('🔑 No valid API key found');
    }
  }, []);

  // If no API key is available, show the input form
  if (!hasApiKey) {
    return <ApiKeyInput onApiKeySet={setApiKey} />;
  }

  console.log('🗺️ MapDisplay: API loading state', { isLoaded, hasError: !!loadError, apiKey: apiKey ? 'present' : 'missing' });

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

  console.log('🎯 MapDisplay: Rendering GoogleMapsRoute66 with SimpleRoute66Service');

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <GoogleMapsRoute66
        selectedState={selectedState}
        onStateClick={onStateClick}
        onClearSelection={onClearSelection}
      />
    </div>
  );
};

export default MapDisplay;
