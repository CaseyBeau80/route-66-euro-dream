
import React, { useState } from 'react';
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

  const handleApiKeySet = (newApiKey: string) => {
    if (newApiKey && newApiKey.trim() !== '') {
      localStorage.setItem('google_maps_api_key', newApiKey.trim());
      console.log('🔑 API key saved to localStorage');
      // Force a page reload to reinitialize the Google Maps loader with the new API key
      window.location.reload();
    }
  };

  console.log('🗺️ MapDisplay: API loading state', { 
    isLoaded, 
    hasError: !!loadError, 
    hasApiKey,
    errorMessage: loadError?.message 
  });

  // If no API key is available, show the input form
  if (!hasApiKey) {
    console.log('🔑 No API key available, showing input form');
    return (
      <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
        <ApiKeyInput onApiKeySet={handleApiKeySet} />
      </div>
    );
  }

  // If there's a loading error (like invalid API key), show the input form to re-enter key
  if (loadError) {
    console.error('❌ Google Maps API failed to load:', loadError);
    return (
      <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
        <ApiKeyInput 
          onApiKeySet={handleApiKeySet} 
          error="Failed to load Google Maps. Please check your API key and try again."
        />
      </div>
    );
  }

  // Show loading state while Google Maps API is loading
  if (!isLoaded) {
    return (
      <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
        <MapLoadingStates loadError={undefined} isLoaded={false} />
      </div>
    );
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
