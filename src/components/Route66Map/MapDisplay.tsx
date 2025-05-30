
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
  const { isLoaded, loadError, hasApiKey } = useGoogleMaps();
  const [forceRefresh, setForceRefresh] = useState(0);

  const handleApiKeySet = (newApiKey: string) => {
    localStorage.setItem('google_maps_api_key', newApiKey);
    console.log('🔑 API key saved to localStorage');
    // Force a page reload to reinitialize the Google Maps loader with the new API key
    window.location.reload();
  };

  console.log('🗺️ MapDisplay: API loading state', { 
    isLoaded, 
    hasError: !!loadError, 
    hasApiKey 
  });

  // If no API key is available, show the input form
  if (!hasApiKey) {
    return <ApiKeyInput onApiKeySet={handleApiKeySet} />;
  }

  if (loadError) {
    console.error('❌ Google Maps API failed to load:', loadError);
    // If there's an error, it might be due to invalid API key, allow user to re-enter
    return <ApiKeyInput onApiKeySet={handleApiKeySet} />;
  }

  // Show loading or error states
  const loadingState = MapLoadingStates({ loadError, isLoaded });
  if (loadingState) {
    return loadingState;
  }

  console.log('🎯 MapDisplay: Rendering GoogleMapsRoute66 with Supabase integration');

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
